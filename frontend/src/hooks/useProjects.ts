import { useState, useEffect, useCallback, useRef } from 'react';
import { getProjects, ProjectQueryParams } from '../services/api';
import { ProjectListItem, Pagination } from '../services/types';
import useRealtimeEvent from './useRealtimeEvent';

export function useProjects(initialParams: ProjectQueryParams = { page: 1, limit: 20 }) {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [params, setParams] = useState<ProjectQueryParams>(initialParams);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProjects = useCallback(async (isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await getProjects(params);
      setProjects(result.projects);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  }, [params]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle Real-Time Project events
  const handleRealtimeProjectUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchProjects(true);
    }, 400);
  }, [fetchProjects]);

  useRealtimeEvent('PROJECT_CREATED', handleRealtimeProjectUpdate);
  useRealtimeEvent('PROJECT_UPDATED', handleRealtimeProjectUpdate);
  useRealtimeEvent('PROJECT_DELETED', handleRealtimeProjectUpdate);

  const updateFilters = (newFilters: Partial<ProjectQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1 // Reset to page 1 on filter changes
    }));
  };

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    projects,
    pagination,
    params,
    loading,
    error,
    updateFilters,
    setPage,
    setLimit,
    refetch: fetchProjects
  };
}
