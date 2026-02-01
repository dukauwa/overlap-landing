const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a bit for animations to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Taking initial screenshot...');
    await page.screenshot({
      path: '/tmp/overlap-figma-initial.png',
      fullPage: false
    });

    // Check for required elements
    console.log('\n=== Verifying Elements ===\n');

    const elements = {
      'Navigation bar': 'nav',
      'Overlap logo': 'nav img, nav svg, nav [class*="logo"]',
      'Get early access button': 'nav button, nav a[href*="access"]',
      'Alpha badge': '[class*="alpha"], [class*="badge"]',
      'Radial gradient overlay': '[class*="gradient"], [class*="radial"]',
      'Hero text': 'h1, [class*="hero"] h1, [class*="headline"]',
      'Description text': 'p, [class*="description"]',
      'CTA button': 'button[class*="cta"], a[class*="cta"], button:not(nav button)'
    };

    const results = {};

    for (const [name, selector] of Object.entries(elements)) {
      try {
        const element = await page.$(selector);
        results[name] = element !== null;

        if (element) {
          // Get text content for text elements
          if (name.includes('text') || name.includes('button') || name.includes('badge')) {
            const text = await page.evaluate(el => el.innerText || el.textContent, element);
            console.log(`✓ ${name}: Found - "${text.trim().substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
          } else {
            console.log(`✓ ${name}: Found`);
          }
        } else {
          console.log(`✗ ${name}: NOT FOUND`);
        }
      } catch (error) {
        results[name] = false;
        console.log(`✗ ${name}: ERROR - ${error.message}`);
      }
    }

    // Check fonts
    console.log('\n=== Checking Fonts ===\n');

    const heroFont = await page.evaluate(() => {
      const hero = document.querySelector('h1');
      if (hero) {
        const style = window.getComputedStyle(hero);
        return style.fontFamily;
      }
      return null;
    });

    const bodyFont = await page.evaluate(() => {
      const body = document.querySelector('p');
      if (body) {
        const style = window.getComputedStyle(body);
        return style.fontFamily;
      }
      return null;
    });

    console.log(`Hero font (h1): ${heroFont}`);
    console.log(`Body font (p): ${bodyFont}`);

    if (heroFont && heroFont.toLowerCase().includes('playfair')) {
      console.log('✓ Playfair Display is used for headings');
    } else {
      console.log('✗ Playfair Display NOT detected for headings');
    }

    if (bodyFont && bodyFont.toLowerCase().includes('geist')) {
      console.log('✓ Geist is used for body text');
    } else {
      console.log('✗ Geist NOT detected for body text');
    }

    // Scroll down to test animations
    console.log('\n=== Testing Scroll Animations ===\n');

    await page.evaluate(() => {
      window.scrollTo(0, 400);
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Taking scrolled screenshot...');
    await page.screenshot({
      path: '/tmp/overlap-figma-scrolled.png',
      fullPage: false
    });

    // Get page HTML for further inspection
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    console.log('\n=== Page Structure ===\n');
    console.log(`Page contains ${bodyHTML.length} characters of HTML`);

    // Check for specific text content
    const pageText = await page.evaluate(() => document.body.innerText);

    if (pageText.includes('Connect once')) {
      console.log('✓ Hero text "Connect once. Stay in the loop forever." found');
    } else {
      console.log('✗ Hero text NOT found');
      console.log('Actual page text preview:', pageText.substring(0, 200));
    }

    console.log('\n=== Screenshots Saved ===\n');
    console.log('Initial: /tmp/overlap-figma-initial.png');
    console.log('Scrolled: /tmp/overlap-figma-scrolled.png');

  } catch (error) {
    console.error('Error during testing:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
})();
