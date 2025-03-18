// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1


//Import chromium model to automate web scraping 
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  //Wait for article list to load
  await page.waitForSelector("#pagespace")

  //Extract titles and tdata from the first 100 articles
  const articles = await page.$$eval("#pagespace .athing",(elements) => {
    return elements.slice(0,100).map((element) => {
      const title = element.querySelector(".storylink").innerText;
      const timestamp = element.nextElementSibling.querySelector(".age").innerText;
      return {title, timestamp};
    })
  });

  //Check if the articles are sorted from newest to oldest
  let sorted = true;
  for (let i = 0; i < articles.length - 1; i++){
    const currentTimestamp = new Date(articles[i].timestamp);
    const nextTimestamp = new Date(articles[i + 1].timestamp);
    if(currentTimestamp < nextTimestamp){
      sorted = false
      break;
    }
  }


  //Print a message according to the direction of the article sort
  if(sorted){
    console.log("The articles are sorted from newest to oldest", articles)
  }else{
    console.log("The articles are sorted from oldest to newest", articles)
  }

}

(async () => {
  await sortHackerNewsArticles();
})();
