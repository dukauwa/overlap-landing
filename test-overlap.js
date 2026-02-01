const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testOverlapWebsite() {
  console.log('🚀 Starting browser test for overlap.so...\n');

  let browser;
  let page;
  const errors = [];

  try {
    // Step 1: Launch browser
    console.log('1. Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('✅ Browser launched\n');

    // Step 2: Create new page
    console.log('2. Creating new page...');
    page = await browser.newPage();

    // Set viewport size
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('✅ New page created\n');

    // Listen for console messages from the page
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`   [Browser ${type}]: ${text}`);
      if (type === 'error') {
        errors.push(`Console error: ${text}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`   [Page Error]: ${error.message}`);
      errors.push(`Page error: ${error.message}`);
    });

    // Listen for failed requests
    page.on('requestfailed', request => {
      console.log(`   [Failed Request]: ${request.url()}`);
      errors.push(`Failed request: ${request.url()}`);
    });

    // Listen for 404 responses
    page.on('response', response => {
      if (response.status() === 404) {
        console.log(`   [404 Not Found]: ${response.url()}`);
        errors.push(`404 Not Found: ${response.url()}`);
      }
    });

    // Step 3: Navigate to localhost:3001
    console.log('3. Navigating to http://localhost:3001...');
    const response = await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const status = response.status();
    console.log(`✅ Navigation complete - HTTP Status: ${status}\n`);

    if (status !== 200) {
      errors.push(`HTTP status ${status} (expected 200)`);
    }

    // Step 4: Wait 10 seconds for frames to load
    console.log('4. Waiting 10 seconds for frames to load...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('✅ Wait complete\n');

    // Step 5: Take screenshot of loading state
    console.log('5. Taking screenshot of loading state...');
    const loadingScreenshot = '/tmp/overlap-loading.png';
    await page.screenshot({
      path: loadingScreenshot,
      fullPage: false
    });
    console.log(`✅ Screenshot saved to ${loadingScreenshot}\n`);

    // Check for loading progress bar
    console.log('6. Checking for loading progress bar...');
    const hasProgressBar = await page.evaluate(() => {
      // Look for common progress bar indicators
      const progressSelectors = [
        '[role="progressbar"]',
        '.progress',
        '.loading',
        '.loader',
        'progress'
      ];

      for (const selector of progressSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          return {
            found: true,
            selector: selector,
            visible: element.offsetParent !== null,
            styles: window.getComputedStyle(element).cssText.slice(0, 200)
          };
        }
      }
      return { found: false };
    });

    if (hasProgressBar.found) {
      console.log(`✅ Progress bar found: ${hasProgressBar.selector}`);
      console.log(`   Visible: ${hasProgressBar.visible}`);
    } else {
      console.log('⚠️  No progress bar element detected');
    }
    console.log('');

    // Step 6: Scroll down the page
    console.log('7. Scrolling down the page...');
    await page.evaluate(() => {
      window.scrollBy(0, 800);
    });

    // Wait a bit for any scroll animations
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Scrolled down 800px\n');

    // Step 7: Take screenshot of scrolled state
    console.log('8. Taking screenshot of scrolled state...');
    const scrolledScreenshot = '/tmp/overlap-scrolled.png';
    await page.screenshot({
      path: scrolledScreenshot,
      fullPage: false
    });
    console.log(`✅ Screenshot saved to ${scrolledScreenshot}\n`);

    // Get page title and basic info
    const title = await page.title();
    const url = page.url();

    // Check for any visible text content
    const hasContent = await page.evaluate(() => {
      const body = document.body;
      return body && body.innerText.length > 0;
    });

    // Summary Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY REPORT');
    console.log('='.repeat(60));
    console.log(`Page Title: ${title}`);
    console.log(`Final URL: ${url}`);
    console.log(`HTTP Status: ${status}`);
    console.log(`Has Content: ${hasContent ? 'Yes' : 'No'}`);
    console.log(`Progress Bar: ${hasProgressBar.found ? 'Found' : 'Not Found'}`);
    console.log(`Errors Detected: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ No errors detected!');
    }

    console.log('\n📸 Screenshots saved:');
    console.log(`   - ${loadingScreenshot}`);
    console.log(`   - ${scrolledScreenshot}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  } finally {
    // Cleanup
    if (browser) {
      console.log('🧹 Closing browser...');
      await browser.close();
      console.log('✅ Browser closed');
    }
  }
}

// Run the test
testOverlapWebsite();
