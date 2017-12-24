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


    if (checked) {
        $.ajax({
            type: "POST",
            url: '/register',
            data: {
                email: email,
                password: password,
                passwordConf: passwordConf,
                is_ajax: true,
                product_id: domain + '_' + id
            },
            dataType: 'json',
            success: function (result) {
                if (result.success) {
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
    if (checked) {
        $.ajax({
            type: "POST",
            url: '/login',
            data: {
                logemail: logemail,
                logpassword: logpassword,
                rememberme: rememberme,
                is_ajax: true,
                product_id: domain + '_' + id
            },
            dataType: 'json',
            success: function (result) {
                if (result.success) {
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

function showChart(label_for_yAxis,label_for_chart,seriesData,elementId_for_render) { 
    Highcharts.setOptions({
            lang:{
                rangeSelectorZoom: ''
            }
    });
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
            allButtonsEnabled: true,
            selected: 0,
            buttonTheme: {
                width: 50
//                visibility: 'hidden'
            },
            buttons: [
                {type: 'week', count: 1, text: '1w'},
                {type: 'month', count: 1, text: '1m'},
                {type: 'month', count: 3, text: '3m'},
                {type: 'month', count: 6, text: '6m'},
                {type: 'ytd',count: 6, text: 'YTD'},
                {type: 'year', count: 1, text: '1y'},
                {type: 'all',count: 6, text: 'All'}
            ]
        },
//        xAxis: {
//            events: {
//                setExtremes: function(e) {
////                    console.log(this);
//                    if(typeof(e.rangeSelectorButton)!== 'undefined')
//                    {
//                        $.getJSON('https://localhost/get/'+domain+'/'+id+'/'+e.rangeSelectorButton.text, function (data) {
//                            console.log(data);
//                            this.series=data;
//                        });
////                        console.log('count: '+e.rangeSelectorButton.count + 'text: ' +e.rangeSelectorButton.text + ' type:' + e.rangeSelectorButton.type);
//                    }
//                }
//            }
//        },
        yAxis: {
            title: {
                text: label_for_yAxis,
                style: {"color": "#333", "fontSize": "22px"}
            }, opposite: false
        },
        title: {
            text: '<b>' + label_for_chart + '</b>',
            style: {"color": "#333", "fontSize": "12px"},
            align: 'left',
            y: 25
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
        exporting: { enabled: false },
        series: seriesData
    }, function (chart) {
        // apply the date pickers
        setTimeout(function () {
            $('input.highcharts-range-selector', $('#' + chart.options.chart.renderTo)).datepicker()
        }, 0)
    });
}

function numberWithCommasForToko(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
