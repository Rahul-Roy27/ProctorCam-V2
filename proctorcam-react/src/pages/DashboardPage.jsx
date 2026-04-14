import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-proctor">Proctor</span><span className="logo-ai">AI</span>
          </div>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="active">Dashboard</Link></li>
            <li><Link to="/test">Test</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          <button className="icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <button className="icon-btn" title="Settings">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <div style={{width: '1px', height: '24px', background: '#e2e8f0', margin: '0 8px'}}></div>
          <Link to="/" className="icon-btn" title="Logout" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', textDecoration: 'none', fontWeight: '600', marginRight: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span style={{fontSize:'13px'}}>Logout</span>
          </Link>
          <div className="avatar">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="User"/>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="dashboard-content">
        
        {/* Profile Card */}
        <section className="profile-card">
          <div className="profile-info-section">
            <div className="profile-image-wrapper">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Alex Rivera" className="profile-image" />
              <div className="live-camera-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="profile-name-row">
                <h1 className="student-name">Alex Rivera</h1>
                <span className="semester-badge">SEMESTER 4</span>
              </div>
              <div className="student-meta">
                <div className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>CS202401</span>
                </div>
                <div className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  <span>Computer Science</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-stats-section">
            <div className="stat-block">
              <span className="stat-label">ATTENDANCE</span>
              <span className="stat-value text-green">82%</span>
            </div>
            <div className="stat-block">
              <span className="stat-label">TESTS DONE</span>
              <span className="stat-value text-blue">12</span>
            </div>
            <div className="stat-block">
              <span className="stat-label">RANK</span>
              <span className="stat-value text-dark">5th</span>
            </div>
          </div>
        </section>

        {/* Multi-Column Grid */}
        <section className="dashboard-grid">
          
          {/* Column 1: Attendance Breakdown */}
          <div className="card-box">
            <div className="card-header border-bottom">
              <h2 className="card-title">Attendance Breakdown</h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div className="table-wrapper">
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>SUBJECT</th>
                    <th>T/A</th>
                    <th>RATIO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data Structures</td>
                    <td>40/38</td>
                    <td className="text-green fw-bold">95%</td>
                  </tr>
                  <tr>
                    <td>OS Principles</td>
                    <td>36/22</td>
                    <td className="text-red fw-bold">61%</td>
                  </tr>
                  <tr>
                    <td>Algorithms</td>
                    <td>42/35</td>
                    <td className="text-green fw-bold">83%</td>
                  </tr>
                  <tr>
                    <td>DBMS</td>
                    <td>30/28</td>
                    <td className="text-green fw-bold">93%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Recent Performance */}
          <div className="card-box">
            <div className="card-header">
              <h2 className="card-title">Recent Performance</h2>
              <a href="#" className="link-view-all">VIEW ALL</a>
            </div>
            <div className="performance-list">
              <div className="perf-item bg-light-green">
                <div className="perf-icon circle-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="perf-info">
                  <p className="perf-name">Discrete Maths</p>
                  <span className="perf-date">12 OCT 2023</span>
                </div>
                <div className="perf-score-col">
                  <span className="perf-score text-green">9/10</span>
                  <span className="perf-badge badge-green">EXCELLENT</span>
                </div>
              </div>

              <div className="perf-item bg-light-blue">
                <div className="perf-icon icon-blue">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div className="perf-info">
                  <p className="perf-name">Python Quiz</p>
                  <span className="perf-date">08 OCT 2023</span>
                </div>
                <div className="perf-score-col">
                  <span className="perf-score text-blue">8/10</span>
                  <span className="perf-badge badge-blue">GOOD</span>
                </div>
              </div>

              <div className="perf-item bg-light-gray">
                <div className="perf-icon icon-gray">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </div>
                <div className="perf-info">
                  <p className="perf-name">Computer Networks</p>
                  <span className="perf-date">05 OCT 2023</span>
                </div>
                <div className="perf-score-col">
                  <span className="perf-score text-dark">7/10</span>
                  <span className="perf-badge badge-gray">AVERAGE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Coming Up Next */}
          <div className="card-box coming-up-card">
            <div className="coming-up-inner">
              <span className="coming-up-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                COMING UP NEXT
              </span>
              <h2 className="coming-up-title">JEE Mock Test — Chapter 3</h2>
              
              <div className="coming-up-meta-grid">
                <div className="meta-box">
                  <span className="meta-label">DURATION</span>
                  <span className="meta-val">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    30 mins
                  </span>
                </div>
                <div className="meta-box">
                  <span className="meta-label">QUESTIONS</span>
                  <span className="meta-val">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    10 Qs
                  </span>
                </div>
              </div>

              <div className="difficulty-box">
                 <span className="meta-label">DIFFICULTY</span>
                 <div className="diff-indicator">
                   <span className="diff-text">Medium</span>
                   <div className="diff-bars">
                     <div className="bar filled"></div>
                     <div className="bar filled"></div>
                     <div className="bar unfilled"></div>
                   </div>
                 </div>
              </div>

              <Link to="/test" className="btn-go-to-test">
                GO TO TEST
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>

        </section>
      </main>

      {/* ── PROCTORING ALERT FOOTER ── */}
      <div className="proctoring-footer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>PROCTORING ALERT</span>
      </div>

    </div>
  );
}
