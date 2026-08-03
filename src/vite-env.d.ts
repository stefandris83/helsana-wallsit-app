/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_CODE?: string;
  readonly VITE_INSTRUCTION_VIDEO_URL?: string;
  readonly VITE_INSTRUCTION_VIDEO_TRACK_URL?: string;
  readonly VITE_FEATURE_SKIP_REST?: string;
  readonly VITE_MIN_GROUP_SIZE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
