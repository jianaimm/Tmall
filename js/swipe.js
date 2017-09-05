(function(){
	var wrap = document.querySelector('#wrap');
	var scroll = document.querySelector('#scroll');
	var start = {x: 0,y: 0};
	var elY = 0;
	var lastTime = 0;
	var lastSpeed = 0;
	var lastPointY = 0;
	var max = 0;
	var min = wrap.clientHeight - scroll.offsetHeight;
	var isMove = true;
	var isFirst = true;
	css(scroll,'translateY',0);
	css(scroll,'translateZ',0.01);
	var F = .3;//拉力系数；
	var wrapH = css(wrap,'height');
	wrap.addEventListener('touchstart',function(e){
		var touch = e.changedTouches[0];
		start = {x: touch.pageX,y: touch.pageY};
		elY = css(scroll,'translateY');
		lastSpeed = 0;
		lastPointY = start.y;
		lastTime = Date.now();
		isMove = true;
		isFirst = true;
	});
	wrap.addEventListener('touchmove',function(e){
		if(!isMove){
			return;
		}
		var touch = e.changedTouches[0];
		var dis = {x: touch.pageX-start.x,y: touch.pageY-start.y};
		if(isFirst){
			isFirst = false;
			if(Math.abs(dis.x) > Math.abs(dis.y)){
				isMove = false;
				return;
			}
		}
		var translate = dis.y + elY;
		if(translate > max){
			var over = translate - max;
			F = 1 - Math.abs(over/wrapH);
			translate = over*F + max;
		} else if(translate < min) {
			var over = translate - min;
			F = 1 - Math.abs(over/wrapH);
			translate = over*F + min;
		}
		css(scroll,'translateY',translate);
		var nowTime = Date.now();
		lastSpeed = Math.abs(touch.pageY - lastPointY) / (nowTime - lastTime);
		lastTime = nowTime;
		lastPointY = touch.pageY;
	});
	wrap.addEventListener('touchend',function(e){
		if(!isMove){
			return;
		}
		if(Date.now() - lastTime > 100){
			lastSpeed = 0;
		}
		var time = 170;
		var maxDis = 1200;
		var distance = lastSpeed*time;
		distance = distance > maxDis ? maxDis*(distance/Math.abs(distance)) : distance;
		distance = isNaN(distance) ? 0 : distance;
		var target = distance + css(scroll,'translateY');
		var type = 'easeOutStrong';
		if(target > max){
			target = max;
			type = 'backOut';
		} else if(target < min){
			target = min;
			type = 'backOut';
		}
		time = Math.abs(target-css(scroll,'translateY'))*1.5;
		startMove({
			el: scroll,
			target: {
				translateY: target
			},
			time: time,
			type: type
		});
	});
})();
