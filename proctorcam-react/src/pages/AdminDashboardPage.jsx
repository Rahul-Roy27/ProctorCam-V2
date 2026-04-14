import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const [testTitle, setTestTitle] = useState('');
  const [testDuration, setTestDuration] = useState('60');

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (testTitle.trim() === '') {
      alert("Please enter a test title.");
      return;
    }
    alert(`Assessment "${testTitle}" created successfully!`);
    setTestTitle('');
  };

  return (
    <div className="admin-page">
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-proctor">Proctor</span><span className="logo-ai">AI</span>
          </div>
          <ul className="nav-links">
            <li><Link to="/admin" className="active">Overview</Link></li>
            <li><Link to="#">Submissions</Link></li>
            <li><Link to="#">Reports</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          <div className="search-box">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
             <input type="text" placeholder="Search students or tests..." />
          </div>
          <button className="icon-btn" title="Settings">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <div className="divider"></div>
          <Link to="/" className="icon-btn logout text-red" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Logout</span>
          </Link>
          <div className="avatar">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" alt="Educator"/>
          </div>
        </div>
      </nav>

      <main className="admin-content">
        <header className="page-header">
           <h1 className="greeting">Welcome Back, Professor</h1>
           <span className="date">Computer Science Dept. • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </header>

        {/* ── AT A GLANCE METRICS ── */}
        <section className="metrics-grid">
           <div className="metric-card">
              <div className="mc-icon bg-blue-light text-blue">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div className="mc-info">
                 <span className="mc-label">CLASS AVG SCORE</span>
                 <span className="mc-value">78.4%</span>
              </div>
           </div>
           
           <div className="metric-card">
              <div className="mc-icon bg-green-light text-green">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="mc-info">
                 <span className="mc-label">TOTAL STUDENTS</span>
                 <span className="mc-value">142</span>
              </div>
           </div>

           <div className="metric-card">
              <div className="mc-icon bg-red-light text-red">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="mc-info">
                 <span className="mc-label">ACTIVE FLAGS</span>
                 <span className="mc-value">3</span>
              </div>
           </div>
        </section>

        <div className="admin-layout-grid">
           {/* ── RECENT RESULTS (SCROLLABLE) ── */}
           <div className="card-panel panel-results">
              <div className="panel-header border-bottom">
                 <h2>Recent Submissions</h2>
                 <a href="#" className="link-view">VIEW ALL</a>
              </div>
              <div className="results-list">
                 
                 <div className="result-item">
                    <div className="ri-avatar"><img src="https://i.pravatar.cc/40?img=11" alt="Student"/></div>
                    <div className="ri-info">
                       <strong>Michael Chen</strong>
                       <span>Data Structures Midterm</span>
                    </div>
                    <div className="ri-score">92%</div>
                    <div className="ri-badge badge-clean">CLEAN</div>
                 </div>

                 <div className="result-item">
                    <div className="ri-avatar"><img src="https://i.pravatar.cc/40?img=5" alt="Student"/></div>
                    <div className="ri-info">
                       <strong>Sarah Jenkins</strong>
                       <span>OS Principles Quiz 4</span>
                    </div>
                    <div className="ri-score">88%</div>
                    <div className="ri-badge badge-clean">CLEAN</div>
                 </div>

                 <div className="result-item flagged">
                    <div className="ri-avatar"><img src="https://i.pravatar.cc/40?img=8" alt="Student"/></div>
                    <div className="ri-info">
                       <strong>David Kumar</strong>
                       <span>Algorithms Final Exam</span>
                    </div>
                    <div className="ri-score text-red-dark">45%</div>
                    <div className="ri-badge badge-flagged">FLAGGED</div>
                 </div>

                 <div className="result-item">
                    <div className="ri-avatar"><img src="https://i.pravatar.cc/40?img=1" alt="Student"/></div>
                    <div className="ri-info">
                       <strong>Emily Watson</strong>
                       <span>Intro to DBMS</span>
                    </div>
                    <div className="ri-score">76%</div>
                    <div className="ri-badge badge-clean">CLEAN</div>
                 </div>

                 <div className="result-item">
                    <div className="ri-avatar"><img src="https://i.pravatar.cc/40?img=14" alt="Student"/></div>
                    <div className="ri-info">
                       <strong>James Rodriguez</strong>
                       <span>Data Structures Midterm</span>
                    </div>
                    <div className="ri-score">81%</div>
                    <div className="ri-badge badge-clean">CLEAN</div>
                 </div>

                 <div className="result-item flagged warning">
                    <div className="ri-avatar"><img src="https://i.pravatar.cc/40?img=3" alt="Student"/></div>
                    <div className="ri-info">
                       <strong>Ashley Smith</strong>
                       <span>Computer Networks</span>
                    </div>
                    <div className="ri-score text-orange-dark">68%</div>
                    <div className="ri-badge badge-warning">WARNING</div>
                 </div>

              </div>
           </div>

           {/* ── QUICK TEST CREATION ── */}
           <div className="card-panel panel-create-test">
              <div className="panel-header border-bottom">
                 <h2>Quick Test Creation</h2>
              </div>
              <div className="create-test-body">
                 <div className="ct-icon-wrap">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                 </div>
                 <h3>Launch an Assessment</h3>
                 <p>Instantly deploy a new proctored exam environment and generate an invite link for your students.</p>
                 
                 <form className="ct-form" onSubmit={handleCreateTest}>
                    <div className="input-group">
                       <label>Assessment Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Computer Architecture Quiz 1" 
                         value={testTitle}
                         onChange={(e) => setTestTitle(e.target.value)}
                       />
                    </div>
                    <div className="input-group">
                       <label>Duration (Minutes)</label>
                       <select value={testDuration} onChange={(e) => setTestDuration(e.target.value)}>
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="60">60 Minutes</option>
                          <option value="90">90 Minutes</option>
                          <option value="120">120 Minutes</option>
                       </select>
                    </div>
                    <button type="submit" className="btn-create">Create Assessment</button>
                 </form>
              </div>
           </div>

        </div>
      </main>

      {/* ── PROCTORING FOOTER ── */}
      <div className="footer-bar">
         <span>ProctorAI Admin Portal — Monitoring Active Sessions</span>
      </div>
    </div>
  );
}
