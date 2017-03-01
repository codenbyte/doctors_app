// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: true }));
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

app.use(express.static(path.join(__dirname, "./client")));

// listen on 8000
app.listen(8000)