const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'screenshots');

// Criar diretório de screenshots se não existir
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });

  const baseUrl = 'http://localhost:3001';

  const screenshots = [
    { name: '01-home.png', url: `${baseUrl}/` },
    { name: '02-shop.png', url: `${baseUrl}/shop` },
    { name: '03-about.png', url: `${baseUrl}/about` },
  ];

  try {
    for (const screenshot of screenshots) {
      console.log(`📸 Capturando: ${screenshot.name}...`);
      await page.goto(screenshot.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Aguardar carregamento completo
      await page.screenshot({ path: path.join(screenshotsDir, screenshot.name) });
      console.log(`✅ Salvo: ${screenshot.name}`);
    }

    console.log('\n✅ Todos os screenshots foram capturados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao capturar screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
