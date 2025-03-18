// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1


//Import chromium model to automate web scraping 
const { TIMEOUT } = require("dns");
const { chromium } = require("playwright");


async function clickMoreButtonOnce(page){
  const moreButton = await page.getByRole("link" ,{name: "More", exact: true})
  await moreButton.click({timeout: 9000})
}

async function getCurrentPageDates(page){
  const table = await page.locator("#hnmain").locator("tbody").locator("tr").nth(3).locator(".age").all()
  let resultArray = []

  for(let element of table){
    element = await element.getAttribute("title")
    let date = new Date(element.toString().split(" ")[0])
    resultArray.push(date)
  }

  return resultArray
}

function removeExtraArticles(articles){
  if(articles.length === 100){
    return articles
  }

  for(let i = articles.length - 1; i >= 100; i--){
    let el = articles.pop()
  }

  return articles
}

function newestToOldestCheck(array){
  for(let i = 0; i < array.length - 1; i++){
    const date1 = array[i]
    const date2 = array[i + 1]

    if(!(date1 >= date2)){
      return false
    }
  }

  return true
}

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  let elementArray = []

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");


  //for 3 times untill you get to 100 please parse the data and push it into the result array
  for(let i = 0; i <= 3; i++){
    const currentPageDates = await getCurrentPageDates(page)
    elementArray = [...elementArray, ...currentPageDates]
    await clickMoreButtonOnce(page)
  }

  //make sure we shave off extra articles incase they can go over 100
  removeExtraArticles(elementArray)

  //Now we check if articles are sorted correctly from newest to oldest
  const isNewestToOldest = newestToOldestCheck(elementArray)

  
  if(isNewestToOldest){
    console.log(`${isNewestToOldest}: The articles are sorted from Newest to Oldest`)  
  }else{
    console.log(`${isNewestToOldest}: The articles are sorted from Oldest to Newest`)
  }

  //you could use page.pause instead
  setInterval(()=>{

  },10000)

}

(async () => {
  await sortHackerNewsArticles();
})();
