
var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req,res){

	Category
		.find({}) 
		.populate({
			path: 'movies',
			select: 'title poster',
			options: {limit: 8}
		})
		.exec(function(err, categories){

			if(err){
				console.log(err);
			}
			//console.log("categories.length:"+categories[1].movies.length);
			res.render('index',{
				title: 'imooc homepage',
				categories: categories
			})
				
		})


}