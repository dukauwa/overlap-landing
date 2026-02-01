const puppeteer = require('puppeteer');

async function analyzePage() {
  console.log('🔍 Analyzing overlap.so page structure...\n');

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

  // Wait a bit for any dynamic content
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Analyze page structure
  const analysis = await page.evaluate(() => {
    const results = {
      body: {
        innerHTML: document.body.innerHTML,
        classes: Array.from(document.body.classList),
        styles: window.getComputedStyle(document.body).cssText.slice(0, 500)
      },
      allElements: [],
      canvasElements: [],
      animatedElements: [],
      loadingIndicators: []
    };

    // Get all elements
    const allElements = document.querySelectorAll('*');
    results.elementCount = allElements.length;

    // Look for canvas elements
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      results.canvasElements.push({
        id: canvas.id,
        classes: Array.from(canvas.classList),
        width: canvas.width,
        height: canvas.height,
        style: canvas.getAttribute('style')
      });
    });

    // Look for elements with animation
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const animation = computedStyle.animation;
      const transition = computedStyle.transition;

      if ((animation && animation !== 'none') || (transition && transition !== 'all 0s ease 0s')) {
        results.animatedElements.push({
          tag: el.tagName,
          id: el.id,
          classes: Array.from(el.classList),
          animation: animation,
          transition: transition
        });
      }

      // Look for loading-related elements
      const classStr = el.className.toString().toLowerCase();
      const idStr = (el.id || '').toLowerCase();
      if (classStr.includes('load') || classStr.includes('progress') ||
          idStr.includes('load') || idStr.includes('progress')) {
        results.loadingIndicators.push({
          tag: el.tagName,
          id: el.id,
          classes: Array.from(el.classList),
          visible: el.offsetParent !== null
        });
      }
    });

    // Check for iframes
    results.iframes = Array.from(document.querySelectorAll('iframe')).map(iframe => ({
      src: iframe.src,
      id: iframe.id,
      classes: Array.from(iframe.classList)
    }));

    // Get all script tags
    results.scripts = Array.from(document.querySelectorAll('script')).map(script => ({
      src: script.src,
      type: script.type,
      async: script.async,
      defer: script.defer
    }));

    return results;
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 PAGE ANALYSIS RESULTS');
  console.log('='.repeat(60));

  console.log(`\nTotal Elements: ${analysis.elementCount}`);

  console.log(`\n🎨 Canvas Elements: ${analysis.canvasElements.length}`);
  analysis.canvasElements.forEach((canvas, i) => {
    console.log(`  ${i + 1}. ID: ${canvas.id || '(none)'}, Classes: ${canvas.classes.join(', ') || '(none)'}`);
    console.log(`     Size: ${canvas.width}x${canvas.height}`);
  });

  console.log(`\n🎬 Animated Elements: ${analysis.animatedElements.length}`);
  if (analysis.animatedElements.length > 0 && analysis.animatedElements.length < 10) {
    analysis.animatedElements.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tag}> id="${el.id}" class="${el.classes.join(' ')}"`);
    });
  } else if (analysis.animatedElements.length >= 10) {
    console.log(`  (Too many to list - ${analysis.animatedElements.length} total)`);
  }

  console.log(`\n⏳ Loading Indicators: ${analysis.loadingIndicators.length}`);
  analysis.loadingIndicators.forEach((el, i) => {
    console.log(`  ${i + 1}. <${el.tag}> id="${el.id}" class="${el.classes.join(' ')}" visible=${el.visible}`);
  });

  console.log(`\n🖼️  iFrames: ${analysis.iframes.length}`);
  analysis.iframes.forEach((iframe, i) => {
    console.log(`  ${i + 1}. src: ${iframe.src}`);
  });

  console.log(`\n📜 Scripts: ${analysis.scripts.length}`);
  const externalScripts = analysis.scripts.filter(s => s.src);
  console.log(`  External: ${externalScripts.length}`);
  console.log(`  Inline: ${analysis.scripts.length - externalScripts.length}`);

  console.log(`\n📝 Body Classes: ${analysis.body.classes.join(', ') || '(none)'}`);

  console.log('\n🔍 Body HTML (first 500 chars):');
  console.log(analysis.body.innerHTML.slice(0, 500).replace(/\n/g, ' ').replace(/\s+/g, ' '));

  console.log('\n' + '='.repeat(60));

  await browser.close();
}

analyzePage().catch(console.error);
