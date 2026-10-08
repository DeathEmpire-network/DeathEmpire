import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_DIR = path.resolve(__dirname, '../../..');

test.describe('Security - Secret Scan', () => {
  test('No secrets in source files', () => {
    const secretPatterns = [
      /SUPABASE_SERVICE_ROLE_KEY/,
      /SUPABASE_JWT_SECRET/,
      /SUPABASE_DB_PASSWORD/,
      /UPSTASH_TOKEN/,
      /UPSTASH_REDIS_REST_TOKEN/,
      /QSTASH_TOKEN/,
      /GITHUB_TOKEN/,
      /PRIVATE_/,
      /SECRET_/,
      /service_role/,
      /JWT_SECRET/,
      /DB_PASSWORD/,
    ];

    const excludeDirs = ['node_modules', '.git', 'dist', '.astro', 'test-results', 'e2e'];
    const excludeFiles = ['.env.example', 'commit_msg.txt', 'pr_body_*.md'];

    function scanDir(dir: string): string[] {
      const violations: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!excludeDirs.includes(entry.name)) {
            violations.push(...scanDir(fullPath));
          }
        } else if (entry.isFile()) {
          const relPath = path.relative(SITE_DIR, fullPath);
          if (excludeFiles.some(ex => path.basename(fullPath).match(ex.replace('*', '.*')))) continue;

          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            for (const pattern of secretPatterns) {
              if (pattern.test(content)) {
                violations.push(`${relPath}: matches ${pattern}`);
              }
            }
          } catch {
            // Skip binary/unreadable files
          }
        }
      }
      return violations;
    }

    const violations = scanDir(SITE_DIR);

    if (violations.length > 0) {
      console.log('Secret scan violations:', violations);
    }

    expect(violations).toHaveLength(0);
  });

  test('.env.example exists with placeholders only', () => {
    const envExamplePath = path.join(SITE_DIR, '.env.example');
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const content = fs.readFileSync(envExamplePath, 'utf-8');
    expect(content).toContain('PUBLIC_SUPABASE_URL=');
    expect(content).toContain('PUBLIC_SUPABASE_PUBLISHABLE_KEY=');

    // No real values
    expect(content).not.toMatch(/PUBLIC_SUPABASE_URL=https?:\/\/[^=\s]+/);
    expect(content).not.toMatch(/PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ/);
  });

  test('No real Supabase keys in tracked files', () => {
    const supabaseKeyPattern = /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/;

    function scanForKeys(dir: string): string[] {
      const found: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', '.astro', 'test-results', 'e2e'].includes(entry.name)) {
            found.push(...scanForKeys(fullPath));
          }
        } else if (entry.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const matches = content.match(supabaseKeyPattern);
            if (matches) {
              const relPath = path.relative(SITE_DIR, fullPath);
              if (!['.env.example', '.env.local'].some(ex => fullPath.includes(ex))) {
                found.push(`${relPath}: ${matches[0].substring(0, 50)}...`);
              }
            }
          } catch {
            // Skip
          }
        }
      }
      return found;
    }

    const keys = scanForKeys(SITE_DIR);
    expect(keys).toHaveLength(0);
  });
});