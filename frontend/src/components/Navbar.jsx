import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  ShieldCheck,
  User,
  Code2,
  Layers,
  Award,
  CheckCircle2,
  Lock,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  role,
  setRole,
  adminUser,
  onOpenLoginModal,
  onAdminLogout,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (viewName) => {
    setCurrentView(viewName);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <a
            href="#dashboard"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('dashboard');
            }}
          >
            <img
              src="/logo.png"
              alt="Placement Prep Logo"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                objectFit: 'contain',
                boxShadow: '0 3px 10px rgba(99, 102, 241, 0.25)',
              }}
            />
            <span>Placement Prep</span>
            <span className="brand-badge">2026</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <button
              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <Layers size={17} />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-btn ${currentView === 'courses' ? 'active' : ''}`}
              onClick={() => handleNavClick('courses')}
            >
              <Layers size={17} />
              <span>Courses & Topics</span>
            </button>

            <button
              className={`nav-btn ${currentView === 'study' ? 'active' : ''}`}
              onClick={() => handleNavClick('study')}
            >
              <BookOpen size={17} />
              <span>Study Notes & PDF</span>
            </button>

            <button
              className={`nav-btn ${currentView === 'practice' ? 'active' : ''}`}
              onClick={() => handleNavClick('practice')}
            >
              <Award size={17} />
              <span>Placement Quiz</span>
            </button>

            <button
              className={`nav-btn ${currentView === 'results' ? 'active' : ''}`}
              onClick={() => handleNavClick('results')}
            >
              <CheckCircle2 size={17} />
              <span>Test Results</span>
            </button>

            {/* Admin Portal button: Opens separately in new tab */}
            {adminUser && (
              <button
                className="nav-btn"
                onClick={() => window.open('/#/admin', '_blank')}
                style={{
                  color: '#ea580c',
                  fontWeight: 700,
                }}
                title="Open Super Admin Portal in a separate tab"
              >
                <ShieldCheck size={17} color="#ea580c" />
                <span>Admin Portal</span>
                <span
                  style={{
                    background: '#ffedd5',
                    color: '#ea580c',
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    marginLeft: '4px',
                  }}
                >
                  OPEN ↗
                </span>
              </button>
            )}
          </nav>

          {/* Right Header Controls (Desktop & Mobile Hamburger) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Desktop User Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {adminUser ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#fff7ed',
                    border: '1.5px solid #fed7aa',
                    borderRadius: '12px',
                    padding: '4px 6px 4px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#ea580c" />
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#9a3412' }}>
                      {adminUser.username}
                    </span>
                  </div>
                  <button
                    onClick={onAdminLogout}
                    title="Log out of Super Admin"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#ffffff',
                      border: '1px solid #f97316',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      color: '#ea580c',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <LogOut size={13} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <User size={14} color="#0284c7" />
                  <span>Student</span>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slide Out) */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1.5px solid #f1f5f9', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src="/logo.png"
                  alt="Placement Prep Logo"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                  }}
                />
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0369a1' }}>Placement Prep</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Nav Links List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem' }}
              >
                <Layers size={18} />
                <span>Dashboard</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>

              <button
                className={`nav-btn ${currentView === 'courses' ? 'active' : ''}`}
                onClick={() => handleNavClick('courses')}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem' }}
              >
                <Layers size={18} />
                <span>Courses & Topics</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>

              <button
                className={`nav-btn ${currentView === 'study' ? 'active' : ''}`}
                onClick={() => handleNavClick('study')}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem' }}
              >
                <BookOpen size={18} />
                <span>Study Notes & PDF</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>

              <button
                className={`nav-btn ${currentView === 'practice' ? 'active' : ''}`}
                onClick={() => handleNavClick('practice')}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem' }}
              >
                <Award size={18} />
                <span>Placement Quiz</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>

              <button
                className={`nav-btn ${currentView === 'results' ? 'active' : ''}`}
                onClick={() => handleNavClick('results')}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem' }}
              >
                <CheckCircle2 size={18} />
                <span>Test Results</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>

              {/* Admin Portal in Drawer: Only visible for logged-in Super Admin, hidden from students */}
              {adminUser && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid #f1f5f9' }}>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.open('/#/admin', '_blank');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: '#fff7ed',
                      border: '1.5px solid #fed7aa',
                      color: '#ea580c',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} color="#ea580c" />
                      <span>Admin Portal</span>
                    </div>
                    <ExternalLink size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                Placement Preparation Portal • 2026
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Easy Thumb Navigation on Phones) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-bottom-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          className={`mobile-bottom-item ${currentView === 'courses' ? 'active' : ''}`}
          onClick={() => handleNavClick('courses')}
        >
          <Layers size={18} />
          <span>Courses</span>
        </button>

        <button
          className={`mobile-bottom-item ${currentView === 'study' ? 'active' : ''}`}
          onClick={() => handleNavClick('study')}
        >
          <BookOpen size={18} />
          <span>Study</span>
        </button>

        <button
          className={`mobile-bottom-item ${currentView === 'practice' ? 'active' : ''}`}
          onClick={() => handleNavClick('practice')}
        >
          <Award size={18} />
          <span>Quiz</span>
        </button>

        <button
          className={`mobile-bottom-item ${currentView === 'results' ? 'active' : ''}`}
          onClick={() => handleNavClick('results')}
        >
          <CheckCircle2 size={18} />
          <span>Results</span>
        </button>
      </nav>
    </>
  );
}
