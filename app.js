// bcrypt
var bcrypt = require("bcrypt");

// body-parser
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

// express
var express = require("express");
var reactViews = require('express-react-views');
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());

//mysql
var mysql = require("mysql");
// connect strings for mysql
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "apple",
	database: "test"
});

// connecting ......
connection.connect();

// requesting express to get data as text
app.use(bodyParser.text());

// using express for post method
app.post("/register", urlEncodedParser, function(request, response) {
	if(request.url!="/favicon.ico") {
		if(request.body.regOrLogin=="Register") {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(request.body.pwd, salt, function(err, hash) {
					var body = request.body;
					var date = new Date();
					var currentDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
					var postVars = {username: body.username, password: hash, dob: body.dob, reg_date: currentDate};
					// insertion into MySQL
					connection.query("SELECT * FROM user WHERE username='"+body.username+"'", function(err, res, fields){
						if(err) {
							response.render( "Error.jsx", {error: 'Error while querying', name: 'Register'});
						} else {
							if(res.length) {
									response.render( "Error.jsx", {error: 'User already exist!!', name: 'Register'});
							}
							else {
								connection.query("INSERT INTO user set ?", postVars, function(err, result) {
									if(err) {
										console.log("error", err);
										response.render( "Error.jsx", {error: 'User registration problem', name: 'Register'});
									} else {
										response.render( "Login.jsx");
									}
								});
							}
						}
					});
				});
			});
		}
	}
});

app.post("/login", urlEncodedParser, function(request, response) {
	if(request.url != "/favicon.ico") {
		if (request.body.regOrLogin=="Login") {
			var  body = request.body;
			connection.query("SELECT * FROM user WHERE username='"+body.username+"'", function(err, res, fields){
				if(err) {
					response.render( "Error.jsx", {error: 'Username and Password is not correct'});
				} else {
					if(res.length) {
						bcrypt.compare(body.pwd, res[0].password, function(err, res) {
							if(res) {
								response.render( "Welcome.jsx", {name: body.username});
							} else {
								response.render( "Error.jsx", {error: 'Password is not correct'});
							}
						});
					} else {
						response.render( "Error.jsx", {error: 'Username is not correct'});
					}
				}
			});
		}
	}
})

app.get('/', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('Login.jsx');
});

app.get('/register', function(req, res) {
	res.render('Register.jsx');
});

app.listen(3000);
