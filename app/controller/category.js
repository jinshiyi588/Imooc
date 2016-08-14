var Movie = require('../models/movie');
var Category = require('../models/category');

var _ = require('underscore');


exports.save = function(req, res){
		var id= req.body.category._id;
		var categoryObject =req.body.category;
		var _category;
		//console.log("id>>>"+id);

		if(id){

			Category.findById(id,function(err, category){
				if(err){
					console.log(err);
				}
				//console.log("movie>>>"+movie)
				_category = _.extend(category, categoryObject);

				_category.save(function(err,category){
					if (err) {
						console.log(err);
					};
					res.redirect('/');

				})


			})
		}else{

			_category =new Category({
				name:categoryObject.name

			})

			_category.save(function(err,category){
				if (err) {
					console.log(err);
				};
				res.redirect('/');

			})
		}

}


exports.showAdd = function(req,res){

		res.render('categoryAdmin',{
			title: 'imooc category admin',
			category: {}
		})
	
}
