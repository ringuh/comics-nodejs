const chalk = require('chalk'); // colors
const path = require('path')
const fs = require('fs')
const { cyan, yellow, red, blue } = chalk.bold;
const sitesFolder = "../comic-sites"
const comicSites = path.join(__dirname, sitesFolder)

var createDB = async () => {
	console.log("init database")
	const { User, Comic } = require('../models')
	// random collection for adding funny stuff
	Comic.findOrCreate({ where: { name: "Random Collection" } });

	const userList = [{
		googleId: "113424763475073319026",
		name: "pienirinkula",
		role: "admin",
	}]

	userList.forEach((i) => {
		User.findOrCreate({ where: { googleId: i.googleId }, defaults: i })
	});


	let files = fs.readdirSync(comicSites, { withFileTypes: true })
		.filter(file => file.name.endsWith('.js')
			&& !file.name.startsWith('dom_')
			&& !file.name.startsWith('tbd_'))
		.map(file => {
			return {
				name: file.name,
				time: fs.statSync(path.join(comicSites, file.name)).birthtime.getTime()
			}
		}).sort((a, b) => { return a.time - b.time })

	for (let i = 0; i < files.length; ++i) {
		let file = files[i];
		const fn = `${sitesFolder}/${file.name.slice(0, file.name.length - 3)}`
		const site = require(fn)
		
		await Comic.findOrCreate({ where: { name: site.name }, defaults: site })
			.then(([comic, created]) => created ? console.log(cyan(comic.id, "+++", comic.name)) : null)
			.catch(err => console.log(fn, err.message));
	}

};

module.exports = createDB