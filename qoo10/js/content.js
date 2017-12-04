$(function () {

	// contentFull
	
	var product_id 	= false;
	var domain 		= false;
	var iframe_node = false;
	var apiUrl 		= 'https://localhost/get_content';
	var current_url = window.location.href;
        
//        var param = new RMSParam();
//    param.add("inventory_no", 'ST560300975');
//    param.add("lang_cd", 'en');
//    param.add("inventory_yn", "");
//    param.add("link_type", 'N');
//    param.add("gd_no", '560300975');
//    param.add("global_order_type", 'L');
//    var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsInventoryAvailableList", param.toJson());
//    if (ret != null && ret.Rows != null) {
//        OptAllVw.OptionArray = ret.Rows;
//    }

	//check qoo10
	// var qoo10Regex  = /www.qoo10.sg\/(item|Goods)[\S]*\/([0-9]{9})/i;
	// if(qoo10Regex.test(current_url)){
	// 	var asin =  current_url.match(qoo10Regex);
	// 	if( typeof asin[2]!='undefined' && asin[2].length==9 ){
	// 		product_id = asin[2];
	// 		domain = 'qoo10';
	// 		iframe_node = '.goodsDetailWrap';
	// 	}
	// }

	//check qoo10
	if(current_url.indexOf("www.qoo10.sg")>-1) {
		var asin =  $("#gd_no").val();
		if( asin!='' ){
			product_id = asin;
			domain = 'qoo10';
			iframe_node = '.goodsDetailWrap';
		}
                var contentFull = $(".goodsDetailWrap").html();
                if($.trim(contentFull)==''){
                    contentFull=$(".detailsArea").parent().html();
                }
	}
	//check lazada
	if(current_url.indexOf("www.lazada.sg")>-1) {
		var asin =  $("#config_id").val();
		if( asin!='' ){
			product_id = asin;
			domain = 'lazada';
			iframe_node = '#prodinfo';
		}
                var contentFull = $("#product-price-box").html();
	}

	//check shopee
	var shopeeRegex  = /shopee.sg\/[\S]*(-i.)([0-9]{5}).([0-9]{8})/i;
	if(shopeeRegex.test(current_url)){
		var asin =  current_url.match(shopeeRegex);
		if( typeof asin[3]!='undefined' ){
			product_id = asin[3];
			domain = 'shopee';
			iframe_node = '.product-page__top-section';
		}
                var contentFull = '';// $(".goodsDetailWrap").html();
	}

	//check march domain to send full page to server by ajax
	if(domain!=false && product_id!=false && iframe_node!=false ){

//		console.log('product_id: '+product_id);
//		console.log('domain: '+domain);

		// var iframe_href = 'https://pricebanana.com/banana/' + domain + '/' + product_id ;
		// $('iframe_node').after('<div id="pricebanana_ctn"><iframe src="'+iframe_href+'"></iframe></div>');

		 $.ajax({
		 	url: apiUrl,
		 	method: "POST",
		 	crossDomain: true,
		 	async: true,
		 	dataType: 'json',
		 	data: {
		 		url: current_url,
                                id: product_id,
                                content: contentFull,
                                domain: domain
		 	},
		 	success: function (result) {
		 		if (result.success) {
		 			$(iframe_node).after('<div id="pricebanana_ctn"><iframe src="https://localhost/banana/' + domain + '/' + product_id + '"></iframe></div>');
		 		}
		 	},
		 	error: function (xhr, status, error) {
		 		console.log(status);
		 		console.log(error);
		 		console.log(xhr.responseText);
		 	}
		 });

	}
	

	

});