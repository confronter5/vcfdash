const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ====== Vercel KV for TRUE persistence ======
let kv;
try {
  kv = require('@vercel/kv');
} catch (e) {
  console.log('@vercel/kv not installed, using file fallback');
}

// ====== Data Keys ======
const MEMBERS_KEY = 'ctw_members';
const TARGET_KEY = 'ctw_target';
const ENDDATE_KEY = 'ctw_endDate';
const VCF_ENABLED_KEY = 'ctw_vcfEnabled';
const VCF_NAME_KEY = 'ctw_vcfName';
const VCF_DATA_KEY = 'ctw_vcfData';

// ====== Fallback File Storage ======
const DATA_FILE = path.join(__dirname, 'data.json');

function loadFileData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return {
    members: [],
    target: 500,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    vcfEnabled: false,
    vcfName: null,
    vcfData: null
  };
}

function saveFileData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {}
}

// ====== KV Helper Functions ======
async function getData() {
  if (kv) {
    try {
      const members = await kv.get(MEMBERS_KEY) || [];
      const target = await kv.get(TARGET_KEY) || 500;
      const endDate = await kv.get(ENDDATE_KEY) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const vcfEnabled = await kv.get(VCF_ENABLED_KEY) || false;
      const vcfName = await kv.get(VCF_NAME_KEY) || null;
      const vcfData = await kv.get(VCF_DATA_KEY) || null;
      return { members, target, endDate, vcfEnabled, vcfName, vcfData };
    } catch (e) {
      console.error('KV error, using file fallback:', e.message);
    }
  }
  return loadFileData();
}

async function setMembers(members) {
  if (kv) {
    try { await kv.set(MEMBERS_KEY, members); return; }
    catch (e) { console.error('KV set error:', e.message); }
  }
  const data = loadFileData();
  data.members = members;
  saveFileData(data);
}

async function setTarget(target) {
  if (kv) {
    try { await kv.set(TARGET_KEY, target); return; }
    catch (e) {}
  }
  const data = loadFileData();
  data.target = target;
  saveFileData(data);
}

async function setEndDate(endDate) {
  if (kv) {
    try { await kv.set(ENDDATE_KEY, endDate); return; }
    catch (e) {}
  }
  const data = loadFileData();
  data.endDate = endDate;
  saveFileData(data);
}

async function setVcf(enabled, name, data) {
  if (kv) {
    try {
      await kv.set(VCF_ENABLED_KEY, enabled);
      await kv.set(VCF_NAME_KEY, name);
      await kv.set(VCF_DATA_KEY, data);
      return;
    } catch (e) {}
  }
  const d = loadFileData();
  d.vcfEnabled = enabled;
  d.vcfName = name;
  d.vcfData = data;
  saveFileData(d);
}

// ====== MIME Types ======
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.vcf': 'text/vcard',
  '.csv': 'text/csv',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try { callback(JSON.parse(body)); }
    catch { callback({}); }
  });
}

// ====== Request Handler ======
async function handleRequest(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const data = await getData();

  // GET /api/members
  if (pathname === '/api/members' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.members));
    return;
  }

  // POST /api/members
  if (pathname === '/api/members' && req.method === 'POST') {
    parseBody(req, async (body) => {
      const member = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: body.name || '',
        email: body.email || '',
        phone: body.phone || '',
        country: body.country || '',
        status: 'verified',
        date: new Date().toISOString(),
        notes: ''
      };
      data.members.push(member);
      await setMembers(data.members);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(member));
    });
    return;
  }

  // PUT /api/members/:id
  if (pathname.startsWith('/api/members/') && req.method === 'PUT' && !pathname.includes('/bulk')) {
    const id = pathname.split('/')[3];
    parseBody(req, async (body) => {
      const member = data.members.find(m => m.id === id);
      if (member) {
        if (body.status) member.status = body.status;
        if (body.notes !== undefined) member.notes = body.notes;
        await setMembers(data.members);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(member));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Member not found' }));
      }
    });
    return;
  }

  // PUT /api/members/bulk
  if (pathname === '/api/members/bulk' && req.method === 'PUT') {
    parseBody(req, async (body) => {
      const ids = body.ids || [];
      ids.forEach(id => {
        const m = data.members.find(x => x.id === id);
        if (m && body.status) m.status = body.status;
      });
      await setMembers(data.members);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ updated: ids.length }));
    });
    return;
  }

  // DELETE /api/members/:id
  if (pathname.startsWith('/api/members/') && req.method === 'DELETE') {
    const id = pathname.split('/')[3];
    parseBody(req, async (body) => {
      if (body.password === 'confronter1') {
        const idx = data.members.findIndex(m => m.id === id);
        if (idx !== -1) {
          data.members.splice(idx, 1);
          await setMembers(data.members);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Member not found' }));
        }
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
      }
    });
    return;
  }

  // GET /api/stats
  if (pathname === '/api/stats' && req.method === 'GET') {
    const verified = data.members.filter(m => m.status === 'verified').length;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: data.members.length,
      verified: verified,
      target: data.target,
      remaining: Math.max(0, data.target - verified),
      endDate: data.endDate
    }));
    return;
  }

  // PUT /api/stats
  if (pathname === '/api/stats' && req.method === 'PUT') {
    parseBody(req, async (body) => {
      if (body.target !== undefined) {
        data.target = parseInt(body.target) || 500;
        await setTarget(data.target);
      }
      if (body.endDate) {
        data.endDate = body.endDate;
        await setEndDate(data.endDate);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // DELETE /api/members - Reset all
  if (pathname === '/api/members' && req.method === 'DELETE') {
    parseBody(req, async (body) => {
      if (body.password === 'confronter1') {
        await setMembers([]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
      }
    });
    return;
  }

  // GET /api/vcf
  if (pathname === '/api/vcf' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      enabled: data.vcfEnabled,
      name: data.vcfName,
      data: data.vcfData
    }));
    return;
  }

  // PUT /api/vcf
  if (pathname === '/api/vcf' && req.method === 'PUT') {
    parseBody(req, async (body) => {
      const enabled = body.enabled !== undefined ? body.enabled : data.vcfEnabled;
      const name = body.name !== undefined ? body.name : data.vcfName;
      const vcfData = body.data !== undefined ? body.data : data.vcfData;
      await setVcf(enabled, name, vcfData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // DELETE /api/vcf
  if (pathname === '/api/vcf' && req.method === 'DELETE') {
    parseBody(req, async (body) => {
      if (body.password === 'confronter1') {
        await setVcf(false, null, null);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
      }
    });
    return;
  }

  // Static files
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
      res.end(err.code === 'ENOENT' ? 'File not found' : 'Server error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Local server
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  handleRequest(req, res).catch(err => {
    console.error(err);
    res.writeHead(500);
    res.end('Internal error');
  });
}).listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Admin password: confronter1`);
  console.log(`🎯 Default target: 500 members`);
  console.log(kv ? '✅ Using Vercel KV (persistent)' : '⚠️ Using file fallback (local dev)');
});
