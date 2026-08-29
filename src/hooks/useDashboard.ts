import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getDashboardSummary,
  getProjectsBySector,
  getProjectsByMinistry,
  getProjectsByState,
  getRiskDistribution,
  getHighRiskProjects,
  getAlerts
} from '../services/api';
import {
  DashboardSummary,
  SectorMetric,
  MinistryMetric,
  StateMetric,
  RiskDistributionMetric,
  Alert
} from '../services/types';
import { useSocket } from '../context/SocketContext';
import useRealtimeEvent from './useRealtimeEvent';

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [sectors, setSectors] = useState<SectorMetric[]>([]);
  const [ministries, setMinistries] = useState<MinistryMetric[]>([]);
  const [states, setStates] = useState<StateMetric[]>([]);
  const [riskDist, setRiskDist] = useState<RiskDistributionMetric[]>([]);
  const [highRiskProjects, setHighRiskProjects] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { joinRoom, leaveRoom } = useSocket();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchDashboardData = useCallback(async (isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    setError(null);
    try {
      const [
        summaryData,
        sectorsData,
        ministriesData,
        statesData,
        riskDistData,
        highRiskData,
        alertsData
      ] = await Promise.all([
        getDashboardSummary(),
        getProjectsBySector(),
        getProjectsByMinistry(),
        getProjectsByState(),
        getRiskDistribution(),
        getHighRiskProjects(),
        getAlerts({ status: 'NEW' })
      ]);

      setSummary(summaryData);
      setSectors(sectorsData);
      setMinistries(ministriesData);
      setStates(statesData);
      setRiskDist(riskDistData);
      setHighRiskProjects(highRiskData);
      setRecentAlerts(alertsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  }, []);

  // Initial load & Room management
  useEffect(() => {
    joinRoom('dashboard');
    fetchDashboardData();

    return () => {
      leaveRoom('dashboard');
    };
  }, [fetchDashboardData, joinRoom, leaveRoom]);

  // Debounced auto-refetch handler on Socket.IO events
  const handleRealtimeUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchDashboardData(true);
    }, 400);
  }, [fetchDashboardData]);

  // Subscribe to real-time events that affect the dashboard
  useRealtimeEvent('DASHBOARD_UPDATED', handleRealtimeUpdate);
  useRealtimeEvent('PROJECT_CREATED', handleRealtimeUpdate);
  useRealtimeEvent('PROJECT_UPDATED', handleRealtimeUpdate);
  useRealtimeEvent('PROJECT_DELETED', handleRealtimeUpdate);
  useRealtimeEvent('ALERT_CREATED', handleRealtimeUpdate);
  useRealtimeEvent('ALERT_RESOLVED', handleRealtimeUpdate);

  return {
    summary,
    sectors,
    ministries,
    states,
    riskDist,
    highRiskProjects,
    recentAlerts,
    loading,
    error,
    refetch: fetchDashboardData
  };
}
