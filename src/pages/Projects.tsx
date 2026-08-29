import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FolderKanban, Download, RefreshCw } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { PageContainer } from '../components/layout/PageContainer';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { ProjectTable } from '../components/projects/ProjectTable';
import { Pagination } from '../components/common/Pagination';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';

export const Projects: React.FC = () => {
  const [searchParams] = useSearchParams();
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-gov-card hover:bg-gov-elevated border border-gov-border rounded-btn text-xs font-bold text-gov-text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-accent' : ''}`} />
            <span>Refresh</span>
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
          description="Try clearing search keywords or adjusting status and risk level filters."
        />
      ) : (
        <div className="space-y-4">
          <ProjectTable projects={projects} />
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          )}
        </div>
      )}
    </PageContainer>
  );
};
