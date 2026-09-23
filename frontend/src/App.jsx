import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CoursesView from './pages/CoursesView';
import SubjectStudy from './pages/SubjectStudy';
import Practice from './pages/Practice';
import TestResults from './pages/TestResults';
import Admin from './pages/Admin';
import AdminStandalonePage from './pages/AdminStandalonePage';
import AdminLoginModal from './components/AdminLoginModal';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import api from './api';

export default function App() {
  const checkIsAdminPage = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.startsWith('/admin') ||
      hash.startsWith('#/admin') ||
      hash === '#admin' ||
      search.includes('view=admin') ||
      search.includes('admin=1')
    );
  };

  const [isAdminPage, setIsAdminPage] = useState(checkIsAdminPage);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'courses' | 'study' | 'practice' | 'results' | 'admin'
  const [role, setRole] = useState('user');

  // Super Admin session state
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('placement_superadmin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);

  // Listen to popstate and hash changes to switch between standalone admin and student app
  useEffect(() => {
    const updateRoute = () => {
      setIsAdminPage(checkIsAdminPage());
    };
    window.addEventListener('popstate', updateRoute);
    window.addEventListener('hashchange', updateRoute);
    return () => {
      window.removeEventListener('popstate', updateRoute);
      window.removeEventListener('hashchange', updateRoute);
    };
  }, []);

  // Synchronize admin login session across separate browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'placement_superadmin_user') {
        if (e.newValue) {
          try {
            setAdminUser(JSON.parse(e.newValue));
          } catch {
            setAdminUser(null);
          }
        } else {
          setAdminUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Shortcut to open Admin Page separately: Alt+A or Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        window.open('/#/admin', '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Read URL query parameters on load (e.g. ?view=study&course=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const courseParam = params.get('course');
    const topicParam = params.get('topic');
    if (viewParam) setCurrentView(viewParam);
    if (courseParam) setActiveCourseId(courseParam);
    if (topicParam) setActiveTopicId(topicParam);
  }, []);

  const handleAdminLoginSuccess = (userData) => {
    setAdminUser(userData);
    try {
      localStorage.setItem('placement_superadmin_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
    setRole('admin');
    setCurrentView('admin');
    setIsLoginModalOpen(false);
  };

  const handleAdminLogout = async () => {
    try {
      await api.logoutSuperAdmin();
    } catch (e) {
      console.error(e);
    }
    setAdminUser(null);
    try {
      localStorage.removeItem('placement_superadmin_user');
    } catch (e) {
      console.error(e);
    }
    setRole('user');
    setCurrentView('dashboard');
  };

  const handleStartPractice = (courseId = null, topicId = null) => {
    setActiveCourseId(courseId || 'All');
    setActiveTopicId(topicId || 'All');
    setCurrentView('practice');
  };

  const handleReadCourseOrTopic = (courseId, topicId = null) => {
    setActiveCourseId(courseId);
    setActiveTopicId(topicId);
    setCurrentView('study');
  };

  const handleExploreCourse = (courseId) => {
    setActiveCourseId(courseId);
    setCurrentView('courses');
  };

  if (isAdminPage) {
    return (
      <AdminStandalonePage
        adminUser={adminUser}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        role={role}
        setRole={setRole}
        adminUser={adminUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard
            onStartPractice={(courseId) => handleStartPractice(courseId)}
            onReadCourse={(courseId) => handleReadCourseOrTopic(courseId)}
            onExploreCourse={handleExploreCourse}
          />
        )}

        {currentView === 'courses' && (
          <CoursesView
            initialCourseId={activeCourseId}
            onReadTopic={(courseId, topicId) => handleReadCourseOrTopic(courseId, topicId)}
            onStartPractice={(courseId, topicId) => handleStartPractice(courseId, topicId)}
            adminUser={adminUser}
          />
        )}

        {currentView === 'study' && (
          <SubjectStudy
            initialCourseId={activeCourseId}
            initialTopicId={activeTopicId}
            onStartPractice={(courseId, topicId) => handleStartPractice(courseId, topicId)}
            adminUser={adminUser}
          />
        )}

        {currentView === 'practice' && (
          <Practice
            initialCourseId={activeCourseId}
            initialTopicId={activeTopicId}
            onReadNotes={(courseId, topicId) => handleReadCourseOrTopic(courseId, topicId)}
            onViewResults={() => setCurrentView('results')}
          />
        )}

        {currentView === 'results' && (
          <TestResults
            onStartPractice={(courseId, topicId) => handleStartPractice(courseId, topicId)}
            onReadNotes={(courseId, topicId) => handleReadCourseOrTopic(courseId, topicId)}
          />
        )}

        {currentView === 'admin' && (
          adminUser ? (
            <Admin
              onPreviewMaterial={(courseId, topicId) => handleReadCourseOrTopic(courseId, topicId)}
              onReadSubject={(courseId) => handleReadCourseOrTopic(courseId)}
              adminUser={adminUser}
              onLogout={handleAdminLogout}
            />
          ) : (
            <div
              style={{
                maxWidth: '560px',
                margin: '60px auto',
                padding: '40px 32px',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #fed7aa',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: '#ffedd5',
                  border: '1.5px solid #fdba74',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#ea580c',
                }}
              >
                <Lock size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Super Admin Access Required
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
                Only verified Super Administrators can edit subjects, add daily PDFs & concept files, configure curriculum topics, and author placement quiz questions.
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <button
                  className="secondary-btn"
                  onClick={() => setCurrentView('dashboard')}
                  style={{ padding: '12px 24px', fontWeight: 700 }}
                >
                  Return to Dashboard
                </button>
                <button
                  className="primary-btn"
                  onClick={() => setIsLoginModalOpen(true)}
                  style={{
                    padding: '12px 26px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>Login as Super Admin</span>
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Super Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '20px 24px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginTop: 'auto',
          background: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ margin: 0 }}>
            Placement Preparation & Assessment Portal • Dynamic Courses, Topics, Word/PDF Sync & Instant Scorecards
          </p>
          <a
            href="/#/admin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#fff7ed',
              border: '1.5px solid #fed7aa',
              color: '#ea580c',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.1)',
              transition: 'all 0.15s',
            }}
            title="Open Super Admin Portal separately in a new tab (Shortcut: Alt+A or Ctrl+Shift+A)"
          >
            <ShieldCheck size={15} color="#ea580c" />
            <span>Super Admin Portal ↗</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
