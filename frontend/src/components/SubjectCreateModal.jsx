import React, { useState } from 'react';
import { X, Plus, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api';

const COLOR_PRESETS = [
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Warm Orange', hex: '#ea580c' },
  { name: 'Fresh Green', hex: '#16a34a' },
  { name: 'Amber Yellow', hex: '#ca8a04' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
];

export default function SubjectCreateModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    color: '#0284c7',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError('Please provide both Subject Name and Subject Code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.createCourse({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
        color: form.color,
        icon: 'book',
      });
      onCreated(res);
      onClose();
      setForm({ name: '', code: '', description: '', color: '#0284c7' });
    } catch (err) {
      setError(err.message || 'Failed to create subject.');
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
          maxWidth: '480px',
          maxHeight: '94vh',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #bae6fd',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 24px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderBottom: '1.5px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1.5px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Create New Subject
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Add a new subject to organize daily PDFs & quizzes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '22px 24px', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '10px',
                color: '#dc2626',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Subject Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Computer Networks, System Design"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Subject Code * (Short Prefix)
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g., CN, SYSDES, C_PROG"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief summary of concepts, syllabus, and placement relevance..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Accent Color
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setForm({ ...form, color: c.hex })}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: c.hex,
                    border: form.color === c.hex ? '3px solid #0f172a' : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transform: form.color === c.hex ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              style={{ flex: 1, padding: '10px', fontWeight: 700 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="primary-btn"
              style={{
                flex: 2,
                padding: '10px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Plus size={18} />
              <span>{loading ? 'Creating...' : 'Create Subject'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

