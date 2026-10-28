import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function StudentTable({
  students = [],
  onDelete,
  pageSize = 8,
}) {
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortField, sortOrder]);

  // Pagination calculation
  const totalRecords = sortedStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRows = sortedStudents.slice(startIndex, endIndex);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--color-brand)' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--color-brand)' }} />
    );
  };

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table" aria-label="Student records table">
          <thead>
            <tr>
              <th 
                className="sortable" 
                onClick={() => handleSort('id')}
                style={{ width: '90px' }}
              >
                <span className="th-content">
                  ID {renderSortIcon('id')}
                </span>
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('name')}
              >
                <span className="th-content">
                  Full Name {renderSortIcon('name')}
                </span>
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('email')}
              >
                <span className="th-content">
                  Email Address {renderSortIcon('email')}
                </span>
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('department')}
              >
                <span className="th-content">
                  Department {renderSortIcon('department')}
                </span>
              </th>
              <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((student) => (
              <tr key={student.id}>
                <td>
                  <span className="student-id-pill">#{student.id}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{student.name}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{student.email}</td>
                <td>
                  <span className="dept-tag">{student.department}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <Link
                      to={`/students/${student.id}`}
                      className="btn btn-secondary btn-icon btn-sm"
                      title="View Details"
                      aria-label={`View details for ${student.name}`}
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      to={`/students/${student.id}/edit`}
                      className="btn btn-secondary btn-icon btn-sm"
                      title="Edit Student"
                      aria-label={`Edit ${student.name}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-icon btn-sm"
                      onClick={() => onDelete(student)}
                      title="Delete Student"
                      aria-label={`Delete ${student.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalRecords > 0 && (
        <div className="table-pagination">
          <div>
            Showing <strong>{startIndex + 1}</strong> to <strong>{endIndex}</strong> of{' '}
            <strong>{totalRecords}</strong> records
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${page === safePage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
