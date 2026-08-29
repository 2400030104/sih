import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, RefreshCw, Layers } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { PageContainer } from '../components/layout/PageContainer';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { ProjectTable } from '../components/projects/ProjectTable';
import { AddProjectModal } from '../components/projects/AddProjectModal';
import { UpdateAmountModal } from '../components/project/UpdateAmountModal';
import { Pagination } from '../components/common/Pagination';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { ProjectListItem } from '../services/types';

export const Projects: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectListItem | null>(null);

  const initialRisk = searchParams.get('risk') ? searchParams.get('risk')!.toUpperCase() : undefined;
  const initialStatus = searchParams.get('status') ? searchParams.get('status')!.toUpperCase() : undefined;

  const {
    projects,
    pagination,
    params,
    loading,
    error,
    updateFilters,
    setPage,
    setLimit,
    refetch
  } = useProjects({
    page: 1,
    limit: 20,
    risk_level: initialRisk,
    status: initialStatus
  });

  // Sync URL query params if they change
  useEffect(() => {
    const risk = searchParams.get('risk')?.toUpperCase();
    const status = searchParams.get('status')?.toUpperCase();
    if (risk || status) {
      updateFilters({ risk_level: risk, status: status, page: 1 });
    }
  }, [searchParams]);

  return (
    <PageContainer
      title="Infrastructure Projects Directory"
      subtitle="Complete database of Central Sector infrastructure monitoring projects with live status and predictive risk ratings"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Project</span>
          </button>
        </div>
      }
    >
      {/* Search & Filters */}
      <ProjectFilters
        filters={params}
        onFilterChange={updateFilters}
        onReset={() =>
          updateFilters({
            search: undefined,
            status: undefined,
            risk_level: undefined,
            sortBy: 'project_id',
            sortOrder: 'ASC'
          })
        }
      />

      {/* Content State */}
      {loading ? (
        <Loading type="page" message="Loading project records from PAIMANA database..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Infrastructure Projects Match Query"
          description="Try clearing search keywords, adjusting status filters, or click 'Add Project' to register a new asset."
        />
      ) : (
        <div className="space-y-4">
          <ProjectTable
            projects={projects}
            onEditAmount={(proj) => setEditingProject(proj)}
          />
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          )}
        </div>
      )}

      {/* Add Project Modal Dialog */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Update Project Financial Amount Modal */}
      <UpdateAmountModal
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSuccess={() => refetch()}
        project={editingProject}
      />
    </PageContainer>
  );
};

export default Projects;
