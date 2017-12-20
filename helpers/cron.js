module.exports.delete_old_data = function () {
    var UrlContent = require('../models/url_content');
    var helper = require('../helpers/functions');
    today = helper.get_today();
    var today = new Date();
    today.setDate(today.getDate() - 14);
    today = today.getFullYear() + '-' + (today.getMonth() + 1) + "-" + today.getDate();
    UrlContent.deleteMany({domain: 'qoo10', createdDate: today}, function (err, obj) {
    });
};

module.exports.cron = function (domain) {
    urls = getUrls(domain);
    for (i = 0; i < urls.length; i++) {
        saveDB(urls[i], domain);
    }
};

function getUrls(domain) {
    urls = [];
//    urls.push('https://www.qoo10.sg/item/PLUS-SIZE-TOPS-DRESS-PANTS-SHORTS-SHORT-SLEEVE-T-SHIRT-SLING/560300975');
    urls.push('https://www.tokopedia.com/luna/luna-64-gb-space-gray');
    
    return urls;
}
function saveDB(url, domain) {
    var UrlContent = require('../models/url_content');
    var helperGetContent = require('../helpers/get_content');
    var helper = require('../helpers/functions');
    var Product = require('../models/product');
    var ProductItemType = require('../models/product_item_type');

    requestify = require('requestify');
    requestify.get(url).then(function (response) {
        var content = response.getBody();
        require("jsdom").env("", function (err, window) {
            if (err) {
                console.error(err);
                return;
            }

            var $ = require("jquery")(window);
            
            all = $($.parseHTML(content));
            
            if (domain == 'qoo10') {
                id = $(all).find("#gd_no").val();
            } else if (domain == 'lazada') {
                id = $(all).find("#config_id").val();
            } else if (domain == 'shopee') {
                var asin = url.split('.');
                id = asin[3];
            } else if (domain == 'tokopedia') {
                id = $(all).find("#product-id").val();
            }

            var DomParser = require('dom-parser');
            var parser = new DomParser();
            var dom = parser.parseFromString(content);

            ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo = dom.getElementById("ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo");

            if (ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo != null && ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo.innerHTML != "") {
                inventoryList = ctl00_ctl00_MainContentHolder_MainContentHolderNoForm_OptionInfo.innerHTML;
                if($(all).find("#div_OptAllVw_scroll").html().trim()==''){
//                    var request = require('ajax-request');
//
//                    request({
//                        url: 'https://www.qoo10.sg/gmkt.inc/swe_GoodsAjaxService.asmx/GetGoodsInventoryAvailableList',
//                        method: 'POST',
//                        data: {
//                            "inventory_no": "ST560300975 ",
//                            "lang_cd": "en",
//                            "global_order_type": "L",
//                            "gd_no": id,
//                            "inventory_yn": "",
//                            "link_type": "N",
//                            "___cache_expire___": "1513217968101"
//                        }
//                        ,headers: {'user-agent': 'node.js',"Accept": "application/json", "Content-Type": "application/json"}
//                    },
//                            function (err, res, body) {
//                                console.log(err);
//                                console.log(res);
//                                console.log(body);
//                    });
                    
                    $.ajax({
                        url: 'https://www.qoo10.sg/gmkt.inc/swe_GoodsAjaxService.asmx/GetGoodsInventoryAvailableList',
                        method: "POST",
//                        crossDomain: true,
                        async: false,
//                        dataType: 'xml',
                        data: {
                            "inventory_no": "ST560300975 ",
                            "lang_cd": "en",
                            "global_order_type": "L",
                            "gd_no": id,
                            "inventory_yn": "",
                            "link_type": "N",
                            "___cache_expire___": "1513217968101"
                        },
                        success: function (xml) {
                            console.log(xml);
                        },
                        error: function (xhr, status, error) {
                            console.log(status);
                            console.log(error);
                            console.log(xhr.responseText);
                        }
                    });
//                    OptAllVw.GetInventoryList();
//                    if (OptAllVw.OptionArray != null && OptAllVw.OptionArray.length > 0) {
//                        if (OptAllVw.OptionArray[0].sel_name5 != null && OptAllVw.OptionArray[0].sel_name5 != "") {
//                            OptAllVw.ColCount = 5;
//                        } else if (OptAllVw.OptionArray[0].sel_name4 != null && OptAllVw.OptionArray[0].sel_name4 != "") {
//                            OptAllVw.ColCount = 4;
//                        } else if (OptAllVw.OptionArray[0].sel_name3 != null && OptAllVw.OptionArray[0].sel_name3 != "") {
//                            OptAllVw.ColCount = 3;
//                        } else if (OptAllVw.OptionArray[0].sel_name2 != null && OptAllVw.OptionArray[0].sel_name2 != "") {
//                            OptAllVw.ColCount = 2;
//                        } else if (OptAllVw.OptionArray[0].sel_name1 != null && OptAllVw.OptionArray[0].sel_name1 != "") {
//                            OptAllVw.ColCount = 1;
//                        }
//
//                    }
//                    OptAllVw.MakeTable(OptAllVw.OptionArray);
                    inventoryList += $(all).find("#div_OptAllVw_scroll").html();
                } else {
                    if ($("ul[optiontype='inventory']").length > 1) {
                        var result = [];
                        var ar = {};
                        optiontypes = $(all).find("ul[optiontype='inventory']");
                        for (i = 0; i < optiontypes.length - 1; i++) {
                            level = 'level' + i;
                            lis = $(optiontypes[i]).find('li');
                            var temp = [];
                            for (j = 0; j < lis.length; j++) {
                                temp.push($(lis[j]).attr('sel_value'));
                            }
                            ar["level" + i] = temp;
                        }

                        if (optiontypes.length - 1 == 2) {
                            level0 = ar['level0'];
                            for (i = 0; i < level0.length; i++) {
                                level1 = ar['level1'];
                                for (j = 0; j < level1.length; j++) {

                                    sel_value1 = level0[i];
                                    sel_value2 = level1[j];
                                    console.log(sel_value1);
                                    console.log(sel_value2);
                                    $.ajax({
                                        url: 'https://www.qoo10.sg/gmkt.inc/swe_GoodsAjaxService.asmx/GetGoodsInventoryEachLevelNameByKeyword',
                                        method: "POST",
                                        crossDomain: true,
                                        async: false,
                                        dataType: 'xml',
                                        data: {
                                            "inventory_no": "ST575680492 ",
                                            "sel_value1": sel_value1,
                                            "sel_value2": sel_value2,
                                            "sel_value3": "",
                                            "sel_value4": "",
                                            "level": 3,
                                            "sel_count": 3,
                                            "keyword": "",
                                            "lang_cd": "en",
                                            "global_order_type": "L",
                                            "gd_no": product_id,
                                            "inventory_yn": "",
                                            "link_type": "N",
                                            "___cache_expire___": "1512836967428"
                                        },
                                        success: function (xml) {
                                            var obj = xml2json(xml);
                                            arr = obj.ArrayOfGoodsAddInfo;
                                            temp = arr.GoodsAddInfo;
                                            for (k = 0; k < temp.length; k++) {
                                                temp[k].sel_value = sel_value1 + "|" + sel_value2 + "|" + temp[k].sel_value;
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
                        } else if (optiontypes.length - 1 == 3) {
                            level0 = ar['level0'];
                            for (i = 0; i < level0.length; i++) {
                                level1 = ar['level1'];
                                for (j = 0; j < level1.length; j++) {

                                    level2 = ar['level2'];
                                    for (k = 0; k < level2.length; k++) {
                                        sel_value1 = level0[i];
                                        sel_value2 = level1[j];
                                        sel_value3 = level2[k];
                                        $.ajax({
                                            url: 'https://www.qoo10.sg/gmkt.inc/swe_GoodsAjaxService.asmx/GetGoodsInventoryEachLevelNameByKeyword',
                                            method: "POST",
                                            crossDomain: true,
                                            async: false,
                                            dataType: 'xml',
                                            data: {
                                                "inventory_no": "ST575680492 ",
                                                "sel_value1": sel_value1,
                                                "sel_value2": sel_value2,
                                                "sel_value3": sel_value3,
                                                "sel_value4": "",
                                                "level": 4,
                                                "sel_count": 4,
                                                "keyword": "",
                                                "lang_cd": "en",
                                                "global_order_type": "L",
                                                "gd_no": product_id,
                                                "inventory_yn": "",
                                                "link_type": "N",
                                                "___cache_expire___": "1512836967428"
                                            },
                                            success: function (xml) {
                                                var obj = xml2json(xml);
                                                arr = obj.ArrayOfGoodsAddInfo;
                                                temp = arr.GoodsAddInfo;
                                                for (l = 0; l < temp.length; l++) {
                                                    temp[l].sel_value = sel_value1 + "|" + sel_value2 + "|" + temp[l].sel_value;
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
                        inventoryList += '<div id="inventoryListOther">' + JSON.stringify(result) + '</div>';

                    }
                }
            } else {
                inventoryList = '';
            }


            if (domain == 'qoo10') {
                info = helperGetContent.get_info_from_qoo10(content, inventoryList);
            } else if (domain == 'lazada') {
                info = helperGetContent.get_info_from_lazada(content);
            } else if (domain == 'shopee') {
                info = helperGetContent.get_info_from_shopee(content);
            } else if (domain == 'tokopedia') {
                info = helperGetContent.get_info_from_tokopedia(content);
            }

            var data = {
                domain: domain,
                id: id,
                content: content
            };
            today = helper.get_today();
            UrlContent.create(data, function (error, urlContent) {
            });
            var product_id = domain + "_" + id;
            Product.findOne({product_id: product_id}, function (error, product) {

                if (product === null) {
                    var price_histories = [
                        {date: today, price: info.sell_price}
                    ];
                    if (domain == 'tokopedia') {
                                
                        var see_histories = [
                            { date: today, see: info.see}
                        ]; 
                        var sold_histories = [
                            { date: today, sold: info.sold}
                        ]; 
                        var booking_min_histories = [
                            { date: today, booking_min: info.booking_min}
                        ]; 
                        var reviews_histories = [
                            { date: today, reviews: info.reviews}
                        ]; 
                        var discussion_histories = [
                            { date: today, discussion: info.discussion}
                        ]; 
                    }
                    var productData = {
                        product_id: product_id,
                        price_history: JSON.stringify(price_histories),
                        current_price: info.sell_price,
                        item_type_labels: info.item_type_labels
                    };
                    if (domain == 'tokopedia') {
                        productData['see_history'] = JSON.stringify(see_histories);
                        productData['sold_history'] = JSON.stringify(sold_histories);
                        productData['booking_min_history'] = JSON.stringify(booking_min_histories);
                        productData['reviews_history'] = JSON.stringify(reviews_histories);
                        productData['discussion_history'] = JSON.stringify(discussion_histories);
                    }
                    Product.create(productData, function (error, product) {
                    });
                } else {
                    var price_histories = JSON.parse(product.price_history);
                    var find = false;
                    for (var i = 0; i < price_histories.length; i++) {
                        if (price_histories[i].date == today) {
                            price_histories[i].price = info.sell_price;
                            price_histories[i].item_types = info.item_types;
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        price_histories.push({date: today, price: info.sell_price});
                    }
                    price_history = helper.sort_price_history(price_histories);
                    current_price = price_history[price_history.length - 1].price;
                    
                    if (domain == 'tokopedia') {
                                
                        var see_histories = JSON.parse(product.see_history);
                        var sold_histories = JSON.parse(product.sold_history);
                        var booking_min_histories = JSON.parse(product.booking_min_history);
                        var reviews_histories = JSON.parse(product.reviews_history);
                        var discussion_histories = JSON.parse(product.discussion_history);

                        find = false;
                        for(var i=0; i<see_histories.length;i++) {
                            if(see_histories[i].date == today) {
                                see_histories[i].price = info.see;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            see_histories.push({date: today, see: info.see});
                        }
                        see_history=helper.sort_price_history(see_histories);

                        find = false;
                        for(var i=0; i<sold_histories.length;i++) {
                            if(sold_histories[i].date == today) {
                                sold_histories[i].price = info.sold;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            sold_histories.push({date: today, sold: info.sold});
                        }
                        sold_history=helper.sort_price_history(sold_histories);

                        find = false;
                        for(var i=0; i<booking_min_histories.length;i++) {
                            if(booking_min_histories[i].date == today) {
                                booking_min_histories[i].price = info.booking_min;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            booking_min_histories.push({date: today, booking_min: info.booking_min});
                        }
                        booking_min_history=helper.sort_price_history(booking_min_histories);

                        find = false;
                        for(var i=0; i<reviews_histories.length;i++) {
                            if(reviews_histories[i].date == today) {
                                reviews_histories[i].price = info.reviews;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            reviews_histories.push({date: today, reviews: info.reviews});
                        }
                        reviews_history=helper.sort_price_history(reviews_histories);

                        find = false;
                        for(var i=0; i<discussion_histories.length;i++) {
                            if(discussion_histories[i].date == today) {
                                discussion_histories[i].price = info.discussion;
                                find = true;
                                break;
                            }
                        }
                        if(!find) {
                            discussion_histories.push({date: today, discussion: info.discussion});
                        }
                        discussion_history=helper.sort_price_history(discussion_histories);
                    }

                    helperGetContent.send_mail_for_tracking_price_fixed(product_id, info.sell_price);

                    if (domain == 'tokopedia') {
                        Product.findOneAndUpdate({ "_id" : product._id }, {reviews_history: JSON.stringify(reviews_history),discussion_history: JSON.stringify(discussion_history),price_history: JSON.stringify(price_history),see_history: JSON.stringify(see_history),sold_history: JSON.stringify(sold_history),booking_min_history: JSON.stringify(booking_min_history),"current_price":current_price}, function (err, product) {
                        });
                    }
                    else{
                        Product.findOneAndUpdate({ "_id" : product._id }, {price_history: JSON.stringify(price_history),"current_price":current_price}, function (err, product) {
                        });
                    }
                }

                item_types = info.item_types;
                ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
                    var all = {};

                    if (productItemType === null) {
                        for (key in item_types) {
                            all[key] = [{date: today, price: item_types[key]['price'], quantity: item_types[key]['quantity']}];
                        }
                        var productData = {
                            product_id: product_id,
                            item_type_history: JSON.stringify(all)
                        };
                        ProductItemType.create(productData, function (error, product) {
                        });
                    } else {
                        var all = JSON.parse(productItemType.item_type_history);
                        for (key in all) {
                            var price_histories = all[key];
                            var find = false;
                            for (var i = 0; i < price_histories.length; i++) {
                                if (price_histories[i].date == today) {
                                    price_histories[i].price = item_types[key]['price'];
                                    price_histories[i].quantity = item_types[key]['quantity'];
                                    find = true;
                                    break;
                                }
                            }
                            if (!find) {
                                price_histories.push({date: today, price: item_types[key]['price'], quantity: item_types[key]['quantity']});
                            }
                            all[key] = helper.sort_price_history(price_histories);
                        }


                        ProductItemType.findOneAndUpdate({"_id": productItemType._id}, {item_type_history: JSON.stringify(all)}, function (err, product) {
                        });
                    }
                });
            });
        });




    });
}

function xml2json(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
      console.log(e.message);
  }
}