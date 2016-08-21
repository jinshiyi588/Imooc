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
//var morgan = require('morgan');
//var busboy = require('connect-busboy'); 
//var fs = require('fs-extra');





var dbUrl='mongodb://localhost/imooc';


mongoose.connect(dbUrl,function(err,db){
	//assert.equal(null, err);
  	console.log("Connected correctly to server.");
  	//db.close();
})

//busboy
//app.use(busboy());
/*
app.use(busboy({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        immediate: true
    }
}));
*/
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', './app/views/pages');
app.set('view engine', 'jade'); 
//app.use(bodyParser.urlencoded());  
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//app.use(serveStatic('public')); // js files path
app.listen(port);

app.use(session({
	secret: "imooc",
	cookie: { maxAge: 1000*60*10 } ,
	store: new MongoStore({
		url: dbUrl,
		collection: "sessions"
	})
}));



if ('development' === app.get('env')) {
  app.set('showStackError', true);
  //app.use(morgan('combined'));

  app.locals.pretty = true;
 // mongoose.set('debug', true)
}


app.get('/admin/movie/showUpload', function(req,res){

	res.render('upload',{
		title: 'imooc upload'
	});
})

require('./config/routes')(app);

console.log('imooc started on port: '+ port);

/*
app.post('/upload' , function(req,res,next){
	if (req.busboy) {
		//console.log("---enter busboy---");
		var fstream;
		req.pipe(req.busboy);
		console.log("---before enter busboy---");
		//console.log("busboy:"+req.busboy);
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            console.log ("filename: " + filename);
 
         //Changing filename to the text entered

            console.log ("fieldname: " + fieldname);
            console.log ("encoding: " + encoding);
            console.log ("mimetype: " + mimetype);

            //Path where file will be uploaded with original filename
            fstream = fs.createWriteStream(__dirname + '/public/upload/' + filename);
            file.pipe(fstream);

            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('/');           //where to go next
            });
        });
	}
	//next();
})
*/
