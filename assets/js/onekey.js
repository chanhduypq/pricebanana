/* 主域名 */
var domain = '//www.yeslogistics.com.my/';

/* 网站链接*/
var weburl = domain.substring(0,domain.length-1);

/* 数据交互接口 */
var website = domain+'shop2cart.php';

/* 国家*/
var sgCountry='';

/* 购物车*/
var cartHref = domain+'Cart/index.html';

/* 联系邮箱*/
var adminemail = 'eason@yeslogistics.com.my';

/* 项目名*/
var sitename = 'yeslogistics.com.my';

/* 支持国家*/
var countryArr = new Array('Singapore', 'Malaysia');
var countryUnit = new Array('SGD', 'MRY');

/* 默认国家*/
var defaultCountry = '';

/**
 * 处理url分国家
 */
var getsgUrl=function(key){
	var url = {};
	for (var i = 0; i < countryArr.length; i++)
	{
		url[countryArr[i]] = { 
			'weburl': weburl,
			'website': website,
	     	'cartUrl': cartHref,
			'email'	: adminemail,
		};
	}

	return sgCountry?url[sgCountry][key]:"";
};
/**
 * 专门处理 OneKey 插件HTML相关
 */
var sgOneKeyHtml = {
	/* 选择运输方式 */
	shipType : function(){
		var htmlString = '';
		htmlString += '<div class="sg_box_goods">';
		htmlString += '	<div class="goods_info">';
		htmlString += '	    <div>';
		htmlString += '			<div><img src="<%=item.pic%>" width="120px" height="120px" /></div>';
		htmlString += '			<div>';
		htmlString += '				<input type="hidden" name="p_url" value="<%=item.p_url%>">';
		htmlString += '				<input type="hidden" name="p_title" value="<%=item.p_title%>">';
		htmlString += '				<input type="hidden" name="seller" value="<%=item.seller%>">';
		htmlString += '				<input type="hidden" name="prop_list" value="<%=item.prop_list%>">';
		htmlString += '				<input type="hidden" name="currency" value="<%=itemData.item.unit[sgCountry]%>">';
		htmlString += '				<ul class="goods_attrib">';
		htmlString += '					<li><span>Selected:</span>';
		htmlString += '					<b data-value="<%=item.color_id%>" class="sg_color_f47a20 goods_color_size"><%=item.color%></b>&nbsp;&nbsp;';
		htmlString += '					<b data-value="<%=item.size_id%>" class="sg_color_f47a20 goods_color_size"><%=item.size%></b>&nbsp;&nbsp;';
		htmlString += '					<b data-value="<%=item.specification_id%>" class="sg_color_f47a20 goods_color_size"><%=item.specification%></b>';
		htmlString += '					</li>';
		htmlString += '					<li><span>Goods Price:</span><input type="text" name="bargain" value="<%=item.bargain%>" onchange="$(this).next().text(sgTransform.price(this.value));" /> ≈ <b class="sg_color_f47a20"></b> <%=unit%></li>';
		htmlString += '					<li><span>China Express:</span><input type="text" name="express"  value="<%=item.express%>" onchange="$(this).next().text(sgTransform.price(this.value));" /> ≈ <b class="sg_color_f47a20"></b> <%=unit%></li>';
		htmlString += '					<li><span>Quantity:</span><input type="text" name="number"  value="<%=item.number%>" /></li>		';
		htmlString += '				</ul>';
		htmlString += '			</div>';
		htmlString += '		</div>';
		htmlString += '		<div style="clear: both;float: none;"></div>';
		htmlString += '		<%if(sgcountry=="Singapore" && 0){%>	';
		htmlString += '		<b>Default mode of transport:</b>';
		htmlString += '		<div class="shiptype">';
		htmlString += '			<%for(i=0;i<shipType.length;i++){%><a href="#" shipTypeIndex="<%=shipType[i][0]%>" ><%=shipType[i][1]%></a><%}%>';
		htmlString += '		</div>';
		htmlString += '		<%}%>';
//		htmlString += '		<b>Remark:</b>';
//		htmlString += '		<div class="remark">';
//		htmlString += '			<textarea id="remark" placeholder="Please enter information for goods related notes"></textarea>';
//		htmlString += '		</div>';
		htmlString += '	</div>';
		htmlString += '	<div class="sg_box_btn_show" style="text-align:right;"><a href="javascript:sgData.shipType.confirm()" class="sg_box_btn sg_addto"><b style="width: 110px;height:20px;background-position: 0 -74px;color: #fff;">Add To Cart</b></a></div>';
		htmlString += '</div>';
		return htmlString;
	},
	selectCountry : function(){
		var htmlString ='';
		htmlString ='<div class="sg_content">';
		for (var i = 1; i <= countryArr.length; i++)
		{
            htmlString += '<span class="sgchoice">'
	            		+	'<img class="countryImg" onclick="$(\'#radio'+i+'\').attr(\'checked\',true)" src="//tool.onebound.cn/ShopTool/chrome/comm/images/'+countryArr[i - 1]+'.jpg" style="cursor: pointer;"/>'
	            		+	'<input type="radio" class="sg_radio sg_input" name="selCoutry" value="'+countryArr[i - 1]+'"  id="radio'+i+'"/>'
	            		+	'<label class="sg_label"  for="radio'+i+'">'+countryArr[i - 1]+'</label>'
	            		+ '</span>';
        }
        htmlString += '<div style="clear:both;"></div>'
            		+ '   <span class="remchoice">'
            		+ '       <input type="checkbox" class="sg_check sg_input" id="issaveCookie"/>'
            		+ '       <label class="sg_label" for="sg_check" onclick="if($(\'#issaveCookie\').attr(\'checked\'))$(\'#issaveCookie\').attr(\'checked\',false);else $(\'#issaveCookie\').attr(\'checked\',true); ">Remember my choice next time no longer remind!</label>'
            		+ '    </span>'
            		+ '   <a class="sgconfirm" onclick="sgData.shipType.saveCountry($(\'input.sg_radio:radio:checked\').val(),$(\'#issaveCookie\').attr(\'checked\'))">Confirm</a>'
            		+ '</div>';
		 return htmlString;
	},
	/* 添加到购物车相关 */
	addToCart : {
		/* 失败 */
		fail : function(data){
			//var html = '<center style="margin: 20px 0;line-height: 30px;"><p><b class="sg_color_red" style="font-size:20px;"><span class="sg_ico sg_ico_error">&nbsp;</span> Sorry, Add Failed！</b></p><p>'+data.error+'</p><p>Please try again or contact us.<br>Site: <a href="<%=sgurl%>" target="_blank"><%=sgurl%></a>, Email: <a href="mailto:<%=sgemail%>"><%=sgemail%></a></p></center>';
			var html = '<center style="margin: 20px 0;line-height: 30px;"><p><b class="sg_color_red" style="font-size:20px;"><span class="sg_ico sg_ico_error">&nbsp;</span> Sorry, Add Failed！</b></p><p style="font-size:16px;">Message: '+data.error+'</p><p>Please try again or contact us.<br>Email: <a href="mailto:<%=sgemail%>"><%=sgemail%></a></p></center>';
			var result=new Array();
			result.sgurl= getsgUrl('weburl');
			result.sgemail= getsgUrl('email');
			this.box( baidu.template(html, result), 'Add Failed' );
		},
		/* 成功 */
		success : function(data){
			var html = '<center style="margin: 20px 0;line-height: 30px;"><p><b class="sg_color_green" style="font-size:20px;"><span class="sg_ico sg_ico_ok">&nbsp;</span> ADDED TO SHOPPING CART！</b></p><p>You shopping cart total of <b class="sg_color_f47a20"><%=num%></b> goods, total cost of <b class="sg_color_f47a20"><%=price%></b> <%=unit%>.</p></center>';
			data.unit=itemData.item.unit[sgCountry];//赋值货币单位
			this.box( baidu.template(html, data), 'Added Successfully' );
			$('.sg_box').addClass('sg_box_action_show sg_box_btn1_show');
		},
		/* 弹窗 */
		box : function(string, title){
			sgOneKeyHtml.box.show(string, title);
		}
	},
	/* 主弹窗 */
	box : {
		html : '<div class="sg_box" style="width:auto;">'
				+'<div class="sg_box_head">{TITLE}'
				+	'<span onclick="sgData.shipType.delCountry()" style="cursor: pointer;"> {COUNTRY} </span>'
				+	'<b class="sg_box_close">X</b>'
				+'</div>'
				+'<div class="sg_box_content">{CONTENT}</div>'
				+'<div class="sg_box_action">'
				+	'<center><a target="_blank" class="sg_box_btn1" href="{cartUrl}">View Cart</a>&nbsp;&nbsp;'
				+	'<a class="sg_box_btn1" href="javascript:sgOneKeyHtml.box.hide();">Continue Shopping</a></center>'
				+'</div>'
			+'</div>',
		show : function(content,title){
				$('.sg_box').remove();
				$('body').append( this.html.replace('{CONTENT}',content||'').replace('{TITLE}',title||'One Key').replace('{COUNTRY}',sgCountry?'|  '+sgCountry:'' ).replace('{cartUrl}',getsgUrl('cartUrl')));
				$('.sg_box_close').one('click',function(){sgOneKeyHtml.box.hide();});
				$('#sg_bg,.sg_box').fadeIn();
		},
		hide : function(){
			$('#sg_bg,.sg_box').fadeOut();
		}
	},
	/* 调整弹窗居中 */
	resetBoxSize : function(){
		var boxDom = $('.sg_box');
		if( boxDom.length>=1 ){
			boxDom.each(function(){					
				$(this).css({width:'auto'});
				var boxWidth = $(this).width()+22;
				var boxHeight = $(this).height()+2;
				boxWidth += boxWidth%2;
				boxHeight += boxHeight%2;
				$(this).css({width:boxWidth, margin:'-'+(boxHeight/2)+'px 0 0 -'+(boxWidth/2)+'px'});
			});
		}
	}
};

/* 商品数据处理 */
var itemData = {
		/* 存放商品数据 */
		item : {
			postageFee : 0,
			item : {},
			structure : '',
			/* 货币符号*/
			unit:{}
		},
		/* 初始化 */
		init : function(){
			for (var i = 0; i < countryArr.length; i++)
			{
				itemData.item.unit[countryArr[i]] = countryUnit[i];
			}

			var T = this;
			if( !T.structure(T.item.structure) ){
				/* 获取对应网站采集数据结构 */
					//$.getScript(website + '?f=onekey&callback=itemData.structure');
			}
		},
		/* 处理采集数据结构 */
		structure : function(json){
			if(!json) return false;
			var T= this;
			T.item.structure = json;
			$.each(json,function(k,v){
				   T.item.item[k] = v==='' ? '' : eval(v);
				});
			return true;
		}
};

/**
 * 主数据处理
 */
var sgData = {
	item : itemData.item.item,
	/* 商品相关操作 */
	goods : {
		/* 商品添加 */
		add : function(){
			var data = sgData.item;
			data.source = sgData.source();/*console.log(data);*/
			var url=getsgUrl('website');
			/*console.log(url);*/
                        console.log(data);
			$.ajax({
				url: url+'?f=onekey&g2p',
				data : data,
				jsonpCallback:'sgData.goods.callback.addGoods'
			});
		},
		/* 回调函数 */
		callback : {
			addGoods : function(data){
				if( 1 === data.ret ){
					if (!data.error)
					{
						data.error = 'Link Error';
					}
					
					sgOneKeyHtml.addToCart.fail(data);
					return false;
				}
				setTimeout(sgOneKeyHtml.addToCart.success(data),10);
			}
		}
	},
	/* 运输方式 */
	shipType : {
		/* 显示界面 */
		show : function(){
			itemData.init();
			if(false === check_selected.check()) return false;
			this.init();
			$('#sg_bg, #sg_shippingType').fadeIn();
		},
		/* 关闭 */
		close : function(){
			sgData.item.shipping = '';
			$('#sg_bg, #sg_shippingType').fadeOut();
		},
		/* 确认 */
		confirm : function(){
			if(sgCountry=="Singapore" && 0){
				var checkedShipTyle = $('.shiptype .hover');
				if( checkedShipTyle.length==0 ){
					alert('Please select shipping method.');
					return false;
				}
				sgData.item.shipping = checkedShipTyle.attr('shiptypeindex');
			}
			if($('[name=bargain]').val() <=0||$('[name=express]').val()<0||$('[name=number]').val()<=0){
				alert('Please fill in goods information correctly.');
				return false;
			}
			/* 获取顾客在弹出层填写的数据 - 开始 */
			sgData.item.remak = $('#remark').val();
			sgData.item.bargain = $('[name=bargain]').val() || sgData.item.bargain;
			sgData.item.express = $('[name=express]').val()>=0 ? $('[name=express]').val() : sgData.item.bargain;
			sgData.item.number = $('[name=number]').val() || sgData.item.number;
			sgData.item.currency = $('[name=currency]').val();
			/* 获取顾客在弹出层填写的数据 - 结束 */
			sgData.goods.add();
		},
		/* 初始化 */
		init : function(){
			$('#sg_shippingType').remove();
			this.data.item = sgData.item;
			if(parseFloat(sgData.item.bargain) == 0){
				this.data.item.bargain =  sgData.item.price;
			}
			if(this.getCountry()!=''&& $.inArray(this.getCountry(), countryArr)!=-1){//如果cookie有值并且是马来西亚或者新加坡  变量赋值
				sgCountry=this.getCountry();
			}
			
			//设置默认国家，不进行选择
			if (defaultCountry.length > 0)
			{
				sgCountry = defaultCountry;
			}
			
			if(sgCountry!=''&& $.inArray(sgCountry, countryArr)!=-1){//检查变量是否是新加坡或者马来西亚
				this.data.sgcountry=sgCountry;//赋值国家
				this.data.unit=itemData.item.unit[sgCountry];//赋值货币单位
				sgTransform.exchangeRate();
				sgOneKeyHtml.box.show( baidu.template(this.html(), this.data), 'Shipping Method');
				$('.goods_attrib input[onchange]').change();
			}else{
				sgOneKeyHtml.box.show( this.chtml , 'Please select your Country!');
			}
		},
		/*存储国家cookie*/
		saveCountry : function( val,isCookie ){
			sgCountry = val;
			if(isCookie)
				sgcookie.set('sgCountry',sgCountry);
			else
				sgcookie.del('sgCountry');
			this.init();
		},
		/* 获取保存的国家信息*/
		getCountry : function(){
			return sgcookie.get('sgCountry');
		},
		/*重新选择国家*/
		delCountry : function( val,isCookie ){
			sgCountry = null;
			sgcookie.del('sgCountry');
			sgTransform.rate='';//清除国家的时候同事清除混率
			this.init();
		},
		/* HTML数据 */
		html : sgOneKeyHtml.shipType,
		/* 选择国家的html*/
		chtml : sgOneKeyHtml.selectCountry(),
		/* 百度模版引擎所需数据，用于动态显示 */
		data : {
			title : 'Default mode of transport',
			shipType : [ [1,'Express Air',], [2,'Economy Air'], [3,'Special Air'], [4,'Sea Shipping'], [5,'Economy Sea']],
			sgcountry: [],
		}
	},
	/* 数据来源 */
	source : function(){
		var hostname = location.hostname.split('.');
		return hostname[hostname.length-2] || false;
	}
};

/**
 * cookie操作
 */
 var sgcookie={
		 set: function (name,value)
				 {
					 var Days = 30;
					 var exp = new Date(); 
					 exp.setTime(exp.getTime() + Days*24*60*60*1000);
					 document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
				 },
		 //读取cookies
		get: function (name)
			 {
				 var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
				 if(arr=document.cookie.match(reg)) return unescape(arr[2]);
				 else return null;
			 },
		 //删除cookies
		 del:function (name)
			 {
				 var exp = new Date();
				 exp.setTime(exp.getTime() - 1);
				 var cval=this.get(name);
				 if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
			 }
 };
/**
 * 检查是否选择商品属性
 */
var check_selected = {
		/* 检测淘宝 */
		'item_taobao_com' : function(){
			var result = true;
			
			var selectedData = [];
			var tbattention = $('#J_isku');
			itemData.item.item.p_url = window.location.href;
			itemData.item.item.p_title = $.trim($('#J_Title').find('h3').text());
			itemData.item.item.pic = $('#J_ImgBooth').attr('src');
			itemData.item.item.bargain = sgData.item.bargain ? sgData.item.bargain : $('#J_PromoPriceNum').text();
			itemData.item.item.number = sgData.item.number ? sgData.item.number : $('#J_IptAmount').val();
			itemData.item.item.express = sgData.item.express ? sgData.item.express : 0;
			
			var seller = $.trim($(".tb-shop-name").find('a').text());
			if (seller.length)
			{
				itemData.item.item.seller = seller;
			}
			else
			{
				itemData.item.item.seller = $.trim($('.J_TSummaryPopup').find('.pop-shop-name').find('.shop-name-title').text());
			}

			var prop_list = '';
			var tbselected = '';
			var parent_prop = '';
			var prop_name = '';
			var prop_id = '';
			$('.J_TSaleProp').each(function(key, value){
				tbselected = $(this).find('.tb-selected');
				if(tbselected.length==1){
					prop_name = tbselected.find('span').text();
					prop_id = tbselected.attr('data-value');
					selectedData.push(prop_name);
					selectedData.push(prop_id);
					parent_prop = $(this).parent().parent();
					if (0 == key)
					{
						prop_list += (parent_prop.find('.tb-property-type').text() + ':' + prop_name);
					}
					else
					{
						prop_list += ('<br />' + parent_prop.find('.tb-property-type').text() + ':' + prop_name);
					}
				}else{
					result = false;
				}
			});
			
			itemData.item.item.prop_list = prop_list;
			
			if(false === result){
				tbattention.addClass('tb-attention');
				return false;
			}else{
				tbattention.removeClass('tb-attention');
				return selectedData;
			}
		},
		/* 检测国际淘宝 */
		'world_taobao_com' : function(){
			var result = true;
			
			var selectedData = [];
			var tbattention = $('#J_isSku');
			var goods_price = $('#J_PromoPrice').find('strong').text().substr(1);
			if (!goods_price.length)
			{
				goods_price = $('#J_priceStd').find('strong span').text();
			}

			itemData.item.item.p_url = window.location.href;
			itemData.item.item.p_title = $.trim($('#J_Title').find('h3').find('.t-title').text());
			itemData.item.item.pic = $('#J_ThumbView').attr('src');
			itemData.item.item.bargain = sgData.item.bargain ? sgData.item.bargain : goods_price;
			itemData.item.item.number = sgData.item.number ? sgData.item.number : $('#J_IptAmount').val();
			itemData.item.item.express = sgData.item.express ? sgData.item.express : 0;
			
			var seller = $.trim($(".tb-shop-name").find('a').text());
			if (seller.length)
			{
				itemData.item.item.seller = seller;
			}
			else
			{
				itemData.item.item.seller = $.trim($('.J_TSummaryPopup').find('.pop-shop-name').find('.shop-name-title').text());
			}

			var prop_list = '';
			var tbselected = '';
			var parent_prop = '';
			var prop_name = '';
			var prop_id = '';
			$('#J_SKU dl').each(function(key, value){
				tbselected = $(this).find('.tb-selected');
				if(tbselected.length==1){
					prop_name = tbselected.find('span').text();
					prop_id = tbselected.attr('data-pv');
					selectedData.push(prop_name);
					selectedData.push(prop_id);
					parent_prop = $(this);
					if (0 == key)
					{
						prop_list += (parent_prop.find('dt').text() + ':' + prop_name);
					}
					else
					{
						prop_list += ('<br />' + parent_prop.find('dt').text() + ':' + prop_name);
					}
				}else{
					result = false;
				}
			});
			
			itemData.item.item.prop_list = prop_list;
			
			if(false === result){
				tbattention.addClass('tb-isSku-show');
				return false;
			}else{
				tbattention.removeClass('tb-isSku-show');
				return selectedData;
			}
		},
		/* 检测天猫 */
		'detail_tmall_com' : function(){
			var result = true;
			
			var selectedData = [];
			var tbattention = $('#J_isku');
			itemData.item.item.p_url = window.location.href;
			itemData.item.item.p_title = $.trim($('.tb-detail-hd').find('h1').text());
			itemData.item.item.pic = $('#J_ImgBooth').attr('src');
			itemData.item.item.seller = $.trim($('.slogo-shopname').find('strong').text());
			itemData.item.item.bargain = sgData.item.bargain ? sgData.item.bargain : $('#J_PromoPrice .tm-price').text();
			itemData.item.item.number = sgData.item.number ? sgData.item.number : $('.mui-amount-input').val();
			itemData.item.item.express = sgData.item.express ? sgData.item.express : 0;

			var prop_list = '';
			var tbselected = '';
			var parent_prop = '';
			var prop_name = '';
			var prop_id = '';
			$('.J_TSaleProp').each(function(key, value){
				tbselected = $(this).find('.tb-selected');
				if(tbselected.length==1){
					prop_name = tbselected.find('span').text();
					prop_id = tbselected.attr('data-value');
					selectedData.push(prop_name);
					selectedData.push(prop_id);
					parent_prop = $(this).parent().parent();
					if (0 == key)
					{
						prop_list += (parent_prop.find('.tb-metatit').text() + ':' + prop_name);
					}
					else
					{
						prop_list += ('<br />' + parent_prop.find('.tb-metatit').text() + ':' + prop_name);
					}
				}else{
					result = false;
				}
			});
			
			itemData.item.item.prop_list = prop_list;

			if(false === result){
				if(KISSY.one('#J_LinkBasket')) KISSY.one('#J_LinkBasket').fireHandler('click');
				$('.tb-action>.sg_addto').css({'margin':'0px 10px'}).find('b').css({'margin':'9px 33px'});
				$('#J_DetailMeta b.J_PanelCloser').live('click', function(){
					$('.tb-action>.sg_addto').css({'margin':'10px 10px 0 0'}).find('b').css({'margin':'10px 33px'});
				});
				return false;
			}else{
				if(KISSY.one('#J_DetailMeta b.J_PanelCloser')) KISSY.one('#J_DetailMeta b.J_PanelCloser').fireHandler('click');
				$('#J_DetailMeta b.J_PanelCloser').click();
				return selectedData;
			}
		},
		/* 检测国际天猫 */
		'world_tmall_com' : function(){
			var result = true;
			
			var selectedData = [];
			var tbattention = $('#J_isku');
			itemData.item.item.p_url = window.location.href;
			itemData.item.item.p_title = $.trim($('.tb-detail-hd').find('h1').text());
			itemData.item.item.pic = $('#J_ImgBooth').attr('src');
			itemData.item.item.seller = $.trim($('#J_HdShopInfo .hd-shop-name').find('a').text());
			itemData.item.item.bargain = sgData.item.bargain ? sgData.item.bargain : $('#J_PromoPrice .tm-price').text();
			itemData.item.item.number = sgData.item.number ? sgData.item.number : $('.mui-amount-input').val();
			itemData.item.item.express = sgData.item.express ? sgData.item.express : 0;

			var prop_list = '';
			var tbselected = '';
			var parent_prop = '';
			var prop_name = '';
			var prop_id = '';
			$('.J_TSaleProp').each(function(key, value){
				tbselected = $(this).find('.tb-selected');
				if(tbselected.length==1){
					prop_name = tbselected.find('span').text();
					prop_id = tbselected.attr('data-value');
					selectedData.push(prop_name);
					selectedData.push(prop_id);
					parent_prop = $(this).parent().parent();
					if (0 == key)
					{
						prop_list += (parent_prop.find('.tb-metatit').text() + ':' + prop_name);
					}
					else
					{
						prop_list += ('<br />' + parent_prop.find('.tb-metatit').text() + ':' + prop_name);
					}
				}else{
					result = false;
				}
			});
			
			itemData.item.item.prop_list = prop_list;

			if(false === result){
				if(KISSY.one('#J_LinkBasket')) KISSY.one('#J_LinkBasket').fireHandler('click');
				$('.tb-action>.sg_addto').css({'margin':'0px 10px 0px 90px'}).find('b').css({'margin':'9px 33px'});
				$('#J_DetailMeta b.J_PanelCloser').live('click', function(){
					$('.tb-action>.sg_addto').css({'margin':'50px 10px 0 0'}).find('b').css({'margin':'10px 33px'});
				});
				return false;
			}else{
				if(KISSY.one('#J_DetailMeta b.J_PanelCloser')) KISSY.one('#J_DetailMeta b.J_PanelCloser').fireHandler('click');
				$('#J_DetailMeta b.J_PanelCloser').click();
				return selectedData;
			}
		},
		/* 95095 医药 */
		'detail_yao_95095_com' : function (){return check_selected.detail_tmall_com();},
		/* 检测京东 */
		'item_jd_com' :  function(){
			var selectedData = [];
			
			/* 默认都会选中 */
			$('#choose .item.selected>a').each(function(){
					selectedData.push( $(this).text() );
			});

			return selectedData;
		},
		/* 检测当当 */
		'product_dangdang_com' :  function(){
			var result = true;
			
			var selectedData = [];
			var P_ItemValue = false;

			/* 调用当当自带检测方法 */
			var check = function(){
				if( typeof(P_BOX) === 'object' ){
					P_ItemValue = ItemValue || P_BOX.getSelectedValue();
					var stockstatu=$('#color_size').attr("stockstatu");
					if( P_ItemValue.selectValue=='' || stockstatu==0 ){
						return false;
					}
				}
				return true;
			};
			
			result = check();
			
			if(true === result){
				$.each(P_ItemValue,function(k,v){
					v && selectedData.push( v );
				});
				selectedData.pop();
			}
			
			if(false === result){
				if( typeof(addToCart) === 'function' ) addToCart();
				return false;
			}else{
				return selectedData;
			}
		},
		/* 检测拍拍 */
		'auction1_paipai_com' :  function(){
			var selectedData = [];
			
			/* 调用拍拍自带检测方法 */
			var check = function(){
				if (window.stocker) {
					if (!window.stocker.check1()) {
						$("#pp_twoBarCode").hide();
						$(".pp_prop_key_errtips").show();
						$(".pp_prop_key").addClass("pp_prop_key_err");
						return false;
					}
				}
			};
			result = check();
			
			if(false !== result){
				$('#buyArea .pp_prop_attr').each(function(){
					var ppselect = $(this).find('.pp_select');
					if(ppselect.length==1){
						selectedData.push( ppselect.attr('attrvalue') );
					}else{
						result = false;
					}
				});
			}

			return (false === result)?false:selectedData;
		},
		/* 检测麦包包 */
		'www_mbaobao_com' :  function(){
			var selectedData = [];
			
			/* 默认都会选中 */
			$('.goods-choose').each(function(){
				selectedData.push( $(this).find('.choose-now a').attr('title') );
			});

			return selectedData;
		},
		/* 检测亚马逊 */
		'www_amazon_cn' :  function(){
			var selectedData = [];
			
			/* 单一选项 */
			var zselect = $('#tmmSwatches').text().replace(/\s*/g,'');
			if(zselect){
				selectedData.push( zselect );
			}
			
			/* 多个选项 */
			$('#twister .a-section .selection').each(function(){
				zselect = $(this).text();
				if(zselect){
					selectedData.push( zselect );
				}
			});

			return selectedData;
		},
		/* 检查主方法 */
		check : function(){
			var fun = eval('this.'+location.host.split('.').join('_'));
			if( typeof(fun) == 'function' ){
				var selectedData = false;
				try{
					selectedData = fun();
				}catch(e){
					/* 提示异常信息 */
					sgOneKeyHtml.box.show('<p>We need your assistance, could you please contact us with the error information? Appreciate it.</p><small><i>'+xor_encode(e.toString())+'</i></small>','Oh, Sorry!');
				}
				if( false === selectedData ) return false;

				//支持3种属性
				itemData.item.item.color = selectedData.shift();
				itemData.item.item.color_id = selectedData.shift();
				itemData.item.item.size = selectedData.shift();
				itemData.item.item.size_id = selectedData.shift();
				if (selectedData)
				{
					itemData.item.item.specification = selectedData.shift();
					itemData.item.item.specification_id = selectedData.shift();
				}
				/*itemData.item.item.size = selectedData.join(',');*/
			}else{
				return false;
			}
		}
};

/**
 * 数据转换  
 */
var sgTransform = {
	/* 汇率 */
	rate:'',
	exchangeRate: function(){
		var url=getsgUrl('website');
		if(this.rate==''){
			$.getScript(url + '?f=onekey&callback=sgTransform.exchangeRateCallback&getRate='+itemData.item.unit[sgCountry]);
		}else{
			return;
		}
	},
	exchangeRateCallback :function(data){//
		if (1 == data.ret)
		{
			this.rate=data.rate;
			$('.goods_attrib input[onchange]').change();//刷新价格
			return true;
		}
		else
		{
			sgOneKeyHtml.addToCart.fail(data);
			return false;
		}
		
	},
	/* 转换价格 */
	price : function(price){
		price = price || 0;
		return (price/this.rate).toFixed(2) || 0;
	}
};

/**
 * 添加按钮
 */
var addButton = {
	/* 添加 添加到购物车 按钮 */
	add : function(){
		if($('.sg_addto').length>0) return true;
		var T = this;
		var data = false;
		var host = T.getHost();
		if( host && (data=T.data[host]) ){
			$.each(data.select, function(selectk, selectv){
				var html = $(T.html);
				$.each(data.css[selectk], function(cssk, cssv){
				    if(cssk == 0){
				        html.css(cssv);
				    }else{
				        html.find(cssk).css(cssv);
				    }
				});
				$(selectv).after(html);
			});
			if(typeof(data.script) === 'function'){
				data.script();
			}
			return true;
		}else{ return false; }
	},
	/* 对应网站的按钮添加选择器以及对应css */
	data : {
		taobao : {
			select : ['#J_juValid .tb-btn-add', '#J_SureContinue'],
			css : [
				{ 0 : {'margin-left': '8px'}, b : {'margin': '10px'} },
				{ 0 : {'margin': '0 5px', 'width': 'auto', 'background': '#f47a20'}, b : {'margin': '5px'} }
			]
		},
		world_taobao : {
			select : ['#J_box_buycart .tb-btn-addcart', '.J_isSku_confirm'],
			css : [
				{ 0 : {'margin-top': '8px'}, b : {'margin': '11px 33px'} },
				{ 0 : {'margin': '0 5px', 'width': 'auto', 'background': '#f47a20', 'position': 'absolute'}, b : {'margin': '9px'} }
			]
		},
		tmall : {
			select : ['.tb-btn-basket.tb-btn-sku'],
			css : [
				{ 0 : {'margin': '45px 0px 0px 0px', 'position': 'absolute', 'display': 'block'}, b : {'margin': '11px 33px'} }
			],
			script: function(){
				$('#J_TMMultiPoints').remove();				
			}
		},
		world_tmall : {
			select : ['.tb-btn-basket.tb-btn-sku'],
			css : [
				{ 0 : {'margin-top': '45px', 'position': 'absolute', 'display': 'block'}, b : {'margin': '11px 33px'} }
			],
			script: function(){
				$('#J_TMMultiPoints').remove();				
			}
		},
		95095 : {
			select : ['.tb-btn-basket.tb-btn-sku'],
			css : [
				{ 0 : {margin: '10px 10px 0 0'}, b : {'margin': '10px 33px'} }
			]
		},
		paipai : {
			select : ['#pfhlkd_buycar'],
			css : [
				{ 0 : {'margin-top': '15px'}, b : {'margin': '15px 28px'} }
			]
		},
		jd : {
			select : ['#choose-btn-append'],
			css : [
				{ 0 : {'display': 'inline-block', 'float': 'left', 'margin': '8px 8px 0 0'}, b : {'margin': '9px'} }
			]
		},
		mbaobao : {
			select : ['.goods-btn-buy'],
			css : [
				{ 0 : {'display': 'inline-block', 'margin': '0 10px', 'float': 'left'}, b : {'margin': '11px 30px'} }
			]
		},
		amazon : {
			select : ['.a-button-stack:eq(0)'],
			css : [
				{ 0 : {'margin': '5px 0', 'width': '100%', 'text-align': 'center'}, b : {'margin': '6px 0', 'display': 'inline-block'} }
			]
		},
		dangdang : {
			select : ['#color_size>div:last', '[name=operation_pub]>div:last'],
			css : [
				{ 0 : {'margin-left': '55px'}, b : {'margin': '8px 3px'} },
				{ 0 : {'margin-left': '60px'}, b : {'margin': '8px 3px'} }
			]
		}
	},
	/* 获取当前网站名称 */
	getHost : function(){
		var host = location.host.split('.');
		//添加world.taobao
		if (location.host.indexOf('world.taobao') >= 0)	{
			return 'world_taobao';
		} else if (location.host.indexOf('world.tmall') >= 0) {
			return 'world_tmall';
		}
		return host[host.length-2] || host[host.length-1];
	},
	/* 按钮HTML */
	html : '<a class="sg_addto" href="javascript:void(0);" onclick="sgData.shipType.show()"><b>&nbsp;</b></a>'
};

/* 主方法开始 */
var onekeyRun = function(){
	/* 设置所有ajax的 数据类型都为 jsonp， 请求方式都为 get */
	$.ajaxSetup({dataType:'jsonp',type:'get'});
	
	/* 初始化商品数据处理对象，默认会拉取对应的数据采集规则并执行一次 */
	itemData.init();
	
	/* 设置每200毫秒矫正弹出层位置 */
	setInterval(sgOneKeyHtml.resetBoxSize,200);
	
	/* 加载CSS */
	$('body').append('<link rel="stylesheet" type="text/css" href="//tool.onebound.cn/ShopTool/chrome/comm/css/onekey.css" />');
	$('body').append('<link rel="stylesheet" type="text/css" href="//tool.onebound.cn/ShopTool/chrome/'+sitename+'/webnew.css" />');
	
	/* 加载背景半透明层 */
	if($('#sg_bg').length==0) $('body').append('<div id="sg_bg"></div>');
	
	/* 设置每两秒检测一下添加到购物车按钮，没有则添加上 */
	setInterval(function(){addButton.add.apply(addButton);},2000);
	
	/* 阻止空链接的默认点击事件 */
	$('a[href=#]').live('click',function(event){
		event.preventDefault();
	});
	
	/* 运输方式选择同类互斥 */
	$('.shiptype a').live('click',function(){
		$(this).addClass('hover').siblings().removeClass('hover');
	});
};

/**
 * 异或加密
 * @param text 文本
 * @param m 密码
 */
function xor_encode(text,m){
	var last = "";
	var m = m || '-_-!';
	for(var i=0;i<text.length;i++){
		var text2 = '';
		for(var j=0;j<m.length;j++){
			var key = m.charCodeAt(j);
			text2 = text.charCodeAt(i) ^ key;
		}
		last += String.fromCharCode(text2);
	}
	return last;
}

try{
	onekeyRun();
}catch(e){
	var sgScript = document.getElementById('sgScript');
	if(sgScript) eval(sgScript.innerHTML);
}