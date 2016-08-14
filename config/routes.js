var Index = require('../app/controller/index');
var Movie = require('../app/controller/movie');
var User = require('../app/controller/user');
var Comment = require('../app/controller/comment');
var Category = require('../app/controller/category');
var Search = require('../app/controller/search');


//route config

module.exports = function(app){

	app.use(function(req, res, next) {
	    var _user = req.session.user;

	    app.locals.user = _user;

	    next();
  	});

	//index
	app.get('/', Index.index);

	//movie
	app.get('/admin/movie/list', Movie.list);

	app.get('/admin/update/:id', Movie.showUpdate);

	app.get('/admin/movie/showAdd',  Movie.showAdd);

	app.delete('/admin/list', User.isSignin, User.isAdministrator, Movie.delete);

	app.get('/movie/:id', Movie.detail);

	app.post('/admin/movie/new', Movie.uploadPoster, Movie.save);

	//user
	app.get('/admin/userList', User.isSignin, User.isAdministrator, User.list);

	app.post('/admin/signup', User.signup);

	app.post('/admin/login', User.login);

	app.get('/admin/logout', User.logout);

	app.delete('/admin/userList', User.isSignin, User.isAdministrator, User.delete);

	app.get('/signup', User.showSignup);

	app.get('/login', User.showLogin);	

	//comment

	app.post('/comment/new', User.isSignin, Comment.save);

	//category
	app.get('/category/showNew', Category.showAdd);

	app.post('/category/new', Category.save);

	//search
	app.get('/result', Search.result);

	//upload test
	app.get('/admin/movie/showUpload',  Movie.showUpload);
	app.get('/admin/movie/upload',  Movie.upload);


}