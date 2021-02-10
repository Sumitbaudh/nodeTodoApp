var express = require('express')
var routes = require('./api/routes/routes');
var bodyParser = require('body-parser');

var app = express();

const port = process.env.PORT || 3030;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);