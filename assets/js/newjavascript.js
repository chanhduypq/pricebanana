var tmpMultiItems = null;
var selectOptionNoList = "";
var selectTxtOptionNoList = "";
var selectTxtOptionValueList = "";
var opt_Goods_Img_url = "";
var show_detail_origin = false;
function clearMultiOrderOnLoad()
{
    try {
        $get("order_cnt").value = $get("default_order_cnt").value;
        var inventory_count = $nget("inventory_value").length;
        var opt_count = $nget("sel_no").length;
        for (var i = 0; i < inventory_count; i++) {
            $nget("inventory_value")[i].value = "";
        }
        for (var i = 0; i < opt_count; i++) {
            $nget("sel_no")[i].value = "";
        }
    } catch (e) {
    }
}
function initEventHandler() {
    updateShippingFeeConditionText();
    $(document).on('click', "a[name='surcharge']", function (e) {
        var delivery_option = "", delivery_nation_cd = "";
        if ($(':radio[name="delivery_option_no"]').length > 0) {
            if ($(':radio[name="delivery_option_no"]:checked').val() != undefined) {
                delivery_option = $(':radio[name="delivery_option_no"]:checked').val();
            }
        } else {
            delivery_option = $("#delivery_group_no").val();
        }
        if ($get("selected_nation_cd").value != undefined) {
            delivery_nation_cd = $get("selected_nation_cd").value;
        }
        var tmpTF = Util.__openInnerPopup_multiPopup;
        Util.__openInnerPopup_multiPopup = false;
        $("#frame_popup").attr("src", "/gmkt.inc/Goods/PopupInnerDeliveryFeeCalculator.aspx?goodscode=" + $get("gd_no").value + "&global_order_type=" + $get("global_order_type").value + "&ship_to=" + delivery_nation_cd + "&delivery_option=" + delivery_option);
        Util.openInnerPopup(Public.convertNormalUrl("~/Goods/PopupInnerDeliveryFeeCalculator.aspx?goodscode=" + $get("gd_no").value + "&global_order_type=" + $get("global_order_type").value + "&ship_to=" + delivery_nation_cd + "&delivery_option=" + delivery_option), 630, 200, 0);
        Util.__openInnerPopup_multiPopup = tmpTF;
        return false;
    });
    $(document).on('click', "a[name='calculator']", function (e)
    {
        openCalculator(e);
    });
    $("a[name='global_calculator']").bind("click", function (e) {
        Global_openCalculator();
    });
    $(".overdelivery_country .gBtn_txt2").bind("click", function (e)
    {
        if ($("#overseaLayer").hasClass("g_disNone"))
            $("#overseaLayer").removeClass("g_disNone");
        else
            $("#overseaLayer").addClass("g_disNone");
        return false;
    });
    $("#oversea_notice .g_icon_help").bind("mouseover", function (e)
    {
        if ($("#oversea_notice .OverdeliveryHelp").hasClass("g_disNone"))
            $("#oversea_notice .OverdeliveryHelp").removeClass("g_disNone");
        else
            $("#oversea_notice .OverdeliveryHelp").addClass("g_disNone");
        return false;
    });
    $("#oversea_notice .g_icon_help").bind("mouseout", function (e)
    {
        if ($("#oversea_notice .OverdeliveryHelp").hasClass("g_disNone"))
            $("#oversea_notice .OverdeliveryHelp").removeClass("g_disNone");
        else
            $("#oversea_notice .OverdeliveryHelp").addClass("g_disNone");
        return false;
    });
    $("#oversea_list .fcBlue").bind("click", function (e)
    {
        if ($("#oversea_list .OverdeliveryFee").hasClass("g_disNone"))
            $("#oversea_list .OverdeliveryFee").removeClass("g_disNone");
        else
            $("#oversea_list .OverdeliveryFee").addClass("g_disNone");
        return false;
    });
    $("#oversea_notice .OverdeliveryHelp .fcBlue").bind("click", function (e)
    {
        if ($("#oversea_list .OverdeliveryFee").hasClass("g_disNone"))
            $("#oversea_list .OverdeliveryFee").removeClass("g_disNone");
        else
            $("#oversea_list .OverdeliveryFee").addClass("g_disNone");
        return false;
    });
    $(".goods_navi .category dd").each(function ()
    {
        $(this).bind("mouseover", function (e)
        {
            if ($(this).attr("id") == "depMenu1") {
                $("#depMenu1 ul").removeClass("disNone");
            } else if ($(this).attr("id") == "depMenu2") {
                $("#depMenu2 ul").removeClass("disNone");
            } else {
                $("#depMenu3 ul").removeClass("disNone");
            }
            return false;
        });
    });
    $(".goods_navi .category dd").each(function ()
    {
        $(this).bind("mouseout", function (e)
        {
            if ($(this).attr("id") == "depMenu1") {
                $("#depMenu1 ul").addClass("disNone");
            } else if ($(this).attr("id") == "depMenu2") {
                $("#depMenu2 ul").addClass("disNone");
            } else {
                $("#depMenu3 ul").addClass("disNone");
            }
            return false;
        });
    });
    $("#GroupedItems").each(function ()
    {
        $(this).bind("mouseover", function (e) {
            $("#purchase_unit_layer").show();
            $($("#purchase_unit_layer").parent("div")[0]).addClass("hover");
            return false;
        });
        $(this).bind("mouseout", function (e) {
            $("#purchase_unit_layer").hide();
            $($("#purchase_unit_layer").parent("div")[0]).removeClass("hover");
            return false;
        });
    });
    $("#OptionImage").each(function ()
    {
        $(this).bind("click", function (e)
        {
            OptionImageOpen_OnClick();
        });
    });
    $("#OptionImage_BtnClose").each(function () {
        $(this).bind("click", function (e) {
            OptionImageOpen_OnClick();
        });
    });
    $("#OptionImage_BtnSave").each(function () {
        $(this).bind("click", function (e) {
            OptionImageSave_OnClick();
        });
    });
    $("#OptionImageLayer").find("div[class^='slide_list'] a[class='btn_prev']").bind("click", function (e) {
        OptionImageLayerPageMove("prev");
    });
    $("#OptionImageLayer").find("div[class^='slide_list'] a[class='btn_next']").bind("click", function (e) {
        OptionImageLayerPageMove("next");
    });
    $("#OptionAllList").each(function () {
        $(this).bind("click", function (e) {
            try {
                if (OptAllVw != null && OptAllVw.Open != null) {
                    $get("OptionImageLayer").style.display = "none";
                    OptAllVw.Open();
                }
                setmultiSmartBtnClass();
            } catch (ee) {
            }
        });
    });
    $("#plus_shopping_icon").each(function ()
    {
        $(this).bind("mouseover", function (e)
        {
            $get("plus_shopping_layer").style.display = "block";
        });
        $(this).bind("mouseout", function (e)
        {
            $get("plus_shopping_layer").style.display = "none";
        });
    });
    $("#plus_discont_icon").each(function ()
    {
        $(this).bind("mouseover", function (e)
        {
            $get("plus_discount_layer").style.display = "block";
        });
        $(this).bind("mouseout", function (e)
        {
            $get("plus_discount_layer").style.display = "none";
        });
    });
    $(".dsc_jcb .lnk").each(function () {
        $(this).bind("mouseover", function (e) {
            $(".dsc_jcb .layer_info").css("display", "");
        });
        $(this).bind("mouseout", function (e) {
            $(".dsc_jcb .layer_info").css("display", "none");
        });
    });
    $("#btn_goMyCoupon a").click(function () {
        if (IsCouponAvailable() === false) {
            return false;
        }
        goMyCoupon();
    });
    $('#goodsForm').each(function ()
    {
        this.reset();
    });
    setSelectedOptions();
    if (navigator.appName.indexOf("Microsoft") != -1) {
        $(".SaveDeskBtn").removeClass("disNone");
    }
    $(".saveArea .g_Btn .SaveBtn").bind("click", function (e)
    {
        if ($("#div_save").hasClass("disNone"))
            $("#div_save").removeClass("disNone");
        else
            $("#div_save").addClass("disNone");
        return false;
    });
    if ($get("ex_type").value == "C2C") {
        $get("CartOrderBtn").style.display = "none";
    }
    Util.__openInnerPopup_multiPopup = true;
    selectDeliveryDefaultOption();
    SelectFirstShippingTo();
    $("#g_shar_expire_help").bind("click", function (e)
    {
        if ($("#g_shar_expire_layer").css("display") == "" || $("#g_shar_expire_layer").css("display") == "block")
            $("#g_shar_expire_layer").css("display", "none");
        else
            $("#g_shar_expire_layer").css("display", "");
        return false;
    });
    $("#g_shar_expire_layer_close").bind("click", function (e)
    {
        $("#g_shar_expire_layer").css("display", "none");
    });
    $("#Group_buy_icon_help").bind("click", function (e)
    {
        $get("Group_buy_layer").style.display = "block";
    });
    $("#a_subOptionAdd").bind("click", function (e) {
        cart_order_btn_onClick();
    });
    $("#a_subOptionAdd").bind("mouseover", function (e) {
        SubCheckSelectedOption_cart();
    });
    $("#a_subOptionAdd").bind("mouseout", function (e) {
        SubBtnOut_cart();
    });
    $("#a_subOptionLayerView").bind("click", function (e) {
        SubOptionLayerView();
    });
    $("#a_subOptionLayerView_close").bind("click", function (e) {
        SubOptionLayerView();
    });
    $('input[id="order_cnt"]').bind('blur', function (e) {
        checkOrderCnt(true);
    });
    $('input[id="sub_order_cnt"]').bind('blur', function (e) {
        checkOrderCntSub(true);
    });
    if (GMKT.ServiceInfo.nation == "CN") {
        if (Util.getCookie("MecoxWarehouseName") != null && Util.getCookie("MecoxWarehouseName") != "") {
            var tmpCntrl = $("div[id='select_warehouse_list']").find("a[warehouse='" + Util.getCookie("MecoxWarehouseName") + "']");
            $get("select_warehouse").innerHTML = $(tmpCntrl).html();
        } else {
            $get("select_warehouse").innerHTML = "ä¸Šæµ·";
        }
    }
    SelectFirstOptionInventory();
    if ($get("groupbuy_no").value != "0" && $get("hid_OnlyGroupBuy").value == "false") {
        if (parseFloat($get("sell_price").value) <= 0)
            $("#dl_sell_price").css("display", "none");
        else
            $("#dl_sell_price").css("display", "");
    }
    if ($get("goods_dc_cost_basis_type").value == "GD" || $get("goods_dc_cost_basis_type").value == "PD" || $get("goods_dc_cost_basis_type").value == "TD") {
        orgCostBasisNo = $get("goods_dc_cost_basis_no").value;
        orgBasisType = $get("goods_dc_cost_basis_type").value;
    }
    UpdateCouponState();
    var $medi_layer = $("#medi_layer");
    $("#medi_chk").click(function () {
        if ($(this).is(":checked") === false) {
            return true;
        }
        $medi_layer.show();
        return false;
    });
    $(".btn_close, .btn_ccl", $medi_layer).click(function () {
        init_medi_layer();
        $medi_layer.hide();
    });
    $("#medi_have_symptoms", $medi_layer).change(function () {
        if ($(this).is(":checked") === true) {
            $("#ask_doctor", $medi_layer).show();
            $("#medi_next", $medi_layer).addClass("disable");
        } else {
            $("#ask_doctor", $medi_layer).hide();
            $("#medi_next", $medi_layer).removeClass("disable");
        }
    });
    $("#medi_next", $medi_layer).click(function () {
        if ($(this).hasClass("disable") === true) {
            return false;
        }
        $("#medi_step1", $medi_layer).removeClass("cur");
        $("#medi_step2", $medi_layer).addClass("cur");
        $(".medi-step1", $medi_layer).hide();
        $(".medi-step2", $medi_layer).show();
    });
    $("#confirm", $medi_layer).click(function () {
        $("#medi_chk").prop("checked", true);
        init_medi_layer();
        $medi_layer.hide();
    });
    Bargain.DisplayBtn();
    $(window).bind("load", function () {
        ImageSearch.init();
    });
    $(':radio[name="delivery_option_no"]').on('change', function () {
        if ($(this).prop('checked') == true) {
            setDeliveryPeriod(this);
        }
    });
    if ($(':radio[name="delivery_option_no"]:checked').length == 0) {
        var quick_delivery_slot = $('p[name="delivery_option_no"]').attr("quick_delivery_slot");
        var quick_delivery_avail = $("span[id^='quick_']").attr("data-is_avail");
        quick_delivery_slot = (quick_delivery_slot == undefined || quick_delivery_slot == "") ? null : quick_delivery_slot;
        if (quick_delivery_avail == "True") {
            $("#quick_delivery_slot").val(quick_delivery_slot);
        }
    }
    if ($("#__SmartCS_CartItem").length > 0) {
        $("#__SmartCS_CartItem").show();
    }
}
$(':radio[name="delivery_option_no"]').ready(function (e) {
    setTimeout(function () {
        if ($(':radio[name="delivery_option_no"]:checked').length > 0)
            setDeliveryPeriod($(':radio[name="delivery_option_no"]:checked'));
        else
            setDeliveryPeriod(null);
    }, 500);
});
function selectDeliveryDefaultOption()
{
    var qx_code = "";
    if ($("#global_order_type").val() == "G" || $("#proxy_nation_cd").val() == "US")
        qx_code = "100000037";
    else if ($("#svc_nation_cd").val() == "SG")
        qx_code = "100000020";
    else if ($("#svc_nation_cd").val() == "JP")
        qx_code = "100000026";
    else if ($("#svc_nation_cd").val() == "ID")
        qx_code = "100000008";
    else if ($("#svc_nation_cd").val() == "MY")
        qx_code = "100000006";
    else if ($("#svc_nation_cd").val() == "CN")
        qx_code = "100000038";
    if ($("input[name=delivery_option_no]").length > 0) {
        if (qx_code != "" && $("input[name=delivery_option_no]").filter("input[transc_cd=" + qx_code + "]").length > 0 && $("input[name=delivery_option_no]").filter("input[transc_cd=" + qx_code + "]").attr("disabled") != "disabled") {
            $("input[name=delivery_option_no]").filter("input[transc_cd=" + qx_code + "]").eq(0).prop("checked", true);
            $("input[name=delivery_option_no]").filter("input[transc_cd=" + qx_code + "]").eq(0).click();
        } else if ($("input[name=delivery_option_no]").filter("input[option_code=RM]").length > 0 && $("input[name=delivery_option_no]").filter("input[option_code=RM]").attr("disabled") != "disabled") {
            $("input[name=delivery_option_no]").filter("input[option_code=RM]").eq(0).prop("checked", true);
            $("input[name=delivery_option_no]").filter("input[option_code=RM]").eq(0).click();
        } else if ($("input[name=delivery_option_no]").filter("input[option_code=EX]").length > 0 && $("input[name=delivery_option_no]").filter("input[option_code=EX]").attr("disabled") != "disabled") {
            $("input[name=delivery_option_no]").filter("input[option_code=EX]").eq(0).prop("checked", true);
            $("input[name=delivery_option_no]").filter("input[option_code=EX]").eq(0).click();
        } else {
            $("input[name=delivery_option_no]").filter("input[option_code=NO]").eq(0).prop("checked", true);
            $("input[name=delivery_option_no]").filter("input[option_code=NO]").eq(0).click();
        }
    }
}
function showinfoShipping(idx) {
    if ($get("delivery_option_layer_" + idx) == null)
        return;
    $get("delivery_option_layer_" + idx).style.display = "block";
}
function hideinfoShipping(idx) {
    if ($get("delivery_option_layer_" + idx) == null)
        return;
    $get("delivery_option_layer_" + idx).style.display = "none";
}
function showPlusDiscountInfo(relation_group_no)
{
    Util.__openInnerPopup_multiPopup = true;
    var p = Util.openInnerPopup(Public.convertNormalUrl("~/Popup/PopupPlusDiscountDetail.aspx?relation_group_no=" + relation_group_no + "&global_order_type=" + $get("global_order_type").value), 610, 400);
}
function setSelectedOptions()
{
    var sel_count = 0;
    var selectedOptions = $get("selectedOptions").value;
    if (selectedOptions != "") {
        try {
            selectedOptions = selectedOptions.split(";");
            sel_count = $nget("sel_no").length;
            for (var i = 0; i < selectedOptions.length; i++) {
                for (k = 0; k < sel_count; k++) {
                    if ($nget("content_opt_" + k + "_" + selectedOptions[i])[0] != undefined) {
                        $nget("content_opt_" + k + "_" + selectedOptions[i])[0].onclick();
                        showOptInfo(k, "P", true);
                    }
                }
            }
        } catch (err) {
        }
    }
}
function optionValidCheck_New(prmFocus)
{
    if ($get("inventory_yn").value == "Y") {
        var inventory_cnt = $nget("inventory_value").length;
        for (var j = 0; j < inventory_cnt; j++) {
            if ($nget("inventory_value")[j].value == "") {
                if (prmFocus) {
                    if ($("#inventory_outer_" + j) != undefined) {
                        $("#inventory_outer_" + j).addClass("AreaSelected");
                    }
                }
                return false;
            }
        }
    }
    var sel_count = 0;
    if ($nget("sel_no") != null) {
        sel_count = $nget("sel_no").length;
        for (var i = 0; i < sel_count; i++) {
            if ($nget("sel_no")[i].value == "") {
                if (prmFocus) {
                    $("#opt_outer_" + i).addClass("AreaSelected");
                }
                return false;
            }
        }
    }
    if ($nget("sel_valueT") != null) {
        var request_info = "";
        var sel_count = $nget("sel_valueT").length;
        for (var i = 0; i < sel_count; i++) {
            $nget("sel_valueT")[i].value = $nget("sel_valueT")[i].value.replace(/,/g, " ");
            if ($nget("sel_valueT")[i].value == "") {
                if (prmFocus) {
                    $nget("sel_valueT")[i].focus();
                }
                return false;
            }
        }
    }
    return true;
}
function orderValidCheck()
{
    var sell_price = $get("sell_price").value;
    var groupbuy_no = $get("groupbuy_no").value;
    if (groupbuy_no == "0") {
        if (sell_price == 0) {
            return false;
        }
    }
    if (!Util.isNumber($get("order_cnt").value) || parseInt($get("order_cnt").value) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("order_cnt").value = 1;
        return false;
    }
    return true;
}
function groupBuyOrderValidCheck()
{
    if (!Util.isNumber($get("order_cnt").value) || parseInt($get("order_cnt").value) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("order_cnt").value = 1;
        return false;
    }
    return true;
}
function group_buy_order_btn_onClick(groupbuy_no, goodscode)
{
    if (Public.isLogin()) {
        if (!CheckOrderPossibleCnt()) {
            return;
        }
        if ($("#is_medicine_for_chk").val() == "Y" && $("#medi_chk").is(":checked") === false) {
            alert(MultiLang.findResource("Medi_CheckAlert"));
            return;
        }
        var param = new RMSParam();
        param.add("goodscode", goodscode);
        param.add("groupbuy_no", groupbuy_no);
        param.add("order_cnt", GetSelectOptionListQty());
        param.add("global_order_type", $get("global_order_type").value);
        RMSHelper.asyncCallWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "CheckGroupBuyOrdeInfo", param.toJson(), function (ret) {
            if (ret != null) {
                if (ret.ret_code == 0) {
                    if ($get("hid_OnlyGroupBuy").value == "true") {
                        if (!groupBuyOrderValidCheck()) {
                            return;
                        }
                        if (!CheckSelectOptionList()) {
                            return;
                        }
                        if (!SetSelectOptionListForOrder())
                            return;
                    } else {
                        if (!CheckSelectOptionList()) {
                            return;
                        }
                        if (!SetSelectOptionListForOrder())
                            return;
                    }
                    var alert_msg = "";
                    if (ret.cancel_yn == "Y") {
                        alert_msg = MultiLang.findResource("groupbuy_confirm_alert_2");
                    }
                    if (ret.achieve_yn == "A" && ret.uc_sell_yn != "Y") {
                        alert_msg = MultiLang.findResource("groupbuy_confirm_alert_1").replace("{0}", ret.sell_min_qty) + alert_msg;
                    } else if (ret.achieve_yn == "Y" || ret.uc_sell_yn == "Y") {
                        alert_msg = MultiLang.findResource("groupbuy_confirm_alert_3") + alert_msg;
                    }
                    if (GMKT.ServiceInfo.nation == "ID" && Base64.decode(Util.getCookie('jaehu_id')) != "") {
                        var param = new RMSParam();
                        param.add("jaehuid", Base64.decode(Util.getCookie('jaehu_id')));
                        var a_company_code = RMSHelper.callWebMethod(Public.getServiceUrl("swe_MyAjaxService.asmx"), "GetAffiliateCompanyCode", param.toJson());
                        if (a_company_code == "100000195") {
                            var goods_sell_price = 0;
                            var param = new RMSParam();
                            param.add("gd_no", goodscode);
                            var r_gdinfo = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsSimpleInfo", param.toJson());
                            if (r_gdinfo != null) {
                                goods_sell_price = r_gdinfo.sell_price;
                            }
                            WiseBird.AddToCart(goodscode, goods_sell_price);
                        }
                    }
                    if (ret.achieve_yn != "Y" && ret.uc_sell_yn != "Y") {
                        if (confirm(alert_msg)) {
                            if ($get("gd_type").value == "CI" && $get("gd_sub_type").value == "TU") {
                                Util.openPopup(Public.convertNormalUrl("~/My/Topup/OnlineTopup.aspx?gd_no=" + $("#gd_no").val() + "&order_way_kind=GBO"), 460, 725);
                                return;
                            }
                            if ($get("global_order_type").value == "G" && !($get("hid_global_link_yn").value == "Y" && Public.isLogin()))
                                Util.globalMemberForward(String.format("group_buy_order_submit('{0}', '{1}')", ret.achieve_yn, ret.uc_sell_yn));
                            else
                                group_buy_order_submit(ret.achieve_yn, ret.uc_sell_yn);
                        }
                    } else {
                        if ($get("gd_type").value == "CI" && $get("gd_sub_type").value == "TU") {
                            Util.openPopup(Public.convertNormalUrl("~/My/Topup/OnlineTopup.aspx?gd_no=" + $("#gd_no").val() + "&order_way_kind=GBO"), 460, 725);
                            return;
                        }
                        if ($get("global_order_type").value == "G" && !($get("hid_global_link_yn").value == "Y" && Public.isLogin()))
                            Util.globalMemberForward(String.format("group_buy_order_submit('{0}', '{1}')", ret.achieve_yn, ret.uc_sell_yn));
                        else
                            group_buy_order_submit(ret.achieve_yn, ret.uc_sell_yn);
                    }
                    return;
                } else if (ret.ret_code == -1) {
                    alert(MultiLang.findResource("groupbuy_alert_1"));
                    return;
                } else if (ret.ret_code == -2) {
                    alert(MultiLang.findResource("groupbuy_alert_2").replace("{0}", ret.custom_contr_amt));
                    return;
                }
            }
        });
    } else {
        Util.openInnerPopup(Public.convertNormalUrl("~/Login/PopupLogin.aspx") + "?ReturnUrl=excute:Util.InnerPopupCloseAfterLogin();", 430, 450);
    }
}
group_buy_order_submit = function (achieve_yn_yn, uc_sell_yn) {
    if (achieve_yn_yn == "Y" || uc_sell_yn == "Y")
        $get("order_way_kind").value = "PAK";
    else
        $get("order_way_kind").value = "GBO";
    $get("trad_way").value = "T4"
    $get("goodsForm").action = Public.getWWWServerUrl("/Order/InsertCart.aspx", false);
    $get("goodsForm").submit();
}
function direct_order_btn_onClick()
{
    if (!CheckOrderPossibleCnt()) {
        return;
    }
    if ($get("gd_type").value == "TI" && $get("lock_no").value == "") {
        alert(MultiLang.findResource("ALERT_MSG20"));
        return;
    }
    if ($get("gc_benefit_type").value != "") {
        if (!Public.isLogin() || __PAGE_VALUE.MEMBER_KIND == "N") {
            Util.openInnerPopup(Public.convertNormalUrl("~/Login/PopupLogin.aspx") + "?ReturnUrl=excute:Util.InnerPopupCloseAfterLogin();", 430, 450);
            return;
        }
    }
    if ($get("gd_type").value == "CI" && $get("gd_sub_type").value == "TU") {
        var tu_cost_basis_no = $("#cost_basis_no").val();
        Util.openPopup(Public.convertNormalUrl("~/My/Topup/OnlineTopup.aspx?gd_no=" + $("#gd_no").val() + "&cost_basis_no=" + tu_cost_basis_no), 365, 580);
        return;
    }
    if (!CheckSelectOptionList()) {
        return;
    }
    if (!SetSelectOptionListForOrder()) {
        return;
    }
    if (!ChkLimitQtySetting()) {
        return;
    }
    if (!QPrice.chkFinalStep()) {
        return;
    }
    $get("order_cnt").disabled = false;
    $get("order_way_kind").value = "IMM";
    if ($get("ex_type").value == "C2C") {
        $get("order_way_kind").value = "PAK";
    }
    if ($get("global_order_type").value == "G" && !($get("hid_global_link_yn").value == "Y" && Public.isLogin())) {
        Util.globalMemberForward("direct_order_submit");
    } else {
        direct_order_submit();
    }
}
function direct_order_submit()
{
    $get("goodsForm").action = Public.getWWWServerUrl("/Order/InsertCart.aspx", false);
    $get("goodsForm").submit();
}
function cart_order_btn_onClick()
{
    if (!CheckOrderPossibleCnt()) {
        return;
    }
    if ($get("gc_benefit_type").value != "") {
        if (!Public.isLogin() || __PAGE_VALUE.MEMBER_KIND == "N") {
            Util.openInnerPopup(Public.convertNormalUrl("~/Login/PopupLogin.aspx") + "?ReturnUrl=excute:Util.InnerPopupCloseAfterLogin();", 430, 450);
            return;
        }
    }
    if (!CheckSelectOptionList()) {
        return;
    }
    if (!SetSelectOptionListForOrder()) {
        return;
    }
    if (!ChkLimitQtySetting()) {
        return;
    }
    if (!QPrice.chkFinalStep()) {
        return;
    }
    if (!QD_MQ.CheckCondition()) {
        return;
    }
    if (!QD_LF.CheckCondition()) {
        return;
    }
    if ($("#is_medicine_for_chk").val() == "Y" && $("#medi_chk").is(":checked") === false) {
        alert(MultiLang.findResource("Medi_CheckAlert"));
        return;
    }
    $get("order_cnt").disabled = false;
    AddCartRelationGoods();
    $get("order_way_kind").value = "PAK";
    var tmpNo = $get("gd_no").value;
    var tmpQty = $get("order_cnt").value;
    var tmpInvenNo = $get("inventory_seq_no").value;
    var tmpOptionNo = selectOptionNoList;
    var tmpTextOptionNo = selectTxtOptionNoList;
    var tmpTextOptionValue = selectTxtOptionValueList;
    var tmpCostBasisNo = $get("cost_basis_no").value;
    var tmpCartCouponYN = $get("cart_coupon_yn").value;
    var tmpCartCouponNo = $get("cart_coupon_no").value;
    var tmpCartCostBasisNo = $get("cart_cost_basis_no").value;
    var tmpMultiInventoryYN = $get("inventory_yn").value;
    var tmpMultiInventorySeqno = $get("multi_inventory_seq_no").value;
    var tmpGlobalOrderType = $get("global_order_type").value;
    var tmpCouponNo = $get("coupon_no").value;
    var tmpDeliveryOptionNo = ($(':radio[name="delivery_option_no"]') != null && $(':radio[name="delivery_option_no"]').length > 0 ? $(':radio[name="delivery_option_no"]:checked').val() : null);
    var warranty_ref_gd_no = $get("extend_warranty_gd_no").value;
    var tmpAddtmpOpt = null;
    if (warranty_ref_gd_no.trim() != "" && $("#extend_txt_opt_value").val() != "" && $("#extend_sel_no").val() != "") {
        tmpAddtmpOpt = new Array();
        var AddItemOpt = {};
        AddItemOpt.add_text_option_value = $("#extend_txt_opt_value").val();
        AddItemOpt.add_sel_nos = $("#extend_sel_no").val();
        tmpAddtmpOpt[0] = AddItemOpt;
    }
    var quick_delivery_slot = "";
    var quick_delivery_avail = "";
    if ($(':radio[name="delivery_option_no"]:checked').length > 0) {
        quick_delivery_slot = $(':radio[name="delivery_option_no"]:checked').attr("quick_delivery_slot");
        quick_delivery_avail = $("#quick_" + tmpDeliveryOptionNo).attr("data-is_avail");
    } else {
        quick_delivery_slot = $('p[name="delivery_option_no"]').attr("quick_delivery_slot");
        quick_delivery_avail = $("span[id^='quick_']").attr("data-is_avail");
    }
    quick_delivery_slot = (quick_delivery_slot == undefined || quick_delivery_slot == "") ? null : quick_delivery_slot;
    if (quick_delivery_avail != "True") {
        quick_delivery_slot = null;
    }
    if ($("#css_mode").val() != "preview") {
        if ($get("quickInfo") == undefined || __PAGE_VALUE.VIEW_SITEID == "QSTORE") {
            $get("goodsForm").action = Public.getWWWServerUrl("/Order/InsertCart.aspx", false);
            $get("goodsForm").submit();
            return;
        }
        parent.Util.CloseSmartWindow();
        var result = parent.Util.AddToCart2(tmpNo, tmpQty, 0, tmpInvenNo, tmpOptionNo, tmpTextOptionNo, tmpTextOptionValue, "", "", "", tmpGlobalOrderType, tmpCostBasisNo, null, "Y", tmpCouponNo, tmpCartCouponYN, tmpCartCouponNo, tmpCartCostBasisNo, tmpMultiInventoryYN, tmpMultiInventorySeqno, tmpDeliveryOptionNo, tmpMultiItems, warranty_ref_gd_no, tmpAddtmpOpt, quick_delivery_slot);
        if (result.ResultCode == 0) {
            clearCartOrder();
        }
    } else {
        parent.Util.CloseSmartWindow();
        var result = parent.Util.AddToCart2(tmpNo, tmpQty, 0, tmpInvenNo, tmpOptionNo, tmpTextOptionNo, tmpTextOptionValue, "", "", "", tmpGlobalOrderType, tmpCostBasisNo, null, "Y", tmpCouponNo, tmpCartCouponYN, tmpCartCouponNo, tmpCartCostBasisNo, tmpMultiInventoryYN, tmpMultiInventorySeqno, tmpDeliveryOptionNo, tmpMultiItems, warranty_ref_gd_no, tmpAddtmpOpt, quick_delivery_slot);
        if (result.ResultCode == 0) {
            clearCartOrder();
        }
        if ($("#callback_fun").val() != null && $("#callback_fun").val() != "") {
            eval("parent." + $("#callback_fun").val())(result);
        }
    }
}
function clearCartOrder() {
    tmpMultiItems = null;
    for (var i = 0; i < selectOptionCnt; i++) {
        if ($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + i + "']") != null) {
            DelSelectOptionList(i);
        }
    }
    ClearSelectOptionControl();
    if ($get("coupon_no") != null && $get("coupon_no").value != "" && $get("coupon_no").value != "etc") {
        cancelCoupon($("#gd_no").val());
    }
}
function plusOrderCnt()
{
    if (!checkOrderCnt(false))
        return;
    var order_cnt = $get("order_cnt").value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("order_cnt").value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    i_order_cnt = +i_order_cnt + 1;
    if (i_order_cnt > 999) {
        alert(MultiLang.findResource("alert_msg_5"));
        return;
    }
    $get("order_cnt").value = i_order_cnt.toString();
    Bargain.DisplayBtn();
}
function minusOrderCnt()
{
    if (!checkOrderCnt(false))
        return;
    var order_cnt = $get("order_cnt").value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("order_cnt").value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    if (i_order_cnt == 1) {
        alert(MultiLang.findResource("alert_msg_6"));
        return;
    }
    i_order_cnt = +i_order_cnt - 1;
    $get("order_cnt").value = i_order_cnt.toString();
    Bargain.DisplayBtn();
}
function addMultiOrder()
{
    var opt_count = 0;
    var innerHTMLText = "";
    var multi_count = $get("multiOptCount").value;
    var real_multi_count = 1;
    if (isNaN(multi_count)) {
        alert(MultiLang.findResource("alert_msg_7"));
        return;
    }
    real_multi_count = parseInt(multi_count);
    if (multi_count != null) {
        if (real_multi_count >= 10) {
            alert(MultiLang.findResource("alert_msg_8"));
            return;
        }
        real_multi_count += 1;
        $get("multiOptCount").value = real_multi_count;
        $get("multi_item_" + real_multi_count).style.display = "";
        if ($get("inventory_yn").value == "Y") {
            target_name = "multi_inventory_seqno_";
        } else {
            target_name = "multi_sel_no_";
        }
        $nget(target_name + real_multi_count)[0].focus();
    }
}
function minusMultiOrder()
{
    var multi_count = $get("multiOptCount").value;
    var real_multi_count = 1;
    if (isNaN(multi_count)) {
        alert(MultiLang.findResource("alert_msg_7"));
        return;
    }
    real_multi_count = parseInt(multi_count);
    var optChecked = false;
    var optCheck = $nget("optCheck");
    if (real_multi_count == 1) {
        alert(MultiLang.findResource("alert_msg_9"));
        return;
    }
    real_multi_count = parseInt(multi_count);
    var target_name = "";
    var target_inventory = "";
    var target_option = "";
    if ($get("inventory_yn").value == "Y") {
        target_name = "multi_inventory_seqno_";
    } else {
        target_name = "multi_sel_no_";
    }
    target_inventory = "multi_inventory_seqno_";
    target_option = "multi_sel_no_";
    var multi_option_count = 0;
    var delete_count = 0;
    multi_inventory_count = $nget(target_inventory + "1").length;
    multi_option_count = $nget(target_option + "1").length;
    $get("multi_item_" + real_multi_count).style.display = "none";
    $get("multiOptCount").value = real_multi_count - 1;
}
function addMultiOrder()
{
    var opt_count = 0;
    var innerHTMLText = "";
    var multi_count = $get("multiOptCount").value;
    var real_multi_count = 1;
    if (isNaN(multi_count)) {
        alert(MultiLang.findResource("alert_msg_7"));
        return;
    }
    real_multi_count = parseInt(multi_count);
    if (multi_count != null) {
        if (real_multi_count >= 10) {
            alert(MultiLang.findResource("alert_msg_8"));
            return;
        }
        real_multi_count += 1;
        $get("multiOptCount").value = real_multi_count;
        $get("multi_item_" + real_multi_count).style.display = "";
        if ($get("inventory_yn").value == "Y") {
            target_name = "multi_inventory_seqno_";
        } else {
            target_name = "multi_sel_no_";
        }
        if ($nget(target_name + real_multi_count)[0] != undefined)
            $nget(target_name + real_multi_count)[0].focus();
        else if ($nget("multi_sel_valueTs_" + real_multi_count)[0] != undefined)
            $nget("multi_sel_valueTs_" + real_multi_count)[0].focus();
    }
}
function deleteMultiOrder()
{
    var multi_count = $get("multiOptCount").value;
    var real_multi_count = 1;
    if (isNaN(multi_count)) {
        alert(MultiLang.findResource("alert_msg_7"));
        return;
    }
    real_multi_count = parseInt(multi_count);
    var optChecked = false;
    var optCheck = $nget("optCheck");
    if (real_multi_count == 1) {
        alert(MultiLang.findResource("alert_msg_9"));
        return;
    }
    for (var i = 0; i < optCheck.length; i++) {
        if (optCheck[i].checked == true) {
            optChecked = true;
            break;
        }
    }
    if (optChecked == false) {
        alert(MultiLang.findResource("alert_msg_10"));
        return;
    }
    real_multi_count = parseInt(multi_count);
    var target_name = "";
    var target_inventory = "";
    var target_option = "";
    if ($get("inventory_yn").value == "Y") {
        target_name = "multi_inventory_seqno_";
    } else {
        target_name = "multi_sel_no_";
    }
    target_inventory = "multi_inventory_seqno_";
    target_option = "multi_sel_no_";
    var multi_option_count = 0;
    var delete_count = 0;
    multi_inventory_count = $nget(target_inventory + "1").length;
    multi_option_count = $nget(target_option + "1").length;
    for (var i = 1; i <= optCheck.length; i++) {
        if (optCheck[i - 1].checked == true) {
            delete_count += 1;
            if (i < 10) {
                for (var j = i; j < 10; j++) {
                    for (var k = 0; k < multi_inventory_count; k++) {
                        if ($nget(target_inventory + j) != null) {
                            $nget(target_inventory + j)[k].value = "";
                            $nget(target_inventory + (j + 1))[k].value = "";
                        }
                    }
                    for (var k = 0; k < multi_option_count; k++) {
                        if ($nget(target_option + j) != null) {
                            $nget(target_option + j)[k].value = $nget(target_option + (j + 1))[k].value;
                            $nget(target_option + (j + 1))[k].value = "";
                        }
                    }
                    $get("multi_order_cnts_" + j).value = $get("multi_order_cnts_" + (j + 1)).value;
                    $get("multi_order_cnts_" + (j + 1)).value = "1";
                }
            } else {
                for (var k = 0; k < multi_inventory_count; k++) {
                    if ($nget(target_inventory + j) != null) {
                        $nget(target_inventory + i)[k].value = "";
                    }
                }
                for (var k = 0; k < multi_option_count; k++) {
                    if ($nget(target_option + j) != null) {
                        $nget(target_option + i)[k].value = "";
                    }
                }
                $get("multi_order_cnts_" + (i)).value = "1";
            }
            optCheck[i - 1].checked = false;
        }
    }
    for (var l = real_multi_count - delete_count + 1; l <= 10; l++) {
        optCheck[l - 1].checked = false;
        $get("multi_item_" + l).style.display = "none";
    }
    $get("multiOptCount").value = real_multi_count - delete_count;
}
function multiOptionValidCheck()
{
    var multiCount = $get("multiOptCount").value
    var target_name = "";
    if ($get("inventory_yn").value == "Y") {
        target_name = "multi_inventory_seqno_";
    } else {
        target_name = "multi_sel_no_";
    }
    if (!multiOptionValidLoop(target_name, multiCount)) {
        return false;
    }
    return true;
}
function multiOptionValidCheck_New()
{
    var multiCount = $get("multiOptCount").value
    var target_name = "";
    if ($get("inventory_yn").value == "Y") {
        target_name = "multi_inventory_seqno_";
        if (!multiOptionValidLoop(target_name, multiCount)) {
            return false;
        }
    }
    target_name = "multi_sel_no_";
    if (!multiOptionValidLoop(target_name, multiCount)) {
        return false;
    }
    return true;
}
function multiOptionValidLoop(target_name, multiCount)
{
    var target_option = "multi_sel_no_";
    var target_request_info = "multi_sel_noT_";
    if (target_option == target_name && ($nget(target_name + "1") == null || $nget(target_name + "1")[0] == null)) {
        if (($nget(target_request_info + "1") == null || $nget(target_request_info + "1")[0] == null)) {
            return true;
        } else {
            for (var i = 1; i <= multiCount; i++) {
                if ($nget("multi_sel_valueT_" + i) != null) {
                    var request_info = "";
                    var sel_count = $nget("multi_sel_valueT_" + i).length;
                    if (sel_count > 0) {
                        for (var j = 0; j < sel_count; j++) {
                            $nget("multi_sel_valueT_" + i)[j].value = $nget("multi_sel_valueT_" + i)[j].value.replace(/,/g, " ");
                            if ($nget("multi_sel_valueT_" + i)[j].value.trim() == "") {
                                alert(MultiLang.findResource("alert_enter_request_info"));
                                $nget("multi_sel_valueT_" + i)[j].focus();
                                return false;
                            } else
                                request_info += $nget("multi_sel_valueT_" + i)[j].value;
                        }
                    }
                }
            }
        }
        return true;
    }
    var multi_option_count = $nget(target_name + "1").length;
    for (var i = 1; i <= multiCount; i++) {
        if (multi_option_count > 1) {
            for (var j = 0; j < multi_option_count; j++) {
                if ($nget(target_name + i)[j].value == "") {
                    $nget(target_name + i)[j].focus();
                    return false;
                }
            }
        } else {
            if ($nget(target_name + i)[0].value == "") {
                $nget(target_name + i)[0].focus();
                return;
            }
        }
        if ($nget("multi_sel_noT_" + i) != null) {
            var request_info = "";
            var sel_count = $nget("multi_sel_valueT_" + i).length;
            if (sel_count > 0) {
                for (var j = 0; j < sel_count; j++) {
                    $nget("multi_sel_valueT_" + i)[j].value = $nget("multi_sel_valueT_" + i)[j].value.replace(/,/g, " ");
                    if ($nget("multi_sel_valueT_" + i)[j].value == "") {
                        alert(MultiLang.findResource("alert_enter_request_info"));
                        $nget("multi_sel_valueT_" + i)[j].focus();
                        return false;
                    } else
                        request_info += $nget("multi_sel_valueT_" + i)[j].value;
                }
            }
        }
    }
    return true;
}
function plusOptOrderCnt(num)
{
    if (num == 1) {
        if (!checkMultiOrderCnt())
            return;
    }
    var order_cnt = $get("multi_order_cnts_" + num).value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("multi_order_cnts_" + num).value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    i_order_cnt = +i_order_cnt + 1;
    if (i_order_cnt > 999) {
        alert(MultiLang.findResource("alert_msg_5"));
        return;
    }
    $get("multi_order_cnts_" + num).value = i_order_cnt.toString();
}
function minusOptOrderCnt(num)
{
    if (num == 1) {
        if (!checkMultiOrderCnt())
            return;
    }
    var order_cnt = $get("multi_order_cnts_" + num).value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("multi_order_cnts_" + num).value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    if (i_order_cnt == 1) {
        alert(MultiLang.findResource("alert_msg_6"));
        return;
    }
    i_order_cnt = +i_order_cnt - 1;
    $get("multi_order_cnts_" + num).value = i_order_cnt.toString();
}
function OrderCnt_onClick(obj) {
    if ($(obj).val() <= 1)
        $(obj).val("");
}
function checkOrderCnt(prmTotalChk, prmDefaultCnt) {
    if (!Util.isNumber($get("order_cnt").value) || parseInt($get("order_cnt").value) <= 0) {
        $get("order_cnt").value = 1;
    }
    Bargain.DisplayBtn();
    if (prmTotalChk) {
        return true;
    } else {
        if ($get("order_cnt").readOnly == true) {
            if ($get("multi_order_yn").value == "Y") {
            } else if ($get("gd_no").value == "401309687") {
            } else {
                alert(MultiLang.findResource("alert_msg_11"));
            }
            return false;
        } else
            return true;
    }
}
function checkMultiOrderCnt()
{
    if ($get("multi_order_cnts_1").readOnly == true) {
        alert(MultiLang.findResource("alert_msg_11"));
        return false;
    } else
        return true;
}
var multi_inventory_option_Arr = new Array(10);
function Set_OptInven_SelectBox(prmSel, tmpText, tmpValue, tmpOrgValue, tmpSubText, tmpPrice, tmpQty, tmpInventoryYN, tmpPriceOC)
{
    var op1 = document.createElement('option');
    op1.text = tmpText;
    op1.value = tmpValue;
    if (tmpQty <= 0 && tmpInventoryYN == "N") {
        $(op1).attr("class", "soldout");
    }
    $(op1).attr("org_value", tmpOrgValue);
    $(op1).attr("sub_text", tmpSubText);
    $(op1).attr("sub_price", tmpPrice);
    $(op1).attr("sub_price_oc", tmpPriceOC);
    $(op1).attr("sub_qty", tmpQty);
    try {
        prmSel.add(op1, null);
    } catch (ex) {
        prmSel.add(op1);
    }
}
function CheckSelectedOption_direct()
{
    $get("ProcessBtn_direct").focus();
    if (!CheckSelectOptionList()) {
        $("#ProcessBtn_direct").removeClass("btn");
        $("#ProcessBtn_direct").addClass("btn no_opt");
        $get("layer_noOptMsg_direct").style.display = "block";
    }
}
function CheckSelectedOption_cart()
{
    $get("ProcessBtn_cart").focus();
    if (!CheckSelectOptionList()) {
        $("#ProcessBtn_cart").removeClass("btn");
        $("#ProcessBtn_cart").addClass("btn no_opt");
        $get("layer_noOptMsg_cart").style.display = "block";
    }
}
function SubCheckSelectedOption_cart() {
    $get("sub_ProcessBtn_cart").focus();
    if (!CheckSelectOptionList()) {
        $("#sub_ProcessBtn_cart").removeClass("btn");
        $("#sub_ProcessBtn_cart").addClass("btn no_opt");
    }
}
function CheckSelectedOption_group()
{
    if ($get("hid_OnlyGroupBuy").value == "false") {
        $get("ProcessBtn_group").focus();
    }
    if (!CheckSelectOptionList()) {
        $("#ProcessBtn_group").removeClass("btn");
        $("#ProcessBtn_group").addClass("btn no_opt");
        $get("layer_noOptMsg_group").style.display = "block";
    }
}
function BtnOut_direct()
{
    $("#ProcessBtn_direct").removeClass("btn no_opt");
    $("#ProcessBtn_direct").addClass("btn");
    $get("layer_noOptMsg_direct").style.display = "none";
}
function BtnOut_cart()
{
    $("#ProcessBtn_cart").removeClass("btn no_opt");
    $("#ProcessBtn_cart").addClass("btn");
    $get("layer_noOptMsg_cart").style.display = "none";
}
function SubBtnOut_cart() {
    $("#sub_ProcessBtn_cart").removeClass("btn no_opt");
    $("#sub_ProcessBtn_cart").addClass("btn");
}
function BtnOut_group()
{
    $("#ProcessBtn_group").removeClass("btn no_opt");
    $("#ProcessBtn_group").addClass("btn");
    $get("layer_noOptMsg_group").style.display = "none";
}
function CheckSelectedMultiOption_Complete()
{
    if (multiOptionValidCheck_New() != true) {
        $("#processArea").removeClass("g_processArea");
        $("#processArea").addClass("g_processArea no_opt");
        $get("layer_noOptMsg_Multi").style.display = "block";
    }
}
function BtnOut_Multi()
{
    $("#processArea").removeClass("g_processArea no_opt");
    $("#processArea").addClass("g_processArea");
    $get("layer_noOptMsg_Multi").style.display = "none";
}
function applyCartDiscountInfo(cost_basis_no, coupon_no, order_cnt, cost_unit, cost_result)
{
    $get("cart_cost_basis_no").value = cost_basis_no;
    $get("cart_coupon_no").value = coupon_no;
    $get("cart_coupon_yn").value = "Y";
    if ($get("order_cnt").readOnly != true)
        $get("order_cnt").value = order_cnt;
    if (cost_basis_no.length > 0 && cost_basis_no != 0) {
        if (cost_unit.trim() == "M")
            $("#sp_cart_coupon").text(PriceUtil.FormatCurrencyCode(cost_result, $get("target_currency").value));
        else if (cost_unit.trim() == "R")
            $("#sp_cart_coupon").text(cost_result + "%");
        else if (cost_unit.trim() == "V")
            $("#sp_cart_coupon").text(MultiLang.findResource("DeliveryCartCouponTxt"));
        $("#li_Cart_Cp").css("display", "block");
    } else {
        $("#li_Cart_Cp").css("display", "none");
    }
}
var isApplyCoupon = false;
var goods_discount_price = 0;
var coupon_discount_price = 0;
function applayDiscountInfo(gd_no, order_cnt, cost_basis_no, coupon_no, isOnlyGoods, cost_price, order_cnt, g_cost_price, c_cost_price, call_back_basis_type)
{
    var tmpCnt = $get("order_cnt").value;
    var goods_gd_no = $get("gd_no").value;
    if (gd_no != goods_gd_no)
        return;
    if (cost_basis_no == null || cost_basis_no.trim() == "") {
        cost_basis_no = '0';
    }
    var target_currency = $get("target_currency").value;
    $get("cost_basis_no").value = cost_basis_no;
    $get("coupon_no").value = coupon_no;
    $get("order_cnt").value = "" + order_cnt;
    $get("cost_basis_type").value = "";
    goods_discount_price = 0;
    coupon_discount_price = 0;
    if (parseFloat(c_cost_price) == 0) {
        if ($get("btn_goMyCoupon") != null) {
            $get("btn_goMyCoupon").style.display = "";
        }
        if ($get("btn_goMyCouponChange") != null) {
            $get("btn_goMyCouponChange").style.display = "none";
        }
    } else {
        if ($get("btn_goMyCoupon") != null) {
            $get("btn_goMyCoupon").style.display = "none";
        }
        if ($get("btn_goMyCouponChange") != null) {
            $get("btn_goMyCouponChange").style.display = "";
        }
    }
    if (isSltOptCoupon && selectOptListIdx >= 0) {
        goods_discount_price = parseFloat(g_cost_price);
        coupon_discount_price = parseFloat(c_cost_price);
        if ($("input[option_code='EX']:radio").length != 0) {
            var arr_cost_basis_no = cost_basis_no.split("");
            for (var i = 0; i < arr_cost_basis_no.length; i++) {
                var basis_no = arr_cost_basis_no[i];
                if (basis_no.trim() == "") {
                    continue;
                }
                var param = new RMSParam();
                param.add("cost_basis_no", basis_no);
                var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetCostBasisInfo", param.toJson());
                if (ret != null) {
                    if (isOnlyGoods) {
                        ApplyDiscountBtn_Click(ret.cost_basis_no, ret.basis_type, "");
                    }
                }
            }
        }
        SetCouponForOptList(isOnlyGoods, false);
    } else {
        if (!checkOrderCnt(true, tmpCnt))
            return;
        if (!isOnlyGoods) {
            goods_discount_price = parseFloat(g_cost_price);
            coupon_discount_price = parseFloat(c_cost_price);
            $get("order_cnt").readOnly = true;
            $get("order_cnt").disabled = true;
        }
        var tmpUnitGoodsDiscount = 0;
        var tmpUnitCouponDiscount = 0;
        var tmpTotalDiscount = 0;
        if (order_cnt > 1) {
            if (parseFloat(g_cost_price) > 0) {
                tmpUnitGoodsDiscount = parseFloat(PriceUtil.PriceCuttingCode((parseFloat(g_cost_price) / parseFloat(order_cnt)), target_currency));
            }
            if (parseFloat(c_cost_price) > 0) {
                tmpUnitCouponDiscount = parseFloat(PriceUtil.PriceCuttingCode((parseFloat(c_cost_price) / parseFloat(order_cnt)), target_currency));
            }
        } else {
            tmpUnitGoodsDiscount = parseFloat(g_cost_price);
            tmpUnitCouponDiscount = parseFloat(c_cost_price);
        }
        tmpTotalDiscount = tmpUnitGoodsDiscount + tmpUnitCouponDiscount;
        var discount_price = parseFloat($get("sell_price").value) - tmpTotalDiscount;
        var available_basis_type = $get("goods_dc_cost_basis_type").value;
        if (c_cost_price > 0 && call_back_basis_type == "") {
            available_basis_type = "";
        } else if (c_cost_price == 0 && call_back_basis_type == "") {
            available_basis_type = "GD";
        }
        $sget("discount_info").innerHTML = getPersonalDiscountInfo(PriceUtil.FormatCurrencyCode(discount_price, target_currency), order_cnt, available_basis_type, tmpUnitGoodsDiscount, tmpUnitCouponDiscount);
        if ($("input[option_code='EX']:radio").length != 0) {
            var arr_cost_basis_no = cost_basis_no.split("");
            for (var i = 0; i < arr_cost_basis_no.length; i++) {
                var basis_no = arr_cost_basis_no[i];
                if (basis_no.trim() == "") {
                    continue;
                }
                var param = new RMSParam();
                param.add("cost_basis_no", basis_no);
                var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetCostBasisInfo", param.toJson());
                if (ret != null) {
                    if (ret.basis_type == "EX") {
                        $("input[option_code='EX']:radio").prop("checked", true);
                        $get("cost_basis_type").value = "EX";
                    }
                    if (isOnlyGoods) {
                        ApplyDiscountBtn_Click(ret.cost_basis_no, ret.basis_type, "");
                    }
                }
            }
        }
        if (!isOnlyGoods) {
            isApplyCoupon = true;
        } else {
            isApplyCoupon = false;
        }
    }
    $("dl[id='dl_SelectOptionList_Sub']").html($("dl[id='dl_SelectOptionList']").html());
}
function applyEtcCoupon(gd_no, sid, jaehuid, dealer_cust_no, order_cnt)
{
    var target_currency = $get("target_currency").value;
    var param = new RMSParam();
    param.add("goodscode", gd_no);
    param.add("sid", sid);
    param.add("jaehuid", "");
    param.add("seller_cust_no", "");
    param.add("basis_type_limit", "Y");
    param.add("global_order_type", $get("global_order_type").value);
    var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsEtcDiscountInfo_BasisTypeLimit", param.toJson());
    var cost_basis_no = "0";
    if (ret != null) {
        var cost_result = ret.cost_result;
        var sell_price = ret.sell_price;
        var cost_unit = ret.cost_unit.trim();
        var cost_basis_kind = ret.cost_basis_kind;
        cost_basis_no = ret.cost_basis_no;
        var cost_price = ret.cost_price;
        var cost_price_text = "";
        var discount_price = 0;
        var discount_result = 0;
        if (cost_price > 0) {
            discount_result = PriceUtil.PriceCuttingCode(cost_price);
            discount_price = sell_price - PriceUtil.PriceCuttingCode(cost_price, target_currency);
            $("input[id='order_cnt']").val("" + order_cnt);
            $("select[id='order_cnt']").find("option").eq(0).attr("selected", true);
            if ($sget("discount_info") != null) {
                $sget("discount_info").innerHTML = getDiscountInfo(PriceUtil.FormatCurrencyCode(discount_price, target_currency), cost_basis_kind, cost_price_text, discount_price);
            }
        } else {
            if ($sget("discount_info") != null) {
                $sget("discount_info").innerHTML = "";
            }
        }
    } else {
        if ($sget("discount_info") != null) {
            $sget("discount_info").innerHTML = "";
        }
    }
    var cost_basis_no_s = cost_basis_no;
    var basic_cost_basis_no = $("#basic_cost_basis_no").val();
    if (basic_cost_basis_no > 0 && basic_cost_basis_no != cost_basis_no) {
        cost_basis_no_s = basic_cost_basis_no + "" + cost_basis_no;
    }
    $get("cost_basis_no").value = cost_basis_no_s;
    $get("coupon_no").value = "";
    $get("dealer_cost_basis_no").value = "";
}
function getAddtionalDiscountInfo(cost_price, gd_no, kind, cost_price_text)
{
    var discountText = "";
    discountText = discountText + "<div class=\"ls_dc\">\r\n <ul>";
    discountText = discountText + "<li><em>âˆ™ " + MultiLang.findResource("My Coupon Used") + "</em>\r\n";
    if (kind == "P")
        discountText = discountText + cost_price + " " + MultiLang.findResource("off") + " " + cost_price_text + " <a href=\"javascript:cancelCoupon('" + gd_no + "');\" class=\"bt bt17_20 gray\"><span>" + MultiLang.findResource("CancelDiscount") + "</span></a>" + " </li>\r\n";
    else
        discountText = discountText + cost_price + " " + MultiLang.findResource("off") + " " + cost_price_text + " </li>\r\n";
    discountText = discountText + "</div>";
    return discountText;
}
function getAddtionalDiscountInfo2(g_cost_price, c_cost_price, gd_no, order_cnt)
{
    var discountText = "";
    if ((g_cost_price > 0) || (c_cost_price > 0)) {
        var target_currency = $get("target_currency").value;
        discountText = discountText + "<div class=\"ls_dc\">\r\n <ul>";
        if (g_cost_price > 0) {
            discountText = discountText + "<li><em>âˆ™ " + MultiLang.findResource("ItemDiscount") + "</em>\r\n";
            discountText = discountText + PriceUtil.FormatCurrencyCode(g_cost_price, target_currency) + " " + MultiLang.findResource("off") + "</li>\r\n";
        }
        if (c_cost_price > 0) {
            var tmpCntText = "";
            if (order_cnt > 1) {
                tmpCntText = " (x " + order_cnt + ")";
            }
            discountText = discountText + "<li><em>âˆ™ " + MultiLang.findResource("My Coupon Used") + "</em>\r\n";
            discountText = discountText + PriceUtil.FormatCurrencyCode(c_cost_price, target_currency) + " " + MultiLang.findResource("off") + tmpCntText + " <a href=\"javascript:cancelCoupon('" + gd_no + "');\" class=\"bt bt17_20 gray\"><span>" + MultiLang.findResource("CancelDiscount") + "</span></a>" + " </li>\r\n";
        }
        discountText = discountText + "</div>";
    }
    return discountText;
}
function getAddtionalEtcDiscountInfo(cost_price, gd_no, kind, cost_price_text)
{
    var discountText = "";
    discountText = discountText + "<div class=\"ls_dc\">\r\n <ul>";
    discountText = discountText + "<li><em>âˆ™ " + MultiLang.findResource("ItemDiscount") + "</em>\r\n";
    if (kind == "P")
        discountText = discountText + cost_price + " " + MultiLang.findResource("off") + " " + cost_price_text + " <a href=\"javascript:cancelCoupon('" + gd_no + "');\" class=\"bt bt17_20 gray\"><span>" + MultiLang.findResource("CancelDiscount") + "</span></a>" + "</li>\r\n";
    else
        discountText = discountText + cost_price + " " + MultiLang.findResource("off") + " " + cost_price_text + "</li>\r\n";
    discountText = discountText + "</div>";
    return discountText;
}
function getDiscountInfo(cost_price_text, kind, cost_price_extra_text, cost_price)
{
    var discountText = "";
    discountText = "<dl class=\"detailsArea q_dcprice\">";
    discountText += "<dt><div class=\"layerWrap\" style=\"z-index:31;\"><strong>" + getDiscountedTypeText(kind) + "</strong>";
    discountText += "";
    discountText += "</div></dt><dd>";
    discountText += "<strong data-price=\"" + cost_price + "\">" + cost_price_text + "</strong>" + cost_price_extra_text;
    discountText += "</dd>";
    discountText += "</dl>";
    return discountText;
}
function getPersonalDiscountInfo(cost_price, order_cnt, kind, g_cost_price, c_cost_price)
{
    var discountText = "";
    var target_currency = $get("target_currency").value;
    var tmpMsg = "";
    if (Util.isNumber(c_cost_price) && parseFloat(c_cost_price) != 0) {
        tmpMsg = "(" + MultiLang.findResource("My Coupon Used") + ":" + PriceUtil.FormatCurrencyCode(c_cost_price, target_currency) + ")";
    }
    discountText = getDiscountInfo(cost_price, kind, tmpMsg, c_cost_price);
    return discountText;
}
function clearCoupon() {
    $get("plural_key").value = "";
    $get("cost_basis_no").value = "0";
    $get("coupon_no").value = "";
    $get("dealer_cost_basis_no").value = "";
    $get("cost_basis_type").value = "";
}
function cancelCoupon(gd_no) {
    clearCoupon();
    if ($sget("discount_info") != null) {
        $sget("discount_info").innerHTML = "";
    }
    $get("order_cnt").readOnly = false;
    $get("order_cnt").disabled = false;
    goods_discount_price = 0;
    coupon_discount_price = 0;
    if ($get("goods_cost_yn").value == "Y")
        applyEtcCoupon(gd_no, 0, "", "", 1);
    if ($get("btn_goMyCoupon") != null) {
        $get("btn_goMyCoupon").style.display = "";
    }
    if ($get("btn_goMyCouponChange") != null) {
        $get("btn_goMyCouponChange").style.display = "none";
    }
    isApplyCoupon = false;
    $("dl[id='dl_SelectOptionList_Sub']").html($("dl[id='dl_SelectOptionList']").html());
}
function cancelCartCoupon()
{
    $("#sp_cart_coupon").text("");
    $("#li_Cart_Cp").css("display", "none");
    $get("cart_cost_basis_no").value = "";
    $get("cart_coupon_no").value = "";
}
var isSltOptCoupon = false;
function goMyCoupon() {
    if ($get("global_order_type").value == "G" && ($get("hid_global_link_yn").value == "N" || false == Public.isLogin())) {
        Util.globalMemberForward("goGlobalMyCoupon");
        return;
    }
    isSltOptCoupon = false;
    OpenMyCoupon();
}
function goGlobalMyCoupon() {
    isSltOptCoupon = false;
    OpenMyCoupon();
}
function OpenMyCoupon(selected_basis_no) {
    Util.closeInnerPopup();
    var available_coupon_box = $("#available_coupon_box").val();
    var tmpCostBaType;
    if (isSltOptCoupon && selectOptListIdx >= 0) {
        tmpCostBaType = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptListIdx + "']").attr("cost_basis_type");
    } else {
        tmpCostBaType = $get("goods_dc_cost_basis_type").value;
    }
    if ((tmpCostBaType != undefined && tmpCostBaType != null && tmpCostBaType != "" && tmpCostBaType != "GD") || available_coupon_box == "N" || PageVariable.jaehu_discount_yn == "Y") {
        alert(MultiLang.findResource("UnavailableCoupon"));
        return;
    }
    var tmpCpNo = "";
    var tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
    var tmpControlLength = tmpControl.length;
    var tmpMulti_inventory_seq_no = "";
    for (var i = 0; i < tmpControlLength; i++) {
        if (tmpCpNo == "") {
            tmpCpNo += $(tmpControl[i]).attr("coupon_no");
        } else {
            tmpCpNo += "_%%_" + $(tmpControl[i]).attr("coupon_no");
        }
    }
    if (tmpCpNo != "") {
        tmpCpNo = encodeURIComponent(tmpCpNo);
    }
    var goodscode = $get("gd_no").value;
    var url = "";
    var global_order_type = $get("global_order_type").value;
    var url_cost_basis_no = $get("goods_dc_cost_basis_no").value;
    if (selected_basis_no != undefined) {
        url_cost_basis_no = selected_basis_no.replace("", "").replace($("#basic_cost_basis_no").val(), "");
    }
    url = Public.convertNormalUrl("~/MyCoupon/MyCouponBoxItem.aspx?goodscode=" + goodscode + "&use_cp_no=" + tmpCpNo + "&global_order_type=" + global_order_type);
    if (Public.isLogin()) {
        Util.openInnerPopup(url, 710, 420, null, null, null, "no", null, null, null, false);
    } else {
        if (parent == window) {
            Util.openInnerPopup(url, 420, 480, null, null, null, "no");
        } else {
            Util.openInnerPopup(url, 420, 480, null, null, 50, "no");
        }
    }
}
function Check_postpay()
{
    var chakbul_prepay_yn = $get("chakbul_prepay_yn").value;
    var goodscode = $get("gd_no").value;
    if (isApplyCoupon == true && chakbul_prepay_yn == "N") {
        alert(MultiLang.findResource("alert_chackbul_coupon"));
        SetDiscountLayerDisplay(false);
        cancelCoupon(goodscode);
        SetDiscountLayerDisplay(true);
    }
}
function goBookmark()
{
    onFavoriteTitle(location, $('textarea#ta_favorite_nm').val());
}
function goSaveDesktop(img_contents_no)
{
    var title = encodeURI($('textarea#ta_favorite_nm').val());
    var goodscode = $get("gd_no").value;
    Util.openPopup(Public.getWWWServerUrl("/Goods/PopupSaveDesktop.aspx?goodscode=" + goodscode + "&title=" + title + "&img_contents_no=" + img_contents_no), "300", "300", "saveDeskTop");
}
function closeLayerFavorite()
{
    $("#div_save").addClass("disNone");
}
function addWishList(gd_no)
{
    Util.AddToWishList(Public.getCustNo(), 0, gd_no, Public.getLoginId(), function (ret)
    {
        if (ret == 0) {
            if (confirm(MultiLang.findResource("ALERT_MSG12"))) {
                document.location.href = Public.getWWWServerUrl("/My/WishList.aspx", false);
            }
        }
    });
}
var showWingMultiLayer = false;
function hiddenSZLayer()
{
    $get("deliverySzLayer1").style.display = "none";
}
function dispUrl(code)
{
    if ($get("layer_URLcopy").style.display.toString() == "none") {
        $get("CopyURL_nm").innerHTML = MultiLang.findResource("Close1");
        $(".btn_URLlayer").css("text-align", "center");
        $get("layer_URLcopy").style.display = "block";
        $get("goodsUrl").value = Public.getWWWServer() + "/g/" + code;
    } else if ($get("layer_URLcopy").style.display.toString() == "block") {
        $get("CopyURL_nm").innerHTML = MultiLang.findResource("COPY URL 1");
        $(".btn_URLlayer").css("text-align", "left");
        $get("layer_URLcopy").style.display = "none";
        $get("goodsUrl").value = "";
    }
}
function ClipboardUrl()
{
    var isSuccess = Util.GiosisCopyClipboard($('#goodsUrl').val());
    if (isSuccess) {
        alert(MultiLang.findResource("ALERT_MSG18"));
        $('#CopyURL_nm').html(MultiLang.findResource("COPY URL 1"));
        $('#layer_URLcopy').css("display", "none");
        $(".btn_URLlayer").css("text-align", "left");
        $('#goodsUrl').val("");
    } else {
        alert(MultiLang.findResource("ALERT_MSG19"));
    }
}
function fncSzSearch(delivery_group_no, delivery_fee, seller_cust_no)
{
    var sz_url = Public.getWWWServerUrl("/Goods/SearchSZDelivery.aspx?delivery_group_no=" + delivery_group_no + "&delivery_fee=" + delivery_fee + "&seller_cust_no=" + seller_cust_no, false);
    Util.openPopup(sz_url, "620", "530", "SzSearchPop");
}
$(window).scroll(function () {
    try {
        var tmpTop = "";
        if ($get("CustomerReview") != null) {
            tmpTop = $("#CustomerReview").offset().top;
        } else {
            tmpTop = $("#Question_Answer").offset().top;
        }
        var tmpOPT_Top = "";
        if ($get("others") != null) {
            tmpOPT_Top = $("#others").offset().top;
        } else {
            tmpOPT_Top = $("#footer").offset().top;
        }
        if ((document.documentElement.scrollTop + 800 > $("#DetailIteminfo").offset().top && document.documentElement.scrollTop + 1000 < tmpOPT_Top) || (document.body.scrollTop + 800 > $("#DetailIteminfo").offset().top && document.body.scrollTop + 1000 < tmpOPT_Top)) {
            $("#div_SubOptionSelect").removeClass("disNone");
        } else {
            $("#div_SubOptionSelect").addClass("disNone");
        }
        if ((document.documentElement.scrollTop > $("#DetailIteminfo").offset().top && document.documentElement.scrollTop + 1000 < tmpTop) || (document.body.scrollTop > $("#DetailIteminfo").offset().top && document.body.scrollTop + 1000 < tmpTop)) {
            if ($("#MultiOrderLayer").length > 0) {
                $("#MultiOrderLayer").removeClass("disNone");
                $("#SimpleLayer").removeClass("disNone");
                var position = $(window).scrollTop();
                var currentContent = $("#multiOrderBtn").offset().top;
                var currentaddContent = $("#ItemInfoWrap2").offset().top;
                $("#MultiOrderLayer").stop().animate({"top": position - currentContent + 200 + "px"}, 300);
                $("#SimpleLayer").stop().animate({"top": position - currentaddContent + 260 + "px"}, 300);
                if (showWingMultiLayer == false) {
                    $("#MultiOrderLayer").css({"left": "224px", "width": "0", "height": "0"});
                    $("#easyOrder").addClass("disNone");
                    $("#muliOrder").addClass("disNone");
                    $("#muliorder_close").removeClass("disNone");
                    $("#closeMultiOrder").addClass("disNone");
                } else {
                }
            } else {
                $("#SimpleLayer").removeClass("disNone");
                var position = $(window).scrollTop();
                var currentaddContent = $("#ItemInfoWrap2").offset().top;
                $("#SimpleLayer").stop().animate({"top": position - currentaddContent + 260 + "px"}, 100);
            }
        }
        if (document.documentElement.scrollTop > 0) {
            $("#MSP_btn_Move_Top").show();
        } else {
            $("#MSP_btn_Move_Top").hide();
        }
        GoodsNaviTab.init();
        var scrollTop = $(window).scrollTop();
        if (scrollTop < GoodsNaviTab.IteminfoTop) {
            $("#div_cont_navitab.cont_navitab").removeClass("fixed");
            $("#div_cont_navitab ul li").removeClass("selected");
            $("#tab_iteminfo").addClass("selected");
        } else {
            GoodsNaviTab.srollEvent();
        }
        if (show_detail_origin && scrollTop > $("#DetailIteminfo").offset().top && scrollTop < tmpTop - GoodsNaviTab.anchorHeight + 1) {
            $("#GoodsDetailOrigin").addClass("fixed");
        } else {
            $("#GoodsDetailOrigin").removeClass("fixed");
        }
    } catch (e) {
    }
});
function hiddenOverseaInfoLayer()
{
    $("#overseaLayer").addClass("g_disNone");
}
var CntBookMark = 1;
var CurPosBookMark = 1;
var LastPosBookMark = 1;
var arrPosBookMark = new Array(8);
function initBookMarkArray(obj)
{
    for (var i = 0; i < obj.length; i++) {
        obj[i] = 0;
    }
}
initBookMarkArray(arrPosBookMark);
function insertDivBookMark()
{
    if (CntBookMark < 8) {
        LastPosBookMark = getBookMarkArray(arrPosBookMark);
        NowCntBookMark = LastPosBookMark;
        var SetBookMarkTop = parseInt($get("SimpleLayer").style.top);
        var sDuplicateBookMark = 0;
        sDuplicateBookMark = getDulplicateBookMark(SetBookMarkTop);
        if (sDuplicateBookMark) {
            $get("g_markedNum0" + NowCntBookMark).style.top = SetBookMarkTop + 25 + "px";
            moveDivBookMark(LastPosBookMark);
            SetBookMarkTop2 = SetBookMarkTop + 25;
        } else {
            $get("g_markedNum0" + NowCntBookMark).style.top = SetBookMarkTop + "px";
            SetBookMarkTop2 = SetBookMarkTop;
        }
        $get("g_markedNum0" + NowCntBookMark).style.left = $get("SimpleLayer").offsetLeft - 884;
        if (getNumberPx($get("g_markedNum0" + NowCntBookMark).style.left) < -27) {
            $get("g_markedNum0" + NowCntBookMark).style.left = -27 + "px";
        }
        showDivLayer("g_markedNum0" + NowCntBookMark);
        showDivLayer("divRightBookMark" + NowCntBookMark);
        arrPosBookMark[LastPosBookMark] = SetBookMarkTop2;
        CntBookMark++;
    } else {
        alert(MultiLang.findResource("ALERT_MSG15"));
    }
}
function moveToDivBookMark(str)
{
    window.scrollTo(0, getNumberPx($get("g_markedNum0" + str).style.top) + $("#itemGoods").offset().top - 281);
}
function getBookMarkArray(obj)
{
    for (var i = 1; i < obj.length; i++) {
        if (obj[i] == 0) {
            return i;
            break;
        }
    }
    return 1;
}
function getDulplicateBookMark(str)
{
    for (var i = 0; i < 8; i++) {
        if (arrPosBookMark[i] == str) {
            return true;
            break;
        }
    }
    return false;
}
function getNumberPx(str)
{
    var a = str.replace('px', '');
    return Number(a);
}
function moveDivBookMark(no)
{
    if (isFinite(no)) {
        var NowCntBookMark = no;
        var y = $("#g_markedNum0" + NowCntBookMark).offset().top;
        y = y + 25;
        window.scrollTo(0, y);
    }
}
function showDivLayer(str)
{
    $("#" + str).removeClass("disNone");
}
function hideDivLayer(str)
{
    $("#" + str).addClass("disNone");
}
function delDivBookMark(str)
{
    arrPosBookMark[parseInt(str)] = 0;
    CntBookMark--;
    hideDivLayer("g_markedNum0" + str);
    hideDivLayer("divRightBookMark" + str);
}
function showDeliveryOptionInfo()
{
    if ($("#delivery_option_layer").hasClass("g_disNone")) {
        $("#delivery_option_layer").removeClass("g_disNone");
        $("#delivery_opt_layer_tag").removeClass("g_on");
    } else {
        $("#delivery_option_layer").addClass("g_disNone");
        $("#delivery_opt_layer_tag").addClass("g_on");
    }
}
function selectedDeliveryOption(obj, strShippngPrice, strTranscNm, strShippingType)
{
    if ($get("cost_basis_type").value == "EX" && $("input[option_code='EX']:radio").prop("checked") == false) {
        if (confirm(MultiLang.findResource("í˜„ìž¬ Expressì—ë§Œ ì ìš©ë˜ëŠ” ì¿ í°ì´ ì·¨ì†Œë©ë‹ˆë‹¤. ê³„ì† í•˜ì‹œê² ìŠµë‹ˆê¹Œ?"))) {
            SetDiscountLayerDisplay(false);
            cancelCoupon($get("gd_no").value);
            SetDiscountLayerDisplay(true);
        } else {
            $("input[option_code='EX']:radio").prop("checked", true);
            return false;
        }
    }
    var codeNation = GMKT.ServiceInfo.nation;
    var strTranscShipping = "";
    if (strTranscNm != null && "" != strTranscNm.trim()) {
        strTranscShipping = strTranscNm + "(" + strShippingType + ")";
    } else {
        strTranscShipping = strShippingType;
    }
    if ($(obj).prop("disabled") == true) {
        return;
    }
    var delivery_sub_type = $(obj).attr("delivery_sub_type");
    var oversea_type = $(obj).attr("oversea_type");
    var delivery_sz_yn = $(obj).attr("delivery_sz_yn");
    var ship_to_oversea_type = "";
    var delivery_fee_condition = $(obj).attr("data-delivery-fee-cond");
    var basis_apply_type = $(obj).attr("data-basis-apply-type");
    if ($("li[name='ship_select_li'][class~='selected']").length > 0) {
        ship_to_oversea_type = $("li[name='ship_select_li'][class~='selected']").eq(0).attr("oversea_type");
    }
    var quick_delivery_slot = $(obj).attr("quick_delivery_slot") == undefined ? "" : $(obj).attr("quick_delivery_slot");
    $("#quick_delivery_slot").val(quick_delivery_slot);
    var quick_delivery_avail = $("#quick_" + $(obj).attr("value")).attr("data-is_avail");
    if (quick_delivery_avail != "True") {
        $(obj).removeAttr("quick_delivery_slot");
        $("#quick_delivery_slot").val("");
    }
    if ($("#quick_" + $(obj).attr("value")).find("a.pick_time").length > 0) {
        $("#quick_" + $(obj).attr("value")).find("a.pick_time").click();
    }
    var oversea_additional_diplay = false;
    if ($("#selected_nation_cd").val() != $("#domestic_nation_cd").val() && oversea_type == "G" && ship_to_oversea_type != "B" && ((delivery_fee_condition == "M" && basis_apply_type.indexOf('O') < 0) || delivery_fee_condition != "M")) {
        oversea_additional_diplay = true;
    }
    if (delivery_sub_type != "" || (oversea_type == "G" && $("#selected_nation_cd").val() != $("#domestic_nation_cd").val() && $("#selected_nation_cd").val() != $("#gd_ship_from_cd").val()) || (delivery_sz_yn == "Y") || oversea_additional_diplay) {
        var surcharge_text = "";
        if (delivery_sub_type != "") {
            if (delivery_sub_type.indexOf("qty_") >= 0) {
                surcharge_text += MultiLang.findResource("Qty_script");
            } else {
                surcharge_text += MultiLang.findResource("weight_script");
            }
        }
        if ((oversea_type == "G" && $("#selected_nation_cd").val() != $("#domestic_nation_cd").val() && $("#selected_nation_cd").val() != $("#gd_ship_from_cd").val()) || (oversea_additional_diplay && surcharge_text.indexOf(MultiLang.findResource("weight_script")) < 0)) {
            if ((delivery_sub_type != "" && delivery_sub_type.indexOf("w_") < 0) || (oversea_additional_diplay && surcharge_text.indexOf(MultiLang.findResource("weight_script")) < 0)) {
                if (surcharge_text != "")
                    surcharge_text += "/";
                surcharge_text += MultiLang.findResource("weight_script");
            }
        }
        if ($get("selected_nation_cd").value == $get("domestic_nation_cd").value && delivery_sz_yn == "Y") {
            if (surcharge_text != "")
                surcharge_text += "/";
            surcharge_text += MultiLang.findResource("region_script");
        }
        if (surcharge_text != "") {
            $sget("surchargePanel").style.display = "";
            $get("surcharge_text").innerHTML = String.format(MultiLang.findResource("QuantityDeliveryFee_Text_Script"), surcharge_text);
        } else {
            $sget("surchargePanel").style.display = "none";
        }
    } else {
        $sget("surchargePanel").style.display = "none";
    }
}
var NewTime, intNew, intNow, strTime;
function changeGroupBuyTimeLeft(dream_remain_time)
{
    var remain_time = 0, remain_hour = 0, remain_minute = 0, remain_second = 0;
    if (dream_remain_time == null || dream_remain_time == "" || dream_remain_time == "____" || dream_remain_time == "NaN" || dream_remain_time == "0_0_0_0") {
        remain_time = 0;
        remain_hour = 0;
        remain_minute = 0;
        remain_second = 0;
    } else {
        var split_remain_time = dream_remain_time.split("_");
        if (split_remain_time.length > 0)
            remain_time = split_remain_time[0];
        if (split_remain_time.length > 1)
            remain_hour = split_remain_time[1];
        if (split_remain_time.length > 2)
            remain_minute = split_remain_time[2];
        if (split_remain_time.length > 3)
            remain_second = split_remain_time[3];
    }
    InitTime(dream_remain_time, remain_time, remain_hour, remain_minute, remain_second);
}
function InitTime(remainText, dd, hh, mi, ss)
{
    if (dd == 0 && hh == 0 && mi == 0 && ss == 0) {
        $get("groupbuy_left_time").innerHTML = MultiLang.findResource("Ended");
        return;
    } else {
        dd = parseInt(dd) + 1;
        NewTime = new Date(2000, 1, dd, hh, mi, ss);
        TimeRoutine();
    }
}
function TimeRoutine()
{
    intNew = NewTime.getSeconds() - 1;
    NewTime.setSeconds(intNew);
    if (NewTime.getMonth() == 0 && NewTime.getDate() == 31 && NewTime.getHours() == 23 && NewTime.getMinutes() == 59 && NewTime.getSeconds() == 59) {
        Util.reloadPage();
        return;
    }
    StatusClock();
}
function StatusClock()
{
    strTime = "";
    if (NewTime.getMonth() != 1) {
        strTime = strTime + "<strong>" + eval(NewTime.getMonth() - 1) + "</strong>" + ' ' + MultiLang.findResource("months") + ' ';
    }
    if (NewTime.getDate() != 1) {
        strTime = strTime + "<strong>" + eval(NewTime.getDate() - 1) + "</strong>" + ' ' + MultiLang.findResource("days") + ' ';
    }
    strTime = strTime + "<strong>" + NewTime.getHours() + ":" + NewTime.getMinutes() + ':' + NewTime.getSeconds() + "</strong>";
    if ((strTime == "<strong>0</strong> " + MultiLang.findResource("months") + " <strong>0</strong> " + MultiLang.findResource("days") + " <strong>0:0:0</strong>") || (strTime == "<strong>0</strong> " + MultiLang.findResource("days") + " <strong>0:0:0</strong>") || (strTime == "<strong>0:0:0</strong>")) {
        $get("groupbuy_left_time").innerHTML = MultiLang.findResource("Ended");
        Util.reloadPage();
        return;
    } else {
        $get("groupbuy_left_time").innerHTML = strTime;
        setTimeout("TimeRoutine()", 1000);
    }
}
function closeGroupBuyBalloon()
{
    $(".g_layer_groupBuy").addClass("disNone");
}
function hiddenGroupBuyLayer()
{
    $("#Group_buy_layer").css("display", "none");
}
function restock_alterer_btn_onClick(goodscode)
{
    Util.openPopup("PopupRestockAlerter.aspx?goodscode=" + goodscode, "340", "200", "restockWin");
}
function ECouponHelpView(prmType) {
    window.open(Public.getWWWServerUrl('/popup/popupecouponhelp.aspx?type=' + prmType), 'Integration_Search', 'top=10,left=10,width=450,height=870');
}
function ECouponLocationInfoView() {
    if ($('#multi_location_web_url').val() != "" && $('#shop_location_type').val() == "U") {
        window.open($('#multi_location_web_url').val());
    } else {
        var goodscode = $get("gd_no").value;
        if (goodscode == "412317750" || goodscode == "412321852" || goodscode == "412317984" || goodscode == "412322006" || goodscode == "412321779" || goodscode == "412462182" || goodscode == "412572773" || goodscode == "412572911" || goodscode == "412573553") {
            window.open("http://www.family.co.jp/tenpo/");
        } else {
            window.open(Public.getWWWServerUrl('/popup/PopECouponShopInfo.aspx?gd_no=' + $get("gd_no").value + '&global_order_type=' + $get("global_order_type").value), 'Integration_Search', 'top=10,left=10,width=750,height=715');
        }
    }
}
function closeOverseaNotice()
{
    $("#oversea_notice .OverdeliveryHelp").addClass("g_disNone");
}
function closeOverseaList()
{
    $("#oversea_list .OverdeliveryFee").addClass("g_disNone");
}
function OpenEZViewQuick()
{
    Util.OpenSmarWindowEZCompare();
}
function ViewSmartViewer()
{}
var inventory_ret = null;
var opt_ret = null;
var opt_id = "";
var inventory_id = "";
var kpointer_idx = 1;
var kpointer_idx_max = 0;
var kpoint_index = "";
var kpoint_scroll_value = 0;
var _clicked_img = "";
var _clicked_text = "";
var class_clicked_yn = "N";
var color_title = "";
var thum_Img_url = "";
var opt_Image_Timer_ObjArr = new Array();
var opt_Image_Text = new Array();
var opt_Image_selected_Class = function () {
    this.idx;
    this.img_no;
    this.sel_text1;
    this.sel_text2;
    this.sel_name1;
    this.sel_name2;
    this.sel_value1;
    this.sel_value2;
}
var opt_Image_selected_Info = new opt_Image_selected_Class();
var opt_Image_Class = function () {
    this.first_open = true;
    this.selected = false;
    this.img_move_value = -360;
    this.pageNum = 0;
    this.page_item_cnt = 18;
}
var opt_Image_Info = new opt_Image_Class();
var optAllVwSelect = function () {
    this.select = false;
    this.sel_value1 = null;
    this.sel_value2 = null;
    this.sel_value3 = null;
}
opt_TimerObj = null;
optOut_TimerObj = null;
function optLayerOver(obj) {
    $(obj).addClass("on");
}
function optLayerOut(obj) {
    $(obj).removeClass("on");
    if (_clicked_img != "") {
        if (glio_Control.imageType == "S") {
            imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
        } else {
            imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
        }
    }
}
function optLayerOver_optSelect(obj) {
    if (optOut_TimerObj != null) {
        clearTimeout(optOut_TimerObj);
        optOut_TimerObj = null;
    }
    $(obj).addClass("on");
    if ($(obj).attr("Img_url") != undefined) {
        if (opt_TimerObj != null) {
            clearTimeout(opt_TimerObj);
            opt_TimerObj = null;
        }
        var prmImgContents = $(obj).children("a").attr("id");
        var timerId = setTimeout(function () {
            if (opt_Goods_Img_url == "") {
                var tmpGDIMG = $("#GoodsImage").attr("src");
                if (tmpGDIMG != null && tmpGDIMG != "" && tmpGDIMG.toLowerCase().indexOf("loading_400") < 0) {
                    opt_Goods_Img_url = $("#GoodsImage").attr("src");
                }
            }
            var Img_url = $(obj).attr("Img_url");
            var ori_img_url = $(obj).attr("ori_img_url");
            if (Img_url != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", Img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            } else if (ori_img_url != "" && ori_img_url != undefined) {
                ori_img_url = GetGoodsImageUrl(ori_img_url, "M", "N");
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", ori_img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", ori_img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            } else if (_clicked_img != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            } else if (opt_Goods_Img_url != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            }
        }, 150);
        opt_TimerObj = timerId;
    }
}
function optLayerOut_optSelect(obj) {
    $(obj).removeClass("on");
    if ($(obj).attr("Img_url") != undefined) {
        var prmImgContents = $(obj).children("a").attr("id");
        if (opt_TimerObj != null) {
            clearTimeout(opt_TimerObj);
            opt_TimerObj = null;
        }
        optOut_TimerObj = setTimeout(function () {
            if (_clicked_img != "" && $(obj).parent().children().hasClass("on") == false) {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400, "Y");
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340, "Y");
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            } else if (opt_Goods_Img_url != "" && $(obj).parent().children().hasClass("on") == false) {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400, "Y");
                } else {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340, "Y");
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            }
        }, 200);
    }
}
function optLayerOver_thum(obj, id, select_nm, sel_value) {
    class_clicked_yn = "N";
    var sel_mode = $("#h_sel_mode").val();
    if (sel_mode == "reverse" && $(obj).hasClass("soldout"))
        return;
    if ($(obj).attr("class") != undefined) {
        if ($(obj).attr("class").indexOf("clicked") >= 0) {
            class_clicked_yn = "Y";
        }
    }
    if (class_clicked_yn == "N") {
        $(obj).addClass("hover");
    }
    if (optOut_TimerObj != null) {
        clearTimeout(optOut_TimerObj);
        optOut_TimerObj = null;
    }
    if (opt_TimerObj != null) {
        clearTimeout(opt_TimerObj);
        opt_TimerObj = null;
    }
    var option_price = $(obj).attr("price");
    var select_option_txt = "";
    if (sel_mode == "reverse")
    {
        if (id == 1 && $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[0]).find("li.clicked").length > 0) {
            sel_value = $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[0]).find("li.clicked").attr("sel_value") + "/" + sel_value;
        } else if (id == 0 && $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[1]).find("li.clicked").length > 0)
            sel_value = sel_value + "/" + $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[1]).find("li.clicked").attr("sel_value");
    }
    if (parseFloat(option_price) > 0)
        select_option_txt = sel_value + "(+" + PriceUtil.FormatCurrencyCode(option_price, $get("target_currency").value) + ")";
    else if (parseFloat(option_price) < 0)
        select_option_txt = sel_value + "(" + PriceUtil.FormatCurrencyCode(option_price, $get("target_currency").value) + ")";
    else
        select_option_txt = sel_value;
    if ($get("option_color_title"))
        $get("option_color_title").innerHTML = select_option_txt;
    var timerId = setTimeout(function () {
        if (opt_Goods_Img_url == "") {
            var tmpGDIMG = $("#GoodsImage").attr("src");
            if (tmpGDIMG != null && tmpGDIMG != "" && tmpGDIMG.toLowerCase().indexOf("loading_400") < 0) {
                opt_Goods_Img_url = $("#GoodsImage").attr("src");
            }
        }
        if ($(obj).attr("Img_url") != undefined) {
            var Img_url = $(obj).attr("Img_url");
            var ori_img_url = $(obj).attr("ori_img_url");
            if (Img_url != "") {
                Img_url = GetGoodsImageUrl(Img_url, "M", "N");
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", Img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "");
                $get("Img_option_title").innerHTML = "<p>" + select_option_txt + "</p>";
            } else if (ori_img_url != "" && ori_img_url != undefined) {
                ori_img_url = GetGoodsImageUrl(ori_img_url, "M", "N");
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", ori_img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", ori_img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "");
                $get("Img_option_title").innerHTML = "<p>" + select_option_txt + "</p>";
            } else if (_clicked_img != "")
            {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
                }
                $("#Img_option_title").css("display", "");
                $get("Img_option_title").innerHTML = "<p>" + _clicked_text + "</p>";
            } else if (opt_Goods_Img_url != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            } else {
                if ($("#ulIndicate li[class^='selected']").length > 0) {
                    ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
                }
            }
        }
    }, 100);
    opt_TimerObj = timerId;
}
function optLayerOut_thum(obj, id, select_nm) {
    $(obj).removeClass("hover");
    if (opt_TimerObj != null) {
        clearTimeout(opt_TimerObj);
        opt_TimerObj = null;
    }
    if ($get("option_color_title"))
        $get("option_color_title").innerHTML = color_title;
    returnToViewImage();
}
function returnToViewImage()
{
    optOut_TimerObj = setTimeout(function () {
        if (_clicked_img != "") {
            if (glio_Control.imageType == "S") {
                imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
            } else {
                imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
            }
            $("#Img_option_title").css("display", "");
            $get("Img_option_title").innerHTML = "<p>" + _clicked_text + "</p>";
        } else if (opt_Goods_Img_url != "") {
            if (glio_Control.imageType == "S") {
                imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400)
            } else {
                imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340)
            }
            $("#Img_option_title").css("display", "none");
            $get("Img_option_title").innerHTML = "";
        } else {
            if ($("#ulIndicate li[class^='selected']").length > 0) {
                ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
            }
        }
    }, 100);
}
showOptInfo = function (id, info_type, is_other)
{
    var inventory_count = 0;
    var opt_count = 0;
    var select_nm = "";
    if (info_type == "P")
        select_nm = "opt";
    else if (info_type == "I")
        select_nm = "inventory";
    inventory_count = $nget("inventory_value").length;
    opt_count = $nget("sel_no").length;
    if ($("#" + select_nm + "_layer_" + id + " .innerWrap").css("display") == "none") {
        for (var i = 0; i < inventory_count; i++) {
            $("#inventory_layer_" + i + " .innerWrap").hide();
        }
        for (var i = 0; i < opt_count; i++) {
            $("#opt_layer_" + i + " .innerWrap").hide();
        }
        $("#" + select_nm + "_layer_" + id + " .innerWrap").show();
    } else {
        $("#" + select_nm + "_layer_" + id + " .innerWrap").hide();
    }
    if (is_other == true) {
        $("#" + select_nm + "_layer_" + id + " .innerWrap").hide();
    }
    ShowRelationInfo("hi");
    showWarrantyOpt("hi");
}
var last_click_opt_obj = null;
function selectedOpt(info_type, id, value, text, org_text, obj, sub_text, sub_price, sub_qty, org_sub_price) {
    var select_nm = "";
    var tmpSltText = "";
    try {
        if ($(obj).length <= 0) {
            obj = $get(obj);
        }
    } catch (ee) {
        if (typeof (obj) != "object") {
            obj = $get(obj);
        }
    }
    last_click_opt_obj = obj;
    if (info_type == "P") {
        select_nm = "opt";
    } else if (info_type == "I") {
        select_nm = "inventory";
        var sel_count = $nget("" + select_nm + "_value").length;
        if (parseInt(id) == sel_count - 1 && parseFloat(sub_qty) <= 0) {
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), parseFloat(sub_qty)));
            return;
        }
    }
    $("#content_" + select_nm + "_" + id).children().removeClass("selected");
    $(obj).parent().parent().addClass("selected");
    kpointer_idx = 1;
    if (parseFloat(sub_price) > 0)
        tmpSltText = sub_text + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
    else if (parseFloat(sub_price) < 0)
        tmpSltText = sub_text + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
    else
        tmpSltText = sub_text;
    if (info_type == "P") {
        if ($nget("sel_no") != null) {
            $nget("sel_no")[id].value = value;
            $nget("sel_text")[id].value = tmpSltText;
            $nget("sel_price")[id].value = sub_price;
            $nget("sel_price_oc")[id].value = org_sub_price;
            $nget("sel_qty")[id].value = sub_qty;
            var sel_opt_img_disp_type = "";
            var sel_opt_img_yn = "";
            if ($nget("sel_opt_img_disp_type")[id] != undefined) {
                sel_opt_img_disp_type = $nget("sel_opt_img_disp_type")[id].value;
                sel_opt_img_yn = $nget("sel_opt_img_yn")[id].value;
            }
            if (sel_opt_img_disp_type == "T" && sel_opt_img_yn == "True") {
                var select_option_txt = "";
                if (parseFloat(sub_price) > 0)
                    select_option_txt = sub_text + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
                else if (parseFloat(sub_price) < 0)
                    select_option_txt = sub_text + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
                else
                    select_option_txt = sub_text;
                if (!optAllVwSelect.select && !opt_Image_Info.selected) {
                    color_title = select_option_txt;
                }
                if ($(obj).parent().attr("Img_url") != "") {
                    _clicked_img = $(obj).parent().attr("Img_url");
                    _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
                } else {
                    _clicked_img = "";
                }
                _clicked_text = select_option_txt;
                $get("" + select_nm + "_title_" + id).innerHTML = select_option_txt;
                $(obj).parent().parent("ul").children("dfn").text("");
                $(obj).parent().parent("ul").children().removeClass("clicked");
                $(obj).parent().removeClass("hover");
                $(obj).parent().addClass("clicked");
                $(obj).parent().children("dfn").text("clicked");
            } else if (sel_opt_img_disp_type == "L" && sel_opt_img_yn == "True") {
                var select_option_txt = "";
                if (parseFloat(sub_price) > 0)
                    select_option_txt = sub_text + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
                else if (parseFloat(sub_price) < 0)
                    select_option_txt = sub_text + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
                else
                    select_option_txt = sub_text;
                if (!optAllVwSelect.select && !opt_Image_Info.selected) {
                    color_title = select_option_txt;
                }
                if ($(obj).parent().attr("Img_url") != "") {
                    _clicked_img = $(obj).parent().attr("Img_url");
                    _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
                } else {
                    _clicked_img = "";
                }
                _clicked_text = select_option_txt;
                $get("" + select_nm + "_title_" + id).innerHTML = select_option_txt;
                $(obj).parent().parent("ul").children("dfn").text("");
                $(obj).parent().parent("ul").children().removeClass("clicked");
                $(obj).parent().removeClass("hover");
                $(obj).parent().addClass("clicked");
                $(obj).parent().children("dfn").text("clicked");
            } else {
                if (sel_opt_img_disp_type == "B" && sel_opt_img_yn == "True") {
                    if ($(obj).parent().attr("Img_url") != "") {
                        _clicked_img = $(obj).parent().attr("Img_url");
                        _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
                    } else {
                        _clicked_img = "";
                    }
                }
                $get("" + select_nm + "_title_" + id).innerHTML = "<a class=\"select_title\" href=\"javascript:showOptInfo('" + id + "', '" + info_type + "');\">" + text + "<span id=\"" + select_nm + "_blind_" + id + "\" class=\"blind\">view</span></a>";
                $("#" + select_nm + "_outer_" + id).removeClass("AreaSelected");
            }
            showOptInfo(id, info_type);
        }
    } else {
        var inv_group_type = "";
        var inv_img_disp_type = "";
        var inv_img_view_yn = "";
        var inv_img_yn = "";
        if ($("#inventory_group_type_" + id) != undefined) {
            inv_group_type = $("#inventory_group_type_" + id).val();
            inv_img_disp_type = $("#inventory_img_disp_type_" + id).val();
            inv_img_view_yn = $("#inventory_img_view_yn_" + id).val();
            inv_img_yn = $("#inventory_img_yn_" + id).val();
        }
        if (inv_img_disp_type == "T" && inv_img_view_yn == "Y" && inv_img_yn == "True") {
            var select_option_txt = "";
            if (parseFloat(sub_price) > 0)
                select_option_txt = sub_text + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
            else if (parseFloat(sub_price) < 0)
                select_option_txt = sub_text + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
            else
                select_option_txt = sub_text;
            if ($(obj).parent().attr("Img_url") != "") {
                _clicked_img = $(obj).parent().attr("Img_url");
                _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
            } else {
                _clicked_img = "";
            }
            _clicked_text = select_option_txt;
            if ($get("#option_color_title"))
                $get("#option_color_title").innerHTML = select_option_txt;
            $(obj).parent().parent("ul").children("dfn").text("");
            $(obj).parent().parent("ul").children().removeClass("clicked");
            $(obj).parent().removeClass("hover");
            $(obj).parent().addClass("clicked");
            $(obj).parent().children("dfn").text("clicked");
        } else if (inv_img_disp_type == "L" && inv_img_view_yn == "Y" && inv_img_yn == "True") {
            var select_option_txt = "";
            if (parseFloat(sub_price) > 0)
                select_option_txt = sub_text + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
            else if (parseFloat(sub_price) < 0)
                select_option_txt = sub_text + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
            else
                select_option_txt = sub_text;
            if ($(obj).parent().attr("Img_url") != "") {
                _clicked_img = $(obj).parent().attr("Img_url");
                _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
            } else {
                _clicked_img = "";
            }
            _clicked_text = select_option_txt;
            if ($get("#option_color_title"))
                $get("#option_color_title").innerHTML = select_option_txt;
            $(obj).parent().parent("ul").children("dfn").text("");
            $(obj).parent().parent("ul").children().removeClass("clicked");
            $(obj).parent().removeClass("hover");
            $(obj).parent().addClass("clicked");
            $(obj).parent().children("dfn").text("clicked");
        } else {
            if (inv_img_disp_type == "B" && inv_img_view_yn == "Y" && inv_img_yn == "True") {
                if ($(obj).parent().attr("Img_url") != "") {
                    _clicked_img = $(obj).parent().attr("Img_url");
                    _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
                } else if ($(obj).parent().attr("ori_img_url") != undefined && $(obj).parent().attr("ori_img_url") != "") {
                    _clicked_img = $(obj).parent().attr("ori_img_url");
                    _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
                } else {
                    _clicked_img = "";
                }
            }
            $get("" + select_nm + "_title_" + id).innerHTML = "<a class=\"select_title\" href=\"javascript:showOptInfo('" + id + "', '" + info_type + "');\">" + text + "<span id=\"" + select_nm + "_blind_" + id + "\" class=\"blind\">view</span></a>";
            $("#" + select_nm + "_outer_" + id).removeClass("AreaSelected");
        }
        if (!opt_Image_Info.selected && !optAllVwSelect.select) {
            showOptInfo(id, info_type);
        }
        $nget("" + select_nm + "_value")[id].value = org_text;
        $nget("" + select_nm + "_text")[id].value = tmpSltText;
        $nget("" + select_nm + "_price")[id].value = sub_price;
        $nget("" + select_nm + "_price_oc")[id].value = org_sub_price;
        $nget("" + select_nm + "_qty")[id].value = sub_qty;
        var multi_inventory_seq_no = "";
        var sel_count = $nget("" + select_nm + "_value").length;
        var expose_yn = "N";
        var sel_value1 = "";
        var sel_value2 = "";
        var sel_value3 = "";
        var sel_value4 = "";
        var sel_value5 = "";
        for (var i = 0; i < sel_count; i++) {
            if (i == 0)
                sel_value1 = $nget("" + select_nm + "_value")[i].value;
            else if (i == 1)
                sel_value2 = $nget("" + select_nm + "_value")[i].value;
            else if (i == 2)
                sel_value3 = $nget("" + select_nm + "_value")[i].value;
            else if (i == 3)
                sel_value4 = $nget("" + select_nm + "_value")[i].value;
            else if (i == 4)
                sel_value5 = $nget("" + select_nm + "_value")[i].value;
        }
        var idx = parseInt(id) + 1;
        var level = parseInt(id) + 1;
        if (parseInt(id) == 0) {
            Level3Init();
        }
        if (parseInt(id) == sel_count - 1 && parseFloat(sub_qty) <= 0) {
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), parseFloat(sub_qty)));
            return;
        }
        if (parseInt(id) == sel_count - 1) {
            $get("" + select_nm + "_seq_no").value = value;
            if (optionValidCheck_New(true)) {
                SetSelectOptionList();
            }
            return;
        }
        setNextLevelData(info_type, select_nm, idx, expose_yn, sel_value1, sel_value2, sel_value3, sel_value4, sel_count);
    }
    if (optionValidCheck_New(true)) {
        $("#" + select_nm + "_loading_" + idx).hide();
        SetSelectOptionList();
    }
}
function selectedOptReverse(info_type, id, value, text, org_text, obj, sub_text, sub_price, sub_qty, org_sub_price) {
    var tmpSltText = "";
    try {
        if ($(obj).length <= 0) {
            obj = $get(obj);
        }
    } catch (ee) {
        if (typeof (obj) != "object") {
            obj = $get(obj);
        }
    }
    var sel_count = $nget("inventory_value").length;
    var expose_yn = "N";
    if ($(obj).parent().hasClass("clicked")) {
        setReverseTypeLevelInit(id);
        if (sel_count == 3)
            Level3Init();
        return;
    } else if ($(obj).parent().hasClass("soldout")) {
        return;
    } else if ($("#content_inventory_" + parseInt(id) + " > li").hasClass("clicked")) {
        setReverseTypeLevelInit(id);
        if (sel_count == 3)
            Level3Init();
    }
    sub_price = $("#li_inventory_" + id + "_" + escapeStr(org_text)).attr("price");
    org_sub_price = $("#li_inventory_" + id + "_" + escapeStr(org_text)).attr("price_oc");
    sub_qty = $("#li_inventory_" + id + "_" + escapeStr(org_text)).attr("qty");
    last_click_opt_obj = obj;
    if (parseFloat(sub_price) > 0)
        tmpSltText = sub_text + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
    else if (parseFloat(sub_price) < 0)
        tmpSltText = sub_text + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
    else
        tmpSltText = sub_text;
    var inv_group_type = "";
    var inv_img_disp_type = "";
    var inv_img_view_yn = "";
    var inv_img_yn = "";
    if ($("#inventory_group_type_" + id) != undefined) {
        inv_group_type = $("#inventory_group_type_" + id).val();
        inv_img_disp_type = $("#inventory_img_disp_type_" + id).val();
        inv_img_view_yn = $("#inventory_img_view_yn_" + id).val();
        inv_img_yn = $("#inventory_img_yn_" + id).val();
    }
    if ((inv_img_disp_type == "T" || inv_img_disp_type == "L") && inv_img_view_yn == "Y" && inv_img_yn == "True") {
        var select_option_txt = sub_text;
        if (id == 1 && $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[0]).find("li.clicked").length > 0) {
            var tmpSelVal = $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[0]).find("li.clicked").attr("sel_value");
            select_option_txt = tmpSelVal + "/" + select_option_txt;
            $nget("inventory_text")[0].value = tmpSelVal;
            $nget("inventory_price")[0].value = "0";
            $nget("inventory_price_oc")[0].value = "0";
            $nget("inventory_qty")[0].value = "0";
        } else if (id == 0 && $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[1]).find("li.clicked").length > 0) {
            var tmpSelVal = $($("ul[viewType='Thumbnail'], ul[viewType='Image']")[1]).find("li.clicked").attr("sel_value");
            select_option_txt = select_option_txt + "/" + tmpSelVal;
            $nget("inventory_text")[1].value = tmpSelVal;
            $nget("inventory_price")[1].value = "0";
            $nget("inventory_price_oc")[1].value = "0";
            $nget("inventory_qty")[1].value = "0";
        }
        if (parseFloat(sub_price) > 0)
            select_option_txt = select_option_txt + "(+" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
        else if (parseFloat(sub_price) < 0)
            select_option_txt = select_option_txt + "(" + PriceUtil.FormatCurrencyCode(sub_price, $get("target_currency").value) + ")";
        if ($(obj).parent().attr("Img_url") != "") {
            _clicked_img = $(obj).parent().attr("Img_url");
            _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
            optOut_TimerObj = setTimeout(function () {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
                }
            });
        } else if ($(obj).parent().attr("ori_img_url") != undefined && $(obj).parent().attr("ori_img_url") != "") {
            _clicked_img = $(obj).parent().attr("ori_img_url");
            _clicked_img = GetGoodsImageUrl(_clicked_img, "M", "N");
            optOut_TimerObj = setTimeout(function () {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
                }
            });
        } else if (_clicked_img != "")
        {
            optOut_TimerObj = setTimeout(function () {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
                }
            });
        }
        _clicked_text = select_option_txt;
        $(obj).parent().parent("ul").children("dfn").text("");
        $(obj).parent().parent("ul").children().removeClass("clicked");
        $(obj).parent().removeClass("hover");
        $(obj).parent().addClass("clicked");
        $(obj).parent().children("dfn").text("clicked");
    }
    if (!opt_Image_Info.selected && !optAllVwSelect.select) {
        showOptInfo(id, info_type);
    }
    $nget("inventory_value")[id].value = org_text;
    $nget("inventory_text")[id].value = tmpSltText;
    $nget("inventory_price")[id].value = sub_price;
    $nget("inventory_price_oc")[id].value = org_sub_price;
    $nget("inventory_qty")[id].value = sub_qty;
    var multi_inventory_seq_no = "";
    var sel_value1 = "";
    var sel_value2 = "";
    var sel_value3 = "";
    for (var i = 0; i < sel_count; i++) {
        if (i == 0)
            sel_value1 = $nget("inventory_value")[i].value;
        else if (i == 1)
            sel_value2 = $nget("inventory_value")[i].value;
        else if (i == 2)
            sel_value3 = $nget("inventory_value")[i].value;
    }
    var idx = parseInt(id) + 1;
    var level = parseInt(id) + 1;
    if (parseInt(id) == 0) {
        $("#content_inventory_1 > li").addClass("soldout");
        var ret = getInventoryData(2, org_text, "", "", "", sel_count, "");
        if (ret != null && $("#inventory_value_0").val() != "") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].inventory_yn == "Y" || ret[i].remain_cnt > 0)
                    $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).removeClass("soldout");
                var textLayerPrice = "" + ret[i].sel_item_price;
                var textLayerPriceOC = "" + ret[i].sel_item_price_oc;
                var textLayerQty = "" + ret[i].remain_cnt;
                var ori_img_url = $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("img_url");
                var Img_url = "";
                if (ret[i].combination_img_url != null) {
                    Img_url = ret[i].combination_img_url.split("||")[0];
                } else {
                    Img_url = ret[i].img_url;
                }
                $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("price", textLayerPrice);
                $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("price_oc", textLayerPriceOC);
                $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("qty", textLayerQty);
                $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("ori_img_url", ori_img_url);
                $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("img_url", Img_url);
                $("#li_inventory_1_" + escapeStr(ret[i].sel_value)).attr("sel_no", ret[i].sel_no);
            }
        }
        if ($("#content_inventory_1 > li").hasClass("clicked")) {
            if (sel_count == 2)
                $get("inventory_seq_no").value = $("#li_inventory_" + id + "_" + escapeStr(org_text)).attr("sel_no");
            else if (sel_count == 3)
                setNextLevelData(info_type, "inventory", 2, expose_yn, sel_value1, sel_value2, sel_value3, "", sel_count);
        }
    } else if (parseInt(id) == 1) {
        $("#content_inventory_0 > li").addClass("soldout");
        var ret = getInventoryData(1, "", sel_value2, "", "", sel_count, "");
        if (ret != null && $("#inventory_value_1").val() != "") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].inventory_yn == "Y" || ret[i].remain_cnt > 0) {
                    $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).removeClass("soldout");
                }
                var textLayerPrice = "" + ret[i].sel_item_price;
                var textLayerPriceOC = "" + ret[i].sel_item_price_oc;
                var textLayerQty = "" + ret[i].remain_cnt;
                var Img_url = "";
                var ori_img_url = $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("img_url");
                if (ret[i].combination_img_url != null) {
                    Img_url = ret[i].combination_img_url.split("||")[0];
                } else {
                    Img_url = ret[i].img_url;
                }
                $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("price", textLayerPrice);
                $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("price_oc", textLayerPriceOC);
                $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("qty", textLayerQty);
                $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("ori_img_url", ori_img_url);
                $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("img_url", Img_url);
                $("#li_inventory_0_" + escapeStr(ret[i].sel_value)).attr("sel_no", ret[i].sel_no);
            }
        }
        if ($("#content_inventory_0 > li").hasClass("clicked")) {
            if (sel_count == 2)
                $get("inventory_seq_no").value = $("#li_inventory_" + id + "_" + escapeStr(org_text)).attr("sel_no");
            else if (sel_count == 3)
                setNextLevelData(info_type, "inventory", 2, expose_yn, sel_value1, sel_value2, sel_value3, "", sel_count);
        }
    }
    if (optionValidCheck_New(true)) {
        $("#inventory_loading_" + idx).hide();
        SetSelectOptionList();
    }
}
function escapeStr(str) {
    if (str)
        return str.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
    return str;
}
function Level3Init() {
    var tmpControl = $("dl[class^='detailsArea'] dd div[class^='selectArea'][id='inventory_outer_2']").find("a.select_title");
    if (tmpControl != null && tmpControl.length > 0) {
        var tmpHtml = $(tmpControl[0]).find("span[class='blind']").attr("id");
        if (tmpHtml != "ship_to_blind")
        {
            tmpHtml = MultiLang.findResource("Please select") + "<span id=\"" + tmpHtml + "\" class=\"blind\">view</span>";
            $(tmpControl[0]).html(tmpHtml);
        }
        tmpControl = $("#content_inventory_2");
        if (tmpControl != null && tmpControl.length > 0) {
            var tmpType = $(tmpControl[0]).hasClass("thumb_in");
            if (tmpType) {
                var tmpHtml = "<li style='cursor:default;'>" + MultiLang.findResource("ALERT_MSG24") + "</li>\r\n";
                $(tmpControl[0]).html(tmpHtml);
            } else {
                var tmpHtml = "<li>-----------------------------------------------------------</li>\r\n";
                tmpHtml += "<li style='cursor:default;'>" + MultiLang.findResource("ALERT_MSG24") + "</li>\r\n";
                $(tmpControl[0]).html(tmpHtml);
            }
        }
    }
}
function setReverseTypeLevelInit(idx) {
    var reverIdx = (idx == "0" ? 1 : 0);
    var reverseClicked = false;
    $("#inventory_title_" + idx).html("");
    $("#content_inventory_" + idx + " > li").removeClass("clicked");
    $get("inventory_value_" + idx).value = "";
    $get("inventory_text_" + idx).value = "";
    $get("inventory_price_" + idx).value = "";
    $get("inventory_price_oc_" + idx).value = "";
    $get("inventory_qty_" + idx).value = "";
    color_title = "";
    $("#content_inventory_" + reverIdx.toString() + " > li").each(function () {
        if (!$(this).is("[soldout]"))
            $(this).removeClass("soldout");
        $(this).attr("price", "0");
        $(this).attr("price_oc", "0");
        $(this).attr("qty", "0");
        $(this).attr("img_url", $(this).attr("ori_img_url"));
        if ($(this).hasClass("clicked")) {
            reverseClicked = true;
            var Img_url = $(this).attr("Img_url");
            if (Img_url != "") {
                Img_url = GetGoodsImageUrl(Img_url, "M", "N");
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", Img_url, 400, 400);
                } else {
                    imageOnLoadResize("GoodsImage", Img_url, 442, 340);
                }
            }
            _clicked_img = Img_url;
            _clicked_text = $(this).attr("sel_value");
        }
    });
    if (!reverseClicked) {
        _clicked_img = "";
        returnToViewImage();
    }
}
function setReverseTypeLevelFilterInit(idx) {
    $("#content_inventory_" + idx + " > li").each(function () {
        $(this).removeClass("soldout");
        $(this).attr("price", "0");
        $(this).attr("price_oc", "0");
        $(this).attr("qty", "0");
        $(this).attr("img_url", $(this).attr("ori_img_url"));
        if ($(this).hasClass("clicked")) {
            var Img_url = $(this).attr("Img_url");
            if (Img_url != "") {
                Img_url = GetGoodsImageUrl(Img_url, "M", "N");
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", Img_url, 442, 340)
                }
            } else if (opt_Goods_Img_url != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                $get("Img_option_title").innerHTML = "";
            } else {
                if ($("#ulIndicate li[class^='selected']").length > 0) {
                    ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
                }
            }
            _clicked_img = Img_url;
        }
    });
}
function setNextLevelData(info_type, select_nm, idx, expose_yn, sel_value1, sel_value2, sel_value3, sel_value4, sel_count) {
    var isIong = false;
    $("#inventory_loading_" + idx).show();
    $("#inventory_title_" + idx).html("<a class=\"select_title\"></a>");
    getInventoryDataAsync((idx + 1), sel_value1, sel_value2, sel_value3, sel_value4, sel_count, "", function (ret) {
        if (ret != null) {
            var searchTxt = "";
            var opt_dt_url = "";
            if (idx == sel_count - 1)
                expose_yn = "Y";
            searchTxt = "";
            var inv_img_disp_type = $get("inventory_img_disp_type_" + idx + "").value;
            var inv_img_yn = $get("inventory_img_yn_" + idx + "").value;
            var inv_group_type = "";
            var inv_img_view_yn = "";
            if (inv_img_disp_type == "T" && inv_img_yn == "True") {
                if ($("#option_color_title")) {
                    $("#option_color_title").html("");
                    $("#option_color_title").show();
                }
                $("#" + select_nm + "_outer_text_" + idx).hide();
                var tmpThumHtml = GetSelectOptLayer_thum(idx, ret, "I", expose_yn, false);
                $("#inventory_value_" + idx).parents("dl[class^='detailsArea']").eq(0).find("dd ul[class^='select_chip']").html(tmpThumHtml);
            } else if (inv_img_disp_type == "L" && inv_img_yn == "True") {
                if ($("#option_color_title")) {
                    $("#option_color_title").html("");
                    $("#option_color_title").show();
                }
                $("#" + select_nm + "_outer_text_" + idx).hide();
                var tmpThumHtml = GetSelectOptLayer_thum_Large(idx, ret, "I", expose_yn, false);
                $("#inventory_value_" + idx).parents("dl[class^='detailsArea']").eq(0).find("dd ul[class^='select_chip']").html(tmpThumHtml);
            } else {
                if ($get("inventory_img_disp_type_" + idx + "") != undefined) {
                    inv_group_type = $get("inventory_group_type_" + idx + "").value;
                    inv_img_view_yn = $get("inventory_img_view_yn_" + idx + "").value;
                    if (inv_img_disp_type == "N") {
                        searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
                    }
                } else {
                    searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
                }
                $get("header_" + select_nm + "_" + idx + "").style.display = "";
                if (ret != null) {
                    for (var i = 0; i < ret.length; i++) {
                        opt_dt_url = "";
                        if (ret[i].detail_url != null && ret[i].detail_url != "") {
                            opt_dt_url = "<a onclick='if(window.OptionInvenDetailPop) OptionInvenDetailPop(\"" + ret[i].detail_url + "\");' target='_blank' class='btn_newWindow'>new window</a>";
                        }
                        if (isIong == false && textBind(info_type, i, ret, expose_yn, false, false).length > 36) {
                            $("#" + select_nm + "_layer_" + idx + " div").width("420px");
                            isIong = true;
                        }
                        searchTxt += GetInventoryLevelHTML(inv_group_type, inv_img_disp_type, inv_img_view_yn, inv_img_yn, ret, i, select_nm, idx, info_type, expose_yn);
                    }
                    if (searchTxt != "") {
                        $get("content_" + select_nm + "_" + (idx) + "").innerHTML = searchTxt;
                    } else {
                        $get("content_" + select_nm + "_" + (idx) + "").innerHTML = searchTxt;
                    }
                } else {
                    $get("content_" + select_nm + "_" + (idx) + "").innerHTML = searchTxt;
                }
                $get("" + select_nm + "_title_" + idx).innerHTML = "<a class=\"select_title\" href=\"javascript:showOptInfo('" + idx + "', '" + info_type + "');\">" + MultiLang.findResource("Please select") + "<span id=\"" + select_nm + "_blind_" + idx + "\" class=\"blind\">view</span></a>";
                $("#" + select_nm + "_title_" + idx).show();
                $("#" + select_nm + "_outer_text_" + idx).hide();
            }
            $("#" + select_nm + "_loading_" + idx).hide();
            $get("" + select_nm + "_value_" + idx).value = "";
            $get("" + select_nm + "_text_" + idx).value = "";
            $get("" + select_nm + "_price_" + idx).value = "";
            $get("" + select_nm + "_qty_" + idx).value = "";
        }
    });
}
function getInventoryDataAsync(level, sel_value1, sel_value2, sel_value3, sel_value4, sel_count, keyword, callback) {
    var inventory_no = $get("inventory_no").value;
    var target_currency = $get("target_currency").value;
    var param = new RMSParam();
    param.add("inventory_no", inventory_no);
    param.add("sel_value1", sel_value1);
    param.add("sel_value2", sel_value2);
    param.add("sel_value3", sel_value3);
    param.add("sel_value4", sel_value4);
    param.add("level", level);
    param.add("sel_count", sel_count);
    param.add("keyword", keyword);
    param.add("lang_cd", $get("lang_cd").value);
    param.add("global_order_type", $get("global_order_type").value);
    param.add("gd_no", $get("gd_no").value);
    param.add("inventory_yn", "");
    param.add("link_type", $("#link_type").val());
    RMSHelper.asyncCallWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsInventoryEachLevelNameByKeyword", param.toJson(), function (ret) {
        if (ret != null) {
            var searchTxt = "";
            if (typeof (callback) == "function") {
                callback(ret);
            }
            if (level == 2) {
                var inv_img_yn = $("#inventory_img_yn_1").val();
                if (opt_Image_Info.selected) {
                    if ($("#inventory_img_disp_type_1").val() == "T" && inv_img_yn == "True") {
                        $($get("content_inventory_1_" + opt_Image_selected_Info.sel_value2)).parents("li").click();
                    } else if ($("#inventory_img_disp_type_1").val() == "L" && inv_img_yn == "True") {
                        $($get("content_inventory_1_" + opt_Image_selected_Info.sel_value2)).parents("li").click();
                    } else {
                        $($get("content_inventory_1_" + opt_Image_selected_Info.sel_value2)).click();
                    }
                    opt_Image_Info.selected = false;
                } else if (optAllVwSelect.select && optAllVwSelect.sel_value2 != null) {
                    if ($("#inventory_img_disp_type_1").val() == "T" && inv_img_yn == "True") {
                        $($get("content_inventory_1_" + optAllVwSelect.sel_value2)).parents("li").click();
                    } else if ($("#inventory_img_disp_type_1").val() == "L" && inv_img_yn == "True") {
                        $($get("content_inventory_1_" + optAllVwSelect.sel_value2)).parents("li").click();
                    } else {
                        $($get("content_inventory_1_" + optAllVwSelect.sel_value2)).click();
                    }
                    if (optAllVwSelect.sel_value3 == null) {
                        OptAllVwSelectInit();
                    }
                }
            } else if (level == 3) {
                if (optAllVwSelect.select && optAllVwSelect.sel_value3 != null) {
                    var inv_img_yn = $("#inventory_img_yn_2").val();
                    if ($("#inventory_img_disp_type_2").val() == "T" && inv_img_yn == "True") {
                        $($get("content_inventory_2_" + optAllVwSelect.sel_value3)).parents("li").click();
                    } else if ($("#inventory_img_disp_type_2").val() == "L" && inv_img_yn == "True") {
                        $($get("content_inventory_2_" + optAllVwSelect.sel_value3)).parents("li").click();
                    } else {
                        $($get("content_inventory_2_" + optAllVwSelect.sel_value3)).click();
                    }
                    OptAllVwSelectInit();
                }
            }
        }
    });
}
function getInventoryData(level, sel_value1, sel_value2, sel_value3, sel_value4, sel_count, keyword) {
    var inventory_no = $get("inventory_no").value;
    var target_currency = $get("target_currency").value;
    var param = new RMSParam();
    param.add("inventory_no", inventory_no);
    param.add("sel_value1", sel_value1);
    param.add("sel_value2", sel_value2);
    param.add("sel_value3", sel_value3);
    param.add("sel_value4", sel_value4);
    param.add("level", level);
    param.add("sel_count", sel_count);
    param.add("keyword", keyword);
    param.add("lang_cd", $get("lang_cd").value);
    param.add("global_order_type", $get("global_order_type").value);
    param.add("gd_no", $get("gd_no").value);
    param.add("inventory_yn", "");
    param.add("link_type", $("#link_type").val());
    var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsInventoryEachLevelNameByKeyword", param.toJson());
    if (ret != null) {
        var searchTxt = "";
    }
    return ret;
}
function ezSelectOption(value) {
    if ($($get("content_inventory_0_" + value))) {
        if ($get("inventory_yn").value == "Y") {
            var inventory_cnt = $nget("sub_inventory_seqno").length;
            if (inventory_cnt == 1) {
                var sub_qty = $("#sub_inventory_seqno option[org_value='" + value + "']").attr("sub_qty");
                if (sub_qty == 0) {
                    $("#sub_inventory_seqno option").prop("selected", false);
                    $("#sub_inventory_seqno option[org_value='" + value + "']").eq(0).prop("selected", true);
                    $("#sub_inventory_seqno").change();
                } else {
                    $("#a_subOptionLayerView span").removeClass("open");
                    $("#a_subOptionLayerView span").addClass("close");
                    $get("div_SubOptionItemList").style.display = "";
                    if ($get("a_subOptionAdd") != null) {
                        $get("a_subOptionAdd").style.display = "";
                    }
                    $("#sub_inventory_seqno option").prop("selected", false);
                    $("#sub_inventory_seqno option[org_value='" + value + "']").eq(0).prop("selected", true);
                    $("#sub_inventory_seqno").change();
                }
            } else {
                $("#a_subOptionLayerView span").removeClass("open");
                $("#a_subOptionLayerView span").addClass("close");
                $get("div_SubOptionItemList").style.display = "";
                if ($get("a_subOptionAdd") != null) {
                    $get("a_subOptionAdd").style.display = "";
                }
                $("#sub_inventory_seqno option").prop("selected", false);
                $("#sub_inventory_seqno option[org_value='" + value + "']").eq(0).prop("selected", true);
                $("#sub_inventory_seqno").change();
            }
        }
    }
}
function showWarrantyOpt(prmType)
{
    if ($get("warranty_opt_layer") == null) {
        return;
    }
    if (prmType == "hi") {
        $("#warranty_opt_layer .innerWrap").hide();
        $("#warranty_opt_blind").removeClass("blind up");
        $("#warranty_opt_blind").addClass("blind");
        return;
    } else {
        if ($("#warranty_opt_layer .innerWrap").css("display") == "none") {
            $("#warranty_opt_layer .innerWrap").show();
            $("#warranty_opt_blind").removeClass("blind");
            $("#warranty_opt_blind").addClass("blind up");
        } else {
            $("#warranty_opt_layer .innerWrap").hide();
            $("warranty_opt_blind").removeClass("blind up");
            $("warranty_opt_blind").addClass("blind");
        }
    }
    ShowRelationInfo("hi");
}
function WarrantyselectedOpt(obj) {
    $("#ul_goods_warranty_list").children().removeClass("selected");
    $(obj).parent().parent().addClass("selected");
    $get("a_select_goods_warranty_title").innerHTML = obj.innerHTML + '<span id="warranty_opt_blind" class="blind">view</span>';
    var gd_no = $(obj).attr("gd_no");
    showWarrantyOpt();
    if ($get("DirectOrderBtn") != null && gd_no.trim() != "") {
        $get("DirectOrderBtn").style.display = "none";
    }
    if ($get("DirectOrderBtn") != null && gd_no.trim() == "") {
        $get("DirectOrderBtn").style.display = "";
    }
    $get("extend_warranty_gd_no").value = gd_no;
    $("#extend_txt_opt_value").val("");
    $("#extend_sel_no").val("");
    if ($("#addPurchaseOptionMaster") != null && $("#addPurchaseOptionMaster").length > 0 && $("#addPurchaseOptionMaster").attr("add_type") == "SGNI") {
        if (gd_no != "") {
            SetAddPurchaseItemInfo(gd_no);
            $("#addPurchaseOptionMaster").show();
        } else {
            $("#addPurchaseOptionMaster").hide();
        }
    }
}
var addPurchaseItemOP = new Array();
function SetAddPurchaseItemInfo(prmGdNo) {
    if (addPurchaseItemOP[prmGdNo] == null) {
        addPurchaseItemOP[prmGdNo] = new Array();
        addPurchaseItemOP[prmGdNo]["p"] = new Array();
        var paramSel = new RMSParam();
        paramSel.add("goodscode", prmGdNo);
        paramSel.add("info_type", "P");
        paramSel.add("lang_cd", $get("lang_cd").value);
        paramSel.add("global_order_type", $get("global_order_type").value);
        var retSel = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsSelinfoName", paramSel.toJson());
        if (retSel != null && retSel.Rows != null && retSel.Rows.length > 0) {
            for (var i = 0; i < retSel.Rows.length; i++) {
                addPurchaseItemOP[prmGdNo]["p"][i] = new Array();
                var param = new RMSParam();
                param.add("goodscode", prmGdNo);
                param.add("sel_name", retSel.Rows[i].sel_name);
                param.add("info_type", "P");
                param.add("keyword", "");
                param.add("lang_cd", $get("lang_cd").value);
                param.add("global_order_type", $get("global_order_type").value);
                var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsAddInfoBySelName", param.toJson());
                if (ret != null && ret.length > 0) {
                    addPurchaseItemOP[prmGdNo]["p"][i]["name"] = retSel.Rows[i].sel_name;
                    addPurchaseItemOP[prmGdNo]["p"][i]["obj"] = ret;
                }
            }
        } else {
            addPurchaseItemOP[prmGdNo] = new Array();
        }
    }
    var tmpTag = "";
    if (addPurchaseItemOP[prmGdNo] != null && addPurchaseItemOP[prmGdNo]["p"] != null && addPurchaseItemOP[prmGdNo]["p"].length > 0) {
        for (var k = 0; k < addPurchaseItemOP[prmGdNo]["p"].length; k++) {
            if (addPurchaseItemOP[prmGdNo]["p"][k]["name"] != null) {
                tmpTag += GetMakeAddPurchaseOptionTag(addPurchaseItemOP[prmGdNo]["p"][k]["name"], addPurchaseItemOP[prmGdNo]["p"][k]["obj"], k);
            }
        }
    }
    $("#addPurchaseOptionListMa").html(tmpTag);
}
function GetMakeAddPurchaseOptionTag(prmSelName, prmObj, prmIDX) {
    var rtnVal = "";
    var optList = "";
    var divStyle = "";
    rtnVal += '<li op_idx="' + prmIDX + '" sel_no="">';
    rtnVal += '<h4 class="label">' + prmSelName + '</h4>';
    rtnVal += '<div class="column">';
    rtnVal += '<div class="selectArea">';
    rtnVal += '<span>';
    rtnVal += String.format('<a class="select_title" name="addPurchaseOptionListTxt" op_idx="{0}" onclick="ShowAddPurchaseOptInfo(\'{0}\', \'P\');">{1}<span class="blind">view</span></a>', prmIDX, MultiLang.findResource("Please select"));
    rtnVal += '</span>';
    rtnVal += '<div class="selectLayer">';
    for (var i = 0; i < prmObj.length; i++) {
        optList += String.format('<li sel_no="{0}"><a><span onclick="selectedAddPurchaseOpt({2},this,\'{0}\')">{1}</span></a></li>', prmObj[i].sel_no, textBind("P", i, prmObj, "N", true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'"), prmIDX);
    }
    rtnVal += String.format('<div class="innerWrap" op_idx="{0}" name="addPurchaseOptionList" style="display:none; {1}">', prmIDX, divStyle);
    rtnVal += '<div class="select_inner">';
    rtnVal += '<ul>';
    rtnVal += optList;
    rtnVal += '</ul>';
    rtnVal += '</div>';
    rtnVal += '</div>';
    rtnVal += '</div>';
    rtnVal += '</div>';
    rtnVal += '</div>';
    rtnVal += '</li>';
    return rtnVal;
}
function selectedAddPurchaseOpt(prmIdx, prmObj, prmSelNo) {
    $("#addPurchaseOptionListMa").find("a[name='addPurchaseOptionListTxt'][op_idx='" + prmIdx + "']").html(String.format('{0}<span class="blind">view</span>', $(prmObj).html()));
    $("#addPurchaseOptionListMa > li[op_idx='" + prmIdx + "']").attr("sel_no", prmSelNo);
    $("#addPurchaseOptionListMa").find("div[name='addPurchaseOptionList']").hide();
}
function ShowAddPurchaseOptInfo(prmIdx, prmType) {
    if ($("#addPurchaseOptionListMa").find("div[name='addPurchaseOptionList'][op_idx='" + prmIdx + "']").css("display") != "block") {
        $("#addPurchaseOptionListMa").find("div[name='addPurchaseOptionList']").hide();
        $("#addPurchaseOptionListMa").find("div[name='addPurchaseOptionList'][op_idx='" + prmIdx + "']").css("display", "block");
        $("#addPurchaseOptionListMa").find("a[name='addPurchaseOptionListTxt'][op_idx='" + prmIdx + "'] span").addClass("up");
    } else {
        $("#addPurchaseOptionListMa").find("div[name='addPurchaseOptionList']").hide();
        $("#addPurchaseOptionListMa").find("a[name='addPurchaseOptionListTxt'][op_idx='" + prmIdx + "'] span").removeClass("up");
    }
}
function ChkAddPurchaseSelectOption() {
    if ($("#extend_warranty_gd_no").val() != "" && $("#addPurchaseOptionMaster").attr("add_type") == "SGNI") {
        var tmpCtl = $("#addPurchaseOptionTextMa > li div input");
        if (tmpCtl != null && tmpCtl.length > 0) {
            for (var i = 0; i < tmpCtl.length; i++) {
                var tmpVal = $(tmpCtl[i]).val();
                if (tmpVal.toString().trim() == "")
                    return false;
            }
        }
        tmpCtl = $("#addPurchaseOptionListMa > li");
        if (tmpCtl != null && tmpCtl.length > 0) {
            for (var i = 0; i < tmpCtl.length; i++) {
                var tmpVal = $(tmpCtl[i]).attr("sel_no");
                if (tmpVal.toString().trim() == "")
                    return false;
            }
        }
    }
    return true;
}
function GetAddPurchaseSelectOption() {
    var tmpTxtOp = "";
    var tmpSelNo = "";
    if ($("#extend_warranty_gd_no").val() != "" && $("#addPurchaseOptionMaster").attr("add_type") == "SGNI") {
        var tmpCtl = $("#addPurchaseOptionTextMa > li");
        if (tmpCtl != null && tmpCtl.length > 0) {
            for (var i = 0; i < tmpCtl.length; i++) {
                var tmpVal = $(tmpCtl[i]).find("div input").val().toString().trim();
                if (tmpVal == "") {
                    alert(MultiLang.findResource("warranty ì˜µì…˜ì„ ì„¤ì • í•´ ì£¼ì„¸ìš”."));
                    return false;
                }
                tmpTxtOp += String.format("{2}{0}({1})", $(tmpCtl[i]).find("label").attr("data-text-value"), tmpVal, ", ");
            }
        }
        tmpCtl = $("#addPurchaseOptionListMa > li");
        if (tmpCtl != null && tmpCtl.length > 0) {
            for (var i = 0; i < tmpCtl.length; i++) {
                var tmpVal = $(tmpCtl[i]).attr("sel_no").toString().trim();
                if (tmpVal == "") {
                    alert(MultiLang.findResource("warranty ì˜µì…˜ì„ ì„¤ì • í•´ ì£¼ì„¸ìš”."));
                    return false;
                }
                tmpSelNo += String.format("{1}{0}", tmpVal, (i > 0 ? "," : ""));
            }
        }
    }
    $("#extend_txt_opt_value").val(tmpTxtOp);
    $("#extend_sel_no").val(tmpSelNo);
    return true;
}
function Trim(string)
{
    for (; string.indexOf(" ") != -1; ) {
        string = string.replace(" ", "");
    }
    return string;
}
function searchOptKeyword_onKeyUp(e, id, opt_nm, info_type)
{
    var select_nm = "";
    if (info_type == "P")
        select_nm = "opt";
    else if (info_type == "I")
        select_nm = "inventory";
    var code;
    if (!e)
        e = window.event
    if (e.keyCode)
        code = e.keyCode;
    else if (e.which)
        code = e.which;
    var target_currency = $get("target_currency").value;
    if (code == 229) {
        return false;
    }
    if (kpoint_index != id) {
        kpoint_index = id;
        kpointer_idx = 1;
    }
    kpointer_idx_max = $("#content_" + select_nm + "_" + id).children().length;
    if (code == 13) {
        $("#content_" + select_nm + "_" + id + " li:nth-child(" + kpointer_idx + ")  a span").click();
    } else {
        var gd_no = $get("gd_no").value;
        var isIong = false;
        if (info_type == "P") {
            var src_opt_nm = "";
            src_opt_nm = Trim($get("src_opt_nm_" + id).value).toLowerCase();
            var param = new RMSParam();
            param.add("goodscode", gd_no);
            param.add("sel_name", opt_nm);
            param.add("info_type", info_type);
            param.add("keyword", "");
            param.add("lang_cd", $get("lang_cd").value);
            param.add("global_order_type", $get("global_order_type").value);
            var ret = null;
            if (opt_ret == null || opt_id != id) {
                ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsAddInfoBySelName", param.toJson());
                opt_ret = ret;
            } else
                ret = opt_ret;
            opt_id = id;
            var searchTxt = "";
            var opt_dt_url = "";
            var opt_img_disp_type = $nget("sel_opt_img_disp_type")[id].value;
            var opt_img_yn = $nget("sel_opt_img_yn")[id].value;
            if (opt_img_disp_type == "N")
                searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
            if (ret != null) {
                for (var i = 0; i < ret.length; i++) {
                    if (ret[i].src_sel_value.toLowerCase().indexOf(src_opt_nm) >= 0) {
                        opt_dt_url = "";
                        if (ret[i].detail_url != null && ret[i].detail_url != "") {
                            opt_dt_url = "<a onclick='if(window.OptionInvenDetailPop) OptionInvenDetailPop(\"" + ret[i].detail_url + "\");' target='_blank' class='btn_newWindow'>new window</a>";
                        }
                        if (isIong == false && textBind(info_type, i, ret, "N", false, false).length > 36) {
                            $("#" + select_nm + "_layer_" + id + " div").width("420px");
                            isIong = true;
                        }
                        if (opt_img_disp_type == "B" && opt_img_yn == "True") {
                            var tmpImgList = ret[i].img_contents_no.split("||");
                            var Img_html = "";
                            var Img_url = "";
                            var t_Img_url = "";
                            if (tmpImgList.length > 0 && tmpImgList[0].toString() != "") {
                                Img_url = Public.getGoodsImagePath(tmpImgList[0].toString(), "L", "N");
                                t_Img_url = Public.getGoodsImagePath(tmpImgList[0].toString(), "LS_S", "N");
                            }
                            if (t_Img_url == "") {
                                Img_html = "<em class=\"thumb\"  id=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" name=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\"></em>";
                            } else {
                                Img_html = "<em class=\"thumb\"  id=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" name=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\"><img src=\"" + t_Img_url + "\" onerror=\"this.src='/gmkt.inc/Img/no_image.gif';\" /></em>";
                            }
                            searchTxt += "<li onmouseover=\"if(window.optLayerOver_optSelect) optLayerOver_optSelect(this);\" onmouseout=\"if(window.optLayerOut_optSelect) optLayerOut_optSelect(this);\"  Img_url=\"" + Img_url + "\">" + opt_dt_url + "<a>" + Img_html + "<span id=\"content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('P', '" + id + "', '" + ret[i].sel_no + "', '" + textBind(info_type, i, ret, "N", true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(info_type, i, ret, "N", false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + ret[i].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + ret[i].sel_item_price + "','" + ret[i].remain_cnt + "','" + ret[i].sel_item_price_oc + "')\">" + textBind(info_type, i, ret, "N", true, true) + "</span></a></li>\r\n";
                            if ($("#ulIndicate li[class^='selected']").length > 0) {
                                ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
                            }
                        } else {
                            searchTxt += "<li onmouseover=\"if(window.optLayerOver) optLayerOver(this);\" onmouseout=\"if(window.optLayerOut) optLayerOut(this);\" >" + opt_dt_url + "<a><span id=\"content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('P', '" + id + "', '" + ret[i].sel_no + "', '" + textBind(info_type, i, ret, "N", true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(info_type, i, ret, "N", false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + ret[i].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + ret[i].sel_item_price + "','" + ret[i].remain_cnt + "','" + ret[i].sel_item_price_oc + "')\">" + textBind(info_type, i, ret, "N", true, true) + "</span></a></li>\r\n";
                        }
                    }
                }
                if (searchTxt != "") {
                    $get("content_" + select_nm + "_" + id + "").innerHTML = searchTxt;
                } else {
                    $get("content_" + select_nm + "_" + id + "").innerHTML = "";
                }
            } else {
                $get("content_" + select_nm + "_" + id + "").innerHTML = "";
            }
        } else if (info_type == "I") {
            var src_opt_nm = "";
            src_opt_nm = Trim($get("src_inventory_nm_" + id).value).toLowerCase();
            var sel_value1 = "";
            var sel_value2 = "";
            var sel_value3 = "";
            var sel_value4 = "";
            var sel_value5 = "";
            var expose_yn = "N";
            var inventory_no = $get("inventory_no").value;
            var sel_count = $nget("inventory_value").length;
            var level = parseInt(id) + 1;
            for (var i = 0; i < sel_count; i++) {
                if (i == 0) {
                    sel_value1 = $nget("" + select_nm + "_value")[i].value;
                } else if (i == 1) {
                    sel_value2 = $nget("" + select_nm + "_value")[i].value;
                } else if (i == 2) {
                    sel_value3 = $nget("" + select_nm + "_value")[i].value;
                } else if (i == 3) {
                    sel_value4 = $nget("" + select_nm + "_value")[i].value;
                } else if (i == 4) {
                    sel_value5 = $nget("" + select_nm + "_value")[i].value;
                }
            }
            if (parseInt(id) == sel_count - 1)
                expose_yn = "Y";
            var ret = null;
            if (inventory_ret != null) {
                for (var i = 0; i < inventory_ret.length; i++) {
                    if (i <= id) {
                        if (i == 0 && inventory_ret[i].sel_value != sel_value1) {
                            inventory_ret = null;
                            break;
                        } else if (i == 1 && inventory_ret[i].sel_value != sel_value1) {
                            inventory_ret = null;
                            break;
                        } else if (i == 2 && inventory_ret[i].sel_value != sel_value2) {
                            inventory_ret = null;
                            break;
                        } else if (i == 3 && inventory_ret[i].sel_value != sel_value3) {
                            inventory_ret = null;
                            break;
                        } else if (i == 4 && inventory_ret[i].sel_value != sel_value4) {
                            inventory_ret = null;
                            break;
                        }
                    }
                }
            }
            if (inventory_ret == null || inventory_id != id || (inventory_ret != null && inventory_ret.length <= 0)) {
                ret = getInventoryData(level, sel_value1, sel_value2, sel_value3, sel_value4, sel_count, "")
                inventory_ret = ret;
            } else
                ret = inventory_ret;
            inventory_id = id;
            if (ret != null) {
                var searchTxt = "";
                var opt_dt_url = "";
                searchTxt = "";
                var inv_img_disp_type = "";
                var inv_img_yn = "";
                var inv_group_type = "";
                var inv_img_view_yn = "";
                if ($get("inventory_img_disp_type_" + id + "") != undefined) {
                    inv_img_disp_type = $get("inventory_img_disp_type_" + id + "").value;
                    inv_img_yn = $get("inventory_img_yn_" + id + "").value;
                    inv_group_type = $get("inventory_group_type_" + id + "").value;
                    inv_img_view_yn = $get("inventory_img_view_yn_" + id + "").value;
                    if (inv_img_disp_type == "N") {
                        searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
                    }
                } else {
                    searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
                }
                $get("header_" + select_nm + "_" + id + "").style.display = "";
                if (ret != null) {
                    for (var i = 0; i < ret.length; i++) {
                        if (ret[i].src_sel_value.toLowerCase().indexOf(src_opt_nm) >= 0) {
                            opt_dt_url = "";
                            if (ret[i].detail_url != null && ret[i].detail_url != "") {
                                opt_dt_url = "<a onclick='if(window.OptionInvenDetailPop) OptionInvenDetailPop(\"" + ret[i].detail_url + "\");' target='_blank' class='btn_newWindow'>new window</a>";
                            }
                            if (isIong == false && textBind(info_type, i, ret, expose_yn, false, false).length > 36) {
                                $("#" + select_nm + "_layer_" + id + " div").width("420px");
                                isIong = true;
                            }
                            searchTxt += GetInventoryLevelHTML(inv_group_type, inv_img_disp_type, inv_img_view_yn, inv_img_yn, ret, i, select_nm, id, info_type, expose_yn);
                        }
                    }
                    if (searchTxt != "") {
                        $get("content_" + select_nm + "_" + id + "").innerHTML = searchTxt;
                    } else {
                        $get("content_" + select_nm + "_" + id + "").innerHTML = "";
                    }
                } else {
                    $get("content_" + select_nm + "_" + id + "").innerHTML = "";
                }
            }
        }
    }
}
function searchOptKeyword(id, opt_nm, info_type)
{
    var select_nm = "";
    var target_currency = $get("target_currency").value;
    if (info_type == "P")
        select_nm = "opt";
    else if (info_type == "I")
        select_nm = "inventory";
    var gd_no = $get("gd_no").value;
    var isIong = false;
    if (info_type == "P") {
        var src_opt_nm = "";
        src_opt_nm = Trim($get("src_opt_nm_" + id).value).toLowerCase();
        var param = new RMSParam();
        param.add("goodscode", gd_no);
        param.add("sel_name", opt_nm);
        param.add("info_type", info_type);
        param.add("keyword", "");
        param.add("lang_cd", $get("lang_cd").value);
        param.add("global_order_type", $get("global_order_type").value);
        var ret = null;
        if (opt_ret == null || opt_id != id) {
            ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsAddInfoBySelName", param.toJson());
            opt_ret = ret;
        } else
            ret = opt_ret;
        opt_id = id;
        var searchTxt = "";
        var opt_dt_url = "";
        var opt_img_disp_type = $nget("sel_opt_img_disp_type")[id].value;
        var opt_img_yn = $nget("sel_opt_img_yn")[id].value;
        if (opt_img_disp_type == "N")
            searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
        if (ret != null) {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].src_sel_value.toLowerCase().indexOf(src_opt_nm) >= 0) {
                    opt_dt_url = "";
                    if (ret[i].detail_url != null && ret[i].detail_url != "") {
                        opt_dt_url = "<a onclick='if(window.OptionInvenDetailPop) OptionInvenDetailPop(\"" + ret[i].detail_url + "\");' target='_blank' class='btn_newWindow'>new window</a>";
                    }
                    if (isIong == false && textBind(info_type, i, ret, "N", false, false).length > 36) {
                        $("#" + select_nm + "_layer_" + idx + " div").width("420px");
                        isIong = true;
                    }
                    if (opt_img_disp_type == "B" && opt_img_yn == "True") {
                        var tmpImgList = ret[i].img_contents_no.split("||");
                        var Img_html = "";
                        var Img_url = "";
                        var t_Img_url = "";
                        if (tmpImgList.length > 0 && tmpImgList[0].toString() != "") {
                            Img_url = Public.getGoodsImagePath(tmpImgList[0].toString(), "L", "N");
                            t_Img_url = Public.getGoodsImagePath(tmpImgList[0].toString(), "LS_S", "N");
                        }
                        if (t_Img_url == "") {
                            Img_html = "<em class=\"thumb\"  id=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" name=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\"></em>";
                        } else {
                            Img_html = "<em class=\"thumb\"  id=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" name=\"Img_content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\"><img src=\"" + t_Img_url + "\" onerror=\"this.src='/gmkt.inc/Img/no_image.gif';\" /></em>";
                        }
                        searchTxt += "<li onmouseover=\"if(window.optLayerOver_optSelect) optLayerOver_optSelect(this);\" onmouseout=\"if(window.optLayerOut_optSelect) optLayerOut_optSelect(this);\"  Img_url=\"" + Img_url + "\">" + opt_dt_url + "<a>" + Img_html + "<span id=\"content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('P', '" + id + "', '" + ret[i].sel_no + "', '" + textBind(info_type, i, ret, "N", true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(info_type, i, ret, "N", false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + ret[i].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + ret[i].sel_item_price + "','0','" + ret[i].sel_item_price_oc + "')\">" + textBind(info_type, i, ret, "N", true, true) + "</span></a></li>\r\n";
                        if ($("#ulIndicate li[class^='selected']").length > 0) {
                            ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
                        }
                    } else {
                        searchTxt += "<li onmouseover=\"if(window.optLayerOver) optLayerOver(this);\" onmouseout=\"if(window.optLayerOut) optLayerOut(this);\">" + opt_dt_url + "<a><span id=\"content_" + select_nm + "_" + id + "_" + ret[i].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('P', '" + id + "', '" + ret[i].sel_no + "', '" + textBind(info_type, i, ret, "N", true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(info_type, i, ret, "N", false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + ret[i].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + ret[i].sel_item_price + "', '0','" + ret[i].sel_item_price_oc + "')\">" + textBind(info_type, i, ret, "N", true, true) + "</span></a></li>\r\n";
                    }
                }
            }
            if (searchTxt != "") {
                $get("content_" + select_nm + "_" + id + "").innerHTML = searchTxt;
            } else {
                $get("content_" + select_nm + "_" + id + "").innerHTML = "";
            }
        } else {
            $get("content_" + select_nm + "_" + id + "").innerHTML = "";
        }
    } else if (info_type == "I") {
        var src_opt_nm = "";
        src_opt_nm = Trim($get("src_inventory_nm_" + id).value).toLowerCase();
        var sel_value1 = "";
        var sel_value2 = "";
        var sel_value3 = "";
        var sel_value4 = "";
        var sel_value5 = "";
        var expose_yn = "N";
        var inventory_no = $get("inventory_no").value;
        var sel_count = $nget("inventory_value").length;
        var level = parseInt(id) + 1;
        for (var i = 0; i < sel_count; i++) {
            if (i == 0) {
                sel_value1 = $nget("" + select_nm + "_value")[i].value;
            } else if (i == 1) {
                sel_value2 = $nget("" + select_nm + "_value")[i].value;
            } else if (i == 2) {
                sel_value3 = $nget("" + select_nm + "_value")[i].value;
            } else if (i == 3) {
                sel_value4 = $nget("" + select_nm + "_value")[i].value;
            } else if (i == 4) {
                sel_value5 = $nget("" + select_nm + "_value")[i].value;
            }
        }
        if (parseInt(id) == sel_count - 1)
            expose_yn = "Y";
        var ret = null;
        if (inventory_ret != null) {
            for (var i = 0; i < inventory_ret.length; i++) {
                if (i <= id) {
                    if (i == 0 && inventory_ret[i].sel_value != sel_value1) {
                        inventory_ret = null;
                        break;
                    } else if (i == 1 && inventory_ret[i].sel_value != sel_value1) {
                        inventory_ret = null;
                        break;
                    } else if (i == 2 && inventory_ret[i].sel_value != sel_value2) {
                        inventory_ret = null;
                        break;
                    } else if (i == 3 && inventory_ret[i].sel_value != sel_value3) {
                        inventory_ret = null;
                        break;
                    } else if (i == 4 && inventory_ret[i].sel_value != sel_value4) {
                        inventory_ret = null;
                        break;
                    }
                }
            }
        }
        if (inventory_ret == null || inventory_id != id || (inventory_ret != null && inventory_ret.length <= 0)) {
            ret = getInventoryData(level, sel_value1, sel_value2, sel_value3, sel_value4, sel_count, "")
            inventory_ret = ret;
        } else
            ret = inventory_ret;
        inventory_id = id;
        if (ret != null) {
            var searchTxt = "";
            var opt_dt_url = "";
            searchTxt = "";
            var inv_img_disp_type = "";
            var inv_img_yn = "";
            var inv_group_type = "";
            var inv_img_view_yn = "";
            if ($get("inventory_img_disp_type_" + id + "") != undefined) {
                inv_img_disp_type = $get("inventory_img_disp_type_" + id + "").value;
                inv_img_yn = $get("inventory_img_yn_" + id + "").value;
                inv_group_type = $get("inventory_group_type_" + id + "").value;
                inv_img_view_yn = $get("inventory_img_view_yn_" + id + "").value;
                if (inv_img_disp_type == "N") {
                    searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
                }
            } else {
                searchTxt += "<li>-------------------------------------------------------------</li>\r\n";
            }
            $get("header_" + select_nm + "_" + id + "").style.display = "";
            if (ret != null) {
                for (var i = 0; i < ret.length; i++) {
                    if (ret[i].src_sel_value.toLowerCase().indexOf(src_opt_nm) >= 0) {
                        opt_dt_url = "";
                        if (ret[i].detail_url != null && ret[i].detail_url != "") {
                            opt_dt_url = "<a onclick='if(window.OptionInvenDetailPop) OptionInvenDetailPop(\"" + ret[i].detail_url + "\");' target='_blank' class='btn_newWindow'>new window</a>";
                        }
                        if (isIong == false && textBind(info_type, i, ret, "N", false, false).length > 36) {
                            $("#" + select_nm + "_layer_" + id + " div").width("420px");
                            isIong = true;
                        }
                        searchTxt += GetInventoryLevelHTML(inv_group_type, inv_img_disp_type, inv_img_view_yn, inv_img_yn, ret, i, select_nm, id, info_type, expose_yn);
                    }
                }
                if (searchTxt != "") {
                    $get("content_" + select_nm + "_" + id + "").innerHTML = searchTxt;
                } else {
                    $get("content_" + select_nm + "_" + id + "").innerHTML = "";
                }
            } else {
                $get("content_" + select_nm + "_" + id + "").innerHTML = "";
            }
        }
    }
}
function textBind(sel_type, i, ret, expose_yn, isClientValue, isCurrency)
{
    var textBind = "";
    var sel_item_price = 0;
    var remain_cnt = 0;
    var sSelValue = isClientValue ? ret[i].client_sel_value : ret[i].sel_value;
    var target_currency = $get("target_currency").value;
    if (sel_type == "I" && expose_yn == "Y") {
        var tmpQtyText = "";
        if (ret[i].remain_cnt <= 0) {
            tmpQtyText = " - " + MultiLang.findResource("OutOfStock");
        } else {
            var tmpInventoryQtyOpen = "Y";
            if ($get("inventory_qty_open") != null) {
                tmpInventoryQtyOpen = $get("inventory_qty_open").value;
            }
            if (tmpInventoryQtyOpen == "Y") {
                tmpQtyText = " - " + MultiLang.findResource("Quantity") + " : " + ret[i].remain_cnt;
            }
        }
        if (ret[i].sel_item_price > 0)
            textBind = sSelValue + "(+" + PriceUtil.FormatCurrencyCode(ret[i].sel_item_price, target_currency) + ")" + tmpQtyText;
        else if (ret[i].sel_item_price < 0)
            textBind = sSelValue + "(" + PriceUtil.FormatCurrencyCode(ret[i].sel_item_price, target_currency) + ")" + tmpQtyText;
        else
            textBind = sSelValue + tmpQtyText;
    } else {
        if (ret[i].sel_item_price > 0)//tuetc
            textBind = sSelValue + "(+" + PriceUtil.FormatCurrencyCode(ret[i].sel_item_price, target_currency) + ")";
        else if (ret[i].sel_item_price < 0)
            textBind = sSelValue + "(" + PriceUtil.FormatCurrencyCode(ret[i].sel_item_price, target_currency) + ")";
        else
            textBind = sSelValue;
    }
    return textBind;
}
function OptionInvenDetailPop(prmUrl)
{
    if (prmUrl.indexOf("http") < 0) {
        prmUrl = "http://" + prmUrl;
    }
    window.open(prmUrl, "Detail", "top=200,left=200");
}
function OpenEarlyBirdTxt()
{
    if ($get("div_earlybird_info")) {
        if ($get("div_earlybird_info").style.display == "none")
            $get("div_earlybird_info").style.display = "block";
        else
            $get("div_earlybird_info").style.display = "none";
    }
}
function CloseEarlyBirdTxt()
{
    if ($get("div_earlybird_info"))
        $get("div_earlybird_info").style.display = "none";
}
function OpenQDiscountLayer()
{
    $("#q_discount_help").removeClass("g_disNone");
}
function CloseQDiscountLayer()
{
    $("#q_discount_help").addClass("g_disNone");
}
function OpenQDiscountLayerSub(type)
{
    if (type == 1) {
        $("#q_discount_help_sub").css("top", "50px");
        $("#q_discount_help_sub").removeClass("g_disNone");
    } else if (type == 2) {
        $("#q_discount_help_sub").css("top", "0px");
        $("#q_discount_help_sub").removeClass("g_disNone");
    }
}
function CloseQDiscountLayerSub()
{
    $("#q_discount_help_sub").addClass("g_disNone");
}
function InitDiscountControlStyle()
{
    if ($get("__applyBtnQD") != null) {
        $get("__applyBtnQD").style.display = "";
    }
    if ($get("__appliedBtnQD") != null) {
        $get("__appliedBtnQD").style.display = "none";
    }
    if ($get("__cancelBtnQD") != null) {
        $get("__cancelBtnQD").style.display = "none";
    }
    if ($get("__applyBtnTD") != null) {
        $get("__applyBtnTD").style.display = "";
    }
    if ($get("__appliedBtnTD") != null) {
        $get("__appliedBtnTD").style.display = "none";
    }
    if ($get("__cancelBtnTD") != null) {
        $get("__cancelBtnTD").style.display = "none";
    }
}
var orgCostBasisNo = "";
var orgBasisType = "";
var orgCostPrice = null;
var orgDiscountedPrice = null;
var orgAddDiscountHTML = "";
function ApplyDiscountBtn_Click(prmCostBasisNo, prmType, prmDeductionType) {
    var target_currency = $get("target_currency").value;
    var svc_currency = GMKT.ServiceInfo.currencyCode;
    var cost_price_oc = 0;
    var cost_price_text = "";
    InitDiscountControlStyle();
    var cost_basis_no_for_return = $get("cost_basis_no").value;
    var param = new RMSParam();
    param.add("gd_no", $get("gd_no").value);
    param.add("disType", prmType);
    param.add("cost_basis_no", prmCostBasisNo);
    param.add("global_order_type", $get("global_order_type").value);
    var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsDiscountCheckUsable", param.toJson());
    if (ret != null && ret.Rows != null && ret.Rows.length > 0) {
        var deduction_type = ret.Rows[0].deduction_type;
        var sell_price = ret.Rows[0].sell_price;
        var sell_price_oc = ret.Rows[0].sell_price_oc;
        var cost_basis_no = ret.Rows[0].cost_basis_no;
        var cost_price = 0;
        if (prmType != "GD") {
            cost_price = PriceUtil.PriceCuttingCode((ret.Rows[0].cost_price + parseFloat($get("goods_normal_cost_price").value)), target_currency);
            cost_price_oc = PriceUtil.PriceCuttingCode((ret.Rows[0].cost_price_oc + parseFloat($get("goods_normal_cost_price_oc").value)), svc_currency);
        } else {
            cost_price = PriceUtil.PriceCuttingCode(ret.Rows[0].cost_price, target_currency);
            cost_price_oc = PriceUtil.PriceCuttingCode(ret.Rows[0].cost_price_oc, svc_currency);
        }
        var goods_normal_cost_price = 0;
        var discount_price_oc = 0;
        var discount_price = 0;
        var discount_result = 0;
        QPrice.deduction_type = deduction_type;
        QPrice.cost_basis_no = prmCostBasisNo;
        QPrice.cost_basis_type = prmType;
        if (prmType == "QD" && (deduction_type == "ST" || deduction_type == "LF")) {
            QPrice.DEDUCTION_TYPE_FOR_ORDER = deduction_type;
            QPrice.COST_BASIS_NO_FOR_ORDER = prmCostBasisNo;
            QPrice.COST_BASIS_TYPE_FOR_ORDER = prmType;
        }
        if ($sget("discount_list_info") != undefined && $sget("discount_list_info") != null && $sget("discount_add_box_attr") != undefined && $sget("discount_add_box_attr") != null && $sget("discount_add_box_attr").style.display == "none")
        {
            $sget("discount_add_box_attr").style.display = "";
        }
        if (cost_price > 0) {
            discount_result = PriceUtil.PriceCuttingCode(cost_price, target_currency);
            discount_price = PriceUtil.PriceCuttingCode(sell_price - cost_price, target_currency);
            discount_price_oc = PriceUtil.PriceCuttingCode(sell_price_oc - cost_price_oc, svc_currency);
            var tmp_basis_cnt = PageVariable.gd_discount_basis_cnt;
            var tmp_order_limit_cnt = PageVariable.gd_order_limit_cnt;
            if (ret.Rows[0].basis_cnt != "" && ret.Rows[0].basis_cnt > 0) {
                var basis_cnt = ret.Rows[0].basis_cnt
                if (tmp_basis_cnt == null || parseInt(tmp_basis_cnt) > parseInt(basis_cnt)) {
                    tmp_basis_cnt = parseInt(basis_cnt);
                }
            }
            if (tmp_basis_cnt != null) {
                if (parseInt(tmp_basis_cnt) > parseInt(PageVariable.goods_min_sell_amt))
                    tmp_basis_cnt = parseInt(PageVariable.goods_min_sell_amt);
            }
            if (ret.Rows[0].order_limit_cnt != "" && ret.Rows[0].order_limit_cnt != null && ret.Rows[0].order_limit_cnt > 0) {
                if (tmp_order_limit_cnt == null || parseInt(tmp_order_limit_cnt) > parseInt(ret.Rows[0].order_limit_cnt)) {
                    tmp_order_limit_cnt = parseInt(ret.Rows[0].order_limit_cnt);
                }
            }
            cost_price_text = getEarlyBirdHTML(tmp_basis_cnt, tmp_order_limit_cnt);
            var cost_basis_no_s = cost_basis_no;
            var basic_cost_basis_no = $("#basic_cost_basis_no").val();
            if (basic_cost_basis_no > 0 && basic_cost_basis_no != cost_basis_no) {
                cost_basis_no_s = basic_cost_basis_no + "" + cost_basis_no;
            }
            $get("cost_basis_no").value = cost_basis_no_s;
            $get("discounted_price").value = discount_price;
            $get("discounted_price_oc").value = discount_price_oc;
            if (!(prmType == "QD" && deduction_type == "LF"))
            {
                $get("goods_dc_cost_basis_no").value = prmCostBasisNo;
                $get("goods_dc_cost_basis_type").value = prmType;
            }
            if (prmType == "QD") {
                var tmp_type = prmType;
                if (deduction_type == "ST") {
                    tmp_type = "QC";
                    if (prmDeductionType == "ST") {
                        if (!QPrice.chkQPriceCondition($("#order_cnt").val())) {
                            var $del_row = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
                            if ($del_row.length > 0) {
                                var last_idx = $del_row.eq($del_row.length - 1).attr("idx");
                                var $target_row = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][cost_basis_no='" + QPrice.cost_basis_no + "'] ");
                                var target_idx = $target_row.eq($target_row.length - 1).attr("idx");
                                if (last_idx == target_idx && $target_row.eq($target_row.length - 1).attr("qty") == $("#order_cnt").val())
                                    DelSelectOptionList(target_idx);
                            }
                            if ($get("__applyBtn" + prmType).style.display == "") {
                                $get("__applyBtn" + prmType).style.display = "";
                                $get("__cancelBtn" + prmType).style.display = "none";
                                QPrice.deduction_type = "";
                                QPrice.cost_basis_no = 0;
                                QPrice.cost_basis_type = "";
                                $get("cost_basis_no").value = cost_basis_no_for_return;
                                $get("discounted_price").value = $get("sell_price").value;
                                $get("discounted_price_oc").value = $get("sell_price_oc").value;
                                $get("goods_dc_cost_basis_no").value = orgCostBasisNo;
                                $get("goods_dc_cost_basis_type").value = orgBasisType;
                            } else if ($get("__cancelBtn" + prmType).style.display == "") {
                                $get("__applyBtn" + prmType).style.display = "none";
                                $get("__cancelBtn" + prmType).style.display = "";
                            }
                            return;
                        }
                    }
                } else if (deduction_type == "FW") {
                    tmp_type = "FW";
                    if (QD_FW.IsPassworded()) {
                        if (!QD_FW.CERTIFIED) {
                            OpenPrmPasswordLayer();
                            CancelDiscountBtn_Click(true);
                            return;
                        }
                    } else {
                        if (!QD_FW.CheckFollowShop()) {
                            $get("cost_basis_no").value = cost_basis_no_for_return;
                            $get("discounted_price").value = $get("sell_price").value;
                            $get("discounted_price_oc").value = $get("sell_price_oc").value;
                            $get("goods_dc_cost_basis_no").value = orgCostBasisNo;
                            $get("goods_dc_cost_basis_type").value = orgBasisType;
                            return;
                        }
                    }
                    QD_FW.APPLIED = true;
                } else if (deduction_type == "MQ") {
                    tmp_type = "MQ";
                    QD_MQ.APPLIED = true;
                    QD_MQ.cost_basis_no = prmCostBasisNo;
                    QD_MQ.tid = $("#mameq_tid").val();
                    QD_MQ.need_mameq_cnt = $("#need_mameq_cnt").val();
                } else if (deduction_type == "LF") {
                    tmp_type = "LF";
                    QD_LF.APPLIED = true;
                    QD_LF.cost_basis_no = prmCostBasisNo;
                    QD_LF.Token_tid = $("#mameq_tid").val();
                    QD_LF.need_Token_cnt = $("#need_mameq_cnt").val();
                    if (QD_LF.Token_tid > 0) {
                        var my_token_cnt = 0;
                        var param = new RMSParam();
                        param.add("tid", QD_LF.Token_tid);
                        var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_EventAjaxService.asmx"), "GetMyETokenCount", param.toJson());
                        if (result != null && result.Rows.length > 0) {
                            my_token_cnt = result.Rows[0]["amount"];
                        }
                        if (parseInt(QD_LF.need_Token_cnt) > parseInt(my_token_cnt)) {
                            CancelDiscountBtn_Click(true);
                            if ($get("ly_mamego_cnt_failed") != null)
                            {
                                $("#ly_mamego_cnt_failed").show();
                            }
                            return false;
                        } else {
                            $get("goods_dc_cost_basis_no").value = prmCostBasisNo;
                            $get("goods_dc_cost_basis_type").value = prmType;
                        }
                    }
                } else if (deduction_type == "ES") {
                    tmp_type = "ES";
                    QD_ES.APPLIED = true;
                    QD_ES.cost_basis_no = prmCostBasisNo;
                    QD_ES.eid = PageVariable.event_sale_eid;
                    if (PageVariable.event_sale_eid > 0)
                    {
                        var resultData = RMSHelper.dynamic.executeToDataTable("Event.GetEventApplicantWinnerForQdiscount", RMSParam.create().add("eid", PageVariable.event_sale_eid));
                        var result = resultData.ReturnData;
                        if (result != null && result.Rows != null && result.Rows.length > 0)
                        {
                            var winner_yn = result.Rows[0]["attend_dt"] == "" ? "N" : "Y";
                            var event_url = result.Rows[0]["event_url"];
                            var event_nm = result.Rows[0]["event_nm"];
                            if (winner_yn == "N")
                            {
                                if (event_url == null || event_url == "")
                                {
                                    alert(String.format(MultiLang.findResource("Alert_Event_Sale"), event_nm));
                                    CancelDiscountBtn_Click(true);
                                    return false;
                                } else
                                {
                                    CancelDiscountBtn_Click(true);
                                    if (confirm(String.format(MultiLang.findResource("Alert_Event_Sale_page"), event_nm))) {
                                        window.open(event_url, "EventPage", "");
                                    }
                                    return false;
                                }
                            }
                        }
                    }
                    cost_price_text += " <a id=\"__cancelBtnQD\" onclick=\"CancelDiscountBtn_Click(true);\" class=\"bt bt17_20 gray\"><span>" + MultiLang.findResource("Cancel") + "<em class=\"ic_del\"></em></span></a>";
                    $sget("discount_add_box_attr").style.display = "none";
                } else if (deduction_type == "QC") {
                    tmp_type = "QC";
                }
                if ($sget("discount_info")) {
                    $sget("discount_info").innerHTML = getDiscountInfo(PriceUtil.FormatCurrencyCode(discount_price - goods_normal_cost_price, target_currency), tmp_type, cost_price_text, discount_price - goods_normal_cost_price);
                }
            } else if (prmType == "PD") {
                if ($sget("discount_info")) {
                    $sget("discount_info").innerHTML = getDiscountInfo(PriceUtil.FormatCurrencyCode(discount_price - goods_normal_cost_price, target_currency), prmType, cost_price_text, discount_price - goods_normal_cost_price);
                }
            } else {
                if ($sget("discount_info")) {
                    if (prmType == "TD") {
                        $sget("discount_info").innerHTML = getDiscountInfo(PriceUtil.FormatCurrencyCode(discount_price - goods_normal_cost_price, target_currency), prmType, cost_price_text, discount_price - goods_normal_cost_price);
                    } else {
                        $sget("discount_info").innerHTML = getDiscountInfo(PriceUtil.FormatCurrencyCode(discount_price, target_currency), prmType, cost_price_text, discount_price);
                    }
                }
            }
            if (prmType != "GD" && prmType != "PD") {
                if ($get("__applyBtn" + prmType) != null) {
                    $get("__applyBtn" + prmType).style.display = "none";
                }
                if ($get("__appliedBtn" + prmType) != null) {
                    $get("__appliedBtn" + prmType).style.display = "none";
                }
                if ($get("__cancelBtn" + prmType) != null) {
                    $get("__cancelBtn" + prmType).style.display = "";
                }
            }
        }
    } else {
        if (prmType == "TD" && $get("time_sale_period") != null) {
            alert(String.format(MultiLang.findResource("alert_time_sale1"), $get("time_sale_period").innerHTML));
        }
    }
    var cost_basis_no_for_return = $get("cost_basis_no").value;
    var isJaehuDiscountUsed = false;
    var param = new RMSParam();
    param.add("gd_no", $get("gd_no").value);
    param.add("target_currency", $get("target_currency").value);
    param.add("global_order_type", $get("global_order_type").value);
    var ret_jaehu = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetJaehuDiscountInfo", param.toJson());
    if (ret_jaehu != null && ret_jaehu.Rows != null && ret_jaehu.Rows.length > 0)
    {
        var sell_price = ret_jaehu.Rows[0].sell_price;
        var sell_price_oc = ret_jaehu.Rows[0].sell_price_oc;
        var cost_price_jaehu = PriceUtil.PriceCuttingCode(parseFloat(sell_price) - parseFloat(ret_jaehu.Rows[0].cost_price_jaehu), target_currency);
        var cost_price_jaehu_oc = PriceUtil.PriceCuttingCode(parseFloat(sell_price_oc) - parseFloat(ret_jaehu.Rows[0].cost_price_jaehu_oc), svc_currency);
        if (cost_price_jaehu_oc > 0) {
            if (parseFloat(sell_price_oc) - parseFloat(cost_price_oc) > cost_price_jaehu_oc) {
                if ($sget("discount_info")) {
                    isJaehuDiscountUsed = true;
                    PageVariable.jaehu_discount_yn = "Y";
                    PageVariable.jaehu_discounted_price = cost_price_jaehu;
                    PageVariable.jaehu_discounted_price_oc = cost_price_jaehu_oc;
                    $sget("discount_info").innerHTML = getDiscountInfo(PriceUtil.FormatCurrencyCode(cost_price_jaehu, target_currency), "JCD", cost_price_text, cost_price_jaehu);
                }
            }
        }
    }
    if (!isJaehuDiscountUsed) {
        PageVariable.jaehu_discount_yn = "N";
        PageVariable.jaehu_discounted_price = 0;
        PageVariable.jaehu_discounted_price_oc = 0;
    }
    if ($get("btn_goMyCoupon") != null) {
        $get("btn_goMyCoupon").style.display = "";
    }
    if ($get("btn_goMyCouponChange") != null) {
        $get("btn_goMyCouponChange").style.display = "none";
    }
    $get("coupon_no").value = "";
    updateShippingFeeConditionText();
    UpdateCouponState();
    if ($get("btn_goMyCoupon") != null) {
        $get("btn_goMyCoupon").style.display = "";
    }
    if ($get("btn_goMyCouponChange") != null) {
        $get("btn_goMyCouponChange").style.display = "none";
    }
    $get("coupon_no").value = "";
    try {
        if ($("li[name='ship_select_li']") != undefined) {
            if ($get("global_order_type").value == "G" || ($get("global_order_type").value == "L" && GMKT.ServiceInfo.nation == "US")) {
                ShippingTo.selectShip($get("ship_select_li_" + $get("selected_nation_cd").value), $get("selected_nation_cd").value, 0, "O");
            }
        }
    } catch (e) {
    }
}
function CancelDiscountBtn_Click(prmInit) {
    if (prmInit != null && prmInit) {
        if (orgCostBasisNo != "" && orgBasisType != "") {
            ApplyDiscountBtn_Click(orgCostBasisNo, orgBasisType, "");
        } else {
            InitDiscountControlStyle();
            if ($sget("discount_info") != null) {
                $sget("discount_info").innerHTML = "";
            }
            $get("goods_dc_cost_basis_no").value = orgCostBasisNo;
            $get("goods_dc_cost_basis_type").value = orgBasisType;
            $get("discounted_price").value = $get("sell_price").value;
            $get("discounted_price_oc").value = $get("sell_price_oc").value;
            if (QPrice.DEDUCTION_TYPE_FOR_ORDER == "ST" || QPrice.DEDUCTION_TYPE_FOR_ORDER == "LF") {
                $("#cost_basis_no").val(0);
            }
            if (QD_MQ.tid > 0) {
                $("#cost_basis_no").val(0);
            }
            if (QD_FW.APPLIED == true) {
                $("#cost_basis_no").val(0);
            }
            if (QD_LF.APPLIED == true) {
                $("#cost_basis_no").val(0);
            }
            if (QD_ES.APPLIED == true) {
                $("#cost_basis_no").val(0);
            }
            if ($sget("discount_add_box_attr") != null && $sget("discount_add_box_attr") != undefined && $sget("discount_add_box_attr").style.display == "none") {
                $sget("discount_add_box_attr").style.display = "";
            }
            $("#cost_basis_no").val(0);
            QPrice.deduction_type = "";
            QPrice.cost_basis_no = orgCostBasisNo;
            QPrice.cost_basis_type = orgBasisType;
        }
        QD_FW.CERTIFIED = false;
    } else {
        if (($get("goods_dc_cost_basis_no").value != "" && $get("goods_dc_cost_basis_type").value != "") || PageVariable.jaehu_discount_yn == "Y") {
            ApplyDiscountBtn_Click($get("goods_dc_cost_basis_no").value, $get("goods_dc_cost_basis_type").value);
        } else {
            InitDiscountControlStyle();
            if ($sget("discount_info") != null) {
                $sget("discount_info").innerHTML = "";
            }
            $get("goods_dc_cost_basis_no").value = orgCostBasisNo;
            $get("goods_dc_cost_basis_type").value = orgBasisType;
            $get("discounted_price").value = $get("sell_price").value;
            $get("discounted_price_oc").value = $get("sell_price_oc").value;
            if (QPrice.DEDUCTION_TYPE_FOR_ORDER == "ST") {
                $("#cost_basis_no").val(0);
            }
            if (QD_MQ.tid > 0) {
                $("#cost_basis_no").val(0);
            }
            if (QD_FW.APPLIED == true) {
                $("#cost_basis_no").val(0);
            }
            if (QD_LF.APPLIED == true) {
                $("#cost_basis_no").val(0);
            }
            if (QD_ES.APPLIED == true) {
                $("#cost_basis_no").val(0);
            }
            $("#cost_basis_no").val(0);
            QPrice.deduction_type = "";
            QPrice.cost_basis_no = orgCostBasisNo;
            QPrice.cost_basis_type = orgBasisType;
            if ($sget("discount_add_box_attr") != null && $sget("discount_add_box_attr") != undefined && $sget("discount_add_box_attr").style.display == "none") {
                $sget("discount_add_box_attr").style.display = "";
            }
        }
    }
    QD_MQ.APPLIED = false;
    QD_FW.APPLIED = false;
    QD_LF.APPLIED = false;
    QD_ES.APPLIED = false;
    updateShippingFeeConditionText();
    UpdateCouponState();
}
function getDiscountTypeText(prmType)
{
    var discountType = "";
    switch (prmType) {
        case"PD":
            discountType = MultiLang.findResource("Promotion Discount");
            break;
            case"QD":
            discountType = MultiLang.findResource("Q-Discount Price");
            break;
            case"TD":
            discountType = MultiLang.findResource("Time Sale");
            break;
            case"GD":
            discountType = MultiLang.findResource("ItemDiscount");
            default:
            break;
        }
    return discountType;
}
function getDiscountedTypeText(prmType) {
    var discountType = "";
    switch (prmType) {
        case"PD":
            discountType = MultiLang.findResource("Deal Price");
            break;
            case"QC":
            discountType = MultiLang.findResource("Qprime Price");
            break;
            case"QD":
            discountType = MultiLang.findResource("Qclub Price");
            break;
            case"TD":
            discountType = MultiLang.findResource("Time Sale Price");
            break;
            case"GD":
            discountType = MultiLang.findResource("Sale Price");
            break;
            case"QC":
            discountType = MultiLang.findResource("Q-Chance Price");
            break;
            case"FW":
            discountType = MultiLang.findResource("Fellow Price");
            break;
            case"MQ":
            discountType = MultiLang.findResource("Q-Chance Price");
            break;
            case"LF":
            if (QD_LF.Token_tid > 0)
            {
                discountType = MultiLang.findResource("MameGo Price");
            } else
            {
                discountType = "Qtalk Live Sale";
            }
            break;
            case"JCD":
            discountType = MultiLang.findResource("Affiliate Discount");
            break;
            case"ES":
            discountType = MultiLang.findResource("Event Sale");
            break;
            default:
            discountType = MultiLang.findResource("Discount Price");
            break;
        }
    return discountType;
}
function getApplyDiscountInfo(cost_price, kind, cost_price_text)
{
    var discountText = "";
    if (kind == "QD") {
        discountText = "<dl class=\"detailsArea q_dcprice\">";
        discountText += "<dt><div class=\"layerWrap\" style=\"z-index:31;\"><strong>" + getDiscountTypeText(kind) + "</strong>";
        discountText += "";
        discountText += "</div></dt><dd>";
        discountText += "<strong><em>" + cost_price + "</em>" + " " + cost_price_text + "</strong>";
        discountText += "</dd>";
        discountText += "</dl>";
    } else {
        discountText = discountText + "<div class=\"ls_dc\">\r\n <ul>";
        discountText = discountText + "<li><em>âˆ™ " + getDiscountTypeText(kind) + " </em>";
        discountText = discountText + cost_price + " " + MultiLang.findResource("off") + " " + cost_price_text + " </li>\r\n";
        discountText = discountText + "</div>";
    }
    return discountText;
}
function getEarlyBirdHTML(prmBasisCnt, prmOrder_limit_cnt)
{
    var rtnValue = "";
    var tmp_text = "";
    if (prmBasisCnt != null && prmBasisCnt != "")
    {
        tmp_text = String.format(MultiLang.findResource("qty left"), prmBasisCnt);
    }
    if (prmOrder_limit_cnt != null && prmOrder_limit_cnt != "")
    {
        if (tmp_text != "")
            tmp_text += ", ";
        tmp_text += String.format(MultiLang.findResource("order_limit_cnt"), prmOrder_limit_cnt);
    }
    if (tmp_text != "")
    {
        rtnValue = "<span class=\"black\" sizecache=\"39\" sizeset=\"315\"> (" + tmp_text + ") </span>";
    }
    return rtnValue;
}
function ShowRelationInfo(prmType)
{
    if ($get("span_goods_relation_list") == null) {
        return;
    }
    if (prmType == null) {
        if ($("#span_goods_relation_list .innerWrap").css("display") == "none") {
            $("#span_goods_relation_list .innerWrap").show();
            $("#span_goods_relation_blind").removeClass("blind");
            $("#span_goods_relation_blind").addClass("blind up");
            var tmpInventory_count = $nget("inventory_value").length;
            var tmpOpt_count = $nget("sel_no").length;
            for (var i = 0; i < tmpInventory_count; i++) {
                $("#inventory_layer_" + i + " .innerWrap").hide();
            }
            for (var i = 0; i < tmpOpt_count; i++) {
                $("#opt_layer_" + i + " .innerWrap").hide();
            }
        } else {
            $("#span_goods_relation_list .innerWrap").hide();
            $("#span_goods_relation_blind").removeClass("blind up");
            $("#span_goods_relation_blind").addClass("blind");
        }
    } else if (prmType == "sh") {
        $("#span_goods_relation_list .innerWrap").show();
        $("#span_goods_relation_blind").removeClass("blind");
        $("#span_goods_relation_blind").addClass("blind up");
    } else if (prmType == "hi") {
        $("#span_goods_relation_list .innerWrap").hide();
        $("#span_goods_relation_blind").removeClass("blind up");
        $("#span_goods_relation_blind").addClass("blind");
    }
}
function selectedRelationInfo(obj, prmGdNo, prmPrice)
{
    $("#ul_goods_relation_list").children().removeClass("selected");
    $(obj).parent().parent().addClass("selected");
    $get("a_select_goods_relation_title").innerHTML = obj.innerHTML + '<span id="span_goods_relation_blind" class="blind">view</span>';
    ShowRelationInfo();
    if (prmGdNo != null && prmGdNo != "") {
        $get("ul_AddToCartRelationGoodsList").style.display = "";
        SetAddToCartRelationGoodsList(prmGdNo, prmPrice, obj.innerHTML);
    }
}
var tmpSeqIdx = 0;
function SetAddToCartRelationGoodsList(prmGdNo, prmPrice, prmGdNm)
{
    tmpSeqIdx++;
    var tmpHtml = "";
    tmpHtml += "<table summary='Plus Shopping Table' class='' name='tbl_rlGoods' id='tbl_rlGoods_" + tmpSeqIdx + "' goodscode='" + prmGdNo + "' price='" + prmPrice + "' idx='" + tmpSeqIdx + "'>"
            + "<colgroup>"
            + "<col width='' />"
            + "<col width='63' />"
            + "<col width='70' />"
            + "<col width='26' />"
            + "</colgroup>";
    tmpHtml += "<tr>"
            + "<td><em>" + prmGdNm + "</em></td>"
            + "<td>"
            + "<div class='ctrlArea'>"
            + "<input type='text' class='textType' style='width:33px;' id='txt_rlGoods_" + tmpSeqIdx + "' value='1' />"
            + "<a onclick='if(window.btn_rlGoodsPlus) btn_rlGoodsPlus(\"" + tmpSeqIdx + "\");' class='up'>plus count</a>"
            + "<a onclick='if(window.btn_rlGoodsMinus) btn_rlGoodsMinus(\"" + tmpSeqIdx + "\");' class='down'>minus count</a>"
            + "</div>"
            + "</td>"
            + "<td><span>" + PriceUtil.FormatCurrencySymbol(prmPrice) + "</span></td>"
            + "<td><a class='btn_del' onclick='if(window.DelToCartRelationGoodsList) DelToCartRelationGoodsList(\"" + tmpSeqIdx + "\");'>delete</a></td>"
            + "</tr></table>";
    if ($("table[name^='tbl_rlGoods']") == null || $("table[name^='tbl_rlGoods']").length <= 0) {
        $("#hd_tbl_rlGoods").after(tmpHtml);
    } else {
        $($("table[name^='tbl_rlGoods']")[($("table[name^='tbl_rlGoods']").length - 1)]).after(tmpHtml);
    }
    if ($get("DirectOrderBtn") != null) {
        $get("DirectOrderBtn").style.display = "none";
    }
}
function btn_rlGoodsPlus(num)
{
    if ($get("txt_rlGoods_" + num) == null) {
        return;
    }
    var order_cnt = $get("txt_rlGoods_" + num).value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("txt_rlGoods_" + num).value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    i_order_cnt = i_order_cnt + 1;
    if (i_order_cnt > 999) {
        alert(MultiLang.findResource("alert_msg_5"));
        return;
    }
    $get("txt_rlGoods_" + num).value = i_order_cnt.toString();
}
function btn_rlGoodsMinus(num)
{
    if ($get("txt_rlGoods_" + num) == null) {
        return;
    }
    var order_cnt = $get("txt_rlGoods_" + num).value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("txt_rlGoods_" + num).value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    if (i_order_cnt == 1) {
        alert(MultiLang.findResource("alert_msg_6"));
        return;
    }
    i_order_cnt = +i_order_cnt - 1;
    $get("txt_rlGoods_" + num).value = i_order_cnt.toString();
}
function DelToCartRelationGoodsList(prmObj)
{
    $($get("tbl_rlGoods_" + prmObj)).remove();
    if ($get("multi_order_yn").value == "N" && ($("table[name^='tbl_rlGoods']") == null || $("table[name^='tbl_rlGoods']").length <= 0)) {
        if ($get("DirectOrderBtn") != null) {
            $get("DirectOrderBtn").style.display = "";
        }
        $get("ul_AddToCartRelationGoodsList").style.display = "none";
        $("#ul_goods_relation_list").children().removeClass("selected");
        $get("a_select_goods_relation_title").innerHTML = MultiLang.findResource("Please select") + '<span id="span_goods_relation_blind" class="blind">view</span>';
    }
}
function searchRelationGoods_onKeyUp(e)
{
    var code;
    if (!e)
        e = window.event
    if (e.keyCode)
        code = e.keyCode;
    else if (e.which)
        code = e.which;
    if (code == 229) {
        return false;
    }
    searchRelationGoodsKeyword();
}
function searchRelationGoodsKeyword()
{
    var tmpIdx = 0;
    var tmpValue = "";
    tmpValue = Trim($get("txt_goods_relation_search").value).toLowerCase();
    while (true) {
        if ($get("span_goods_relation_unit_" + tmpIdx) == null) {
            break;
        }
        if (($get("span_goods_relation_unit_" + tmpIdx).innerHTML).toLowerCase().indexOf(tmpValue) >= 0) {
            $("#span_goods_relation_unit_" + tmpIdx).parent().parent().show();
        } else {
            $("#span_goods_relation_unit_" + tmpIdx).parent().parent().hide();
        }
        tmpIdx++;
    }
}
function AddCartRelationGoods()
{
    var tmpGoodsList = $("table[name^='tbl_rlGoods']");
    if ($get("ul_AddToCartRelationGoodsList") == null || tmpGoodsList == null || tmpGoodsList.length <= 0) {
        return;
    }
    for (var z = 0; z < tmpGoodsList.length; z++) {
        var tmpIdx = $(tmpGoodsList[z]).attr("idx");
        var gd_no = $(tmpGoodsList[z]).attr("goodscode");
        var order_cnt = $get("txt_rlGoods_" + tmpIdx).value;
        var sell_price = 0
        var inventory_seq_no = 0;
        var sel_no = "";
        var sel_noT_s = "";
        var selvalueT_s = "";
        Util.AddToCart(gd_no, order_cnt, sell_price, inventory_seq_no, sel_no, sel_noT_s, selvalueT_s, "L", function (ret)
        {
            if (ret.ResultCode == 0) {
            } else {
            }
        });
    }
}
function ViewCustomerReview_Blog(global_order_type) {
    if ($("#div_cont_navitab").attr("premium_cnt") == "0") {
        location.href = "#CustomerReview";
        return;
    }
    $("#div_cont_navitab").css("display", "block");
    $("#g_gwNull").css("display", "none");
    location.href = "#CustomerReview";
}
function ViewCustomerReview_Origin()
{
    $("#DetailIteminfo").css("display", "block");
    $("#ItemInfoWrap2").css("display", "block");
    $("#itemGoods").css("display", "block");
    $("#Blog_Review").css("display", "none");
    $("#Origin_Review").css("display", "block");
    $("#g_gwNull").css("display", "block");
    location.href = "#DetailIteminfo";
}
function viewMultilang(lang)
{
    $("#div_language ul li").removeClass("selected");
    $("li[type='" + lang + "']").addClass("selected");
    $get("lang_cd").value = lang;
    Util.setCookie("lang_cd", lang);
    document.location.reload();
}
function setMultilang()
{
    if (__GDTH != null) {
        __GDTH.setMultilang();
    }
}
function ShowLayerTip(type)
{
    $("div.[name=layer_tip_" + type + "]").css("display", "");
}
function HideLayerTip(type)
{
    $("div.[name=layer_tip_" + type + "]").css("display", "none");
}
function OptionImageOpen_OnClick() {
    if ($get("OptionImageLayer").style.display != null && $get("OptionImageLayer").style.display == "none") {
        $get("OptionImageLayer").style.display = "";
    } else {
        $get("OptionImageLayer").style.display = "none";
    }
    if ($get("div_OptAllVw_main") != null) {
        $("#OptionAllList").removeClass("on");
        $get("div_OptAllVw_main").style.display = "none";
    }
    setmultiSmartBtnClass();
    SetOptionImageUrl();
}
function OptionImageSave_OnClick() {
    $get("OptionImageLayer").style.display = "none";
    if (!optAllVwSelect.select && opt_Image_selected_Info.sel_value1 != null) {
        opt_Image_Info.selected = true;
        var inv_img_yn = $("#inventory_img_yn_0").val();
        if ($("#inventory_img_disp_type_0").val() == "T" && inv_img_yn == "True") {
            $($get("content_inventory_0_" + opt_Image_selected_Info.sel_value1)).parents("li").click();
        } else if ($("#inventory_img_disp_type_0").val() == "L" && inv_img_yn == "True") {
            $($get("content_inventory_0_" + opt_Image_selected_Info.sel_value1)).parents("li").click();
        } else {
            $($get("content_inventory_0_" + opt_Image_selected_Info.sel_value1)).click();
        }
    }
}
var selectOptionCnt = 0;
var selectTotalOptionCnt = 0;
var selectOptListIdx = -1;
$('input[name="sel_valueT"]').ready(function (e)
{
    $('input[name="sel_valueT"]').bind('blur', function (e) {
        selectedTextOpt(this);
    });
});
$('input[name="sub_sel_valueT"]').ready(function (e) {
    $('input[name="sub_sel_valueT"]').bind('blur', function (e) {
        SetSelectOptionListSub();
    });
});
function selectedTextOpt(prmControl) {
    if (false === checkTopupOption(prmControl)) {
        return;
    }
    if (optionValidCheck_New(false)) {
        SetSelectOptionList();
    }
}
function SetSelectOptionList() {
    if (!checkOrderCnt(true))
        return;
    if (!orderValidCheck())
        return;
    var tmpHtmlText = "";
    var tmpPrice = 0;
    var tmpOptPrice = 0;
    var tmpPriceOC = 0;
    var tmpOptPriceOC = 0;
    var tmpControl = $("dl[class^='detailsArea']").find("input[name='inventory_value']");
    var tmpInvNo = $get("inventory_seq_no").value;
    var tmpSelNo = "";
    var tmpSelNoT = "";
    var tmpSelValT = "";
    var tmpQty = parseFloat($get("order_cnt").value);
    var tmpInvQty = 0;
    var tmpHasInven = false;
    var sel_mode = $get("h_sel_mode").value;
    if (tmpInvNo == "") {
        tmpInvNo = "0";
    }
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpControlMain = $(tmpControl[i]).closest("dl");
        var tmpTxt = $(tmpControlMain).children("dt").html();
        tmpHtmlText += tmpTxt.replace("âˆ™ ", "") + " : " + $(tmpControlMain).find("input[name='inventory_text']").val() + "<br/>";
        var tmpSubPrice = $(tmpControlMain).find("input[name='inventory_price']").val();
        if (tmpSubPrice != null && tmpSubPrice != "" && tmpSubPrice != "0") {
            tmpPrice += parseFloat(tmpSubPrice);
        }
        var tmpSubPriceOC = $(tmpControlMain).find("input[name='inventory_price_oc']").val();
        if (tmpSubPriceOC != null && tmpSubPriceOC != "" && tmpSubPriceOC != "0") {
            tmpPriceOC += parseFloat(tmpSubPriceOC);
        }
        if (sel_mode == "basic") {
            if (i == (tmpControl.length - 1)) {
                tmpInvQty = $(tmpControlMain).find("input[name='inventory_qty']").val();
                if (tmpInvQty == null || tmpInvQty == "") {
                    tmpInvQty = 0;
                }
            }
        } else {
            var qty = $(tmpControlMain).find("input[name='inventory_qty']").val();
            if (qty == null || qty == "") {
                qty = 0;
            }
            tmpInvQty += parseInt(qty);
        }
    }
    if (tmpControl.length > 0) {
        tmpHasInven = true;
    }
    tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][inv_no='" + tmpInvNo + "']");
    var total_order_cnt = 0;
    if (tmpControl != null && tmpControl.length > 0) {
        for (var k = 0; k < tmpControl.length; k++) {
            total_order_cnt += parseInt($(tmpControl[k]).attr("qty"));
        }
    }
    if (tmpHasInven) {
        if ((total_order_cnt + tmpQty) > parseFloat(tmpInvQty)) {
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), tmpInvQty));
            ClearSelectOptionControl();
            SetOptinControlDisplay();
            return;
        }
    }
    tmpControl = $("dl[class^='detailsArea']").find("input[name='sel_no']");
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpControlMain = $(tmpControl[i]).closest("dl");
        var tmpTxt = $(tmpControlMain).find("dt strong").eq(0).html();
        var tmpOptQty = $("dl[class^='detailsArea']").find("input[name='sel_qty']").eq(i).val();
        var tmpOpSelNO = $(tmpControl[i]).val();
        var tmpOPControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][sel_no='" + tmpOpSelNO + "']");
        if (tmpOPControl == null || tmpOPControl.length <= 0) {
            tmpOPControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][sel_no^='" + tmpOpSelNO + ",']");
            if (tmpOPControl == null || tmpOPControl.length <= 0) {
                tmpOPControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][sel_no$='," + tmpOpSelNO + "']");
                if (tmpOPControl == null || tmpOPControl.length <= 0) {
                    tmpOPControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][sel_no*='," + tmpOpSelNO + ",']");
                }
            }
        }
        total_order_cnt = 0;
        if (tmpOPControl != null && tmpOPControl.length > 0) {
            if (tmpOPControl != null && tmpOPControl.length > 0) {
                for (var z = 0; z < tmpOPControl.length; z++) {
                    total_order_cnt += parseInt($(tmpOPControl[z]).attr("qty"));
                }
            }
        }
        if ((total_order_cnt + tmpQty) > parseFloat(tmpOptQty)) {
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), tmpOptQty));
            ClearSelectOptionControl();
            SetOptinControlDisplay();
            return;
        }
        tmpHtmlText += tmpTxt + " : " + $(tmpControlMain).find("input[name='sel_text']").val() + "<br/>";
        var tmpSubPrice = $(tmpControlMain).find("input[name='sel_price']").val();
        if (tmpSubPrice != null && tmpSubPrice != "" && tmpSubPrice != "0") {
            tmpPrice += parseFloat(tmpSubPrice);
        }
        var tmpSubPriceOC = $(tmpControlMain).find("input[name='sel_price_oc']").val();
        if (tmpSubPriceOC != null && tmpSubPriceOC != "" && tmpSubPriceOC != "0") {
            tmpPriceOC += parseFloat(tmpSubPriceOC);
        }
        if (tmpSelNo != "") {
            tmpSelNo += "," + $(tmpControl[i]).val();
        } else {
            tmpSelNo = "" + $(tmpControl[i]).val();
        }
    }
    if (tmpSelNo == "") {
        tmpSelNo = "0";
    }
    tmpControl = $("dl[class^='detailsArea']").find("dd input[name='sel_noT']");
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpControlMain = $(tmpControl[i]).closest("dl");
        var tmpTxt = $(tmpControlMain).find("dt strong").eq(0).html();
        var tmpTxtValue = $(tmpControlMain).find("dd input[name='sel_valueT']").val();
        tmpHtmlText += tmpTxt + " : " + tmpTxtValue + "<br/>";
        if (tmpSelNoT != "") {
            tmpSelNoT += "," + $(tmpControl[i]).val();
            tmpSelValT += "," + tmpTxtValue;
        } else {
            tmpSelNoT = "" + $(tmpControl[i]).val();
            tmpSelValT = "" + tmpTxtValue;
        }
    }
    tmpOptPrice = tmpPrice;
    tmpOptPriceOC = tmpPriceOC;
    var tmpDisHtml = "";
    var tmpCouponUsable = ($get("hid_discount_coupon_usable") == null || $get("hid_discount_coupon_usable").value == "Y") ? true : false;
    var PriceHTML = "";
    if (!isApplyCoupon || $get("coupon_no").value == "") {
        if ($get("hid_CouponBtnVisible").value == "true") {
            tmpDisHtml = "<span class='dc'><a class='fs_11' onclick='if(window.GetCouponForOptList) GetCouponForOptList(" + selectOptionCnt + ")'>" + MultiLang.findResource("coupon") + "</a></span>";
        }
        if ($get("groupbuy_no").value != "0" && ($get("groupbuy_sell_max_qty").value == "0" || parseInt($get("groupbuy_sell_max_qty").value) > parseInt($get("groupbuy_cur_order_qty").value)) && ($get("goods_dc_cost_basis_type").value != "QD" && $get("goods_dc_cost_basis_type").value != "TD")) {
            tmpPrice += parseFloat($get("groupbuy_sell_price").value);
            tmpPriceOC += parseFloat($get("groupbuy_sell_price_oc").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price'><span class='colOra' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        } else if (PageVariable.jaehu_discount_yn == "Y") {
            tmpPrice += parseFloat(PageVariable.jaehu_discounted_price);
            tmpPriceOC += parseFloat(PageVariable.jaehu_discounted_price_oc);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price'><span  class='colBlue' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        } else if ($get("goods_dc_cost_basis_type").value == "GD" || $get("goods_dc_cost_basis_type").value == "QD" || $get("goods_dc_cost_basis_type").value == "PD" || $get("goods_dc_cost_basis_type").value == "TD") {
            tmpPrice += parseFloat($get("discounted_price").value);
            tmpPriceOC += parseFloat($get("discounted_price_oc").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price'><span  class='colBlue' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        } else {
            tmpPrice += parseFloat($get("discounted_price").value);
            tmpPriceOC += parseFloat($get("discounted_price_oc").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price'><span s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        }
    } else {
        tmpPrice += parseFloat($get("sell_price").value);
        tmpPrice = tmpPrice * tmpQty;
        tmpPrice = tmpPrice - goods_discount_price;
        tmpPriceOC += parseFloat($get("sell_price_oc").value);
        tmpPriceOC = tmpPriceOC * tmpQty;
        if ($get("hid_CouponBtnVisible").value == "true") {
            tmpDisHtml = "<span class='dc'>-" + PriceUtil.FormatCurrencyCode(coupon_discount_price, $get("target_currency").value);
            tmpDisHtml += "<a class='btn_del' onclick='if(window.GetCancleCouponForOptList) GetCancleCouponForOptList(" + selectOptionCnt + ")'>del</a></span>";
        }
        PriceHTML = "<td t_idx='price'><span s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
    }
    var tmpHtml = "";
    tmpHtml += "<dd name='dd_SelectOptionList' idx='" + selectOptionCnt + "' price='" + (tmpPrice - coupon_discount_price) + "' price_oc='" + tmpPriceOC + "' qty='" + $get("order_cnt").value
            + "' inv_no='" + tmpInvNo + "' sel_no='" + tmpSelNo + "' sel_noT='" + tmpSelNoT + "' sel_valueT='" + tmpSelValT
            + "' cost_basis_no='0' cost_basis_type='' coupon_no=''" + " opt_price='" + tmpOptPrice + "' opt_price_oc='" + tmpOptPriceOC + "' inv_max_qty='" + parseFloat(tmpInvQty) + "' deduction_type ='" + QPrice.deduction_type + "' >"
            + "<table summary='This is the choosen list.'>"
            + "<colgroup>"
            + "<col width=''>"
            + "<col width='55'>"
            + "<col width='93'>"
            + "<col width='26'>"
            + "</colgroup>"
            + "<tbody>"
            + "<tr>"
            + "<td><p>" + tmpHtmlText + "</p><div style='display:none;' id='div_SelectOptionValue_" + selectOptionCnt + "'></div></td>"
            + "<td t_idx='qty'>" + SetSelectOptionListQty($get("order_cnt").value, selectOptionCnt) + "</td>"
            + PriceHTML
            + "<td><a onclick='if(window.DelSelectOptionList) DelSelectOptionList(" + selectOptionCnt + ");'><span class='ic_del'>del</span></a></td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</dd>";
    if ($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']") == null || $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']").length <= 0) {
        $get("dl_SelectOptionList").innerHTML = tmpHtml;
    } else {
        $($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']")[($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']").length - 1)]).after(tmpHtml);
    }
    if ($get("cost_basis_no") != null && $get("cost_basis_no").value != "undefined" && $("#cost_basis_no").val() != "") {
        $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptionCnt + "']").attr("cost_basis_no", $("#cost_basis_no").val());
    }
    if ($get("goods_dc_cost_basis_type") != null && $get("goods_dc_cost_basis_type").value != "undefined" && $("#goods_dc_cost_basis_type").val() != "") {
        $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptionCnt + "']").attr("cost_basis_type", $("#goods_dc_cost_basis_type").val());
    }
    if ($get("coupon_no") != null && $get("coupon_no").value != "undefined" && $("#coupon_no").val() != "") {
        $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptionCnt + "']").attr("coupon_no", $("#coupon_no").val());
    }
    if ($get("hid_CouponBtnVisible").value == "true") {
        if ((!isApplyCoupon || $get("coupon_no").value == "")) {
            SelectOptionListQtyCss(selectOptionCnt, false);
        } else {
            SelectOptionListQtyCss(selectOptionCnt, true);
        }
    }
    selectOptionCnt++;
    SetDiscountLayerDisplay(false);
    cancelCoupon($get("gd_no").value);
    CancelDiscountBtn_Click();
    SetDiscountLayerDisplay(true);
    SetOptinControlDisplay();
    ClearSelectOptionControl();
    $("dl[id='dl_SelectOptionList_Sub']").html($("dl[id='dl_SelectOptionList']").html());
    Bargain.DisplayBtn();
}
function GetCouponForOptList(prmIdx) {
    SetDiscountLayerDisplay(false);
    cancelCoupon($get("gd_no").value);
    CancelDiscountBtn_Click();
    SetDiscountLayerDisplay(true);
    selectOptListIdx = prmIdx;
    isSltOptCoupon = true;
    $get("order_cnt").value = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptListIdx + "']").eq(0).attr("qty");
    var selected_basis_no = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptListIdx + "']").eq(0).attr("cost_basis_no");
    OpenMyCoupon(selected_basis_no);
}
function GetCancleCouponForOptList(prmIdx)
{
    isSltOptCoupon = false;
    SetDiscountLayerDisplay(false);
    cancelCoupon($get("gd_no").value);
    CancelDiscountBtn_Click();
    SetDiscountLayerDisplay(true);
    selectOptListIdx = prmIdx;
    SetCouponForOptList(true, true);
}
function SetCouponForOptList(prmIsOnlyGoods, prmIsOnlyCouponCancle)
{
    if (!isSltOptCoupon && selectOptListIdx < 0) {
        ClearSelectOptionControl();
        SetDiscountLayerDisplay(false);
        cancelCoupon($get("gd_no").value);
        CancelDiscountBtn_Click();
        SetDiscountLayerDisplay(true);
        return;
    }
    var tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptListIdx + "']").eq(0);
    var tmpQty = parseFloat($get("order_cnt").value);
    if (prmIsOnlyCouponCancle == true && $(tmpControl).attr("qty") != undefined) {
        tmpQty = $(tmpControl).attr("qty");
    }
    var tmpInvMaxQty = parseFloat($(tmpControl).attr("inv_max_qty"));
    var tmpInvNo = $(tmpControl).attr("inv_no");
    if (!(tmpInvNo == null || tmpInvNo == "" || tmpInvNo == "0") && tmpControl.length > 0) {
        var tmpControlSub = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][inv_no='" + tmpInvNo + "']");
        var total_order_cnt = 0;
        if (tmpControlSub != null && tmpControlSub.length > 0) {
            for (var k = 0; k < tmpControlSub.length; k++) {
                if (parseInt($(tmpControlSub[k]).attr("idx")) != parseInt(selectOptListIdx)) {
                    total_order_cnt += parseInt($(tmpControlSub[k]).attr("qty"));
                }
            }
        }
        if ((parseInt(total_order_cnt) + parseFloat(tmpQty)) > parseFloat(tmpInvMaxQty)) {
            isSltOptCoupon = false;
            selectOptListIdx = -1;
            ClearSelectOptionControl();
            SetDiscountLayerDisplay(false);
            cancelCoupon($get("gd_no").value);
            CancelDiscountBtn_Click();
            SetDiscountLayerDisplay(true);
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), tmpInvMaxQty));
            return;
        }
    }
    var tmpPrice = 0;
    var tmpDisHtml = "";
    var tmpCouponUsable = ($get("hid_discount_coupon_usable") == null || $get("hid_discount_coupon_usable").value == "Y") ? true : false;
    if (prmIsOnlyGoods) {
        if ($get("groupbuy_no").value != "0" && ($get("groupbuy_sell_max_qty").value == "0" || parseInt($get("groupbuy_sell_max_qty").value) > parseInt($get("groupbuy_cur_order_qty").value)) && ($get("goods_dc_cost_basis_type").value != "QD" && $get("goods_dc_cost_basis_type").value != "TD")) {
            tmpPrice += parseFloat($get("groupbuy_sell_price").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpDisHtml = "<span class='colOra' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>";
        } else if ($get("goods_dc_cost_basis_type").value == "GD" || $get("goods_dc_cost_basis_type").value == "PD" || $get("goods_dc_cost_basis_type").value == "TD" || $get("goods_dc_cost_basis_type").value == "QD") {
            tmpPrice = parseFloat($get("discounted_price").value) + parseFloat($(tmpControl).attr("opt_price"));
            tmpPrice = tmpPrice * tmpQty;
            tmpDisHtml = "<span class='colBlue' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>";
        } else {
            tmpPrice = parseFloat($get("discounted_price").value) + parseFloat($(tmpControl).attr("opt_price"));
            tmpPrice = tmpPrice * tmpQty;
            tmpDisHtml = "<span s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>";
        }
        if ($get("hid_CouponBtnVisible").value == "true" && tmpCouponUsable) {
            tmpDisHtml += "<span class='dc'><a class='fs_11' onclick='if(window.GetCouponForOptList) GetCouponForOptList(" + selectOptListIdx + ")'>" + MultiLang.findResource("coupon") + "</a></span>";
        }
    } else {
        tmpPrice = parseFloat($get("sell_price").value) + parseFloat($(tmpControl).attr("opt_price"));
        tmpPrice = tmpPrice * tmpQty;
        tmpPrice = tmpPrice - goods_discount_price;
        tmpDisHtml = "<span s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>";
        if ($get("hid_CouponBtnVisible").value == "true") {
            tmpDisHtml += "<span class='dc'>- " + PriceUtil.FormatCurrencyCode(coupon_discount_price, $get("target_currency").value);
            tmpDisHtml += "<a class='btn_del' onclick='if(window.GetCancleCouponForOptList) GetCancleCouponForOptList(" + selectOptListIdx + ")'>del</a></span>";
        }
    }
    if ($get("cost_basis_no") != null && $get("cost_basis_no").value != "undefined") {
        $(tmpControl).attr("cost_basis_no", $get("cost_basis_no").value);
    }
    if ($get("goods_dc_cost_basis_type") != null && $get("goods_dc_cost_basis_type").value != "undefined") {
        $(tmpControl).attr("cost_basis_type", $get("goods_dc_cost_basis_type").value);
    }
    if ($get("coupon_no") != null && $get("coupon_no").value != "undefined") {
        $(tmpControl).attr("coupon_no", $get("coupon_no").value);
    }
    $(tmpControl).attr("qty", tmpQty);
    $(tmpControl).attr("price", (tmpPrice - coupon_discount_price));
    $(tmpControl).find("td[t_idx='price']").html(tmpDisHtml);
    $("dd[name='dd_SelectOptionList'][idx='" + selectOptListIdx + "'] td[t_idx='qty']").html(SetSelectOptionListQty(tmpQty, selectOptListIdx));
    if ($get("hid_CouponBtnVisible").value == "true") {
        if (prmIsOnlyGoods) {
            SelectOptionListQtyCss(selectOptListIdx, false);
        } else {
            SelectOptionListQtyCss(selectOptListIdx, true);
        }
    }
    isSltOptCoupon = false;
    selectOptListIdx = -1;
    ClearSelectOptionControl();
    SetDiscountLayerDisplay(false);
    cancelCoupon($get("gd_no").value);
    CancelDiscountBtn_Click();
    SetDiscountLayerDisplay(true);
}
function DelSelectOptionList(prmIdx)
{
    $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + prmIdx + "']").remove();
    $("dl[id='dl_SelectOptionList_Sub']").html($("dl[id='dl_SelectOptionList']").html());
    SetOptinControlDisplay();
    Bargain.DisplayBtn();
}
function ClearSelectOptionControl() {
    var tmpControl = $("dl[class^='detailsArea'] dd div[class^='selectArea']").find("a.select_title");
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpHtml = $(tmpControl[i]).find("span[class='blind']").attr("id");
        if (tmpHtml != "ship_to_blind" && tmpHtml != "warranty_opt_blind")
        {
            tmpHtml = MultiLang.findResource("Please select") + "<span id=\"" + tmpHtml + "\" class=\"blind\">view</span>";
            $(tmpControl[i]).html(tmpHtml);
        }
    }
    var sel_mode = $get("h_sel_mode").value;
    if (sel_mode == "reverse") {
        setReverseTypeLevelInit(0);
        setReverseTypeLevelInit(1);
    } else {
        var tmpInvOuterTXT = $("p[id^='inventory_outer_text_']");
        for (var z = 0; z < tmpInvOuterTXT.length; z++) {
            $(tmpInvOuterTXT[z]).parent().find("ul[class^='select_chip']").html("");
            $(tmpInvOuterTXT[z]).parent().find("p[name='option_color_title']").hide();
            $(tmpInvOuterTXT[z]).show();
        }
        $("ul[viewType='Thumbnail'] > li, ul[viewType='Image'] > li").removeClass("clicked");
    }
    last_click_opt_obj = null;
    _clicked_img = "";
    _clicked_txt = "";
    if ($("#ulIndicate li[class^='selected']").length > 0)
        ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
    var con_tmpControl = $("ul[viewType='SelectBox'][optionType='inventory']");
    for (var i = 0; i < con_tmpControl.length; i++) {
        if ($(con_tmpControl[i]).attr("optionType") == "inventory" && $(con_tmpControl[i]).attr("level") == "0") {
            $(con_tmpControl[i]).find("li").removeClass("selected");
        } else {
            var tmpType = $(con_tmpControl[i]).hasClass("thumb_in");
            if (tmpType) {
                var tmpHtml = "<li style='cursor:default;'>" + MultiLang.findResource("ALERT_MSG24") + "</li>\r\n";
                $(con_tmpControl[i]).html(tmpHtml);
            } else {
                var tmpHtml = "<li>-----------------------------------------------------------</li>\r\n";
                tmpHtml += "<li style='cursor:default;'>" + MultiLang.findResource("ALERT_MSG24") + "</li>\r\n";
                $(con_tmpControl[i]).html(tmpHtml);
            }
        }
    }
    $get("inventory_seq_no").value = "0";
    $("dl[class^='detailsArea']").find("input[name='inventory_value']").val("");
    $("dl[class^='detailsArea']").find("input[name='inventory_text']").val("");
    $("dl[class^='detailsArea']").find("input[name='inventory_price']").val("0");
    $("dl[class^='detailsArea']").find("input[name='inventory_price_oc']").val("0");
    $("dl[class^='detailsArea']").find("input[name='sel_no']").val("");
    $("dl[class^='detailsArea']").find("input[name='sel_text']").val("");
    $("dl[class^='detailsArea']").find("input[name='sel_price']").val("0");
    $("dl[class^='detailsArea']").find("input[name='sel_price_oc']").val("0");
    $("dl[class^='detailsArea']").find("dd input[name='sel_valueT']").val("");
    $("input[id='order_cnt']").val("1");
    $("select[id='order_cnt']").find("option").eq(0).attr("selected", true);
}
function SetOptinControlDisplay()
{
    var tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
    selectTotalOptionCnt = tmpControl.length;
    if (selectTotalOptionCnt <= 0) {
        $get("li_SelectOptionList").style.display = "none";
        $get("a_subViewLis").style.visibility = "hidden";
        $get("dl_SelectOptionList_Sub").style.display = "none";
        $get("dl_SelectOptionList_Sub_Title").style.display = "none";
    } else {
        $get("li_SelectOptionList").style.display = "";
        $get("a_subViewLis").style.visibility = "";
        $get("dl_SelectOptionList_Sub").style.display = "";
        $get("dl_SelectOptionList_Sub_Title").style.display = "";
    }
    if ($get("global_order_type").value == "G")
        return;
    if (selectTotalOptionCnt <= 1 && $("#css_mode").val() != "preview") {
        if ($get("ProcessBtn_direct") != null) {
            $get("ProcessBtn_direct").style.display = "";
        }
    } else if ($("#limit_way").val().indexOf("B") < 0) {
        if ($get("ProcessBtn_direct") != null) {
            $get("ProcessBtn_direct").style.display = "none";
        }
    }
}
function CheckSelectOptionList()
{
    var tmpControlInv = $("dl[class^='detailsArea']").find("input[name='inventory_value']");
    var tmpControlOpt = $("dl[class^='detailsArea']").find("input[name='sel_no']");
    var tmpControlTxOpt = $("dl[class^='detailsArea']").find("dd input[name='sel_noT']");
    var tmpControlOptList = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
    var tmpAddPurchase = ChkAddPurchaseSelectOption();
    if (((tmpControlInv.length > 0 || tmpControlOpt.length > 0 || tmpControlTxOpt.length > 0) && tmpControlOptList.length < 1) || !tmpAddPurchase)
        return false;
    else {
        return true;
    }
}
function SetSelectOptionListForOrder()
{
    if (!CheckSelectOptionList())
        return false;
    var tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
    var extend_warranty_gd_no;
    if ($get("extend_warranty_gd_no").value == undefined)
    {
        extend_warranty_gd_no = "";
    } else {
        extend_warranty_gd_no = $get("extend_warranty_gd_no").value;
    }
    if (!GetAddPurchaseSelectOption())
        return false;
    var tmpAddtxtoptVal = null;
    var tmpAddSelNos = null;
    if (extend_warranty_gd_no.trim() != "" && $("#extend_txt_opt_value").val() != "" && $("#extend_sel_no").val() != "") {
        tmpAddtxtoptVal = $("#extend_txt_opt_value").val();
        tmpAddSelNos = $("#extend_sel_no").val();
    }
    selectOptionNoList = "";
    selectTxtOptionNoList = "";
    selectTxtOptionValueList = "";
    if (tmpControl != null && tmpControl.length > 0) {
        var tmpMulti_inventory_seq_no = "";
        if (selectTotalOptionCnt > 1) {
            tmpMultiItems = null;
            tmpMultiItems = new Array();
            for (var i = 0; i < selectTotalOptionCnt; i++) {
                var tmpIdx = $(tmpControl[i]).attr("idx");
                var tmpSelNo = "<input type='hidden' name='multi_sel_no_" + (i + 1) + "' id='multi_sel_no_" + (i + 1) + "' value='" + $(tmpControl[i]).attr("sel_no") + "' />";
                var tmpSelNoT = "<input type='hidden' name='multi_sel_noT_" + (i + 1) + "' id='multi_sel_noT_" + (i + 1) + "' value='" + $(tmpControl[i]).attr("sel_noT") + "' />";
                var tmpSelValT = "<input type='hidden' name='multi_sel_valueT_" + (i + 1) + "' id='multi_sel_valueT_" + (i + 1) + "' value='" + $(tmpControl[i]).attr("sel_valueT") + "' />";
                var tmpOrdCNT = "<input type='hidden' name='multi_order_cnts_" + (i + 1) + "' id='multi_order_cnts_" + (i + 1) + "' value='" + $(tmpControl[i]).attr("qty") + "' />";
                var tmpCostBasisNo = "<input type='hidden' name='multi_cost_basis_no_" + (i + 1) + "' id='multi_cost_basis_no_" + (i + 1) + "' value='" + ($(tmpControl[i]).attr("cost_basis_no") != null && $(tmpControl[i]).attr("cost_basis_no") != "undefined" ? $(tmpControl[i]).attr("cost_basis_no") : "0") + "' />";
                var tmpCouponNo = "<input type='hidden' name='multi_coupon_no_" + (i + 1) + "' id='multi_coupon_no_" + (i + 1) + "' value='" + ($(tmpControl[i]).attr("coupon_no") != null && $(tmpControl[i]).attr("coupon_no") != "undefined" ? $(tmpControl[i]).attr("coupon_no") : "0") + "' />";
                $get("div_SelectOptionValue_" + tmpIdx).innerHTML = tmpSelNo + tmpSelNoT + tmpSelValT + tmpOrdCNT + tmpCostBasisNo + tmpCouponNo;
                var multiItem = {};
                multiItem.multi_sel_no = $(tmpControl[i]).attr("sel_no");
                multiItem.multi_sel_noT = $(tmpControl[i]).attr("sel_noT");
                multiItem.multi_sel_valueT = $(tmpControl[i]).attr("sel_valueT");
                multiItem.multi_order_cnts = $(tmpControl[i]).attr("qty");
                multiItem.multi_cost_basis_no = ($(tmpControl[i]).attr("cost_basis_no") != null && $(tmpControl[i]).attr("cost_basis_no") != "undefined" ? $(tmpControl[i]).attr("cost_basis_no") : "0");
                multiItem.multi_coupon_no = ($(tmpControl[i]).attr("coupon_no") != null && $(tmpControl[i]).attr("coupon_no") != "undefined" ? $(tmpControl[i]).attr("coupon_no") : "0");
                multiItem.warranty_ref_gd_no = extend_warranty_gd_no;
                multiItem.warranty_text_option_value = tmpAddtxtoptVal;
                multiItem.warranty_sel_nos = tmpAddSelNos;
                tmpMultiItems[i] = multiItem;
                if (tmpMulti_inventory_seq_no != "") {
                    tmpMulti_inventory_seq_no += "," + $(tmpControl[i]).attr("inv_no");
                } else {
                    tmpMulti_inventory_seq_no = "" + $(tmpControl[i]).attr("inv_no");
                }
            }
            if (tmpMulti_inventory_seq_no == "") {
                tmpMulti_inventory_seq_no = "0";
            }
            $get("multi_inventory_seq_no").value = tmpMulti_inventory_seq_no;
            $get("multi_order_count").value = selectTotalOptionCnt;
            $get("multi_order_yn").value = "Y";
        } else {
            $get("multi_order_yn").value = "N";
            $get("inventory_seq_no").value = $(tmpControl[0]).attr("inv_no");
            var tmpSubControl = $("dl[class^='detailsArea']").find("input[name='sel_no']");
            var tmpSubControlVal = $(tmpControl[0]).attr("sel_no");
            var tmpSubControlValArr = null;
            if (tmpSubControlVal != null && tmpSubControlVal != "") {
                selectOptionNoList = tmpSubControlVal;
                tmpSubControlValArr = tmpSubControlVal.split(",");
                for (var i = 0; i < tmpSubControl.length; i++) {
                    $(tmpSubControl[i]).val(tmpSubControlValArr[i]);
                }
            }
            tmpSubControl = $("dl[class^='detailsArea']").find("input[name='sel_noT']");
            tmpSubControlVal = $(tmpControl[0]).attr("sel_noT");
            if (tmpSubControlVal != null && tmpSubControlVal != "") {
                selectTxtOptionNoList = tmpSubControlVal;
                tmpSubControlValArr = tmpSubControlVal.split(",");
                for (var i = 0; i < tmpSubControl.length; i++) {
                    $(tmpSubControl[i]).val(tmpSubControlValArr[i]);
                }
            }
            tmpSubControl = $("dl[class^='detailsArea']").find("input[name='sel_valueT']");
            tmpSubControlVal = $(tmpControl[0]).attr("sel_valueT");
            if (tmpSubControlVal != null && tmpSubControlVal != "") {
                selectTxtOptionValueList = tmpSubControlVal;
                tmpSubControlValArr = tmpSubControlVal.split(",");
                for (var i = 0; i < tmpSubControl.length; i++) {
                    $(tmpSubControl[i]).val(tmpSubControlValArr[i]);
                }
            }
            $get("order_cnt").value = $(tmpControl[0]).attr("qty");
            $get("cost_basis_no").value = ($(tmpControl[0]).attr("cost_basis_no") != null && $(tmpControl[0]).attr("cost_basis_no") != "undefined" ? $(tmpControl[0]).attr("cost_basis_no") : "0");
            $get("coupon_no").value = ($(tmpControl[0]).attr("coupon_no") != null && $(tmpControl[0]).attr("coupon_no") != "undefined" ? $(tmpControl[0]).attr("coupon_no") : "0");
        }
    }
    return true;
}
$("#div_SubOptionSelect").ready(function (e)
{
    var target = $("#div_SubOptionSelect");
    if (IE6 || isMobile)
        Layout.initMoving(target);
});
function checkOrderCntSub(prmTotalChk, prmDefaultCnt) {
    if (!Util.isNumber($get("sub_order_cnt").value) || parseInt($get("sub_order_cnt").value) <= 0) {
        $get("sub_order_cnt").value = 1;
    }
    if (prmTotalChk) {
        return true;
    } else {
        if ($get("sub_order_cnt").readOnly == true) {
            if ($get("multi_order_yn").value == "Y") {
            } else if ($get("gd_no").value == "401309687") {
            } else {
                alert(MultiLang.findResource("alert_msg_11"));
            }
            return false;
        } else
            return true;
    }
}
function plusOrderCntSub()
{
    if (!checkOrderCntSub(false))
        return;
    var order_cnt = $get("sub_order_cnt").value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("sub_order_cnt").value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    i_order_cnt++;
    if (i_order_cnt > 999) {
        alert(MultiLang.findResource("alert_msg_5"));
        return;
    }
    $get("sub_order_cnt").value = i_order_cnt.toString();
}
function minusOrderCntSub()
{
    if (!checkOrderCntSub(false))
        return;
    var order_cnt = $get("sub_order_cnt").value;
    if (!Util.isNumber(order_cnt) || parseInt(order_cnt) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("sub_order_cnt").value = 1;
        return;
    }
    var i_order_cnt = parseInt(order_cnt);
    if (i_order_cnt == 1) {
        alert(MultiLang.findResource("alert_msg_6"));
        return;
    }
    i_order_cnt--;
    $get("sub_order_cnt").value = i_order_cnt.toString();
}
var inventory_seq_no_sub = "0";
function changeInventoryInfoSub(obj, level, inventory_no, sel_count) {
    var target_name = obj.name;
    var groupbuy_no = $get("groupbuy_no").value;
    var target_currency = $get("target_currency").value;
    if (groupbuy_no == "0") {
        var sell_price = $get("sell_price").value;
    }
    var multi_inventory_seq_no = "";
    if (level == sel_count) {
        var tmpSelectIdx = parseInt(obj.selectedIndex);
        var tmpQty = $(obj).find("option").eq(tmpSelectIdx).attr("sub_qty");
        if (tmpQty != null && tmpQty != "" && parseFloat(tmpQty) <= 0) {
            obj.selectedIndex = 0;
            inventory_seq_no_sub = "0";
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), parseFloat(tmpQty)));
            return;
        }
        inventory_seq_no_sub = obj.value;
        if (obj.selectedIndex > 0)
            SetSelectOptionListSub();
        return;
    }
    var sel_value1 = "";
    var sel_value2 = "";
    var sel_value3 = "";
    var sel_value4 = "";
    var sel_value5 = "";
    for (var i = 0; i < level; i++) {
        var tmpSelectIdx = parseInt($nget(target_name)[i].selectedIndex);
        if (i == 0) {
            sel_value1 = $("[name='" + target_name + "']").eq(i).find("option").eq(tmpSelectIdx).attr("org_value");
        } else if (i == 1) {
            sel_value2 = $("[name='" + target_name + "']").eq(i).find("option").eq(tmpSelectIdx).attr("org_value");
        } else if (i == 2) {
            sel_value3 = $("[name='" + target_name + "']").eq(i).find("option").eq(tmpSelectIdx).attr("org_value");
        } else if (i == 3) {
            sel_value4 = $("[name='" + target_name + "']").eq(i).find("option").eq(tmpSelectIdx).attr("org_value");
        }
    }
    for (var i = level; i < sel_count; i++) {
        var bar = document.createElement("optgroup");
        bar.label = "----------";
        var optGr = document.createElement("optgroup");
        optGr.label = MultiLang.findResource("ALERT_MSG24");
        SelectBoxBinder.clear($nget(target_name)[i]);
        SelectBoxBinder.addOption($nget(target_name)[i], MultiLang.findResource("Please select"), "");
        $nget(target_name)[i].appendChild(bar);
        $nget(target_name)[i].appendChild(optGr);
    }
    var param = new RMSParam();
    param.add("inventory_no", inventory_no);
    param.add("sel_value1", sel_value1);
    param.add("sel_value2", sel_value2);
    param.add("sel_value3", sel_value3);
    param.add("sel_value4", sel_value4);
    param.add("level", (level + 1));
    param.add("sel_count", sel_count);
    param.add("lang_cd", $get("lang_cd").value);
    param.add("global_order_type", $get("global_order_type").value);
    param.add("gd_no", $get("gd_no").value);
    param.add("inventory_yn", "");
    param.add("link_type", $("#link_type").val());
    SelectBoxBinder.clear($nget(target_name)[level]);
    SelectBoxBinder.addOption($nget(target_name)[level], MultiLang.findResource("Loading"), "");
    $nget(target_name)[level].disabled = true;
    RMSHelper.asyncCallWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsInventoryEachLevelName", param.toJson(), function (ret) {
        if (ret != null) {
            var bar = document.createElement("optgroup");
            bar.label = "----------";
            SelectBoxBinder.clear($nget(target_name)[level]);
            SelectBoxBinder.addOption($nget(target_name)[level], MultiLang.findResource("Please select"), "");
            $nget(target_name)[level].appendChild(bar);
            if (ret.length <= 0) {
                var optGr = document.createElement("optgroup");
                optGr.label = MultiLang.findResource("ALERT_MSG24");
                $nget(target_name)[level].appendChild(optGr);
            }
            for (var i = 0; i < ret.length; i++) {
                if (level == sel_count - 1) {
                    var tmpQtyText = "";
                    if (ret[i].remain_cnt <= 0) {
                        tmpQtyText = " - " + MultiLang.findResource("OutOfStock");
                    } else {
                        var tmpInventoryQtyOpen = "Y";
                        if ($get("inventory_qty_open") != null) {
                            tmpInventoryQtyOpen = $get("inventory_qty_open").value;
                        }
                        if (tmpInventoryQtyOpen == "Y") {
                            tmpQtyText = " - " + MultiLang.findResource("Quantity") + " : " + ret[i].remain_cnt;
                        }
                    }
                    if (ret[i].sel_item_price > 0) {
                        var tmpText = ret[i].client_sel_value + "(+" + PriceUtil.FormatCurrencyCode(ret[i].sel_item_price, target_currency) + ")" + tmpQtyText;
                        Set_OptInven_SelectBox($nget(target_name)[level], tmpText, ret[i].sel_no, ret[i].sel_value, ret[i].client_sel_value, ret[i].sel_item_price, ret[i].remain_cnt, ret[i].inventory_yn, ret[i].sel_item_price_oc);
                    } else if (ret[i].sel_item_price < 0) {
                        var tmpText = ret[i].client_sel_value + "(" + PriceUtil.FormatCurrencyCode(ret[i].sel_item_price, target_currency) + ")" + tmpQtyText;
                        Set_OptInven_SelectBox($nget(target_name)[level], tmpText, ret[i].sel_no, ret[i].sel_value, ret[i].client_sel_value, ret[i].sel_item_price, ret[i].remain_cnt, ret[i].inventory_yn, ret[i].sel_item_price_oc);
                    } else {
                        var tmpText = ret[i].client_sel_value + tmpQtyText;
                        Set_OptInven_SelectBox($nget(target_name)[level], tmpText, ret[i].sel_no, ret[i].sel_value, ret[i].client_sel_value, ret[i].sel_item_price, ret[i].remain_cnt, ret[i].inventory_yn, ret[i].sel_item_price_oc);
                    }
                } else {
                    Set_OptInven_SelectBox($nget(target_name)[level], ret[i].client_sel_value, ret[i].sel_no, ret[i].sel_value, ret[i].client_sel_value, ret[i].sel_item_price, ret[i].remain_cnt, ret[i].inventory_yn, ret[i].sel_item_price_oc);
                }
            }
            $nget(target_name)[level].disabled = false;
            if (level == 1) {
                if (optAllVwSelect.select && optAllVwSelect.sel_value2 != null) {
                    $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(1).find("option[org_value='" + optAllVwSelect.sel_value2 + "']").attr("selected", true);
                    $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(1).change();
                    if (optAllVwSelect.sel_value3 == null) {
                        OptAllVwSelectInit();
                    }
                }
            } else if (level == 2) {
                if (optAllVwSelect.select && optAllVwSelect.sel_value3 != null) {
                    $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(2).find("option[org_value='" + optAllVwSelect.sel_value3 + "']").attr("selected", true);
                    $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(2).change();
                    OptAllVwSelectInit();
                }
            }
        }
    });
}
function changeOptionInfoSub(obj) {
    var tmpSelectIdx = parseInt(obj.selectedIndex);
    var tmpInvYN = $(obj).find("option").eq(tmpSelectIdx).attr("inv_yn");
    if (tmpInvYN != null && tmpInvYN == "N") {
        obj.selectedIndex = 0;
        alert(String.format(MultiLang.findResource("ALERT_MSG23"), 0));
        return;
    }
    SetSelectOptionListSub();
}
function orderValidCheckSub()
{
    var sell_price = $get("sell_price").value;
    var groupbuy_no = $get("groupbuy_no").value;
    if (groupbuy_no == "0") {
        if (sell_price == 0) {
            return false;
        }
    }
    if (!Util.isNumber($get("sub_order_cnt").value) || parseInt($get("sub_order_cnt").value) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        $get("sub_order_cnt").value = 1;
        return false;
    }
    return true;
}
function GetPriceText(prmPrice)
{
    var tmpRtnValue = "";
    if (prmPrice != null && prmPrice != "" && prmPrice != "0") {
        if (parseFloat(prmPrice) > 0)
            tmpRtnValue = "(+" + PriceUtil.FormatCurrencyCode(prmPrice, $get("target_currency").value) + ")";
        else if (parseFloat(prmPrice) < 0)
            tmpRtnValue = "(" + PriceUtil.FormatCurrencyCode(prmPrice, $get("target_currency").value) + ")";
    }
    return tmpRtnValue;
}
function SetSelectOptionListSub() {
    if (!checkOrderCntSub(true))
        return;
    if (!orderValidCheckSub())
        return;
    if (!OptionValidCheck_Sub(false))
        return;
    var tmpHtmlText = "";
    var tmpPrice = 0;
    var tmpOptPrice = 0;
    var tmpPriceOC = 0;
    var tmpOptPriceOC = 0;
    var tmpControl = $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']");
    var tmpInvNo = inventory_seq_no_sub;
    var tmpSelNo = "";
    var tmpSelNoT = "";
    var tmpSelValT = "";
    var tmpQty = parseFloat($get("sub_order_cnt").value);
    var tmpInvQty = 0;
    var tmpHasInven = false;
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpSelectIdx = parseInt($(tmpControl[i])[0].selectedIndex);
        var tmpControlMain = $(tmpControl[i]).closest("dl");
        var tmpTxt = $(tmpControlMain).children("dt").html();
        var tmpSubPrice = $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_price");
        var tmpSubPriceOC = $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_price_oc");
        tmpHtmlText += tmpTxt.replace("âˆ™ ", "") + " : " + $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_text") + GetPriceText(tmpSubPrice) + "<br/>";
        if (tmpSubPrice != null && tmpSubPrice != "" && tmpSubPrice != "0") {
            tmpPrice += parseFloat(tmpSubPrice);
        }
        if (tmpSubPriceOC != null && tmpSubPriceOC != "" && tmpSubPriceOC != "0") {
            tmpPriceOC += parseFloat(tmpSubPriceOC);
        }
        if (i == (tmpControl.length - 1)) {
            tmpInvQty = $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_qty");
            if (tmpInvQty == null || tmpInvQty == "") {
                tmpInvQty = 0;
            }
        }
    }
    if (tmpControl.length > 0) {
        tmpHasInven = true;
    }
    tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][inv_no='" + tmpInvNo + "']");
    var total_order_cnt = 0;
    if (tmpControl != null && tmpControl.length > 0) {
        for (var k = 0; k < tmpControl.length; k++) {
            total_order_cnt += parseInt($(tmpControl[k]).attr("qty"));
        }
    }
    if (tmpHasInven) {
        if ((parseInt(total_order_cnt) + parseFloat(tmpQty)) > parseFloat(tmpInvQty)) {
            SetOptinControlDisplay();
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), tmpInvQty));
            return;
        }
    }
    tmpControl = $("div[id='div_SubOptionSelect']").find("select[name='sub_sel_no']");
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpSelectIdx = parseInt($(tmpControl[i])[0].selectedIndex);
        var tmpControlMain = $(tmpControl[i]).closest("dl");
        var tmpTxt = $(tmpControlMain).find("dt strong").eq(0).html();
        var tmpSubPrice = $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_price");
        var tmpOptQty = $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_qty");
        var tmpSubPriceOC = $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_price_oc");
        if ((parseInt(total_order_cnt) + parseFloat(tmpQty)) > parseFloat(tmpOptQty)) {
            SetOptinControlDisplay();
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), tmpOptQty));
            return;
        }
        tmpHtmlText += tmpTxt + " : " + $(tmpControl[i]).find("option").eq(tmpSelectIdx).attr("sub_text") + GetPriceText(tmpSubPrice) + "<br/>";
        if (tmpSubPrice != null && tmpSubPrice != "" && tmpSubPrice != "0") {
            tmpPrice += parseFloat(tmpSubPrice);
        }
        if (tmpSubPriceOC != null && tmpSubPriceOC != "" && tmpSubPriceOC != "0") {
            tmpPriceOC += parseFloat(tmpSubPriceOC);
        }
        if (tmpSelNo != "") {
            tmpSelNo += "," + $(tmpControl[i]).val();
        } else {
            tmpSelNo = "" + $(tmpControl[i]).val();
        }
    }
    if (tmpSelNo == "") {
        tmpSelNo = "0";
    }
    tmpControl = $("div[id='div_SubOptionSelect']").find("input[name='sub_sel_noT']");
    for (var i = 0; i < tmpControl.length; i++) {
        var tmpControlMain = $(tmpControl[i]).closest("dl");
        var tmpTxt = $(tmpControlMain).find("dt strong").eq(0).html();
        var tmpTxtValue = $(tmpControlMain).find("dd input[name='sub_sel_valueT']").val();
        tmpHtmlText += tmpTxt + " : " + tmpTxtValue + "<br/>";
        if (tmpSelNoT != "") {
            tmpSelNoT += "," + $(tmpControl[i]).val();
            tmpSelValT += "," + tmpTxtValue;
        } else {
            tmpSelNoT = "" + $(tmpControl[i]).val();
            tmpSelValT = "" + tmpTxtValue;
        }
    }
    tmpOptPrice = tmpPrice;
    tmpOptPriceOC = tmpPriceOC;
    var tmpDisHtml = "";
    var tmpCouponUsable = ($get("hid_discount_coupon_usable") == null || $get("hid_discount_coupon_usable").value == "Y") ? true : false;
    var PriceHTML = "";
    if ($get("coupon_no").value == "") {
        if ($get("hid_CouponBtnVisible").value == "true" && tmpCouponUsable) {
            tmpDisHtml = "<span class='dc'><a class='fs_11' onclick='if(window.GetCouponForOptList) GetCouponForOptList(" + selectOptionCnt + ")'>" + MultiLang.findResource("coupon") + "</a></span>";
        }
        if ($get("groupbuy_no").value != "0" && ($get("groupbuy_sell_max_qty").value == "0" || parseInt($get("groupbuy_sell_max_qty").value) > parseInt($get("groupbuy_cur_order_qty").value)) && ($get("goods_dc_cost_basis_type").value != "QD" && $get("goods_dc_cost_basis_type").value != "TD")) {
            tmpPrice += parseFloat($get("groupbuy_sell_price").value);
            tmpPriceOC += parseFloat($get("groupbuy_sell_price_oc").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price'><span class='colOra' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        } else if (PageVariable.jaehu_discount_yn == "Y") {
            tmpPrice += parseFloat(PageVariable.jaehu_discounted_price);
            tmpPriceOC += parseFloat(PageVariable.jaehu_discounted_price_oc);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price' ><span class='colBlue' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        } else if ($get("goods_dc_cost_basis_type").value == "GD" || $get("goods_dc_cost_basis_type").value == "QD" || $get("goods_dc_cost_basis_type").value == "PD" || $get("goods_dc_cost_basis_type").value == "TD") {
            tmpPrice += parseFloat($get("discounted_price").value);
            tmpPriceOC += parseFloat($get("discounted_price_oc").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price' ><span class='colBlue' s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        } else {
            tmpPrice += parseFloat($get("discounted_price").value);
            tmpPriceOC += parseFloat($get("discounted_price_oc").value);
            tmpPrice = tmpPrice * tmpQty;
            tmpPriceOC = tmpPriceOC * tmpQty;
            PriceHTML = "<td t_idx='price'><span s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
        }
    } else {
        tmpPrice += parseFloat($get("sell_price").value);
        tmpPrice = tmpPrice * tmpQty;
        tmpPrice = tmpPrice - goods_discount_price;
        tmpPriceOC += parseFloat($get("sell_price_oc").value);
        tmpPriceOC = tmpPriceOC * tmpQty;
        if ($get("hid_CouponBtnVisible").value == "true") {
            tmpDisHtml = "<span class='dc'>- " + PriceUtil.FormatCurrencyCode(coupon_discount_price, $get("target_currency").value);
            tmpDisHtml += "<a class='btn_del' onclick='if(window.GetCancleCouponForOptList) GetCancleCouponForOptList(" + selectOptionCnt + ")'>del</a></span>";
        }
        PriceHTML = "<td t_idx='price'><span s_idx='price'>" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + "</span>" + tmpDisHtml + "</td>";
    }
    var tmpHtml = "";
    tmpHtml += "<dd name='dd_SelectOptionList' idx='" + selectOptionCnt + "' price='" + (tmpPrice - coupon_discount_price) + "' price_oc='" + tmpPriceOC + "' qty='" + tmpQty
            + "' inv_no='" + tmpInvNo + "' sel_no='" + tmpSelNo + "' sel_noT='" + tmpSelNoT + "' sel_valueT='" + tmpSelValT
            + "' cost_basis_no='0' cost_basis_type='' coupon_no=''" + " opt_price='" + tmpOptPrice + "' opt_price_oc='" + tmpOptPriceOC + "' inv_max_qty='" + parseFloat(tmpInvQty) + "' >"
            + "<table summary='This is the choosen list.'>"
            + "<colgroup>"
            + "<col width=''>"
            + "<col width='55'>"
            + "<col width='93'>"
            + "<col width='26'>"
            + "</colgroup>"
            + "<tbody>"
            + "<tr>"
            + "<td><p>" + tmpHtmlText + "</p><div style='display:none;' id='div_SelectOptionValue_" + selectOptionCnt + "'></div></td>"
            + "<td t_idx='qty'>" + SetSelectOptionListQty(tmpQty, selectOptionCnt) + "</td>"
            + PriceHTML
            + "<td><a onclick='if(window.DelSelectOptionList) DelSelectOptionList(" + selectOptionCnt + ");'><span class='ic_del'>del</span></a></td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</dd>";
    if ($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']") == null || $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']").length <= 0) {
        $get("dl_SelectOptionList").innerHTML = tmpHtml;
    } else {
        $($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']")[($("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']").length - 1)]).after(tmpHtml);
    }
    if ($get("cost_basis_no") != null && $get("cost_basis_no").value != "undefined") {
        $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptionCnt + "']").attr("cost_basis_no", $get("cost_basis_no").value);
    }
    if ($get("goods_dc_cost_basis_type") != null && $get("goods_dc_cost_basis_type").value != "undefined") {
        $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptionCnt + "']").attr("cost_basis_type", $get("goods_dc_cost_basis_type").value);
    }
    if ($get("coupon_no") != null && $get("coupon_no").value != "undefined") {
        $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptionCnt + "']").attr("coupon_no", $get("coupon_no").value);
    }
    if ($get("hid_CouponBtnVisible").value == "true") {
        if ($get("coupon_no").value == "") {
            SelectOptionListQtyCss(selectOptionCnt, false);
        } else {
            SelectOptionListQtyCss(selectOptionCnt, true);
        }
    }
    selectOptionCnt++;
    $("#order_cnt").val(tmpQty);
    SetOptinControlDisplay();
    $("dl[id='dl_SelectOptionList_Sub']").html($("dl[id='dl_SelectOptionList']").html());
    SetDiscountLayerDisplay(false);
    cancelCoupon($get("gd_no").value);
    CancelDiscountBtn_Click();
    SetDiscountLayerDisplay(true);
    ClearSelectOptionControlSub();
    ClearSelectOptionControl();
}
function ClearSelectOptionControlSub()
{
    $("input[id='sub_order_cnt']").val(1);
    $("select[id='sub_order_cnt']").find("option").eq(0).attr("selected", true);
    $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(0).val("");
    $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(0).change();
    $("div[id='div_SubOptionSelect']").find("select[name='sub_sel_no']").val("");
    $("div[id='div_SubOptionSelect']").find("input[name='sub_sel_valueT']").val("");
}
function OptionValidCheck_Sub(prmFocus)
{
    if ($get("inventory_yn").value == "Y") {
        var inventory_cnt = $nget("sub_inventory_seqno").length;
        for (var j = 0; j < inventory_cnt; j++) {
            if ($nget("sub_inventory_seqno")[j].value == "") {
                return false;
            }
        }
    }
    if ($nget("sub_sel_no") != null) {
        var sel_count = $nget("sub_sel_no").length;
        for (var i = 0; i < sel_count; i++) {
            if ($nget("sub_sel_no")[i].value == "") {
                return false;
            }
        }
    }
    if ($nget("sub_sel_valueT") != null) {
        var request_info = "";
        var sel_count = $nget("sub_sel_valueT").length;
        for (var i = 0; i < sel_count; i++) {
            $nget("sub_sel_valueT")[i].value = $nget("sub_sel_valueT")[i].value.replace(/,/g, " ");
            if ($nget("sub_sel_valueT")[i].value == "") {
                return false;
            }
        }
    }
    return true;
}
function SubOptionLayerView()
{
    if ($("#a_subOptionLayerView span").hasClass("open")) {
        $("#a_subOptionLayerView span").removeClass("open");
        $("#a_subOptionLayerView span").addClass("close");
        $get("div_SubOptionItemList").style.display = "";
        if ($get("a_subOptionAdd") != null) {
            $get("a_subOptionAdd").style.display = "";
        }
    } else {
        $("#a_subOptionLayerView span").removeClass("close");
        $("#a_subOptionLayerView span").addClass("open");
        $get("div_SubOptionItemList").style.display = "none";
        if ($get("a_subOptionAdd") != null) {
            $get("a_subOptionAdd").style.display = "none";
        }
        ClearSelectOptionControlSub();
    }
}
var ShippingTo = function () {};
ShippingTo.showInfo = function ()
{
    if ($("#ship_to_layer .innerWrap").css("display") == "none") {
        $("#ship_to_layer .innerWrap").show();
        $("#ship_to_blind").removeClass("blind");
        $("#ship_to_blind").addClass("blind up");
    } else {
        $("#ship_to_layer .innerWrap").hide();
        $("#ship_to_blind").removeClass("blind up");
        $("#ship_to_blind").addClass("blind");
    }
    setTimeout(function () {
        setDeliveryPeriod(null);
    }, 500);
}
ShippingTo.searchShipKeyword_onKeyUp = function (e, delivery_group_no, delivery_bundle_no)
{
    var select_nm = "";
    var code;
    if (!e)
        e = window.event
    if (e.keyCode)
        code = e.keyCode;
    else if (e.which)
        code = e.which;
    var searchTxt = "";
    var target_currency = $get("target_currency").value;
    if (code == 229) {
        return false;
    }
    if (code == 13) {
        $("#content_ship_to li:nth-child(1)  a span").click();
    } else {
        ShippingTo.ShipPingToInfo(delivery_group_no, delivery_bundle_no);
    }
}
ShippingTo.searchShipKeyword = function (delivery_group_no, delivery_bundle_no)
{
    ShippingTo.ShipPingToInfo(delivery_group_no, delivery_bundle_no);
}
ShippingTo.ShipPingToInfo = function (delivery_group_no, delivery_bundle_no) {
    var search_keyword = "";
    var search_keyword = Trim($get("src_ship_to_nm").value).toLowerCase();
    var goodscode = $get("gd_no").value;
    var oveseaInfoTxt = "";
    var real_oversea_delivery_fee = 0;
    oveseaInfoTxt += "<li>-------------------------------------------------------------</li>\r\n";
    if (oversea_nation_list.length != null && oversea_nation_list.length > 0) {
        for (var i = 0; i < oversea_nation_list.length; i++) {
            if (oversea_nation_list[i].nation_nm.indexOf(search_keyword) >= 0) {
                real_oversea_delivery_fee = oversea_nation_list[i].oversea_delivery_fee;
                oveseaInfoTxt += "<li id=\"ship_select_li_" + oversea_nation_list[i].nation_cd + "\" onmouseover=\"if(window.optLayerOver) optLayerOver(this);\" onmouseout=\"if(window.optLayerOut) optLayerOut(this);\" delivery_group_no=\"" + oversea_nation_list[i].delivery_group_no + "\" onclick=\"javascript:ShippingTo.selectShip(this , '" + oversea_nation_list[i].nation_cd + "', " + oversea_nation_list[i].delivery_group_no + ",'Y');\">" + oversea_nation_list[i].nation_nm + "</li>";
            }
        }
    }
    $get("content_ship_to").innerHTML = oveseaInfoTxt;
}
ShippingTo.CalculateAutoOverseaDeliveryFee = function (arrive_nation_cd, ship_from_cd) {
    var param = new RMSParam();
    param.add("delivery_group_no", $get("delivery_group_no").value);
    param.add("order_cnts", 1);
    param.add("buy_amount", $get("sell_price_oc").value);
    param.add("sz_no", "0");
    param.add("oversea_yn", "Y");
    param.add("del_nation_cd", arrive_nation_cd);
    param.add("delivery_option_no", 0);
    param.add("global_order_type", $get("global_order_type").value);
    param.add("buy_weight", $get("gd_weight").value);
    var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "CalculateDeliveryFeeByBundle", param.toJson());
    var oversea_fee = 0;
    if (ret != null && ret.Rows.length > 0) {
        oversea_fee = ret.Rows[0].auto_oversea_delivery_fee;
        if (ship_from_cd != arrive_nation_cd)
            oversea_fee += ret.Rows[0].sz_delivery_fee;
    }
    return oversea_fee;
}
ShippingTo.selectShip = function (obj, cd, delivery_group_no, show_layer) {
    var target_currency = $get("target_currency").value;
    $("#content_ship_to").children().removeClass("selected");
    $(obj).addClass("selected");
    searchtxt = $get("ship_select_li_" + cd + "").innerHTML;
    $get("selected_nation_cd").value = cd;
    var ShipTotitle_Html = "<a class=\"select_title\" href =\"javascript:ShippingTo.showInfo();\">" + searchtxt + "<span class=\"blind\" id=\"ship_to_blind\">view</span></a>";
    $get("ship_to_title").innerHTML = ShipTotitle_Html;
    if (delivery_group_no != 0) {
        for (var i = 0; i < $("input[name=delivery_option_no]").length; i++) {
            if ($("input[name=delivery_option_no]").eq(i).val() != delivery_group_no) {
                $("input[name=delivery_option_no]").eq(i).prop("disabled", true);
            } else {
                $("input[name=delivery_option_no]").eq(i).prop("disabled", false);
                $("input[name=delivery_option_no]").eq(i).prop("checked", true);
            }
        }
    } else {
        if (oversea_nation_all_list.length != null && oversea_nation_all_list.length > 0) {
            var delivery_group_no_s = "";
            for (var j = 0; j < oversea_nation_all_list.length; j++) {
                if (oversea_nation_all_list[j].nation_cd == cd) {
                    delivery_group_no_s += oversea_nation_all_list[j].delivery_group_no;
                }
            }
            for (var i = 0; i < $("input[name=delivery_option_no]").length; i++) {
                if (delivery_group_no_s.indexOf($("input[name=delivery_option_no]").eq(i).val()) < 0) {
                    $("input[name=delivery_option_no]").eq(i).prop("disabled", true);
                    if (show_layer != "O") {
                        var $select_delivery_op_id = $("input:radio[name='delivery_option_no']:visible:not(:disabled)").first();
                        if ($select_delivery_op_id.length != 0 && delivery_group_no == 0) {
                            $select_delivery_op_id.prop("checked", true);
                        }
                    }
                } else {
                    $("input[name=delivery_option_no]").eq(i).prop("disabled", false);
                }
            }
        }
    }
    if (show_layer != "M") {
        var selected_delivery_option_no = "";
        if ($("input[type='radio'][name='delivery_option_no']:checked").length > 0) {
            selected_delivery_option_no = $("input[type='radio'][name='delivery_option_no']:checked").attr("value");
        } else {
            selected_delivery_option_no = $("#delivery_group_no").val();
        }
        var li_obj = $('[name="delivery_option_no"]');
        var result_delivery_fee = 0;
        var auto_oversea_delivery_fee = 0;
        for (var i = 0; i < $(li_obj).length; i++) {
            var delivery_option_no = $(li_obj).eq(i).attr("value");
            var oversea_yn = "N";
            if ($get("domestic_nation_cd").value != cd) {
                oversea_yn = "Y";
            }
            delivery_option_no = (delivery_option_no == "" || delivery_option_no == undefined) ? $get("delivery_group_no").value : delivery_option_no;
            var param = new RMSParam();
            param.add("delivery_group_no", delivery_option_no);
            param.add("order_cnts", $get("order_cnt").value);
            param.add("buy_amount", $get("discounted_price_oc").value);
            param.add("sz_no", 0);
            param.add("oversea_yn", oversea_yn);
            param.add("del_nation_cd", cd);
            param.add("delivery_option_no", 0);
            param.add("global_order_type", $get("global_order_type").value);
            param.add("buy_weight", $get("gd_weight").value);
            var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "CalculateDeliveryFeeByBundle", param.toJson());
            if (ret != null) {
                result_delivery_fee = parseFloat(ret.Rows[0].sub_delivery_fee) + parseFloat(ret.Rows[0].sz_delivery_fee) + parseFloat(ret.Rows[0].apply_default_delivery_fee) + parseFloat(ret.Rows[0].delivery_option_fee) + parseFloat(ret.Rows[0].auto_oversea_delivery_fee);
                var auto_oversea_delivery_fee = parseFloat(ret.Rows[0].auto_oversea_delivery_fee);
                $(li_obj).eq(i).attr("oversea_type", ret.Rows[0].oversea_type);
                $(li_obj).eq(i).attr("delivery_sz_yn", ret.Rows[0].delivery_sz_yn);
                var delivery_sub_type = ret.Rows[0].delivery_sub_type;
                var oversea_type = ret.Rows[0].oversea_type;
                var delivery_sz_yn = ret.Rows[0].delivery_sz_yn;
                var sz_delivery_fee = ret.Rows[0].sz_delivery_fee;
                var result_delivery_fee_text = "";
                var basis_fee = $(li_obj).eq(i).attr("data-basis-money");
                var delivery_fee_condition = $(li_obj).eq(i).attr("data-delivery-fee-cond");
                var basis_apply_type = $(li_obj).eq(i).attr("data-basis-apply-type");
                if (result_delivery_fee == 0) {
                    result_delivery_fee_text = MultiLang.findResource("Free");
                } else {
                    result_delivery_fee_text = PriceUtil.FormatCurrencyCode(result_delivery_fee, target_currency);
                }
                var shipping_fee_more = "";
                if (delivery_sub_type != undefined) {
                    if (delivery_sub_type != "" || (oversea_type == "G" && cd != $("#domestic_nation_cd").val() && cd != $("#gd_ship_from_cd").val()) || (delivery_sz_yn == "Y") || auto_oversea_delivery_fee > 0) {
                        shipping_fee_more = " ~";
                    }
                }
                $get("delivery_option_fee_" + i + "").innerHTML = result_delivery_fee_text + shipping_fee_more;
                if (selected_delivery_option_no == delivery_option_no && delivery_sub_type != undefined) {
                    var ship_to_oversea_type = "";
                    if ($("li[name='ship_select_li'][class~='selected']").length > 0) {
                        ship_to_oversea_type = $("li[name='ship_select_li'][class~='selected']").eq(0).attr("oversea_type");
                    }
                    if ($("input[type='radio'][name='delivery_option_no']:checked").length > 0) {
                        delivery_fee_condition = $("input[type='radio'][name='delivery_option_no']:checked").eq(0).attr("data-delivery-fee-cond");
                        basis_apply_type = $("input[type='radio'][name='delivery_option_no']:checked").eq(0).attr("data-basis-apply-type");
                    } else {
                        delivery_fee_condition = $("#delivery_fee_condition").val();
                        basis_apply_type = $("#basis_apply_type").val();
                    }
                    var oversea_additional_diplay = false;
                    if (oversea_yn == "Y" && oversea_type == "G" && ship_to_oversea_type != "B" && ((delivery_fee_condition == "M" && basis_apply_type.indexOf('O') < 0) || delivery_fee_condition != "M")) {
                        oversea_additional_diplay = true;
                    }
                    if (delivery_sub_type != "" || (oversea_type == "G" && cd != $("#domestic_nation_cd").val() && cd != $("#gd_ship_from_cd").val()) || (delivery_sz_yn == "Y") || oversea_additional_diplay) {
                        var surcharge_text = "";
                        if (delivery_sub_type != "") {
                            if (delivery_sub_type.indexOf("qty_") >= 0) {
                                surcharge_text += MultiLang.findResource("Qty_script");
                            } else {
                                surcharge_text += MultiLang.findResource("weight_script");
                            }
                        }
                        if (oversea_type == "G" && cd != $("#domestic_nation_cd").val() && cd != $("#gd_ship_from_cd").val()) {
                            if (delivery_sub_type.indexOf("w_") < 0) {
                                if (surcharge_text != "")
                                    surcharge_text += "/";
                                surcharge_text += MultiLang.findResource("weight_script");
                            }
                        }
                        if (cd == $get("domestic_nation_cd").value && delivery_sz_yn == "Y") {
                            if (surcharge_text != "")
                                surcharge_text += "/";
                            surcharge_text += MultiLang.findResource("region_script");
                        }
                        if (surcharge_text != "") {
                            $sget("surchargePanel").style.display = "";
                            $get("surcharge_text").innerHTML = String.format(MultiLang.findResource("QuantityDeliveryFee_Text_Script"), surcharge_text);
                        } else {
                            $sget("surchargePanel").style.display = "none";
                        }
                    } else {
                        $sget("surchargePanel").style.display = "none";
                    }
                }
                if (delivery_fee_condition == "M" && basis_fee > 0) {
                    var check_price = PriceUtil.GetMoney($("#groupbuy_sell_price").val()) != 0 ? PriceUtil.GetMoney($("#groupbuy_sell_price").val()) : PriceUtil.GetMoney($("#discounted_price").val());
                    if (check_price < PriceUtil.GetMoney(PriceUtil.FormatCurrency(basis_fee, $get("target_currency").value))) {
                        if (oversea_yn == "Y" && oversea_type == "G" || (basis_apply_type.indexOf("O") < 0 && sz_delivery_fee > 0 && oversea_type == "B")) {
                            $("#dd_delivery_condition_" + i + "").html(String.format("<a name=\"calculator\" delivery_option_no=\"{0}\">{1}</a>", delivery_option_no, String.format(MultiLang.findResource("ë°°ì†¡ë¹„ í• ì¸"), PriceUtil.FormatCurrencyCode(basis_fee, $get("target_currency").value))));
                        } else if (delivery_fee_condition == "M" && PriceUtil.GetMoney(basis_fee) > 0) {
                            $("#dd_delivery_condition_" + i + "").html(String.format(MultiLang.findResource("ë°°ì†¡ë¹„ ë¬´ë£Œ"), PriceUtil.FormatCurrencyCode(basis_fee, $get("target_currency").value)));
                        }
                        $("#dd_delivery_condition_" + i + "").show();
                    } else {
                        $("#dd_delivery_condition_" + i + "").html("");
                    }
                }
            }
        }
    }
    if (show_layer == "Y") {
        ShippingTo.showInfo();
    }
}
function openCalculator(ev) {
    var delivery_nation_cd = "", discounted_price = "", delivery_option = "";
    if (ev.currentTarget.getAttribute("ship_to_nation_cd") != undefined) {
        delivery_nation_cd = ev.currentTarget.getAttribute("ship_to_nation_cd");
        delivery_option = ev.currentTarget.getAttribute("delivery_option_no");
    } else {
        if ($get("selected_nation_cd").value != undefined) {
            delivery_nation_cd = $get("selected_nation_cd").value;
        }
        if (ev.currentTarget.getAttribute("delivery_option_no") == undefined) {
            if ($(':radio[name="delivery_option_no"]:checked').val() != undefined) {
                delivery_option = $(':radio[name="delivery_option_no"]:checked').val();
            }
        } else {
            delivery_option = ev.currentTarget.getAttribute("delivery_option_no");
        }
    }
    if ($get("discounted_price_oc").value != undefined) {
        discounted_price = $get("discounted_price_oc").value;
    }
    var order_cnt = "1";
    if (parseInt($("#order_cnt").val()) > 0) {
        order_cnt = $("#order_cnt").val();
    }
    var tmpTF = Util.__openInnerPopup_multiPopup;
    Util.__openInnerPopup_multiPopup = false;
    $("#frame_popup").attr("src", "/gmkt.inc/Goods/PopupInnerDeliveryCalculator.aspx?goodscode=" + $get("gd_no").value + "&global_order_type=" + $get("global_order_type").value + "&ship_to=" + delivery_nation_cd + "&delivery_option=" + delivery_option + "&discounted_price=" + discounted_price + "&order_cnt=");
    Util.openInnerPopup(Public.convertNormalUrl("~/Goods/PopupInnerDeliveryCalculator.aspx?goodscode=" + $get("gd_no").value + "&global_order_type=" + $get("global_order_type").value + "&ship_to=" + delivery_nation_cd + "&delivery_option=" + delivery_option + "&discounted_price=" + discounted_price + "&order_cnt="), 420, 220, 0);
    Util.__openInnerPopup_multiPopup = tmpTF;
    return false;
}
function WarehouseListDisplay() {
    if ($get("select_warehouse_list").style.display != "none") {
        $get("select_warehouse_list").style.display = "none";
        $($("#select_warehouse_list").parent("div")[0]).removeClass("click");
    } else {
        $get("select_warehouse_list").style.display = "block";
        $($("#select_warehouse_list").parent("div")[0]).addClass("click");
    }
}
function OnClickWarehouseCD(prmControl, prmWarehouseCD, prmIncludeSH) {
    if (GMKT.ServiceInfo.nation != "CN")
        return;
    $get("select_warehouse").innerHTML = $(prmControl).html();
    Util.setCookie("MecoxWarehouseName", $(prmControl).attr("warehouse"));
    Util.setCookie("MecoxWarehouseCD", prmWarehouseCD);
    Util.setCookie("MecoxIncludeSH", (prmIncludeSH ? "Y" : "N"));
    WarehouseListDisplay();
    ClearSelectOptionControl();
    ClearSelectOptionControlSub();
}
function SelectFirstOptionInventory() {
    $("p[id^='inventory_outer_text_']").parents("dl[class^='detailsArea stock color']").find("dd p[id^='inventory_title_']").hide();
    $("p[id^='inventory_outer_text_']").parents("dl[class^='detailsArea stock color']").find("dd p[id^='inventory_outer_text_']").show();
    if (1 == 2 && ($("dl[class^='detailsArea']").find("input[id^='inventory_value_']").length > 1)) {
        var tmpControl = $("dl[class^='detailsArea']").find("input[id^='inventory_value_0']").parents("dl[class^='detailsArea']").find("dd ul[class^='select_chip'] li");
        if (tmpControl != null && tmpControl.length > 0) {
            for (var cc = 0; cc < tmpControl.length; cc++) {
                if (!$($(tmpControl)[cc]).hasClass("soldout")) {
                    $($(tmpControl)[cc]).mouseover();
                    $($(tmpControl)[cc]).click();
                    _clicked_img = "";
                    $($(tmpControl)[cc]).mouseout();
                    break;
                }
            }
        }
    }
}
function SetDiscountLayerDisplay(prmShow) {
    if (prmShow) {
        if ($sget("discount_info") != null) {
            $sget("discount_info").style.display = "";
        }
        if ($sget("discount_list_info") != null) {
            $sget("discount_list_info").style.display = "";
        }
    } else {
        if ($sget("discount_info") != null) {
            $sget("discount_info").style.display = "none";
        }
        if ($sget("discount_list_info") != null) {
            $sget("discount_list_info").style.display = "none";
        }
    }
}
function GetGoodsImageUrl(tmpUrl, tmpImgType, tmpStillYN) {
    var tmpRtnValue = tmpUrl;
    if (tmpUrl.toLowerCase().indexOf("http") < 0) {
        tmpRtnValue = Public.getGoodsImagePath(tmpUrl, tmpImgType, tmpStillYN);
    }
    return tmpRtnValue;
}
function GetInventoryLevelHTML(prmInvGroupType, prmInvImgDispType, prmInvImgViewYN, prmInvImgYN, prmArrValues, prmIDX, prmSelectNM, prmID, prmInfoType, prmExposeYN) {
    var tmpRtnValue = "";
    var opt_dt_url = "";
    if (prmArrValues[prmIDX].detail_url != null && prmArrValues[prmIDX].detail_url != "") {
        opt_dt_url = "<a onclick='if(window.OptionInvenDetailPop) OptionInvenDetailPop(\"" + prmArrValues[prmIDX].detail_url + "\");' target='_blank' class='btn_newWindow'>new window</a>";
    }
    if ((prmInvGroupType == "T" || prmInvGroupType == "C" || prmInvGroupType == "I") && prmInvImgDispType == "B" && prmInvImgViewYN == "Y" && prmInvImgYN == "True")
    {
        var Img_html = "";
        var Img_url = "";
        var ori_Img_url = "";
        var t_Img_url = "";
        var color_code = "";
        var sel_count = $nget("inventory_value").length;
        if (prmID == 1) {
            if (prmArrValues[prmIDX].combination_img_url != null) {
                Img_url = prmArrValues[prmIDX].combination_img_url.split("||")[0];
            } else {
                Img_url = "";
            }
        } else {
            if (prmArrValues[prmIDX].img_url != "") {
                Img_url = prmArrValues[prmIDX].img_url;
            }
        }
        var thumnail_img_yn = "N";
        if (sel_count > 1) {
            for (var row_cnt = 0; row_cnt < sel_count; row_cnt++) {
                if (row_cnt <= 1) {
                    if ($("#inventory_img_view_yn_" + row_cnt).val() == "N") {
                        thumnail_img_yn = "Y";
                        break;
                    }
                }
            }
        } else {
            thumnail_img_yn = "Y";
        }
        if (prmArrValues[prmIDX].t_img_url == null) {
            prmArrValues[prmIDX].t_img_url = "";
        }
        if (prmArrValues[prmIDX].img_url == null) {
            prmArrValues[prmIDX].img_url = "";
        }
        if (prmArrValues[prmIDX].t_img_url != "" && thumnail_img_yn == "Y") {
            t_Img_url = prmArrValues[prmIDX].t_img_url;
        } else if (prmArrValues[prmIDX].img_url != "" && thumnail_img_yn == "N") {
            t_Img_url = prmArrValues[prmIDX].img_url;
        } else if (prmArrValues[prmIDX].color_code != "") {
            color_code = prmArrValues[prmIDX].color_code;
        }
        if (t_Img_url.trim() != "") {
            t_Img_url = GetGoodsImageUrl(t_Img_url, "LS_S", "N");
        }
        if (Img_url.trim() != "") {
            Img_url = GetGoodsImageUrl(Img_url, "M", "N");
        }
        if (prmArrValues[prmIDX].img_url != "") {
            ori_Img_url = prmArrValues[prmIDX].img_url;
        }
        if (t_Img_url != "") {
            Img_html = "<em class=\"thumb\"  id=\"Img_content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" name=\"Img_content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\"><img src=\"" + t_Img_url + "\" onerror=\"this.src='/gmkt.inc/Img/no_image.gif';\" /></em>";
        } else if (color_code != "") {
            Img_html = "<em class=\"thumb\"  id=\"Img_content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" name=\"Img_content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\"><i style=\"background: " + color_code + ";\">" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</i></em>";
        } else {
            Img_html = "<em class=\"thumb\"  id=\"Img_content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" name=\"Img_content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\"></em>";
        }
        if (prmArrValues[prmIDX].inventory_yn == "N" && prmArrValues[prmIDX].remain_cnt <= 0) {
            if (prmExposeYN == "Y") {
                tmpRtnValue = "<li class=\"soldout\" Img_url = \"" + Img_url + "\" ori_img_url=\"" + ori_Img_url + "\">" + opt_dt_url + "<a id=\"content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" >" + Img_html + "<span>" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</span></a></li>\r\n";
            } else {
                tmpRtnValue = "<li onmouseover=\"if(window.optLayerOver_optSelect) optLayerOver_optSelect(this);\" onmouseout=\"if(window.optLayerOut_optSelect) optLayerOut_optSelect(this);\" class=\"soldout\" Img_url = \"" + Img_url + "\" ori_img_url=\"" + ori_Img_url + "\">" + opt_dt_url + "<a id=\"content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('I', '" + prmID + "', '" + prmArrValues[prmIDX].sel_no + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + prmArrValues[prmIDX].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + prmArrValues[prmIDX].sel_item_price + "','" + prmArrValues[prmIDX].remain_cnt + "','" + prmArrValues[prmIDX].sel_item_price_oc + "')\">" + Img_html + "<span>" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</span></a></li>\r\n";
            }
        } else {
            tmpRtnValue = "<li onmouseover=\"if(window.optLayerOver_optSelect) optLayerOver_optSelect(this);\" onmouseout=\"if(window.optLayerOut_optSelect) optLayerOut_optSelect(this);\" Img_url = \"" + Img_url + "\" ori_img_url=\"" + ori_Img_url + "\">" + opt_dt_url + "<a id=\"content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('I', '" + prmID + "', '" + prmArrValues[prmIDX].sel_no + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + prmArrValues[prmIDX].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + prmArrValues[prmIDX].sel_item_price + "','" + prmArrValues[prmIDX].remain_cnt + "','" + prmArrValues[prmIDX].sel_item_price_oc + "')\">" + Img_html + "<span>" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</span></a></li>\r\n";
        }
        if ($("#ulIndicate li[class^='selected']").length > 0) {
            ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
        }
    } else {
        if (prmArrValues[prmIDX].inventory_yn == "N" && prmArrValues[prmIDX].remain_cnt <= 0) {
            if (prmExposeYN == "Y") {
                tmpRtnValue = "<li class=\"soldout\">" + opt_dt_url + "<span id=\"content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" )\">" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</span></li>\r\n";
            } else {
                tmpRtnValue = "<li onmouseover=\"if(window.optLayerOver) optLayerOver(this);\" onmouseout=\"if(window.optLayerOut) optLayerOut(this);\" class=\"soldout\">" + opt_dt_url + "<a><span id=\"content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\"  onclick=\"if(window.selectedOpt) selectedOpt('I', '" + prmID + "', '" + prmArrValues[prmIDX].sel_no + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + prmArrValues[prmIDX].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + prmArrValues[prmIDX].sel_item_price + "','" + prmArrValues[prmIDX].remain_cnt + "','" + prmArrValues[prmIDX].sel_item_price_oc + "')\">" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</span></a></li>\r\n";
            }
        } else {
            tmpRtnValue = "<li onmouseover=\"if(window.optLayerOver) optLayerOver(this);\" onmouseout=\"if(window.optLayerOut) optLayerOut(this);\">" + opt_dt_url + "<a><span id=\"content_" + prmSelectNM + "_" + prmID + "_" + prmArrValues[prmIDX].sel_value + "\" onclick=\"if(window.selectedOpt) selectedOpt('I', '" + prmID + "', '" + prmArrValues[prmIDX].sel_no + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', '" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, false, false).replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', this, '" + prmArrValues[prmIDX].client_sel_value.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + prmArrValues[prmIDX].sel_item_price + "','" + prmArrValues[prmIDX].remain_cnt + "','" + prmArrValues[prmIDX].sel_item_price_oc + "')\">" + textBind(prmInfoType, prmIDX, prmArrValues, prmExposeYN, true, true) + "</span></a></li>\r\n";
        }
    }
    return tmpRtnValue;
}
function GetSelectOptLayer_thum(prmIDX, prmList, prmInfoType, prmExposeYN, prmNotFirstMsg) {
    var target_currency = $get("target_currency").value;
    var sel_nmae = "";
    var function_name = "showOptInfo";
    var select_nm = "";
    if (prmInfoType == "P")
        select_nm = "opt";
    else if (prmInfoType == "I")
        select_nm = "inventory";
    var isIong = false;
    var loing_txt = "";
    var sb = "";
    var display_txt = "none";
    if (prmList.Count > 0) {
        sel_nmae = prmList[0].sel_name;
        display_txt = "";
    }
    var valueData = "";
    var textData = "";
    var textOrgData = "";
    var textDispData = "";
    var sel_name = "";
    var opt_dt_url = "";
    var textLayerData = "";
    var textLayerPrice = "";
    var textLayerPriceOC = "";
    var textLayerQty = "";
    var sel_count = $nget("inventory_value").length;
    for (var i = 0; i < prmList.length; i++) {
        var color = "";
        var t_Img_url = "";
        var Img_url = "";
        valueData = "" + prmList[i].sel_no;
        textData = textBind(prmInfoType, i, prmList, prmExposeYN, true, false);
        textOrgData = textBind(prmInfoType, i, prmList, prmExposeYN, false, false);
        textDispData = textBind(prmInfoType, i, prmList, prmExposeYN, true, true);
        textLayerData = prmList[i].client_sel_value;
        textLayerPrice = "" + prmList[i].sel_item_price;
        textLayerPriceOC = "" + prmList[i].sel_item_price_oc;
        textLayerQty = "" + prmList[i].remain_cnt;
        sel_name = prmList[i].sel_value;
        if (prmIDX == 1) {
            if (prmList[i].combination_img_url != null) {
                Img_url = prmList[i].combination_img_url.split("||")[0];
            } else {
                Img_url = "";
            }
        } else {
            Img_url = prmList[i].img_url;
        }
        var thumnail_img_yn = "N";
        if (sel_count > 1)
        {
            for (var row_cnt = 0; row_cnt < sel_count; row_cnt++)
            {
                if (row_cnt <= 1) {
                    if ($("#inventory_img_view_yn_" + row_cnt).val() == "N")
                    {
                        thumnail_img_yn = "Y";
                        break;
                    }
                }
            }
        } else
        {
            thumnail_img_yn = "Y";
        }
        if (prmList[i].t_img_url != null && prmList[i].t_img_url != "" && prmInfoType == "I" && thumnail_img_yn == "Y") {
            t_Img_url = prmList[i].t_img_url;
        } else if (prmList[i].img_url != null && prmList[i].img_url != "" && prmInfoType == "I" && thumnail_img_yn == "N") {
            t_Img_url = prmList[i].img_url;
        } else if (prmList[i].color_code != null && prmList[i].color_code != "" && prmInfoType == "I") {
            color = prmList[i].color_code;
        }
        if (t_Img_url.trim() != "") {
            t_Img_url = GetGoodsImageUrl(t_Img_url, "LS_S", "N");
        }
        if (Img_url.trim() != "") {
            Img_url = GetGoodsImageUrl(Img_url, "M", "N");
        }
        if (isIong == false && textData.Length > 36) {
            loing_txt = "style=\"width:420px;\"";
            isIong = true;
        }
        var opt_title = textLayerData;
        if (parseFloat(textLayerPrice) > 0)
            opt_title += "(+" + PriceUtil.FormatCurrencyCode(textLayerPrice, target_currency) + ")";
        else if (parseFloat(textLayerPrice) < 0)
            opt_title += "(-" + PriceUtil.FormatCurrencyCode(textLayerPrice, target_currency) + ")";
        if (prmExposeYN == "Y" && prmList[i].inventory_yn == "N" && prmList[i].remain_cnt <= 0) {
            if (color != null && color != "") {
                sb += "    <li class=\"soldout\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><i style=\"background: " + color + ";\">" + textDispData + "</i><em>" + textLayerData + "</em></span></li>\r\n";
            } else if (t_Img_url != null && t_Img_url != "") {
                sb += "    <li class=\"soldout\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" title=\"" + opt_title + "\"><a  name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\" ><img src=\"" + ((t_Img_url != null && t_Img_url != "") ? GetGoodsImageUrl(t_Img_url, "LS_S", "N") : "") + "\" onError=\"this.src='/gmkt.inc/Img/no_image.gif';\"/></a><em>" + textLayerData + "</em></span></li>\r\n";
            } else {
                sb += "    <li class=\"soldout nothumb\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><i>" + textDispData + "</i><em>" + textLayerData + "</em></span></li>\r\n";
            }
        } else {
            var tmpliClass = "";
            if (prmExposeYN != "Y" && prmList[i].inventory_yn == "N" && prmList[i].remain_cnt <= 0)
            {
                tmpliClass = "soldout";
            }
            if (color != null && color != "") {
                sb += "    <li onmouseover=\"if(window.optLayerOver_thum) optLayerOver_thum(this,'" + prmIDX + "','" + select_nm + "',  '" + textLayerData + "');\" onmouseout=\"if(window.optLayerOut_thum) optLayerOut_thum(this,'" + prmIDX + "','" + select_nm + "');\"  class=\"" + tmpliClass + "\"  onclick=\"if(window.selectedOpt) selectedOpt('" + prmInfoType + "', '" + prmIDX + "', '" + valueData + "', '" + textData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textOrgData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "',  'content_" + select_nm + "_" + prmIDX + "_" + sel_name + "', '" + textLayerData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textLayerPrice + "','" + textLayerQty + "','" + textLayerPriceOC + "')\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\" qty=\"" + textLayerQty + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><i style=\"background: " + color + ";\">" + textDispData + "</i><em>" + textLayerData + "</em></span></li>\r\n";
            } else if (t_Img_url != null && t_Img_url != "") {
                sb += "    <li onmouseover=\"if(window.optLayerOver_thum) optLayerOver_thum(this,'" + prmIDX + "','" + select_nm + "',  '" + textLayerData + "');\" onmouseout=\"if(window.optLayerOut_thum) optLayerOut_thum(this,'" + prmIDX + "','" + select_nm + "');\"   class=\"" + tmpliClass + "\"   onclick=\"if(window.selectedOpt) selectedOpt('" + prmInfoType + "', '" + prmIDX + "', '" + valueData + "', '" + textData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textOrgData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', 'content_" + select_nm + "_" + prmIDX + "_" + sel_name + "', '" + textLayerData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textLayerPrice + "','" + textLayerQty + "','" + textLayerPriceOC + "')\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\" qty=\"" + textLayerQty + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" title=\"" + opt_title + "\"><a  name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\" ><img src=\"" + ((t_Img_url != null && t_Img_url != "") ? GetGoodsImageUrl(t_Img_url, "LS_S", "N") : "") + "\" onError=\"this.src='/gmkt.inc/Img/no_image.gif';\"/></a><em>" + textLayerData + "</em></span></li>\r\n";
            } else {
                tmpliClass += " nothumb";
                sb += "    <li  onmouseover=\"if(window.optLayerOver_thum) optLayerOver_thum(this,'" + prmIDX + "','" + select_nm + "',  '" + textLayerData + "');\" onmouseout=\"if(window.optLayerOut_thum) optLayerOut_thum(this,'" + prmIDX + "','" + select_nm + "');\"  class=\"" + tmpliClass + "\"  onclick=\"if(window.selectedOpt) selectedOpt('" + prmInfoType + "', '" + prmIDX + "', '" + valueData + "', '" + textData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textOrgData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', 'content_" + select_nm + "_" + prmIDX + "_" + sel_name + "', '" + textLayerData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textLayerPrice + "','" + textLayerQty + "','" + textLayerPriceOC + "')\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\" qty=\"" + textLayerQty + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><i>" + textDispData + "</i><em>" + textLayerData + "</em></span></li>\r\n";
            }
        }
    }
    return sb;
}
function GetSelectOptLayer_thum_Large(prmIDX, prmList, prmInfoType, prmExposeYN, prmNotFirstMsg) {
    var target_currency = $get("target_currency").value;
    var sel_nmae = "";
    var function_name = "showOptInfo";
    var select_nm = "";
    if (prmInfoType == "P")
        select_nm = "opt";
    else if (prmInfoType == "I")
        select_nm = "inventory";
    var isIong = false;
    var loing_txt = "";
    var sb = "";
    var display_txt = "none";
    if (prmList.Count > 0) {
        sel_nmae = prmList[0].sel_name;
        display_txt = "";
    }
    var valueData = "";
    var textData = "";
    var textOrgData = "";
    var textDispData = "";
    var sel_name = "";
    var opt_dt_url = "";
    var textLayerData = "";
    var textLayerPrice = "";
    var textLayerPriceOC = "";
    var textLayerQty = "";
    var sel_count = $nget("inventory_value").length;
    for (var i = 0; i < prmList.length; i++) {
        var color = "";
        var t_Img_url = "";
        var Img_url = "";
        valueData = "" + prmList[i].sel_no;
        textData = textBind(prmInfoType, i, prmList, prmExposeYN, true, false);
        textOrgData = textBind(prmInfoType, i, prmList, prmExposeYN, false, false);
        textDispData = textBind(prmInfoType, i, prmList, prmExposeYN, true, true);
        textLayerData = prmList[i].client_sel_value;
        textLayerPrice = "" + prmList[i].sel_item_price;
        textLayerPriceOC = "" + prmList[i].sel_item_price_oc;
        textLayerQty = "" + prmList[i].remain_cnt;
        sel_name = prmList[i].sel_value;
        if (prmIDX == 1) {
            if (prmList[i].combination_img_url != null) {
                Img_url = prmList[i].combination_img_url.split("||")[0];
            } else {
                Img_url = "";
            }
        } else {
            Img_url = prmList[i].img_url;
        }
        var thumnail_img_yn = "N";
        if (sel_count > 1)
        {
            for (var row_cnt = 0; row_cnt < sel_count; row_cnt++)
            {
                if (row_cnt <= 1) {
                    if ($("#inventory_img_view_yn_" + row_cnt).val() == "N")
                    {
                        thumnail_img_yn = "Y";
                        break;
                    }
                }
            }
        } else
        {
            thumnail_img_yn = "Y";
        }
        if (prmList[i].t_img_url != null && prmList[i].t_img_url != "" && prmInfoType == "I" && thumnail_img_yn == "Y") {
            t_Img_url = prmList[i].t_img_url;
        } else if (prmList[i].img_url != null && prmList[i].img_url != "" && prmInfoType == "I" && thumnail_img_yn == "N") {
            t_Img_url = prmList[i].img_url;
        } else if (prmList[i].color_code != null && prmList[i].color_code != "" && prmInfoType == "I") {
            color = prmList[i].color_code;
        }
        if (t_Img_url.trim() != "") {
            t_Img_url = GetGoodsImageUrl(t_Img_url, "LS_S", "N");
        }
        if (Img_url.trim() != "") {
            Img_url = GetGoodsImageUrl(Img_url, "M", "N");
        }
        if (isIong == false && textData.Length > 36) {
            loing_txt = "style=\"width:420px;\"";
            isIong = true;
        }
        var opt_title = textLayerData;
        if (parseFloat(textLayerPrice) > 0)
            opt_title += "(+" + PriceUtil.FormatCurrencyCode(textLayerPrice, target_currency) + ")";
        else if (parseFloat(textLayerPrice) < 0)
            opt_title += "(-" + PriceUtil.FormatCurrencyCode(textLayerPrice, target_currency) + ")";
        if (prmExposeYN == "Y" && prmList[i].inventory_yn == "N" && prmList[i].remain_cnt <= 0) {
            if (color != null && color != "") {
                sb += "    <li class=\"soldout\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\"><em>" + MultiLang.findResource("OutOfStock") + "</em><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><i style=\"background: " + color + ";\">" + textDispData + "</i></span></li>\r\n";
            } else if (t_Img_url != null && t_Img_url != "") {
                sb += "    <li class=\"soldout\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\"><em>" + MultiLang.findResource("OutOfStock") + "</em><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" title=\"" + opt_title + "\"><a  name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\" ><img src=\"" + ((t_Img_url != null && t_Img_url != "") ? GetGoodsImageUrl(t_Img_url, "LS_S", "N") : "") + "\" onError=\"this.src='/gmkt.inc/Img/no_image.gif';\"/></a></span></li>\r\n";
            } else {
                sb += "    <li class=\"soldout nothumb\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><a>" + textDispData + "</a></span></li>\r\n";
            }
        } else {
            var tmpliClass = "";
            var tmpliSoldOutTxt = "";
            if (prmExposeYN != "Y" && prmList[i].inventory_yn == "N" && prmList[i].remain_cnt <= 0)
            {
                tmpliClass = "soldout";
                tmpliSoldOutTxt = "<em>" + MultiLang.findResource("OutOfStock") + "</em>";
            }
            if (color != null && color != "") {
                sb += "    <li onmouseover=\"if(window.optLayerOver_thum) optLayerOver_thum(this,'" + prmIDX + "','" + select_nm + "',  '" + textLayerData + "');\" onmouseout=\"if(window.optLayerOut_thum) optLayerOut_thum(this,'" + prmIDX + "','" + select_nm + "');\"  class=\"" + tmpliClass + "\"  onclick=\"if(window.selectedOpt) selectedOpt('" + prmInfoType + "', '" + prmIDX + "', '" + valueData + "', '" + textData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textOrgData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "',  'content_" + select_nm + "_" + prmIDX + "_" + sel_name + "', '" + textLayerData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textLayerPrice + "','" + textLayerQty + "','" + textLayerPriceOC + "')\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\" qty=\"" + textLayerQty + "\">" + tmpliSoldOutTxt + "<dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><i style=\"background: " + color + ";\">" + textDispData + "</i></span></li>\r\n";
            } else if (t_Img_url != null && t_Img_url != "") {
                sb += "    <li onmouseover=\"if(window.optLayerOver_thum) optLayerOver_thum(this,'" + prmIDX + "','" + select_nm + "',  '" + textLayerData + "');\" onmouseout=\"if(window.optLayerOut_thum) optLayerOut_thum(this,'" + prmIDX + "','" + select_nm + "');\"   class=\"" + tmpliClass + "\"   onclick=\"if(window.selectedOpt) selectedOpt('" + prmInfoType + "', '" + prmIDX + "', '" + valueData + "', '" + textData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textOrgData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', 'content_" + select_nm + "_" + prmIDX + "_" + sel_name + "', '" + textLayerData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textLayerPrice + "','" + textLayerQty + "','" + textLayerPriceOC + "')\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\" qty=\"" + textLayerQty + "\">" + tmpliSoldOutTxt + "<dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" title=\"" + opt_title + "\"><a  name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\" ><img src=\"" + ((t_Img_url != null && t_Img_url != "") ? GetGoodsImageUrl(t_Img_url, "LS_S", "N") : "") + "\" onError=\"this.src='/gmkt.inc/Img/no_image.gif';\"/></a></span></li>\r\n";
            } else {
                tmpliClass += " nothumb";
                sb += "    <li  onmouseover=\"if(window.optLayerOver_thum) optLayerOver_thum(this,'" + prmIDX + "','" + select_nm + "',  '" + textLayerData + "');\" onmouseout=\"if(window.optLayerOut_thum) optLayerOut_thum(this,'" + prmIDX + "','" + select_nm + "');\"  class=\"" + tmpliClass + "\"  onclick=\"if(window.selectedOpt) selectedOpt('" + prmInfoType + "', '" + prmIDX + "', '" + valueData + "', '" + textData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textOrgData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "', 'content_" + select_nm + "_" + prmIDX + "_" + sel_name + "', '" + textLayerData.replace(/\&\#39\;/g, "'").replace(/'/g, "\\'") + "','" + textLayerPrice + "','" + textLayerQty + "','" + textLayerPriceOC + "')\" Img_url =\"" + Img_url + "\" price=\"" + textLayerPrice + "\" price_oc=\"" + textLayerPriceOC + "\" qty=\"" + textLayerQty + "\"><dfn></dfn><span id=\"content_" + select_nm + "_" + prmIDX + "_" + sel_name + "\" name=\"content_" + select_nm + "_" + prmIDX + "_" + valueData + "\"  title=\"" + opt_title + "\"><a>" + textDispData + "</a></span></li>\r\n";
            }
        }
    }
    return sb;
}
function OptionImageOver(prmControl) {
    if (opt_Image_Timer_ObjArr[0] != null) {
        clearTimeout(opt_Image_Timer_ObjArr[0]);
        opt_Image_Timer_ObjArr[0] = null;
    }
    var timerId = setTimeout(function () {
        if ($(prmControl).attr("img_no") != null) {
            var Img_url = $(prmControl).attr("img_no");
            if (Img_url != "") {
                Img_url = GetGoodsImageUrl(Img_url, "M", "N");
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", Img_url, 442, 340)
                }
                $("#Img_option_title").css("display", "none");
                var tmpPrice = $(prmControl).attr("sel_price");
                if (tmpPrice != null && tmpPrice != "") {
                    tmpPrice = parseFloat(tmpPrice);
                    if (tmpPrice > 0)
                        tmpPrice = "(+" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + ")";
                    else if (tmpPrice < 0)
                        tmpPrice = "(" + PriceUtil.FormatCurrencyCode(tmpPrice, $get("target_currency").value) + ")";
                    else
                        tmpPrice = "";
                } else {
                    tmpPrice = "";
                }
                var tmpTxt1 = $(prmControl).attr("cli_sel_nm1") + " : " + $(prmControl).attr("cli_sel_vl1");
                var tmpTxt2 = $(prmControl).attr("cli_sel_nm2") + " : " + $(prmControl).attr("cli_sel_vl2") + tmpPrice;
                $("#OptionImageSelectText p[idx='1']").html(tmpTxt1);
                $("#OptionImageSelectText p[idx='2']").html(tmpTxt2);
                opt_Image_Text[0] = tmpTxt1;
                opt_Image_Text[1] = tmpTxt2;
            }
        }
        if (!$(prmControl).hasClass("clicked")) {
            $(prmControl).addClass("hover");
        }
        if (opt_Image_Timer_ObjArr[0] != null) {
            clearTimeout(opt_Image_Timer_ObjArr[0]);
            opt_Image_Timer_ObjArr[0] = null;
        }
    }, 100);
    opt_Image_Timer_ObjArr[0] = timerId;
}
function OptionImageOut(prmControl) {
    if (opt_Image_Timer_ObjArr[0] != null) {
        clearTimeout(opt_Image_Timer_ObjArr[0]);
        opt_Image_Timer_ObjArr[0] = null;
    }
    $(prmControl).removeClass("hover");
    var timerId = setTimeout(function () {
        $("#OptionImageSelectText p[idx='1']").html((opt_Image_selected_Info.sel_text1 == null ? "" : opt_Image_selected_Info.sel_text1));
        $("#OptionImageSelectText p[idx='2']").html((opt_Image_selected_Info.sel_text2 == null ? "" : opt_Image_selected_Info.sel_text2));
        if (_clicked_img != "") {
            if (glio_Control.imageType == "S") {
                imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
            } else {
                imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
            }
            if (_clicked_text != "") {
                $("#Img_option_title").css("display", "");
                $get("Img_option_title").innerHTML = "<p>" + _clicked_text + "</p>";
            }
        } else if (opt_Goods_Img_url != "") {
            if (glio_Control.imageType == "S") {
                imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400)
            } else {
                imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340)
            }
            $("#Img_option_title").css("display", "none");
            $get("Img_option_title").innerHTML = "";
        } else {
            if ($("#ulIndicate li[class^='selected']").length > 0) {
                ChgIndicateGoodsImage($("#ulIndicate li[class^='selected']").attr("idx"));
            }
        }
        if (opt_Image_Timer_ObjArr[0] != null) {
            clearTimeout(opt_Image_Timer_ObjArr[0]);
            opt_Image_Timer_ObjArr[0] = null;
        }
    }, 100);
    opt_Image_Timer_ObjArr[0] = timerId;
}
function OptionImageClick(prmControl) {
    $(prmControl).addClass("clicked");
    $(prmControl).removeClass("hover");
    var tmpIDX = $(prmControl).attr("idx");
    $("#OptionImageLayer").find("div[class^='slide_in'] ul[class='sliding'] li[idx!='" + tmpIDX + "']").removeClass();
    opt_Image_selected_Info.idx = tmpIDX;
    opt_Image_selected_Info.img_no = $(prmControl).attr("img_no");
    opt_Image_selected_Info.sel_text1 = opt_Image_Text[0];
    opt_Image_selected_Info.sel_text2 = opt_Image_Text[1];
    opt_Image_selected_Info.sel_name1 = $(prmControl).attr("sel_nm1");
    opt_Image_selected_Info.sel_name2 = $(prmControl).attr("sel_nm2");
    opt_Image_selected_Info.sel_value1 = $(prmControl).attr("sel_vl1");
    opt_Image_selected_Info.sel_value2 = $(prmControl).attr("sel_vl2");
}
function SetOptionImageUrl() {
    if (opt_Image_Info.first_open) {
        $("#OptionImageLayer").find("div[class^='slide_in'] ul[class='sliding'] li").each(function () {
            var tempImg = new Image;
            var tmpControl = this;
            $(tempImg).load(function () {
                $(tmpControl).find("img").attr("src", tempImg.src);
            });
            $(tempImg).error(function () {});
            tempImg.src = GetGoodsImageUrl($(this).attr("img_no"), "S_S", "N");
        });
    }
    opt_Image_Info.first_open = false;
}
function OptionImageLayerPageMove(prmType) {
    var tmpPageNum = $('#OptionImageLayer').find("div[class='slide_in']").attr("Inv_page_num");
    tmpPageNum = parseFloat(tmpPageNum);
    if (prmType == "prev") {
        if (opt_Image_Info.pageNum > 0) {
            opt_Image_Info.pageNum--;
            $('#OptionImageLayer').find("div[class='slide_in']").animate({left: (opt_Image_Info.pageNum * opt_Image_Info.img_move_value) + "px"}, "slow");
        }
    } else if (prmType == "next") {
        if ((opt_Image_Info.pageNum + 1) < tmpPageNum) {
            opt_Image_Info.pageNum++;
            $('#OptionImageLayer').find("div[class='slide_in']").animate({left: (opt_Image_Info.pageNum * opt_Image_Info.img_move_value) + "px"}, "slow");
        }
    }
    if (opt_Image_Info.pageNum > 0) {
        $("#OptionImageLayer").find("div[class^='slide_list'] a[class='btn_prev']").css("display", "");
    } else {
        $("#OptionImageLayer").find("div[class^='slide_list'] a[class='btn_prev']").css("display", "none");
    }
    if ((opt_Image_Info.pageNum + 1) < tmpPageNum) {
        $("#OptionImageLayer").find("div[class^='slide_list'] a[class='btn_next']").css("display", "");
    } else {
        $("#OptionImageLayer").find("div[class^='slide_list'] a[class='btn_next']").css("display", "none");
    }
}
function GetSelectOptionListQty() {
    var qty = 0;
    if ($("#dl_SelectOptionList input:text[name^='SelectOptionQty_']").length > 0) {
        for (var i = 0; i < $("#dl_SelectOptionList input:text[name^='SelectOptionQty_']").length; i++) {
            qty += parseInt($($("#dl_SelectOptionList input:text[name^='SelectOptionQty_']")[i]).val());
        }
    } else {
        qty = parseInt($get("order_cnt").value);
    }
    return qty;
}
function SetSelectOptionListQty(option_qty_cnt, idx) {
    var purchase_unit = $get("purchase_unit").value;
    var HTML = "";
    if (purchase_unit != 0 && purchase_unit != "") {
        HTML += "<select name='SelectOptionQty_" + idx + "' onchange=\"SelectOptionListQty_onChange(this,'" + idx + "');\">";
        var iLimit = 999;
        if ($get("order_limit_yn").value == "Y")
            iLimit = parseInt($get("orderPossibleCnt").value);
        for (var i = 1; i <= iLimit; i++) {
            if (i % purchase_unit == 0) {
                if (i == option_qty_cnt) {
                    HTML += "<option value='" + i + "' selected>" + i + "</option>\r\n";
                } else {
                    HTML += "<option value='" + i + "' >" + i + "</option>\r\n";
                }
            }
        }
        HTML += "</select>";
    } else {
        HTML += "<div class=\"ctrlArea\" style=\"text-align:center;\">";
        HTML += "<input type=\"text\"  name=\"SelectOptionQty_" + idx + "\" class=\"textType\"  style=\"width:28px; text-align:center;\" value=\"" + option_qty_cnt + "\" onclick=\"if(window.SelectOptionListQty_onClick) SelectOptionListQty_onClick(this);\"  onblur=\"javascript:SelectOptionListQty_onChange(this,'" + idx + "');\" onchange=\"javascript:SelectOptionListQty_onChange(this,'" + idx + "');\" />";
        HTML += "<a name=\"btnSelectOptionQty_plus_" + idx + "\" class=\"up\" onclick=\"if(window.btnSelectOptionQty) btnSelectOptionQty('" + idx + "','plus', this);\">up</a>";
        HTML += "<a name=\"btnSelectOptionQty_minus_" + idx + "\" class=\"down\" onclick=\"if(window.btnSelectOptionQty) btnSelectOptionQty('" + idx + "','minus', this);\">down</a>";
        HTML += "</div>";
    }
    return HTML;
}
function checkSelectOptionListQty(prmTotalChk, idx, obj) {
    if (!Util.isNumber($(obj).val()) || parseInt($(obj).val()) <= 0) {
        $(obj).val("1");
        $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='qty']").html(SetSelectOptionListQty("1", idx));
    }
    var tmpInvNo = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("inv_no");
    var tmpQty = parseInt($(obj).val());
    var tmpInvQty = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("inv_max_qty");
    var tmpInvNo_Control = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][inv_no='" + tmpInvNo + "']");
    var tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
    var total_order_cnt = 0;
    var opt_total_qty = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("qty");
    if (tmpInvNo_Control != null && tmpInvNo_Control.length > 0 && tmpInvNo > 0) {
        for (var k = 0; k < tmpInvNo_Control.length; k++) {
            for (var c = 0; c < tmpControl.length; c++) {
                if ($(tmpInvNo_Control[k]).attr("idx") != idx && $(tmpInvNo_Control[k]).attr("idx") == $(tmpControl[c]).attr("idx") && $(tmpInvNo_Control[k]).attr("inv_no") == $(tmpControl[c]).attr("inv_no")) {
                    total_order_cnt += parseInt($(tmpInvNo_Control[k]).attr("qty"));
                }
            }
        }
        if ((parseInt(total_order_cnt) + parseInt(tmpQty)) > parseFloat(tmpInvQty)) {
            $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='qty']").html(SetSelectOptionListQty(opt_total_qty, idx));
            alert(String.format(MultiLang.findResource("ALERT_MSG23"), tmpInvQty));
            return false;
        }
    }
    if (prmTotalChk) {
        if ($get("order_limit_yn").value == "Y") {
            var total_order_cnt = 0;
            if (tmpControl != null && tmpControl.length > 0) {
                for (var k = 0; k < tmpControl.length; k++) {
                    if (idx != $(tmpControl[k]).attr("idx"))
                        total_order_cnt += parseInt($(tmpControl[k]).attr("qty"));
                }
            }
            total_order_cnt += parseInt($(obj).val());
            var order_possible_cnt = parseInt($get("orderPossibleCnt").value);
            if (parseInt(order_possible_cnt) < parseInt(total_order_cnt)) {
                if (parseInt(tmpQty) > 1) {
                    alert(MultiLang.findResource("order_limit_alert_2"));
                }
                var chk_cnt = opt_total_qty;
                var purchase_unit = $get("purchase_unit").value;
                if (purchase_unit != 0 && purchase_unit != "") {
                    chk_cnt = purchase_unit;
                }
                var opt_total_price = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price");
                var opt_total_price_oc = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price_oc");
                var opt_price = parseFloat(opt_total_price) / parseInt(opt_total_qty);
                var tmp_price = parseFloat(opt_price) * parseFloat(chk_cnt);
                var opt_price_oc = parseFloat(opt_total_price_oc) / parseInt(opt_total_qty);
                var tmp_price_oc = parseFloat(opt_price_oc) * parseFloat(tmp_qty);
                $("dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("qty", chk_cnt);
                $("dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price", tmp_price);
                $("dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price_oc", tmp_price_oc);
                $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='price'] span[s_idx='price']").text(PriceUtil.FormatCurrencyCode(tmp_price, $get("target_currency").value));
                $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='qty']").html(SetSelectOptionListQty(chk_cnt, idx));
                return false;
            }
        }
        return true;
    } else {
        if ($(obj).prop("readonly") == true) {
            if ($get("multi_order_yn").value == "Y") {
            } else if ($get("gd_no").value == "401309687") {
            } else {
                alert(MultiLang.findResource("alert_msg_11"));
            }
            $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='qty']").html(SetSelectOptionListQty(opt_total_qty, idx));
            return false;
        } else
            return true;
    }
}
function SelectOptionListQty_onChange(obj, idx) {
    var opt_total_qty = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("qty");
    var opt_total_price = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price");
    var opt_total_price_oc = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price_oc");
    var tmp_qty = $(obj).val();
    var opt_price = parseFloat(opt_total_price) / parseInt(opt_total_qty);
    var tmp_price = parseFloat(opt_price) * parseFloat(tmp_qty);
    var opt_price_oc = parseFloat(opt_total_price_oc) / parseInt(opt_total_qty);
    var tmp_price_oc = parseFloat(opt_price_oc) * parseFloat(tmp_qty);
    $("dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("qty", tmp_qty);
    $("dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price", tmp_price);
    $("dd[name='dd_SelectOptionList'][idx='" + idx + "']").attr("price_oc", tmp_price_oc);
    $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='price'] span[s_idx='price']").text(PriceUtil.FormatCurrencyCode(tmp_price, $get("target_currency").value));
    $("dd[name='dd_SelectOptionList'][idx='" + idx + "'] td[t_idx='qty']").html(SetSelectOptionListQty(tmp_qty, idx));
    Bargain.DisplayBtn();
    return true;
}
function SelectOptionListQty_onClick(obj) {
    if ($(obj).val() <= 1) {
        $(obj).val("");
    }
}
function btnSelectOptionQty(idx, type, obj) {
    var tmp_qty_obj = $($(obj).parent()).find("[name='SelectOptionQty_" + idx + "']");
    var opt_qty = parseInt($(tmp_qty_obj).val());
    if (!Util.isNumber(opt_qty) || parseInt(opt_qty) <= 0) {
        alert(MultiLang.findResource("alert_msg_3"));
        return;
    }
    if (type == "plus") {
        opt_qty++;
        if (opt_qty > 999) {
            alert(MultiLang.findResource("alert_msg_5"));
            return;
        }
    } else if (type == "minus") {
        opt_qty--;
        if (opt_qty < 1) {
            alert(MultiLang.findResource("alert_msg_6"));
            return;
        }
    }
    $(tmp_qty_obj).val(opt_qty);
    if (!SelectOptionListQty_onChange($(tmp_qty_obj), idx)) {
        return;
    }
    Bargain.DisplayBtn();
}
function SelectOptionListQtyCss(idx, CouponUse) {
    var purchase_unit = $get("purchase_unit").value;
    if (CouponUse) {
        $("[name='SelectOptionQty_" + idx + "']").prop("disabled", true);
        $("[name='SelectOptionQty_" + idx + "']").eq(0).css("background-color", "#E6E6E6");
        if (purchase_unit == 0 || purchase_unit == "") {
            $("a[name='btnSelectOptionQty_plus_" + idx + "']").css("display", "none");
            $("a[name='btnSelectOptionQty_minus_" + idx + "']").css("display", "none");
        }
    } else {
        $("[name='SelectOptionQty_" + idx + "']").prop("disabled", false);
        $("[name='SelectOptionQty_" + idx + "']").css("background-color", "");
        if (purchase_unit == 0 || purchase_unit == "") {
            $("a[name='btnSelectOptionQty_plus_" + idx + "']").css("display", "");
            $("a[name='btnSelectOptionQty_minus_" + idx + "']").css("display", "");
        }
    }
}
function displayContentsService(obj) {
    if ($get("contents_service_layer") == null)
        return;
    if (obj == "show")
        $get("contents_service_layer").style.display = "block";
    else
        $get("contents_service_layer").style.display = "none";
}
function updateShippingFeeConditionText() {
    var apply_price = getApplyPrice();
    $("[class^=sh_option]").each(function () {
        var basis_price, target_currency, delivery_fee_cond, tag_name = $(this).get(0).tagName, $target, $fee_text = $(this).find("em[id^=delivery_option_fee]"), $condition_text = $(this).siblings("p[id^=dd_delivery_condition]");
        if (tag_name == "LABEL") {
            $target = $(this).prev("input[name^=delivery_option_no]");
        } else if (tag_name == "P") {
            $target = $(this);
        }
        if (parseFloat($target.attr("data-fee")) === 0) {
            return true;
        }
        basis_price = parseFloat($target.attr("data-basis-money"));
        target_currency = $target.attr("data-target-currency");
        delivery_fee_cond = $target.attr("data-delivery-fee-cond");
        if ((delivery_fee_cond == "M" || delivery_fee_cond == "R") && parseInt(basis_price, 10) !== 0 && apply_price >= basis_price) {
            $condition_text.hide();
        } else {
            $condition_text.show();
        }
    });
}
function getApplyPrice() {
    var min_apply_price = -1;
    $(".detailsArea dd strong").each(function () {
        var price = parseFloat($(this).attr("data-price"));
        if (price === "" || isNaN(price)) {
            return true;
        }
        if (min_apply_price == -1) {
            min_apply_price = price;
        }
        if (min_apply_price > price) {
            min_apply_price = price;
        }
    });
    return min_apply_price;
}
function checkTopupOption(prmControl) {
    var gd_type, gd_sub_type, hp_no;
    gd_type = $("#gd_type").val();
    gd_sub_type = $("#gd_sub_type").val();
    hp_no = $(prmControl).val();
    if (gd_type != "CI" || gd_sub_type != "TU") {
        return true;
    }
    if (!Util.isNumber(hp_no)) {
        alert(MultiLang.findResource("TopupCheckNumber"));
        return false;
    }
    if (hp_no.length != 8 && GMKT.ServiceInfo.nation == "SG") {
        alert(MultiLang.findResource("TopupCheckLengthSG"));
        return false;
    }
    return true;
}
function SelectFirstShippingTo() {
    try {
        if ($("li[name='ship_select_li']") != undefined) {
            if ($("#cookie_set_shipto").val() != "" && $get("ship_select_li_" + $("#cookie_set_shipto").val() + "") != undefined) {
                ShippingTo.selectShip($get("ship_select_li_" + $("#cookie_set_shipto").val() + ""), $("#cookie_set_shipto").val(), 0, "");
            } else {
                if (GMKT.ServiceInfo.nation != "US" && $("#global_order_type").val() != "G") {
                    ShippingTo.selectShip($get("ship_select_li_" + GMKT.ServiceInfo.region + ""), GMKT.ServiceInfo.region, 0, "");
                } else {
                    if ($get("ship_select_li_" + $("#cus_nation_cd_by_ip").val() + "") != undefined) {
                        ShippingTo.selectShip($get("ship_select_li_" + $("#cus_nation_cd_by_ip").val() + ""), $("#cus_nation_cd_by_ip").val(), 0, "");
                    } else if ($get("ship_select_li_" + GMKT.ServiceInfo.region + "") != undefined) {
                        ShippingTo.selectShip($get("ship_select_li_" + GMKT.ServiceInfo.region + ""), GMKT.ServiceInfo.region, 0, "");
                    } else {
                        ShippingTo.selectShip($get("ship_select_li_" + $("#domestic_nation_cd").val() + ""), $("#domestic_nation_cd").val(), 0, "");
                    }
                }
            }
        }
    } catch (e) {
    }
}
function Global_openCalculator() {
    var tmpTF = Util.__openInnerPopup_multiPopup;
    Util.__openInnerPopup_multiPopup = false;
    $("#frame_popup").attr("src", "/gmkt.inc/Goods/PopupInnerDeliveryCalculator.aspx?goodscode=" + $get("global_gd_no").value + "&global_order_type=G&ship_to=&delivery_option=&discounted_price=&global_go=Y");
    Util.openInnerPopup(Public.convertNormalUrl("~/Goods/PopupInnerDeliveryCalculator.aspx?goodscode=" + $get("global_gd_no").value + "&global_order_type=G&ship_to=&delivery_option=&discounted_price=&global_go=Y"), 420, 220, 0);
    Util.__openInnerPopup_multiPopup = tmpTF;
    return false;
}
function Global_QuickView() {
    Util.openInnerPopup(Public.convertNormalUrl("~/Goods/QuickView.aspx?goodscode=" + $get("global_gd_no").value), 680, 450, 0);
    return false;
}
function Go_Global_Goods() {
    window.open(Public.getWWWServer() + "/item/" + Public.getSEOVirtualPath($get("gd_nm").value, 30) + "/" + $get("global_gd_no").value);
}
function GoDownloadApp() {
    window.open(Public.getWWWServerUrl('/Event/QPost.aspx?tab=S'));
}
function jcb() {
    $("a.lnk").parents("dl").next(".layer_info").toggle();
}
function PaymentDiscountLayer(obj) {
    $(obj).parents("dl").next(".layer_info").toggle();
}
var QPrice = {COST_BASIS_NO_FOR_ORDER: 0, COST_BASIS_TYPE_FOR_ORDER: "", DEDUCTION_TYPE_FOR_ORDER: "", cost_basis_no: 0, cost_basis_type: "", deduction_type: "", chkQPriceCondition: function (order_cnt) {
        if (!Public.isLogin()) {
            return true;
        }
        if (order_cnt == 0) {
            return true;
        }
        if (QPrice.cost_basis_type != "QD" || QPrice.deduction_type != "ST") {
            return true;
        }
        if (QPrice.cost_basis_no == "" || QPrice.cost_basis_no == "0" || QPrice.cost_basis_no == null) {
            return true;
        }
        var gd_no = $("#gd_no").val();
        var global_order_type = $("#global_order_type").val();
        var param = new RMSParam();
        param.add("gd_no", gd_no);
        param.add("order_cnt", order_cnt);
        param.add("cost_basis_no", QPrice.cost_basis_no);
        param.add("global_order_type", global_order_type);
        var require_cnt = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "CheckGChanceBenefit", param.toJson());
        if (require_cnt != null && require_cnt < 0) {
            alert(MultiLang.findResource("Q-Chance condition alert"));
            return false;
        }
        return true;
    }, chkFinalStep: function () {
        if (QPrice.COST_BASIS_NO_FOR_ORDER == 0) {
            return true;
        }
        var cost_basis_no_s = QPrice.COST_BASIS_NO_FOR_ORDER;
        var basic_cost_basis_no = $("#basic_cost_basis_no").val();
        if (basic_cost_basis_no > 0 && basic_cost_basis_no != QPrice.COST_BASIS_NO_FOR_ORDER) {
            cost_basis_no_s = basic_cost_basis_no + "" + QPrice.COST_BASIS_NO_FOR_ORDER;
        }
        var $target_qprice = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][cost_basis_no='" + cost_basis_no_s + "']");
        var qprice_order_cnt = 0;
        if ($target_qprice.length > 0 || QPrice.deduction_type == "ST") {
            if ($target_qprice.length > 0) {
                for (var k = 0; k < $target_qprice.length; k++) {
                    qprice_order_cnt += parseInt($target_qprice.eq(k).attr("qty"));
                }
            } else if (QPrice.deduction_type == "ST") {
                qprice_order_cnt = $("#order_cnt").val();
            }
            if (qprice_order_cnt > 0) {
                QPrice.deduction_type = QPrice.DEDUCTION_TYPE_FOR_ORDER;
                QPrice.cost_basis_no = QPrice.COST_BASIS_NO_FOR_ORDER;
                QPrice.cost_basis_type = QPrice.COST_BASIS_TYPE_FOR_ORDER;
                if (!QPrice.chkQPriceCondition(qprice_order_cnt)) {
                    return false;
                }
            }
        }
        return true;
    }};
function ChkLimitQtySetting() {
    if (Public.isLogin()) {
        return true;
    }
    var order_limit_yn = $("#order_limit_yn").val();
    var chk_discount_qty_limit_yn = $("#chk_discount_qty_limit_yn").val();
    if (order_limit_yn == "Y" || chk_discount_qty_limit_yn == "Y" || PageVariable.tp_order_limit_cnt > 0) {
        alert(MultiLang.findResource("chk_limited_qty_yn_alert"));
        Util.openInnerPopup(Public.convertNormalUrl("~/Login/PopupLogin.aspx") + "?member_only=Y&ReturnUrl=excute:Util.InnerPopupCloseAfterLogin();", 430, 450);
        return false;
    }
    return true;
}
function IsCouponAvailable() {
    var available_coupon_box = $("#available_coupon_box").val();
    var tmpCostBaType;
    if (isSltOptCoupon && selectOptListIdx >= 0) {
        tmpCostBaType = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][idx='" + selectOptListIdx + "']").attr("cost_basis_type");
    } else {
        tmpCostBaType = $("#goods_dc_cost_basis_type").val();
    }
    if ((tmpCostBaType !== undefined && tmpCostBaType !== null && tmpCostBaType !== "" && tmpCostBaType != "GD") || available_coupon_box == "N" || PageVariable.jaehu_discount_yn == "Y") {
        return false;
    }
    return true;
}
function UpdateCouponState() {
    var $coupon_btn = $("#btn_goMyCoupon"), $unavail_coupon_desc = $("#unavailable_coupon_desc");
    if (IsCouponAvailable() === false) {
        $coupon_btn.addClass("bt_mycp inactive");
        $coupon_btn.on("mouseenter", function () {
            $unavail_coupon_desc.show();
        });
        $('.layer_info ').on("mouseleave", function () {
            $unavail_coupon_desc.hide();
        });
    } else {
        $coupon_btn.addClass("bt_mycp");
        $coupon_btn.off("mouseover").off("mouseout");
    }
}
var wishListLayerAuth = false;
var WishListLayerLoad = false;
function loadWishListLayer(gd_no) {
    if (Public.isLogin()) {
        var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_MyAjaxService.asmx"), "GetWishGroup");
        if (result.length > 1) {
            var _html = "";
            _html += "<div class=\"cont\"><ul class=\"lst\">";
            for (var i = 0; i < result.length; i++) {
                _html += String.format("<li><input type=\"radio\" name=\"select_wishlist\" id=\"{0}\" value='{1}'><label for=\"{0}\">{2}</label></li>", "select_wishlist" + i, result[i].GroupCode, result[i].GroupName);
            }
            _html += String.format("</ul><div class=\"btn_area\"><button type=\"button\" onclick=\"AddLayerWishlist({0});\">{1}</button></div></div>", gd_no, MultiLang.findResource("WishLayerAdd"));
            $("#LayerWishlist").append(_html);
            wishListLayerAuth = true;
        }
    }
    WishListLayerLoad = true;
}
function btnWishList(gd_no) {
    if ($("#LayerWishlist").length > 0 && $("#LayerWishlist").css("display") != "none") {
        CloseWishGrouphListLayer();
        return;
    }
    if (!WishListLayerLoad) {
        loadWishListLayer(gd_no);
    }
    if (wishListLayerAuth) {
        $(".ly_wish .cont .lst li:first-child input[name='select_wishlist']:radio").prop("checked", true);
        $("#LayerWishlist").show();
    } else {
        AddToWishList(gd_no, 0);
    }
}
function AddLayerWishlist(gd_no) {
    var group_no = $("input:radio[name='select_wishlist']:checked").val();
    if (group_no == "" || group_no == null)
        group_no = 0;
    AddToWishList(gd_no, group_no);
    CloseWishGrouphListLayer();
}
function CloseWishGrouphListLayer() {
    $("#LayerWishlist").hide();
}
function AddToWishList(gd_no, group_no) {
    Util.AddToWishList(Public.getCustNo(), group_no, gd_no, Public.getLoginId(), function (ret) {
        if (ret == 0) {
            var top = $('.goods_detail').height() / 3;
            if (top == "" || top == null)
                top = 100;
            $('#ly_added_toast').show();
            $('.ly_added_alert').css('max-width', '100%');
            $("#ly_added_toast").css("top", String.format("-{0}px", top));
            $('#span_btn_wish').hide();
            $('#span_btn_wish_added').show();
            setTimeout(function () {
                $("#ly_added_toast").hide();
                $('#span_btn_wish_added').show();
                $('#span_btn_wish_open').hide();
            }, 2000);
        }
    });
}
function OpenWishListWing() {
    if ($("#css_mode").val() != "preview") {
        Util.OpenSmartWindow($("#quickInfo .list .wishlist"), "wishOn", Public.convertNormalUrl("~/Smart/WishList.aspx"), null, null, $("#gd_no").val());
    } else {
        parent.Util.OpenSmartWindow($("#quickInfo .list .wishlist"), "wishOn", Public.convertNormalUrl("~/Smart/WishList.aspx"));
    }
}
var QD_FW = {APPLIED: false, CERTIFIED: false, CheckFollowShop: function () {
        var seller_cust_no = $get("seller_cust_no").value;
        var param = new RMSParam();
        param.add("sell_cust_no", seller_cust_no);
        var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_MyAjaxService.asmx"), "GetFollowShopInfo", param.toJson());
        if (result != null && result.Rows.length > 0) {
            return true;
        } else {
            alert(MultiLang.findResource("Add to favorite shop"));
            return false;
        }
    }, IsPassworded: function () {
        var param = new RMSParam();
        param.add("gd_no", $("#gd_no").val());
        param.add("cost_basis_no", $("#qdiscount_basis_no").val());
        param.add("global_order_type", $("#global_order_type").val());
        param.add("promotion_code", "");
        param.add("type", "2");
        var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "CheckFWDiscountPrmCode", param.toJson());
        if (ret == 0) {
            return true;
        } else {
            return false;
        }
    }, CheckProMotionCode: function () {
        var param = new RMSParam();
        param.add("gd_no", $("#gd_no").val());
        param.add("cost_basis_no", $("#qdiscount_basis_no").val());
        param.add("global_order_type", $("#global_order_type").val());
        param.add("promotion_code", $("#prm_code").val());
        param.add("type", "1");
        var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "CheckFWDiscountPrmCode", param.toJson());
        if (ret == 0) {
            return true;
        } else {
            alert(MultiLang.findResource("FW í”„ë¡œëª¨ì…˜ ì½”ë“œ ë¶ˆì¼ì¹˜"));
            return false;
        }
    }}
var QD_MQ = {APPLIED: false, cost_basis_no: 0, tid: 0, need_mameq_cnt: 0, CheckCondition: function () {
        this.tid = $("#mameq_tid").val();
        this.need_mameq_cnt = $("#need_mameq_cnt").val();
        if (!Public.isLogin()) {
            return true;
        }
        if (this.cost_basis_no == 0) {
            return true;
        }
        if (this.tid == 0) {
            return true;
        }
        if (this.need_mameq_cnt == 0) {
            return true;
        }
        var cost_basis_no_s = this.cost_basis_no;
        var basic_cost_basis_no = $("#basic_cost_basis_no").val();
        if (basic_cost_basis_no > 0 && basic_cost_basis_no != this.cost_basis_no) {
            cost_basis_no_s = basic_cost_basis_no + "" + this.cost_basis_no;
        }
        var $target_qprice = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][cost_basis_no='" + cost_basis_no_s + "']");
        var mameq_order_cnt = 0;
        if ($target_qprice.length > 0 || this.APPLIED == true) {
            if ($target_qprice.length > 0) {
                for (var k = 0; k < $target_qprice.length; k++) {
                    mameq_order_cnt += parseInt($target_qprice.eq(k).attr("qty"));
                }
            } else if (this.APPLIED == true && $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList'][cost_basis_no]").length == 0) {
                mameq_order_cnt = $("#order_cnt").val();
            }
            if (mameq_order_cnt > 0) {
                var my_token_cnt = 0;
                var param = new RMSParam();
                param.add("tid", this.tid);
                var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_EventAjaxService.asmx"), "GetMyETokenCount", param.toJson());
                if (result != null && result.Rows.length > 0) {
                    my_token_cnt = result.Rows[0]["amount"];
                }
                if (parseInt(this.need_mameq_cnt) * parseInt(mameq_order_cnt) <= parseInt(my_token_cnt)) {
                    return true;
                } else {
                    alert(MultiLang.findResource("Not enough MameQ"));
                    return false;
                }
            }
        }
        return true;
    }}
var QD_LF = {APPLIED: false, cost_basis_no: 0, Token_tid: 0, need_Token_cnt: 0, CheckCondition: function ()
    {
        if (!Public.isLogin()) {
            return true;
        }
        if (this.cost_basis_no == 0) {
            return true;
        }
        if ($('#qd_apply').val() == "Y")
        {
            var cost_basis_no_s = this.cost_basis_no;
            var basic_cost_basis_no = $("#basic_cost_basis_no").val();
            if (basic_cost_basis_no > 0 && basic_cost_basis_no != this.cost_basis_no)
            {
                cost_basis_no_s = basic_cost_basis_no + "" + this.cost_basis_no;
            }
        }
        return true;
    }}
var QD_ES = {APPLIED: false, cost_basis_no: 0, Eid: 0, CheckCondition: function () {
        if (!Public.isLogin()) {
            return true;
        }
        if (this.cost_basis_no == 0) {
            return true;
        }
        if ($('#qd_apply').val() == "Y") {
            var cost_basis_no_s = this.cost_basis_no;
            var basic_cost_basis_no = $("#basic_cost_basis_no").val();
            if (basic_cost_basis_no > 0 && basic_cost_basis_no != this.cost_basis_no) {
                cost_basis_no_s = basic_cost_basis_no + "" + this.cost_basis_no;
            }
        }
        return true;
    }}
function init_medi_layer() {
    var $medi_layer = $("#medi_layer");
    $("#medi_have_symptoms", $medi_layer).prop("checked", true).click();
    $("#medi_step1", $medi_layer).addClass("cur");
    $("#medi_step2", $medi_layer).removeClass("cur");
    $(".medi-step1", $medi_layer).show();
    $(".medi-step2", $medi_layer).hide();
}
function setmultiSmartBtnClass() {
    if ((($get("OptionImageLayer") != null) && ($get("OptionImageLayer").style.display == null || $get("OptionImageLayer").style.display != "none")) || (($get("div_OptAllVw_main") != null) && ($get("div_OptAllVw_main").style.display == null || $get("div_OptAllVw_main").style.display != "none"))) {
        var tmpClass = $("#multiSmartBtn").attr("class");
        if (tmpClass == null || tmpClass.indexOf("click") < 0) {
            $("#multiSmartBtn").addClass("click");
        }
    } else {
        $("#multiSmartBtn").removeClass("click");
    }
}
function OptAllVwSelectInit() {
    optAllVwSelect.select = false;
    optAllVwSelect.sel_value1 = null;
    optAllVwSelect.sel_value2 = null;
    optAllVwSelect.sel_value3 = null;
}
function OptAllVwSelect_OnClick() {
    if (!opt_Image_Info.selected && OptAllVw != null && OptAllVw.SelectValue != null && OptAllVw.SelectValue.length > 1) {
        optAllVwSelect.select = true;
        optAllVwSelect.sel_value1 = OptAllVw.SelectValue[0];
        optAllVwSelect.sel_value2 = (OptAllVw.SelectValue.length > 1 ? OptAllVw.SelectValue[1] : null);
        optAllVwSelect.sel_value3 = (OptAllVw.SelectValue.length > 2 ? OptAllVw.SelectValue[2] : null);
        var inv_img_yn = $("#inventory_img_yn_0").val();
        if ($("#inventory_img_disp_type_0").val() == "T" && inv_img_yn == "True") {
            $($get("content_inventory_0_" + optAllVwSelect.sel_value1)).parents("li").click();
        } else if ($("#inventory_img_disp_type_0").val() == "L" && inv_img_yn == "True") {
            $($get("content_inventory_0_" + optAllVwSelect.sel_value1)).parents("li").click();
        } else {
            $($get("content_inventory_0_" + optAllVwSelect.sel_value1)).click();
        }
    } else {
        OptAllVwSelectInit();
    }
}
function OptSelectorReview_OnClick(optionselectorValue) {
    var OptSelectorReview = optionselectorValue;
    if (!opt_Image_Info.selected && OptSelectorReview != null && OptSelectorReview.SelectValue != null && OptSelectorReview.SelectValue.length >= 1) {
        optAllVwSelect.select = true;
        optAllVwSelect.sel_value1 = OptSelectorReview.SelectValue[0];
        optAllVwSelect.sel_value2 = (OptSelectorReview.SelectValue.length > 1 ? OptSelectorReview.SelectValue[1] : null);
        optAllVwSelect.sel_value3 = (OptSelectorReview.SelectValue.length > 2 ? OptSelectorReview.SelectValue[2] : null);
        if ($get("inventory_yn").value == "Y") {
            $("#a_subOptionLayerView span").removeClass("open");
            $("#a_subOptionLayerView span").addClass("close");
            $get("div_SubOptionItemList").style.display = "";
            if ($get("a_subOptionAdd") != null) {
                $get("a_subOptionAdd").style.display = "";
            }
            $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(0).find("option[org_value='" + optAllVwSelect.sel_value1 + "']").attr("selected", true);
            $("div[id='div_SubOptionSelect']").find("select[name='sub_inventory_seqno']").eq(0).change();
        }
    } else {
        OptAllVwSelectInit();
    }
}
var OptAllVw_TimerObj = null;
function OptAllVwMouseOver(prmImgNo) {
    if (prmImgNo != null && prmImgNo != "0") {
        if (OptAllVw_TimerObj != null) {
            clearTimeout(OptAllVw_TimerObj);
            OptAllVw_TimerObj = null;
        }
        OptAllVw_TimerObj = setTimeout(function () {
            if (opt_Goods_Img_url == "") {
                var tmpGDIMG = $("#GoodsImage").attr("src");
                if (tmpGDIMG != null && tmpGDIMG != "" && tmpGDIMG.toLowerCase().indexOf("loading_400") < 0) {
                    opt_Goods_Img_url = $("#GoodsImage").attr("src");
                }
            }
            var Img_url = GetGoodsImageUrl(prmImgNo, "M", "N");
            if (Img_url != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", Img_url, 442, 340)
                }
            }
        }, 150);
    }
}
function OptAllVwMouseOut() {
    if (OptAllVw_TimerObj != null) {
        clearTimeout(OptAllVw_TimerObj);
        OptAllVw_TimerObj = null;
    }
    if (opt_Goods_Img_url != "" || _clicked_img != "") {
        OptAllVw_TimerObj = setTimeout(function () {
            if (_clicked_img != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", _clicked_img, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", _clicked_img, 442, 340)
                }
            } else if (opt_Goods_Img_url != "") {
                if (glio_Control.imageType == "S") {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 400, 400)
                } else {
                    imageOnLoadResize("GoodsImage", opt_Goods_Img_url, 442, 340)
                }
            }
        }, 100);
    }
}
function ViewBrandCouponLayer() {
    $('#brandCouponLayer').fadeToggle("fast");
}
function ViewLayerByID(id) {
    $("#" + id).toggle();
}
function feedback_qpointback_onmouseout(id) {
    $("#" + id).hide();
}
function feedback_qpointback_onmouseover(id) {
    $("#" + id).show();
}
function GetQpointBackContents(pThis, targetID) {
    var $this = $(pThis), $target = $('#' + targetID), qpointback_no = 0;
    if (targetID.indexOf('ly_qpointback') > -1 && $target.find("dd").html() == "") {
        qpointback_no = $(pThis).data("qpointback-no");
        if (qpointback_no !== undefined || qpointback_no !== 0) {
            var param = new RMSParam();
            param.add("qpointback_no", qpointback_no);
            param.add("global_order_type", $("#global_order_type").val());
            var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetQpointbackMemo", param.toJson());
            if (ret != null) {
                $target.find("dd").html(ret);
            }
        }
    }
    $target.show();
}
function CheckOrderPossibleCnt(qty) {
    if ($("#order_limit_yn").val() == "Y") {
        var tmpControl = $("dl[id='dl_SelectOptionList'] dd[name='dd_SelectOptionList']");
        var total_order_cnt = 0;
        if (tmpControl != null && tmpControl.length > 0) {
            for (var k = 0; k < tmpControl.length; k++) {
                total_order_cnt += parseInt($(tmpControl[k]).attr("qty"));
            }
        } else {
            total_order_cnt = parseInt($get("order_cnt").value);
        }
        var order_cnt = total_order_cnt;
        var order_possible_cnt = parseInt($("#orderPossibleCnt").val());
        if (parseInt(order_possible_cnt) < parseInt(order_cnt)) {
            alert(MultiLang.findResource("order_limit_alert_2"));
            return false;
        }
    }
    return true;
}
function GetCurrencySymbol(currency_code) {
    var d_svc_nation = {"SGD": "S$", "JPY": "å††", "MYR": "RM", "IDR": "Rp", "KRW": "ì›", "USD": "US$", "CNY": "å…ƒ", "HKD": "HK$", "RMB": "å…ƒ", "PHP": "P", "TWD": "å…ƒ"}
    var currency = "";
    for (var key in d_svc_nation) {
        if (key == currency_code)
            currency = d_svc_nation[key];
    }
    return currency;
}
var Bargain = {IsProcessing: false, OrderNo: 0, TotalPrice: 0, DeliveryFee: 0, DeliveryOptionNo: 0, ItemList: new Array(), MakeLayer: function () {
        if (!this.CheckCondition()) {
            return;
        }
        this.IsProcessing = false;
        this.OrderNo = 0;
        this.ItemList = new Array();
        this.TotalPrice = 0;
        this.DeliveryFee = 0;
        this.DeliveryOptionNo = 0;
        $("#bargainPrc").val("");
        $("#div_start_bargain").show();
        var gd_nm = $("#gd_nm").val();
        var gd_no = $("#gd_no").val();
        var target_currency = $("#target_currency").val();
        var gd_type = $("#gd_type").val();
        var order_cnt = $("#order_cnt").val();
        var optionObj = $("#dl_SelectOptionList dd[name='dd_SelectOptionList']");
        var global_order_type = $("#global_order_type").val();
        if (GMKT.ServiceInfo.nation == "US" || global_order_type == "G") {
            target_currency = "USD";
        }
        if (gd_type == "BI") {
            var coupon_no = $("#coupon_no").val();
            if ($(optionObj).length > 0) {
                for (var i = 0; i < $(optionObj).length; i++) {
                    if ($(optionObj).eq(i).attr("coupon_no") != "") {
                        alert(MultiLang.findResource("alert_cannot_use_coupon_when_nego"));
                        return;
                    }
                }
            } else if (coupon_no != "") {
                alert(MultiLang.findResource("alert_cannot_use_coupon_when_nego"));
                return;
            }
        }
        this.TotalPrice = parseFloat(PriceUtil.PriceCuttingCode(parseFloat($("#discounted_price_oc").val()) * parseInt(order_cnt), target_currency));
        var groupbuy_no = $("#groupbuy_no").val();
        if (groupbuy_no != undefined && parseInt(groupbuy_no) > 0) {
            this.TotalPrice = parseFloat($("#groupbuy_sell_price_oc").val()) * parseInt(order_cnt);
        }
        if ($(optionObj).length > 0) {
            this.TotalPrice = 0;
            for (var i = 0; i < $(optionObj).length; i++) {
                this.TotalPrice += parseFloat($(optionObj).eq(i).attr("price_oc"));
            }
        }
        var delivery_fee = 0;
        var delivery_text = "";
        var delivery_fee_condition = "";
        var basis_money = 0;
        var deliveryObj = $('input[name="delivery_option_no"]:checked');
        if ($(deliveryObj).length > 0) {
            this.DeliveryOptionNo = $(deliveryObj).val();
            delivery_fee_condition = $(deliveryObj).attr("data-delivery-fee-cond");
            delivery_fee = parseFloat($(deliveryObj).attr("data-fee"));
            basis_money = parseFloat($(deliveryObj).attr("data-basis_money"));
        } else {
            delivery_fee_condition = $("#delivery_fee_condition").val();
            delivery_fee = parseFloat($("#delivery_fee").val());
            basis_money = parseFloat($("#basis_money").val());
        }
        if (GMKT.ServiceInfo.nation == "US" || global_order_type == "G") {
            delivery_fee = ExchangeUtil.CalculateExchangeRate(delivery_fee, $("#target_currency").val(), GMKT.ServiceInfo.currencyCode, 0);
            basis_money = ExchangeUtil.CalculateExchangeRate(basis_money, $("#target_currency").val(), GMKT.ServiceInfo.currencyCode, 0);
        }
        if (delivery_fee_condition == "C" || delivery_fee_condition == "W") {
            delivery_text = String.format(_BargainLang[global_order_type]["Delivery Method {0}"], _BargainLang[global_order_type]["Meet Hand Over"]);
        } else {
            if (basis_money != 0 && this.TotalPrice >= basis_money && (delivery_fee_condition == "M" || delivery_fee_condition == "R")) {
                delivery_fee = 0;
                delivery_text = String.format(_BargainLang[global_order_type]["Delivery Method {0}"], _BargainLang[global_order_type]["Seller Delivery"]);
            } else {
                if (delivery_fee > 0 && gd_type != "BI") {
                    delivery_text = String.format(_BargainLang[global_order_type]["Delivery Method {0}"], _BargainLang[global_order_type]["Seller Delivery"] + "(" + PriceUtil.FormatCurrencyCode(delivery_fee, target_currency) + ")");
                } else {
                    delivery_text = String.format(_BargainLang[global_order_type]["Delivery Method {0}"], _BargainLang[global_order_type]["Seller Delivery"]);
                }
            }
        }
        if (delivery_fee < 0) {
            delivery_fee = 0;
        }
        if (gd_type == "BI") {
            delivery_fee = 0;
        }
        this.DeliveryFee = delivery_fee;
        var optionHtml = "";
        if ($(optionObj).length > 0) {
            for (var i = 0; i < $(optionObj).length; i++) {
                var order_qty = $(optionObj).eq(i).attr("qty")
                var option_arry = $(optionObj).eq(i).find("td p").html().split("<br>");
                var option_tag = "";
                if (option_arry.length > 0) {
                    for (var j = 0; j < option_arry.length; j++) {
                        if (option_arry[j] != "") {
                            if ((global_order_type == "G" || GMKT.ServiceInfo.nation == "US") && option_arry[j].lastIndexOf("(") >= 0) {
                                option_arry[j] = option_arry[j].substring(0, option_arry[j].lastIndexOf("("));
                            }
                            option_tag += "<dd>" + option_arry[j] + "</dd>";
                        }
                    }
                }
                var optionTitle = String.format(_BargainLang[global_order_type]["Option {0} (Qty:{1})"], (i + 1), order_qty);
                optionHtml += "<li class=\"opt_lst\" "
                        + " option_price=\"" + $(optionObj).eq(i).attr("price_oc") + "\" "
                        + " inv_no=\"" + $(optionObj).eq(i).attr("inv_no") + "\" "
                        + " sel_no=\"" + $(optionObj).eq(i).attr("sel_no") + "\" "
                        + " sel_not=\"" + $(optionObj).eq(i).attr("sel_not") + "\" "
                        + " sel_valuet=\"" + $(optionObj).eq(i).attr("sel_valuet") + "\" "
                        + " sel_qty=\"" + $(optionObj).eq(i).attr("qty") + "\" "
                        + ">\n";
                optionHtml += String.format("<dl><dt class=\"opt\">{0}</dt>{1}</dl>", optionTitle, option_tag);
                optionHtml += "</li>";
            }
        } else {
            var option_name = String.format(_BargainLang[global_order_type]["No Option {0}"], order_cnt);
            var optionTitle = String.format(_BargainLang[global_order_type]["Option {0} (Qty:{1})"], 1, order_cnt);
            optionHtml = "<li class=\"opt_lst\" sel_qty=\"" + order_cnt + "\"  >"
            optionHtml += String.format("<dl><dt class=\"opt\">{0}</dt><dd>{1}</dd></dl>", optionTitle, option_name.substring(0, option_name.indexOf("(")));
            optionHtml += "</li>";
        }
        $("#nego_title").html(gd_nm);
        $("#nego_item_option").html(optionHtml);
        $("#nego_delivery").html(delivery_text);
        $("#nego_total_price").html(PriceUtil.FormatCurrencyCode(this.TotalPrice, target_currency));
        $("#nego_price_title").html(String.format(_BargainLang[global_order_type]["Bargain Price {0}"], GetCurrencySymbol(target_currency)));
        $("#lang_Delivery_Method_desc").html(_BargainLang[global_order_type]["Delivery Method desc"]);
        $("#lang_total_price").html(_BargainLang[global_order_type]["Total Price"]);
        $("#lang_start_bargian").html(_BargainLang[global_order_type]["Start Bargain"] + "<br /><span class=\"qtk\">via Qtalk</span>");
        $("#lang_start_bargain_desc").html(_BargainLang[global_order_type]["Start Bargain desc"]);
        $("#nego_resend_btn").html(_BargainLang[global_order_type]["btn nego resend"]);
        $("#lang_nego_close").html(_BargainLang[global_order_type]["btn nego close"]);
        var winHeight = $(window).height();
        var div_height = $("#layerNegotiation").height();
        var top = winHeight / 2 - div_height / 2 + ($(document).scrollTop() - 10);
        $("#layerNegotiation").css("top", top - 300).addClass("visible");
    }, GlobalCheck: function () {
        if ($("#global_order_type").val() == "G") {
            if ($("#hid_global_link_yn").val() == "N" || false == Public.isLogin()) {
                Util.globalMemberForward("Bargain.GoBargainOrder");
                return;
            }
        }
        this.GoBargainOrder();
    }, GoBargainOrder: function () {
        if (!this.CheckOrder()) {
            this.IsProcessing = false;
            return;
        }
        if (this.IsProcessing) {
            this.ToastAlert(MultiLang.findResource("processing negotiation"));
            return;
        }
        var global_order_type = $("#global_order_type").val();
        $("#div_start_bargain").hide();
        $("#div_sending_nego").show();
        $("#nego_send_status").prop("class", "ing").html(_BargainLang[global_order_type]["sending a qtalk message"]);
        this.IsProcessing = true;
        this.ItemList = new Array();
        var gd_no = $("#gd_no").val();
        var gd_type = $("#gd_type").val();
        var target_currency = $("#target_currency").val();
        var total_price = parseFloat(this.TotalPrice);
        var delivery_fee = parseFloat(this.DeliveryFee);
        var delivery_text = $("#nego_delivery").text();
        var delivery_group_no = this.DeliveryOptionNo > 0 ? this.DeliveryOptionNo : $("#delivery_group_no").val();
        if (GMKT.ServiceInfo.nation == "US" || global_order_type == "G") {
            target_currency = "USD";
        }
        var bargain_price = PriceUtil.PriceCuttingCode(PriceUtil.GetMoney($("#bargainPrc").prop("value")), target_currency);
        var currency_symbol = GetCurrencySymbol(target_currency);
        var negoObj = $("#nego_item_option li");
        if ($(negoObj).length > 0) {
            if (gd_type == "BI") {
                for (var i = 0; i < $(negoObj).length; i++) {
                    var option_name = "";
                    var optList = $(negoObj).eq(i).find("dl dd");
                    if ($(optList).length > 0) {
                        for (var j = 0; j < $(optList).length; j++) {
                            if (option_name != "") {
                                option_name += " / ";
                            }
                            option_name += $(optList).eq(j).text();
                        }
                    }
                    var option_price = $(negoObj).eq(i).attr("option_price");
                    option_price = option_price == undefined ? parseFloat(this.TotalPrice) : option_price;
                    var inv_no = $(negoObj).eq(i).attr("inv_no");
                    var sel_no = $(negoObj).eq(i).attr("sel_no");
                    var sel_not = $(negoObj).eq(i).attr("sel_not");
                    var sel_valuet = $(negoObj).eq(i).attr("sel_valuet");
                    var order_qty = $(negoObj).eq(i).attr("sel_qty");
                    option_name += String.format(" ({0}:{1}) ", _BargainLang[global_order_type]["Qty_script"], order_qty);
                    var multiItem = {};
                    multiItem.sel_no = "0";
                    multiItem.sel_name = option_name;
                    multiItem.sel_price = option_price;
                    multiItem.sel_type = "T";
                    multiItem.inv_no = (inv_no == undefined || inv_no == "") ? "0" : inv_no;
                    multiItem.option_sel_no = sel_no == undefined ? [""] : sel_no.split(",");
                    multiItem.sel_not = sel_not == undefined ? [""] : sel_not.split(",");
                    multiItem.sel_valuet = sel_valuet == undefined ? [""] : sel_valuet.split(",");
                    multiItem.order_qty = order_qty == undefined ? "1" : order_qty;
                    multiItem.order_gd_no = gd_no;
                    multiItem.delivery_group_no = delivery_group_no;
                    multiItem.cost_basis_no = $("#cost_basis_no").val();
                    multiItem.delivery_option_no = delivery_group_no;
                    multiItem.groupbuy_no = $("#groupbuy_no").val();
                    this.ItemList.push(multiItem);
                }
            } else {
                var option_name = "";
                for (var i = 0; i < $(negoObj).length; i++) {
                    if (option_name != "") {
                        option_name += ", ";
                    }
                    var optList = $(negoObj).eq(i).find("dl dd");
                    if ($(optList).length > 0) {
                        for (var j = 0; j < $(optList).length; j++) {
                            if (j > 0) {
                                option_name += " / ";
                            }
                            option_name += $(optList).eq(j).text();
                        }
                    }
                }
                var order_qty = $(negoObj).eq(0).attr("sel_qty");
                option_name += String.format(" ({0}:{1})", _BargainLang[global_order_type]["Qty_script"], order_qty);
                var multiItem = {};
                multiItem.sel_no = "0";
                multiItem.sel_name = option_name;
                multiItem.sel_price = total_price;
                multiItem.sel_type = "T";
                multiItem.order_gd_no = gd_no;
                this.ItemList.push(multiItem);
            }
        } else {
            this.IsProcessing = false;
            $("#nego_send_status").prop("class", "fin").html(MultiLang.findResource("failed sending a message"));
            return;
        }
        var multiItem = {};
        multiItem.sel_no = "0";
        multiItem.sel_name = delivery_text;
        ;
        multiItem.sel_price = delivery_fee;
        multiItem.sel_type = "D";
        multiItem.order_gd_no = gd_no;
        this.ItemList.push(multiItem);
        var multiItem = {};
        multiItem.sel_no = "0";
        multiItem.sel_name = String.format(_BargainLang[global_order_type]["Adjustment Price"], currency_symbol);
        multiItem.sel_price = parseFloat(bargain_price) - (parseFloat(total_price) + parseFloat(delivery_fee));
        multiItem.sel_type = "S";
        multiItem.order_gd_no = gd_no;
        this.ItemList.push(multiItem);
        var param = new RMSParam();
        param.add("gd_no", gd_no);
        param.add("global_order_type", global_order_type);
        param.add("item_list", this.ItemList);
        param.add("gd_type", gd_type);
        param.add("order_type", "NO");
        var ret = RMSHelper.asyncCallWebMethod(Public.getServiceUrl("swe_OrderAjaxService.asmx"), "InsertNegotiationOrder", param.toJson(), function (ret) {
            if (ret != null && ret.ResultCode > 0) {
                setTimeout(function () {
                    Bargain.OrderNo = ret.ResultCode;
                    Bargain.SendQtalk();
                    $("#nego_send_status").prop("class", "fin").html(MultiLang.findResource("complete sending a message"));
                    $("#nego_resend_close_btn, #nego_resend_btn").show();
                }, 3000);
            } else {
                setTimeout(function () {
                    $("#nego_send_status").prop("class", "fin").html(MultiLang.findResource("failed sending a message"));
                    $("#nego_resend_close_btn").show();
                    $("#nego_resend_btn").hide();
                }, 3000);
            }
            this.IsProcessing = false;
        });
    }, Resend: function () {
        if (this.OrderNo > 0) {
            $("#nego_resend_btn").hide();
            $("#nego_send_status").prop("class", "ing").html(MultiLang.findResource("sending a qtalk message"));
            setTimeout(function () {
                $("#nego_send_status").prop("class", "fin").html(MultiLang.findResource("complete sending a message"));
                $("#nego_resend_close_btn").show();
            }, 3000);
            this.SendQtalk();
        }
    }, SendQtalk: function () {
        var param = new RMSParam();
        param.add("booking_no", this.OrderNo);
        param.add("global_order_type", $("#global_order_type").val());
        RMSHelper.asyncCallWebMethod(Public.getServiceUrl("swe_OrderAjaxService.asmx"), "SendBargainQtalkMessage", param.toJson(), function (ret) {});
    }, CheckOrder: function () {
        var target_currency = $("#target_currency").val();
        var bargain_price = PriceUtil.GetMoney($("#bargainPrc").val());
        var nego_allow_price = parseFloat($("#nego_allow_price").val());
        var message = "";
        var numberRegex = /^[-]?\d+(?:[.]\d+)?$/;
        if (!numberRegex.test(bargain_price) || bargain_price <= 0)
        {
            message = MultiLang.findResource("toast_alert_check_money");
        }
        if (this.TotalPrice * 0.6 > bargain_price) {
            message = MultiLang.findResource("alert_check_reasonable_nego_price");
        }
        if (message != "") {
            this.ToastAlert(message);
            return false;
        } else {
            return true;
        }
    }, ToastAlert: function (msg) {
        $("#nego_toast_alert").html("<P>" + msg + "</p>").show();
        setTimeout(function () {
            $("#nego_toast_alert").fadeOut(500);
        }, 800)
    }, CheckCondition: function () {
        if ($get("gc_benefit_type").value != "" || !Public.isLogin()) {
            if (!Public.isLogin() || __PAGE_VALUE.MEMBER_KIND == "N") {
                alert(MultiLang.findResource("alert_nego_login"));
                Util.openInnerPopup(Public.convertNormalUrl("~/Login/PopupLogin.aspx") + "?ReturnUrl=excute:Util.InnerPopupCloseAfterLogin();", 430, 450);
                return false;
            }
        }
        if ($("#to_qtalk_app_os").val() == "")
        {
            var param = new RMSParam();
            var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_QTalkAjaxService.asmx"), "CheckQtalkAppVersion", param.toJson());
            if (ret != null && ret.Rows.length > 0) {
                $("#to_qtalk_app_os").val(ret.Rows[0].to_app_os);
                $("#to_qtalk_app_version").val(ret.Rows[0].to_app_version);
            }
            if ($("#to_qtalk_app_os").val() == "") {
                alert(MultiLang.findResource("alert_qtalk_install"));
                return false;
            }
        }
        var version_check = CheckAppVersion();
        if (version_check != "" && version_check != null) {
            alert(version_check);
            return false;
        }
        if ($("#gd_type").val() == "CI" && $("#gd_sub_type").val() == "TU") {
            Util.openPopup(Public.convertNormalUrl("~/My/Topup/OnlineTopup.aspx?gd_no=" + $("#gd_no").val()), 460, 725);
            return false;
        }
        if (!orderValidCheck(true)) {
            return false;
        }
        if (false === checkTopupOption($("input[name=sel_valueT]"))) {
            return false;
        }
        if (!ChkLimitQtySetting()) {
            return false;
        }
        if (!QPrice.chkFinalStep()) {
            return false;
        }
        return true;
    }, CloseLayer: function () {
        $("#layerNegotiation").removeClass("visible");
        $("#div_sending_nego").hide();
        $("#nego_resend_btn").hide();
        $("#nego_resend_close_btn").hide();
        $("#div_start_bargain").show();
    }, DisplayBtn: function () {
        var nego_yn = $("#nego_yn").val();
        if (nego_yn != "Y") {
            return;
        }
        if (!CheckSelectOptionList()) {
            $("#btn_negotiation").hide();
            $("#btn_unable_negotiation").show();
            return;
        }
        var chkTotal_Price = 0;
        var order_cnt = $("#order_cnt").val();
        var optionObj = $("#dl_SelectOptionList dd[name='dd_SelectOptionList']");
        var target_currency = $("#target_currency").val();
        var nego_allow_price = parseFloat($("#nego_allow_price").val());
        chkTotal_Price = parseFloat(PriceUtil.PriceCuttingCode(parseFloat($("#discounted_price").val()) * parseInt(order_cnt), target_currency));
        var groupbuy_no = $("#groupbuy_no").val();
        if (groupbuy_no != undefined && parseInt(groupbuy_no) > 0) {
            chkTotal_Price = parseFloat($("#groupbuy_sell_price").val()) * parseInt(order_cnt);
        }
        if ($(optionObj).length > 0) {
            chkTotal_Price = 0;
            for (var i = 0; i < $(optionObj).length; i++) {
                chkTotal_Price += parseFloat($(optionObj).eq(i).attr("price"));
            }
        }
        if (chkTotal_Price >= nego_allow_price) {
            $("#btn_negotiation").show();
            $("#btn_unable_negotiation").hide();
        } else {
            $("#btn_negotiation").hide();
            $("#btn_unable_negotiation").show();
        }
    }, SendQtalkQnAMsg: function ()
    {
        if ($get("gc_benefit_type").value != "" || !Public.isLogin())
        {
            if (!Public.isLogin() || __PAGE_VALUE.MEMBER_KIND == "N")
            {
                alert(MultiLang.findResource("alert_nego_login"));
                Util.openInnerPopup(Public.convertNormalUrl("~/Login/PopupLogin.aspx") + "?ReturnUrl=excute:Util.InnerPopupCloseAfterLogin();", 430, 450);
                return false;
            }
        }
        if ($("#to_qtalk_app_os").val() == "")
        {
            var param = new RMSParam();
            var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_QTalkAjaxService.asmx"), "CheckQtalkAppVersion", param.toJson());
            if (ret != null && ret.Rows.length > 0) {
                $("#to_qtalk_app_os").val(ret.Rows[0].to_app_os);
                $("#to_qtalk_app_version").val(ret.Rows[0].to_app_version);
            }
            if ($("#to_qtalk_app_os").val() == "") {
                alert(MultiLang.findResource("alert_qtalk_install"));
                return false;
            }
        }
        var version_check = CheckAppVersion();
        if (version_check != "" && version_check != null) {
            alert(version_check);
            return false;
        }
        var rst_msg = MultiLang.findResource("failed_sending_qtalk_msg");
        var msg = String.format(MultiLang.findResource("qtalk_qna_sending_msg"), $('#gd_no').val());
        var result = SendQtalkQnaMsg(msg);
        if (result != null && result.ResultCode >= 0)
            rst_msg = MultiLang.findResource("suc_sending_qtalk_msg");
        this.ToastAlert(rst_msg);
        return;
    }}
function CheckAppVersion() {
    var to_qtalk_app_os = $("#to_qtalk_app_os").val();
    var to_qtalk_app_version = $("#to_qtalk_app_version").val();
    var qtalk_allow_version_yn = "";
    if (to_qtalk_app_os == "Android" && to_qtalk_app_version != "") {
        var version_array = to_qtalk_app_version.split('.');
        if (parseInt(version_array[0]) > 3) {
            qtalk_allow_version_yn = "";
            return qtalk_allow_version_yn;
        } else if (parseInt(version_array[0]) == 3) {
            if (parseInt(version_array[1]) > 5) {
                qtalk_allow_version_yn = "";
                return qtalk_allow_version_yn;
            } else if (parseInt(version_array[1]) == 5) {
                if (parseInt(version_array[2]) > 6) {
                    qtalk_allow_version_yn = "";
                    return qtalk_allow_version_yn;
                }
            }
        }
        qtalk_allow_version_yn = String.format(MultiLang.findResource("ALERT_Check_App_android"), to_qtalk_app_os + " " + to_qtalk_app_version);
    } else if (to_qtalk_app_os == "iOS" && to_qtalk_app_version != "") {
        var version_array = to_qtalk_app_version.split('.');
        if (parseInt(version_array[0]) > 3) {
            qtalk_allow_version_yn = "";
            return qtalk_allow_version_yn;
        } else if (parseInt(version_array[0]) == 3) {
            if (parseInt(version_array[1]) > 3) {
                qtalk_allow_version_yn = "";
                return qtalk_allow_version_yn;
            } else if (parseInt(version_array[1]) == 3) {
                if (parseInt(version_array[2]) > 2) {
                    qtalk_allow_version_yn = "";
                    return qtalk_allow_version_yn;
                }
            }
        }
        qtalk_allow_version_yn = String.format(MultiLang.findResource("ALERT_Check_App_apple"), to_qtalk_app_os + " " + to_qtalk_app_version);
    }
    return qtalk_allow_version_yn;
}
function AnotherAuctionLayerControl() {
    if ($("#ly_another_auction_list").css("display") != "none") {
        $("#ly_another_auction_list").css("display", "none");
    } else {
        $("#ly_another_auction_list").css("display", "block");
    }
}
function AnotherAuctionOpen(auction_no, gd_no) {
    if (auction_no != null && auction_no != "") {
        window.open(Public.getWWWServerUrl('/Goods/Goods.aspx?goodscode=' + gd_no + "&auc_no=" + auction_no));
    }
}
function comLayerOver(obj) {
    $(obj).addClass("on");
}
function comLayerOut(obj) {
    $(obj).removeClass("on");
}
function chk_live_sale() {
    if ($('#hid_login_cust_no').val() == "") {
        Util.openLoginPopup("close:");
        location.reload();
        return;
    }
    var limit_yn = $('#qd_live_limit_yn').val();
    var limit_cust_no = $('#qd_live_limit_cust_no').val();
    var limit_room_no = $('#qd_live_limit_room_no').val();
    var qd_apply = $('#qd_apply').val();
    var search_type = "R";
    if (qd_apply == "N") {
        if ($('#hid_login_cust_no').val() != "" && CheckQtalkActive()) {
            if (limit_yn == "Y") {
                if (limit_room_no == null || limit_room_no == "")
                    search_type = "A";
                var result = GetLuckyPriceLiveForumCheckList(search_type, limit_cust_no, limit_room_no);
                if (result == -1) {
                    $('#bnnr_live_forum_qr').show();
                } else {
                    if ($('#qd_live_cost_basis_no').val() != '') {
                        ApplyDiscountBtn_Click($('#qd_live_cost_basis_no').val(), 'QD', "");
                        $('#qd_apply').val('Y');
                        $('#qd_live_apply_btn span').text(MultiLang.findResource("Cancel"));
                        $('#qd_live_apply_btn span').addClass("del");
                    }
                }
            } else if (limit_yn == "N") {
                if (CheckQtalkActive())
                {
                    if ($('#qd_live_cost_basis_no').val() != '')
                    {
                        ApplyDiscountBtn_Click($('#qd_live_cost_basis_no').val(), 'QD', "");
                        $('#qd_apply').val('Y');
                        $('#qd_live_apply_btn span').text(MultiLang.findResource("Cancel"));
                        $('#qd_live_apply_btn span').addClass("del");
                    }
                } else {
                    $('#bnnr_qchapp_qr').show();
                }
            }
        } else {
            $('#bnnr_qchapp_qr').show();
        }
    } else {
        CancelDiscountBtn_Click();
        $('#qd_apply').val('N');
        $('#qd_live_apply_btn span').text(MultiLang.findResource("qd_apply"));
        $('#qd_live_apply_btn span').removeClass("del");
    }
}
function GetLuckyPriceLiveForumCheckList(search_type, limit_cust_no, limit_room_no) {
    if ($('#hid_login_cust_no').val() == "")
        return;
    var param = new RMSParam();
    param.add("search_type", search_type);
    param.add("owner_cust_no", limit_cust_no);
    param.add("follower_cust_no", $('#hid_login_cust_no').val());
    param.add("room_no", limit_room_no);
    var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_AuctionGoodsBizService.asmx"), "GetLuckyPriceLiveForumCheckList", param.toJson());
    return result;
}
function CheckQtalkActive() {
    var param = new RMSParam();
    param.add("check_days", "1");
    var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_MyAjaxService.asmx"), "IsQtalkActive", param.toJson());
    return result;
}
function OpenShippingOverseas(nation_cd) {
    $("#shipping_to_overseas_area").hide();
    $("#shipping_to").show();
    if (nation_cd != null && nation_cd != "") {
        ShippingTo.selectShip($("#ship_select_li_" + nation_cd), nation_cd, $("#ship_select_li_SG").attr("delivery_group_no"), "");
    }
}
function AddRestockItem(gd_no) {
    if (Public.isLogin()) {
        var resultData = RMSHelper.dynamic.executeNonQuery("GOODS.UpdateRestockNotice", RMSParam.create().add("type", "I").add("gd_nos", gd_no));
        var return_status = resultData.ReturnData;
        if (return_status == 0) {
            $("#ly_alert_toast").show();
            setTimeout(function () {
                $("#ly_alert_toast").hide();
                $(".ly_restock").hide();
            }, 3000);
        } else if (return_status == "-1") {
            alert(MultiLang.findResource("ì‹ ì²­í•¨"));
        } else if (return_status == "-10") {
            Util.openPopup(Public.getWWWServerUrl('/Login/PopupLogin.aspx', true) + '?ReturnUrl=target=opener;excute:top.location.reload();', 430, 450, 'PopupLogin', 200, 200)
        }
    } else {
        Util.openPopup(Public.getWWWServerUrl('/Login/PopupLogin.aspx', true) + '?ReturnUrl=target=opener;excute:top.location.reload();', 430, 450, 'PopupLogin', 200, 200)
    }
}
function SendQtalkQnaMsg(msg) {
    var param = new RMSParam();
    param.add("msg", msg);
    param.add("to_cust_no", $('#seller_cust_no').val());
    param.add("gd_no", $('#gd_no').val());
    param.add("global_order_type", $("#global_order_type").val());
    var result = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "SendQtalkQnaMsg", param.toJson());
    return result;
}
var ImageSearch = {search_img_url: "", init: function () {
        var gd_no = $("#gd_no").val();
        if ($("div[id='bannerGoodsImageSearch'][class='leftwing_banner']").length > 0 && gd_no != null && gd_no != undefined && gd_no != "") {
            ImageSearch.search_img_url = $("#img_auto_search_url").val();
            this.getAutoImageSearch();
        } else {
            ImageSearch.clearImageSearch();
            return false;
        }
    }, getAutoImageSearch: function () {
        var adult_yn = $("#hid_goods_adult_yn").val() == "Y" ? "" : "N";
        var param = new RMSParam();
        param.add("gd_no", $("#gd_no").val());
        param.add("group_code", "0");
        param.add("gdlc_cd", $("#img_search_gdlc_cd").val());
        param.add("gdmc_cd", $("#img_search_gdmc_cd").val());
        param.add("gdsc_cd", $("#img_search_gdsc_cd").val());
        param.add("img_url", ImageSearch.search_img_url);
        param.add("keyword", "");
        param.add("from_where", "GA");
        param.add("contents_type", "BI");
        param.add("global_yn", "");
        param.add("brand_nm_list", "");
        param.add("re_search_yn", "");
        param.add("page_no", 1);
        param.add("page_size", "16");
        param.add("return_cnt", "4");
        param.add("adult_yn", adult_yn);
        RMSHelper.asyncCallWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsImageSearchResult", param.toJson(), function (ret) {
            if (ret != null && ret.length > 0) {
                ImageSearch.makeImageSearchHTML(ret)
            } else {
                ImageSearch.clearImageSearch();
            }
        });
    }, makeImageSearchHTML: function (result) {
        var cnt = result.length;
        var banner_no = $("#bannerGoodsImageSearch").attr("banner_no");
        var html = "";
        html += "<ul>";
        for (var i = 0; i < cnt; i++) {
            var gd_no = result[i].GD_NO;
            var gd_nm = "";
            var gd_org_nm = result[i].GD_NM;
            var gd_nm_en = result[i].GD_NM_EN;
            var gd_nm_ja = result[i].GD_NM_JA;
            var gd_nm_id = result[i].GD_NM_ID;
            var gd_nm_ko = result[i].GD_NM_KO;
            var gd_nm_ms = result[i].GD_NM_MS;
            var gd_nm_zh = result[i].GD_NM_ZH;
            var gd_nm_zh_cn = result[i].GD_NM_ZH_CN;
            var gd_nm_zh_hk = result[i].GD_NM_ZH_HK;
            var gd_nm_zh_tw = result[i].GD_NM_ZH_TW;
            var client_lang = GMKT.ServiceInfo.ClientLang;
            gd_nm = client_lang == "en" ? gd_nm_en : client_lang == "ja" ? gd_nm_ja : client_lang == "id" ? gd_nm_id : client_lang == "ko" ? gd_nm_ko : client_lang == "ms" ? gd_nm_ms : client_lang == "zh" ? gd_nm_zh : client_lang == "zh-cn" ? gd_nm_zh_cn : client_lang == "zh-hk" ? gd_nm_zh_hk : client_lang == "zh-tw" ? gd_nm_zh_tw : "";
            if (gd_nm == "" || gd_nm == null) {
                gd_nm = gd_nm_en;
            }
            if (gd_nm == "" || gd_nm == null) {
                gd_nm = gd_org_nm;
            }
            var img_contents_no = result[i].IMG_CONTENTS_NO;
            var href = Public.getWWWServerUrl('/Goods/Goods.aspx?goodscode=' + gd_no) + "&banner_no=" + banner_no;
            var goods_avg_point = result[i].GOODS_AVG_POINT;
            var percent = "0%";
            var rate = "0";
            var trad_way = result[i].TRAD_WAY;
            var price = 0;
            var group_price = parseFloat(result[i].GROUP_PRICE);
            var sell_price = parseFloat(result[i].SELL_PRICE);
            var discount_price = parseFloat(result[i].DISCOUNT_PRICE);
            var cur_sell_price = 0;
            var cur_discount_price = 0;
            var strong_price = 0;
            var target_currency = $("#target_currency").val();
            if (trad_way == "T2") {
                strong_price = result[i].SUCC_BID_POSS_PRICE;
            } else {
                if (group_price > 0) {
                    cur_sell_price = group_price;
                    cur_discount_price = 0;
                } else {
                    cur_sell_price = sell_price;
                    cur_discount_price = discount_price;
                }
                strong_price = (cur_discount_price > 0) ? cur_sell_price - cur_discount_price : cur_sell_price;
            }
            if (strong_price > 0) {
                price = PriceUtil.FormatCurrencyCode(ExchangeUtil.CalculateExchangeRate(strong_price, "", "", 0), target_currency);
            } else {
                price = MultiLang.findResource("OutOfStock");
            }
            if (goods_avg_point <= 0) {
                percent = "0%";
                rate = "0";
            } else if (goods_avg_point <= 10) {
                percent = "20%";
                rate = "1.0";
            } else if (goods_avg_point <= 20) {
                percent = "40%";
                rate = "2.0";
            } else if (goods_avg_point <= 50) {
                percent = "60%";
                rate = "3.0";
            } else if (goods_avg_point <= 99) {
                percent = "80%";
                rate = "4.0";
            } else {
                percent = "100%";
                rate = "5.0";
            }
            html += "<li>";
            html += "<a href=\"" + href + "\" title=\"" + gd_nm + "\" class=\"thmb\" target=\"_blank\">";
            html += "<img src=\"" + Public.getGoodsImagePath(img_contents_no, 110, "Y") + "\" alt=\"\"><span class=\"mask\"></span>";
            html += "</a>";
            html += "<div class=\"item_dtl\">";
            html += "<a href=\"" + href + "\" title=\"" + gd_nm + "\" target=\"_blank\">";
            html += "<span class=\"tt\">" + gd_nm + "</span>";
            html += "<span class=\"rate\">";
            if (goods_avg_point == 500) {
                html += "<span class=\"new\">new</span>";
            } else {
                html += "<span style=\"width:" + percent + "\">rate: " + rate + "</span>";
            }
            html += "</span>";
            html += "<strong class=\"prc\" title=\"price\">" + price + "</strong>";
            html += "</a>";
            html += "</div>";
            html += "</li>";
        }
        html += "</ul>";
        $("div.loading").remove();
        $("div.section_imgsrch").append(html);
    }, clearImageSearch: function () {
        if ($("#bannerGoodsImageSearch").length > 0) {
            $("#bannerGoodsImageSearch").fadeOut(300);
        }
    }}
function setDeliveryPeriod(obj)
{
    var shipping_avg_dt = PageVariable.shipping_avg_dt;
    var global_order_type = $("#global_order_type").val();
    var sh_op_code = "";
    var sh_transc_cd = "";
    var sh_fr_cd = PageVariable.ship_from_cd;
    var sh_to_cd = "";
    var del_method_cnt = PageVariable.del_method_cnt;
    var del_nation_cds = PageVariable.del_nation_cds;
    var svc_nation_cd = GMKT.ServiceInfo.nation;
    var shipping_form_domestic = false;
    var moredays = 3;
    var period = "";
    var Business_Days = MultiLang.findResource("BusinessDays");
    var dis_day = "";
    var glo_avg_dt = 0;
    if (obj == null && global_order_type == "G" || (global_order_type == "L" && svc_nation_cd == "US")) {
        sh_op_code = PageVariable.del_option_code;
        sh_transc_cd = PageVariable.del_transc_cd;
        sh_to_cd = $('#selected_nation_cd').val();
    } else if (obj == null && del_method_cnt == 1) {
        sh_op_code = PageVariable.del_option_code;
        sh_transc_cd = PageVariable.del_transc_cd;
        sh_to_cd = PageVariable.ship_to_cd;
    } else if (obj != null) {
        sh_op_code = $(obj).attr('option_code');
        sh_transc_cd = $(obj).attr('transc_cd');
        sh_to_cd = PageVariable.ship_to_cd;
    }
    if (sh_fr_cd != "US" && sh_fr_cd == svc_nation_cd)
    {
        shipping_form_domestic = true;
        moredays = 2;
    }
    if (del_method_cnt >= 2) {
        dis_day = GetStandardDeliveryPeriod(sh_op_code, sh_fr_cd, sh_to_cd, sh_transc_cd, global_order_type);
        if (dis_day == -1) {
            if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null) {
                $('#DeliveryEstimatedArea ').hide();
            }
        } else
        {
            period = String.format("{0} {1}", dis_day, Business_Days);
            if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                $('#DeliveryEstimatedArea td').text(period);
                $('#DeliveryEstimatedArea ').show();
            } else {
                $('#DeliveryEstimatedArea td').text("");
                $('#DeliveryEstimatedArea ').hide();
            }
        }
    } else if (GMKT.ServiceInfo.region == "US" || (global_order_type != "" && global_order_type == "G"))
    {
        if (del_nation_cds != "") {
            var glo_del_nation_cd = [];
            glo_del_nation_cd["data"] = del_nation_cds.split(" ");
            for (var i = 0; i < glo_del_nation_cd["data"].length; i++) {
                glo_del_nation_cd["del_info"] = glo_del_nation_cd["data"][i].split("/");
                if (sh_to_cd == glo_del_nation_cd["del_info"][0].toString()) {
                    glo_avg_dt = parseInt(glo_del_nation_cd["del_info"][1].toString());
                    break;
                } else {
                    glo_avg_dt = 0;
                }
            }
        }
        if (parseInt(glo_avg_dt) > 0) {
            if (parseInt(glo_avg_dt) <= 10) {
                dis_day = glo_avg_dt + " ~ " + (parseInt(glo_avg_dt) + parseInt(moredays));
                period = String.format("{0} {1}", dis_day, Business_Days);
                if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                    $('#DeliveryEstimatedArea td').text(period);
                    $('#DeliveryEstimatedArea ').show();
                } else {
                    $('#DeliveryEstimatedArea td').text("");
                    $('#DeliveryEstimatedArea ').hide();
                }
            } else {
                dis_day = GetStandardDeliveryPeriod(sh_op_code, sh_fr_cd, sh_to_cd, sh_transc_cd, global_order_type);
                if (dis_day == -1) {
                    if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null) {
                        $('#DeliveryEstimatedArea ').hide();
                    }
                } else {
                    period = String.format("{0} {1}", dis_day, Business_Days);
                    if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                        $('#DeliveryEstimatedArea td').text(period);
                        $('#DeliveryEstimatedArea ').show();
                    } else {
                        $('#DeliveryEstimatedArea td').text("");
                        $('#DeliveryEstimatedArea ').hide();
                    }
                }
            }
        } else {
            dis_day = GetStandardDeliveryPeriod(sh_op_code, sh_fr_cd, sh_to_cd, sh_transc_cd, global_order_type);
            if (dis_day == -1) {
                if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null) {
                    $('#DeliveryEstimatedArea ').hide();
                }
            } else {
                period = String.format("{0} {1}", dis_day, Business_Days);
                if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                    $('#DeliveryEstimatedArea td').text(period);
                    $('#DeliveryEstimatedArea ').show();
                } else {
                    $('#DeliveryEstimatedArea td').text("");
                    $('#DeliveryEstimatedArea ').hide();
                }
            }
        }
    } else {
        if (parseInt(shipping_avg_dt) > 0) {
            if (parseInt(shipping_avg_dt) <= 5) {
                dis_day = shipping_avg_dt + " ~ " + (parseInt(shipping_avg_dt) + parseInt(moredays));
                period = String.format("{0} {1}", dis_day, Business_Days);
                if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                    $('#DeliveryEstimatedArea td').text(period);
                    $('#DeliveryEstimatedArea ').show();
                } else {
                    $('#DeliveryEstimatedArea td').text("");
                    $('#DeliveryEstimatedArea ').hide();
                }
            } else {
                dis_day = GetStandardDeliveryPeriod(sh_op_code, sh_fr_cd, sh_to_cd, sh_transc_cd, global_order_type);
                if (dis_day == -1) {
                    if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null) {
                        $('#DeliveryEstimatedArea ').hide();
                    }
                } else {
                    period = String.format("{0} {1}", dis_day, Business_Days);
                    if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                        $('#DeliveryEstimatedArea td').text(period);
                        $('#DeliveryEstimatedArea ').show();
                    } else {
                        $('#DeliveryEstimatedArea td').text("");
                        $('#DeliveryEstimatedArea ').hide();
                    }
                }
            }
        } else {
            dis_day = GetStandardDeliveryPeriod(sh_op_code, sh_fr_cd, sh_to_cd, sh_transc_cd, global_order_type);
            if (dis_day == -1) {
                if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null) {
                    $('#DeliveryEstimatedArea ').hide();
                }
            } else {
                period = String.format("{0} {1}", dis_day, Business_Days);
                if (typeof ($('#DeliveryEstimatedArea')) != 'undefined' && $('#DeliveryEstimatedArea') != null && period != '') {
                    $('#DeliveryEstimatedArea td').text(period);
                    $('#DeliveryEstimatedArea ').show();
                } else {
                    $('#DeliveryEstimatedArea td').text("");
                    $('#DeliveryEstimatedArea ').hide();
                }
            }
        }
    }
}
function GetStandardDeliveryPeriod(delivery_option_code, start_nation_cd, delivery_nation_cd, transc_cd, global_order_type) {
    param = new RMSParam();
    param.add("delivery_option_code", delivery_option_code);
    param.add("start_nation_cd", start_nation_cd);
    param.add("delivery_nation_cd", delivery_nation_cd);
    param.add("transc_cd", transc_cd);
    param.add("global_order_type", global_order_type);
    ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetStandardDeliveryPeriodList", param.toJson());
    if (ret != null && ret.Rows.length > 0) {
        return ret.Rows[0].standard_delivery_period;
    } else {
        return-1;
    }
}
function popQuickDeliveryInfo(delivery_group_no, selected_slot) {
    if (selected_slot == undefined) {
        selected_slot = "";
    }
    var gd_no = $("#gd_no").val();
    var pop_url = Public.convertNormalUrl("~/Popup/QuickDeliveryInfo.aspx?call_back_nm=callback_popQuickDelivery&delivery_group_no=" + delivery_group_no + "&selected_slot=" + selected_slot + "&gd_no=" + gd_no);
    var tmp_multiPopup = Util.__openInnerPopup_multiPopup;
    Util.__openInnerPopup_multiPopup = false;
    Util.openInnerPopup(pop_url, 500, 350, null, null, null, null, null, null, MultiLang.findResource("header QX Quick Delivery time"));
    Util.__openInnerPopup_multiPopup = tmp_multiPopup;
}
function callback_popQuickDelivery(jsonObj) {
    var delivery_group_no = jsonObj.delivery_group_no;
    var slot_info = jsonObj.delivery_slot;
    var slot_arry = slot_info.split(',');
    var slot_date = slot_arry.length > 0 ? slot_arry[0] : "";
    var slot_time = slot_arry.length > 1 ? slot_arry[1] : "";
    var hour_parse = slot_time.split('-');
    var button_view = "";
    var am_pm = "am";
    if (hour_parse.length > 1)
    {
        var slot_start_time = parseInt(hour_parse[0]);
        var slot_end_time = parseInt(hour_parse[1]);
        if (slot_start_time > 12) {
            slot_start_time = slot_start_time % 12;
        }
        if (slot_end_time >= 12) {
            am_pm = "pm";
            if (slot_end_time > 12) {
                slot_end_time = slot_end_time % 12;
            }
        }
        button_view = String.format("{0}-{1}{2}", slot_start_time, slot_end_time, am_pm);
    }
    var html_tag = "<span class=\"pick_time\">"
            + String.format("<dfn>{0} :</dfn> {1} / {2}", MultiLang.findResource("Delivery time"), DateUtil.FormatDate(slot_date), button_view)
            + String.format("<a class=\"btn_edit\" onclick=\"popQuickDeliveryInfo({0}, '{1}');\" >{2}</a>", delivery_group_no, slot_info, MultiLang.findResource("btn Change"))
            + "</span>";
    $("#quick_" + delivery_group_no).html(html_tag);
    $("#quick_" + delivery_group_no).attr("data-is_avail", "True");
    $(':radio[name="delivery_option_no"][value="' + delivery_group_no + '"]').attr("quick_delivery_slot", slot_info);
    $(':radio[name="delivery_option_no"][value="' + delivery_group_no + '"]').click();
    $('p[name="delivery_option_no"]').attr("quick_delivery_slot", slot_info);
    $("#quick_delivery_slot").val(slot_info);
    Util.setCookie("QuickDeliverySlot", slot_info);
    Util.closeInnerPopup();
}
function OpenPrmPasswordLayer() {
    $("#prm_password_layer").offset({left: $("#__applyBtnQD").offset().left}).show();
    $("#prm_password_layer").offset({left: $("#__applyBtnQD").offset().left});
}
function ClosePrmPasswordLayer() {
    $("#prm_code").val("");
    $("#prm_password_layer").hide();
}
function preApplyDiscountBtn_Click() {
    if (!QD_FW.CheckProMotionCode()) {
        QD_FW.CERTIFIED = false;
        return;
    }
    QD_FW.CERTIFIED = true;
    ApplyDiscountBtn_Click($("#qdiscount_basis_no").val(), 'QD', 'FW')
    ClosePrmPasswordLayer();
}
function clickMoreBtn(btn) {
    if ($(btn).hasClass("btn_fold")) {
        $(btn).toggleClass("btn_fold btn_unfold");
    } else if ($(btn).hasClass("btn_unfold")) {
        $(btn).toggleClass("btn_unfold btn_fold");
    }
}