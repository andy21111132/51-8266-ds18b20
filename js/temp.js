var wsImpl = window.WebSocket || window.MozWebSocket;

        window.ws = new wsImpl('ws://localhost:8181/'); 
		
        var start = function () {
			startTime();
            var inc = document.getElementById('incomming');
			var tmp = document.getElementById('tempInc');
			
            ws.onopen = function () {
                inc.innerHTML += '当前状态:connection open<br/>';
            };
			
			ws.onmessage = function (msg) {
				var judgeNmb = /^[0-9]+.?[0-9]*/;  //
				var arr= msg.data.split(":"); //将数据以“ ： ” 为单位分割 
				var temp=arr[4].substr(2,5);  //2,3 不带小数点  2,5 带小数点  此为温度显示的截取
				var temp1=Number(temp);
				// console.log(temp1);
				if(judgeNmb.test(temp1)){
					var tempObj=window.sessionStorage.setItem("temp",temp1);
					setTimeout(tempObj,3000);
					tmp.innerHTML ='当前温度：'+ temp + '°C<br/>';   // 插入温度显示
				}else{
				inc.innerHTML ='当前状态：'+ arr[4].split("}") +'<br/>';  // 详细信息显示
				}
			};
			
            ws.onclose = function () {
                inc.innerHTML += '当前状态:connection closed<br/>';
            };
			
        }
		
        window.onload = start;  //程序开始入口
		
		function startTime(){
			var today=new Date();
			var yyyy = today.getFullYear();   // 获取返回值
			var MM = today.getMonth()+1; 
			var dd = today.getDate(); 
		    var hh=today.getHours();  
			var mm=today.getMinutes(); 
		    var ss=today.getSeconds();
			MM=checkTime(MM);    // 检查是否溢出
			dd=checkTime(dd);
			mm=checkTime(mm);   
			ss=checkTime(ss);    
			var day; 
			if(today.getDay()==0)   day   =   "星期日 " 
			if(today.getDay()==1)   day   =   "星期一 " 
			if(today.getDay()==2)   day   =   "星期二 " 
			if(today.getDay()==3)   day   =   "星期三 " 
			if(today.getDay()==4)   day   =   "星期四 " 
			if(today.getDay()==5)   day   =   "星期五 " 
			if(today.getDay()==6)   day   =   "星期六 " 
			document.getElementById('time').innerHTML=yyyy+"-"+MM +"-"+ dd +" " + hh+":"+mm+":"+ss+"   " + day;
			var timeObj= MM +"-"+dd +" " + hh+":"+mm+":"+ss;
			// var timeList[]=[timeObj];
			// console.log(timeList[0]);
			setTimeout('startTime()',1000);
			  //向表格发送时间数据
			var time = window.localStorage.setItem("time",timeObj);
			setTimeout(time,3000);
			};
			
		function checkTime(i){
			if (i<10){
				i="0" + i;
				}
				return i;
			};
		

        function conn() {
            var req = {};
            req.ac = "tcpConn";
            req.seq = 1;
            req.data = { server: document.getElementById('txtServer').value,port: parseInt(document.getElementById('txtPort').value) };
			// req.data = { server: 192.168.4.1, port: 8888 };
            ws.send(JSON.stringify(req));
			// console.log(req);
        }
		
        function tcpClose() {
            console.log('tcpClose')
            var req = {}
            req.ac = "tcpClose"
            req.seq = 1
            //req.data = input.value;
            ws.send(JSON.stringify(req));
			clearTimeout('recv()');
            // console.log('tcpClose')
        }

        function send() {
            var req = {};
            req.ac = "tcpSend";
            req.seq = 1;
            req.data = document.getElementById('sendText').value;
            ws.send(JSON.stringify(req));
			// console.log(req);
            //document.getElementById('sendText').value = "";
        }

        function recv() {
            var req = {};
            req.ac = "tcpRecv";
            req.seq = 1;
            ws.send(JSON.stringify(req));
			recvobj=setTimeout('recv()',1000);  //刷新显示温度值及返回的信息
			var dbKey=0;
			var dbKeyObj=window.localStorage.setItem("dbKey",dbKey);
			setTimeout(dbKeyObj,1000); 
        }
		
		function stop(){
			var dbKey=1;
			var dbKeyUp=window.localStorage.removeItem("dbKey",dbKey);
			var dbKeyObj=window.localStorage.setItem("dbKey",dbKey);
			setTimeout(dbKeyObj,1000); 
		}
		
		
		
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////canvs图表///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	
var LineChart = function( options ) {

  var data = options.data;
  var canvas = document.body.appendChild( document.createElement( 'canvas' ) );
  var context = canvas.getContext( '2d' );
  // var timeObj=localStorage.getItem(time);

  var rendering = false,
      paddingX = 40,
      paddingY = 40,
      // width = options.width || window.innerWidth,
      // height = options.height || window.innerHeight,
	  width = 580,  // 高度宽度设置
	  height = 380,
      progress = 0;

  canvas.width = width;
  canvas.height = height;

  var maxValue,
      minValue;

  var y1 = paddingY + ( 0.05 * ( height - ( paddingY * 2 ) ) ),
      y2 = paddingY + ( 0.50 * ( height - ( paddingY * 2 ) ) ),
      y3 = paddingY + ( 0.95 * ( height - ( paddingY * 2 ) ) );
  
  format();
  render();
  
  function format( force ) {

    maxValue = 0;
    minValue = Number.MAX_VALUE;
	
    data.forEach( function( point, i ) {
      // maxValue = Math.max( maxValue, point.value );
      // minValue = Math.min( minValue, point.value );
	  maxValue = Math.max( maxValue, 40 );   //数值大小显示
	  minValue = Math.min( minValue, -10 );
    } );

    data.forEach( function( point, i ) {
      point.targetX = paddingX + ( i / ( data.length - 1 ) ) * ( width - ( paddingX * 2 ) );
      point.targetY = paddingY + ( ( point.value - minValue ) / ( maxValue - minValue ) * ( height - ( paddingY * 2 ) ) );
      point.targetY = height - point.targetY;
  
      if( force || ( !point.x && !point.y ) ) {
        point.x = point.targetX + 30;
        point.y = point.targetY;
        point.speed = 0.04 + ( 1 - ( i / data.length ) ) * 0.05;
      }
    } );
    
  }

  function render() {

    if( !rendering ) {
      requestAnimationFrame( render );
      return;
    }
    
    context.font = '10px sans-serif';
    context.clearRect( 0, 0, width, height );

    context.fillStyle = 'seashell';
    context.fillRect( paddingX, y1, width - ( paddingX * 2 ), 1 );
    context.fillRect( paddingX, y2, width - ( paddingX * 2 ), 1 );
    context.fillRect( paddingX, y3, width - ( paddingX * 2 ), 1 );
    
    if( options.yAxisLabel ) {
      context.save();
      context.globalAlpha = progress;
      context.translate( paddingX - 15, height - paddingY - 10 );
      context.rotate( -Math.PI / 2 );
      context.fillStyle = '#fff';
      context.fillText( options.yAxisLabel, 0, 0 );
      context.restore();
    }

    var progressDots = Math.floor( progress * data.length );
    var progressFragment = ( progress * data.length ) - Math.floor( progress * data.length );

    data.forEach( function( point, i ) {
      if( i <= progressDots ) {
        point.x += ( point.targetX - point.x ) * point.speed;
        point.y += ( point.targetY - point.y ) * point.speed;

        context.save();
        
        var wordWidth = context.measureText( point.label ).width;
        context.globalAlpha = i === progressDots ? progressFragment : 1;
        context.fillStyle = point.future ? 'gary' : 'white';   //字体颜色
        context.fillText( point.label, point.x - ( wordWidth / 2 ), height - 18 );

        if( i < progressDots && !point.future ) {
          context.beginPath();
          context.arc( point.x, point.y, 4, 0, Math.PI * 2 );
          context.fillStyle = 'white';   //节点颜色
          context.fill();
        }

        context.restore();
      }

    } );

    context.save();
    context.beginPath();
    context.strokeStyle = 'white';    // 折线颜色
    context.lineWidth = 2;

    var futureStarted = false;

    data.forEach( function( point, i ) {

      if( i <= progressDots ) {

        var px = i === 0 ? data[0].x : data[i-1].x,
            py = i === 0 ? data[0].y : data[i-1].y;

        var x = point.x,
            y = point.y;

        if( i === progressDots ) {
          x = px + ( ( x - px ) * progressFragment );
          y = py + ( ( y - py ) * progressFragment );
        }

        if( point.future && !futureStarted ) {
          futureStarted = true;

         context.stroke();
         context.beginPath();
         context.moveTo( px, py );
         context.strokeStyle = '#aaa';  //虚线
		  

          if( typeof context.setLineDash === 'function' ) {
            context.setLineDash( [2,3] );
          }
        }

        if( i === 0 ) {
          context.moveTo( x, y );
        }
        else {
          context.lineTo( x, y );
        }

      }

    } );

    context.stroke();
    context.restore();

    progress += ( 1 - progress ) * 0.02;
  
    requestAnimationFrame( render );

  }
  
  this.start = function() {
    rendering = true;
  }
  
  this.stop = function() {
    rendering = false;
    progress = 0;
    format( true );
  }
  
  this.restart = function() {
    this.stop();
    this.start();
  }
  
  this.append = function( points ) {    
    progress -= points.length / data.length;
    data = data.concat( points );
    format();
  }
  
  this.populate = function( points ) {    
    progress = 0;
    data = points;
    format();
  }

};

var chart = new LineChart({ data: [] });

reset();

chart.start();


function startDisplay(){    //开始
	interval = setInterval(refresh,3000);
}

function stopDisplay(){    //结束
	clearInterval(interval); 
}
		
		
function append() {
	var timeObj=window.localStorage.getItem("time",timeObj);
	var tempObj=window.sessionStorage.getItem("temp");
		chart.append([
		{ label: timeObj, value: tempObj, future: true }
		]);
}

function refresh(){   
    var timeObj=window.localStorage.getItem("time",timeObj);
	var tempObj=window.sessionStorage.getItem("temp");
    append(timeObj,tempObj);
}  

function restart() {
  chart.restart();
}

function reset() {
	// var timeObj=window.localStorage.getItem("time",timeObj);
	// var tempObj=window.localStorage.getItem("temp",timeObj);
	chart.populate([
    { label: 1, value: 10 },
	{ label: 2, value: 20 }
  ]);
}
