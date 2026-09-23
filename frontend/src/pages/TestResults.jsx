import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Calendar, BookOpen, RotateCcw, Search, Eye, Filter, X } from 'lucide-react';
import api from '../api';

export default function TestResults({ onStartPractice, onReadNotes }) {
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedCourse]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, resultsData] = await Promise.all([
        api.getCourses(),
        api.getTestResults(selectedCourse !== 'All' ? { course: selectedCourse } : {}),
      ]);
      setCourses(coursesData);
      setResults(resultsData);
    } catch (err) {
      setError(err.message || 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((r) =>
    r.student_name.toLowerCase().includes(searchName.toLowerCase()) ||
    (r.course_name && r.course_name.toLowerCase().includes(searchName.toLowerCase())) ||
    (r.topic_name && r.topic_name.toLowerCase().includes(searchName.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0369a1', marginBottom: '8px' }}>
          Placement Quiz Results & Scorecards
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem' }}>
          Review candidate test attempts, score percentages, and detailed question breakdowns.
        </p>
      </div>

      {/* Filters and search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        background: 'rgba(255, 255, 255, 0.94)',
        padding: '14px 20px',
        borderRadius: '16px',
        border: '1.5px solid #bae6fd',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color="#0284c7" />
          <select
            className="select-input"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px', flex: '1 1 200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search candidate or topic..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
          Loading test scores...
        </div>
      ) : error ? (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="empty-state">
          <Award size={48} color="#0284c7" />
          <h3 style={{ color: '#0f172a' }}>No test results recorded yet</h3>
          <p style={{ marginTop: '8px', color: '#64748b' }}>
            Attend a placement quiz to see your performance and scorecard here!
          </p>
          <button
            className="primary-btn"
            style={{ marginTop: '16px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
            onClick={() => onStartPractice()}
          >
            Start a Placement Quiz
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedResult ? 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' : '1fr',
          gap: '24px'
        }}>
          {/* Results Table */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid #bae6fd',
            borderRadius: '18px',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-card)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#e0f2fe', borderBottom: '1.5px solid #bae6fd', color: '#0369a1' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Candidate</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Course & Topic</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Score</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Percentage</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800 }}>Date</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((res) => {
                  const isSelected = selectedResult?.id === res.id;
                  const dateStr = new Date(res.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr
                      key={res.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#e0f2fe' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => setSelectedResult(res)}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                        {res.student_name}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: '#0284c7', fontWeight: 700 }}>{res.course_name || 'General'}</span>
                        {res.topic_name && <span style={{ color: '#64748b' }}> • {res.topic_name}</span>}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                        {res.score} / {res.total_questions}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontWeight: 800,
                          color: res.percentage >= 70 ? '#16a34a' : res.percentage >= 50 ? '#ca8a04' : '#ea580c'
                        }}>
                          {res.percentage}%
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: res.passed ? '#dcfce7' : '#ffedd5',
                            color: res.passed ? '#15803d' : '#c2410c',
                            border: `1px solid ${res.passed ? '#86efac' : '#fed7aa'}`
                          }}
                        >
                          {res.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.825rem' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          className="btn-ghost"
                          style={{ padding: '6px 10px', color: '#0284c7' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResult(res);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detailed Scorecard Modal / Panel */}
          {selectedResult && (
            <div style={{
              background: '#ffffff',
              border: '2px solid #bae6fd',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: '800px',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                    {selectedResult.student_name}'s Scorecard
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {selectedResult.course_name} • {selectedResult.topic_name || 'General Quiz'}
                  </span>
                </div>
                <button
                  className="btn-ghost"
                  style={{ color: '#64748b', fontWeight: 700, gap: '6px' }}
                  onClick={() => setSelectedResult(null)}
                >
                  <X size={16} />
                  <span>Close</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Score</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7' }}>
                    {selectedResult.score} / {selectedResult.total_questions}
                  </div>
                </div>
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c' }}>Percentage</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: selectedResult.passed ? '#16a34a' : '#ea580c' }}>
                    {selectedResult.percentage}%
                  </div>
                </div>
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ca8a04' }}>Verdict</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedResult.passed ? '#16a34a' : '#ea580c', marginTop: '3px' }}>
                    {selectedResult.passed ? 'QUALIFIED' : 'NEEDS PREP'}
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>
                Question-by-Question Answers:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(selectedResult.answers_data || []).map((ans, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: ans.is_correct ? '#f0fdf4' : '#fff7ed',
                      border: `1.5px solid ${ans.is_correct ? '#86efac' : '#fed7aa'}`,
                      borderRadius: '10px',
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {ans.is_correct ? (
                        <CheckCircle2 size={18} color="#16a34a" />
                      ) : (
                        <XCircle size={18} color="#ea580c" />
                      )}
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                        Q{idx + 1}. {ans.question_text || `Question #${ans.question_id}`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', gap: '16px', marginLeft: '26px' }}>
                      <span>Selected: <strong style={{ color: ans.is_correct ? '#16a34a' : '#ea580c' }}>Option {ans.selected_option}</strong></span>
                      <span>Correct: <strong style={{ color: '#16a34a' }}>Option {ans.correct_option}</strong></span>
                    </div>

                    {ans.explanation && (
                      <p style={{ margin: '6px 0 0 26px', fontSize: '0.8rem', color: '#334155', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        💡 {ans.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  className="primary-btn"
                  style={{ flex: 1, fontSize: '0.85rem', padding: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                  onClick={() => onStartPractice(selectedResult.course, selectedResult.topic)}
                >
                  <RotateCcw size={15} />
                  <span>Retake This Quiz</span>
                </button>
                <button
                  className="secondary-btn"
                  style={{ flex: 1, fontSize: '0.85rem', padding: '10px', borderColor: '#fed7aa', color: '#ea580c', background: '#fff7ed', fontWeight: 700 }}
                  onClick={() => onReadNotes(selectedResult.course, selectedResult.topic)}
                >
                  <BookOpen size={15} />
                  <span>Review Notes (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
