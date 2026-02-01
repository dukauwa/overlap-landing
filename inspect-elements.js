const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all classes used in the page
    const allClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const classes = new Set();
      elements.forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls.trim()) classes.add(cls.trim());
          });
        }
      });
      return Array.from(classes).sort();
    });

    console.log('=== All CSS Classes Found ===');
    console.log(allClasses.join('\n'));

    // Search for alpha/badge related elements
    console.log('\n=== Searching for Alpha/Badge ===');
    const possibleBadge = await page.evaluate(() => {
      const selectors = [
        '[class*="alpha"]',
        '[class*="badge"]',
        '[class*="tag"]',
        '[class*="label"]',
        'nav div:last-child',
        'nav > *:last-child',
        'header div[class*="right"]',
        'header > div > div:last-child'
      ];
      
      const results = [];
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          results.push({
            selector: sel,
            text: el.innerText || el.textContent,
            className: el.className,
            html: el.outerHTML.substring(0, 200)
          });
        }
      });
      return results;
    });

    console.log(JSON.stringify(possibleBadge, null, 2));

    // Search for gradient elements
    console.log('\n=== Searching for Gradient ===');
    const gradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results = [];
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bg = style.background || style.backgroundImage;
        
        if (bg && (bg.includes('gradient') || bg.includes('radial'))) {
          results.push({
            tag: el.tagName,
            className: el.className,
            background: bg.substring(0, 150),
            position: style.position,
            zIndex: style.zIndex
          });
        }
      });
      return results;
    });

    console.log(JSON.stringify(gradients, null, 2));

    // Check navigation structure
    console.log('\n=== Navigation Structure ===');
    const navStructure = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      if (!nav) return 'No nav found';
      
      return {
        html: nav.outerHTML.substring(0, 500),
        children: Array.from(nav.children).map(child => ({
          tag: child.tagName,
          className: child.className,
          text: child.innerText?.substring(0, 50)
        }))
      };
    });

    console.log(JSON.stringify(navStructure, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
