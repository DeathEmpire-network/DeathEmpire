import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://deathempire-network.github.io',
  base: '/DeathEmpire',
  trailingSlash: 'always',
  build: {
    assets: '_astro',
  },
  vite: {
    server: {
      port: 4321,
    },
  },
});