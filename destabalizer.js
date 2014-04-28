var request = require('request'); 
var cheerio = require('cheerio'); 
var fs = require('fs');
var async = require('async'); 
var url = require('url');

exports.scraper = function (req, res) {
	console.log('Scraper instance initi for ' + req.params.addr)
	if (!req.body.addr) {
		var err = new Error('scraper faild to receive a req.addr from router');
		throw err;
		return sendReply(err);
	}
	var locals = {},
		addr = req.body.addr;
	if (addr.slice(0,8) !== 'https://'){
		locals.url =  addr.slice(0,7) === 'http://'? addr : 'http://'+ addr;
	} else {
		locals.url =  addr;
	}
	locals.re = /global climate change|climate change|global warming+/gi;
	async.series(
		[
		function fetchHtml (callback) {
			console.log("About to request url: "+locals.url);
			request(locals.url, 
				function (err, res, body) {
					if (err){
						console.log(err);
						return callback(err);
					} else if (res.statusCode == 200) {
						var $ = cheerio.load(body),
							parsed = url.parse(locals.url),
							addition = parsed.protocol + '//' + parsed.host;
						function testForAbsolute (url) {
							var re0 = /\/\//,
							    re1 = /http/;
							console.log(url);
							return re0.test(url) || re1.test(url);
						};
						$('link[rel="stylesheet"]').each(function(){
							console.log(this.toString());
							var current = $(this).attr('href');
							console.log(testForAbsolute(current));
							if (testForAbsolute(current) === false){
								var fixed = addition + current;
								$(this).attr('href', fixed);
							} 
						});
						$('script').each(function(){
							var current = $(this).attr('src');
							if (testForAbsolute(current) === false){
								var fixed = addition + current;
								$(this).attr('src', fixed);
							}
						});
						$('img').each(function(){
							var current = $(this).attr('src');
							if (testForAbsolute(current) === false){
								var fixed = addition + current;
								$(this).attr('src', fixed);
							}
						});
						var clientScript = '<script src="javascripts/destabalize.js" type="text/javascript" ></script>';
						//$('body').append(clientScript);
						locals.requestHtml = $.html();
						return callback();
					} else {
						return callback(new Error('request status code = ' + res.statusCode));
				}
				}	
			)
		},
		function replace (callback) {
			if (err) {
				return callback(err);
			} 
			var htmlString = locals.requestHtml.toString();
			console.log('about to run replace');
			var replaced = htmlString.replace(locals.re,'<strong>Global Climate Destabalization</strong>');
			locals.replacedHtml = replaced;
			fs.writeFile('arg1.html', replaced, 
				function (err, file){
					if (err){
						return callback(err);
					} else {
						console.log('calling callback from replace');
						return callback();
					}
				}
			);
		}
		], 

		function sendReply () {
			console.log('here');
			if (err) {
				res.end(err);
			}
			console.log('about to send response');
			return res.end(locals.replacedHtml);
		}
	);
}



