import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, X, KeyRound, Sparkles } from 'lucide-react';
import api from '../api';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
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
        onSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid super admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #fed7aa',
          boxShadow: '0 20px 40px -15px rgba(234, 88, 12, 0.15), 0 0 0 1px rgba(224, 242, 254, 0.8)',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 26px 20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #fff7ed 50%, #fefce8 100%)',
            borderBottom: '1.5px solid #ffedd5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#ffedd5',
                border: '1.5px solid #fdba74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Super Admin Login
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Required to edit courses, topics & files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 26px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '12px',
                color: '#dc2626',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '18px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Credential Hint Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              marginBottom: '18px',
              fontSize: '0.825rem',
              color: '#166534',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={16} color="#16a34a" />
              <span>Default Super Admin: <strong>admin</strong> / <strong>admin123</strong></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
              }}
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#15803d',
                cursor: 'pointer',
              }}
            >
              Auto-fill
            </button>
          </div>

          {/* Username Input */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '6px',
              }}
            >
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={17}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter super admin username"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter super admin password"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                fontWeight: 700,
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="primary-btn"
              style={{
                flex: 2,
                padding: '11px',
                borderRadius: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
              }}
            >
              <ShieldCheck size={18} />
              <span>{loading ? 'Authenticating...' : 'Sign In as Super Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

