const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Testing Figma design implementation...\n');

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

  // Wait for frames to load
  console.log('2. Waiting 5 seconds for frames to load...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  console.log('✅ Wait complete\n');

  // Take initial screenshot
  console.log('3. Taking initial screenshot...');
  await page.screenshot({ path: '/tmp/overlap-figma-initial.png' });
  console.log('✅ Screenshot saved to /tmp/overlap-figma-initial.png\n');

  // Check for design elements
  console.log('4. Checking for design elements...');

  const navigation = await page.$('nav');
  console.log(`   - Navigation: ${navigation ? '✅' : '❌'}`);

  const logo = await page.$('img[alt="Overlap"]');
  console.log(`   - Logo: ${logo ? '✅' : '❌'}`);

  const alphaBadge = await page.evaluate(() => {
    return document.body.innerText.includes('Alpha');
  });
  console.log(`   - Alpha badge: ${alphaBadge ? '✅' : '❌'}`);

  const heroTitle = await page.$('#hero-title');
  console.log(`   - Hero title: ${heroTitle ? '✅' : '❌'}`);

  const heroDescription = await page.$('#hero-description');
  console.log(`   - Hero description: ${heroDescription ? '✅' : '❌'}`);

  const heroCta = await page.$('#hero-cta');
  console.log(`   - Hero CTA: ${heroCta ? '✅' : '❌'}`);

  console.log();

  // Scroll to middle
  console.log('5. Scrolling to middle of page...');
  await page.evaluate(() => {
    window.scrollTo(0, 1200);
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('✅ Scrolled\n');

  // Take scrolled screenshot
  console.log('6. Taking scrolled screenshot...');
  await page.screenshot({ path: '/tmp/overlap-figma-scrolled.png' });
  console.log('✅ Screenshot saved to /tmp/overlap-figma-scrolled.png\n');

  // Check text opacity after scroll
  console.log('7. Checking text visibility after scroll...');
  const titleOpacity = await page.$eval('#hero-title', el => {
    return window.getComputedStyle(el).opacity;
  });
  console.log(`   - Hero title opacity: ${titleOpacity}\n`);

  await browser.close();
  console.log('✅ Test complete!');
})();
