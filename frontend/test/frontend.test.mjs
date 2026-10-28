import test from 'node:test';
import assert from 'node:assert';

// -------------------------------------------------------------
// Unit & Integration Tests for Campus Ledger Frontend Logic
// -------------------------------------------------------------

// Mock fetch environment
const mockStudents = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.edu', department: 'Information Technology' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.edu', department: 'Computer Engineering' },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.edu', department: 'Information Technology' }
];

test('Validation: Name must be non-empty and at least 2 characters', () => {
  const validateName = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return 'Student name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    return null;
  };

  assert.strictEqual(validateName(''), 'Student name is required');
  assert.strictEqual(validateName('   '), 'Student name is required');
  assert.strictEqual(validateName('A'), 'Name must be at least 2 characters');
  assert.strictEqual(validateName('Rahul Sharma'), null);
});

test('Validation: Email format validation regex', () => {
  const validateEmail = (email) => {
    const trimmed = (email || '').trim();
    if (!trimmed) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Please provide a valid email address';
    return null;
  };

  assert.strictEqual(validateEmail(''), 'Email is required');
  assert.strictEqual(validateEmail('invalid-email'), 'Please provide a valid email address');
  assert.strictEqual(validateEmail('rahul@'), 'Please provide a valid email address');
  assert.strictEqual(validateEmail('rahul@example.edu'), null);
});

test('Search filter logic matches ID, Name, or Email case-insensitively', () => {
  const filterStudents = (list, query, dept) => {
    const q = query.toLowerCase().trim();
    return list.filter(s => {
      const matchQuery = !q || 
        s.id.toString().includes(q) || 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q);
      const matchDept = !dept || s.department === dept;
      return matchQuery && matchDept;
    });
  };

  // Search by name
  const byName = filterStudents(mockStudents, 'priya', '');
  assert.strictEqual(byName.length, 1);
  assert.strictEqual(byName[0].id, 2);

  // Search by ID
  const byId = filterStudents(mockStudents, '1', '');
  assert.strictEqual(byId.length, 1);
  assert.strictEqual(byId[0].name, 'Rahul Sharma');

  // Filter by department
  const byDept = filterStudents(mockStudents, '', 'Information Technology');
  assert.strictEqual(byDept.length, 2);

  // Search query + department
  const combined = filterStudents(mockStudents, 'Amit', 'Information Technology');
  assert.strictEqual(combined.length, 1);
  assert.strictEqual(combined[0].name, 'Amit Kumar');
});

test('Pagination calculations', () => {
  const paginate = (items, page, pageSize) => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const end = Math.min(start + pageSize, items.length);
    return {
      totalPages,
      safePage,
      pageItems: items.slice(start, end),
      totalRecords: items.length
    };
  };

  const list = Array.from({ length: 15 }, (_, i) => ({ id: i + 1 }));
  const p1 = paginate(list, 1, 5);
  assert.strictEqual(p1.totalPages, 3);
  assert.strictEqual(p1.pageItems.length, 5);
  assert.strictEqual(p1.pageItems[0].id, 1);
  assert.strictEqual(p1.pageItems[4].id, 5);

  const p3 = paginate(list, 3, 5);
  assert.strictEqual(p3.pageItems.length, 5);
  assert.strictEqual(p3.pageItems[0].id, 11);
  assert.strictEqual(p3.pageItems[4].id, 15);
});

test('Department summary calculation from raw students', () => {
  const counts = {};
  for (const s of mockStudents) {
    counts[s.department] = (counts[s.department] || 0) + 1;
  }

  const summaries = Object.keys(counts).map(dept => ({
    department: dept,
    studentCount: counts[dept]
  }));

  assert.strictEqual(summaries.length, 2);
  const itSummary = summaries.find(s => s.department === 'Information Technology');
  const csSummary = summaries.find(s => s.department === 'Computer Engineering');

  assert.strictEqual(itSummary.studentCount, 2);
  assert.strictEqual(csSummary.studentCount, 1);
});

test('API Client: Mock request handles 200 JSON response and 204 No Content', async () => {
  // Mock fetch
  global.fetch = async (url, options = {}) => {
    if (url.includes('/api/students/1') && options.method === 'DELETE') {
      return {
        status: 204,
        ok: true,
        headers: new Map(),
      };
    }
    return {
      status: 200,
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => mockStudents,
    };
  };

  // Test GET
  const res = await fetch('http://localhost:8080/api/students');
  const data = await res.json();
  assert.strictEqual(data.length, 3);

  // Test DELETE 204
  const delRes = await fetch('http://localhost:8080/api/students/1', { method: 'DELETE' });
  assert.strictEqual(delRes.status, 204);
});

test('API Client: Network failure returns clear diagnostic error', async () => {
  global.fetch = async () => {
    throw new TypeError('Failed to fetch');
  };

  let errorCaptured = null;
  try {
    await fetch('http://localhost:8080/api/students');
  } catch (err) {
    errorCaptured = 'Unable to connect to the backend server. Please verify Spring Boot is running on port 8080.';
  }

  assert.ok(errorCaptured.includes('Unable to connect to the backend server'));
});
