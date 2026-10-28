import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedDept,
  onDeptChange,
  departments = [],
}) {
  return (
    <div className="search-filter-cluster">
      <div className="search-input-wrap">
        <Search />
        <input
          type="text"
          className="search-field"
          placeholder="Search by ID, student name, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search students"
        />
      </div>

      <select
        className="dept-select-filter"
        value={selectedDept}
        onChange={(e) => onDeptChange(e.target.value)}
        aria-label="Filter by department"
      >
        <option value="">All Departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
}
