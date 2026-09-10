/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __jidouuntenAnalyticsLoaded?: boolean;
  __jidouuntenPendingEvents?: Array<{ event: string; payload?: Record<string, unknown> }>;
  jidouuntenTrack?: (event: string, payload?: Record<string, unknown>) => void;
  jidouuntenSave?: (kind: 'search' | 'compare', href: string, label: string, snapshot?: unknown) => boolean;
  jidouuntenSavedResumeRender?: () => unknown;
}
