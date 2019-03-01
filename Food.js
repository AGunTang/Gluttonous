/**
 * Created by itcast on 2018 12/25.
 */
//关于食物的
(function (window) {
  //声明一个list数组,用来保存显示食物的div.
  var list = [];

  //1.小食物是一个对象.就有构造函数.
  function Food(width,height,bgColor,x,y){
    this.width = width || 20;
    this.height = height || 20;
    this.bgColor = bgColor || "green";
    this.x = x || 0;
    this.y = y || 0;
  }
  //2.要把食物对象渲染到地图上,要写的一些代码就封装成一个函数.
  //这个函数写在原型中比较好:
  //a如果有很多食物那每一个食物都要渲染所以这个方法就是一个公共的方法
  //b如果方法写在原型中,食物对象就可以直接调用.
  Food.prototype.render = function (map) {
    //渲染新食物删除老食物.
    remove(map);

    //谁调用这个render方法,那这个方法中的this就是谁.
    //2.1 随机一个定位的xy坐标,赋值给this的xy.
    this.x = Math.floor(Math.random() * (map.offsetWidth/this.width)) * this.width;
    this.y = Math.floor(Math.random() * (map.offsetHeight/this.height)) * this.height;
    //2.2 把这个食物渲染到地图上? 创建一个div对象,让这个div拥有这个食物对象的所有显示信息.
    var div1 = document.createElement('div');
    div1.style.position = "absolute";
    div1.style.left = this.x +"px";
    div1.style.top = this.y + "px";
    div1.style.backgroundColor = this.bgColor;
    div1.style.width = this.width +"px";
    div1.style.height = this.height + "px";
    //2.3 把这个div添加到地图上.
    map.appendChild(div1);

    //把显示食物的这个div给存起来.
    list.push(div1);
  }

  //写一个方法,删掉老食物.
  function remove(map){
    //遍历list数组.
    for(var i = 0 ; i < list.length; i++){
    	map.removeChild(list[i]);
    }
    //清空list数组
    list.length = 0;
  }


  //把写的Food方法,添加给window对象.
  window.Food = Food; //这个地方实际上是给window对象添加了一个Food方法,方法体就是我们自己写的Food.


}(window));
