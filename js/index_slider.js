document.getElementById('wrap').addEventListener('touchstart',function(e){
	e.preventDefault();
});
//设置轮播图布局;
sliderLayout('#slider','.sliderList');
sliderLayout('.wrap','.food');
function sliderLayout(parent,el){
	var slider = document.querySelector(parent);
	var sliderList = slider.querySelector(el);
	var sliders = sliderList.children;
	var sliderW = slider.clientWidth;
	//再生成一组li;
	sliderList.innerHTML += sliderList.innerHTML;
	//通过style标签对更改sliderList的宽度，以及li的宽度；
	var style = document.createElement('style');
	style.innerHTML = el + ' li{width:'+sliderW+'px}';
	console.log(sliders.length);
	style.innerHTML += el +'{width:'+sliderW*sliders.length+'px}';
	document.body.appendChild(style);
};
//轮播图滑动；
sliderSwipe('#slider','.sliderList','#sliderImg a');
sliderSwipe('.wrap','.food');
function sliderSwipe(parent,el,imgs){
	clearInterval(timer);
	var slider = document.querySelector(parent);
	var sliderList = slider.querySelector(el);
	var sliderImg = imgs ? slider.querySelectorAll(imgs) : null;
	var sliders = sliderList.children;

	var now = 0;//记录当前滑到第几屏
	var timer = 0;//滑屏定时器
	var sliderW = css(slider,'width');
	css(sliderList,'translateX',0);
	if(sliderImg){
		css(sliderImg[0].parentNode,"translateZ",1);
		toTimer();//自动轮播
	}
	
	function toTimer(){
		timer = setInterval(function(){
			
			if(Math.abs(now) == sliders.length - 1){
				now = sliders.length/2 - 1;
				css(sliderList,'translateX',-now*sliderW);
			}
			now++;
			var target = now*sliderW
			startMove({
				el: sliderList,
				target: {
					translateX: -target
				},
				time: 500,
				type: 'easeOut'
			});
			if(sliderImg){
				for(var i = 0;i < sliderImg.length;i++){
					sliderImg[i].className = '';
				}
				sliderImg[now%sliderImg.length].className = 'active';
			}
			
		},2000);
	}
	
	function start(){
		clearInterval(timer);
		if(Math.abs(now) == 0){
			now = sliders.length/2;
		} else if(Math.abs(now) == sliders.length-1){
			now = sliders.length/2 - 1;
		}
		css(sliderList,'translateX',-now*sliderW);
	}

	function up(){
		if(sliderImg){
			toTimer();//自动轮播
		}

		var translate = css(sliderList,'translateX');
		now = -Math.round(translate/sliderW);
		var target = -now*sliderW;
		startMove({
			el: sliderList,
			target: {
				translateX: target
			},
			time: 500,
			type: 'easeOut'
		});
		
		if(sliderImg){
			for(var i = 0;i < sliderImg.length;i++){
				sliderImg[i].className = '';
			}
			sliderImg[now%sliderImg.length].className = 'active';
		}
		
	}
    mScroll({
        wrap: slider,
        dir: 'x',
        showBar: false,
        over: 'none',
        start: start,
        up: up
    });
};

//返回顶部；
(function(){
	var wrap = document.querySelector('#wrap');
	var scroll = document.querySelector('#scroll');
	var aside = document.querySelector('.aside');//返回顶部按钮
	var title = document.querySelector('.title');
	var navTop = title.offsetTop;
	var navHeight = title.offsetHeight;
	var pageT = navTop + navHeight;
	//判断上滑，下滑
		var isUp = false;
		var startPoint;
		var translate;
		
		translate = css(aside,'bottom');
		scroll.addEventListener('touchstart',function(e){
			startPoint = {
				x: e.changedTouches[0].pageX,
				y: e.changedTouches[0].pageY
			}
			
		});
		scroll.addEventListener('touchmove',touchMove);
		scroll.addEventListener('touchend',touchEnd);
		function touchMove(e){
			var nowPoint = {
				x: e.changedTouches[0].pageX,
				y: e.changedTouches[0].pageY
			}
			var dis = {
				x: nowPoint.x - startPoint.x,
				y: nowPoint.y - startPoint.y
			}
			if(dis.y < -20){//上滑,隐藏 返回顶部按钮
				isUp = true;
			}
			if(dis.y > 20){//下滑,显示 返回顶部按钮
				isUp = false;
			}
		}
		function touchEnd(e){
			var nowPoint = {
				x: e.changedTouches[0].pageX,
				y: e.changedTouches[0].pageY
			}
			var dis = {
				x: nowPoint.x - startPoint.x,
				y: nowPoint.y - startPoint.y
			}
			
			if(isUp && dis.y < -20){//上滑，隐藏返回顶部按钮
				startMove({
					el: aside,
					target: {
						bottom: translate
					},
					time: 500,
					type: 'easeOut'
				});
			}
			if(!isUp && dis.y > 20){//下滑,显示 返回顶部按钮
				startMove({
					el: aside,
					target: {
						bottom: -translate
					},
					time: 500,
					type: 'easeOut'
				});
				
			}
		}
	
	aside.addEventListener('touchstart',function(){
		startMove({
			el: scroll,
			target: {
				translateY: 0
			},
			time: 300,
			type: 'easeOut'
		})
	});

	
})();
