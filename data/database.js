const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_DB_PATH = path.join(__dirname, 'hayday-chat.db');
const configuredPath = process.env.DATABASE_PATH || DEFAULT_DB_PATH;
const resolvedPath = path.resolve(configuredPath);
const dataDirectory = path.extname(resolvedPath) ? path.dirname(resolvedPath) : resolvedPath;
const filePrefix = path.extname(resolvedPath)
  ? path.basename(resolvedPath, path.extname(resolvedPath))
  : 'hayday-chat';

const files = {
  messages: path.join(dataDirectory, `${filePrefix}-messages.jsonl`),
  analytics: path.join(dataDirectory, `${filePrefix}-analytics.json`),
  sessions: path.join(dataDirectory, `${filePrefix}-sessions.json`)
};

const locks = new Map();
let initialized = false;

async function ensureInitialized() {
  if (initialized) {
    return;
  }

  if (!fsSync.existsSync(dataDirectory)) {
    fsSync.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fsSync.existsSync(files.messages)) {
    fsSync.writeFileSync(files.messages, '', 'utf8');
  }

  if (!fsSync.existsSync(files.analytics)) {
    fsSync.writeFileSync(files.analytics, JSON.stringify({}, null, 2), 'utf8');
  }

  if (!fsSync.existsSync(files.sessions)) {
    fsSync.writeFileSync(files.sessions, JSON.stringify({}, null, 2), 'utf8');
  }

  initialized = true;
}

async function withLock(resource, fn) {
  await ensureInitialized();
  const previous = locks.get(resource) || Promise.resolve();
  let release;
  const current = new Promise(resolve => {
    release = resolve;
  });
  locks.set(resource, previous.then(() => current));
  await previous;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(resource) === current) {
      locks.delete(resource);
    }
  }
}

async function readJsonUnlocked(filePath, defaultValue) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    if (!raw) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    throw error;
  }
}

async function writeJsonUnlocked(filePath, data) {
  const tmpPath = `${filePath}.tmp-${Date.now()}`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmpPath, filePath);
}

async function readAllMessagesUnlocked() {
  try {
    const raw = await fs.readFile(files.messages, 'utf8');
    if (!raw.trim()) {
      return [];
    }
    return raw
      .split('\n')
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(files.messages, '', 'utf8');
      return [];
    }
    throw error;
  }
}

async function writeAllMessagesUnlocked(messages) {
  const raw = messages.map(msg => JSON.stringify(msg)).join('\n');
  await fs.writeFile(files.messages, raw ? `${raw}\n` : '', 'utf8');
}

async function addMessage(message) {
  const record = {
    id: crypto.randomUUID(),
    ...message
  };
  await withLock(files.messages, async () => {
    await fs.appendFile(files.messages, `${JSON.stringify(record)}\n`, 'utf8');
  });
  return record;
}

async function getMessagesByClient(clientId) {
  return withLock(files.messages, async () => {
    const messages = await readAllMessagesUnlocked();
    return messages
      .filter(msg => msg.clientId === clientId)
      .sort((a, b) => a.timestamp - b.timestamp);
  });
}

async function getMessagesAfter(clientId, afterTimestamp) {
  return withLock(files.messages, async () => {
    const messages = await readAllMessagesUnlocked();
    return messages
      .filter(msg => msg.clientId === clientId && msg.timestamp > afterTimestamp)
      .sort((a, b) => a.timestamp - b.timestamp);
  });
}

async function incrementAnalytics(date, role) {
  await withLock(files.analytics, async () => {
    const analytics = await readJsonUnlocked(files.analytics, {});
    const entry = analytics[date] || { total: 0, chatbot: 0, ai: 0, admin: 0 };
    entry.total += 1;
    if (role === 'chatbot') entry.chatbot += 1;
    if (role === 'ai') entry.ai += 1;
    if (role === 'admin') entry.admin += 1;
    analytics[date] = entry;
    await writeJsonUnlocked(files.analytics, analytics);
  });
}

async function getAnalyticsForDate(date) {
  return withLock(files.analytics, async () => {
    const analytics = await readJsonUnlocked(files.analytics, {});
    return analytics[date] || { date, total: 0, chatbot: 0, ai: 0, admin: 0 };
  });
}

async function getTotalMessagesCount() {
  return withLock(files.messages, async () => {
    const messages = await readAllMessagesUnlocked();
    return messages.length;
  });
}

async function getActiveConversations(sinceTimestamp) {
  return withLock(files.messages, async () => {
    const messages = await readAllMessagesUnlocked();
    const grouped = new Map();

    for (const message of messages) {
      if (message.timestamp <= sinceTimestamp) continue;
      if (!grouped.has(message.clientId)) {
        grouped.set(message.clientId, []);
      }
      grouped.get(message.clientId).push(message);
    }

    const result = [];
    for (const [clientId, clientMessages] of grouped.entries()) {
      clientMessages.sort((a, b) => a.timestamp - b.timestamp);
      const lastMessage = clientMessages[clientMessages.length - 1];
      result.push({
        clientId,
        lastActivity: lastMessage.timestamp,
        messageCount: clientMessages.length,
        lastMessage
      });
    }

    return result.sort((a, b) => b.lastActivity - a.lastActivity);
  });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createAdminSession(telegramId, ttlMs = 24 * 60 * 60 * 1000) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const now = Date.now();
  const expiresAt = now + ttlMs;

  await withLock(files.sessions, async () => {
    const sessions = await readJsonUnlocked(files.sessions, {});
    sessions[tokenHash] = {
      telegramId,
      createdAt: now,
      expiresAt,
      lastActivity: now
    };
    await writeJsonUnlocked(files.sessions, sessions);
  });

  return { token, expiresAt };
}

async function getAdminSession(token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  return withLock(files.sessions, async () => {
    const sessions = await readJsonUnlocked(files.sessions, {});
    const session = sessions[tokenHash];
    if (!session) {
      return null;
    }
    if (session.expiresAt < Date.now()) {
      delete sessions[tokenHash];
      await writeJsonUnlocked(files.sessions, sessions);
      return null;
    }

    session.lastActivity = Date.now();
    sessions[tokenHash] = session;
    await writeJsonUnlocked(files.sessions, sessions);
    return {
      tokenHash,
      telegramId: session.telegramId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: session.lastActivity
    };
  });
}

async function clearSessions() {
  await withLock(files.sessions, async () => {
    await writeJsonUnlocked(files.sessions, {});
  });
}

async function clearMessages() {
  await withLock(files.messages, async () => {
    await writeAllMessagesUnlocked([]);
  });
}

async function clearAnalytics() {
  await withLock(files.analytics, async () => {
    await writeJsonUnlocked(files.analytics, {});
  });
}

async function resetAll() {
  await clearSessions();
  await clearMessages();
  await clearAnalytics();
}

async function getWeeklyTotal(startDate, endDate) {
  return withLock(files.analytics, async () => {
    const analytics = await readJsonUnlocked(files.analytics, {});
    const dates = Object.keys(analytics).filter(date => date >= startDate && date <= endDate);
    return dates.reduce((sum, date) => sum + (analytics[date]?.total || 0), 0);
  });
}

module.exports = {
  addMessage,
  getMessagesByClient,
  getMessagesAfter,
  incrementAnalytics,
  getAnalyticsForDate,
  getTotalMessagesCount,
  getActiveConversations,
  createAdminSession,
  getAdminSession,
  clearSessions,
  clearMessages,
  clearAnalytics,
  resetAll,
  getWeeklyTotal
};
