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

	
	fs.readdirSync(comicSites, { withFileTypes: true })
		.filter(file => file.name.endsWith('.js') && !file.name.startsWith('dom_'))
		.forEach(file => {
			const fn = `${sitesFolder}/${file.name.slice(0, file.name.length - 3)}`
			const site = require(fn)
			Comic.findOrCreate({ where: { name: site.name }, defaults: site })
		});

};

module.exports = createDB