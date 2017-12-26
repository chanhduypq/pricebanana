var domain=false;
var product_id = false;
if(url[url.length-1]=='/'){
    url=url.substr(0,url.length-1);
}
var apiUrl = url+'/get_content';
var current_url = window.location.href;
function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
$(function () {
    

// contentFull

    product_id = false;
    domain = false;
    var iframe_node = false;
    var contentFull = $("html").html();
    var inventoryList = '';
    //check qoo10
    if (current_url.indexOf("www.qoo10.sg") > - 1) {
        $('.goodsDetailWrap').after('<div id="loading_banana" style="width:100%;height:100%;"><img src="'+url+'/image/loading.gif" style="width: 30%;height: 30%;"/></div>');
        var asin = $("#gd_no").val();
        if (asin != ''){
            product_id = asin;
            domain = 'qoo10';
            iframe_node = '.goodsDetailWrap';
        }
        if ($('#ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo').html() != undefined) {
            inventoryList = $("#ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo").html();
            if($("#OptionAllList").is(":visible")){
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
                OptAllVw.MakeTable(OptAllVw.OptionArray);
                inventoryList += $("#div_OptAllVw_scroll").html();
            }
            else{
                if($("ul[optiontype='inventory']").length>1){
                    var result=[];
                    var ar={};
                    optiontypes=$("ul[optiontype='inventory']");
                    for(i=0;i<optiontypes.length-1;i++){
                        level='level'+i;
                        lis=$(optiontypes[i]).find('li');
                        var temp=[];
                        for(j=0;j<lis.length;j++){
                            temp.push($(lis[j]).attr('sel_value'));
                        }
                        ar["level"+i]=temp;
                    }
//                    console.log(ar);
                    
                    if(optiontypes.length-1==2){
                        level0=ar['level0'];
                        for(i=0;i<level0.length;i++){
                            level1=ar['level1'];
                            for(j=0;j<level1.length;j++){
                                
                                sel_value1=level0[i];
                                sel_value2=level1[j];
                                console.log(sel_value1);
                                console.log(sel_value2);
                                $.ajax({
                                    url: 'https://www.qoo10.sg/gmkt.inc/swe_GoodsAjaxService.asmx/GetGoodsInventoryEachLevelNameByKeyword',
                                    method: "POST",
                                    crossDomain: true,
                                    async: false,
                                    dataType: 'xml',
                                    data: {
                                        "inventory_no":"ST"+product_id+" ",
                                        "sel_value1":sel_value1,
                                        "sel_value2":sel_value2,
                                        "sel_value3":"",
                                        "sel_value4":"",
                                        "level":3,
                                        "sel_count":3,
                                        "keyword":"",
                                        "lang_cd":"en",
                                        "global_order_type":"L",
                                        "gd_no":product_id,
                                        "inventory_yn":"",
                                        "link_type":"N",
                                        "___cache_expire___":"1512836967428"
                                    },
                                    success: function (xml) {
                                        var obj=xml2json(xml);
                                        arr=obj.ArrayOfGoodsAddInfo;
                                        temp=arr.GoodsAddInfo;
                                        for(k=0;k<temp.length;k++){
                                            temp[k].sel_value=sel_value1+"|"+sel_value2+"|"+temp[k].sel_value;
                                        }
                                        result.push(obj.ArrayOfGoodsAddInfo);
                                    },
                                    error: function (xhr, status, error) {
                                        console.log(status);
                                        console.log(error);
                                        console.log(xhr.responseText);
                                    }
                                });
                            }
                        }
                    }
                    else if(optiontypes.length-1==3){
                        level0=ar['level0'];
                        for(i=0;i<level0.length;i++){
                            level1=ar['level1'];
                            for(j=0;j<level1.length;j++){
                               
                                level2=ar['level2'];
                                for(k=0;k<level2.length;k++){
                                    sel_value1=level0[i];
                                    sel_value2=level1[j];
                                    sel_value3=level2[k];
                                    $.ajax({
                                        url: 'https://www.qoo10.sg/gmkt.inc/swe_GoodsAjaxService.asmx/GetGoodsInventoryEachLevelNameByKeyword',
                                        method: "POST",
                                        crossDomain: true,
                                        async: false,
                                        dataType: 'xml',
                                        data: {
                                            "inventory_no":"ST"+product_id+" ",
                                            "sel_value1":sel_value1,
                                            "sel_value2":sel_value2,
                                            "sel_value3":sel_value3,
                                            "sel_value4":"",
                                            "level":4,
                                            "sel_count":4,
                                            "keyword":"",
                                            "lang_cd":"en",
                                            "global_order_type":"L",
                                            "gd_no":product_id,
                                            "inventory_yn":"",
                                            "link_type":"N",
                                            "___cache_expire___":"1512836967428"
                                        },
                                        success: function (xml) {
                                            var obj=xml2json(xml);
                                            arr=obj.ArrayOfGoodsAddInfo;
                                            temp=arr.GoodsAddInfo;
                                            for(l=0;l<temp.length;l++){
                                                temp[l].sel_value=sel_value1+"|"+sel_value2+"|"+temp[l].sel_value;
                                            }
                                            result.push(obj.ArrayOfGoodsAddInfo);
                                        },
                                        error: function (xhr, status, error) {
                                            console.log(status);
                                            console.log(error);
                                            console.log(xhr.responseText);
                                        }
                                    });
                                }
                                
                            }
                        }
                    }
                    
                    console.log(result);
                    inventoryList+='<div id="inventoryListOther">'+JSON.stringify(result)+'</div>';
                    
                }
            }
        }
        else{
            inventoryList='';
        }
        
        
        
        
    }
    //check lazada
    if (current_url.indexOf("www.lazada.sg") > - 1) {
        $('#prodinfo').after('<div id="loading_banana" style="width:100%;height:100%;"><img src="'+url+'/image/loading.gif" style="width: 30%;height: 30%;"/></div>');
        var asin = $("#config_id").val();
        if (asin != ''){
            product_id = asin;
            domain = 'lazada';
            iframe_node = '#prodinfo';
        }
    }

    //check march domain to send full page to server by ajax
    if (domain != false && domain != 'shopee' && domain != 'tokopedia' && product_id != false && iframe_node != false){
        if(getCookie(domain+"_"+product_id)=='1'){
            $("#loading_banana").remove();
            $(iframe_node).after('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/' + domain + '/' + product_id + '"></iframe></div>');
        }
        else{
            $.ajax({
                url: apiUrl,
                method: "POST",
                crossDomain: true,
                async: false,
                dataType: 'json',
                data: {
                    id:product_id,
                    url:current_url,
                    domain:domain,
                    content:contentFull,
                    inventoryList:inventoryList
                },
                success: function (result) {
                    if (result.success) {
                        setTimeout(function (){
                            $("#loading_banana").remove();
                            $(iframe_node).after('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/' + domain + '/' + product_id + '"></iframe></div>');
                        },3000);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(status);
                    console.log(error);
                    console.log(xhr.responseText);
                }
            });
        }
        
        setCookie(domain+"_"+product_id,'1');
        
        
    }

});


function showIframeForShopee() {
    if ($('.product-page__top-section').html() != undefined) {
        $('.product-page__top-section').after('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/'+domain+'/'+ product_id + '"></iframe></div>');
        clearInterval(timer);
    }
}
function showIframeForTokopedia() {
    if ($('.pull-left.m-0.view-count').html() != undefined) {
        $('#review-summary-container').before('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/' + domain + '/' + product_id + '"></iframe></div>');
        clearInterval(timerTokopedia);
    }
}
//var shopeeRegex = /shopee.sg\/[\S]*(-i.)([0-9]{6}).([0-9]{9})/i;
var shopeeRegex = /shopee.sg\/[\S]*(-i.)([0-9]).([0-9])/i;
if (shopeeRegex.test(current_url)){
//if (current_url.indexOf("shopee.sg") > - 1) {
    $('body').prepend('<div id="loading_banana" style="width:30%;height:50%;position:fixed;left:30%;top:30%;"><img src="'+url+'/image/loading.gif" style="width: 100%;height: 100%;"/></div>');
    timer = setInterval(runShopee, 5000);
    
}

if (current_url.indexOf("www.tokopedia.com") > - 1 && $('.pull-left.m-0.view-count').length>0) {
    $('#review-summary-container').before('<div id="loading_banana" style="width:100%;height:100%;"><img src="'+url+'/image/loading.gif" style="width: 30%;height: 30%;"/></div>');
    timerTokopedia = setInterval(runTokopedia, 5000);
}


function runShopee() {
    
    if ($('.product-page__top-section').html() != undefined) {
        clearInterval(timer);
        contentFull = $("html").html();
        asin = current_url.split('.');
        product_id = asin[3];
        iframe_node = '.product-page__top-section';
        if(getCookie("shopee_"+product_id)=='1'){
            $("#loading_banana").remove();
            $(iframe_node).after('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/shopee/' + product_id + '"></iframe></div>');
        }
        else{
            $.ajax({
                url: apiUrl,
                method: "POST",
                crossDomain: true,
                async: false,
                dataType: 'json',
                data: {
                    id:product_id,
                    url:current_url,
                    domain:'shopee',
                    content:contentFull,
                    inventoryList:''
                },
                success: function (result) {
                    if (result.success) {
                        setTimeout(function (){
                            $("#loading_banana").remove();
                            $(iframe_node).after('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/shopee/' + product_id + '"></iframe></div>');
                        },5000);

                    }
                },
                error: function (xhr, status, error) {
                    console.log(status);
                    console.log(error);
                    console.log(xhr.responseText);
                }
            });
        }
        setCookie("shopee_"+product_id,'1');
        
        
    }
}

function runTokopedia() {
    if ($('.pull-left.m-0.view-count').html() != undefined) {
        clearInterval(timerTokopedia);
        contentFull = $("html").html();
        product_id = $("#product-id").val();
        see='0';
        if(getCookie("tokopedia_"+product_id)=='1'){
            $("#loading_banana").remove();
            $('#review-summary-container').before('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/tokopedia/' + product_id + '"></iframe></div>');
        }
        else{
            $.ajax({
                url: 'https://www.tokopedia.com/provi/check?pid='+product_id+'&callback=show_product_view',//&_=1513821634109',
                method: "GET",
                crossDomain: true,
                async: false,
                success: function (result) {
                    result=result.split(':');
                    result=result[1];
                    result=result.split('}');
                    see=result[0];
                },
                error: function (xhr, status, error) {
                    console.log(status);
                    console.log(error);
                    console.log(xhr.responseText);
                }
            });


            $.ajax({
                url: apiUrl,
                method: "POST",
                crossDomain: true,
                async: false,
                dataType: 'json',
                data: {
                    id:product_id,
                    url:current_url,
                    domain:'tokopedia',
                    content:contentFull,
                    inventoryList:'',
                    see:see
                },
                success: function (result) {
                    if (result.success) {
                        setTimeout(function (){
                            $("#loading_banana").remove();
                            $('#review-summary-container').before('<div id="pricebanana_ctn"><iframe src="'+url+'/banana/tokopedia/' + product_id + '"></iframe></div>');
                        },3000);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(status);
                    console.log(error);
                    console.log(xhr.responseText);
                }
            });
        }
        
        setCookie("tokopedia_"+product_id,'1');
        
        
    }
}