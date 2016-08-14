var Movie = require('../models/movie');
var Category = require('../models/category');

var count =2;


exports.result = function(req,res){

	var _category = req.query.cat;
	var page = parseInt(req.query.p, 10) || 0;
	var index= page*count;
	console.log("index:"+index);
	var q = req.query.q;
	if(_category){
		Category
		.findOne({_id: _category}) 
		.populate({
			path: 'movies',
			select: 'title poster',
			options: { limit: count, skip: index }
		})
		.exec(function(err, category){
			if(err){
				console.log(err);
			}
			var movies=category.movies;
			//console.log("allMovies:"+allMovies.length);
			//var movies = allMovies.slice(index , index+ count);
			var keyword = category.name;

			Movie.count({category: _category}, function(error, rowCount) {
        		if (error) {
        			console.log(err);
        		} else {
         			var pageNumber = Math.ceil(rowCount / count);

					res.render('result',{
						title: 'imooc result',
						movies: movies,
						totalPage: pageNumber,
						currentPage: page+1,
						keyword: keyword,
						query: 'cat='+category._id
					});
        		}
      		});
				
		})
	}else{
		//from search input
		Movie.find({title: new RegExp(q+'.*', 'i')})
			.skip(index)
			.limit(count)
			.exec(function(err, movies){
				console.log("movies.length:"+movies.length);
			 	res.render('result',{
						title: 'imooc result',
						movies: movies,
						totalPage: movies.length,
						currentPage: page+1,
						keyword: q,
						query: 'q='+q
					});
			 })

	}


}