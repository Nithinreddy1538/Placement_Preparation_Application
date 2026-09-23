import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  FileQuestion,
  Layers,
  Sparkles,
  Download,
  X,
  UploadCloud,
  BookOpen,
  Award,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  FileUp,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import api from '../api';
import QuestionModal from '../components/QuestionModal';

export default function Admin({ onPreviewMaterial, onReadSubject, adminUser, onLogout }) {
  // Tabs: 'courses' | 'questions' | 'materials' | 'results'
  const [adminTab, setAdminTab] = useState('courses');

  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters for questions
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    icon: 'code',
    color: '#0284c7',
  });

  // Topic Modal State
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({
    course: '',
    name: '',
    description: '',
    order: 1,
  });

  // Question Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionPresets, setQuestionPresets] = useState({ courseId: null, topicId: null });

  // Material Modal State (Word notes + PDF sync)
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    course: '',
    topic: '',
    title: '',
    description: '',
    content: '',
  });
  const [pdfUploadFile, setPdfUploadFile] = useState(null);

  // Filter for materials tab
  const [materialCourseFilter, setMaterialCourseFilter] = useState('All');

  // Test Result inspection modal
  const [inspectingResult, setInspectingResult] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [adminTab]);

  useEffect(() => {
    if (adminTab === 'questions') {
      const timer = setTimeout(() => {
        loadQuestions();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [search, courseFilter, topicFilter, diffFilter]);

  useEffect(() => {
    if (adminTab === 'materials') {
      loadMaterials();
    }
  }, [materialCourseFilter]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, coursesData] = await Promise.all([
        api.getStats(),
        api.getCourses(),
      ]);
      setStats(statsData);
      setCourses(coursesData);

      if (adminTab === 'questions') {
        await loadQuestions();
      } else if (adminTab === 'materials') {
        await loadMaterials();
      } else if (adminTab === 'results') {
        const resData = await api.getTestResults();
        setTestResults(resData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      const filters = { search, difficulty: diffFilter };
      if (courseFilter !== 'All') filters.course = courseFilter;
      if (topicFilter !== 'All') filters.topic = topicFilter;
      const data = await api.getQuestions(filters);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMaterials = async () => {
    try {
      const filters = {};
      if (materialCourseFilter !== 'All') filters.course = materialCourseFilter;
      const mats = await api.getMaterials(filters);
      setMaterials(mats);
    } catch (err) {
      console.error(err);
    }
  };

  // COURSE HANDLERS
  const handleOpenCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        name: course.name,
        code: course.code,
        description: course.description || '',
        icon: course.icon || 'code',
        color: course.color || '#0284c7',
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        name: '',
        code: '',
        description: '',
        icon: 'code',
        color: '#0284c7',
      });
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.updateCourse(editingCourse.id, courseForm);
        showNotification(`Subject "${courseForm.name}" updated successfully.`);
      } else {
        await api.createCourse(courseForm);
        showNotification(`New Subject "${courseForm.name}" created successfully.`);
      }
      setIsCourseModalOpen(false);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to save subject');
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to delete subject "${courseName}" and its topics?`)) return;
    try {
      await api.deleteCourse(courseId);
      showNotification(`Subject "${courseName}" deleted.`);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to delete subject');
    }
  };

  // TOPIC HANDLERS (Admin side only)
  const handleOpenTopicModal = (courseId, topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicForm({
        course: courseId,
        name: topic.name,
        description: topic.description || '',
        order: topic.order || 1,
      });
    } else {
      setEditingTopic(null);
      setTopicForm({
        course: courseId,
        name: '',
        description: '',
        order: 1,
      });
    }
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...topicForm,
        course: parseInt(topicForm.course),
        order: parseInt(topicForm.order) || 1,
      };
      if (editingTopic) {
        await api.updateTopic(editingTopic.id, payload);
        showNotification(`Topic "${topicForm.name}" updated.`);
      } else {
        await api.createTopic(payload);
        showNotification(`Topic "${topicForm.name}" created.`);
      }
      setIsTopicModalOpen(false);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to save topic');
    }
  };

  const handleDeleteTopic = async (topicId, topicName) => {
    if (!window.confirm(`Delete topic "${topicName}"?`)) return;
    try {
      await api.deleteTopic(topicId);
      showNotification(`Topic "${topicName}" deleted.`);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to delete topic');
    }
  };

  // QUESTION HANDLERS
  const handleOpenQuestionModal = (q = null, courseId = null, topicId = null) => {
    setEditingQuestion(q);
    setQuestionPresets({ courseId, topicId });
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz question?')) return;
    try {
      await api.deleteQuestion(id);
      showNotification('Question deleted successfully.');
      loadQuestions();
      api.getStats().then(setStats);
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    }
  };

  // DAILY PDF & STUDY MATERIAL HANDLERS
  const handleOpenMaterialModal = (mat = null, presetCourseId = null, presetTopicId = null) => {
    if (mat) {
      setEditingMaterial(mat);
      setMaterialForm({
        course: mat.course || '',
        topic: mat.topic || '',
        title: mat.title,
        description: mat.description || '',
        content: mat.content || '',
      });
    } else {
      setEditingMaterial(null);
      const targetCourse = presetCourseId || (courses[0]?.id ?? '');
      setMaterialForm({
        course: targetCourse,
        topic: presetTopicId || '',
        title: `Day ${(materials.length % 30) + 1} - Study Guide & Notes`,
        description: 'Comprehensive concept overview and interview questions.',
        content: '# Daily Concept Overview\n\n• Point 1: Key definition\n• Point 2: Core placement algorithm or rule\n\n## Code Example\nWrite explanation or sample code here...',
      });
    }
    setPdfUploadFile(null);
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    try {
      if (pdfUploadFile) {
        const formData = new FormData();
        formData.append('course', materialForm.course);
        if (materialForm.topic) formData.append('topic', materialForm.topic);
        formData.append('title', materialForm.title);
        formData.append('description', materialForm.description);
        formData.append('content', materialForm.content || '');
        formData.append('file', pdfUploadFile);

        if (editingMaterial) {
          await api.updateMaterial(editingMaterial.id, formData);
          showNotification('Daily PDF updated successfully.');
        } else {
          await api.uploadMaterial(formData);
          showNotification('Daily PDF uploaded and published to Subject!');
        }
      } else {
        const payload = {
          ...materialForm,
          course: parseInt(materialForm.course),
          topic: materialForm.topic ? parseInt(materialForm.topic) : null,
        };

        if (editingMaterial) {
          await api.updateMaterial(editingMaterial.id, payload);
          showNotification('Concept notes updated and auto-compiled to PDF.');
        } else {
          const res = await fetch(`http://${window.location.hostname || '127.0.0.1'}:8000/api/materials/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Failed to create material');
          showNotification('Daily note created and auto-compiled to PDF.');
        }
      }

      setIsMaterialModalOpen(false);
      await loadMaterials();
    } catch (err) {
      setError(err.message || 'Failed to save study notes');
    }
  };

  const handleDeleteMaterial = async (id, title) => {
    if (!window.confirm(`Delete study material "${title}"?`)) return;
    try {
      await api.deleteMaterial(id);
      showNotification('Study material removed.');
      await loadMaterials();
    } catch (err) {
      setError(err.message || 'Failed to delete material');
    }
  };

  // Find topics for current materialForm.course
  const currentCourseTopics = (courses.find((c) => c.id.toString() === materialForm.course?.toString())?.topics) || [];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 0' }}>
      {/* Super Admin Status Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #fefce8 50%, #f0fdf4 100%)',
          border: '1.5px solid #fed7aa',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#ffedd5',
              border: '1.5px solid #fdba74',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Super Admin Session Active
              </span>
              <span
                style={{
                  background: '#ffedd5',
                  color: '#ea580c',
                  fontSize: '0.725rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  border: '1px solid #fed7aa',
                }}
              >
                {adminUser?.username || 'admin'}
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              Authorized to edit subjects, topics, upload daily PDFs/files, and manage placement quizzes.
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1.5px solid #f97316',
              color: '#ea580c',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={14} />
            <span>Logout Super Admin</span>
          </button>
        )}
      </div>

      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0369a1', margin: 0 }}>
            Placement Portal Administration
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', marginTop: '4px' }}>
            Manage Subjects, Topics, Daily PDFs, and Placement Quiz Assessments.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="primary-btn"
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
            onClick={() => handleOpenCourseModal()}
          >
            <Plus size={16} />
            <span>Create New Subject</span>
          </button>

          <button
            className="primary-btn"
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}
            onClick={() => handleOpenMaterialModal()}
          >
            <FileUp size={16} />
            <span>Add Daily PDF</span>
          </button>

          <button
            className="primary-btn"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
            onClick={() => handleOpenQuestionModal()}
          >
            <Award size={16} />
            <span>Add Quiz Question</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#c2410c', marginLeft: 'auto', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid #bae6fd', marginBottom: '24px', overflowX: 'auto', paddingBottom: '6px', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
        <button
          className={`nav-btn ${adminTab === 'courses' ? 'active' : ''}`}
          onClick={() => setAdminTab('courses')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Layers size={17} />
          <span>Subjects & Topics ({courses.length})</span>
        </button>

        <button
          className={`nav-btn ${adminTab === 'materials' ? 'active' : ''}`}
          onClick={() => setAdminTab('materials')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <FileText size={17} />
          <span>Daily PDFs & Guides ({materials.length || stats?.total_materials || 0})</span>
        </button>

        <button
          className={`nav-btn ${adminTab === 'questions' ? 'active' : ''}`}
          onClick={() => setAdminTab('questions')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <FileQuestion size={17} />
          <span>Quiz Questions ({stats?.total_questions ?? '...'})</span>
        </button>

        <button
          className={`nav-btn ${adminTab === 'results' ? 'active' : ''}`}
          onClick={() => setAdminTab('results')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Award size={17} />
          <span>Student Test Scores ({testResults.length || stats?.total_test_results || 0})</span>
        </button>
      </div>

      {/* TAB 1: SUBJECTS & TOPICS MANAGEMENT */}
      {adminTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid #bae6fd',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Course Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: '#e0f2fe',
                      color: '#0284c7',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    {course.code}
                  </span>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {course.name}
                    </h2>
                    <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#475569' }}>
                      {course.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons for this Course/Subject */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.825rem' }}
                    onClick={() => handleOpenTopicModal(course.id)}
                    title="Add Topic to this Subject (Admin Only)"
                  >
                    <Plus size={14} />
                    <span>Add Topic</span>
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.825rem', borderColor: '#fed7aa', color: '#ea580c', background: '#fff7ed' }}
                    onClick={() => handleOpenMaterialModal(null, course.id)}
                    title="Upload or Add Daily PDF for this Subject"
                  >
                    <FileUp size={14} />
                    <span>+ Daily PDF</span>
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.825rem', borderColor: '#86efac', color: '#16a34a', background: '#f0fdf4' }}
                    onClick={() => handleOpenQuestionModal(null, course.id)}
                    title="Add Quiz Question to this Subject"
                  >
                    <Award size={14} />
                    <span>+ Quiz Question</span>
                  </button>

                  <button
                    className="btn-ghost"
                    style={{ padding: '6px 10px', color: '#0284c7' }}
                    onClick={() => handleOpenCourseModal(course)}
                    title="Edit Subject Details"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    className="btn-ghost"
                    style={{ padding: '6px 10px', color: '#ea580c' }}
                    onClick={() => handleDeleteCourse(course.id, course.name)}
                    title="Delete Subject"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Topics List Under This Subject (Managed on Admin Side Only) */}
              <div style={{ borderTop: '1.5px solid #e0f2fe', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                    Topics Configured in this Subject ({(course.topics || []).length})
                  </h4>
                  <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                    Topics can be created & modified by Admin only
                  </span>
                </div>

                {(course.topics || []).length === 0 ? (
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                      No topics added yet. Click <strong>"Add Topic"</strong> above to organize concept modules.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                    {course.topics.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '8px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>
                              {t.name}
                            </div>
                            <div style={{ fontSize: '0.785rem', color: '#ea580c', fontWeight: 600, marginTop: '2px' }}>
                              {t.questions_count ?? 0} Questions • Order #{t.order}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              className="btn-ghost"
                              style={{ padding: '4px 6px', color: '#0284c7' }}
                              onClick={() => handleOpenTopicModal(course.id, t)}
                              title="Edit Topic"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="btn-ghost"
                              style={{ padding: '4px 6px', color: '#ea580c' }}
                              onClick={() => handleDeleteTopic(t.id, t.name)}
                              title="Delete Topic"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Quick links to add daily PDF or quiz directly to this topic */}
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                          <button
                            className="btn-ghost"
                            style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', background: '#ffedd5', borderRadius: '6px' }}
                            onClick={() => handleOpenMaterialModal(null, course.id, t.id)}
                          >
                            + Daily PDF
                          </button>
                          <button
                            className="btn-ghost"
                            style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', borderRadius: '6px' }}
                            onClick={() => handleOpenQuestionModal(null, course.id, t.id)}
                          >
                            + Quiz Q
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DAILY PDFS & STUDY GUIDES */}
      {adminTab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'var(--bg-card)',
            padding: '14px 20px',
            borderRadius: '16px',
            border: '1.5px solid #bae6fd',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0369a1' }}>Filter by Subject:</span>
              <select
                className="select-input"
                value={materialCourseFilter}
                onChange={(e) => setMaterialCourseFilter(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                <option value="All">All Subjects</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              className="primary-btn"
              style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}
              onClick={() => handleOpenMaterialModal()}
            >
              <FileUp size={16} />
              <span>Add Daily PDF to Subject</span>
            </button>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid #bae6fd',
            borderRadius: '18px',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-card)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#e0f2fe', borderBottom: '1.5px solid #bae6fd', color: '#0369a1' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Daily PDF / Guide Title</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Subject</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Topic</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Type / Sync</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Uploaded Date</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => {
                  const uploadDate = new Date(m.uploaded_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                        {m.title}
                        {m.description && <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500 }}>{m.description}</div>}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#0284c7', fontWeight: 700 }}>
                        {m.course_name}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>
                        {m.topic_name || 'General Subject Note'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          background: m.file ? '#dcfce7' : '#e0f2fe',
                          color: m.file ? '#16a34a' : '#0284c7',
                          border: `1px solid ${m.file ? '#86efac' : '#bae6fd'}`
                        }}>
                          {m.file ? 'Uploaded File PDF' : 'Word / Auto-PDF'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.825rem' }}>
                        {uploadDate}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-ghost"
                            style={{ padding: '6px 8px', color: '#0284c7' }}
                            onClick={() => onReadSubject(m.course, m.topic)}
                            title="Read in Browser (Same Tab)"
                          >
                            <BookOpen size={16} />
                          </button>
                          <a
                            href={api.getMaterialPdfUrl(m.id)}
                            download
                            className="btn-ghost"
                            style={{ padding: '6px 8px', color: '#0284c7' }}
                            title="Download Generated PDF"
                          >
                            <Download size={16} />
                          </a>
                          <button
                            className="btn-ghost"
                            style={{ padding: '6px 8px', color: '#0284c7' }}
                            onClick={() => handleOpenMaterialModal(m)}
                            title="Edit Notes / Replace PDF"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-ghost"
                            style={{ padding: '6px 8px', color: '#ea580c' }}
                            onClick={() => handleDeleteMaterial(m.id, m.title)}
                            title="Delete PDF"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ QUESTIONS MANAGEMENT */}
      {adminTab === 'questions' && (
        <div>
          {/* Question Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
            padding: '14px 18px',
            borderRadius: '16px',
            border: '1.5px solid #bae6fd',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                className="select-input"
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setTopicFilter('All');
                }}
                style={{ fontWeight: 600 }}
              >
                <option value="All">All Subjects</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                className="select-input"
                value={diffFilter}
                onChange={(e) => setDiffFilter(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search question statement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          {/* Question List Table */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid #bae6fd',
            borderRadius: '18px',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-card)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#e0f2fe', borderBottom: '1.5px solid #bae6fd', color: '#0369a1' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Question Statement</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Subject & Topic</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Difficulty</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Correct Answer</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', maxWidth: '400px', fontWeight: 600, color: '#0f172a' }}>
                      {q.question}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: '#0284c7', fontWeight: 700 }}>{q.course_name}</span>
                      {q.topic_name && <span style={{ color: '#64748b' }}> • {q.topic_name}</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#16a34a' }}>
                      Option {q.correct_option}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-ghost"
                          style={{ padding: '6px 8px', color: '#0284c7' }}
                          onClick={() => handleOpenQuestionModal(q)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ padding: '6px 8px', color: '#ea580c' }}
                          onClick={() => handleDeleteQuestion(q.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT TEST SCORES & ANALYTICS */}
      {adminTab === 'results' && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1.5px solid #bae6fd',
          borderRadius: '18px',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-card)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#e0f2fe', borderBottom: '1.5px solid #bae6fd', color: '#0369a1' }}>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Candidate Name</th>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Subject</th>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Topic</th>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Score</th>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Percentage</th>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Result</th>
                <th style={{ padding: '14px 16px', fontWeight: 800 }}>Attempted On</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800 }}>Scorecard</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                    {res.student_name}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#0284c7', fontWeight: 700 }}>
                    {res.course_name || 'General'}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    {res.topic_name || 'All Topics'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                    {res.score} / {res.total_questions}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: res.passed ? '#16a34a' : '#ea580c' }}>
                    {res.percentage}%
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: res.passed ? '#dcfce7' : '#ffedd5',
                      color: res.passed ? '#15803d' : '#c2410c',
                    }}>
                      {res.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem' }}>
                    {new Date(res.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      className="btn-ghost"
                      style={{ padding: '6px 10px', color: '#0284c7' }}
                      onClick={() => setInspectingResult(res)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT SUBJECT MODAL */}
      {isCourseModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCourseModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingCourse ? 'Edit Subject' : 'Create New Subject'}</h2>
              <button className="close-btn" onClick={() => setIsCourseModalOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCourse}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Subject Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Python for Placements, Data Structures"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Subject Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. PYTHON, DSA"
                      value={courseForm.code}
                      onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Accent Color</label>
                    <input
                      type="color"
                      className="form-control"
                      value={courseForm.color}
                      onChange={(e) => setCourseForm({ ...courseForm, color: e.target.value })}
                      style={{ height: '44px', padding: '4px' }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Brief description of the placement syllabus, interview topics..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCourseModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingCourse ? 'Update Subject' : 'Create Subject'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT TOPIC MODAL (Admin Side Only) */}
      {isTopicModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsTopicModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingTopic ? 'Edit Topic' : 'Add New Topic to Subject'}</h2>
              <button className="close-btn" onClick={() => setIsTopicModalOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTopic}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Topic Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Memory Layout & Virtual Memory, Collections Framework"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Topic Description</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="Key concepts covered in this topic..."
                    value={topicForm.description}
                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order Sequence</label>
                  <input
                    type="number"
                    className="form-control"
                    value={topicForm.order}
                    onChange={(e) => setTopicForm({ ...topicForm, order: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsTopicModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingTopic ? 'Update Topic' : 'Add Topic'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUIZ QUESTION MODAL */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={() => {
          loadQuestions();
          api.getStats().then(setStats);
          showNotification('Quiz question saved successfully.');
        }}
        editingQuestion={editingQuestion}
        courses={courses}
        presetCourseId={questionPresets.courseId}
        presetTopicId={questionPresets.topicId}
      />

      {/* DAILY PDF & STUDY NOTE MODAL */}
      {isMaterialModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsMaterialModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMaterial ? 'Edit Study Material / PDF' : 'Upload Daily PDF / Add Study Note'}
              </h2>
              <button className="close-btn" onClick={() => setIsMaterialModalOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMaterial}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select
                      className="form-control"
                      value={materialForm.course}
                      onChange={(e) => setMaterialForm({ ...materialForm, course: e.target.value, topic: '' })}
                      required
                    >
                      <option value="">Select Subject</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Topic (Optional)</label>
                    <select
                      className="form-control"
                      value={materialForm.topic}
                      onChange={(e) => setMaterialForm({ ...materialForm, topic: e.target.value })}
                    >
                      <option value="">General (All Topics / Daily Notes)</option>
                      {currentCourseTopics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Day 1 - Variables, Pointers & Memory Layout PDF"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Summary</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Daily concept notes and interview preparation guide"
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  />
                </div>

                {/* File Upload Option */}
                <div style={{ background: '#f0f9ff', border: '1.5px dashed #0284c7', borderRadius: '12px', padding: '16px 20px' }}>
                  <label className="form-label" style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UploadCloud size={18} />
                    <span>Upload Daily PDF File</span>
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control"
                    style={{ background: '#ffffff', marginTop: '6px' }}
                    onChange={(e) => setPdfUploadFile(e.target.files[0] || null)}
                  />
                  <span style={{ fontSize: '0.785rem', color: '#475569', marginTop: '4px', display: 'block' }}>
                    Attach your daily PDF document here. Students can view it in the in-browser reader or download it.
                  </span>
                </div>

                {/* Concept Notes Option */}
                <div className="form-group">
                  <label className="form-label">Or Write / Edit Concept Notes (Auto-Compiles to PDF)</label>
                  <textarea
                    rows="6"
                    className="form-control"
                    style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                    placeholder="# Main Concept Heading&#10;&#10;• Bullet point summary&#10;• Interview FAQ explanation&#10;&#10;## Subsection Title"
                    value={materialForm.content}
                    onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Tip: If no PDF file is attached, notes written here will automatically compile to a downloadable/viewable PDF for users via ReportLab.
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsMaterialModalOpen(false)}>Cancel</button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}
                >
                  {editingMaterial ? 'Update Material' : 'Publish Daily PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT RESULT MODAL */}
      {inspectingResult && (
        <div className="modal-backdrop" onClick={() => setInspectingResult(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{inspectingResult.student_name}'s Attempt Scorecard</h2>
              <button className="close-btn" onClick={() => setInspectingResult(null)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Score</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7' }}>
                    {inspectingResult.score} / {inspectingResult.total_questions}
                  </div>
                </div>
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c' }}>Percentage</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: inspectingResult.passed ? '#16a34a' : '#ea580c' }}>
                    {inspectingResult.percentage}%
                  </div>
                </div>
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ca8a04' }}>Status</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: inspectingResult.passed ? '#16a34a' : '#ea580c', marginTop: '3px' }}>
                    {inspectingResult.passed ? 'PASSED' : 'FAILED'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                {(inspectingResult.answers_data || []).map((ans, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: ans.is_correct ? '#f0fdf4' : '#fff7ed',
                      border: `1px solid ${ans.is_correct ? '#86efac' : '#fed7aa'}`,
                      borderRadius: '10px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      {ans.is_correct ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ea580c" />}
                      <span>Q{idx + 1}. {ans.question_text || `Question #${ans.question_id}`}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginLeft: '24px', marginTop: '3px' }}>
                      Selected: <strong style={{ color: ans.is_correct ? '#16a34a' : '#ea580c' }}>Option {ans.selected_option}</strong> • Correct: <strong style={{ color: '#16a34a' }}>Option {ans.correct_option}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setInspectingResult(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
