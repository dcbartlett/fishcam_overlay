const fs = require('fs');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const {Builder} = require('selenium-webdriver');
const express = require('express');
const sass = require('node-sass');
require('chromedriver');

const app = express();
const host = '0.0.0.0';
const port = 65535;

const screen = {
  width: 1280,
  height: 720
};

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen).addArguments('--hide-scrollbars'))
    .build();

// Navigate to google.com, enter a search.
driver.get(`http://127.0.0.1:${port}/overlay`);
setInterval(() => {
  driver.takeScreenshot().then(base64png => {
    fs.writeFileSync('screenshot.png', new Buffer(base64png, 'base64'));
  });
}, 500);
app.get('/overlay', (req, res) => res.sendFile(path.join(__dirname + '/overlay.html')));
app.get('/styles.css', (req, res) => {
  res.type('css');
  res.send(sass.renderSync({
    data: fs.readFileSync(path.join(__dirname + '/styles.scss')).toString()
  }).css);
});
app.get('/overlay.js', (req, res) => res.sendFile(path.join(__dirname + '/overlay.js')));
app.get('/screenshot.png', (req, res) => res.sendFile(path.join(__dirname + '/screenshot.png')));
app.listen(port, host, () => console.log(`Example app listening at http://${host}:${port}`));