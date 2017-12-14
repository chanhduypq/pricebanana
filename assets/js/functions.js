function regist() {
    var checked = true;
    var email = $.trim($('input[name=email]').val());
    $('input[name=email]').css('border-color', '#ccc');
    if (email == '' || email.indexOf('@') === -1) {
        $('input[name=email]').css('border-color', 'red');
        checked = false;
    }
    var password = $.trim($('input[name=password]').val());
    $('input[name=password]').css('border-color', '#ccc');
    if (password == '') {
        $('input[name=password]').css('border-color', 'red');
        checked = false;
    }
    var passwordConf = $.trim($('input[name=passwordConf]').val());
    $('input[name=passwordConf]').css('border-color', '#ccc');
    if (passwordConf == '') {
        $('input[name=passwordConf]').css('border-color', 'red');
        checked = false;
    }

    if (hasJustTracked) {
        price = $(".tracking_price span").html();
        price = price.replace("$", "");
        price = $.trim(price);
    } else {
        price = "";
    }


    if (checked) {
        $.ajax({
            type: "POST",
            url: '/register',
            data: {
                email: email,
                password: password,
                passwordConf: passwordConf,
                is_ajax: true,
                product_id: domain + '_' + id,
                price: price
            },
            dataType: 'json',
            success: function (result) {
                if (result.success) {
//                            showTrackProductTab(result,email,current_price);
                    window.location.reload();
                } else {
                    alert(result.message);
                }
            },
            error: function () {
                alert('ajax error');
            }
        });
    }
}

function login() {
    var checked = true;
    var logemail = $.trim($('input[name=logemail]').val());
    $('input[name=logemail]').css('border-color', '#ccc');
    if (logemail == '' || logemail.indexOf('@') === -1) {
        $('input[name=logemail]').css('border-color', 'red');
        checked = false;
    }
    var logpassword = $.trim($('input[name=logpassword]').val());
    $('input[name=logpassword]').css('border-color', '#ccc');
    if (logpassword == '') {
        $('input[name=logpassword]').css('border-color', 'red');
        checked = false;
    }
    var rememberme = $('input[name=rememberme]').is(":checked");
    if (hasJustTracked) {
        price = $(".tracking_price span").html();
        price = price.replace("$", "");
        price = $.trim(price);
    } else {
        price = "";
    }
    if (checked) {
        $.ajax({
            type: "POST",
            url: '/login',
            data: {
                logemail: logemail,
                logpassword: logpassword,
                rememberme: rememberme,
                is_ajax: true,
                product_id: domain + '_' + id,
                price: price
            },
            dataType: 'json',
            success: function (result) {
                if (result.success) {
//                                    showTrackProductTab(result,logemail,current_price);
                    window.location.reload();
                } else {
                    alert(result.message);
                }
            },
            error: function () {
                alert('ajax error');
            }
        });
    }
}

function showTrackProductTab(result, logemail, current_price) {
    $('#acount-form').hide();
    $('#track-price').show();
    isLogin = true;
    $('#user_email').html(logemail + ' (<a href="/logout/' + domain + '/' + id + '">Logout</a>)');
    updatePriceSlide(result.tracked_price);
    var discount_price = $('#track-price .discount_price span');
    var discount_price_percent = $('#track-price .discount_price i');
    var currency = '$';
    var currency_label = currency + ' ';
    // caculate
    discount = current_price - result.tracked_price;
    discount_price.text(currency_label + discount);
    //percent
    if (current_price == 0) {
        percent = 0;
    } else {
        percent = (result.tracked_price / current_price) * 100;
        percent = 100 - Math.ceil(percent);
    }
    discount_price_percent.text(' (' + percent + '%)');
}


function updatePriceSlide(track_value) {
    if (track_value == 0) {
        track_value = $('#track-price .price span').html();
        track_value = track_value.replace("$", "");
        track_value = $.trim(track_value);
    }
    $('#track-price .price_slider').slider('option', 'value', track_value);
    $('.ui-slider-handle.custom-handle.ui-corner-all.ui-state-default').html("$ " + track_value);

}

function trackingPriceSlide(current_price, min_price, max_price) {
    //slider
    var currency = '$';
    var currency_label = currency + ' ';
    var price = $('#track-price .price span');
    var tracking_price = $('#track-price .tracking_price span');
    var discount_price = $('#track-price .discount_price span');
    var discount_price_percent = $('#track-price .discount_price i');

    var handle = $('#track-price .custom-handle');
    $('#track-price .price_slider').slider({
        value: current_price,
        min: min_price,
        max: max_price,
        range: 'min',
        create: function () {
            slide_price = $(this).slider('value');
            handle.text(currency_label + slide_price);
            tracking_price.text(current_price);
            price.text(currency_label + max_price);

            // caculate
            discount = max_price - current_price;
            discount_price.text(currency_label + discount);
            //percent

            if (max_price == 0) {
                percent = 0;
            } else {
                percent = (current_price / max_price) * 100;
                percent = 100 - Math.ceil(percent);

            }
            discount_price_percent.text(' (' + percent + '%)');
            $('#track-price .price_slider .ui-slider-range').css('background-color', getColor(100 - percent));
        },
        slide: function (event, ui) {
            handle.text(currency_label + ui.value);
            $(tracking_price).text(currency_label + ui.value);
            $(discount_price).text(currency_label + (max_price - ui.value));

            //percent
            percent = (ui.value / max_price) * 100;
            percent = 100 - Math.ceil(percent);
            discount_price_percent.text(' (' + percent + '%)');
            //update color
            $('#track-price .price_slider .ui-slider-range').css('background-color', getColor(100 - percent));
        }
    });
}

function getColor(v) {
    if (v < 80) {
        r = 255;
        g = parseInt(((v * 2) * 255) / 100);
    } else {
        r = parseInt(((100 - v) * 2) * 255 / 100);
        g = 255;
    }
    return "rgb(" + r + "," + g + ",0)";
}

function showChart(label_for_yAxis,label_for_chart,seriesData,elementId_for_render) {
    Highcharts.stockChart({
        chart: {
            borderColor: 'white',
            borderWidth: 1,
            renderTo: elementId_for_render,
            style: {
                fontFamily: 'Arial,Helvetica,sans-serif'
            }
        },
        rangeSelector: {
            selected: 3,
            buttonTheme: {width: 50},
            buttons: [
                {type: 'week', count: 1, text: '1w'},
                {type: 'month', count: 1, text: '1m'},
                {type: 'month', count: 3, text: '3m'},
                {type: 'month', count: 6, text: '6m'},
                {type: 'ytd', text: 'YTD'},
                {type: 'year', count: 1, text: '1y'},
                {type: 'all', text: 'All'}
            ]
        },
        yAxis: {
            title: {
                text: label_for_yAxis,
                style: {"color": "#333", "fontSize": "22px"}
            }, opposite: false
        },
        title: {
            text: '<b>' + label_for_chart + '</b>',
            style: {"color": "#333", "fontSize": "30px"}
        },
        plotOptions: {
            line: {
                color: '#ff6347',
                marker: {enabled: false}
            }
        },
        credits: {enabled: false},
        navigator: {enabled: false},
        scrollbar: {enabled: false},
        series: seriesData
    }, function (chart) {
        // apply the date pickers
        setTimeout(function () {
            $('input.highcharts-range-selector', $('#' + chart.options.chart.renderTo)).datepicker()
        }, 0)
    });
}