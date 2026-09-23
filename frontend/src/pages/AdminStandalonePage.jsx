import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import api from '../api';
import Admin from './Admin';

export default function AdminStandalonePage({ adminUser, onLoginSuccess, onLogout }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.loginSuperAdmin({
        username: username.trim(),
        password: password.trim(),
      });
      if (res && res.success) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid Super Admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  // If Super Admin is NOT authenticated, display full-screen dedicated login page
  if (!adminUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 40%, #fefce8 80%, #f0fdf4 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #fed7aa',
            boxShadow: '0 20px 45px -15px rgba(234, 88, 12, 0.18), 0 0 0 1px rgba(224, 242, 254, 0.9)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '28px 28px 24px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 50%, #fefce8 100%)',
              borderBottom: '1.5px solid #ffedd5',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 18px rgba(234, 88, 12, 0.28)',
              }}
            >
              <ShieldCheck size={32} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Super Admin Portal
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#475569' }}>
              Separate Administration & Curriculum Management Console
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} style={{ padding: '28px' }}>
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Admin Username
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#f8fafc',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound
                    size={18}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#f8fafc',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '18px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#166534',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} color="#16a34a" style={{ flexShrink: 0 }} />
              <span>
                Default credentials: <strong>admin</strong> / <strong>admin123</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '22px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.975rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 16px rgba(234, 88, 12, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#0284c7',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={16} />
                <span>Return to Student App</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // When Super Admin IS authenticated, display dedicated standalone Admin Portal with its own top bar
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-main, #f8fafc)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Standalone Admin Header */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1.5px solid #fed7aa',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Logo & Portal Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(234, 88, 12, 0.25)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Super Admin Console
                </h1>
                <span
                  style={{
                    background: '#ffedd5',
                    color: '#ea580c',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    border: '1px solid #fed7aa',
                  }}
                >
                  STANDALONE
                </span>
              </div>
              <p style={{ margin: '1px 0 0', fontSize: '0.775rem', color: '#64748b' }}>
                Separate management window for courses, topics, quiz questions, and study moderation
              </p>
            </div>
          </div>

          {/* Actions & Session */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => window.open('/', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#e0f2fe',
                border: '1.5px solid #bae6fd',
                color: '#0284c7',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              title="Open Student App in another tab"
            >
              <ExternalLink size={15} />
              <span>Open Student App ↗</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '10px',
                background: '#fff7ed',
                border: '1.5px solid #fed7aa',
              }}
            >
              <User size={15} color="#ea580c" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9a3412' }}>
                {adminUser?.username || 'admin'}
              </span>
            </div>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#fef2f2',
                border: '1.5px solid #fca5a5',
                color: '#dc2626',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              title="Log out of Super Admin"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Admin
          adminUser={adminUser}
          onLogout={onLogout}
          onPreviewMaterial={(courseId, topicId) => {
            window.open(`/?view=study&course=${courseId}&topic=${topicId || ''}`, '_blank');
          }}
          onReadSubject={(courseId) => {
            window.open(`/?view=study&course=${courseId}`, '_blank');
          }}
        />
      </main>

      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.825rem',
          background: '#ffffff',
          marginTop: 'auto',
        }}
      >
        Super Admin Management Console • Placement Preparation Assessment Platform
      </footer>
    </div>
  );
}

