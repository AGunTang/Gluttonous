/**
 * Created by itcast on 2018 12/25.
 */
//游戏控制器:所有关于游戏逻辑代码都写在这里.
(function (window) {

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
