//通用js事件封装

    //在全局下创建JD对象封装对应的方法
window.JD = {};
/**
 * 封装tap方法
 * @param obj 对象
 * @param callback 回调
 */
JD.tap = function (obj, callback) {
    if (typeof obj != 'object'){
        throw '参数传递错误';
    }
    //定义参数用于判断是否为tap
    var startTime, endTime, isMove = false;
    obj.addEventListener('touchstart', function (e) {
        e.preventDefault();
        startTime = new Date().getTime();
    });
    obj.addEventListener('touchmove', function (e) {
        e.preventDefault();
        isMove = true;
    });
    obj.addEventListener('touchend', function (e) {
        endTime = new Date().getTime();
        //没有移动并且点击事件小于300ms即为tap
        if (!isMove && endTime - startTime < 300) {
            //有回调函数就执行回调函数
            if (callback) {
                callback(e);
            }
        }
        isMove = false;
    })
};

//点击图标显示分类导航
function shortcutTap() {
    //获取到点击图标
    var header = document.getElementsByClassName('base-header')[0];
    var icon = header.getElementsByClassName('icon-shortcut')[0];
    //获取到顶部导航
    var shortcut = header.getElementsByClassName('header-shortcut')[0];
    //执行点击事件
    JD.tap(icon, function () {
        var display = shortcut.style.display;
        //切换display
        display == 'none' ? shortcut.style.display = 'block' : shortcut.style.display = 'none';
    })
}

//滑动临界回弹事件
function springBack(obj) {
    var realHeight = obj.offsetHeight; //设置实际高度
    var fixHeight = obj.parentNode.offsetHeight; //设置页面固定高度
    var criticalHeight = fixHeight * .1; //设置临界高度
    var minBottomY = -(realHeight - fixHeight); //transilateY为负数，所以在前面加-号

    //获取手势滑动距离
    var startY, movedY, changedY, nowY = 0;
    obj.addEventListener('touchstart', function (e) {
        e.preventDefault();
        startY = e.touches[0].clientY;
    });
    obj.addEventListener('touchmove', function (e) {
        e.preventDefault(); //取消默认事件
        movedY = e.touches[0].clientY;
        changedY = movedY - startY + nowY; //获取滑动距离
        //若在临界值范围内才能移动
        if (changedY < criticalHeight && changedY > fixHeight - realHeight -criticalHeight) {
            //设置位移
            removeTransition(obj); //清除缓动
            changeTranslateY(obj, changedY);
        }
    });
    obj.addEventListener('touchend', function () {
        setTransition(obj);
        nowY = changedY; //通过nowY保存上次滑动的距离
        if (nowY > 0) { //如果滑动超过顶部距离则恢复到顶部距离
            nowY = 0;
        } else if (nowY < minBottomY) {
            //最底部时，距离ul顶部的高度为实际高度-固定高度
            nowY = minBottomY;
        }
        changeTranslateY(obj, nowY);
    });
}
//设置过度
function setTransition(obj) {
    obj.style.transition = 'all .2s ease-in-out';
    obj.style.webkitTransition = 'all .2s ease-in-out';
}

//移除过度
function removeTransition(obj) {
    obj.style.transition = 'none';
    obj.style.webkitTransition = 'none';
}

//设置竖直方向位移
function changeTranslateY(obj, y) {
    obj.style.transform = 'translateY(' + y + 'px)';
    obj.style.webkitTransform = 'translateY(' + y + 'px)';
}

//设置水平方向位移
function changeTranslateX(obj, x) {
    obj.style.transform = 'translateX(' + x+ 'px)';
    obj.style.webkitTransform = 'translateX(' + x + 'px)';
}