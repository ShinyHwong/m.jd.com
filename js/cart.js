window.onload = function () {
    //点击图标显示头部导航栏
    shortcutTap();

    //checkbox点击事件
    itemSelect();

    //物品数量增减
    itemCount();

    //点击删除事件
    deleteTap();

    //结算中心
    checkOut();

};
//checkbox点击事件
function itemSelect() {
    //获取所有全选标签
    var allSelects = document.getElementsByClassName('all-select');
    //遍历获得单个点击事件
    for (var i = 0; i < allSelects.length; i++) {
        JD.tap(allSelects[i], function (e) {
            //找到同一个店铺下的所有物品复选框
            var shop = e.target.parentNode.parentNode;
            var selects = shop.getElementsByClassName('select');
            if (e.target.checked) { //有就去掉
                e.target.removeAttribute('checked');
                //同时把所有物品的勾去掉
                for (var j = 0; j < selects.length; j++) {
                    selects[j].removeAttribute('checked');
                }
            } else { //没有就勾上
                e.target.setAttribute('checked', '');
                //同时把所有物品的勾勾上
                for (var k = 0; k < selects.length; k++) {
                    selects[k].setAttribute('checked', '');
                }
            }
        });
    }

    //获取整个购物车里的物品单选框
    var singleSelects = document.getElementsByClassName('select');
    //遍历添加tap事件
    for (var n = 0; n < singleSelects.length; n++) {
        JD.tap(singleSelects[n], function (e) {
            if (e.target.checked) { //有就去掉
                e.target.removeAttribute('checked');
            } else { //没有就勾上
                console.log(1);
                e.target.setAttribute('checked', '');
            }
            //只要这个商家里有一个物品勾上，商家前面的选中框就勾上
            for (var ele = e.target.parentNode; ele.tagName != 'BODY'; ele = ele.parentNode) {
                //找到父标签shop
                if (ele.className == 'shop') {
                    //获取shop及全选框
                    var shop = ele;
                    var allSelect = ele.getElementsByClassName('all-select')[0];
                    break;
                }
            }
            //获取该商家下的所有商品选择框
            var selects = shop.getElementsByClassName('select');
            //遍历判断是否有勾选至少一件
            for (var k = 0; k < selects.length; k++) {
                if (selects[k].hasAttribute('checked')) {
                    //有就商家栏勾选上
                    allSelect.setAttribute('checked', '');
                    break;
                } else {
                    allSelect.removeAttribute('checked');
                }
            }
        });
    }
}
//物品数量增减
function itemCount() {
    //获取所有的物品数量栏
    var countBoxs = document.getElementsByClassName('item-count');
    //遍历添加点击事件
    for (var i = 0; i < countBoxs.length; i++) {
        JD.tap(countBoxs[i], function (e) {
            //获取点击到的目标对象
            var tar = e.target;
            //获取当前物品数量栏
            var countBox = tar.parentNode;
            //获取物品数量栏里的输入栏
            var count = countBox.getElementsByTagName('input')[0];
            //获取物品数量栏里的减号按钮
            var sub = countBox.getElementsByClassName('sub')[0];
            //如果点击的是加号
            if (tar.className == 'plus') {
                count.value++; //数量加一
                sub.className = 'sub'; //减号可用
            } else if (tar.className == 'sub') { //点击的是减号
                count.value--; //数量减一
                if (count.value <= 1) { //如果数量小于等于1
                    sub.className = 'sub disabled'; //减号不可用
                }
            } else { //点击输入框
                tar.focus(); //获得焦点
            }
        })
    }
}
//点击删除事件
function deleteTap() {
    //获取删除按钮
    var delBtns = document.getElementsByClassName('item-del');
    //获取DOM元素
    var alertCover = document.getElementsByClassName('alert-cover')[0];
    var cancel = alertCover.getElementsByClassName('cancel')[0];
    var yes = alertCover.getElementsByClassName('yes')[0];
    //遍历添加单独点击事件
    for (var i = 0; i < delBtns.length; i++) {
        JD.tap(delBtns[i], function (e) {
            //删除提示显示出来
            alertCover.style.display = 'block';
            var delBtn; //判断是否为删除标签，防止点穿
            if (e.target.parentNode.className == 'item-del') {
                delBtn = e.target.parentNode;
            } else {
                delBtn = e.target;
            }
            //点击按钮动画效果
            var binTop = delBtn.getElementsByClassName('bin-top')[0];
            binTop.style.transform = 'rotate(-30deg)';
            //取消删除事件
            JD.tap(cancel, function () {
                //删除按钮动画还原
                binTop.style.transform = 'rotate(0deg)';
                //删除提示消失
                alertCover.style.display = 'none';
            });
            //确认删除事件
            JD.tap(yes, function () {
                //遍历得到指定父元素
                for (var box = delBtn.parentNode; box.className != 'item-list clearfloat'; box = box.parentNode) {
                    //如果循环到li标签则删除该标签并退出循环
                    if (box.tagName == 'LI') {
                        box.parentNode.removeChild(box);
                        break;
                    }
                }
                //删除提示消失
                alertCover.style.display = 'none';
            })
        })
    }
}
//结算中心
function checkOut() {
    var checkSelect = document.getElementById('check-select-all');
    var selects = document.getElementsByClassName('select');
    var allSelects = document.getElementsByClassName('all-select');
    JD.tap(checkSelect, function (e) {
        if (e.target.checked) { //有就去掉
            e.target.removeAttribute('checked');
            //同时把所有物品的勾去掉
            for (var i = 0; i < selects.length; i++) {
                selects[i].removeAttribute('checked');
            }
            for (var m = 0; m < allSelects.length; m++) {
                allSelects[m].removeAttribute('checked');
            }
        } else { //没有就勾上
            e.target.setAttribute('checked', '');
            //同时把所有物品的勾勾上
            for (var j = 0; j < selects.length; j++) {
                selects[j].setAttribute('checked', '');
            }
            for (var n = 0; n < allSelects.length; n++) {
                allSelects[n].setAttribute('checked', '');
            }
        }
    })
}