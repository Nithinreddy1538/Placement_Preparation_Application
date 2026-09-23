import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Layers, Search, ChevronRight, ArrowRight, Plus, FileUp, CheckCircle2 } from 'lucide-react';
import api from '../api';
import SubjectCreateModal from '../components/SubjectCreateModal';
import DailyPdfUploadModal from '../components/DailyPdfUploadModal';

export default function CoursesView({ onReadTopic, onStartPractice, initialCourseId }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Student & Admin modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [targetPdfCourseId, setTargetPdfCourseId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses();
      setCourses(data);
      if (initialCourseId && initialCourseId !== 'All') {
        setSelectedCourseId(initialCourseId);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch courses and topics');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (selectedCourseId !== 'All' && c.id.toString() !== selectedCourseId.toString()) {
      return false;
    }
    return true;
  });

  return (
    <div className="courses-view-container" style={{ padding: '24px 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0369a1', marginBottom: '8px' }}>
            Courses & Concept Modules
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', margin: 0 }}>
            Explore curriculum designed for technical placements. Each topic contains concept notes auto-converted to PDF
            and multiple choice quizzes to test your interview readiness.
          </p>
        </div>

        <button
          className="primary-btn"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onClick={() => setIsSubjectModalOpen(true)}
        >
          <Plus size={18} />
          <span>+ Create Subject</span>
        </button>
      </div>

      {successMsg && (
        <div
          className="alert alert-success"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            color: '#15803d',
            padding: '12px 18px',
            borderRadius: '14px',
            fontWeight: 700,
            marginBottom: '22px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Course Filter Bar & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        background: 'rgba(255, 255, 255, 0.92)',
        padding: '14px 20px',
        borderRadius: '16px',
        border: '1.5px solid #bae6fd',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setSelectedCourseId('All')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 700,
              background: selectedCourseId === 'All' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#e0f2fe',
              color: selectedCourseId === 'All' ? '#ffffff' : '#0369a1',
              border: '1px solid ' + (selectedCourseId === 'All' ? '#0284c7' : '#bae6fd'),
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: selectedCourseId === 'All' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
            }}
          >
            All Courses
          </button>
          {courses.map((c) => {
            const isSel = selectedCourseId === c.id.toString();
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id.toString())}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  background: isSel ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : '#ffedd5',
                  color: isSel ? '#ffffff' : '#c2410c',
                  border: '1px solid ' + (isSel ? '#ea580c' : '#fed7aa'),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSel ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px', flex: '1 1 220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search topic title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              color: '#0f172a',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading courses and topic details...
        </div>
      ) : error ? (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredCourses.map((course) => {
            const topics = (course.topics || []).filter((t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (searchQuery && topics.length === 0) return null;

            return (
              <div
                key={course.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: '1.5px solid #bae6fd',
                  padding: '28px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {/* Course Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1.5px solid #e0f2fe',
                  paddingBottom: '18px',
                  marginBottom: '22px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          background: '#e0f2fe',
                          color: '#0284c7',
                          border: '1px solid #bae6fd'
                        }}
                      >
                        {course.code}
                      </span>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {course.name}
                      </h2>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#475569' }}>
                      {course.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#ea580c', borderColor: '#fed7aa', background: '#fff7ed', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setTargetPdfCourseId(course.id);
                        setIsPdfModalOpen(true);
                      }}
                      title="Add a daily PDF or concept notes to this subject"
                    >
                      <FileUp size={15} />
                      <span>+ Add PDF</span>
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      onClick={() => onReadTopic(course.id, null)}
                    >
                      <BookOpen size={15} />
                      <span>All Notes</span>
                    </button>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      onClick={() => onStartPractice(course.id, null)}
                    >
                      <Award size={15} />
                      <span>Full Quiz</span>
                    </button>
                  </div>
                </div>

                {/* Topics Grid */}
                {topics.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    No topics currently added to this course.
                  </p>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                    gap: '16px'
                  }}>
                    {topics.map((topic, idx) => (
                      <div
                        key={topic.id}
                        style={{
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '14px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', background: '#ffedd5', padding: '2px 8px', borderRadius: '6px' }}>
                              Topic #{idx + 1}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                              {topic.questions_count ?? 0} Questions
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '6px 0 6px' }}>
                            {topic.name}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 16px', lineHeight: 1.5 }}>
                            {topic.description || 'Core placement concepts and interview questions.'}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                          <button
                            className="btn-ghost"
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              fontSize: '0.825rem',
                              fontWeight: 700,
                              color: '#0284c7',
                              background: '#e0f2fe',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                            onClick={() => onReadTopic(course.id, topic.id)}
                          >
                            <BookOpen size={14} />
                            <span>Read Note (PDF)</span>
                          </button>

                          <button
                            className="btn-ghost"
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              fontSize: '0.825rem',
                              fontWeight: 700,
                              color: '#16a34a',
                              background: '#dcfce7',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                            onClick={() => onStartPractice(course.id, topic.id)}
                          >
                            <Award size={14} />
                            <span>Quiz</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Subject Creation Modal (Student & Admin) */}
      <SubjectCreateModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onCreated={(newCourse) => {
          loadData();
          setSuccessMsg(`Subject "${newCourse.name}" created successfully!`);
          setTimeout(() => setSuccessMsg(null), 4000);
        }}
      />

      {/* Daily PDF & Concept Notes Upload Modal (Student & Admin) */}
      <DailyPdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        courses={courses}
        presetCourseId={targetPdfCourseId}
        onUploaded={(newMat) => {
          loadData();
          setSuccessMsg(`Daily PDF "${newMat.title}" added successfully!`);
          setTimeout(() => setSuccessMsg(null), 4000);
        }}
      />
    </div>
  );
}
