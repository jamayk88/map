import React, { useEffect, useRef, useState } from 'react';
import { MapPin, UserRound, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import { loginStudent } from '../utils/auth.js';

function StudentLoginForm({ onBack, onSuccess }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => () => {
    requestRef.current?.abort();
    requestRef.current = null;
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (requestRef.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const studentId = String(fields.get('studentId') || '').trim();
    if (!studentId) {
      setMessage('Enter your student ID.');
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setIsSubmitting(true);
    setMessage('');
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const loginData = await loginStudent({ studentId, password: String(fields.get('password') || '') }, { signal: controller.signal });
      form.reset();
      onSuccess(loginData);
    } catch (error) {
      if (!controller.signal.aborted) setMessage(error.message);
      else if (requestRef.current === controller) setMessage('Login timed out. Please try again.');
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="student-login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <label htmlFor="student-id">Student ID</label>
      <input id="student-id" name="studentId" type="text" autoComplete="username" required autoFocus disabled={isSubmitting} />
      <label htmlFor="student-password">Password</label>
      <input id="student-password" name="password" type="password" autoComplete="current-password" required disabled={isSubmitting} />
      {message && <p className="student-login-status" role="alert">{message}</p>}
      <button className="student-login-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in…' : 'Login'}
      </button>
      <button className="student-login-back" type="button" onClick={onBack} disabled={isSubmitting}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to login options
      </button>
    </form>
  );
}

export default function LoginPopup({ onSelect }) {
  const dialogRef = useRef(null);
  const [showStudentForm, setShowStudentForm] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="login-popup"
      aria-labelledby="login-title"
      aria-describedby="login-description"
      onCancel={(event) => event.preventDefault()}
    >
      <div className="login-brand-icon" aria-hidden="true"><MapPin size={28} /></div>
      <p className="login-eyebrow">LC MAPPING</p>
      <h1 id="login-title">{showStudentForm ? 'Student login' : 'Welcome to your campus'}</h1>
      <p id="login-description" className="login-description">
        {showStudentForm ? 'Sign in with your student account.' : 'Choose how you’d like to continue.'}
      </p>
      {showStudentForm ? <StudentLoginForm onBack={() => setShowStudentForm(false)} onSuccess={(loginData) => onSelect('student', loginData)} /> : (
        <div className="login-options">
        <button className="login-option" type="button" onClick={() => onSelect('guest')} autoFocus>
          <span className="login-option-icon" aria-hidden="true"><UserRound size={24} /></span>
          <span className="login-option-copy">
            <span className="login-option-title">Login as Guest</span>
            <span className="login-option-description">Explore the campus map.</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button className="login-option login-option-student" type="button" onClick={() => setShowStudentForm(true)}>
          <span className="login-option-icon" aria-hidden="true"><GraduationCap size={24} /></span>
          <span className="login-option-copy">
            <span className="login-option-title">Login as Student</span>
            <span className="login-option-description">Sign in with your student account.</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        </div>
      )}
    </dialog>
  );
}
