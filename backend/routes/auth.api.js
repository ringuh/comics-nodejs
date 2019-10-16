const router = require('express').Router();
const jwt = require('jsonwebtoken');
router.use(require('express').json());
const { User } = require('../models')

router.route("/").post(function (req, res) {
    //console.log(req.method, req.url, req.body, req.params, req.query)
    User.findOrCreate({
        where: {
            googleId: req.body.googleId
        }, defaults: {
            name: `${req.body.profileObj.givenName}-${Math.random().toString(36).substring(2, 15)}`,
            icon: req.body.profileObj.imageUrl
        }
    }).then(([user, created]) => {
        let token = jwt.sign({ id: user.id, icon: user.icon, name: user.name },
            global.config.jwt, { algorithm: 'RS256', expiresIn: "30d" })
        res.json({ message: "Logged in", jwt: token })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: err.message })
    })
});

module.exports = router;