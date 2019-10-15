const puppeteer = require('puppeteer');
const cheerioAdv = require('cheerio-advanced-selectors'); // adds :last, :eq(index), :first
const cheerio = cheerioAdv.wrap(require('cheerio'));
/* const readability = require('node-readability-cheerio')
const imghash = require('imghash')
const hamming = require('hamming-distance') */
const urlTool = require('url')
const fs = require('fs')
const https = require('https');
const chalk = require('chalk');
global.config = require('../client/src/config.json')
const { Comic, Strip, Image, Sequelize } = require("./models")
const { cyan, magenta, yellow, red, blue } = chalk.bold;

const writeFile = (filename, content) => {
    fs.writeFile(`static/log/${filename}.html`, content, function (err) {
        if (err) throw err;
        console.log(`${filename} html saved`);
    });
}

const downloadImage = (url, filename, comic) => {
    const path = `static/comics/${comic.name}/${filename}`
    var file = fs.createWriteStream(path);
    https.get(url, function (response) {
        response.pipe(file);
    });

    return path
}

const handleStrip = (browser, comic, url) => {
    // skip the "random collection"
    if (comic.id === 1) return true
    if (comic.id > 2) return true
    return new Promise(async (resolve, reject) => {
        try {
            console.log(comic.name, url)
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.goto(url);

            // with dom_navigation press OK to prompt boxes and such
            // for example in tumblr
            if (comic.dom_navigation) {
                let promises = comic.dom_navigation.split("|").map(str => {
                    let cmd = str.trim()
                    if (cmd === "wait") return page.waitForNavigation({ waitUntil: 'networkidle0' })
                    return page.click(cmd)
                });
                try {
                    await Promise.all(promises);
                } catch (err) {
                    console.log(magenta(err.message))
                    await page.screenshot({ path: `static/log/${comic.alias}_error.png` });
                }
            }

            await page.screenshot({ path: `static/log/${comic.alias}.png` });


            const bodyHTML = await page.evaluate(() => document.body.innerHTML);
            $ = cheerio.load(bodyHTML)
            writeFile(comic.alias, $("html").html())

            const folder = `static/comics/${comic.alias}`
            // create the comic folder if necessary
            if (!fs.existsSync(folder)) fs.mkdirSync(folder)


            // download images
            let images = $(comic.comic_path).each(async (index, element) => {
                let image_url = $(element).attr(comic.image_src)
                if (!image_url) return resolve()
                image_url = image_url.trim().split(" ")[0]
                image_url = urlTool.resolve(comic.last_url, image_url)
                console.log("images", image_url)
                let image = downloadImage(image_url, "randomfilename.webp", comic)
                console.log(image)
                


            })


            let next = $(comic.next_path).attr('href')
            if (next) next = urlTool.resolve(url, next)

            console.log(comic.name, next)
            await page.close()
            const pattern = new RegExp(comic.regex, "i")
            if (next && (!comic.regex || next.match(pattern)))
                await handleStrip(browser, comic, next)
            return resolve()
        } catch (err) {
            console.log(red(err))
            return resolve(err)
        }
    })
}



const comicParser = async (logAll) => {
    const browser = await puppeteer.launch();

    let comics = await Comic.findAll({})
    let comicPromises = await Promise.all(comics.map(
        async comic => handleStrip(browser, comic, comic.last_url)
    ));
    console.log(cyan("CLOSING"))
    await browser.close()
};

module.exports = comicParser

if (process.argv.length > 1 && process.argv[1].includes("comicParser.js"))
    comicParser(true);