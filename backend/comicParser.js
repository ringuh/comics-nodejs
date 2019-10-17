const puppeteer = require('puppeteer');
const cheerioAdv = require('cheerio-advanced-selectors'); // adds :last, :eq(index), :first
const cheerio = cheerioAdv.wrap(require('cheerio'));
const imghash = require('imghash')
const hamming = require('hamming')
const sharp = require('sharp')
const webp = require('webp-converter')
const pathTool = require('path')
const urlTool = require('url')
const fs = require('fs')
const https = require('https');
const concat = require('concat-stream')
const chalk = require('chalk');
global.config = require('../client/src/config.json')
const { Comic, Strip, Sequelize } = require("./models")
const { cyan, magenta, yellow, red, blue, green } = chalk.bold;

const Pause = (seconds = 1, print = false) => {
    if (print) console.log("pausing", seconds)
    return new Promise(resolve => setTimeout(() => resolve("paused for " + seconds), seconds * 1000));
}

const cacheOrDownload = (url, force = false) => {
    const folder = `static/cache/`
    const hash = Buffer.from(url).toString('base64');
    const path = `${folder}/${hash}`;
    if (!fs.existsSync(folder)) fs.mkdirSync(folder)

    return new Promise(resolve => {
        fs.readFile(path, function (err, data) {
            if (err) {
                if (url.startsWith("http://")) url = url.replace("http://", "https://")

                https.get(url, response => response.pipe(concat({ encoding: 'buffer' }, (buf) => {
                    fs.writeFile(path, buf, async function (err) {
                        if (err) console.log(err);
                        await Pause(1)
                        resolve(buf)
                    })
                })));
            } else {
                resolve(data)
            }
        })
    })
}


const writeFile = async (filename, content, buffer) => {
    return new Promise((resolve, reject) => {
        if (buffer)
            return fs.open(filename, 'w', function (err, fd) {
                if (err) { throw 'could not open file: ' + err }
                fs.write(fd, content, 0, content.length, null, function (err) {
                    fs.close(fd, err => err ? reject(console.log('closing file failed: ' + err)) : resolve("ok"));
                });
            });
        else
            return fs.writeFile(`static/log/${filename}.html`, content, function (err) {
                if (err) reject(err);
                resolve("ok")
                //console.log(`${filename} html saved`);
            });
    })
}

const getTitle = ($, title_path) => {
    if (!title_path) return null

    let cmds = title_path.split("?").map(p => p.trim())
    let dom_path = cmds[0]
    let [func, attr] = cmds[1] ? cmds[1].split(":") : [null, null]
    if (func === "attr") return $(dom_path).attr(attr).trim()
    else if (func === "text") return $(dom_path).text().trim()

}

const downloadImage = async (url, comic, page_url, title) => {
    /* const test_images = require("./static/log/test_images.json");
    url = test_images.gif */

    let buffer = null;
    let ext = pathTool.extname(url).slice(1)
    // some imageurls might be missing extension, so ask for presumed one from database
    if (!ext || ext.trim() === "") ext = comic.extension
    if (url.startsWith("data:")) {
        let regex = /^\s*data:(?<media_type>(?<mime_type>[a-z\-]+\/[a-z\-\+]+)(?<params>(;[a-z\-]+\=[a-z\-]+)*))?;(?<encoding>base64)?,(?<data>[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*)$/i;
        let info = regex.exec(url).groups
        // { media_type, mime_type, params, encoding, data }
        ext = info.media_type.split("/")[1]
        if (ext === "svg+xml") ext = "svg"
        buffer = Buffer.from(info.data, 'base64')
    } else { console.log(yellow("checking image:"), url) }

    if (!["gif", "svg", "jpg", "jpeg", "webp", "tiff", "tif"].includes(ext)) return false

    // find if this source has already been downloaded, ignore the possibility of image having been changed
    const sourceFound = await Strip.findOne({
        where: { comic_id: comic.id, raw_src: url },
        attributes: ['id']
    });

    if (sourceFound) {
        console.log(red("This image source already exists", url))
        return null
    }

    buffer = buffer || await cacheOrDownload(url);

    const image_for_hash = await sharp(buffer).png().toBuffer();
    const hash_for_image = await imghash.hash(image_for_hash, 8, "hex");

    const allStrips = await Strip.findAll({
        where: { comic_id: comic.id },
        attributes: ['hash', 'order', 'raw_src'],
        order: [["order", "DESC"]],
    })
    const next_order = allStrips.length > 0 ? allStrips[0].order + 1 : 1;
    const [sm, xs] = [600, 480]
    const path = `static/comics/${comic.alias}/${comic.alias}_${next_order}.webp`
    const path_xs = `static/comics/${comic.alias}/xs_${comic.alias}_${next_order}.webp`
    // check existing strips for similar / same images
    for (let i in allStrips) {
        const compareStrip = allStrips[i];
        const dist = hamming(compareStrip.hash, hash_for_image)

        if (dist < 8) console.log(yellow("distance", dist))
        if (dist < 2) return null
    }
    let image = null

    // use webp-converter to reduce .gif size. sharp can only make un-animated gifs
    if (ext === "gif") {
        let tmp_path = `${path.split("/").slice(0, -1).join("/")}/tmpfile.gif`;
        await writeFile(tmp_path, buffer, true);

        image = await new Promise(resolve => // status 100 = ok, 101 = fail
            webp.gwebp(tmp_path, path, "-q 80", function (status, error) {
                if (error) console.log(red(error))
                resolve(status == 100);
                // remove the previous tmp from hdd
                fs.unlinkSync(tmp_path)
            }));

    } // for webp, converting will destroy animation so just directly save buffer to file 
    else if (ext === "webp") {
        image = await writeFile(path, buffer, true);
    } // convert rest of the images as webp
    else {
        image = await sharp(buffer).webp({ lossless: false }).toFile(path);
    }
    if (!image) return null
    console.log(green("Saving with hash", hash_for_image))

    await sharp(buffer).resize(xs).webp({ lossless: false }).toFile(path_xs);

    const strip = await Strip.create({
        comic_id: comic.id,
        order: next_order,
        title: title,
        raw_src: url.startsWith("data:") ? null : url,
        page_url: page_url,
        hash: hash_for_image,
    });

    return strip
}

const handleStrip = (browser, comic, url, count = 10) => {
    count--;
    if (count === 0) return true
    const minId = parseInt(process.argv[2]) || 2;
    const maxId = parseInt(process.argv[3]) || parseInt(process.argv[2]) || 10000;
    if (comic.id < minId || comic.id > maxId) return true



    return new Promise(async resolve => {
        console.log(blue(comic.name, url))
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.goto(url);

            // with dom_navigation press OK to prompt boxes and such
            // for example in tumblr
            if (comic.dom_navigation) {
                await page.screenshot({ path: `static/log/${comic.alias}_pre.png` });
                let promises = comic.dom_navigation.split("|").map(str => {
                    let cmd = str.trim()
                    if (cmd === "wait") return page.waitForNavigation({ waitUntil: 'networkidle0' })
                    if (cmd === "pause") return Pause(5)
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

            const title = getTitle($, comic.title_path)

            // cheerio map/each seem to be async that ignore await, do some tricks
            let stripsOnPage = $(comic.comic_path).get();
            for (var i in stripsOnPage) {
                let element = stripsOnPage[i]
                let image_url = null;
                comic.image_src.split("|").some(src => {
                    image_url = $(element).attr(src.trim())
                    return image_url
                })

                if (!image_url) continue;
                image_url = image_url.trim().split(" ")[0]
                image_url = urlTool.resolve(comic.last_url, image_url)

                const strip = await downloadImage(image_url, comic, url, title)
                if (strip) {
                    await comic.update({ last_url: url })
                }


            }






            let next = $(comic.next_path).attr('href')
            if (next) next = urlTool.resolve(url, next)

            console.log("NEXT:", comic.name, next)
            await page.close()
            const pattern = new RegExp(comic.regex, "i")
            if (next && (!comic.regex || next.match(pattern))) {
                Pause(1)
                await handleStrip(browser, comic, next, count)
            }

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
        async comic => await handleStrip(browser, comic, comic.last_url, process.argv[2] ? 999 : 5)
    ));
    console.log(cyan("CLOSING"))
    await browser.close()
};

module.exports = comicParser

if (process.argv.length > 1 && process.argv[1].includes("comicParser.js"))
    comicParser(true);