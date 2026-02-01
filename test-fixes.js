const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Testing UI fixes...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  console.log('✅ Page loaded\n');

  // Wait for loading to complete and animations to play
  console.log('2. Waiting for loading and intro animation...');
  await new Promise(resolve => setTimeout(resolve, 4000));
  console.log('✅ Wait complete\n');

  // Take screenshot showing initial state with text visible
  console.log('3. Taking screenshot of initial state (text should be visible)...');
  await page.screenshot({ path: '/tmp/overlap-fix-initial.png' });
  console.log('✅ Screenshot saved to /tmp/overlap-fix-initial.png\n');

  // Check if text is visible (opacity should be 1 after intro animation)
  console.log('4. Checking element opacities...');

  const titleOpacity = await page.$eval('#hero-title', el =>
    window.getComputedStyle(el).opacity
  );
  console.log(`   - Hero title opacity: ${titleOpacity} ${titleOpacity === '1' ? '✅' : '❌'}`);

  const descOpacity = await page.$eval('#hero-description', el =>
    window.getComputedStyle(el).opacity
  );
  console.log(`   - Hero description opacity: ${descOpacity} ${descOpacity === '1' ? '✅' : '❌'}`);

  const ctaOpacity = await page.$eval('#hero-cta', el =>
    window.getComputedStyle(el).opacity
  );
  console.log(`   - Hero CTA opacity: ${ctaOpacity} ${ctaOpacity === '1' ? '✅' : '❌'}`);

  const gradientOpacity = await page.$eval('#hero-gradient', el =>
    window.getComputedStyle(el).opacity
  );
  console.log(`   - Gradient opacity: ${gradientOpacity} ${gradientOpacity === '1' ? '✅' : '❌'}`);

  // Check for text shadow (should NOT have one)
  const titleShadow = await page.$eval('#hero-title', el =>
    window.getComputedStyle(el).textShadow
  );
  console.log(`   - Text shadow: ${titleShadow === 'none' ? '✅ None (correct)' : '❌ Has shadow: ' + titleShadow}`);

  // Check background color
  const bodyBg = await page.$eval('body', el =>
    window.getComputedStyle(el).backgroundColor
  );
  console.log(`   - Body background: ${bodyBg} ${bodyBg.includes('0, 0, 0') ? '✅ Black' : '❌ Not black'}`);

  console.log();

  // Test scrolling up - should not show white
  console.log('5. Testing scroll behavior...');
  await page.evaluate(() => window.scrollTo(0, -100));
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.screenshot({ path: '/tmp/overlap-fix-scrollup.png' });
  console.log('✅ Screenshot saved to /tmp/overlap-fix-scrollup.png\n');

  await browser.close();
  console.log('✅ All tests complete!');
  console.log('\nScreenshots saved:');
  console.log('  - /tmp/overlap-fix-initial.png (should show text visible on load)');
  console.log('  - /tmp/overlap-fix-scrollup.png (should show black bg, no white)');
})();
