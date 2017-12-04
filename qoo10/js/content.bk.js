$(function () {

    
    

    var apiUrl = 'https://localhost/get_content';
    var current_url = window.location.href;

    url = current_url.replace('https://www.', '');
    temp = url.split('/');
    id = temp[temp.length - 1];
    temp = temp[0].split('.');
    domain = temp[0];
    
    // contentFull
    if(domain=='qoo10'){
        var contentFull = $(".infoData").html();//$(".goodsDetailWrap").html();
    }
    else if(domain=='lazada'){
        var contentFull = $("#product-price-box").html();
    }
    else if(domain=='shopee'){
        var contentFull = '';// $(".goodsDetailWrap").html();
    }
    else{
        var contentFull = '';
    }
console.log(contentFull);

    $.ajax({
        url: apiUrl,
        method: "POST",
        crossDomain: true,
        async: true,
        dataType: 'json',
        data: {
            url: current_url,
            content: contentFull
        },
        success: function (result) {
            if (result.success) {
                if(domain=='qoo10'){
                    $('.goodsDetailWrap').after('<div id="pricebanana_ctn"><iframe src="https://localhost/banana/' + domain + '/' + id + '"></iframe></div>');
                }
                else if(domain=='lazada'){
                    $('#prodinfo').after('<div id="pricebanana_ctn"><iframe src="https://localhost/banana/' + domain + '/' + id + '"></iframe></div>');
                }
                else if(domain=='shopee'){
                    $('.goodsDetailWrap').after('<div id="pricebanana_ctn"><iframe src="https://localhost/banana/' + domain + '/' + id + '"></iframe></div>');
                }
                
            }

        },
        error: function (xhr, status, error) {
            console.log(status);
            console.log(error);
            console.log(xhr.responseText);
        }
    });

});