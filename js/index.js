window.onload = function () {
    //顶部搜索栏滚动事件
    searchBarScroll();
    //轮播图
    loopBanner();
    //秒杀倒计时
    seckillRefresh(2);

    //屏幕尺寸变化自动重新加载
    window.onresize = function () {
        setTimeout(function () {
            window.location.reload();
        },200)
    }
};
//顶部搜索栏滚动透明
function searchBarScroll() {
    //获取元素以及数据
    var bar = document.getElementsByClassName('top-bar')[0];
    var bannerH = document.getElementById('jd_banner').offsetHeight;
    //滚动判断
    window.onscroll = function () {
        var scrollH = document.body.scrollTop;
        //搜索栏在banner高度内时显示透明度
        if (bannerH >= scrollH) {
            bar.style.background = 'rgba(222,24,27,' + scrollH / bannerH * .8 + ')';
        } else {
            bar.style.background = 'rgba(222,24,27,.8)';
        }
    }
}

//轮播图
function loopBanner() {
    //获取元素及数据
    var banner = document.getElementById('jd_banner');
    var ul = banner.getElementsByTagName('ul')[0];
    var ol = banner.getElementsByTagName('ol')[0];
    var indicators = ol.getElementsByTagName('li');
    var pageW = banner.offsetWidth; //每一张的宽度
    var index = 1;
    var duration = 2000;

    //定时器轮播
    var timer = null;
    timer = setInterval(bannerScroll, duration);

    function bannerScroll() {
        index++;
        setTransition(ul);
        changeTranslateX(ul, - index * pageW);
    }

    //无限滚动范围控制、无缝切换头尾、指示器切换
    function indexControl() {
        if (index >= ul.children.length -1){
            index = 1;
        } else if(index <= 0) {
            index = ul.children.length -2;
        }
        removeTransition(ul); //无缝切换
        changeTranslateX(ul, - index * pageW);

        //指示器变化
        for (var i = 0 ; i < indicators.length; i++){
            indicators[i].className = '';
        }
        if (index < 1) index = 1;
        else if (index > 8) index = 8;
        //当前图片指示器添加样式
        indicators[index-1].className = 'current';
    }
    //监听缓动执行完毕再进行无缝切换
    ul.addEventListener('transitionEnd', indexControl);
    ul.addEventListener('webkitTransitionEnd', indexControl);

    //监听手势滑动
    var touchStartX,
        currentX,
        movedX;
    ul.addEventListener('touchstart', function (e) {
        clearInterval(timer);
        touchStartX = e.touches[0].clientX;
    });
    ul.addEventListener('touchmove', function (e) {
        e.preventDefault();
        currentX = e.touches[0].clientX;
        movedX = currentX - touchStartX;
        removeTransition(ul); //无缓动位移
        changeTranslateX(ul, - index * pageW + movedX);
    });
    banner.addEventListener('touchend', function () {
        //移动超过正的半张图，跳到下一张
        if (movedX >= pageW * .5){
            index--;
        }
        //移动超过负的半张图，跳到上一张
        else if(movedX < - pageW * .5) {
            index++;
        } //其余还是这一张

        setTransition(ul);
        changeTranslateX(ul, - index * pageW);
        //重启定时器
        timer = setInterval(bannerScroll, duration);
    });
}

//秒杀倒计时 传入参数为每场秒杀间隔时间（0-8点为0点场）
function seckillRefresh(interval) {
    //限制传入的参数
    if (isNaN(interval) && 16 % interval != 0) {
        throw ('传入的秒杀时间间隔必须能被16整除');
    }
    //获取DOM元素
    var seckillMain = document.getElementById('jd_seckill');
    var seckillHeader = seckillMain.getElementsByClassName('title')[0];
    //几点场秒杀
    var nthSeckill = seckillHeader.getElementsByClassName('nth-seckill')[0];
    var spans = seckillHeader.getElementsByTagName('span');
    //hour:3; minute:5,6; second:8,9

    setInterval(function () {
        //获取当前时间
        var now = new Date();
        var nowHour = now.getHours();
        var nowMinute = now.getMinutes();
        var nowSec = now.getSeconds();
        //定义几点场及剩余时间
        var nth, leftHour, leftMin, leftSec;
        //获取当前是几点场
        if (nowHour >= 0 && nowHour < 8) {
            nth = 0; //0-8点都为0点场
        } else{
            nth = Math.floor(nowHour / interval) * interval;
        }
        //只有在分秒都为0才会刚好等于最大值
        leftHour = (nowMinute == 0 && nowSec ==0) ? (nth+interval) - nowHour : (nth+interval) - nowHour - 1; //下一场的时间减现在的时间
        leftMin = (nowSec == 0) ? 60 - nowMinute : 60 -nowMinute - 1;
        leftSec = nowSec == 0? 60 : 60- nowSec;

        //更新界面
        nthSeckill.innerHTML = nth;
        spans[3].innerHTML = leftHour;
        spans[5].innerHTML = Math.floor(leftMin / 10);
        spans[6].innerHTML = leftMin % 10;
        spans[8].innerHTML = Math.floor(leftSec / 10);
        spans[9].innerHTML = leftSec % 10;
    }, 1000);


}