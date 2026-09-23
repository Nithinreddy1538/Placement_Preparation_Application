import React, { useState, useEffect } from 'react';
import { X, FileUp, FileText, AlertCircle, UploadCloud, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function DailyPdfUploadModal({
  isOpen,
  onClose,
  onUploaded,
  courses = [],
  presetCourseId = null,
  presetTopicId = null,
}) {
  const [selectedCourse, setSelectedCourse] = useState(presetCourseId || (courses[0]?.id ?? ''));
  const [selectedTopic, setSelectedTopic] = useState(presetTopicId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'notes'
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('# Daily Concept Overview\n\n• Key Point 1: ...\n• Key Point 2: ...\n\n## Core Rules & Explanation\nWrite structured concept notes here...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (presetCourseId) setSelectedCourse(presetCourseId);
    else if (courses.length > 0 && !selectedCourse) setSelectedCourse(courses[0].id);

    if (presetTopicId) setSelectedTopic(presetTopicId);
  }, [presetCourseId, presetTopicId, courses]);

  if (!isOpen) return null;

  const currentCourseObj = courses.find((c) => c.id.toString() === selectedCourse?.toString()) || courses[0];
  const availableTopics = currentCourseObj?.topics || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the Daily PDF.');
      return;
    }

    if (mode === 'upload' && !file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    if (mode === 'notes' && !content.trim()) {
      setError('Please enter some notes content.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('course', selectedCourse);
      if (selectedTopic && selectedTopic !== 'All') {
        formData.append('topic', selectedTopic);
      }
      formData.append('title', title.trim());
      formData.append('description', description.trim());

      if (mode === 'upload' && file) {
        formData.append('file', file);
      }
      formData.append('content', content);

      const res = await api.uploadMaterial(formData);
      onUploaded(res);
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Failed to upload daily PDF.');
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
          maxWidth: '560px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #fed7aa',
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
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            borderBottom: '1.5px solid #fed7aa',
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
                border: '1.5px solid #fdba74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
              }}
            >
              <FileUp size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Add Daily PDF & Concept Notes
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Upload a PDF file or write notes that compile to PDF
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

          {/* Subject & Topic Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Target Subject *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedTopic('');
                }}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Topic (Optional)
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">General Notes (No Topic)</option>
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Day 4 - Graph Algorithms & Dijkstra PDF"
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

          {/* Short Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Short Summary
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of concepts and interview questions covered"
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Mode Switcher */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Format Option
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMode('upload')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid ' + (mode === 'upload' ? '#ea580c' : '#cbd5e1'),
                  background: mode === 'upload' ? '#fff7ed' : '#ffffff',
                  color: mode === 'upload' ? '#ea580c' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <UploadCloud size={16} />
                <span>Upload PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('notes')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid ' + (mode === 'notes' ? '#0284c7' : '#cbd5e1'),
                  background: mode === 'notes' ? '#f0f9ff' : '#ffffff',
                  color: mode === 'notes' ? '#0284c7' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <FileText size={16} />
                <span>Write Notes (Auto-PDF)</span>
              </button>
            </div>
          </div>

          {/* Content Area Based on Mode */}
          {mode === 'upload' ? (
            <div
              style={{
                border: '2px dashed #fed7aa',
                borderRadius: '14px',
                padding: '24px 16px',
                textAlign: 'center',
                background: '#fffaf5',
                marginBottom: '20px',
              }}
            >
              <UploadCloud size={36} color="#ea580c" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                {file ? file.name : 'Choose a PDF file to upload'}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px' }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports standard .pdf documents'}
              </p>
              <label
                style={{
                  display: 'inline-block',
                  background: '#ffedd5',
                  color: '#ea580c',
                  border: '1px solid #fdba74',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                }}
              >
                Browse Files
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <textarea
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter markdown/structured concept notes..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              style={{ flex: 1, padding: '11px', fontWeight: 700 }}
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
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <FileUp size={18} />
              <span>{loading ? 'Publishing...' : 'Publish Daily PDF'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

