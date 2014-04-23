var fs = require('fs');
var mongoose = require('mongoose');
var streamVid = require('../videoStreamer.js').streamVid;
var destabalizer = require('../destabalizer').scraper;

exports.test = function (req, res) {
	res.render('index', { test: req.query });
};


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', name: "" });
};


exports.about = function(req, res){
	res.render('index', { title: 'About' });
};

exports.videoPage = function(req, res) {
	var filePath = 'public/videos/'+req.params.videoName+'.mp4',
	vidStat = fs.stat(filePath,
		function (err, stats) {
			if (err) {
				res.render('fourOhFour', { message: "Video not found"})
				return
			}

			res.render('video', {title: req.params.videoName, path: '/vids/'+req.params.videoName+'.mp4'})

		}
	);

};

exports.videos = function (req, res) {
	streamVid(req, res);
};

exports.destabalize = function (req, res) {
	console.log('req received at destabalized route');
	destabalizer(req, res);
}