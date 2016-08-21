var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
//var fs= require('fs');
var fs = require('fs');
var path= require('path');
//var uuid = require('node-uuid')

var _ = require('underscore');
//var inspect = require('util').inspect;

exports.list =function(req,res){

	Movie.find()
	.populate('category', 'name')
	.exec(function(err, movies) {
		if(err){
			console.log(err);
		}

		res.render('list',{
			title: 'imooc list',
			movies: movies
		})
	})


}

exports.delete = function(req,res){
	var id= req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if (err) {
				console.log(err);
			}else{
				res.json({success: 1});
			}

		})
	}

}

exports.detail = function(req,res){
	var id = req.params.id;
	Movie.update({_id:id}, {$inc: {pv: +1 }}, function(err){
		console.log(err);
	})

	Movie.findById(id, function(err, movie){

		Category.findById(movie.category, function(err, category){

			Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.to reply.from', 'name')
			.exec(function(err, comments){
				res.render('detail',{
					title: 'imooc detail',
					movie: movie,
					comments: comments,
					category: category
				});

			});
		});
	});
}

exports.save = function(req, res ,next){
	//console.log("req.body:"+req.body);
	console.log(req.body);
	console.log(req.file);
	var id= req.body.movie._id;
	var movieObj =req.body.movie;
	var _movie;

	if(req.file){
		movieObj.poster="/upload/"+req.file.filename;
	}	
	console.log("movieObj.poster:"+movieObj.poster);

	if(id){// update 

		Movie.findById(id,function(err, movie){
			if(err){
				console.log(err);
			}
			//console.log("movie>>>"+movie)
			var oldCategoryId=movie.category;
			_movie = _.extend(movie, movieObj);// to be changed because of category
			var categoryName= req.body.movie.categoryName;
			
			if(categoryName){
				//new category
				var _category= new Category({
					name: categoryName,
					movies: [id]
				});

				Category.findById(movie.category, function(err, oldCategory){
					oldCategory.movies.pull(movie._id);
					oldCategory.save();
				});

				_category.save(function(err, category){
					_movie.category= category._id;
					_movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id);

					})
				})

			}else{
				//maybe change a category
				var categoryId= movieObj.category;
				//var oldCategoryId=movie.category;
				//console.log("categoryId:"+categoryId);
				//console.log("oldCategoryId:"+oldCategoryId);
				if( oldCategoryId.toString() != categoryId.toString()){
					Category.findById(oldCategoryId, function(err, category){
						category.movies.pull(id);
						category.save();
					})
					Category.findById(categoryId, function(err, category){
						category.movies.push(id);
						category.save();
					})
				}
				_movie.save(function(err,movie){
					if (err) {
						console.log(err);
					};
					res.redirect('/movie/' + movie._id);

				})

			}

		})
	}else{//new
		var categoryName= req.body.movie.categoryName;
		var categoryId=req.body.movie.category;

		_movie =new Movie(
			movieObj

			);

		_movie.save(function(err,movie){
			if (err) {
				console.log(err);
			}

			if(categoryName){
				var _category= new Category({
					name: categoryName,
					movies: [movie._id]
				});
				_category.save(function(err, category){
					movie.category= category._id;
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id);

					})
				})

			}else{
				//console.log("categoryId"+categoryId);
				Category.findById(categoryId, function(err, category){
					//console.log("category"+category);
					category.movies.push(movie._id);
					category.save(function(err, category){
						res.redirect('/movie/' + movie._id);		
						
					})
				})

			}

		})
	}

}

exports.showUpdate = function(req, res){
	var id = req.params.id;
	if(id){

		Movie.findById(id, function(err, movie){

			Category.fetch(function(err, categories){
				res.render('admin',{
					title: 'imooc admin',
					movie: movie,
					categories: categories
				});
			});
			
		})
	}

}

exports.showAdd = function(req,res){

	Category.fetch(function(err,categories){
		if (err) {
			console.log(err);
		}

		res.render('admin',{
			title: 'imooc admin',
			movie: {},
			categories: categories
		});
	})

}

exports.showUpload = function(req,res){

	
	res.render('upload',{
		title: 'imooc upload'
	});
	

}


/*exports.upload= function(req, resp) {
  console.log(req.body, req.files);
  // don't forget to delete all req.files when done
  res.redirect("/");
}*/

exports.upload = function(req,res,next){
	if (req.busboy) {
		//console.log("---enter busboy---");
		var fstream;
		req.pipe(req.busboy);
		console.log("---before enter busboy---");
		//console.log("busboy:"+req.busboy);
		var poster;
		req.movie={};
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            console.log ("filename: " + filename);
            console.log ("fieldname: " + fieldname);
            console.log ("encoding: " + encoding);
            console.log ("mimetype: " + mimetype);

            //Path where file will be uploaded with original filename
            var timestamp = Date.now();
      		var type = filename.split('.')[1];
      		poster = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
            console.log("newPath:"+newPath);

            fstream = fs.createWriteStream(newPath);
            file.pipe(fstream);

            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                //res.redirect('/');           //where to go next
            	
            });
        });
        
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      		console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      		if(val){
      			//var attr="title";
	      		var attr=fieldname.substring(fieldname.indexOf("[")+1,fieldname.indexOf("]"));
	      		console.log("attr:"+attr);
	      		req.movie[attr]=inspect(val);
	      	}
    	});
    
    	req.busboy.on('finish', function() {
      		//console.log('Done parsing form!');
      		//res.writeHead(303, { Connection: 'close', Location: '/' });
      		//res.end();
      		//console.log("poster:"+poster);
      		if(poster){
      			req.movie.poster=poster;
      		}
      		console.log("movie:"+req.movie[title]);
      		next();
    	});
	}
	
}