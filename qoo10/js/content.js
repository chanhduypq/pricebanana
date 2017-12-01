$(function () {

    // contentFull
    var contentFull = $(".goodsDetailWrap").html();

    var apiUrl = 'https://pricebanana.com/get_content';
    var current_url = window.location.href;

    url = current_url.replace('https://www.', '');
    temp = url.split('/');
    id = temp[temp.length - 1];
    temp = temp[0].split('.');
    domain = temp[0];

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
                $('.goodsDetailWrap').after('<div id="pricebanana_ctn"><iframe src="https://pricebanana.com/banana/' + domain + '/' + id + '"></iframe></div>');
            }

        },
        error: function (xhr, status, error) {
            console.log(status);
            console.log(error);
            console.log(xhr.responseText);
        }
    });

});