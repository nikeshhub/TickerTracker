const { default: puppeteer } = require("puppeteer");

const hitWeb = async () => {
  const browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto("https://www.npmjs.com/package/puppeteer");

  const title = await page.evaluate(() => document.title);
  console.log(title);
  await browser.close();
};

hitWeb();
