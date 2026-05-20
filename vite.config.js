import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        service: resolve(__dirname, 'service.html'),
        auth: resolve(__dirname, 'auth.html'),
        cart: resolve(__dirname, 'cart.html')
      }
    }
  },
  test: {
    environment: 'jsdom', 
    globals: true          
  }
});