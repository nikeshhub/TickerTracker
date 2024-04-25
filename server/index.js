import puppeteer from "puppeteer";
import fs from "fs";
import cron from "node-cron";

const getTodaysPrice = async () => {
  const filePath = "./output/today_price.json";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Setting a user agent string to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );

  await page.goto("https://www.nepalstock.com.np/today-price", {
    timeout: 60000, //six second timeout
  });

  //selector for header
  const headerSelector =
    "body > app-root > div > main > div > app-today-price > div > div.table-responsive > table > thead > tr";
  //selector for body
  const rowsSelector =
    "body > app-root > div > main > div > app-today-price > div > div.table-responsive > table > tbody > tr";
  //needed differently because header is needed for key and body for value in stored json data

  //waiting 10 seconds for contents to appear on the page
  await page.waitForSelector(headerSelector, { timeout: 10000 });
  await page.waitForSelector(rowsSelector, { timeout: 10000 });

  // Extracting the headers
  const headers = await page.evaluate((selector) => {
    const headerRow = document.querySelector(selector);
    if (headerRow) {
      const cells = headerRow.querySelectorAll("th");
      return Array.from(cells).map((cell) => cell.textContent.trim());
    }
    return [];
  }, headerSelector);

  // Extracting prices from each row and create a JSON object for each company
  const companiesData = await page.evaluate(
    (selector, headers) => {
      const rows = document.querySelectorAll(selector);
      const data = [];

      rows.forEach((row) => {
        const rowData = {};
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
          const key = headers[index];
          const value = cell.textContent.trim();
          rowData[key] = value;
        });

        data.push(rowData);
      });

      return data;
    },
    rowsSelector,
    headers
  );

  // save the data
  fs.writeFile(filePath, JSON.stringify(companiesData, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Companies data saved to file: ${filePath}`);
    }
  });

  await browser.close();
};

cron.schedule("0 9 * * *", getTodaysPrice, {
  timezone: "Asia/Kathmandu",
});
