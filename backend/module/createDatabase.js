var chalk = require('chalk'); // colors
var { cyan, yellow, red, blue } = chalk.bold;


var createDB = async () => {
	console.log("init database")
	const { User, Comic } = require('../models')

	const comicsList = [
		{
			name: "Collection",
		}, {
			name: "Fingerpori",
			author: "Pentti Jarla",
			url: "https://www.hs.fi/fingerpori/",
			image_src: "örc | srcset | src",
			last_url: "https://www.hs.fi/fingerpori/car-2000005585200.html",
			comic_path: "figure.cartoon.image > img",
			next_path: "div.block.cartoon > article > div.article-navigation.cartoon.top > div > a.article-navlink.next",
		}, {
			name: "Justice League 8",
			url: "http://jl8comic.tumblr.com",
			//last_url: "http://jl8comic.tumblr.com/post/13372482444/jl8-1-by-yale-stewart-based-on-characters-in-dc",
			last_url: "https://jl8comic.tumblr.com/post/25621371238/jl8-50-by-yale-stewart-based-on-characters-in-dc",
			comic_path: "article > figure.photo-hires-item img",
			next_path: "#pagination-comic > nav > a.next-button",
			dom_navigation: "button.yes | wait"
		}

	]




	const userList = [{
		googleId: "113424763475073319026",
		name: "pienirinkula",
		role: "admin",
	}]

	userList.forEach((i) => {
		User.create(i)
	});

	comicsList.forEach((i) => {
		Comic.create(i)
	});






};

module.exports = createDB