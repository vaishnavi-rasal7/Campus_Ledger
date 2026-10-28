import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, ArrowRight, RefreshCw, PlusCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { studentApi } from '../api/studentApi';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentApi.getDepartmentSummaries();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve department summaries from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const totalStudents = departments.reduce((acc, curr) => acc + curr.studentCount, 0);

  return (
    <div>
      <PageHeader
        title="Academic Departments"
        subtitle="Department breakdown and student enrollment distribution."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchDepartments}
              disabled={isLoading}
              title="Refresh department list"
            >
              <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
              <span>Refresh</span>
            </button>
            <Link to="/students" className="btn btn-secondary">
              <span>View All Students</span>
            </Link>
          </div>
        }
      />

      {error ? (
        <EmptyState
          title="Connection Error"
          description={error}
          action={
            <button type="button" className="btn btn-secondary" onClick={fetchDepartments}>
              Retry Connection
            </button>
          }
        />
      ) : isLoading ? (
        <LoadingState message="Calculating department distribution..." />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={<Building2 size={32} />}
          title="No Departments Active"
          description="There are currently no departments represented because no students have been registered in the database yet."
          action={
            <Link to="/students/new" className="btn btn-primary">
              <PlusCircle size={15} />
              <span>Add First Student</span>
            </Link>
          }
        />
      ) : (
        <>
          <div style={{ marginBottom: 20, fontSize: 13.5, color: 'var(--color-text-muted)' }}>
            Total <strong>{departments.length}</strong> departments active across{' '}
            <strong>{totalStudents}</strong> enrolled students. Click any department card to view its student roster.
          </div>

          <div className="dept-grid">
            {departments.map((dept) => {
              const percentage = totalStudents > 0 
                ? Math.round((dept.studentCount / totalStudents) * 100) 
                : 0;

              return (
                <Link
                  key={dept.department}
                  to={`/students?department=${encodeURIComponent(dept.department)}`}
                  className="dept-card"
                  title={`View all students in ${dept.department}`}
                >
                  <div>
                    <div className="dept-card-top">
                      <h3 className="dept-card-name">{dept.department}</h3>
                      <Building2 size={20} style={{ color: 'var(--color-brand)', opacity: 0.8 }} />
                    </div>

                    <div className="dept-card-count">
                      {dept.studentCount}
                      <span style={{ fontSize: 13, color: 'var(--color-text-light)', marginLeft: 8, fontFamily: 'var(--font-sans)' }}>
                        students ({percentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="dept-card-footer">
                    <span>Explore department roster</span>
                    <ArrowRight size={13} style={{ marginLeft: 'auto' }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
