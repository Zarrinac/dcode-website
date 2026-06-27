#!/usr/bin/env node
// Server-side deploy preflight for dcode.co.ir.
// Validates production identity without printing secret values.
//
// D'code is a STANDALONE site: it has its own dedicated Postgres DB (local on the
// app host), no NEXT_PUBLIC_SITE_ID multi-tenant flag, and no admin auth — so this
// is a slimmer check than the zarrinac preflight it was ported from.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';

const APP_DIR = process.env.DCODE_APP_DIR || process.cwd();
const ENV_FILE = process.env.DCODE_ENV_FILE || path.join(APP_DIR, '.env');
// Local dedicated DB on the app host. Allow an override for a future move.
const ALLOWED_DB_HOSTS = new Set(
  (process.env.DCODE_DB_HOSTS || 'localhost,127.0.0.1').split(',').map((h) => h.trim()),
);
const ALLOWED_SSL_MODES = new Set(['require', 'verify-full', 'no-verify', 'disable', 'prefer']);
const EXPECTED_DB_NAME = 'dcode';
const EXPECTED_SITE_URL = 'https://dcode.co.ir';

const errors = [];
const warnings = [];

function parseEnvFile(filePath) {
  const env = {};
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let value = match[2].trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }

  return env;
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function checkFile(label, filePath) {
  if (!existsSync(filePath)) addError(`${label} missing: ${filePath}`);
}

function parseDatabaseUrl(value) {
  try {
    return new URL(value);
  } catch {
    addError('DATABASE_URL is not a valid URL');
    return null;
  }
}

function checkTcp(host, port, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (ok) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

console.log(`Preflight app dir: ${APP_DIR}`);

checkFile('.env', ENV_FILE);
checkFile('ecosystem.config.cjs', path.join(APP_DIR, 'ecosystem.config.cjs'));
checkFile('package.json', path.join(APP_DIR, 'package.json'));
checkFile('ops/deploy.sh', path.join(APP_DIR, 'ops', 'deploy.sh'));

let env = {};
if (existsSync(ENV_FILE)) {
  env = parseEnvFile(ENV_FILE);
}

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  // D'code can run on the static fallback without a DB, but production serves the
  // DB-backed catalog + service-centers — so a missing URL is an error on the server.
  addError('DATABASE_URL is missing (production serves the DB-backed catalog/service-centers)');
} else {
  const parsed = parseDatabaseUrl(databaseUrl);
  if (parsed) {
    const dbName = parsed.pathname.replace(/^\//, '');
    const sslMode = parsed.searchParams.get('sslmode');

    if (!ALLOWED_DB_HOSTS.has(parsed.hostname)) {
      addError(
        `DATABASE_URL host must be one of ${[...ALLOWED_DB_HOSTS].join('/')}, got ${parsed.hostname}`,
      );
    }
    if (dbName !== EXPECTED_DB_NAME) {
      addError(`DATABASE_URL database must be ${EXPECTED_DB_NAME}, got ${dbName || '(empty)'}`);
    }
    if (sslMode && !ALLOWED_SSL_MODES.has(sslMode)) {
      addWarning(
        `DATABASE_URL sslmode is ${sslMode}; expected one of ${[...ALLOWED_SSL_MODES].join('/')}`,
      );
    }

    const port = Number(parsed.port || 5432);
    const dbReachable = await checkTcp(parsed.hostname, port);
    if (!dbReachable) {
      addError(`Cannot open TCP connection to PostgreSQL at ${parsed.hostname}:${port}`);
    }
  }
}

const siteUrl = (env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(
  /\/+$/,
  '',
);
if (siteUrl !== EXPECTED_SITE_URL) {
  addError(`NEXT_PUBLIC_SITE_URL must be ${EXPECTED_SITE_URL}, got ${siteUrl || '(missing)'}`);
}

try {
  const branch = execFileSync('git', ['branch', '--show-current'], {
    cwd: APP_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
  if (branch && branch !== 'main')
    addWarning(`current git branch is ${branch}, expected main on server`);
} catch {
  addWarning('could not read git branch');
}

for (const warning of warnings) console.log(`WARN: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log("Preflight OK: D'code app identity and local DB target are valid.");
