/**
 * Sentry Error & Telemetry Service
 * Zero native binary dependencies — 100% Expo Go & Web Safe
 */

export interface Breadcrumb {
  timestamp: string;
  category: string;
  message: string;
}

const MAX_BREADCRUMBS = 20;
const breadcrumbBuffer: Breadcrumb[] = [];

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
  addBreadcrumb('system', 'Sentry Telemetry initialized in Local/Cloud mode');
};

export const addBreadcrumb = (category: string, message: string) => {
  const item: Breadcrumb = {
    timestamp: new Date().toISOString(),
    category,
    message,
  };

  breadcrumbBuffer.push(item);
  if (breadcrumbBuffer.length > MAX_BREADCRUMBS) {
    breadcrumbBuffer.shift();
  }
};

export const getBreadcrumbs = (): readonly Breadcrumb[] => {
  return [...breadcrumbBuffer];
};

export const captureError = async (error: unknown, context?: string) => {
  const errorMsg = error instanceof Error ? error.message : String(error);
  addBreadcrumb('error', `${context ? `[${context}] ` : ''}${errorMsg}`);

  // Dispatches HTTP envelope if SENTRY_DSN is configured
  if (SENTRY_DSN && SENTRY_DSN.startsWith('http')) {
    try {
      await fetch(SENTRY_DSN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          message: errorMsg,
          context,
          breadcrumbs: breadcrumbBuffer.slice(-10),
        }),
      });
    } catch {
      // Safe fallback - telemetry failure should never halt application flow
    }
  } else {
    // Local development log
    console.warn(`[Sentry Telemetry // ${context || 'General'}]:`, errorMsg);
  }
};
