const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium'});
  console.log(await browser.version());
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.screenshot({path: 'google.png'});
  await browser.close();
})();