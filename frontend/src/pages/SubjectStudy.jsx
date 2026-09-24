import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Play,
  BookOpen,
  Terminal,
  Cpu,
  Coffee,
  TerminalSquare,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Eye,
  FileCheck,
  Filter,
  FileUp,
  Plus,
  CheckCircle2,
  Trash2,
  Award,
  ArrowLeft,
} from 'lucide-react';
import api from '../api';
import SubjectCreateModal from '../components/SubjectCreateModal';
import DailyPdfUploadModal from '../components/DailyPdfUploadModal';

const ICON_MAP = {
  code: Terminal,
  cpu: Cpu,
  coffee: Coffee,
  terminal: TerminalSquare,
  book: BookOpen,
};

export default function SubjectStudy({ initialCourseId, initialTopicId, onStartPractice, adminUser }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || null);
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId || 'All');
  const [materials, setMaterials] = useState([]);
  const [activeConcept, setActiveConcept] = useState(null);
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' | 'notes'
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'reader' (for phone screens)
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modals state (Students & Admins can create subjects & upload daily PDFs)
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handleDeleteMaterial = async () => {
    if (!activeConcept) return;
    if (!window.confirm(`As Super Admin, delete study material "${activeConcept.title}"?`)) return;
    try {
      await api.deleteMaterial(activeConcept.id);
      setSuccessMsg(`Material "${activeConcept.title}" has been deleted.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchMaterials();
    } catch (err) {
      setError(err.message || 'Failed to delete material');
    }
  };

  // Load courses initially
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses();
      setCourses(data);
      if (data && data.length > 0) {
        const found = initialCourseId ? data.find((c) => c.id.toString() === initialCourseId.toString()) : data[0];
        const activeCourse = found || data[0];
        setSelectedCourseId(activeCourse.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // When selected course or topic changes, fetch materials
  useEffect(() => {
    if (selectedCourseId) {
      fetchMaterials();
    }
  }, [selectedCourseId, selectedTopicId]);

  const fetchMaterials = async () => {
    try {
      setMaterialsLoading(true);
      setError(null);
      const filters = { course: selectedCourseId };
      if (selectedTopicId && selectedTopicId !== 'All') {
        filters.topic = selectedTopicId;
      }
      const data = await api.getMaterials(filters);
      setMaterials(data);
      if (data && data.length > 0) {
        if (initialTopicId) {
          const match = data.find((m) => m.topic?.toString() === initialTopicId.toString());
          setActiveConcept(match || data[0]);
        } else {
          setActiveConcept(data[0]);
        }
      } else {
        setActiveConcept(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load study materials');
    } finally {
      setMaterialsLoading(false);
    }
  };

  const currentCourse = courses.find((c) => c.id.toString() === selectedCourseId?.toString()) || courses[0];
  const topicsForCourse = currentCourse?.topics || [];
  const CourseIcon = ICON_MAP[currentCourse?.icon] || Terminal;
  const courseColor = currentCourse?.color || '#0284c7';

  // Simple parser to render markdown/word-like content into clean HTML elements
  const renderFormattedNotes = (content) => {
    if (!content) {
      return <p style={{ color: '#64748b' }}>No written notes available for this concept.</p>;
    }

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} style={{ height: '10px' }} />;
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1', marginTop: '16px', marginBottom: '8px', borderBottom: '2px solid #bae6fd', paddingBottom: '6px' }}>
            {trimmed.replace('# ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ea580c', marginTop: '20px', marginBottom: '8px' }}>
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        const text = trimmed.substring(2);
        return (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', lineHeight: 1.6, color: '#334155' }}>
            <span style={{ color: '#16a34a', fontWeight: 900 }}>•</span>
            <span>{text}</span>
          </div>
        );
      }
      return (
        <p key={idx} style={{ fontSize: '1rem', lineHeight: 1.65, color: '#334155', marginBottom: '8px' }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Course Navigation Tabs (Dynamic) */}
      <div className="study-course-tabs">
        {courses.map((course) => {
          const Icon = ICON_MAP[course.icon] || Terminal;
          const isActive = selectedCourseId?.toString() === course.id.toString();
          return (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedTopicId('All');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#e0f2fe',
                border: `1.5px solid ${isActive ? '#0284c7' : '#bae6fd'}`,
                color: isActive ? '#ffffff' : '#0369a1',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.925rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : '#0284c7'} />
              <span>{course.name}</span>
            </button>
          );
        })}

        {/* Allow Student and Admin to Create a New Subject */}
        <button
          onClick={() => setIsSubjectModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1.5px dashed #0284c7',
            color: '#0284c7',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
          title="Create a new Subject"
        >
          <Plus size={16} />
          <span>+ New Subject</span>
        </button>
      </div>

      {/* Success Notification */}
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
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Same-Tab Bridge Banner: Read -> Practice with Topic Selector */}
      <div className="study-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: '#e0f2fe',
              border: '1.5px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CourseIcon size={26} color="#0284c7" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {currentCourse?.name || 'Course'} Concept Notes & PDF Study
            </h2>
            <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '2px' }}>
              Study concept-wise notes in-browser (same tab), then attend the practice quiz to evaluate your score.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Topic filter dropdown */}
          {topicsForCourse.length > 0 && (
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <option value="All">All Topics ({topicsForCourse.length})</option>
              {topicsForCourse.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}

          {/* Student & Admin Add Daily PDF button */}
          <button
            className="primary-btn"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontWeight: 700,
            }}
            onClick={() => setIsPdfModalOpen(true)}
            title="Upload a PDF file or write notes into this subject"
          >
            <FileUp size={17} />
            <span>+ Add Daily PDF</span>
          </button>

          <button
            className="primary-btn"
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', color: '#ffffff', fontWeight: 700 }}
            onClick={() => onStartPractice(selectedCourseId, selectedTopicId !== 'All' ? selectedTopicId : null)}
          >
            <Play size={17} fill="currentColor" />
            <span>Attend Quiz</span>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading || materialsLoading ? (
        <div className="empty-state">
          <p>Loading concept notes and in-browser viewer...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={44} />
          <h3>No concept notes available for this selection</h3>
          <p style={{ marginTop: '8px' }}>
            Admins can add concept notes in Word format and compile them to PDF in the Admin Portal.
          </p>
        </div>
      ) : (
        <div>
          {/* Mobile Tab Switcher */}
          <div className="study-mobile-nav">
            <button
              className={`study-mobile-tab ${mobileTab === 'list' ? 'active' : ''}`}
              onClick={() => setMobileTab('list')}
            >
              <BookOpen size={16} />
              <span>Modules List ({materials.length})</span>
            </button>
            <button
              className={`study-mobile-tab ${mobileTab === 'reader' ? 'active' : ''}`}
              onClick={() => setMobileTab('reader')}
            >
              <Eye size={16} />
              <span>Reading Pane</span>
            </button>
          </div>

          <div className="study-split-layout">
            {/* Left Column: Concept List */}
            <div
              className={`study-modules-col ${mobileTab === 'reader' ? 'hidden-on-mobile' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Study Modules ({materials.length})
              </h3>

              {materials.map((item) => {
                const isSelected = activeConcept?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveConcept(item);
                      setMobileTab('reader');
                    }}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #e0f2fe 0%, #ffedd5 100%)' : '#ffffff',
                    border: `1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <FileText size={20} color={isSelected ? '#0284c7' : '#64748b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                        {item.title}
                      </h4>
                      {item.topic_name && (
                        <p style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 600, marginTop: '3px' }}>
                          Topic: {item.topic_name}
                        </p>
                      )}
                      {item.uploaded_at && (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          📅 Added {new Date(item.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                    <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {item.file_size_formatted || 'PDF Available'}
                    </span>
                    <a
                      href={api.getMaterialPdfUrl(item.id)}
                      download
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: '#0284c7',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: In-Browser Document & PDF Reader (Strictly Same Tab) */}
          <div className={`study-reader-col ${mobileTab === 'list' ? 'hidden-on-mobile' : ''}`}>
            {activeConcept ? (
              <>
                {/* Mobile Back Button to Modules List */}
                <div className="mobile-back-to-list" style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                  <button
                    type="button"
                    onClick={() => setMobileTab('list')}
                    className="secondary-btn btn-sm"
                    style={{
                      color: '#0284c7',
                      borderColor: '#bae6fd',
                      background: '#f0f9ff',
                      fontWeight: 700,
                    }}
                  >
                    <ArrowLeft size={15} />
                    <span>Back to Modules List</span>
                  </button>
                </div>

                {/* Controls Bar: Switch between PDF Mode and Notes Mode */}
                <div className="study-reader-header">
                  <div>
                    <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {activeConcept.title}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Topic: <strong style={{ color: '#0284c7' }}>{activeConcept.topic_name || 'General'}</strong> • Same-Tab Reader
                    </span>
                  </div>

                  <div className="study-reader-actions">
                    {/* Mode Toggle Button */}
                    <div className="role-switcher">
                      <button
                        type="button"
                        className={`role-tab ${viewMode === 'pdf' ? 'active' : ''}`}
                        onClick={() => setViewMode('pdf')}
                      >
                        <FileCheck size={14} />
                        <span>PDF View</span>
                      </button>
                      <button
                        type="button"
                        className={`role-tab ${viewMode === 'notes' ? 'active' : ''}`}
                        onClick={() => setViewMode('notes')}
                      >
                        <Eye size={14} />
                        <span>Notes View</span>
                      </button>
                    </div>

                    <a
                      href={api.getMaterialPdfUrl(activeConcept.id)}
                      download
                      className="secondary-btn btn-sm"
                      style={{ borderColor: '#bae6fd', color: '#0284c7' }}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </a>

                    {adminUser && (
                      <button
                        type="button"
                        onClick={handleDeleteMaterial}
                        className="danger-btn btn-sm"
                        title="As Super Admin, delete this study material if it is not good"
                      >
                        <Trash2 size={14} />
                        <span>Delete Material</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Viewport: Either In-Browser PDF Frame or Formatted Notes Document */}
                {viewMode === 'pdf' ? (
                  <div
                    style={{
                      width: '100%',
                      height: 'clamp(460px, 68vh, 740px)',
                      background: '#f8fafc',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1.5px solid #e2e8f0',
                    }}
                  >
                    <iframe
                      src={api.getMaterialPdfUrl(activeConcept.id)}
                      title={activeConcept.title}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8f0',
                      padding: '24px',
                      maxHeight: 'clamp(460px, 68vh, 740px)',
                      overflowY: 'auto',
                    }}
                  >
                    {renderFormattedNotes(activeConcept.content)}
                  </div>
                )}

                {/* Bottom Call to Action: Attend test on this specific concept */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #fefce8 100%)',
                    border: '1.5px solid #86efac',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: '1 1 240px' }}>
                    <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: '#15803d', margin: 0 }}>
                      Ready to check your understanding?
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#334155', margin: '3px 0 0' }}>
                      Attend the placement quiz for {activeConcept.topic_name || activeConcept.course_name} and get your instant score.
                    </p>
                  </div>

                  <button
                    className="primary-btn btn-sm"
                    style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#ffffff' }}
                    onClick={() => onStartPractice(selectedCourseId, activeConcept.topic)}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Attend Test</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Select a concept from the left to read its notes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Subject Creation Modal (Student & Admin) */}
      <SubjectCreateModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onCreated={(newCourse) => {
          setCourses((prev) => [...prev, newCourse]);
          setSelectedCourseId(newCourse.id);
          setSelectedTopicId('All');
          setSuccessMsg(`Subject "${newCourse.name}" created successfully!`);
          setTimeout(() => setSuccessMsg(null), 4000);
        }}
      />

      {/* Daily PDF & Concept Notes Upload Modal (Student & Admin) */}
      <DailyPdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        courses={courses}
        presetCourseId={selectedCourseId}
        presetTopicId={selectedTopicId !== 'All' ? selectedTopicId : ''}
        onUploaded={(newMat) => {
          fetchMaterials();
          setSuccessMsg(`Daily PDF "${newMat.title}" published successfully!`);
          setTimeout(() => setSuccessMsg(null), 4000);
        }}
      />
    </div>
  );
}
