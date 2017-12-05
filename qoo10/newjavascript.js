// (c)2013 Giosis Group

$(document).ready(function (e) {
    $("#a_OptAllVw_closeBTN").bind("click", function (e) {
        $("#OptionAllList").click();
    });
});
var OptAllVw = function () {};
OptAllVw.isLoad = false;
OptAllVw.OptionArray = null;
OptAllVw.ColCount = 0;
OptAllVw.SelectValue = new Array();
OptAllVw.SortAName = "";
OptAllVw.SortBName = "";
OptAllVw.ActionBinding = function () {}
OptAllVw.Open = function () {
    if (!OptAllVw.isLoad) {
        OptAllVw.init();
    }
    if (OptAllVw.ColCount == 2 || OptAllVw.ColCount == 3) {
        if ($get("div_OptAllVw_main").style.display != null && $get("div_OptAllVw_main").style.display == "none") {
            $("#OptionAllList").addClass("on");
            $get("div_OptAllVw_main").style.display = "";
        } else {
            $("#OptionAllList").removeClass("on");
            $get("div_OptAllVw_main").style.display = "none";
        }
    }
}
OptAllVw.init = function () {
    if (!OptAllVw.isLoad) {
        OptAllVw.GetInventoryList();
        if (OptAllVw.OptionArray != null && OptAllVw.OptionArray.length > 0) {
            if (OptAllVw.OptionArray[0].sel_name5 != null && OptAllVw.OptionArray[0].sel_name5 != "") {
                OptAllVw.ColCount = 5;
            } else if (OptAllVw.OptionArray[0].sel_name4 != null && OptAllVw.OptionArray[0].sel_name4 != "") {
                OptAllVw.ColCount = 4;
            } else if (OptAllVw.OptionArray[0].sel_name3 != null && OptAllVw.OptionArray[0].sel_name3 != "") {
                OptAllVw.ColCount = 3;
            } else if (OptAllVw.OptionArray[0].sel_name2 != null && OptAllVw.OptionArray[0].sel_name2 != "") {
                OptAllVw.ColCount = 2;
            } else if (OptAllVw.OptionArray[0].sel_name1 != null && OptAllVw.OptionArray[0].sel_name1 != "") {
                OptAllVw.ColCount = 1;
            }
        }
        OptAllVw.isLoad = true;
        setTimeout(function () {
            OptAllVw.MakeTable(OptAllVw.OptionArray);
        }, 100);
    }
}
OptAllVw.MakeTable = function (tmpArr) {
    var tmpHtml = "";
    if (tmpArr != null && tmpArr.length > 0) {
        tmpHtml = '<table summary="">'
        tmpHtml += '<colgroup>';
        for (var i = 0; i < OptAllVw.ColCount; i++) {
            tmpHtml += '<col width="110px" />';
        }
        tmpHtml += '<col width="110px" />';
        tmpHtml += '<col width="66px" />';
        tmpHtml += '</colgroup>';
        tmpHtml += '<thead>';
        tmpHtml += '<tr>';
        for (var i = 1; i <= OptAllVw.ColCount; i++) {
            tmpHtml += '<th scope="col" onclick="OptAllVw.Sort(' + i + ');"><span class="array_as" idx="' + i + '">' + tmpArr[0]["client_sel_name" + i] + '</span></th>';
        }
        tmpHtml += '<th scope="col" onclick="OptAllVw.Sort(4);"><span class="array_as" idx="4">' + MultiLang.findCommonResource("Control/Smart/OptionAllViewer.ascx", "AdditionalPrice") + '</span></th>';
        tmpHtml += '<th scope="col" onclick="OptAllVw.Sort(5);"><span class="array_as" idx="5">' + MultiLang.findCommonResource("Control/Smart/OptionAllViewer.ascx", "Qty") + '</span></th>';
        tmpHtml += '</tr>';
        tmpHtml += '</thead>';
        tmpHtml += '<tbody id="tb_OptAllVw_op_list">';
        tmpHtml += OptAllVw.MakeTbody(tmpArr);
        tmpHtml += '</tbody>';
        tmpHtml += '</table>';
    }
    $("#div_OptAllVw_scroll").html(tmpHtml)
}
OptAllVw.MakeTbody = function (tmpArr) {
    var tmpHtml = "";
    var target_currency = $get("hi_OptAllVw_target_currency").value;
    if (tmpArr != null && tmpArr.length > 0) {
        for (var k = 0; k < tmpArr.length; k++) {
            var tmpCnt = parseInt(tmpArr[k]["remain_cnt"]);
            if (tmpCnt <= 0 || tmpArr[k]["inventory_yn"] == "N") {
                tmpCnt = 0;
            }
            tmpHtml += '<tr ' + (tmpCnt == 0 ? 'class="soldout"' : 'onclick="OptAllVw.SelectInventoryTR(' + k + ');" onmouseout="OptAllVw.MouseOutInventoryTR();" onmouseover="OptAllVw.MouseOverInventoryTR(' + k + ');"') + '>';
            for (var i = 1; i <= OptAllVw.ColCount; i++) {
                tmpHtml += '<td><span>' + tmpArr[k]["client_sel_value" + i] + '</span></td>';
            }
            var tmpPrice = parseFloat(tmpArr[k]["sel_item_price"]) == 0 ? 0 : ((parseFloat(tmpArr[k]["sel_item_price"]) > 0 ? "+" : "") + PriceUtil.FormatCurrencyCode(tmpArr[k]["sel_item_price"], target_currency));
            tmpHtml += '<td><span>' + tmpPrice + '</span></td>';
            tmpHtml += '<td><span>' + (tmpCnt == 0 ? MultiLang.findCommonResource("Control/Smart/OptionAllViewer.ascx", "SoldOut") : tmpCnt) + '</span></td>';
            tmpHtml += '</tr>';
        }
    }
    return tmpHtml;
}
OptAllVw.GetInventoryList = function () {
    var param = new RMSParam();
    param.add("inventory_no", $get("hi_OptAllVw_inventory_no").value);
    param.add("lang_cd", $get("hi_OptAllVw_lang_cd").value);
    param.add("inventory_yn", "");
    param.add("link_type", $get("hi_OptAllVw_link_type").value);
    param.add("gd_no", $get("hi_OptAllVw_gd_no").value);
    param.add("global_order_type", $get("hi_OptAllVw_global_order_type").value);
    var ret = RMSHelper.callWebMethod(Public.getServiceUrl("swe_GoodsAjaxService.asmx"), "GetGoodsInventoryAvailableList", param.toJson());
    if (ret != null && ret.Rows != null) {
        OptAllVw.OptionArray = ret.Rows;
    }
}
OptAllVw.SelectInventoryTR = function (prmIdx) {
    OptAllVw.SelectValueInit();
    if (OptAllVw.OptionArray != null && OptAllVw.OptionArray[prmIdx] != null) {
        OptAllVw.SelectValue[0] = OptAllVw.OptionArray[prmIdx]["sel_value1"];
        if (OptAllVw.ColCount >= 2) {
            OptAllVw.SelectValue[1] = OptAllVw.OptionArray[prmIdx]["sel_value2"];
        }
        if (OptAllVw.ColCount == 3) {
            OptAllVw.SelectValue[2] = OptAllVw.OptionArray[prmIdx]["sel_value3"];
        }
        OptAllVwSelect_OnClick();
        $get("div_OptAllVw_main").style.display = "none";
    }
}
OptAllVw.MouseOverInventoryTR = function (prmIdx) {
    if (OptAllVw.OptionArray != null && OptAllVw.OptionArray[prmIdx] != null) {
        var tmpImgNo = OptAllVw.OptionArray[prmIdx]["main_img_no"];
        OptAllVwMouseOver(tmpImgNo);
    }
}
OptAllVw.MouseOutInventoryTR = function () {
    OptAllVwMouseOut();
}
OptAllVw.SelectValueInit = function () {
    OptAllVw.SelectValue = new Array();
}
OptAllVw.Sort = function (prmIdx) {
    var tmpContrl = $("#div_OptAllVw_scroll").find("th span[idx='" + prmIdx + "']");
    var tmpClass = $(tmpContrl).attr("class");
    $(tmpContrl).removeClass(tmpClass);
    switch (prmIdx) {
        case 1:
            OptAllVw.SortAName = "client_sel_value1";
            OptAllVw.SortBName = "client_sel_value1";
            if (tmpClass == "array_as") {
                OptAllVw.OptionArray.sort(OptAllVw.ReverseArrVal);
                tmpClass = "array_des";
            } else {
                OptAllVw.OptionArray.sort(OptAllVw.SortArrVal);
                tmpClass = "array_as";
            }
            OptAllVw.SortAName = "";
            OptAllVw.SortBName = "";
            break;
            case 2:
            OptAllVw.SortAName = "client_sel_value2";
            OptAllVw.SortBName = "client_sel_value2";
            if (tmpClass == "array_as") {
                OptAllVw.OptionArray.sort(OptAllVw.ReverseArrVal);
                tmpClass = "array_des";
            } else {
                OptAllVw.OptionArray.sort(OptAllVw.SortArrVal);
                tmpClass = "array_as";
            }
            OptAllVw.SortAName = "";
            OptAllVw.SortBName = "";
            break;
            case 3:
            OptAllVw.SortAName = "client_sel_value3";
            OptAllVw.SortBName = "client_sel_value3";
            if (tmpClass == "array_as") {
                OptAllVw.OptionArray.sort(OptAllVw.ReverseArrVal);
                tmpClass = "array_des";
            } else {
                OptAllVw.OptionArray.sort(OptAllVw.SortArrVal);
                tmpClass = "array_as";
            }
            OptAllVw.SortAName = "";
            OptAllVw.SortBName = "";
            break;
            case 4:
            OptAllVw.SortAName = "sel_item_price";
            OptAllVw.SortBName = "sel_item_price";
            if (tmpClass == "array_as") {
                OptAllVw.OptionArray.sort(OptAllVw.ReverseArrVal);
                tmpClass = "array_des";
            } else {
                OptAllVw.OptionArray.sort(OptAllVw.SortArrVal);
                tmpClass = "array_as";
            }
            OptAllVw.SortAName = "";
            OptAllVw.SortBName = "";
            break;
            case 5:
            OptAllVw.SortAName = "remain_cnt";
            OptAllVw.SortBName = "remain_cnt";
            if (tmpClass == "array_as") {
                OptAllVw.OptionArray.sort(OptAllVw.ReverseArrVal);
                tmpClass = "array_des";
            } else {
                OptAllVw.OptionArray.sort(OptAllVw.SortArrVal);
                tmpClass = "array_as";
            }
            OptAllVw.SortAName = "";
            OptAllVw.SortBName = "";
            break;
        }
    $(tmpContrl).addClass(tmpClass);
    var tmpHTML = OptAllVw.MakeTbody(OptAllVw.OptionArray);
    $("#tb_OptAllVw_op_list").html(tmpHTML)
}
OptAllVw.SortArrVal = function (a, b) {
    if (a[OptAllVw.SortAName] > b[OptAllVw.SortBName])
        return 1;
    if (a[OptAllVw.SortAName] < b[OptAllVw.SortBName])
        return-1;
    return 0;
}
OptAllVw.ReverseArrVal = function (a, b) {
    if (a[OptAllVw.SortAName] > b[OptAllVw.SortBName])
        return-1;
    if (a[OptAllVw.SortAName] < b[OptAllVw.SortBName])
        return 1;
    return 0;
}