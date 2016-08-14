var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var port = 3000;
var app = express();
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var busboy = require('connect-busboy'); 

var dbUrl='mongodb://localhost/imooc';


mongoose.connect(dbUrl,function(err,db){
	//assert.equal(null, err);
  	console.log("Connected correctly to server.");
  	//db.close();
})

app.use(busboy());
app.set('views', './app/views/pages');
app.set('view engine', 'jade'); 
app.use(bodyParser.urlencoded());  
app.use(serveStatic('public')); // js files path
app.listen(port);

app.use(session({
	secret: "imooc",
	cookie: { maxAge: 1000*60*10 } ,
	store: new MongoStore({
		url: dbUrl,
		collection: "sessions"
	})
}));

/*
app.use(busboy({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        immediate: true
    }
}));
*/
app.use(busboy({ immediate: true }));

// app.use(function(req, res, next){
// 	var _user= req.session.user;
	
// 	//console.log(_user);
// 	app.locals.user= _user;
	
// 	next();
// })

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(morgan('combined'));

  app.locals.pretty = true;
 // mongoose.set('debug', true)
}

require('./config/routes')(app);

console.log('imooc started on port: '+ port);
