$(function() {

	// contentFull
	var contentFull = $("html").html();
	//after
	$('.goodsDetailWrap').after('<div id="pricebanana_ctn"><iframe src="https://pricebanana.maitrongtung.com?d=q10&id=77"></iframe></div>');


	// send all page content
//	 var apiUrl = 'https://pricebanana.maitrongtung.com/check.php';
//	 var current_url = window.location.href;
//	 $.ajax({
//	 	url: apiUrl,
//	 	method: "POST",
//	 	crossDomain: true,
//	 	async: true,
//	 	data: {
//	 		product_url: current_url,
//	 		content: contentFull
//	 	},
//	 	success: function(result) {
//	 		if(result.success){
//	 			$('.goodsDetailWrap').after('<div id="pricebanana_ctn"><iframe src="https://pricebanana.maitrongtung.com?d=q10&id=77"></iframe></div>');
//	 		}
//	 		console.log(result);
//	 	},
//	 	error: function(xhr, status, error) {
//	 		console.log(status);
//	 		console.log(error);
//	 		console.log(xhr);
//	 	}
//	 });

         var apiUrl = 'http://localhost:3000/get_content';
	 var current_url = window.location.href;
	 $.ajax({
	 	url: apiUrl,
	 	method: "POST",
	 	crossDomain: true,
	 	async: true,
	 	data: {
	 		product_url: current_url,
	 		content: contentFull
	 	},
	 	success: function(result) {
//	 		if(result.success){
//	 			$('.goodsDetailWrap').after('<div id="pricebanana_ctn"><iframe src="https://pricebanana.maitrongtung.com?d=q10&id=77"></iframe></div>');
//	 		}
	 		console.log(result);
	 	},
	 	error: function(xhr, status, error) {
	 		console.log(status);
	 		console.log(error);
	 		console.log(xhr);
	 	}
	 });

});