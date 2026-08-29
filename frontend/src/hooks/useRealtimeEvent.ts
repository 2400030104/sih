import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

/**
 * Custom hook to subscribe to a Socket.IO event with automatic cleanup
 */
export function useRealtimeEvent<T = any>(
  event: string,
  handler: (payload: T) => void
) {
  const { socket } = useSocket();
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const eventListener = (payload: T) => {
      if (savedHandler.current) {
        savedHandler.current(payload);
      }
    };

    socket.on(event, eventListener);

    return () => {
      socket.off(event, eventListener);
    };
  }, [socket, event]);
}

export default useRealtimeEvent;
