document.addEventListener('touchstart',function(e){
	e.preventDefault();
});
//设置轮播图布局;
(function(){
	var slider = document.querySelector('#slider');
	var sliderList = slider.querySelector('.sliderList');
	var sliders = sliderList.children;
	var sliderW = slider.clientWidth;
	//再生成一组li;
	sliderList.innerHTML += sliderList.innerHTML;
	//通过style标签对更改sliderList的宽度，以及li的宽度；
	var style = document.createElement('style');
	style.innerHTML = `.sliderList li {width:${sliderW}px}`;
	style.innerHTML += `.sliderList {width:${sliderW*sliders.length}px}`;
	document.body.appendChild(style);
})();
//轮播图滑动；
(function(){
	var slider = document.querySelector('#slider');
	var sliderList = slider.querySelector('.sliderList');
	var sliderImg = slider.querySelectorAll('#sliderImg a');
	var sliders = sliderList.children;
	mScroll({
		wrap: slider,
		dir: 'x',
		showBar: false,
		over: 'none',
		start: start,
		up: up
	});
	var now = 0;
	var sliderW = css(slider,'width');
	function start(){
		if(now == 0){
			now = sliderImg.length;
		} else if(now == sliders.length-1){
			now = sliderImg.length - 1;
		}
		css(sliderList,'translateX',-now*sliderW);
	}
	function up(){
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
		for(var i = 0;i < sliderImg.length;i++){
			sliderImg[i].className = '';
		}
		sliderImg[now%sliderImg.length].className = 'active';
	}
})();
//上下滑动：
(function(){
	var wrap = document.querySelector('#wrap');
	mScroll({
		wrap: wrap,
		dir: 'y',
		over: 'backOut'
	});
})();
