(function($){
	$(document).ready(
		function (){
			var video = document.getElementById('video'),
				veil = document.getElementById('veil');
			video.onloadeddata = function(){
				video.play()
				$(veil).fadeOut(1000);
			};
		}
	);

})(jQuery);