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
    
    if(hasJustTracked){
        price = $(".tracking_price span").html();
        price = price.replace("$","");
        price = $.trim(price);
    }
    else{
        price="";
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
                price:price
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
    if(hasJustTracked){
        price = $(".tracking_price span").html();
        price = price.replace("$","");
        price = $.trim(price);
    }
    else{
        price="";
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
                price:price
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

function showOne(key) {
    var prices = [];
    if (key != '') {
        data = item_type_history[key];
        for (i = 0; i < data.length; i++) {

            date = new Date(data[i]['date']).getTime();
            date = parseFloat(date);
            price = parseFloat(data[i]['price']);
            prices.push([date, price]);

        }
    }
    if (is_show_quantity == '1') {
        var data_quantity = [];
        if (key != '') {
            data = item_type_history[key];
            for (i = 0; i < data.length; i++) {

                date = new Date(data[i]['date']).getTime();
                date = parseFloat(date);
                quantity = parseFloat(data[i]['quantity']);
                data_quantity.push([date, quantity]);

            }
        }

        seriesData = [{
                name: 'Price',
                data: prices,
                tooltip: {
                    valueDecimals: 2,
                    pointFormat: '{series.name}: <b>${point.y}</b><br/>',
                    shared: true,
                    xDateFormat: '%b %e %Y'
                },
                color: 'blue'
            },
            {
                name: 'Quantity',
                data: data_quantity,
                tooltip: {
                    valueDecimals: 0,
                    pointFormat: '{series.name}: <b>{point.y}</b><br/>',
                    shared: true,
                    xDateFormat: '%b %e %Y'
                }
            }
        ];
    } else {
        seriesData = [{
                name: 'Price',
                data: prices,
                tooltip: {
                    valueDecimals: 2,
                    pointFormat: '{series.name}: <b>${point.y}</b><br/>',
                    shared: true,
                    xDateFormat: '%b %e %Y'
                },
                color: 'blue'
            }
        ];
    }

    return seriesData;
}

function showMulti() {
    seriesDataAll = [];
    options = $("#select_inventoryList option");
    selects = $("select[name='level']");
    for (k = 1; k < options.length; k++) {
        key = $(options[k]).attr('value');
        temp = key.split('|');
        run = true;
        for (j = 0; j < selects.length; j++) {
            if (j == 0 && $(selects[j]).val() == '') {
                run = false;
                break;
            }
            if (j > 0 && $(selects[j]).val() != '' && $(selects[j]).val() != temp[j]) {
                run = false;
                break;
            }
            run1 = true;
            for (m = 0; m <= j; m++) {
                if ($(selects[m]).val() != '' && $(selects[m]).val() != temp[m]) {
                    run1 = false;
                    break;
                }
            }
            if (run1 == false) {
                run = false;
                break;
            }

        }

        if (run == true) {
            var prices = [];
            data = item_type_history[key];
            for (i = 0; i < data.length; i++) {

                date = new Date(data[i]['date']).getTime();
                date = parseFloat(date);
                price = parseFloat(data[i]['price']);
                prices.push([date, price]);

            }
            if (is_show_quantity == '1') {
                var data_quantity = [];
                if (key != '') {
                    data = item_type_history[key];
                    for (i = 0; i < data.length; i++) {

                        date = new Date(data[i]['date']).getTime();
                        date = parseFloat(date);
                        quantity = parseFloat(data[i]['quantity']);
                        data_quantity.push([date, quantity]);

                    }
                }

                seriesData = {
                    name: 'Price',
                    data: prices,
                    tooltip: {
                        valueDecimals: 2,
                        pointFormat: key.split('|').join(' ') + '<br>{series.name}: <b>${point.y}</b><br/>',
                        shared: true,
                        xDateFormat: '%b %e %Y'
                    },
                    color: 'blue'
                };
                seriesDataAll.push(seriesData);

                seriesData =
                        {
                            name: 'Quantity',
                            data: data_quantity,
                            tooltip: {
                                valueDecimals: 0,
                                pointFormat: key.split('|').join(' ') + '<br>{series.name}: <b>{point.y}</b><br/>',
                                shared: true,
                                xDateFormat: '%b %e %Y'
                            }
                        }
                ;
                seriesDataAll.push(seriesData);

            } else {
                seriesData = {
                    name: 'Price',
                    data: prices,
                    tooltip: {
                        valueDecimals: 2,
                        pointFormat: key.split('|').join(' ') + '<br>{series.name}: <b>${point.y}</b><br/>',
                        shared: true,
                        xDateFormat: '%b %e %Y'
                    },
                    color: 'blue'
                }
                ;
                seriesDataAll.push(seriesData);
            }


        }
    }


    return seriesDataAll;
}

function resetComboboxChildren(idSelect) {
    valParent = $("#" + idSelect).val();
    index = parseInt(idSelect[idSelect.length - 1]);
    for (i = index + 1; i < $("select[name='level']").length; i++) {
        $("#level" + i).html('<option value="">Please select</option>');
    }
    index++;
    next_options = [];
    
    for (key in item_type_history) {
        temp = key.split('|');
        run = true;
        for (m = 0; m <= index - 1; m++) {
            if ($("#level" + m).val() != temp[m]) {
                run = false;
                break;
            }
        }
        if (run == true) {
            next_options[temp[index]] = '';
            
        }
    }
    
    ar=[];
    for (key in next_options) {
        ar.push(key);
    }
    ar.sort();
    for(i=0;i<ar.length;i++){
        key=ar[i];
        $("#level" + index).append('<option value="' + key + '">' + key + '</option>');
    }
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