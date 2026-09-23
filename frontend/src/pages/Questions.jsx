import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, CheckCircle, BookOpen, Layers } from 'lucide-react';
import api from '../api';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  // Expanded question IDs
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [subject, difficulty]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadQuestions();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getQuestions({
        subject,
        difficulty,
        search,
      });
      setQuestions(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getDifficultyBadgeClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return 'badge-subject';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '6px' }}>
          Question Bank
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Browse through technical interview questions with complete solutions and explanations.
        </p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search questions, topics, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="All">All Subjects</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Unix">Unix</option>
        </select>

        <select
          className="select-input"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="empty-state">
          <p>Loading questions...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={40} />
          <h3>No questions match your criteria</h3>
          <p style={{ marginTop: '8px' }}>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="table-card"
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: isExpanded ? 'rgba(56, 189, 248, 0.4)' : undefined,
                }}
                onClick={() => toggleExpand(q.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        #{index + 1}
                      </span>
                      <span className="badge badge-subject">{q.subject}</span>
                      <span className={`badge ${getDifficultyBadgeClass(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      {q.topic && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {q.topic}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {q.question}
                    </h3>
                  </div>

                  <button
                    className="action-btn"
                    style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent' }}
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                      {['A', 'B', 'C', 'D'].map((optKey) => {
                        const isCorrect = q.correct_option.toUpperCase() === optKey;
                        return (
                          <div
                            key={optKey}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: isCorrect ? 'rgba(52, 211, 153, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                              border: isCorrect ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <span
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: isCorrect ? '#34d399' : 'rgba(255, 255, 255, 0.08)',
                                color: isCorrect ? '#0f172a' : 'inherit',
                              }}
                            >
                              {optKey}
                            </span>
                            <span style={{ fontSize: '0.9rem', color: isCorrect ? '#a7f3d0' : 'var(--text-primary)' }}>
                              {q[`option_${optKey.toLowerCase()}`]}
                            </span>
                            {isCorrect && (
                              <CheckCircle size={16} color="#34d399" style={{ marginLeft: 'auto' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="explanation-box" style={{ margin: 0 }}>
                        <div className="explanation-title">Explanation</div>
                        <p className="explanation-text">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

