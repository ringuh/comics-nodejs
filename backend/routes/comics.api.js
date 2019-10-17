const router = require('express').Router()
const chalk = require('chalk'); // colors
const jwt = require('jsonwebtoken')
router.use(require('express').json())

const { cyan, red } = chalk.bold;
const { User, Comic, Strip, Sequelize } = require('../models')

async function Authenticated(req, res, next) {
    if (!req.user) return res.status(520).json({ message: "Login required" })
    next()
}

router.use(function (req, res, next) {
    let token = req.headers.authorization || null;

    console.log(req.method, req.url, token && token.startsWith('Bearer '))
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)

        jwt.verify(token, global.config.jwt_pub, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: 'Authorization is not valid'
                });
            } else {
                User.findByPk(decoded.id).then(user => {
                    req.user = user
                    return next()
                }).catch(err => res.status(500).json({ message: "User not found" }))
            }
        })
    }
    else return next()
});


router.get("/comic", Authenticated, (req, res) => {
    console.log("COMIC", req.body, req.params, req.query)

    let whereQuery = {}

    Comic.findAll({
        where: whereQuery,
        include: [ { model: Strip, as: 'strips', required: true }],
        order: [["id", "ASC"], ["strips", 'order', 'asc']]
    }).then(comics =>
        res.json(comics.map(comic => comic.toJson()))
    ).catch(err => {
        console.log(red(err.message))
        res.status(500).json({ message: err.message })
    })
})


router.get("/comic/:alias", Authenticated, (req, res) => {
    console.log("11", req.body, req.params, req.query)

    Comic.findOne({
        where: { alias: req.params.alias },
        include: [ { model: Strip, as: 'strips', required: true }],
        order: [["id", "ASC"], ["strips", 'order', 'asc']],
    }).then(comic =>
        res.json(comic.toJson())
    ).catch(err => {
        console.log(red(err.message))
        res.status(500).json({ message: err.message })
    })
})

router.get(["/", "/:date"], Authenticated, (req, res) => {
    console.log("/:date", req.body, req.params, req.query)

    Strip.findAll({
        where: { date: req.params.date },
        order: ['comic_id', 'order'],
        include: [{ model: Comic, as: 'comic', required: true }],
        //limit: 200
    }).then(strips => {
        res.json(strips.map(strip => strip.toJson()))
    }).catch(err => {
        console.log(red(err.message))
        res.status(500).json({ message: err.message })
    })
})





module.exports = router;