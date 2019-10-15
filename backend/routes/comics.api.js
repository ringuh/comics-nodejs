const router = require('express').Router()
const chalk = require('chalk'); // colors
const jwt = require('jsonwebtoken')
router.use(require('express').json())

const { cyan, red } = chalk.bold;
const { User, Sequelize } = require('../models')

async function Authenticated(req, res, next) {
    if (!req.user) return res.status(520).json({ message: "Login required" })
    next()
}

router.get("/", Authenticated, (req, res) => {

    //console.log(req.method, req.url, req.body, req.params, req.query)
    Novel.findAll({
        attributes: ["id", "name", "image_url", "description", 'alias'],
        order: ['name']
    }).then(novels => {
        res.json(novels)
    }).catch(err => {
        console.log(red(err.message))
        res.status(500).json({ message: err.message })
    })
})



module.exports = router;