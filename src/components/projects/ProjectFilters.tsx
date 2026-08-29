import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, X } from 'lucide-react';
import { ProjectQueryParams } from '../../services/api';

interface ProjectFiltersProps {
  filters: ProjectQueryParams;
  onFilterChange: (newFilters: Partial<ProjectQueryParams>) => void;
  onReset: () => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({ search: searchTerm.trim() || undefined, page: 1 });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, filters.search, onFilterChange]);

  const handleReset = () => {
    setSearchTerm('');
    onReset();
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.risk_level ||
    (filters.sortBy && filters.sortBy !== 'project_id')
  );

  return (
    <div className="bg-white p-4 rounded-card border border-slate-200 shadow-command-card space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name or code..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-btn text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || undefined, page: 1 })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-btn text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ONGOING">Ongoing</option>
            <option value="DELAYED">Delayed</option>
            <option value="COMPLETED">Completed</option>
            <option value="APPROVED">Approved</option>
            <option value="PROPOSED">Proposed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Risk Level Filter (No Emojis) */}
        <div>
          <select
            value={filters.risk_level || ''}
            onChange={(e) => onFilterChange({ risk_level: e.target.value || undefined, page: 1 })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-btn text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={`${filters.sortBy || 'project_id'}-${filters.sortOrder || 'ASC'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange({ sortBy, sortOrder: sortOrder as 'ASC' | 'DESC', page: 1 });
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-btn text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="project_id-ASC">Sort: Project ID</option>
            <option value="approved_cost-DESC">Cost: High to Low</option>
            <option value="approved_cost-ASC">Cost: Low to High</option>
            <option value="physical_progress-DESC">Progress: Highest</option>
            <option value="physical_progress-ASC">Progress: Lowest</option>
            <option value="overall_risk-DESC">Risk: Highest First</option>
            <option value="planned_completion_date-ASC">Target Completion</option>
          </select>
        </div>

        {/* Reset Action */}
        <div>
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-slate-700 rounded-btn text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold">Active:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
              Search: "{filters.search}"
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-900"
                onClick={() => {
                  setSearchTerm('');
                  onFilterChange({ search: undefined, page: 1 });
                }}
              />
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
              Status: {filters.status}
              <X
                className="w-3 h-3 cursor-pointer hover:text-slate-900"
                onClick={() => onFilterChange({ status: undefined, page: 1 })}
              />
            </span>
          )}
          {filters.risk_level && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
              Risk: {filters.risk_level}
              <X
                className="w-3 h-3 cursor-pointer hover:text-rose-900"
                onClick={() => onFilterChange({ risk_level: undefined, page: 1 })}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
