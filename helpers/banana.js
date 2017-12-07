module.exports.get_html = function (item_type_labels,product_id) {
    var item_type_html='';
//    var item_type_history=get_item_type_history(product_id);
    var ProductItemType = require('../models/product_item_type');
    ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
        item_type_history= JSON.parse(productItemType.item_type_history);
        
        for(i=0;i<item_type_labels.length;i++){
            item_type_html+=item_type_labels[i]+' <select>';
            level={};
            for(key in item_type_history){
                temp=key.split('|');
                level[temp[i]]='';
            }
            for(key in level){
                item_type_html+='<option>'+key+'</option>';
            }
            item_type_html+='</select><br>';
        }

        return item_type_html;
    });
    
    
    
}

function get_item_type_history (product_id) {
    var ProductItemType = require('../models/product_item_type');
    ProductItemType.findOne({product_id: product_id}, function (error, productItemType) {
        return JSON.parse(productItemType.item_type_history);
    });
}


