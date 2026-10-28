import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const COMMON_DEPARTMENTS = [
  'Information Technology',
  'Computer Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
];

export default function StudentForm({
  initialValues = { name: '', email: '', department: '' },
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEdit = false,
  serverValidationErrors = null,
}) {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    department: initialValues.department || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        department: initialValues.department || '',
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (serverValidationErrors) {
      setErrors((prev) => ({ ...prev, ...serverValidationErrors }));
    }
  }, [serverValidationErrors]);

  const validateField = (field, value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address (e.g. name@example.edu)';
      }
    }

    if (field === 'name' && trimmed.length < 2) {
      return 'Name must be at least 2 characters';
    }

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const deptError = validateField('department', formData.department);

    const newErrors = {
      name: nameError,
      email: emailError,
      department: deptError,
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, department: true });

    if (!nameError && !emailError && !deptError) {
      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
      });
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="student-name" className="form-label">
          Full Name <span className="required-star">*</span>
        </label>
        <input
          id="student-name"
          name="name"
          type="text"
          className={`form-input ${errors.name ? 'has-error' : ''}`}
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          autoComplete="name"
          required
        />
        {errors.name && (
          <div className="form-error-msg" role="alert">
            <AlertCircle size={14} />
            <span>{errors.name}</span>
          </div>
        )}
        <div className="form-hint">Student's formal full name as registered in the university catalog.</div>
      </div>

      <div className="form-group">
        <label htmlFor="student-email" className="form-label">
          Email Address <span className="required-star">*</span>
        </label>
        <input
          id="student-email"
          name="email"
          type="email"
          className={`form-input ${errors.email ? 'has-error' : ''}`}
          placeholder="e.g. rahul.sharma@example.edu"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          autoComplete="email"
          required
        />
        {errors.email && (
          <div className="form-error-msg" role="alert">
            <AlertCircle size={14} />
            <span>{errors.email}</span>
          </div>
        )}
        <div className="form-hint">Institutional or personal email for academic correspondence.</div>
      </div>

      <div className="form-group">
        <label htmlFor="student-department" className="form-label">
          Department / Branch <span className="required-star">*</span>
        </label>
        <input
          id="student-department"
          name="department"
          type="text"
          list="department-suggestions"
          className={`form-input ${errors.department ? 'has-error' : ''}`}
          placeholder="Select or type branch name..."
          value={formData.department}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          required
        />
        <datalist id="department-suggestions">
          {COMMON_DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept} />
          ))}
        </datalist>
        {errors.department && (
          <div className="form-error-msg" role="alert">
            <AlertCircle size={14} />
            <span>{errors.department}</span>
          </div>
        )}
        <div className="form-hint">Choose from frequent engineering branches or type a custom branch.</div>
      </div>

      <div className="form-footer-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              <span>{isEdit ? 'Saving Changes...' : 'Registering Student...'}</span>
            </>
          ) : (
            <span>{isEdit ? 'Save Changes' : 'Register Student'}</span>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
