// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://deathempire-network.github.io',
  base: '/DeathEmpire',
  output: 'static',
  trailingSlash: 'always',
});