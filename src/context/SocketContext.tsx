import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../services/socket';

export interface RealtimeEventItem {
  id: string;
  event: string;
  timestamp: string;
  data: any;
  description: string;
}

interface SocketContextValue {
  socket: Socket;
  connected: boolean;
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
  recentEvents: RealtimeEventItem[];
  joinRoom: (room: string, id?: number | string) => void;
  leaveRoom: (room: string, id?: number | string) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = getSocket();
  const [connected, setConnected] = useState<boolean>(socket.connected);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>(
    socket.connected ? 'connected' : 'disconnected'
  );
  const [recentEvents, setRecentEvents] = useState<RealtimeEventItem[]>([]);

  const addEventToFeed = useCallback((event: string, payload: any) => {
    let description = 'System update received';

    if (event === 'PROJECT_CREATED') {
      description = `Project Created: ${payload.data?.projectCode || 'New Project'}`;
    } else if (event === 'PROJECT_UPDATED') {
      description = `Project Updated: ${payload.data?.projectCode || `Project #${payload.data?.projectId}`}`;
    } else if (event === 'MONTHLY_DATA_ADDED') {
      description = `Monthly monitoring logged for Project #${payload.data?.projectId}`;
    } else if (event === 'MILESTONE_UPDATED') {
      description = `Milestone updated for Project #${payload.data?.projectId}`;
    } else if (event === 'RISK_UPDATED') {
      description = `Risk evaluated: Project #${payload.data?.projectId} (${payload.data?.riskLevel || 'Updated'})`;
    } else if (event === 'ALERT_CREATED') {
      description = `Warning Alert: ${payload.data?.title || 'New Alert'}`;
    } else if (event === 'ALERT_ACKNOWLEDGED') {
      description = `Alert #${payload.data?.alertId} acknowledged`;
    } else if (event === 'ALERT_RESOLVED') {
      description = `Alert #${payload.data?.alertId} marked resolved`;
    } else if (event === 'DASHBOARD_UPDATED') {
      description = `Dashboard KPIs refreshed (${payload.data?.reason || 'Update'})`;
    }

    const newItem: RealtimeEventItem = {
      id: `${Date.now()}-${Math.random()}`,
      event,
      timestamp: payload.timestamp || new Date().toISOString(),
      data: payload.data,
      description
    };

    setRecentEvents((prev) => [newItem, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setConnectionStatus('connected');
    };

    const onDisconnect = () => {
      setConnected(false);
      setConnectionStatus('disconnected');
    };

    const onReconnectAttempt = () => {
      setConnectionStatus('reconnecting');
    };

    const onReconnect = () => {
      setConnected(true);
      setConnectionStatus('connected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect', onReconnect);

    // Activity feed listeners
    const monitoredEvents = [
      'PROJECT_CREATED',
      'PROJECT_UPDATED',
      'MONTHLY_DATA_ADDED',
      'MILESTONE_UPDATED',
      'RISK_UPDATED',
      'ALERT_CREATED',
      'ALERT_ACKNOWLEDGED',
      'ALERT_RESOLVED',
      'DASHBOARD_UPDATED'
    ];

    monitoredEvents.forEach((evt) => {
      socket.on(evt, (payload) => addEventToFeed(evt, payload));
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect', onReconnect);
      monitoredEvents.forEach((evt) => {
        socket.off(evt);
      });
    };
  }, [socket, addEventToFeed]);

  const joinRoom = useCallback(
    (room: string, id?: number | string) => {
      if (!socket.connected) return;
      if (room === 'dashboard') socket.emit('join_dashboard');
      else if (room === 'alerts') socket.emit('join_alerts');
      else if (room === 'risk-analytics') socket.emit('join_risk_analytics');
      else if (room === 'project' && id) socket.emit('join_project', id);
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (room: string, id?: number | string) => {
      if (!socket.connected) return;
      if (room === 'dashboard') socket.emit('leave_dashboard');
      else if (room === 'alerts') socket.emit('leave_alerts');
      else if (room === 'risk-analytics') socket.emit('leave_risk_analytics');
      else if (room === 'project' && id) socket.emit('leave_project', id);
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        connectionStatus,
        recentEvents,
        joinRoom,
        leaveRoom
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
