import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.ts';

function makeD1() {
  const stmt = {
    bind() { return stmt; },
    async run() { return { success: true, meta: { last_row_id: 1 } }; },
    async all() { return { results: [] }; },
    async first() { return null; },
  };
  return { prepare() { return stmt; } };
}

function makeEnv(overrides = {}) {
  return {
    DB: makeD1(),
    VM_CACHE: { get: async () => null, put: async () => {} },
    ENGINE_RUNTIME: { fetch: async () => new Response(JSON.stringify({ response: 'ok' })) },
    SHARED_BRAIN: { fetch: async () => new Response('ok') },
    EMAIL_SENDER: { fetch: async () => new Response('ok') },
    ECHO_API_KEY: 'test-echo-vendor-manager-key-7c2b',
    ...overrides,
  };
}

test('GET / and /health need no auth (unchanged public contract)', async () => {
  const env = makeEnv();
  for (const p of ['/', '/health']) {
    const res = await worker.fetch(new Request('https://x' + p), env);
    assert.notEqual(res.status, 401);
  }
});

test('a write (POST) with NO key is rejected', async () => {
  const env = makeEnv();
  const res = await worker.fetch(new Request('https://x/vendors', {
    method: 'POST',
    body: JSON.stringify({ name: 'Acme' }),
    headers: { 'Content-Type': 'application/json' },
  }), env);
  assert.equal(res.status, 401);
});

test('a write (POST) with the WRONG key is rejected', async () => {
  const env = makeEnv();
  const res = await worker.fetch(new Request('https://x/vendors', {
    method: 'POST',
    body: JSON.stringify({ name: 'Acme' }),
    headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'wrong-key' },
  }), env);
  assert.equal(res.status, 401);
});

test('a write (POST) with the CORRECT key is accepted', async () => {
  const env = makeEnv();
  const res = await worker.fetch(new Request('https://x/vendors', {
    method: 'POST',
    body: JSON.stringify({ name: 'Acme', org_id: 1 }),
    headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': 'test-echo-vendor-manager-key-7c2b' },
  }), env);
  assert.notEqual(res.status, 401);
});

test('a write (PUT/DELETE) also requires auth (not just POST)', async () => {
  const env = makeEnv();
  const putRes = await worker.fetch(new Request('https://x/vendors/1', {
    method: 'PUT',
    body: JSON.stringify({ name: 'X' }),
    headers: { 'Content-Type': 'application/json' },
  }), env);
  assert.equal(putRes.status, 401);
  const delRes = await worker.fetch(new Request('https://x/vendors/1', { method: 'DELETE' }), env);
  assert.equal(delRes.status, 401);
});

test('key-length side-channel: a same-length wrong key and a different-length wrong key both fail identically', async () => {
  const env = makeEnv();
  for (const key of ['test-echo-vendor-manager-key-XXXX', 'x']) {
    const res = await worker.fetch(new Request('https://x/vendors', {
      method: 'POST',
      body: '{}',
      headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': key },
    }), env);
    assert.equal(res.status, 401);
  }
});
