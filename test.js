const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  // Navigate to the surplus page
  await page.goto('https://surplus.iastate.edu/inventory');

  // Extract data from the page
  const data = await page.evaluate(() => {
    const itemElements = Array.from(document.querySelectorAll('.field-item.even > div:first-child'));
    const items = [];
    let currentItem = [];

    for (const element of itemElements) {
      const text = element.textContent.trim();

      if (text.startsWith('Updated:')) {
        // Start of a new item list, reset currentItem
        currentItem = [];
      } else if (text) {
        currentItem.push(text);
      } else {
        // Empty line, push currentItem to items array
        if (currentItem.length > 0) {
          items.push(currentItem);
        }
        currentItem = [];
      }
    }

    // Push the last item if it exists
    if (currentItem.length > 0) {
      items.push(currentItem);
    }

    return items.map(item => {
      const name = item[0].trim();
      const quantity = name.match(/\((\d+)\)/);
      const quantityValue = quantity ? parseInt(quantity[1]) : 1;
      const itemName = name.replace(/\(\d+\)\s*/, '').trim();
      const categories = [];

      return {
        quantity: quantityValue,
        name: itemName,
        categories
      };
    });
  });

  await browser.close();

  // Get the current date
  const currentDate = new Date().toISOString().split('T')[0];

  // Check if the lastRunDate.txt file exists
  try {
    const lastRunDate = fs.readFileSync('lastRunDate.txt', 'utf8').trim();

    // If the file exists, use the date from the file
    const dateToUse = lastRunDate || currentDate;

    // Add the date to each item in the data array
    const dataWithDate = data.map(item => ({ ...item, dateAdded: dateToUse }));

    // Convert the data to JSON and save it to a file
    const json = JSON.stringify(dataWithDate, null, 2);
    fs.writeFileSync('surplus_data.json', json);
    console.log('Data saved to surplus_data.json');
  } catch (err) {
    // If the file doesn't exist, create it with the current date
    fs.writeFileSync('lastRunDate.txt', currentDate);

    // Add the current date to each item in the data array
    const dataWithDate = data.map(item => ({ ...item, dateAdded: currentDate }));

    // Convert the data to JSON and save it to a file
    const json = JSON.stringify(dataWithDate, null, 2);
    fs.writeFileSync('surplus_data.json', json);
    console.log('Data saved to surplus_data.json');
  }
})();