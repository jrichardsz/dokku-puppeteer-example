const express = require("express");
const app = express();

app.get("/", function(req, res) {
  const puppeteer = require("puppeteer");
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    var links = "";
    const page = await browser.newPage();
    await page.goto('https://balkangreenenergynews.com/country/romania/')
      .catch(error => console.error(error));

    await page.waitForSelector("div.four-boxes.multi-boxes", {
      visible: true
    });
    //console.info("Country News Page loaded");

    page.on("console", msg =>
      msg.type() === "error" ?
      console.error(msg.text()) :
      console.info(msg.text())
    );
    let data = await page.evaluate(() => {
      const articles = document.querySelectorAll("div.bn-box");
      const textContent = elem => (elem ? elem.textContent.trim() : ""); // helper function
      const articleArray = [];
      //let element = await page.$('your selector')
      //await element.evaluate(el => el.textContent)
      var article = articles[0];

      console.log(articles[0].innerHTML);

      //console.log(article.querySelector("div.bn-box-img > a img").getAttribute("src"))
      articleArray.push({
        title: textContent(article.querySelector("div.bn-box > a > h3")) || "",
        link: article.querySelector("div.bn-box > a") ?
          article.querySelector("div.bn-box > a").getAttribute("href") : "",
        image_link: article.querySelector("div.bn-box-img > a > img") ?
          article.querySelector("div.bn-box-img > a > img").getAttribute("data-spai") : "",
        lead_text: textContent(article.querySelector("div.bn-box > p")).split(' ').slice(4).join(' ') ||
          "",
        time: textContent(article.querySelector("p > strong")) ||
          "",
        author: ""
        //textContent(article.querySelector(".entry-author a")) || ""
      });
      return articleArray;
    });

    await browser.close();
    res.json(data);
  })();
});

app.listen(5000, function() {});
