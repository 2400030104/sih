import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getHighRiskProjects,
  getCriticalProjects,
  getTrendingRisks,
  getRiskDistribution
} from '../services/api';
import { TrendingRiskProject, RiskDistributionMetric } from '../services/types';
import { useSocket } from '../context/SocketContext';
import useRealtimeEvent from './useRealtimeEvent';

export function useRisk() {
  const [highRiskProjects, setHighRiskProjects] = useState<any[]>([]);
  const [criticalProjects, setCriticalProjects] = useState<any[]>([]);
  const [trendingRisks, setTrendingRisks] = useState<TrendingRiskProject[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistributionMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { joinRoom, leaveRoom } = useSocket();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRiskData = useCallback(async (isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    setError(null);
    try {
      const [highData, critData, trendData, distData] = await Promise.all([
        getHighRiskProjects(),
        getCriticalProjects(),
        getTrendingRisks(),
        getRiskDistribution()
      ]);

      setHighRiskProjects(highData);
      setCriticalProjects(critData);
      setTrendingRisks(trendData);
      setRiskDistribution(distData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch risk analytics');
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    joinRoom('risk-analytics');
    fetchRiskData();

    return () => {
      leaveRoom('risk-analytics');
    };
  }, [fetchRiskData, joinRoom, leaveRoom]);

  // Real-Time Risk event handler
  const handleRealtimeRiskUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchRiskData(true);
    }, 400);
  }, [fetchRiskData]);

  useRealtimeEvent('RISK_UPDATED', handleRealtimeRiskUpdate);

  return {
    highRiskProjects,
    criticalProjects,
    trendingRisks,
    riskDistribution,
    loading,
    error,
    refetch: fetchRiskData
  };
}
