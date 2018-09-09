(function ($) {
	$(function() {
		$('#q').bootcomplete({
			url: `${window.location.href}/search`,
			method: 'post'
		});
	});
})( jQuery );
