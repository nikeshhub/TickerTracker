# Nepal Stock Price Scraper

This project is a web scraper for fetching daily stock prices from the Nepal Stock Exchange website. The scrapping function is scheduled to run everyday at 11:00 AM just when the market opens.

## Tools and functionalities
- Puppeteer for scrapping. Table head and body of today's price page of nepse is scrapped.
- Node Cron for scheduling.
- fs for writing the data. The format of data stored can be seen on /output/today_price.json
