/* ============================================================
   King David Academy Portal — Main JavaScript
   ============================================================ */

'use strict';

// ── Data Store (localStorage simulation) ──────────────────
const DB = {
  users: [
    { id:1, name:'Liam Nkosi', email:'student@kda.ac.za', password:'student123', role:'student', class:'Grade 11A', studentId:'KDA-2024-001', avatar:'LN' },
    { id:2, name:'Grace Mokoena', email:'parent@kda.ac.za', password:'parent123', role:'parent', childName:'Liam Nkosi', childId:'KDA-2024-001', avatar:'GM' },
    { id:3, name:'Mr. James Dlamini', email:'teacher@kda.ac.za', password:'teacher123', role:'teacher', subject:'Mathematics', avatar:'JD' },
    { id:4, name:'Dr. Sarah Khumalo', email:'admin@kda.ac.za', password:'admin123', role:'admin', title:'Principal', avatar:'SK' },
  ],
  results: [
    { subject:'Mathematics', term:'Term 2, 2025', score:78, total:100, grade:'B', teacher:'Mr. Dlamini' },
    { subject:'English Language', term:'Term 2, 2025', score:85, total:100, grade:'A', teacher:'Ms. Osei' },
    { subject:'Physical Sciences', term:'Term 2, 2025', score:62, total:100, grade:'C', teacher:'Mr. Botha' },
    { subject:'Life Sciences', term:'Term 2, 2025', score:91, total:100, grade:'A', teacher:'Dr. Naidoo' },
    { subject:'History', term:'Term 2, 2025', score:74, total:100, grade:'B', teacher:'Mr. Zulu' },
    { subject:'Geography', term:'Term 2, 2025', score:55, total:100, grade:'D', teacher:'Ms. Petersen' },
    { subject:'Accounting', term:'Term 2, 2025', score:88, total:100, grade:'A', teacher:'Ms. van der Merwe' },
  ],
  students: [
    { id:'KDA-2024-001', name:'Liam Nkosi', class:'11A', attendance:'94%', gpa:3.4, status:'Active' },
    { id:'KDA-2024-002', name:'Amara Diallo', class:'11A', attendance:'98%', gpa:3.8, status:'Active' },
    { id:'KDA-2024-003', name:'Ethan Sithole', class:'11B', attendance:'87%', gpa:2.9, status:'Active' },
    { id:'KDA-2024-004', name:'Zara Mahlangu', class:'10A', attendance:'92%', gpa:3.6, status:'Active' },
    { id:'KDA-2024-005', name:'Kwame Asante', class:'10B', attendance:'79%', gpa:2.5, status:'At Risk' },
    { id:'KDA-2024-006', name:'Priya Naidoo', class:'12A', attendance:'99%', gpa:4.0, status:'Active' },
    { id:'KDA-2024-007', name:'Marco Ferreira', class:'12A', attendance:'91%', gpa:3.2, status:'Active' },
    { id:'KDA-2024-008', name:'Tsidi Molefe', class:'10A', attendance:'85%', gpa:3.0, status:'Active' },
  ],
  announcements: [
    { id:1, title:'Term 3 Examinations Begin', body:'All Grade 10–12 examinations commence on 14 July. Please review the exam timetable on the notice board.', date:'2025-06-28', category:'Exams', author:'Admin', priority:'high' },
    { id:2, title:'School Closure – Public Holiday', body:'King David Academy will be closed on 09 August in observance of National Women\'s Day.', date:'2025-08-02', category:'General', author:'Admin', priority:'medium' },
    { id:3, title:'Parent–Teacher Conferences', body:'Scheduled for 22–23 August. Booking links have been emailed to all registered parents.', date:'2025-08-05', category:'Events', author:'Admin', priority:'medium' },
    { id:4, title:'New Library Resources Available', body:'We have added over 200 new titles across Science, Mathematics, and Literature. Visit the library to explore.', date:'2025-08-08', category:'Academic', author:'Library', priority:'low' },
  ],
  fees: [
    { term:'Term 1', due:'28 Feb 2025', amount:'R 4,200', paid:true },
    { term:'Term 2', due:'31 May 2025', amount:'R 4,200', paid:true },
    { term:'Term 3', due:'31 Aug 2025', amount:'R 4,200', paid:false },
    { term:'Term 4', due:'30 Nov 2025', amount:'R 4,200', paid:false },
  ]
};

// ── Session State ──────────────────────────────────────────
let currentUser = null;
try { currentUser = JSON.parse(localStorage.getItem('kda_user')); } catch(e){}

// ── Utility Functions ──────────────────────────────────────
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function showToast(title, msg = '', type = 'info') {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const container = document.getElementById('toastContainer') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||icons.info}</span>
    <div class="toast-msg"><strong>${title}</strong>${msg ? `<p>${msg}</p>` : ''}</div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toastContainer'; el.className = 'toast-container';
  document.body.appendChild(el); return el;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-ZA', { day:'numeric', month:'short', year:'numeric' });
}

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validateRequired(v) { return v.trim().length > 0; }
function getGradeClass(g) {
  if(g === 'A') return 'grade-A'; if(g === 'B') return 'grade-B';
  if(g === 'C') return 'grade-C'; return 'grade-D';
}

// ── Loading Screen ─────────────────────────────────────────
function hideLoader() {
  const loader = document.getElementById('pageLoader');
  if(loader) { loader.classList.add('fade-out'); setTimeout(() => loader.remove(), 500); }
}
window.addEventListener('load', () => setTimeout(hideLoader, 800));

// ── Theme Toggle ───────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('kda_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  $$('.theme-toggle').forEach(btn => {
    btn.textContent = saved === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('kda_theme', next);
      $$('.theme-toggle').forEach(b => b.textContent = next === 'dark' ? '☀️' : '🌙');
    });
  });
}

// ── Hamburger Menu ─────────────────────────────────────────
function initMobileMenu() {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if(!ham || !menu) return;
  ham.addEventListener('click', () => { menu.classList.toggle('open'); });
  document.addEventListener('click', e => { if(!ham.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('open'); });
}

// ── Sidebar Toggle (Dashboard) ─────────────────────────────
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if(!toggle) return;
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if(overlay) overlay.classList.toggle('open');
  });
  if(overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
}

// ── Notification Dropdown ──────────────────────────────────
function initNotifications() {
  const btn = document.getElementById('notifBtn');
  const dropdown = document.getElementById('notifDropdown');
  if(!btn || !dropdown) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));
}

// ── Live Clock ─────────────────────────────────────────────
function initClock() {
  const el = document.getElementById('liveClock');
  if(!el) return;
  function update() {
    const now = new Date();
    el.textContent = now.toLocaleString('en-ZA', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
  }
  update(); setInterval(update, 60000);
}

// ── Login Form ─────────────────────────────────────────────
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if(!form) return;

  // Built-in demo accounts
  const DEMO_USERS = [
    { id:1, name:'Liam Nkosi',       email:'student@kda.ac.rw', password:'Student@123', role:'student', class:'Grade 11A', studentId:'KDA-2024-001', avatar:'LN' },
    { id:2, name:'Grace Mokoena',    email:'parent@kda.ac.rw',  password:'Parent@123',  role:'parent',  childName:'Liam Nkosi', childId:'KDA-2024-001', avatar:'GM' },
    { id:3, name:'Mr. James Dlamini',email:'teacher@kda.ac.rw', password:'Teacher@123', role:'teacher', subject:'Mathematics', avatar:'JD' },
    { id:4, name:'Dr. Sarah Khumalo',email:'admin@kda.ac.rw',   password:'Admin@123',   role:'admin',   title:'Principal', avatar:'SK' },
  ];

  // Role selection — auto-fill demo credentials
  $$('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const demoMap = {
        student:{ email:'student@kda.ac.rw', pass:'Student@123' },
        parent:{ email:'parent@kda.ac.rw',   pass:'Parent@123'  },
        teacher:{ email:'teacher@kda.ac.rw', pass:'Teacher@123' },
        admin:{ email:'admin@kda.ac.rw',     pass:'Admin@123'   },
      };
      const role = btn.dataset.role;
      const demo = demoMap[role];
      if(demo) {
        const emailEl = form.querySelector('#email');
        const passEl  = form.querySelector('#password');
        if(emailEl) emailEl.value = demo.email;
        if(passEl)  passEl.value  = demo.pass;
        hideFieldError('emailError');
        hideFieldError('passError');
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailEl = form.querySelector('#email');
    const passEl  = form.querySelector('#password');
    if(!emailEl || !passEl) return;
    const email = emailEl.value.trim().toLowerCase();
    const pass  = passEl.value;
    let valid = true;

    if(!validateEmail(email)) {
      showFieldError('emailError', 'Please enter a valid email address.'); valid = false;
    } else hideFieldError('emailError');
    if(pass.length < 6) {
      showFieldError('passError', 'Password must be at least 6 characters.'); valid = false;
    } else hideFieldError('passError');
    if(!valid) return;

    // Merge demo users + self-registered users
    let registeredUsers = [];
    try { registeredUsers = JSON.parse(localStorage.getItem('kda_registered_users') || '[]'); } catch(_) {}
    const allUsers = [...DEMO_USERS, ...registeredUsers];

    // Find account by email
    const userByEmail = allUsers.find(u => u.email.toLowerCase() === email);
    if(!userByEmail) {
      showFieldError('emailError', 'No account found with this email address.');
      hideFieldError('passError');
      return;
    }

    // Check password
    if(userByEmail.password !== pass) {
      hideFieldError('emailError');
      showFieldError('passError', 'Wrong password. Please try again.');
      passEl.value = '';
      passEl.focus();
      passEl.style.borderColor = 'var(--red)';
      setTimeout(() => { passEl.style.borderColor = ''; }, 1500);
      return;
    }

    // Success — save session (without password)
    hideFieldError('emailError');
    hideFieldError('passError');
    const sessionUser = Object.assign({}, userByEmail);
    delete sessionUser.password;
    localStorage.setItem('kda_user', JSON.stringify(sessionUser));

    showToast('Welcome back!', 'Signing you in as ' + userByEmail.name, 'success');
    const submitBtn = form.querySelector('button[type=submit]');
    submitBtn.innerHTML = 'Signing in...'; submitBtn.disabled = true;
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1300);
  });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if(el) { el.textContent = msg; el.classList.add('visible'); }
}
function hideFieldError(id) {
  const el = document.getElementById(id);
  if(el) el.classList.remove('visible');
}

// ── Dashboard Init ─────────────────────────────────────────
function initDashboard() {
  const page = document.getElementById('dashPage');
  if(!page) return;
  if(!currentUser) { window.location.href = 'login.html'; return; }

  // Populate user info
  $$('.user-name-display').forEach(el => el.textContent = currentUser.name);
  $$('.user-role-display').forEach(el => el.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1));
  $$('.user-avatar-display').forEach(el => el.textContent = currentUser.avatar || currentUser.name.charAt(0));

  // Show role-specific panels
  $$('[data-role]').forEach(el => {
    el.style.display = el.dataset.role === currentUser.role ? '' : 'none';
  });

  // Update topbar title
  const titles = { student:'Student Dashboard', parent:'Parent Dashboard', teacher:'Teacher Dashboard', admin:'Admin Dashboard' };
  const titleEl = document.getElementById('dashTitle');
  if(titleEl) titleEl.textContent = titles[currentUser.role] || 'Dashboard';

  // Logout
  $$('.logout-btn').forEach(btn => btn.addEventListener('click', logout));
}

function logout() {
  localStorage.removeItem('kda_user');
  showToast('Signed out', 'Goodbye! Have a great day.', 'info');
  setTimeout(() => window.location.href = 'login.html', 1000);
}

// ── Results Table ──────────────────────────────────────────
function initResults() {
  const tbody = document.getElementById('resultsBody');
  if(!tbody) return;
  let total = 0, count = 0;
  tbody.innerHTML = DB.results.map(r => {
    total += r.score; count++;
    const pct = Math.round(r.score/r.total*100);
    const fillClass = pct >= 75 ? '' : pct >= 50 ? 'mid' : 'low';
    return `<tr>
      <td><strong>${r.subject}</strong></td>
      <td>${r.teacher}</td>
      <td>${r.term}</td>
      <td><strong>${r.score}/${r.total}</strong></td>
      <td><span class="grade-badge ${getGradeClass(r.grade)}">${r.grade}</span></td>
      <td><div class="progress-bar"><div class="progress-fill ${fillClass}" style="width:${pct}%"></div></div></td>
      <td>${pct}%</td>
    </tr>`;
  }).join('');
  const avg = Math.round(total/count);
  const avgEl = document.getElementById('avgScore');
  if(avgEl) avgEl.textContent = avg + '%';
  buildPerfChart();
}

function buildPerfChart() {
  const chart = document.getElementById('perfChart');
  if(!chart) return;
  const subjects = DB.results.map(r => ({ label: r.subject.split(' ')[0], score: r.score, pct: r.score }));
  const max = Math.max(...subjects.map(s => s.score));
  chart.innerHTML = subjects.map(s => {
    const h = Math.round((s.score / 100) * 130);
    const hl = s.score === max ? 'highlight' : '';
    return `<div class="perf-bar-group">
      <div class="perf-score">${s.score}</div>
      <div class="perf-bar ${hl}" style="height:${h}px"></div>
      <div class="perf-subject">${s.label}</div>
    </div>`;
  }).join('');
}

// ── Student Search (Admin/Teacher) ─────────────────────────
function initStudentSearch() {
  const input = document.getElementById('studentSearch');
  const tbody = document.getElementById('studentsBody');
  if(!input || !tbody) return;

  function renderStudents(list) {
    tbody.innerHTML = list.map(s => {
      const statusClass = s.status === 'Active' ? 'badge-green' : 'badge-red';
      const att = parseInt(s.attendance);
      const fillClass = att >= 90 ? '' : att >= 75 ? 'mid' : 'low';
      return `<tr>
        <td><code style="font-size:.8rem;color:var(--gold)">${s.id}</code></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.class}</td>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar"><div class="progress-fill ${fillClass}" style="width:${s.attendance}"></div></div>${s.attendance}</div></td>
        <td><strong>${s.gpa}</strong></td>
        <td><span class="badge ${statusClass}">${s.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="openStudentModal('${s.id}')">👁 View</button>
          <button class="btn btn-sm btn-danger" style="margin-left:6px" onclick="confirmDelete('${s.id}')">🗑</button>
        </td>
      </tr>`;
    }).join('');
    document.getElementById('studentCount').textContent = list.length + ' students';
  }

  renderStudents(DB.students);

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    renderStudents(DB.students.filter(s => s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)));
  });

  // Filter by class
  const classFilter = document.getElementById('classFilter');
  if(classFilter) classFilter.addEventListener('change', () => {
    const q = input.value.toLowerCase();
    const cls = classFilter.value;
    renderStudents(DB.students.filter(s => {
      const matchQ = s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q);
      const matchC = cls ? s.class === cls : true;
      return matchQ && matchC;
    }));
  });
}

window.openStudentModal = function(id) {
  const s = DB.students.find(st => st.id === id);
  if(!s) return;
  const overlay = document.getElementById('studentModal');
  if(overlay) {
    overlay.querySelector('#modalStudentName').textContent = s.name;
    overlay.querySelector('#modalStudentDetails').innerHTML = `
      <p><strong>ID:</strong> ${s.id}</p><p><strong>Class:</strong> ${s.class}</p>
      <p><strong>Attendance:</strong> ${s.attendance}</p><p><strong>GPA:</strong> ${s.gpa}</p>
      <p><strong>Status:</strong> ${s.status}</p>`;
    overlay.classList.add('open');
  }
};

window.confirmDelete = function(id) {
  if(confirm(`Remove student ${id} from the system? This cannot be undone.`)) {
    showToast('Student removed', `ID ${id} has been deleted.`, 'success');
  }
};

// ── Announcements ──────────────────────────────────────────
function initAnnouncements() {
  const list = document.getElementById('announcementsList');
  if(!list) return;
  list.innerHTML = DB.announcements.map(a => {
    const d = new Date(a.date);
    const day = d.getDate();
    const month = d.toLocaleString('en', { month:'short' });
    const prioClass = a.priority === 'high' ? 'badge-red' : a.priority === 'medium' ? 'badge-gold' : 'badge-blue';
    return `<div class="announcement-item">
      <div class="announce-date"><div class="day">${day}</div><div class="month">${month}</div></div>
      <div class="announce-body" style="flex:1">
        <h4>${a.title}</h4>
        <p>${a.body}</p>
        <div class="announce-meta">
          <span class="badge ${prioClass}">${a.priority}</span>
          <span class="badge badge-blue">${a.category}</span>
          <span style="font-size:.75rem;color:var(--gray-400);margin-left:4px">By ${a.author} · ${formatDate(a.date)}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Post Announcement Form ─────────────────────────────────
function initPostAnnouncement() {
  const form = document.getElementById('postAnnouncementForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = form.querySelector('#annTitle').value.trim();
    const body = form.querySelector('#annBody').value.trim();
    if(!title || !body) { showToast('Error', 'Please fill in all fields.', 'error'); return; }
    DB.announcements.unshift({ id: Date.now(), title, body, date: new Date().toISOString().split('T')[0], category: form.querySelector('#annCategory').value, author: currentUser?.name || 'Teacher', priority: form.querySelector('#annPriority').value });
    showToast('Posted!', 'Announcement published successfully.', 'success');
    form.reset();
    initAnnouncements();
  });
}

// ── Upload Marks Form ──────────────────────────────────────
function initUploadMarks() {
  const form = document.getElementById('uploadMarksForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const subject = form.querySelector('#markSubject').value;
    const student = form.querySelector('#markStudent').value;
    const score = form.querySelector('#markScore').value;
    if(!subject || !student || !score) { showToast('Error', 'Please fill all mark fields.', 'error'); return; }
    if(score < 0 || score > 100) { showToast('Error', 'Score must be between 0 and 100.', 'error'); return; }
    showToast('Marks uploaded', `Score ${score}/100 saved for ${student}.`, 'success');
    form.reset();
  });
}

// ── Fees Table ─────────────────────────────────────────────
function initFees() {
  const tbody = document.getElementById('feesBody');
  if(!tbody) return;
  let outstanding = 0;
  tbody.innerHTML = DB.fees.map(f => {
    if(!f.paid) outstanding += 4200;
    return `<tr>
      <td>${f.term}</td>
      <td>${f.due}</td>
      <td>${f.amount}</td>
      <td><span class="badge ${f.paid ? 'badge-green' : 'badge-red'}">${f.paid ? '✓ Paid' : '⚠ Outstanding'}</span></td>
      <td>${f.paid ? '—' : `<button class="btn btn-sm btn-primary" onclick="payFee(this)">Pay Now</button>`}</td>
    </tr>`;
  }).join('');
  const el = document.getElementById('outstandingAmount');
  if(el) el.textContent = `R ${outstanding.toLocaleString()}`;
}

window.payFee = function(btn) {
  const row = btn.closest('tr');
  if(confirm('Proceed to payment portal?')) {
    row.cells[3].innerHTML = '<span class="badge badge-green">✓ Paid</span>';
    row.cells[4].textContent = '—';
    showToast('Payment processed', 'Your payment has been recorded.', 'success');
  }
};

// ── Contact Form ───────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if(!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const fields = [
      { id:'contactName', errId:'nameErr', msg:'Full name is required.' },
      { id:'contactEmail', errId:'emailErr', msg:'Valid email required.', validate: v => validateEmail(v) },
      { id:'contactSubject', errId:'subjectErr', msg:'Subject is required.' },
      { id:'contactMessage', errId:'msgErr', msg:'Message must be at least 10 characters.', validate: v => v.length >= 10 },
    ];
    fields.forEach(f => {
      const val = form.querySelector('#'+f.id).value.trim();
      const ok = f.validate ? f.validate(val) : validateRequired(val);
      if(!ok) { showFieldError(f.errId, f.msg); valid = false; } else hideFieldError(f.errId);
    });
    if(!valid) return;
    form.querySelector('.form-success').classList.add('visible');
    form.reset();
    showToast('Message sent!', "We'll respond within 1–2 business days.", 'success');
    setTimeout(() => form.querySelector('.form-success').classList.remove('visible'), 5000);
  });
}

// ── Add User Modal ─────────────────────────────────────────
function initAddUser() {
  const btn = document.getElementById('addUserBtn');
  const overlay = document.getElementById('addUserModal');
  const form = document.getElementById('addUserForm');
  if(!btn || !overlay) return;
  btn.addEventListener('click', () => overlay.classList.add('open'));
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.classList.remove('open'); });
  overlay.querySelector('.close-btn')?.addEventListener('click', () => overlay.classList.remove('open'));
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#newName').value.trim();
    const email = form.querySelector('#newEmail').value.trim();
    const role = form.querySelector('#newRole').value;
    if(!name || !validateEmail(email) || !role) { showToast('Error', 'Please fill in all fields correctly.', 'error'); return; }
    showToast('User added', `${name} (${role}) has been created.`, 'success');
    overlay.classList.remove('open');
    form.reset();
  });
}

// ── Tabs ───────────────────────────────────────────────────
function initTabs() {
  $$('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(target)?.classList.add('active');
      });
    });
  });
}

// ── Modal Close ────────────────────────────────────────────
function initModals() {
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if(e.target === overlay) overlay.classList.remove('open'); });
    overlay.querySelector('.close-btn')?.addEventListener('click', () => overlay.classList.remove('open'));
  });
}

// ── Smooth Scroll for anchor links ─────────────────────────
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if(target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
    });
  });
}

// ── Attendance Chart (home/parent page) ───────────────────
function initAttendanceChart() {
  const chart = document.getElementById('attendanceChart');
  if(!chart) return;
  const weeks = ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'];
  const vals = [100,95,100,90,100,100,85,94];
  chart.innerHTML = weeks.map((w,i) => {
    const h = Math.round(vals[i] * 0.8);
    const color = vals[i] >= 95 ? 'var(--green)' : vals[i] >= 85 ? 'var(--gold)' : 'var(--red)';
    return `<div class="perf-bar-group">
      <div class="perf-score" style="font-size:.7rem">${vals[i]}%</div>
      <div style="width:100%;border-radius:4px 4px 0 0;background:${color};height:${h}px;min-height:8px"></div>
      <div style="font-size:.65rem;color:var(--gray-600)">${w}</div>
    </div>`;
  }).join('');
}

// ── Init All ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initSidebar();
  initNotifications();
  initClock();
  initLoginForm();
  initDashboard();
  initResults();
  initStudentSearch();
  initAnnouncements();
  initPostAnnouncement();
  initUploadMarks();
  initFees();
  initContactForm();
  initAddUser();
  initTabs();
  initModals();
  initSmoothScroll();
  initAttendanceChart();
});
