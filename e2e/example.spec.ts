import { test, expect } from '@playwright/test';

test('has title and loads local dev server', async ({ page }) => {
  // Cambia la URL si tu sitio corre en otra ruta o puerto
  await page.goto('http://localhost:4321/DeathEmpire/');
  
  // Verifica que cargue la página correctamente
  await expect(page).toHaveTitle(/./);
});