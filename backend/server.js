const express = require('express');
//const cors = require('cors');
const path = require('path')
const app = express();

global.config = require('../client/src/config.json');
global.config.jwt = require('fs').readFileSync('jwtPrivate.pem')
global.config.jwt_pub = require('fs').readFileSync('jwtPublic.pem')


app.listen(global.config.server.port, () => {
    console.log(`Server is running on port: ${global.config.server.port}`);
});
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use("/api", require("./routes/comics.api"))
app.use("/auth", require("./routes/auth.api"))

module.exports = app;