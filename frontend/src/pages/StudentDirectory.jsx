import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useOutletContext } from 'react-router-dom';
import { 
  UserPlus, 
  RefreshCw, 
  AlertCircle, 
  FilterX, 
  Download, 
  FileSpreadsheet,
  Check
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import StudentTable from '../components/StudentTable';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { studentApi } from '../api/studentApi';
import { useToast } from '../layouts/AppLayout';
import { exportStudentsToCsv } from '../utils/exportCsv';

export default function StudentDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshHealth } = useOutletContext();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const deptFilterParam = searchParams.get('department') || '';
  const [selectedDept, setSelectedDept] = useState(deptFilterParam);

  // Sync state if URL query param changes
  useEffect(() => {
    setSelectedDept(deptFilterParam);
  }, [deptFilterParam]);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentApi.getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server. Please verify Spring Boot.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeptFilterChange = (dept) => {
    setSelectedDept(dept);
    if (dept) {
      setSearchParams({ department: dept });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSearchParams({});
  };

  // Distinct departments extracted from actual student list with counts
  const departmentStats = useMemo(() => {
    const counts = {};
    for (const s of students) {
      if (s.department) {
        counts[s.department] = (counts[s.department] || 0) + 1;
      }
    }
    return Object.keys(counts).sort().map(dept => ({
      name: dept,
      count: counts[dept]
    }));
  }, [students]);

  // Filtered students based on live search and dept filter
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        student.id.toString().includes(query) ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query);

      const matchesDept = !selectedDept || student.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [students, searchTerm, selectedDept]);

  const handleExportCsv = () => {
    if (filteredStudents.length === 0) {
      showToast('No student records to export.', 'error');
      return;
    }
    exportStudentsToCsv(filteredStudents, `campus_ledger_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast(`Exported ${filteredStudents.length} student records to CSV!`, 'success');
  };

  const handleDeletePrompt = (student) => {
    setDeleteTarget(student);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await studentApi.deleteStudent(deleteTarget.id);
      showToast(`Student #${deleteTarget.id} (${deleteTarget.name}) removed successfully.`);
      setDeleteTarget(null);
      await fetchStudents();
      if (refreshHealth) refreshHealth();
    } catch (err) {
      showToast(err.message || 'Failed to delete student.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Student Directory"
        subtitle="Manage academic profiles, enrollment status, and records."
        actions={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportCsv}
              disabled={filteredStudents.length === 0}
              title="Download CSV spreadsheet of current records"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchStudents}
              disabled={isLoading}
              title="Reload student directory from backend"
            >
              <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
              <span>Refresh</span>
            </button>
            <Link to="/students/new" className="btn btn-primary">
              <UserPlus size={15} />
              <span>Add Student</span>
            </Link>
          </div>
        }
      />

      {error ? (
        <div className="empty-state" style={{ borderColor: 'var(--color-terracotta)' }}>
          <div className="empty-state-icon" style={{ backgroundColor: 'var(--color-terracotta-light)', color: 'var(--color-terracotta)' }}>
            <AlertCircle size={24} />
          </div>
          <h3 className="empty-state-title">Backend Connection Error</h3>
          <p className="empty-state-desc">{error}</p>
          <button type="button" className="btn btn-secondary" onClick={fetchStudents}>
            Try Reconnecting
          </button>
        </div>
      ) : isLoading ? (
        <LoadingState message="Loading student records from database..." />
      ) : (
        <>
          {/* Quick Department Filter Pills */}
          {departmentStats.length > 0 && (
            <div 
              style={{ 
                display: 'flex', 
                gap: 8, 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                marginBottom: 18 
              }}
              role="group" 
              aria-label="Filter by department"
            >
              <button
                type="button"
                onClick={() => handleDeptFilterChange('')}
                className={`btn btn-sm ${!selectedDept ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '5px 13px', fontSize: 12.5 }}
              >
                All Departments ({students.length})
              </button>

              {departmentStats.map((d) => {
                const isActive = selectedDept === d.name;
                return (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => handleDeptFilterChange(isActive ? '' : d.name)}
                    className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)', padding: '5px 13px', fontSize: 12.5 }}
                  >
                    <span>{d.name}</span>
                    <span 
                      style={{ 
                        opacity: 0.8, 
                        marginLeft: 4, 
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-sage)',
                        padding: '1px 6px',
                        borderRadius: 10,
                        fontSize: 11
                      }}
                    >
                      {d.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter Toolbar */}
          <div className="directory-toolbar">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDept={selectedDept}
              onDeptChange={handleDeptFilterChange}
              departments={departmentStats.map(d => d.name)}
            />

            <div className="record-count-banner">
              Showing <strong>{filteredStudents.length}</strong> of{' '}
              <strong>{students.length}</strong> total students
              {(searchTerm || selectedDept) && (
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleClearFilters}
                  style={{ marginLeft: 12, padding: '4px 8px', fontSize: 12 }}
                >
                  <FilterX size={13} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Student Table or Filtered Empty State */}
          {filteredStudents.length === 0 ? (
            <EmptyState
              title={students.length === 0 ? 'No Enrolled Students' : 'No Matching Students'}
              description={
                students.length === 0
                  ? 'There are currently no students saved in the database. Use the Add Student button to create your first record.'
                  : `No records matched your search query "${searchTerm}"${selectedDept ? ` in ${selectedDept}` : ''}.`
              }
              action={
                students.length === 0 ? (
                  <Link to="/students/new" className="btn btn-primary">
                    <UserPlus size={15} />
                    <span>Add First Student</span>
                  </Link>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
                    Clear Filters
                  </button>
                )
              }
            />
          ) : (
            <StudentTable
              students={filteredStudents}
              onDelete={handleDeletePrompt}
              pageSize={8}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently delete student "${deleteTarget?.name}" (ID #${deleteTarget?.id})? This action cannot be undone.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isProcessing={isDeleting}
      />
    </div>
  );
}
