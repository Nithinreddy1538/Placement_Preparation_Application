import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  HelpCircle,
  Award,
  BookOpen,
  Trophy,
  ListOrdered,
  User,
  Check,
} from 'lucide-react';
import api from '../api';

export default function Practice({
  initialCourseId = 'All',
  initialTopicId = null,
  onReadNotes,
  onViewResults,
}) {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || 'All');
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [studentName, setStudentName] = useState('Student Candidate');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz progression state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // History tracking for test result submission
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [savingResult, setSavingResult] = useState(false);
  const [savedResultId, setSavedResultId] = useState(null);

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  };

  // Sync initialCourseId & initialTopicId props
  useEffect(() => {
    if (initialCourseId) setSelectedCourseId(initialCourseId);
    if (initialTopicId) setSelectedTopicId(initialTopicId);
  }, [initialCourseId, initialTopicId]);

  // When course changes, update available topics
  useEffect(() => {
    if (selectedCourseId && selectedCourseId !== 'All') {
      const course = courses.find((c) => c.id.toString() === selectedCourseId.toString());
      setTopics(course ? course.topics || [] : []);
    } else {
      setTopics([]);
      setSelectedTopicId('All');
    }
  }, [selectedCourseId, courses]);

  // Fetch questions
  useEffect(() => {
    fetchQuizQuestions();
  }, [selectedCourseId, selectedTopicId, selectedDifficulty]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (selectedCourseId !== 'All') filters.course = selectedCourseId;
      if (selectedTopicId !== 'All') filters.topic = selectedTopicId;
      if (selectedDifficulty !== 'All') filters.difficulty = selectedDifficulty;

      const data = await api.getQuestions(filters);
      // Shuffle questions
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setAnsweredCount(0);
      setIsTestFinished(false);
      setHistory([]);
      setSavedResultId(null);
    } catch (err) {
      setError(err.message || 'Failed to load practice questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optKey) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optKey);
    setIsAnswerSubmitted(true);
    setAnsweredCount((prev) => prev + 1);

    const currentQ = questions[currentIndex];
    const isCorrect = optKey.toUpperCase() === currentQ.correct_option.toUpperCase();
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHistory((prev) => [
      ...prev,
      {
        question_id: currentQ.id,
        question_text: currentQ.question,
        selected_option: optKey,
        correct_option: currentQ.correct_option,
        is_correct: isCorrect,
        explanation: currentQ.explanation,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishAndSaveTest();
    }
  };

  const finishAndSaveTest = async () => {
    setIsTestFinished(true);
    setSavingResult(true);

    try {
      const finalScore = score + (selectedOption && questions[currentIndex]?.correct_option === selectedOption && !history.some(h => h.question_id === questions[currentIndex].id) ? 1 : 0);
      const payload = {
        student_name: studentName.trim() || 'Candidate',
        course: selectedCourseId !== 'All' ? parseInt(selectedCourseId) : (questions[0]?.course || null),
        topic: selectedTopicId !== 'All' ? parseInt(selectedTopicId) : (questions[0]?.topic || null),
        score: finalScore,
        total_questions: questions.length,
        answers_data: history,
      };

      const result = await api.submitTestResult(payload);
      setSavedResultId(result.id);
    } catch (err) {
      console.error('Failed to submit test results to backend', err);
    } finally {
      setSavingResult(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleRestart = () => {
    fetchQuizQuestions();
  };

  const currentQ = questions[currentIndex];

  const getDifficultyBadgeClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return 'badge-subject';
    }
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const isPassed = percentage >= 60;

  return (
    <div className="practice-container" style={{ maxWidth: '980px', margin: '0 auto', padding: '24px 0' }}>
      {/* Top Filter and Controls */}
      <div className="practice-header" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Candidate Name Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '6px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1' }}>
            <User size={16} color="#0284c7" />
            <input
              type="text"
              placeholder="Candidate Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled={isTestFinished}
              style={{ background: 'transparent', border: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.875rem', width: '140px', outline: 'none' }}
            />
          </div>

          {/* Course select */}
          <select
            className="select-input"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedTopicId('All');
            }}
            disabled={isTestFinished}
            style={{ fontWeight: 600 }}
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Topic select */}
          {topics.length > 0 && (
            <select
              className="select-input"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              disabled={isTestFinished}
              style={{ fontWeight: 600 }}
            >
              <option value="All">All Topics</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}

          {/* Difficulty select */}
          <select
            className="select-input"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            disabled={isTestFinished}
            style={{ fontWeight: 600 }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {answeredCount > 0 && !isTestFinished && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800 }}>
            <Award size={20} color="#ea580c" />
            <span>
              Live Score: {score} / {answeredCount} ({Math.round((score / answeredCount) * 100)}%)
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading placement quiz questions...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <HelpCircle size={44} color="#0284c7" />
          <h3 style={{ color: '#0f172a' }}>No quiz questions found for this selection</h3>
          <p style={{ marginTop: '8px', color: '#64748b' }}>
            Admins can add questions under this course/topic from the Admin Portal.
          </p>
        </div>
      ) : isTestFinished ? (
        /* Scorecard Screen with Answer Breakdown and Navigation */
        <div
          className="quiz-card"
          style={{
            padding: '36px 28px',
            animation: 'fadeIn 0.3s ease-in-out',
            border: '2px solid #bae6fd',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: isPassed ? '#dcfce7' : '#ffedd5',
                color: isPassed ? '#16a34a' : '#ea580c',
                border: `2px solid ${isPassed ? '#86efac' : '#fed7aa'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Trophy size={42} />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
              Placement Test Results
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '24px' }}>
              Candidate: <strong>{studentName || 'Student'}</strong> • Status:{' '}
              <span style={{ color: isPassed ? '#16a34a' : '#ea580c', fontWeight: 800 }}>
                {isPassed ? 'PASSED QUALIFIER 🎉' : 'NEEDS PRACTICE 📚'}
              </span>
            </p>

            {/* Metric cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '14px',
                maxWidth: '600px',
                margin: '0 auto 28px',
              }}
            >
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '14px', border: '1.5px solid #bae6fd' }}>
                <span className="stat-label">Correct Answers</span>
                <p style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>
                  {score} / {questions.length}
                </p>
              </div>
              <div style={{ background: '#fff7ed', padding: '16px', borderRadius: '14px', border: '1.5px solid #fed7aa' }}>
                <span className="stat-label">Percentage</span>
                <p style={{ fontSize: '1.85rem', fontWeight: 900, color: isPassed ? '#16a34a' : '#ea580c', marginTop: '4px' }}>
                  {percentage}%
                </p>
              </div>
              <div style={{ background: '#fefce8', padding: '16px', borderRadius: '14px', border: '1.5px solid #fef08a' }}>
                <span className="stat-label">Grade Result</span>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: isPassed ? '#16a34a' : '#ea580c', marginTop: '8px' }}>
                  {percentage >= 80 ? 'Distinction' : percentage >= 60 ? 'Cleared' : 'Review Notes'}
                </p>
              </div>
            </div>

            {/* Quick Actions (Same Tab) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <button
                className="primary-btn"
                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                onClick={handleRestart}
              >
                <RotateCcw size={16} />
                <span>Retake Quiz</span>
              </button>

              {onReadNotes && (
                <button
                  className="secondary-btn"
                  style={{ borderColor: '#fed7aa', color: '#ea580c', background: '#fff7ed', fontWeight: 700 }}
                  onClick={() => onReadNotes(selectedCourseId !== 'All' ? selectedCourseId : null, selectedTopicId !== 'All' ? selectedTopicId : null)}
                >
                  <BookOpen size={16} />
                  <span>Review Study Notes & PDF</span>
                </button>
              )}

              {onViewResults && (
                <button
                  className="secondary-btn"
                  style={{ borderColor: '#bae6fd', color: '#0369a1', background: '#f0f9ff', fontWeight: 700 }}
                  onClick={onViewResults}
                >
                  <ListOrdered size={16} />
                  <span>View All Test Attempts</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question-by-Question Review */}
          <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Question Breakdown & Solution Explanations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: item.is_correct ? '#f0fdf4' : '#fff7ed',
                    border: `1.5px solid ${item.is_correct ? '#86efac' : '#fed7aa'}`,
                    borderRadius: '12px',
                    padding: '16px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {item.is_correct ? (
                      <CheckCircle2 size={20} color="#16a34a" />
                    ) : (
                      <XCircle size={20} color="#ea580c" />
                    )}
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                      Q{idx + 1}. {item.question_text}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', gap: '18px', marginLeft: '28px', marginBottom: '6px' }}>
                    <span>Your Choice: <strong style={{ color: item.is_correct ? '#16a34a' : '#ea580c' }}>Option {item.selected_option}</strong></span>
                    <span>Correct Answer: <strong style={{ color: '#16a34a' }}>Option {item.correct_option}</strong></span>
                  </div>

                  {item.explanation && (
                    <p style={{ fontSize: '0.85rem', color: '#334155', marginLeft: '28px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', margin: '6px 0 0' }}>
                      💡 {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Animated Progress Bar */}
          {questions.length > 0 && (
            <div
              style={{
                height: '6px',
                width: '100%',
                background: '#e0f2fe',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #0284c7 0%, #ea580c 50%, #16a34a 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          )}

          {/* Question Card */}
          <div className="quiz-card">
            <div className="quiz-meta">
              <span className="badge badge-subject">{currentQ.course_name || 'Placement'}</span>
              <span className={`badge ${getDifficultyBadgeClass(currentQ.difficulty)}`}>
                {currentQ.difficulty}
              </span>
              {currentQ.topic_name && (
                <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                  • {currentQ.topic_name}
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#0369a1', fontWeight: 700 }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="quiz-question-text">{currentQ.question}</h2>

            <div className="options-list">
              {['A', 'B', 'C', 'D'].map((key) => {
                const optText = currentQ[`option_${key.toLowerCase()}`];
                const isSelected = selectedOption === key;
                const isCorrect = currentQ.correct_option.toUpperCase() === key;

                let btnClass = 'option-btn';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnClass += ' correct';
                  } else if (isSelected) {
                    btnClass += ' wrong';
                  }
                } else if (isSelected) {
                  btnClass += ' selected';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    className={btnClass}
                    onClick={() => handleSelectOption(key)}
                    disabled={isAnswerSubmitted}
                  >
                    <span className="option-key">{key}</span>
                    <span style={{ flex: 1 }}>{optText}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 size={20} color="#16a34a" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={20} color="#ea580c" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Section */}
            {isAnswerSubmitted && (
              <div className="explanation-box">
                <div className="explanation-title">
                  <CheckCircle2 size={18} />
                  <span>Correct Answer: Option {currentQ.correct_option}</span>
                </div>
                <p className="explanation-text">
                  {currentQ.explanation || 'No detailed explanation provided for this question.'}
                </p>
              </div>
            )}

            {/* Quiz Navigation Buttons */}
            <div className="quiz-actions">
              <button
                className="secondary-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <button className="secondary-btn" onClick={handleRestart} title="Shuffle & Restart">
                <RotateCcw size={16} />
                <span>Restart</span>
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  className="primary-btn"
                  style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#ffffff' }}
                  onClick={handleNext}
                  disabled={!isAnswerSubmitted}
                >
                  <Trophy size={16} />
                  <span>Finish & View Score</span>
                </button>
              ) : (
                <button
                  className="primary-btn"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                  onClick={handleNext}
                  disabled={!isAnswerSubmitted}
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
