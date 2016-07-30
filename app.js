var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var port = 3000;
var app = express();
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/imooc',function(err,db){
	//assert.equal(null, err);
  	console.log("Connected correctly to server.");
  	//db.close();
})

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded());
app.use(serveStatic('bower_components'));
app.listen(port);

console.log('imooc started on port: '+ port);


//route config
app.get('/',function(req,res){
	Movie.fetch(function(err, movies) {
		if(err){
			console.log(err);
		}

		res.render('index',{
			title: 'imooc homepage',
			movies: movies
		})
	})
})

app.get('/admin/list',function(req,res){

	Movie.fetch(function(err, movies) {
		if(err){
			console.log(err);
		}

		res.render('list',{
		title: 'imooc list',
		movies: movies
		})
	})

	
})

app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){

		res.render('detail',{
			title: 'imooc detail',
			movie: movie
		})
	})
})

app.post('/admin/movie/new',function(req, res){
	var id= req.body.movie._id;
	var movieObj =req.body.movie;
	var _movie

	if(id !== 'undefined'){

		Movie.findById(id,function(err, movie){
			if(err){
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err,movie){
				if (err) {
					console.log(err);
				};
				res.redirect('/movie/' + movie._id);

			})


		})
	}else{

		_movie =new Movie({
			director: movieObj.director,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year

		})

		_movie.save(function(err,movie){
				if (err) {
					console.log(err);
				};
				res.redirect('/movie/' + movie._id);

			})
	}

});

app.get('/admin/update/:id', function(req, res){
	var id = req.params.id;
	if(id){

		Movie.findById(id, function(err, movie){
			res.render('admin',{
				title: 'imooc admin',
				movie: movie

			})
		})
	}

})

app.get('/admin/movie',function(req,res){

	res.render('admin',{
		title: 'imooc admin',
		movie: {
			title: '',
			director: '',
			flash: '',
			poster: '',
			language: '',
			director: '',
			country: '',
			summary: ''
		}
	})
})
