(function($){
	console.log('arrived');
	console.log($('img').length);
	$(document).ready(
		$('img').attr('src', 'http://worldwidewhiskers.files.wordpress.com/2010/01/united_bamboo_2010_catalog_cats1.jpg');
		//$('img').attr('src', '#').append('<video style="position: inherit; width: inherit; height: inherit;" autoplay><source src="/vids/science.mp4" type="video/mp4" codecs="avc1.42E01E, mp4a.40.2"></source></video>')
	);
})(jQuery);