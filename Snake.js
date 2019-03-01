/**
 * Created by itcast on 2018 12/25.
 */
//关于蛇的代码
(function (window) {

  //随机产生一个十六进制的颜色的函数.
  function getColorForRandom(){
    var arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];  //下标0-15
    var str = "#";
    //循环产生 6个 0-15的数.
    for(var i = 0 ; i < 6; i++){
      var num = Math.floor(Math.random()*16);
      //根据这个随机数,在arr数组中去取值.
      str += arr[num];
    }
    return str;   //"#985700"
  }


  //声明一个list数组,用来存放每一节蛇身体代表的div.
  var list = [];

  //1.经过分析,蛇也有宽高背景色定位xy坐标,所以蛇也是一个对象,所以也有构造函数.
  //蛇是有很多节身体组成的,  宽高方向是一样的,   背景色定位的xy坐标不一样的.
  function Snake(width,height,direction){
    this.width = width || 20;
    this.height = height || 20;
    this.direction = direction || "right";
    //蛇的每一节身体存在数组中. 等下蛇吃食物长身体就可以直接给这个body数组添加一个元素.
    this.body = [
      {x:3,y:1,bgColor:'red'},
      {x:2,y:1,bgColor:'green'},
      {x:1,y:1,bgColor:'pink'}
    ];
  }


  //2.渲染蛇,渲染蛇的代码写成一个函数,那这个函数写在那里?
  //当前是写在原型中比较好:
  Snake.prototype.render = function (map) {
    //每次渲染新蛇之前删除老蛇.
    remove(map);

    //在这个方法中的this,就是调用这个方法的那个谁,一般情况下蛇对象调用这个方法.this就是蛇对象.
    //如何渲染这条蛇? 遍历出蛇的每一节身体,像食物那样渲染.每一节都渲染了,那整条蛇就渲染了.
    for(var i = 0 ; i < this.body.length; i++){
      //拿到蛇的每一节身体
      var snakeUnit = this.body[i];
      //开始渲染.
      //创建一个div,让这个div拥有这一节蛇身体的所有显示信息
      var div1 = document.createElement('div');
      div1.style.position = 'absolute';
      div1.style.left = snakeUnit.x * this.width + "px"; //蛇的每一个单元里面的x下标 乘以 蛇的宽  求出了定位的left坐标
      div1.style.top = snakeUnit.y * this.height + "px";
      div1.style.width = this.width + "px";
      div1.style.height = this.height + "px";
      div1.style.backgroundColor = snakeUnit.bgColor;
      //把这个div添加到map中.
      map.appendChild(div1);

      //把这个div给保存起来.
      list.push(div1);
    }
  }


  //4.蛇移动的方法写在原型中.
  Snake.prototype.move = function (food,map) {
    //蛇身体移动,从尾巴开始改坐标比较好.
    //每一个蛇身体移动改变坐标的方式都一样: 移动之后的坐标等于他的上一节移动之前的坐标.
    for(var i = this.body.length-1; i>0 ; i--){
      this.body[i].x = this.body[i-1].x;
      this.body[i].y = this.body[i-1].y;
    }

    //蛇头移动
    switch (this.direction){
      case 'left':
        this.body[0].x--;
        break;
      case 'right':
        this.body[0].x++;
        break;
      case 'top':
        this.body[0].y--;
        break;
      case 'bottom':
        this.body[0].y++;
        break;
    }


    //蛇移动,就改了蛇头的坐标,蛇头坐标改了,就有可能吃到了食物.
    //判断蛇有没有吃到食物.
    var snakeHeadX = this.body[0].x * this.width;
    var snakeHeadY = this.body[0].y * this.height;
    var foodX = food.x;
    var foodY = food.y;
    //获取到蛇尾巴的xy(因为蛇吃了食物长的身体的坐标,其实就是原来蛇尾巴的坐标);
    var snakeLastUnit = this.body[this.body.length-1];
    //判断这两个坐标是不是重合.
    if(snakeHeadX == foodX && snakeHeadY == foodY){
      //表示吃到了食物.长一节身体. 其实就是给蛇对象的body数组添加一个元素.
      this.body.push({
        x:snakeLastUnit.x,
        y:snakeLastUnit.y,
        bgColor:getColorForRandom()
      });
      //产生一个新的食物(调用食物对象的render方法,让他产生一个新的坐标.).
      food.render(map);
    }

  }


  //5.写一个删除蛇的方法.
  function remove(map){
    //就是让map移除list这个数组中的那些div.
    for(var i = 0 ; i < list.length; i++){
    	map.removeChild(list[i]);
    }

    //要把list数组给清空掉.
    list.length = 0;
  }



  //3.把Snake构造函数给暴露给window.
  window.Snake = Snake;

}(window));