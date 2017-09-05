document.addEventListener('touchstart',function(e){
	e.preventDefault();
});
//轮播图；silder；
(function(){
	var silder = document.querySelector('#silder');
	var silderBtns = silder.querySelectorAll('#silderImg a');
	var silderList = silder.querySelector('.silderList');
	var silders = silderList.children;//获取silderList下面的所有li；
	var silderW = css(silder,'width');
	var now = 0;//记录当前是第几张；
	silderList.innerHTML += silderList.innerHTML;
	silderList.style.width = silders.length + '00%';
	var startX,startY,elX;
	var isMove = true;
	var isFirst = true;
	css(silderList,'translateX',0);
	css(silderList,'translateZ',0.01);
	silder.addEventListener('touchstart',function(e){
		clearInterval(silderList.timer);//当按下时，清掉startMove的里的定时器timer；格式就是el.timer;
		var Touch = e.changedTouches[0];
		startX = Touch.pageX;
		startY = Touch.pageY;
		if(Math.abs(now) == 0){
			//当now是第0张时，就让now等于第二组的第0张，可用silders.length/2,也可以用silderBtns.length；
			now = silders.length/2;
			css(silderList,'translateX',-now*silderW);//同步下left值；
		} else if(Math.abs(now) == silders.length -1){
			//当now是最后一张时，就让now等于第一组的最后一张，可用silders.length/2 - 1,也可以用silderBtns.length -1；
			now = silders.length/2 - 1;
			css(silderList,'translateX',-now*silderW);//同步下left值；
		}
		isMove = true;
		isFirst = true;
		elX = css(silderList,'translateX');
	});
	silder.addEventListener('touchmove',function(e){
		if(!isMove){
			return;
		}
		var Touch = e.changedTouches[0];
		var disX = Touch.pageX - startX;
		var disY = Touch.pageY - startY;
		if(isFirst){
			isFirst = false;
			if(disY > disX){
				isMove = false;
				return;
			}
		}
		css(silderList,'translateX',disX + elX);
	});
	silder.addEventListener('touchend',function(e){
		if(!isMove){
			return;
		}
		var left = css(silderList,'translateX');
		now = Math.round(left/silderW);
		var target = now*silderW;
		startMove({
			el: silderList,
			target: {
				translateX: target
			},
			time: 500,
			type: 'easeOut'
		});
		for(var i = 0;i < silderBtns.length;i++){
			silderBtns[i].className = '';
		}
		silderBtns[Math.abs(now)%silderBtns.length].className = 'active';
	});
})();
