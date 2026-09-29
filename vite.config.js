import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendOtpEmail, verifyOtpCode } from './server/server.js'

function apiAuthPlugin() {
  return {
    name: 'api-auth-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/send-code' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = await sendOtpEmail(parsed.email);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message || "Xatolik yuz berdi" }));
            }
          });
          return;
        }

        if (url === '/api/verify-code' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = verifyOtpCode(parsed.email, parsed.code);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify(result));
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err.message || "Xatolik yuz berdi" }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiAuthPlugin(),
  ],
  server: {
    host: true,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    },
    watch: {
      ignored: ['**/Bog\'chaTop/**', '**/dist/**', '**/.git/**']
    }
  }
})
