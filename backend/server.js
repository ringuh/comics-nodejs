const express = require('express');
//const cors = require('cors');
const path = require('path')
const jwt = require('jsonwebtoken')
const app = express();

global.config = require('../client/src/config.json');
global.config.jwt = require('fs').readFileSync('jwtPrivate.pem')
global.config.jwt_pub = require('fs').readFileSync('jwtPublic.pem')

app.use(function (req, res, next) {
    let token = req.headers.authorization || null;
    
    console.log(req.method, req.url, token && token.startsWith('Bearer ') )
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
                const { User } = require('./models')
                User.findByPk(decoded.id).then(user => {
                    req.user = user
                    return next()
                }).catch(err => res.status(500).json({ message: "User not found" }))
            }
        })
    }
    else return next()
});




app.listen(global.config.server.port, () => {
    console.log(`Server is running on port: ${global.config.server.port}`);
});
app.use('/files', express.static(path.join(__dirname, 'static')))
app.use("/api", require("./routes/comics.api"))

module.exports = app;