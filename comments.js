//Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./commentModel');
var db = 'mongodb://localhost/comments';

mongoose.connect(db);

//Set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Set up port
var port = 8080;

//Set up route
var router = express.Router();

//Set up middleware
router.use(function(req, res, next){
	console.log('Something is happening!');
	next();
});

//Test route
router.get('/', function(req, res){
	res.send('Hello World!');
});

//Route for /comments
router.route('/comments')
	.post(function(req, res){
		var comment = new Comment();

		comment.author = req.body.author;
		comment.text = req.body.text;

		comment.save(function(err){
			if (err)
				res.send(err);

			res.json({message: 'Comment successfully added!'});
		});
	})

	.get(function(req, res){
		Comment.find(function(err, comments){
			if (err)
				res.send(err);

			res.json(comments);
		});
	});

//Route for /comments/:comment_id
router.route('/comments/:comment_id')
	.get(function(req, res){
		Comment.findById(req.params.comment_id, function(err, comment){
			if (err)
				res.send(err);

			res.json(comment);
		});
	})

	.put(function(req, res){
		Comment.findById(req.params.comment_id, function(err, comment){
			if (err)
				res.send(err);

			comment.author = req.body.author;
			comment.text = req.body.text;

			comment.save(function(err){
				if (err)
					res.send(err);

				res.json({message: 'Comment successfully updated!'});
			});
		});
	})

	.delete(function(req, res){
		Comment.remove({
			_id: req.params.comment_id
		}, function(err, comment){
			if (err)
				res.send(err);

			res.json({message: 'Comment successfully deleted!'});
		});
	});

//Register routes
app.use('/api', router);

//Start server
app.listen(port);
console.log('Server started on port ' + port);