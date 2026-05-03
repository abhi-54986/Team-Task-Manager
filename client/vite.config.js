import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const allowedPreviewHosts = [
  'team-task-manager-production-3bfc.up.railway.app',
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.VITE_ALLOWED_HOST
].filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: allowedPreviewHosts
  }
});
