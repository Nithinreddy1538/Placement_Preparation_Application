import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

const DEFAULT_FORM = {
  question: '',
  course: '',
  topic: '',
  difficulty: 'Easy',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'A',
  explanation: '',
};

export default function QuestionModal({ isOpen, onClose, onSave, editingQuestion, courses = [], presetCourseId = null, presetTopicId = null }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        question: editingQuestion.question || '',
        course: editingQuestion.course || (courses[0]?.id ?? ''),
        topic: editingQuestion.topic || '',
        difficulty: editingQuestion.difficulty || 'Easy',
        option_a: editingQuestion.option_a || '',
        option_b: editingQuestion.option_b || '',
        option_c: editingQuestion.option_c || '',
        option_d: editingQuestion.option_d || '',
        correct_option: editingQuestion.correct_option || 'A',
        explanation: editingQuestion.explanation || '',
      });
    } else {
      setFormData({
        ...DEFAULT_FORM,
        course: presetCourseId || (courses[0]?.id ?? ''),
        topic: presetTopicId || '',
      });
    }
    setError(null);
  }, [editingQuestion, isOpen, courses, presetCourseId, presetTopicId]);

  // Update available topics when selected course changes
  useEffect(() => {
    if (formData.course) {
      const course = courses.find((c) => c.id.toString() === formData.course.toString());
      const cTopics = course ? course.topics || [] : [];
      setAvailableTopics(cTopics);
      if (cTopics.length > 0 && !cTopics.some((t) => t.id.toString() === formData.topic?.toString())) {
        setFormData((prev) => ({ ...prev, topic: cTopics[0].id }));
      }
    } else {
      setAvailableTopics([]);
    }
  }, [formData.course, courses]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.question.trim()) {
      setError('Please provide a question statement.');
      setSubmitting(false);
      return;
    }
    if (!formData.course) {
      setError('Please select a course.');
      setSubmitting(false);
      return;
    }
    if (!formData.option_a.trim() || !formData.option_b.trim() || !formData.option_c.trim() || !formData.option_d.trim()) {
      setError('All four options (A, B, C, D) must be provided.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        course: parseInt(formData.course),
        topic: formData.topic ? parseInt(formData.topic) : null,
      };

      if (editingQuestion?.id) {
        await api.updateQuestion(editingQuestion.id, payload);
      } else {
        await api.createQuestion(payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save question.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingQuestion ? 'Edit Placement Question' : 'Add Placement Question'}
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Course & Topic Selection */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="course">Course *</label>
                <select
                  id="course"
                  name="course"
                  className="form-control"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="topic">Topic</label>
                <select
                  id="topic"
                  name="topic"
                  className="form-control"
                  value={formData.topic}
                  onChange={handleChange}
                >
                  <option value="">General Topic</option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="difficulty">Difficulty *</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="form-control"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div className="form-group">
              <label className="form-label" htmlFor="question">Question Statement *</label>
              <textarea
                id="question"
                name="question"
                rows="3"
                className="form-control"
                placeholder="Type the placement question here..."
                value={formData.question}
                onChange={handleChange}
                required
              />
            </div>

            {/* Options */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="option_a">Option A *</label>
                <input
                  id="option_a"
                  name="option_a"
                  type="text"
                  className="form-control"
                  placeholder="Option A"
                  value={formData.option_a}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="option_b">Option B *</label>
                <input
                  id="option_b"
                  name="option_b"
                  type="text"
                  className="form-control"
                  placeholder="Option B"
                  value={formData.option_b}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="option_c">Option C *</label>
                <input
                  id="option_c"
                  name="option_c"
                  type="text"
                  className="form-control"
                  placeholder="Option C"
                  value={formData.option_c}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="option_d">Option D *</label>
                <input
                  id="option_d"
                  name="option_d"
                  type="text"
                  className="form-control"
                  placeholder="Option D"
                  value={formData.option_d}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Correct Option */}
            <div className="form-group">
              <label className="form-label" htmlFor="correct_option">Correct Option *</label>
              <select
                id="correct_option"
                name="correct_option"
                className="form-control"
                value={formData.correct_option}
                onChange={handleChange}
                required
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            {/* Explanation */}
            <div className="form-group">
              <label className="form-label" htmlFor="explanation">Explanation & Rationale</label>
              <textarea
                id="explanation"
                name="explanation"
                rows="2"
                className="form-control"
                placeholder="Explain why this option is correct (shown to students upon answer submission)..."
                value={formData.explanation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
