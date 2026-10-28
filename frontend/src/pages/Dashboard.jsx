import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  UserPlus, 
  ArrowRight, 
  RefreshCw, 
  Server, 
  Database,
  ExternalLink,
  PlusCircle,
  Eye,
  Sparkles,
  Download
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { studentApi } from '../api/studentApi';
import { useToast } from '../layouts/AppLayout';
import { exportStudentsToCsv } from '../utils/exportCsv';

const SAMPLE_DEMO_STUDENTS = [
  { name: 'Kavya Deshpande', email: 'kavya.deshpande@example.edu', department: 'Computer Engineering' },
  { name: 'Aditya Joshi', email: 'aditya.joshi@example.edu', department: 'Information Technology' },
  { name: 'Tanmay Salunkhe', email: 'tanmay.salunkhe@example.edu', department: 'Artificial Intelligence & Data Science' },
  { name: 'Rhea Sengupta', email: 'rhea.sengupta@example.edu', department: 'Electronics & Telecommunication' },
];

export default function Dashboard() {
  const { healthStatus, refreshHealth } = useOutletContext();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [studentsData, deptData] = await Promise.all([
        studentApi.getAllStudents(),
        studentApi.getDepartmentSummaries(),
      ]);
      setStudents(studentsData);
      setDepartments(deptData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data from backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedSampleStudents = async () => {
    setIsSeeding(true);
    try {
      for (const st of SAMPLE_DEMO_STUDENTS) {
        await studentApi.createStudent(st);
      }
      showToast(`Added ${SAMPLE_DEMO_STUDENTS.length} sample student records for demonstration!`, 'success');
      await loadData();
      if (refreshHealth) refreshHealth();
    } catch (err) {
      showToast(err.message || 'Failed to insert demo records.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleExportCsv = () => {
    if (students.length === 0) {
      showToast('No student records to export.', 'error');
      return;
    }
    exportStudentsToCsv(students, `campus_ledger_all_students.csv`);
    showToast(`Downloaded roster of ${students.length} students!`, 'success');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await studentApi.deleteStudent(deleteTarget.id);
      showToast(`Student #${deleteTarget.id} (${deleteTarget.name}) deleted successfully.`, 'success');
      setDeleteTarget(null);
      await loadData();
      if (refreshHealth) refreshHealth();
    } catch (err) {
      showToast(err.message || 'Failed to delete student.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalStudents = students.length;
  const distinctDeptsCount = departments.length;
  const recentStudents = [...students].reverse().slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Administrative Overview"
        subtitle="Real-time academic ledger and student enrollment metrics."
        actions={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {totalStudents > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportCsv}
                title="Download CSV export"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSeedSampleStudents}
              disabled={isSeeding || isLoading}
              title="Quickly add 4 sample records for viva demonstration"
            >
              <Sparkles size={14} style={{ color: 'var(--color-brand)' }} />
              <span>{isSeeding ? 'Adding Demo Students...' : 'Add Demo Data'}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadData}
              title="Reload live backend records"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <Link to="/students/new" className="btn btn-primary">
              <UserPlus size={15} />
              <span>Add Student</span>
            </Link>
          </div>
        }
      />

      {error && (
        <div 
          style={{
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid #F1C3BA',
            color: 'var(--color-error-text)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13.5
          }}
        >
          <div>
            <strong>Backend Connection Notice:</strong> {error}
          </div>
          <button 
            type="button" 
            className="btn btn-sm btn-secondary" 
            onClick={loadData}
          >
            Retry Connection
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Retrieving institutional records..." />
      ) : totalStudents === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="No Student Records Yet"
          description="Your database is connected and ready. Enroll your first student manually or use the Demo Data button to immediately populate the catalog."
          action={
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleSeedSampleStudents}
                disabled={isSeeding}
              >
                <Sparkles size={15} />
                <span>{isSeeding ? 'Populating...' : 'Insert 4 Sample Students'}</span>
              </button>
              <Link to="/students/new" className="btn btn-primary">
                <PlusCircle size={16} />
                <span>Register First Student</span>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="dashboard-metrics-grid">
            <StatCard
              label="Total Enrolled"
              value={totalStudents}
              icon={<Users size={18} />}
              caption="Active registered students"
              to="/students"
            />

            <StatCard
              label="Departments"
              value={distinctDeptsCount}
              icon={<Building2 size={18} />}
              caption="Academic branches represented"
              to="/departments"
            />

            <StatCard
              label="Backend Service"
              value={healthStatus?.status === 'UP' ? 'Online' : 'Degraded'}
              icon={<Server size={18} />}
              caption={healthStatus?.databaseConnected ? 'Database Connected' : 'Checking connection...'}
              to="/settings"
            />
          </div>

          {/* Split layout: Recent Students + Department Distribution */}
          <div className="dashboard-split-layout">
            {/* Recent Students Card */}
            <div className="dashboard-card">
              <div className="dashboard-card-title">
                <span>Recently Added Students</span>
                <Link 
                  to="/students" 
                  className="btn btn-sm btn-secondary" 
                  style={{ fontSize: 12 }}
                >
                  View All ({totalStudents})
                </Link>
              </div>

              <div className="table-responsive">
                <table className="data-table" aria-label="Recent students table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }}>ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((st) => (
                      <tr key={st.id}>
                        <td>
                          <span className="student-id-pill">#{st.id}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{st.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>{st.email}</div>
                        </td>
                        <td>
                          <span className="dept-tag">{st.department}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link 
                            to={`/students/${st.id}`} 
                            className="btn btn-secondary btn-icon btn-sm"
                            title="View student details"
                          >
                            <Eye size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Distribution & Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="dashboard-card">
                <div className="dashboard-card-title">
                  <span>Department Distribution</span>
                  <Link to="/departments" style={{ fontSize: 12, color: 'var(--color-brand)', textDecoration: 'none' }}>
                    Details
                  </Link>
                </div>

                <div className="distribution-list">
                  {departments.map((dept) => {
                    const percentage = Math.round((dept.studentCount / totalStudents) * 100) || 0;
                    return (
                      <div key={dept.department} className="distribution-item">
                        <div className="dist-meta">
                          <span className="dist-name">{dept.department}</span>
                          <span className="dist-count">{dept.studentCount} ({percentage}%)</span>
                        </div>
                        <div className="dist-track">
                          <div 
                            className="dist-fill" 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="dashboard-card">
                <h2 className="dashboard-card-title" style={{ fontSize: 17 }}>Quick Actions</h2>
                <div className="quick-actions-grid">
                  <Link to="/students/new" className="quick-action-tile">
                    <UserPlus size={18} style={{ color: 'var(--color-brand)' }} />
                    <div>
                      <div className="quick-action-title">Add Student</div>
                      <div className="quick-action-sub">Register new record</div>
                    </div>
                  </Link>

                  <Link to="/students" className="quick-action-tile">
                    <Users size={18} style={{ color: 'var(--color-brand)' }} />
                    <div>
                      <div className="quick-action-title">Directory</div>
                      <div className="quick-action-sub">Search & filter</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Student Record"
        message={`Are you sure you want to delete student "${deleteTarget?.name}" (ID #${deleteTarget?.id})? This permanently removes the record from MySQL database.`}
        confirmLabel="Confirm Delete"
        cancelLabel="Keep Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isProcessing={isDeleting}
      />
    </div>
  );
}
