//关于食物的
;(function (window) {
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

//--------------------------------------------------------------------------------------------
//关于蛇的代码
;(function (window) {

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

//--------------------------------------------------------------------------------------------
//游戏控制器:所有关于游戏逻辑代码都写在这里.
;(function (window) {

  //声明一个变量that,用来存放游戏控制器对象.
  var that = null;

  //1.游戏控制器构造函数
  function Game(map){
    //游戏控制器里就有一个食物,还有一个蛇,还要一个地图.
    this.food = new Food();
    this.snake = new Snake();
    this.map = map;
    //给that赋值
    that = this;
  }

  //2.游戏控制器开始游戏方法.
  //方法写在原型是因为: 游戏控制器对象直接点出来.
  Game.prototype.start = function () {
    //2.1 让食物显示
    this.food.render(this.map);
    //2.2 让蛇显示
    this.snake.render(this.map);
    //2.3 让蛇动起来
    // //a.调用蛇的move方法改变坐标
    // this.snake.move();
    // //b.调用蛇的render方法重新渲染蛇.
    // this.snake.render(this.map);
    snakeAutoMove();

    //2.4 让蛇听话(跟着键盘按键来移动.)
    bindKey();
  }

  //5.写一个方法,让蛇根着键盘按键移动.
  function bindKey(){
    //先获取按的是那个键.给页面设置一个键盘按下事件.
    document.onkeydown = function (e) {
      //console.log(e.keyCode);//获取按的键 37左  38上  39右  40下.
      //根据你按的键去改变蛇的方向.
      switch (e.keyCode){
        case 37:
          if(this.snake.direction != 'right'){
            this.snake.direction = 'left';
          }
          break;
        case 38:
          if(this.snake.direction != 'bottom'){
            this.snake.direction = 'top';
          }
          break;
        case 39:
          if(this.snake.direction != 'left'){
            this.snake.direction = 'right';
          }
          break;
        case 40:
          if(this.snake.direction != 'top'){
            this.snake.direction = 'bottom';
          }
          break;
      }
    }.bind(that)
  }




  //4.写一个蛇自动移动的方法.
  function snakeAutoMove(){
    //写一个计时器,不停的调用蛇移动的那两个方法.
    var timerId = setInterval(function () {
      //console.log(this);//window,为什么这里的this是window.
      //console.log(this.snake);//undefiend.

      //这里的this是window,因为计时器回调函数相当于是window点出来调用的.
      //this是window,window中没有snake,所以this.snake就是undefined.
      //undefined.move()那肯定就报错了.
      //解决办法: 让this不指向window,而是指向游戏控制器对象.

      //a.调用蛇的move方法改变坐标
      this.snake.move(this.food,this.map);


      //判断蛇是否出了边界.
      var snakeHeadX = this.snake.body[0].x * this.snake.width;
      var snakeHeadY = this.snake.body[0].y * this.snake.height;
      //判断
      if(snakeHeadX < 0 || snakeHeadY < 0 || snakeHeadX >= this.map.offsetWidth || snakeHeadY >= this.map.offsetHeight ){
        alert('Game Over!');
        //清空计时器,游戏结束
        clearInterval(timerId);
        return;//如果出了边界游戏结束了,就不要再执行渲染蛇的代码了.
      }

      //b.调用蛇的render方法重新渲染蛇.
      this.snake.render(this.map);

    }.bind(that),400);
  }


  //3.把Game构造函数暴露给window
  window.Game = Game;
}(window));



//如果一个js文件页面上有多个自执行函数,那最好在每一个自执行函数前面加一个分号.