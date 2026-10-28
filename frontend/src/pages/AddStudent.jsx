import React, { useState } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StudentForm from '../components/StudentForm';
import { studentApi } from '../api/studentApi';
import { useToast } from '../layouts/AppLayout';

export default function AddStudent() {
  const navigate = useNavigate();
  const { refreshHealth } = useOutletContext();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [serverValidationErrors, setServerValidationErrors] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setFormError(null);
    setServerValidationErrors(null);

    try {
      const createdStudent = await studentApi.createStudent(formData);
      showToast(
        `Student "${createdStudent.name}" enrolled successfully with ID #${createdStudent.id}.`,
        'success'
      );
      if (refreshHealth) refreshHealth();
      navigate(`/students/${createdStudent.id}`);
    } catch (err) {
      setFormError(err.message || 'Failed to create student. Please verify backend connection.');
      if (err.validationErrors) {
        setServerValidationErrors(err.validationErrors);
      }
      showToast(err.message || 'Failed to register student.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  return (
    <div>
      <PageHeader
        title="Register New Student"
        subtitle="Create a new academic student record in the institutional database."
        actions={
          <Link to="/students" className="btn btn-secondary">
            <ArrowLeft size={15} />
            <span>Back to Directory</span>
          </Link>
        }
      />

      {formError && (
        <div
          style={{
            maxWidth: 640,
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid #F1C3BA',
            color: 'var(--color-error-text)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 20,
            fontSize: 13.5,
          }}
        >
          <strong>Submission Error:</strong> {formError}
        </div>
      )}

      <StudentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        isEdit={false}
        serverValidationErrors={serverValidationErrors}
      />
    </div>
  );
}
