import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      // The Arena preview proxy serves the app from a *.e2b.app host.
      allowedHosts: true,
    },
    build: {
      // Split heavy vendor libraries into their own long-lived chunks so the
      // entry bundle stays small and cacheable. The WebGL stack (three) is only
      // pulled in by the lazily-loaded 3D scenes.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            const parts = id.split(/[\\/]/);
            const pkg = parts[parts.indexOf('node_modules') + 1] || '';
            if (pkg === 'three' || pkg.startsWith('@react-three')) return 'three';
            if (pkg === 'firebase' || pkg.startsWith('@firebase')) return 'firebase';
            if (pkg === 'gsap') return 'gsap';
            if (pkg === 'lenis') return 'scroll';
            if (pkg === 'motion' || pkg === 'framer-motion') return 'motion';
            if (pkg === 'lucide-react') return 'icons';
            if (pkg === 'react' || pkg === 'react-dom' || pkg === 'scheduler') return 'react';
            return;
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
