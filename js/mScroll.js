/*
init: {
	wrap: el, 滑动区域
	//scroll: el, 移动的元素 (一般移动的元素wrap.chilren[0])
	[dir:('x'|'y')] dir 滑动方向默认为Y默认y
	over: "ease","backOut","none" 超出之后，需要怎么处理(ease：平滑回来，backOut：回弹，none:不允许超出)
	showBar: (true||false) 是否显示滚动条,默认值为true
	start:fn 按下时的回调
	move: fn 移动时的回调
	up: fn 抬起时的回调
	end: fn 动画结束时的回调 
}
*/
function mScroll(init){
	var IN = { //配置默认参数
		dir: "y",
		over: "backOut",
		showBar: true
	};
	//如果调用时设置了这些参数，就覆盖掉默认参数；
	for(var s in init){
		IN[s] = init[s];
	}
	IN.scroll = IN.wrap.children[0];//被滑动的元素
	var startPoint = {};//初始手指位置
	var startElOffset = {};//初始元素位置
	var lastSpeed = 0;
	var lastTime = 0;
	var lastP = 0;
	var bar;
	var scale = 1;
	var MaxT = {//最大位移距离；
		x:0,
		y:0
	};
	var MinT = {//最小位移距离；
		x:0,
		y:0
	};
	var F = .3;//拉力系数
	var isFrist = true;//是否是第一次滑动；
	var isMove = true;//是否是符合我们要求的方向
	var MoveType = "easeOutStrong";//动画形式
	css(IN.scroll,"translateX",0);//先设置，才可以获取；
	css(IN.scroll,"translateY",0);
	css(IN.scroll,"translateZ",.01);
	
	//不能让内容比父级高度(宽度)小，会出问题
	IN.scroll.style.minHeight = "100%";
	IN.scroll.style.minWidth = "100%";

	if(IN.showBar){
		//生成滚动条；
		bar = document.createElement("div");
		bar.className = "bar";
		if(getComputedStyle(IN.wrap)["position"] == "static"){
			//如果父级wrap没有定位，就给它加相对定位；
			IN.wrap.style.position = "relative";
		}
		bar.style.cssText = "position:absolute;background:rgba(0,0,0,.4);border-radius:3px;transition:.6s opacity;opacity:0;";
		if(IN.dir == "x"){//横向滑动时，滚动条样式设置；
			bar.style.cssText += "height:6px;left:0;bottom:0;";
			scale = IN.wrap.clientWidth/IN.scroll.offsetWidth;
			bar.style.width = IN.wrap.clientWidth * scale + "px";
		} else {//竖屏滑动时，滚动条样式设置；
			bar.style.cssText += "width:6px;right:0;top:0;";
			scale = IN.wrap.clientHeight/IN.scroll.offsetHeight;
			bar.style.height = IN.wrap.clientHeight * scale + "px";
		}
		IN.wrap.appendChild(bar);//把滚动条加到页面里；
	}
	IN.wrap.addEventListener('touchstart', function(e) {
		clearInterval(IN.scroll.timer);//关闭定时器动画；
		IN.start&&IN.start();//判断如果传入的有start函数，就执行它；
		var touch = e.changedTouches[0];
		startPoint = {
			x: touch.pageX,
			y: touch.pageY
		}
		startElOffset = getScroll(); //获取初始元素位置；
		MinT = {
			x: IN.wrap.clientWidth - IN.scroll.offsetWidth,
			y: IN.wrap.clientHeight - IN.scroll.offsetHeight
		};
		lastSpeed = 0;
		lastTime = Date.now();
		//判断lastP，如果方向为x,就把.x赋值给它，否则把.y赋值给它；
		lastP = IN.dir == "x"?startPoint.x:startPoint.y;
		isFrist = true;
		isMove = true;
	});
	IN.wrap.addEventListener('touchmove', function(e) {
		if(!isMove){//如果方向不符合我们的滑动设置，就终止；
			return;
		}
		var touch = e.changedTouches[0];
		var nowPoint = {
			x: touch.pageX,
			y: touch.pageY
		};
		var dis = {
			x: nowPoint.x - startPoint.x,
			y: nowPoint.y - startPoint.y
		};
		if(isFrist){//判断是第一次移动，就比较滑动方向与我们设置得dir方向是否一致，不一致就终止；
			isFrist = false;
			//第一次移动的时候
			if(Math.abs(dis.x) > Math.abs(dis.y)){
				if(IN.dir == "y"){
					isMove = false;
					return;
				}
			} else {
				if(IN.dir == "x"){
					isMove = false;
					return;
				}
			}
			//按照我们要求在移动的时候，再去显示滚动条
			bar&&(css(bar,"opacity",1));
		}
		var nowTime = Date.now();
		//同理，nowP，也根据dir方向来赋值；
		var nowP = IN.dir == "x"?nowPoint.x:nowPoint.y;
		var traslate = {
			x: dis.x + startElOffset.x,
			y: dis.y + startElOffset.y
		}
		//判断如果传入的超出距离动画是none，即 不允许超出时，translate的值；
		if(IN.over == "none"){
			traslate[IN.dir] = Math.min(traslate[IN.dir],MaxT[IN.dir]); 
			traslate[IN.dir] = Math.max(traslate[IN.dir],MinT[IN.dir]); 
		} else if(IN.over == "ease"||IN.over == "backOut"){
			//判断如果传入的超出距离动画是ease,backOut，即 缓冲或者回弹时，translate的值；
			if(traslate[IN.dir] > MaxT[IN.dir]){
				traslate[IN.dir] *= F;
			} else if(traslate[IN.dir] < MinT[IN.dir]) {
				var over = traslate[IN.dir] - MinT[IN.dir];
				over *= F;
				traslate[IN.dir] = MinT[IN.dir] + over;
			}
		}
		//根据方向，设置元素移动的样式位置；
		if(IN.dir == "x")
		{
			css(IN.scroll,"translateX",traslate.x);

		} else {
			css(IN.scroll,"translateY",traslate.y);
		}
		//滚动条bar存在，就按照方向dir来设置滚动条位置；左右滑动，是left值改变，上下滑动是top值改变；
		bar&&(css(bar,IN.dir == "x"?"left":"top",-traslate[IN.dir]*scale));
		lastSpeed = (nowP - lastP)/(nowTime - lastTime);
		lastTime = nowTime;
		lastP = nowP;
		IN.move&&IN.move();//如果传入的有move函数，就执行move函数；
	});
	IN.wrap.addEventListener('touchend', function(e) {
		if(!isMove){//如果方向不符合我们的滑动设置，就终止；
			return;
		}
		if(Date.now()-lastTime > 100){//如果抬起时间与最后一次移动时间相差超过100ms,我们就认定用户停留在一个地方，那么我们就不需要让页面滑动，保持在原处就可以了，因此把lastSpeed=0，滑动距离也就为0；
			lastSpeed = 0;
		}
		console.log(lastSpeed);
		lastSpeed = Number(lastSpeed)?lastSpeed:0;//？？
		var time = 120;
		var dis = lastSpeed*time;
		var target = getScroll()[IN.dir] + dis;

		// 目标过界限制
		if(IN.over == "backOut"
		 &&(target > MaxT[IN.dir]||target < MinT[IN.dir])){
		 	MoveType = "backOut";
		} else {
			MoveType = "easeOutStrong";
		}
		target = Math.min(MaxT[IN.dir],target);
		target = Math.max(MinT[IN.dir],target);
		//重置滑动时间
		time = Math.abs(target - getScroll()[IN.dir])*1.7;

		target = (IN.dir == "x"?{translateX:target}:{translateY:target});

		startMove({
			el: IN.scroll,
			target:target,
			time:time,
			type: MoveType,
			callBack: function(){
				bar&&(css(bar,"opacity",0));
				IN.end&&IN.end();//如果传入的有end函数，就在动画结束后执行end函数；
			},
			callIn: function(){
				var traslate = getScroll();
				bar&&(css(bar,IN.dir == "x"?"left":"top",-traslate[IN.dir]*scale));
				IN.move&&IN.move();//如果传入的有move函数，就在callIn里同时执行move函数，因为滚动条也需要动画效果；
			}
		});
		IN.up&&IN.up();//如果传入的有up函数，就在鼠标抬起时执行up函数
	});
	function getScroll(){ //获取当前的滚动位置
		return {x:css(IN.scroll,"translateX"),y:css(IN.scroll,"translateY")};
	}
}