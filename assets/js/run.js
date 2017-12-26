window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    $("body").html("Please reload.");
}
jQuery(function ($) {
    $("#tabs").tabs();

    $(".ui-button.ui-widget.ui-corner-all").click(function () {
        $("#login_register_tab").click();
    });

    $(".numeric").numeric({negative: false, decimal: false});
    $(".numeric").keyup(function () {
        $(this).val(numberWithCommasForToko($(this).val()));
    });

    $("#track-label").click(function () {
        if (isLogin == false) {
            $("#login_register_tab").click();
            $('#login-form-link').click();
            $('#track-button').prop('checked', false);
            return;
        }
        if ($('#track-button').is(":checked")) {
            $("#tracking_div").slideDown('slow');
        } else {
            $("#tracking_div").slideUp('slow');
        }

    });

    if (isLogin) {
        $("#login-logout").html('').append('<a href="/logout/' + domain + '/' + id + '">Logout</a>');
    }

    $.alertOnClick('#tracking', {
        'title': '',
        'content': 'success',
        'onOpen': function (alert) {
            $(".ja_wrap.ja_wrap_black").height($("body").height());
            $(".jAlert.animated.ja_default.ja_noTitle.ja_sm.fadeInUp").css('margin-top', '350px');
            window.setTimeout(function () {
                $.jAlert('current').closeAlert();
            }, 1000);
        }
    });

    $('#login-submit').click(function () {
        login();
    });

    $("#login-form input").keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) { //Enter keycode
            login();
        }
    });
    
    $('#register-submit').click(function() {
        regist();
    });
    $("#register-form input").keyup(function(e) {
        var code = e.keyCode || e.which;
         if(code == 13) { //Enter keycode
           regist();
         }			
    });

    $('#login-form-link').click(function (e) {
        $("#login-form").show();//.fadeIn(100);
        $("#register-form").hide();//.fadeOut(100);
        $('.panel-heading a').removeClass('active');
        $(this).addClass('active');
        $('input[name="logemail"]').focus();
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").show();//.fadeIn(100);
        $("#login-form").hide();//.fadeOut(100);
        $('.panel-heading a').removeClass('active');
        $(this).addClass('active');
        $('input[name="email"]').focus();
        e.preventDefault();
    });

    $('#login_register_tab').click(function (e) {
        if ($("#login-form").is(":visible")) {
            $('input[name="logemail"]').focus();
        } else {
            $('input[name="email"]').focus();
        }

    });

    $('#desired_price').keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13 && $.trim($(this).val()) != '') { //Enter keycode
            price = $.trim($(this).val());
            find1 = ',';
            re1 = new RegExp(find1, 'g');
            price = price.replace(re1, "");
            $.ajax({
                type: "GET",
                url: '/tracking/' + domain + '/' + id + '/' + price,
                dataType: 'json',
                success: function (result) {
                    if (result.success) {
                        $("#tracking").click();
                    } else {
                        if (result.message != undefined && result.message == 'logout') {
                            alert("You have been logged out.");
                            window.location = '/banana/' + domain + '/' + id;
                        } else {
                            alert('error');
                        }

                    }
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                    console.log(status);
                    console.log(error);
                }
            });
        }


    });

    $('#desired_price').change(function () {
        if ($.trim($(this).val()) != '') {
            price = $.trim($(this).val());
            find1 = ',';
            re1 = new RegExp(find1, 'g');
            price = price.replace(re1, "");
            $.ajax({
                type: "GET",
                url: '/tracking/' + domain + '/' + id + '/' + price,
                dataType: 'json',
                success: function (result) {
                    if (result.success) {
                        $("#tracking").click();
                    } else {
                        if (result.message != undefined && result.message == 'logout') {
                            alert("You have been logged out.");
                            window.location = '/banana/' + domain + '/' + id;
                        } else {
                            alert('error');
                        }
                    }
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                    console.log(status);
                    console.log(error);
                }
            });
        }


    });
});