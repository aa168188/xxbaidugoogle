function getQueryString() {
	var url = location.search;
	var theRequest = new Object({});
	if (url.indexOf("?") !== -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
};

function getCookie(name) {
	var arr = document.cookie.split('; ');
	for (var i = 0; i < arr.length; i++) {
		var temp = arr[i].split('=');
		if (temp[0] == name) {
			return temp[1]
		}
	}
	return ''
};

function urlParams(url, obj) {
	var result = '';
	var item;
	var splitArr = url.split('?');
	// 只取链接中最后一个? 后面的参数
	var search = splitArr.length > 1 ? (splitArr.pop() || ''): '';
	var mainUrl = splitArr.join('?');
	var searchObj = search.replace(/\?/g, '&').split('&').reduce(function (prev, curr) {
		var key = curr.split('=')[0]
		var val = curr.split('=')[1]
		if(val !== undefined){
			prev[key] = val
		}
		return prev
	}, {})
	var newObj = Object.assign({}, searchObj, obj)
	var i = 0
	for (item in newObj) {
		if(newObj[item] !== undefined){
			result += `${i === 0 ? '?': '&'}${item}=${unescape(newObj[item])}`;
			i++
		}
	}
	return mainUrl + result;
}

var CODE = '';
var wordid = +getQueryString().wordId || 111;
var cyid = +getQueryString().creativeid || 111;
var k = 'v_' + wordid + '_' + cyid;
var waitFlag = false;
var waitTimes = 0;
var qhclickid = getQueryString().qhclickid;
var bd_vid = getQueryString().bd_vid;
// 是否为按钮点击下载
var isBtnClick = 0;
function wait(callback) {
	if (CODE !== '' || waitTimes > 3) {
		callback()
		return
	}
	if (waitFlag) return;
	waitFlag = true
	waitTimes++
	setTimeout(function () {
		waitFlag = false
		if (CODE !== '') {
			callback()
		} else {
			wait(callback)
		}
	}, 300)
}

var failCount = 0;

function getCode() {
	if (!TOKEN) {
		CODE = wordid
		return
	}
	var _data = {
		token: TOKEN,
		wordid: wordid,
		cyid: cyid,
	}
	// 如果有qhclickid获取code每次都需要重新获取
	if(qhclickid){
		_data.clickid = qhclickid + ''
	}else if(bd_vid){
		_data.clickid = bd_vid + ''
	}else{
		_data.code = $.cookie(k) || ''
	}
	$.ajax({
		url: '//ct.zeifeng.cn/code',
		type: 'GET',
		dataType: 'JSON',
		data: _data,
		success: function (res) {
			var expireTime = new Date()
			var diff = moment(moment().add(1, 'day').format('YYYY-MM-DD 00:00:00')).valueOf() - expireTime.getTime()
			expireTime.setTime(expireTime.getTime() + diff)
			if (res.code === 200) {
				CODE = res.data
				$.cookie(k, CODE, {expires: expireTime, path: '/'})
			} else {
				if (failCount > 2) return;
				failCount++;
				getCode()
			}
		}
	})
}

function t() {
	var img = new Image()
	var clickid = '';
	if(qhclickid){
		clickid = qhclickid + '';
	}else if(bd_vid){
		clickid = bd_vid + '';
	}
	img.src = '//ct.zeifeng.cn/store.gif?token=' + TOKEN + '&wordid=' + wordid + '&cyid=' + cyid + '&code=' + CODE + '&clickid='+ clickid + '&is_btn='+ isBtnClick;
	img = null
}
function _d() {
	if (realUrl.indexOf('Gogo') !== -1 || realUrl.indexOf('static-box.steamboxs.com') !== -1) {
		var href = location.href
		href = urlParams(href, { wordId: CODE });
		$.post('https://api.steamboxs.com/api/vidEncode', {channel: 'baizhu', url: href}, function (res) {
			var vid_code = res.data.vid_code
			$.post('https://api.steamboxs.com/api/downloadV2', {url: realUrl, vid_code: vid_code}, function (res1) {
				var realDownloadUrl = res1.data.signedUrl
				window.open(realDownloadUrl, '_self')
			})
		})
	} else {
		window.open(realUrl, '_self')
	}
}
function tt() {
	if(realUrl.indexOf('tagid') !== -1){
		realUrl = urlParams(realUrl, { tagid: CODE })
	}
	realUrl = urlParams(realUrl, { bd_vid: getQueryString().bd_vid })
	realUrl = realUrl.replace(/(tagId\.exe)|(\-k(\d{1,}))/, function (match) {
		if(match.startsWith('-k')){
			return '-k'+ CODE
		}
		return CODE + '.exe'
	})
	t()
	_d()
}
