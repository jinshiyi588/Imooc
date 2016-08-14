var Comment = require('../models/comment');


exports.save = function(req, res){
	var commentObj= req.body.comment;

	if(commentObj.cid){
		//reply
		Comment.findById(commentObj.cid, function(err, comment){

			var reply={

				from: commentObj.user,
				to: commentObj.tid,
				content: commentObj.content
			};

			comment.reply.push(reply);

			comment.save(function(err,comment){
				if (err) {
					console.log(err);
				};
				res.redirect('/movie/' + commentObj.movie);

			})	
		})


	}else{
		_comment =new Comment({
			content: commentObj.content,
			movie: commentObj.movie,
			from: commentObj.user

		});

		_comment.save(function(err,comment){
			if (err) {
				console.log(err);
			};
			res.redirect('/movie/' + commentObj.movie);

		})	

	}
}

