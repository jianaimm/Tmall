
//上拉加载更多
(function() {
     var wrap = document.querySelector('#wrap');
     var scroll = document.querySelector('#scroll');
     var list = document.querySelector('.special');
     var loading = document.querySelector('.loading');
     var footer = document.querySelector('.footer');

     var nowPage = 0;//当前加载了几次；
     var length = 6;//一次加载了几张图;
     var wrapRect = wrap.getBoundingClientRect();
     var lis = list.getElementsByTagName('li');
     //最大滑动距离，是一个负数；
     var min = wrap.clientHeight - scroll.offsetHeight;
     var isLoadOver = false;
     var isCreate = false;
     var scrollMax;

     create();// 初始化
     mScroll({
         wrap: wrap,
         start: start,
         move: function() {
         	if(isLoadOver){
         		return;
         	}
         	move()
         },
         over: 'none',
         showBar: false,
         end: move//因为move后会停在end的loading图的位置，需要继续加载更多,因此在结束时继续调用；
     });
     function start(){
     	if(isLoadOver){
     		return;
     	}
		 min = wrap.clientHeight - scroll.offsetHeight;
         var translate = css(scroll,'translateY');
     }
     
	var bar = document.getElementsByClassName('bar');
    function move(){
    	
		min = wrap.clientHeight - scroll.offsetHeight;
        var translate = css(scroll,'translateY');
        // console.log(min,translate);
        if(translate <= min){
            (bar.length>0)&&(bar[0].style.opacity = 0);
            //cancelAnimationFrame(scroll.timer);
	        nowPage++;
	        create();    
        }
//      console.log(isLoadOver,translate,scrollMax)
      	if(isLoadOver && scrollMax && translate > scrollMax){
//    		console.log('隐藏')
      		startMove({
      			el: footer,
      			target: {
      				bottom: -footer.offsetHeight
      			},
      			time: 300,
      			type: 'easeOut'
      		})
      	}
        getLoad();
    }

    function create(){
        var start = nowPage * length;
      
        if(start >= data.length){
           scroll.style.paddingBottom = "1.45rem";
          min = wrap.clientHeight - scroll.offsetHeight;
          startMove({
                el: scroll,
                target: {
                    translateY: min 
                },
                time: 300,
                type: 'easeOut',
                callIn: function(){
                		 startMove({
		                el: footer,
		                target: {
		                    bottom: 0
		                },
		                time: 300,
		                type: 'easeOut'
		            });
                }
            });
            
            isLoadOver = true;
            loading.style.display = 'block';
            scrollMax = css(scroll,'translateY');
//			console.log(scroll.offsetHeight,css(scroll,'translateY'))
            return;
        }
		
        var end = start + length;
        end = end > data.length ? data.length : end;

        for(var i = start;i < end;i++){
            var li = document.createElement('li');

            li.dataset.src = data[i].imgUrl;
            list.appendChild(li);
        }
       	min = wrap.clientHeight - scroll.offsetHeight;
        getLoad();
    }

    function getLoad(){
        for(var i = 0;i < lis.length;i++){
            var rect1 = lis[i].getBoundingClientRect();
            var footerH = css(footer,'height');
            if(rect1.top < wrapRect.bottom && rect1.bottom > wrapRect.top && !lis[i].isLoad){
				
                imgLoad(lis[i],i);
                lis[i].isLoad = true;
            }

        }
    }
    function imgLoad(li,i){
        var c = document.createElement('canvas');
        var cxt = c.getContext('2d');
        c.width = li.clientWidth;
        c.height = css(li,'height') - 50;
        c.className = 'imgs';

        var img = new Image();

        img.src = li.dataset.src;
        img.onload = function(){
            li.innerHTML += '<a href="javascript:;"><span class="specialTitle">'+ data[i].specialTitle +'</span><em class="priceS"><span>¥</span><strong>'+ data[i].prices.Integer +'</strong><em>'+ data[i].prices.decimal +'</em></em></a>';
            li.appendChild(c);
            cxt.drawImage(img,0,0,c.width,c.height);
            c.style.opacity = 1;
        }
    }

})();


