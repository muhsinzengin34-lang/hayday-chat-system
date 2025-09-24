process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.DATABASE_PATH = './runtime-data/test-store.db';

const { before, beforeEach, after, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs/promises');
const path = require('path');

const dataStore = require('../data/database');
const { startServer, stopServer } = require('../server');

let server;
let baseUrl;

before(async () => {
  server = startServer();
  await new Promise(resolve => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

beforeEach(async () => {
  await dataStore.resetAll();
});

after(async () => {
  await stopServer();
  const resolved = path.resolve(process.env.DATABASE_PATH || './runtime-data/test-store.db');
  const dir = path.extname(resolved) ? path.dirname(resolved) : resolved;
  await fs.rm(dir, { recursive: true, force: true });
});

test('stores user and bot messages when chat endpoint is used', async () => {
  const response = await fetch(`${baseUrl}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: 'test-user', message: 'Merhaba' })
  });

  assert.strictEqual(response.status, 200);
  const payload = await response.json();
  assert.ok(payload.reply);
  assert.ok(payload.role);

  const history = await dataStore.getMessagesByClient('test-user');
  assert.strictEqual(history.length, 2);
  assert.strictEqual(history[0].role, 'user');
});

test('returns chat history for a client', async () => {
  await fetch(`${baseUrl}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: 'history-user', message: 'Merhaba bot' })
  });

  const response = await fetch(`${baseUrl}/api/chat/history/history-user`);
  assert.strictEqual(response.status, 200);
  const payload = await response.json();
  assert.strictEqual(payload.history.length, 2);
});

test('protects admin dashboard and returns stats for valid session', async () => {
  await fetch(`${baseUrl}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: 'admin-user', message: 'Merhaba' })
  });

  const unauthorized = await fetch(`${baseUrl}/api/admin/dashboard`);
  assert.strictEqual(unauthorized.status, 401);

  const session = await dataStore.createAdminSession('999');

  const dashboard = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${session.token}` }
  });

  assert.strictEqual(dashboard.status, 200);
  const payload = await dashboard.json();
  assert.strictEqual(payload.stats.today.total, 1);
  assert.ok(Array.isArray(payload.activeChats));
});
