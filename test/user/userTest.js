var crypto = require("crypto");
var bcrypt = require("bcrypt");

function getRandomString(len){
	if(!len) len = 16;

	return crypto.randomBytes(Math.ceil(len/2)).toString();

}

var should= require("should");
var app =require("../../app");
var mongoose = require("mongoose");
var User = require("../../app/models/user");
var user;

describe('<Unit Test>', function(){
	describe('Models User:', function(){
		before(function(done){
			user = {
				name: getRandomString(),
				password: 'password'
			}

			done();
		})

		describe('Before Method Save', function(){
			it('should begin without test user', function(done){
				User.find({name: user.name}, function(err, users){
					users.should.have.length(0);
					done();
				})
			})
		})

		describe('User Save', function(){
			it('should save without problems', function(done){
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);

				});
				_user.remove(function(err){
					should.not.exist(err);
					done();
				});
			})

			it('cannot save user if user exist', function(){
				var _user1 = new User(user);
				var _user2 = new User(user);

				_user1.save(function(err){
					should.not.exist(err);
				})

				_user2.save(function(err){
					should.exist(err);
					_user1.remove(function(err){
						if(!err){
							_user2.remove(function(err){
								should.not.exist(err);
								done();
							})
						}
					})
				})
			})

			it('should password be hashed correct', function(){
				var _user= new User(user);
				_user.save(function(err){
					should.not.exist(err);
					_user.password.should.not.have.length(0);

					bcrypt.compare(_user.password, user.password, function(err, isMath){
						should.not.exist(err);
						isMath.should.equal(true);
						_user.remove(function(err){
							should.not.exist(err);
							done();
						})
					})
				})

			})
		})

	})

})