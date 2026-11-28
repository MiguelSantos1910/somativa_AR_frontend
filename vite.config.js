import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), basicSsl()],
  server: {
    // Repassa /api/... para o json-server, pelo mesmo endereço https do app
    // (permite acessar a API pelo celular sem erro de "conteúdo misto")
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
