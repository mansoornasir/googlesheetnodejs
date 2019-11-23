const puppeteer = require('puppeteer');
var jsdom = require("jsdom");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

// const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('response', async response => {
    // console.log('got response', response._url)
    const data = await response.buffer()
    var response = JSON.parse(data);
    // 1m
    arr = response.results.A.series[0].points;
    var currentA = arr[arr.length - 1];
    console.log(currentA[0])

    //3m
    arr = response.results.B.series[0].points;
    var currentB = arr[arr.length - 1];
    console.log(currentB[0])

    //6m
    arr = response.results.C.series[0].points;
    var currentC = arr[arr.length - 1];
    console.log(currentC[0])

    var currentDate = new Date();
    finalDate = currentDate.toGMTString();

    send = {
        "date": finalDate,
        "m1": currentA[0],
        "m3": currentB[0],
        "m6": currentC[0]
    }

    url = "https://script.google.com/macros/s/AKfycbyKZ3N_KsvJYl6WeHlnt8cN5bhCK9ekl5zSjC-EjmX8pvayXrs/exec"
    
    var jqxhr = $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        data: send
    });

    // fs.writeFileSync('response.json', data)
  })
  await page.goto('https://skew.com/d-solo/hYed6CTmz/bitcoin-options?orgId=1&to=now&from=now-3M&panelId=76&theme=light&refresh=30s', {waitUntil: 'networkidle0'})
  await browser.close()
})()
