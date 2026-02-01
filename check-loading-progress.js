const puppeteer = require('puppeteer');

async function checkLoadingProgress() {
  console.log('🎬 Checking loading progress and animation...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Track loading progress over time
  console.log('\n📊 Monitoring canvas animation frames...\n');

  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const frameInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { found: false };

      const ctx = canvas.getContext('2d');
      if (!ctx) return { found: true, hasContext: false };

      // Get pixel data to see if canvas is actually rendering
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const pixels = imageData.data;

      // Count non-zero pixels
      let nonZeroPixels = 0;
      for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] !== 0) nonZeroPixels++;
      }

      // Check title opacity (used as progress indicator)
      const title = document.getElementById('hero-title');
      const titleOpacity = title ? window.getComputedStyle(title).opacity : null;

      // Get scroll position
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      return {
        found: true,
        hasContext: true,
        canvasSize: `${canvas.width}x${canvas.height}`,
        nonZeroPixels: nonZeroPixels,
        titleOpacity: titleOpacity,
        titleText: title ? title.textContent : null,
        scrollY: scrollY,
        scrollHeight: scrollHeight,
        clientHeight: clientHeight
      };
    });

    if (frameInfo.found && frameInfo.hasContext) {
      console.log(`Frame ${i + 1}/10:`);
      console.log(`  Canvas: ${frameInfo.canvasSize}, Non-zero pixels: ${frameInfo.nonZeroPixels}`);
      console.log(`  Title: "${frameInfo.titleText}" (opacity: ${frameInfo.titleOpacity})`);
      console.log(`  Scroll: ${frameInfo.scrollY}/${frameInfo.scrollHeight}\n`);
    }
  }

  // Now test scroll-based animation
  console.log('📜 Testing scroll-based animation...\n');

  for (let scrollPos = 0; scrollPos <= 2000; scrollPos += 400) {
    await page.evaluate((pos) => {
      window.scrollTo(0, pos);
    }, scrollPos);

    await new Promise(resolve => setTimeout(resolve, 500));

    const state = await page.evaluate(() => {
      const title = document.getElementById('hero-title');
      return {
        scrollY: window.scrollY,
        titleOpacity: title ? window.getComputedStyle(title).opacity : null,
        titleVisible: title ? title.offsetParent !== null : false
      };
    });

    console.log(`Scroll: ${state.scrollY}px - Title opacity: ${state.titleOpacity}, visible: ${state.titleVisible}`);

    // Take screenshot at interesting scroll positions
    if (scrollPos === 0 || scrollPos === 800 || scrollPos === 2000) {
      await page.screenshot({
        path: `/tmp/overlap-scroll-${scrollPos}.png`
      });
      console.log(`  📸 Screenshot saved: /tmp/overlap-scroll-${scrollPos}.png`);
    }
  }

  console.log('\n✅ Loading and animation check complete!');
  await browser.close();
}

checkLoadingProgress().catch(console.error);
