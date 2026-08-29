import { useState, useEffect, useCallback, useRef } from 'react';
import { getAlerts, acknowledgeAlert, resolveAlert } from '../services/api';
import { Alert } from '../services/types';
import { useSocket } from '../context/SocketContext';
import useRealtimeEvent from './useRealtimeEvent';

export function useAlerts(initialParams: { severity?: string; status?: string; alert_type?: string } = {}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { joinRoom, leaveRoom } = useSocket();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAlerts = useCallback(async (isBackgroundUpdate = false) => {
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getAlerts(params);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alerts');
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  }, [params]);

  useEffect(() => {
    joinRoom('alerts');
    fetchAlerts();

    return () => {
      leaveRoom('alerts');
    };
  }, [fetchAlerts, joinRoom, leaveRoom]);

  // Real-Time Alert event handler
  const handleRealtimeAlertUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchAlerts(true);
    }, 400);
  }, [fetchAlerts]);

  useRealtimeEvent('ALERT_CREATED', handleRealtimeAlertUpdate);
  useRealtimeEvent('ALERT_ACKNOWLEDGED', handleRealtimeAlertUpdate);
  useRealtimeEvent('ALERT_RESOLVED', handleRealtimeAlertUpdate);

  const handleAcknowledge = async (alertId: number) => {
    try {
      await acknowledgeAlert(alertId);
      await fetchAlerts();
    } catch (err: any) {
      setError(err.message || 'Failed to acknowledge alert');
    }
  };

  const handleResolve = async (alertId: number) => {
    try {
      await resolveAlert(alertId);
      await fetchAlerts();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve alert');
    }
  };

  const setFilter = (newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return {
    alerts,
    loading,
    error,
    params,
    setFilter,
    handleAcknowledge,
    handleResolve,
    refetch: fetchAlerts
  };
}
