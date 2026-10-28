import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StudentForm from '../components/StudentForm';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { studentApi } from '../api/studentApi';
import { useToast } from '../layouts/AppLayout';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [serverValidationErrors, setServerValidationErrors] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await studentApi.getStudentById(id);
        setStudent(data);
      } catch (err) {
        setFetchError(err.message || `Unable to locate student record with ID #${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setServerValidationErrors(null);

    try {
      const updated = await studentApi.updateStudent(id, formData);
      showToast(`Student #${updated.id} (${updated.name}) updated successfully.`);
      navigate(`/students/${updated.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update student record.');
      if (err.validationErrors) {
        setServerValidationErrors(err.validationErrors);
      }
      showToast(err.message || 'Update failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/students/${id}`);
  };

  if (isLoading) {
    return <LoadingState message={`Fetching student #${id} record...`} />;
  }

  if (fetchError || !student) {
    return (
      <div>
        <PageHeader
          title="Edit Student"
          subtitle="Update student record details in the institutional database."
          actions={
            <Link to="/students" className="btn btn-secondary">
              <ArrowLeft size={15} />
              <span>Back to Directory</span>
            </Link>
          }
        />
        <EmptyState
          icon={<AlertCircle size={30} />}
          title="Student Record Not Found"
          description={fetchError || `Student with ID #${id} does not exist in the database.`}
          action={
            <Link to="/students" className="btn btn-primary">
              Return to Student Directory
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit Student #${student.id}`}
        subtitle={`Modifying institutional record for ${student.name}.`}
        actions={
          <Link to={`/students/${student.id}`} className="btn btn-secondary">
            <ArrowLeft size={15} />
            <span>Cancel & View Profile</span>
          </Link>
        }
      />

      {submitError && (
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
          <strong>Update Error:</strong> {submitError}
        </div>
      )}

      <StudentForm
        initialValues={student}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        isEdit={true}
        serverValidationErrors={serverValidationErrors}
      />
    </div>
  );
}
