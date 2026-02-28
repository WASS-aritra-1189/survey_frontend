import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface WebSocketMessage {
  type: "notification" | "data_update" | "activity" | "alert" | "stats";
  payload: any;
  timestamp: Date;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  notifications: WebSocketMessage[];
  sendMessage: (message: any) => void;
  clearNotifications: () => void;
  reconnect: () => void;
}

// Simulated real-time updates for demo purposes
export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const simulatedMessages: Omit<WebSocketMessage, "timestamp">[] = [
    { type: "notification", payload: { title: "New Response", message: "Customer Survey received 5 new responses" } },
    { type: "data_update", payload: { entity: "users", count: 156, change: 2 } },
    { type: "activity", payload: { user: "John Doe", action: "completed survey", target: "Employee Feedback" } },
    { type: "alert", payload: { severity: "warning", message: "Device #D-245 battery low (15%)" } },
    { type: "stats", payload: { responses: 1250, completion: 78, activeUsers: 45 } },
    { type: "notification", payload: { title: "Survey Published", message: "Product Feedback Survey is now live" } },
    { type: "data_update", payload: { entity: "surveys", count: 24, change: 1 } },
    { type: "alert", payload: { severity: "info", message: "System backup completed successfully" } },
  ];

  const connect = useCallback(() => {
    // Simulate WebSocket connection
    setTimeout(() => {
      setIsConnected(true);
      toast.success("Real-time sync connected", { duration: 2000 });
    }, 1000);

    // Simulate receiving messages at random intervals
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * simulatedMessages.length);
      const message: WebSocketMessage = {
        ...simulatedMessages[randomIndex],
        timestamp: new Date(),
      };
      
      setLastMessage(message);
      setNotifications((prev) => [message, ...prev].slice(0, 50));
      
      // Show toast for certain message types
      if (message.type === "notification" || message.type === "alert") {
        const severity = message.payload.severity || "info";
        const toastFn = severity === "warning" ? toast.warning : 
                        severity === "error" ? toast.error : toast.info;
        toastFn(message.payload.title || message.payload.message, {
          description: message.payload.message,
          duration: 3000,
        });
      }
    }, 15000 + Math.random() * 10000); // Random interval between 15-25 seconds
  }, []);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  const sendMessage = useCallback((message: any) => {
    console.log("Sending WebSocket message:", message);
    // In a real implementation, this would send to the WebSocket server
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    notifications,
    sendMessage,
    clearNotifications,
    reconnect,
  };
}
