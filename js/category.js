window.onload = function () {
    //动态设置内容区域高度
    setMainHeight();
    window.onresize = function () {
        setTimeout(function () {
            setMainHeight();
        }, 100);
    };

    //点击图标显示头部导航栏
    shortcutTap();

    //左侧导航栏回弹及点击事件
    navTapSpring();

    //滑动临界回弹事件
    var rightContent = document.getElementsByClassName('content-right')[0];
    springBack(rightContent); //右侧主界面
};
//动态设置内容区域高度
function setMainHeight() {
    var screenH = window.screen.height; //获取屏幕高度
    var headerH = document.getElementsByClassName('base-header')[0].offsetHeight; //获取头部高度
    var mainbody = document.getElementsByClassName('category-mainbody')[0];
    //设置内容区域的高度
    mainbody.style.height = screenH - headerH + 'px';
}

//左侧导航栏回弹及点击事件
function navTapSpring() {
    var leftUl = document.getElementsByClassName('nav-left')[0].getElementsByTagName('ul')[0];
    var realHeight = leftUl.offsetHeight; //设置实际高度
    var fixHeight = leftUl.parentNode.offsetHeight; //设置页面固定高度
    var criticalHeight = fixHeight * .1; //设置临界高度
    var minBottomY = -(realHeight - fixHeight); //transilateY为负数，所以在前面加-号

    //获取手势滑动距离
    var startY, movedY, changedY, nowY = 0;
    leftUl.addEventListener('touchstart', function (e) {
        e.preventDefault();
        startY = e.touches[0].clientY;
    });
    leftUl.addEventListener('touchmove', function (e) {
        e.preventDefault(); //取消默认事件
        movedY = e.touches[0].clientY;
        changedY = movedY - startY + nowY; //获取滑动距离
        //若在临界值范围内才能移动
        if (changedY < criticalHeight && changedY > fixHeight - realHeight - criticalHeight) {
            //设置位移
            removeTransition(leftUl); //清除缓动
            changeTranslateY(leftUl, changedY);
        }
    });
    leftUl.addEventListener('touchend', function () {
        setTransition(leftUl);
        nowY = changedY; //通过nowY保存上次滑动的距离
        if (nowY > 0) { //如果滑动超过顶部距离则恢复到顶部距离
            nowY = 0;
        } else if (nowY < minBottomY) {
            //最底部时，距离ul顶部的高度为实际高度-固定高度
            nowY = minBottomY;
        }
        changeTranslateY(leftUl, nowY);
    });

    //左侧导航栏点击事件
    JD.tap(leftUl, function (e) {
        var liArr = leftUl.getElementsByTagName('li');
        var curLi = e.target.parentNode;
        //重复点击处理
        if (curLi.className == 'current') return;
        //切换样式
        for (var i = 0, len = liArr.length; i < len; i++) {
            liArr[i].className = '';
            liArr[i].index = i;
        }
        curLi.className = 'current';
        //高度变化，保持当前的li在最上面
        nowY = -curLi.index * curLi.offsetHeight;
        var minBottomY = -(realHeight - fixHeight);
        if (nowY < minBottomY) {
            nowY = minBottomY;
        }
        setTransition(leftUl);
        changeTranslateY(leftUl, nowY);
    })
}