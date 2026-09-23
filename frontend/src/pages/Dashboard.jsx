import React, { useEffect, useState } from 'react';
import {
  Play,
  BookCheck,
  Layers,
  Award,
  Terminal,
  Cpu,
  Coffee,
  TerminalSquare,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import api from '../api';
import SubjectCreateModal from '../components/SubjectCreateModal';

const ICON_MAP = {
  code: Terminal,
  cpu: Cpu,
  coffee: Coffee,
  terminal: TerminalSquare,
  book: BookCheck,
};

export default function Dashboard({ onStartPractice, onReadCourse, onExploreCourse }) {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, coursesData] = await Promise.all([
        api.getStats(),
        api.getCourses(),
      ]);
      setStats(statsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hero Section with Vibrant Gradient & Micro-Badges */}
      <section className="dashboard-hero">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #fff7ed 50%, #fefce8 100%)',
            border: '1.5px solid #fed7aa',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.08)',
          }}
        >
          <Sparkles size={16} color="#ea580c" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            2026 Campus & Technical Recruitment Suite
          </span>
        </div>

        <h1 className="hero-title">
          Placement Preparation & Assessment
        </h1>
        <p className="hero-subtitle">
          Master interview-grade questions, prepare with curated concept notes, attend topic-wise quizzes,
          and track your placement readiness—all within a single responsive workspace.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button
            className="primary-btn"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
            }}
            onClick={() => {
              if (courses.length > 0) {
                onStartPractice(courses[0].id);
              }
            }}
          >
            <Play size={18} fill="currentColor" />
            <span>Start Practice Quiz</span>
          </button>

          <button
            className="secondary-btn"
            style={{
              padding: '12px 20px',
              fontSize: '0.95rem',
            }}
            onClick={() => setIsSubjectModalOpen(true)}
          >
            <Plus size={18} />
            <span>+ New Subject</span>
          </button>
        </div>
      </section>

      {/* Summary stats bar with 4-color harmony & icons */}
      <section className="stats-bar">
        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <Layers size={16} color="#0284c7" />
            <span className="stat-label">Active Courses</span>
          </div>
          <span className="stat-val" style={{ color: '#0284c7' }}>
            {stats?.total_courses ?? courses.length}
          </span>
        </div>

        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <FileText size={16} color="#ea580c" />
            <span className="stat-label">Total Topics</span>
          </div>
          <span className="stat-val" style={{ color: '#ea580c' }}>
            {stats?.total_topics ?? '...'}
          </span>
        </div>

        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <Award size={16} color="#16a34a" />
            <span className="stat-label">Quiz Questions</span>
          </div>
          <span className="stat-val" style={{ color: '#16a34a' }}>
            {stats?.total_questions ?? '...'}
          </span>
        </div>

        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <BookCheck size={16} color="#ca8a04" />
            <span className="stat-label">Study Guides</span>
          </div>
          <span className="stat-val" style={{ color: '#ca8a04' }}>
            {stats?.total_materials ?? '...'}
          </span>
        </div>

        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <TrendingUp size={16} color="#0ea5e9" />
            <span className="stat-label">Tests Taken</span>
          </div>
          <span className="stat-val" style={{ color: '#0ea5e9' }}>
            {stats?.total_test_results ?? 0}
          </span>
        </div>
      </section>

      {/* Dynamic Courses Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.45rem)', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Explore Subjects & Concept Modules
          </h2>
          <p style={{ margin: '3px 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Select a subject to read daily PDF notes or evaluate yourself with quizzes
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
            padding: '9px 18px',
            fontSize: '0.875rem',
          }}
          onClick={() => setIsSubjectModalOpen(true)}
          title="Create a new Subject"
        >
          <Plus size={16} />
          <span>+ Create Subject</span>
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #bae6fd',
              borderTopColor: '#0284c7',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 14px',
            }}
          />
          <p style={{ fontWeight: 600 }}>Loading subjects and syllabus materials...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : (
        <section className="subject-grid">
          {courses.map((course) => {
            const Icon = ICON_MAP[course.icon] || Terminal;
            const topicCount = course.topics?.length ?? 0;
            const questionCount = course.questions_count ?? 0;

            return (
              <div key={course.id} className="subject-card">
                <div className="subject-header">
                  <div
                    className="subject-icon-box"
                    style={{ background: '#e0f2fe', color: '#0284c7', border: '1.5px solid #bae6fd' }}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className="badge badge-subject"
                    style={{ background: '#ffedd5', color: '#ea580c', border: '1px solid #fed7aa' }}
                  >
                    {course.code}
                  </span>
                </div>

                <h3 className="subject-name">{course.name}</h3>

                <p className="subject-count" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span><strong style={{ color: '#0284c7' }}>{topicCount}</strong> Topics</span>
                  <span>•</span>
                  <span><strong style={{ color: '#16a34a' }}>{questionCount}</strong> Questions</span>
                </p>

                <p
                  style={{
                    color: '#475569',
                    fontSize: '0.875rem',
                    marginBottom: '20px',
                    minHeight: '42px',
                    lineHeight: 1.5,
                  }}
                >
                  {course.description || 'Comprehensive placement syllabus and concepts.'}
                </p>

                {/* Dual Action Buttons for Student */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                  <button
                    className="btn-start"
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                    }}
                    onClick={() => onReadCourse(course.id)}
                  >
                    <BookCheck size={16} />
                    <span>Study Notes & PDF</span>
                  </button>

                  <button
                    className="btn-start"
                    style={{
                      background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                      color: '#ffffff',
                    }}
                    onClick={() => onStartPractice(course.id)}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Attend Placement Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Subject Creation Modal */}
      <SubjectCreateModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onCreated={(newCourse) => {
          setCourses((prev) => [...prev, newCourse]);
          setSuccessMsg(`Subject "${newCourse.name}" created successfully!`);
          setTimeout(() => setSuccessMsg(null), 4000);
        }}
      />
    </div>
  );
}
