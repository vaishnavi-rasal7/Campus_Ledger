import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  AlertCircle, 
  Mail, 
  Building2, 
  Hash, 
  UserCheck,
  CreditCard,
  Printer,
  X,
  GraduationCap
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { studentApi } from '../api/studentApi';
import { useToast } from '../layouts/AppLayout';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await studentApi.getStudentById(id);
        setStudent(data);
      } catch (err) {
        setError(err.message || `Student #${id} not found.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await studentApi.deleteStudent(id);
      showToast(`Student #${id} (${student.name}) has been permanently deleted.`);
      navigate('/students');
    } catch (err) {
      showToast(err.message || 'Failed to delete student.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handlePrintIdCard = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingState message={`Retrieving student #${id} record...`} />;
  }

  if (error || !student) {
    return (
      <div>
        <PageHeader
          title="Student Record"
          subtitle="View detailed student profile and enrollment data."
          actions={
            <Link to="/students" className="btn btn-secondary">
              <ArrowLeft size={15} />
              <span>Back to Directory</span>
            </Link>
          }
        />
        <EmptyState
          icon={<AlertCircle size={32} />}
          title="Student Record Not Found"
          description={error || `The student with identifier #${id} could not be found in the database.`}
          action={
            <Link to="/students" className="btn btn-primary">
              Return to Student Directory
            </Link>
          }
        />
      </div>
    );
  }

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div>
      <PageHeader
        title="Student Profile"
        subtitle="Individual academic record and departmental enrollment info."
        actions={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/students" className="btn btn-secondary">
              <ArrowLeft size={15} />
              <span>Back to Directory</span>
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowIdCardModal(true)}
              title="Preview printable student identity card"
            >
              <CreditCard size={15} />
              <span>ID Card Preview</span>
            </button>
            <Link to={`/students/${student.id}/edit`} className="btn btn-primary">
              <Pencil size={15} />
              <span>Edit Record</span>
            </Link>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        }
      />

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-header-info">
            <h2>{student.name}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="student-id-pill">ID #{student.id}</span>
              <span className="dept-tag">{student.department}</span>
            </div>
          </div>
        </div>

        <div className="profile-meta-grid">
          <div className="profile-meta-item">
            <span className="profile-meta-label">
              <Hash size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Database ID
            </span>
            <span className="profile-meta-value">#{student.id}</span>
          </div>

          <div className="profile-meta-item">
            <span className="profile-meta-label">
              <UserCheck size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Full Name
            </span>
            <span className="profile-meta-value">{student.name}</span>
          </div>

          <div className="profile-meta-item">
            <span className="profile-meta-label">
              <Mail size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Email Address
            </span>
            <span className="profile-meta-value">{student.email}</span>
          </div>

          <div className="profile-meta-item">
            <span className="profile-meta-label">
              <Building2 size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Department
            </span>
            <span className="profile-meta-value">{student.department}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
          <Link to={`/students?department=${encodeURIComponent(student.department)}`} className="btn btn-sm btn-secondary">
            View All {student.department} Students
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Confirm Record Deletion"
        message={`Are you sure you want to permanently delete student "${student.name}" (ID #${student.id}) from the database? This action cannot be reversed.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Keep Record"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isProcessing={isDeleting}
      />

      {/* Student ID Card Modal */}
      {showIdCardModal && (
        <div className="modal-overlay" onClick={() => setShowIdCardModal(false)} role="dialog" aria-modal="true">
          <div 
            className="modal-container" 
            style={{ maxWidth: 460, padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ID Card Visual */}
            <div 
              style={{
                backgroundColor: '#26382E',
                color: '#FFFFFF',
                padding: '24px',
                borderTopLeftRadius: 'var(--radius-lg)',
                borderTopRightRadius: 'var(--radius-lg)',
                position: 'relative'
              }}
            >
              <button
                type="button"
                onClick={() => setShowIdCardModal(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  opacity: 0.7,
                  cursor: 'pointer'
                }}
                aria-label="Close preview"
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div 
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#3B644D',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, letterSpacing: 0.2 }}>Campus Ledger</div>
                  <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 0.8, color: '#9AB2A2' }}>
                    Student Identity Pass · 2026-27
                  </div>
                </div>
              </div>

              <div 
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#242923',
                  borderRadius: 'var(--radius-md)',
                  padding: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <div 
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: 'var(--color-brand-light)',
                    color: 'var(--color-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#242923' }}>{student.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-brand)', fontWeight: 600, marginTop: 2 }}>
                    {student.department}
                  </div>
                  <div style={{ fontSize: 11, color: '#5A6B5E', marginTop: 4 }}>
                    ID: <strong>#{student.id}</strong> · {student.email}
                  </div>
                </div>
              </div>

              {/* Barcode visual */}
              <div 
                style={{
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  opacity: 0.65
                }}
              >
                {Array.from({ length: 28 }).map((_, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      width: i % 3 === 0 ? 3 : 1.5, 
                      height: 22, 
                      backgroundColor: '#FFFFFF' 
                    }} 
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center', fontSize: 9.5, opacity: 0.6, marginTop: 4, letterSpacing: 1.5 }}>
                APSIT-SE-IT-{student.id.toString().padStart(5, '0')}
              </div>
            </div>

            <div style={{ padding: 18, display: 'flex', justifyContent: 'flex-end', gap: 10, backgroundColor: '#FAF9F5' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowIdCardModal(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrintIdCard}
              >
                <Printer size={15} />
                <span>Print Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
