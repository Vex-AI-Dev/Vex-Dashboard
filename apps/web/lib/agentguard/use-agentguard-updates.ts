'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

const WS_URL = process.env.NEXT_PUBLIC_AGENTGUARD_WS_URL;
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1_000;

interface UseAgentGuardUpdatesOptions {
  agentId?: string;
  enabled?: boolean;
}

/**
 * Connects to the AgentGuard dashboard-api WebSocket and triggers a
 * server-component refresh when new execution events arrive.
 *
 * Uses exponential back-off for reconnection (up to MAX_RETRIES) and
 * debounces rapid updates to a single `router.refresh()` per 500 ms.
 */
export function useAgentGuardUpdates(
  options?: UseAgentGuardUpdatesOptions,
): void {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    // Debounce: coalesce rapid updates into a single refresh
    if (refreshTimerRef.current) return;

    refreshTimerRef.current = setTimeout(() => {
      refreshTimerRef.current = null;
      router.refresh();
    }, 500);
  }, [router]);

  useEffect(() => {
    if (!WS_URL || options?.enabled === false) return;

    function connect() {
      const ws = new WebSocket(WS_URL!);
      wsRef.current = ws;

      ws.onopen = () => {
        retriesRef.current = 0;
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data as string) as {
            type?: string;
            data?: { agent_id?: string };
          };

          if (msg.type === 'execution.new') {
            // Filter by agentId if specified
            if (options?.agentId && msg.data?.agent_id !== options.agentId) {
              return;
            }

            scheduleRefresh();
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        wsRef.current = null;

        if (retriesRef.current < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, retriesRef.current);
          retriesRef.current++;
          setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      wsRef.current?.close();

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [options?.agentId, options?.enabled, scheduleRefresh]);
}
