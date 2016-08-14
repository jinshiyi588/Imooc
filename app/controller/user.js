
var User = require('../models/user')

exports.list = function(req,res){

		User.fetch(function(err, users) {
			if(err){
				console.log(err);
			}

			res.render('userList',{
				title: 'imooc userList',
				users: users
			})
		})


}

exports.showSignup = function(req,res){
	res.render('signup',{
		title: 'imooc signup'
		
	})
		
}

exports.showLogin = function(req,res){
	res.render('login',{
		title: 'imooc login'
		
	})
		
}

exports.signup = function(req, res){
		var _user = req.body.user;

		User.findOne({name: _user.name},function(err, user){
			if (err) {
				console.log(err);
			}
			if (user) {
				console.log("user already exists.");
				return res.redirect("/");
			}else{
				var user = new User(_user);
				user.save(function(err, user){
					if (err) {
						console.log(err);
					}
					res.redirect('/admin/userList');
				})
			}

		})

	}

exports.login = function(req, res){
		var userObj = req.body.user;
		var name = userObj.name;
		var password = userObj.password;

		User.findOne({name: name},function(err, user){
			if (err) {
				console.log(err);
			}

			if(!user){
				console.log("user does not exist.");
				return res.redirect("/");
			}else{
			//console.log(user.password);
			user.comparePassword(password, function(err, isMatch){
				if (err) {
					console.log(err);
				}
				if (isMatch) {
					//session
					req.session.user = user ;
					return res.redirect('/');
				}else{
					console.log("password is not match");
					res.redirect('/');
				}

			})

		}

	})

}

exports.logout =function(req, res){

		delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
}

exports.delete = function(req,res){
		var id= req.query.id;

		if(id){
			User.remove({_id: id}, function(err, movie){
				if (err) {
					console.log(err);
				}else{
					res.json({success: 1});
				}

			})
		}

}

//middleware
exports.isSignin = function(req,res,next){
	var _user = req.session.user;
	if(!_user){
		return res.redirect('/login');
	}
	next();

}

exports.isAdministrator = function(req,res,next){
	var _user = req.session.user;

	if(_user.role<10){
		return res.redirect('/');
	}

	next();

}

