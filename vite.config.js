import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const proxy = {};

  for (const [path, endpoint] of [
    ['/api/student-login', env.VITE_LOGIN_URL],
    ['/api/student-schedule', env.VITE_SCHEDULE_URL],
    ['/api/rooms', env.VITE_ROOMS_URL],
  ]) {
    if (!endpoint) continue;

    const targetUrl = new URL(endpoint);

    proxy[path] = {
      target: targetUrl.origin,
      changeOrigin: true,
      cookiePathRewrite: '/',
      cookieDomainRewrite: '',
      rewrite: () => targetUrl.pathname + targetUrl.search,
    };
  }

  return {
    plugins: [react()],

    // Important for static hosting
    base: './',

    server: {
      proxy,
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/lucide-react/')) {
              return 'icons';
            }

            if (/[/\\]node_modules[/\\](react|react-dom|scheduler)[/\\]/.test(id)) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});