var LineChart = function(options) {

	var data = options.data;
	// var dataY=[tempObj];
	var canvas = document.body.appendChild(document.createElement('canvas'));
	var context = canvas.getContext('2d');
	// var timeObj=localStorage.getItem(time);

	var rendering = false,
		paddingX = 40,
		paddingY = 40,
		// width = options.width || window.innerWidth,
		// height = options.height || window.innerHeight,
		width = 600, // 高度宽度设置
		height = 400,
		progress = 0;

	canvas.width = width;
	canvas.height = height;

	var maxValue,
		minValue;

	var y1 = paddingY + (0.05 * (height - (paddingY * 2))),
		y2 = paddingY + (0.50 * (height - (paddingY * 2))),
		y3 = paddingY + (0.95 * (height - (paddingY * 2)));

	var x = 0;

	format();
	render();

	function format(force) {

		maxValue = 0;
		minValue = Number.MAX_VALUE;

		data.forEach(function(point, i) {
			// maxValue = Math.max( maxValue, point.value );
			// minValue = Math.min( minValue, point.value );
			maxValue = Math.max(maxValue, 40); //数值大小显示
			minValue = Math.min(minValue, -10);
		});

		data.forEach(function(point, i) {
			point.targetX = paddingX + (i / (data.length - 1)) * (width - (paddingX * 2));
			point.targetY = paddingY + ((point.value - minValue) / (maxValue - minValue) * (height - (
				paddingY * 2)));
			point.targetY = height - point.targetY;

			if (force || (!point.x && !point.y)) {
				point.x = point.targetX + 30;
				point.y = point.targetY;
				point.speed = 0.04 + (1 - (i / data.length)) * 0.05;
			}
		});

	}

	function render() {

		if (!rendering) {
			requestAnimationFrame(render);
			return;
		}

		context.font = '10px 微软雅黑';
		context.clearRect(0, 0, width, height);

		context.fillStyle = 'gray'; // 背景线  --
		context.fillText('40°C', 15, 45);
		context.fillText('30°C', 15, 109);
		context.fillText('20°C', 15, 172);
		context.fillText('10°C', 15, 238);
		context.fillText('0°C', 15, 300);
		context.fillText('-10°C', 10, 365);
		context.fillRect(paddingX, 40, width - (paddingX * 2), 1);
		context.fillRect(paddingX, 104, width - (paddingX * 2), 1);
		context.fillRect(paddingX, 167, width - (paddingX * 2), 1);
		context.fillRect(paddingX, 233, width - (paddingX * 2), 1);
		context.fillRect(paddingX, 295, width - (paddingX * 2), 1);
		context.fillRect(paddingX, 360, width - (paddingX * 2), 1);

		if (options.yAxisLabel) {
			context.save();
			context.globalAlpha = progress;
			context.translate(paddingX - 15, height - paddingY - 10);
			context.rotate(-Math.PI / 2);
			context.fillStyle = '#000';
			context.fillText(options.yAxisLabel, 0, 0);
			context.restore();
		}
		// 控制 label 的显示
		var progressDots = Math.floor(progress * data.length);
		var progressFragment = (progress * data.length) - Math.floor(progress * data.length);

		data.forEach(function(point, i) {
			if(data.length%5==0){
				this.reset();
			}
			if (i <= progressDots) {
				point.x += (point.targetX - point.x) * point.speed;
				point.y += (point.targetY - point.y) * point.speed;

				context.save();

				var wordWidth = context.measureText(point.label).width; //   控制 label 的显示
				context.globalAlpha = i === progressDots ? progressFragment : 1;
				context.fillStyle = point.future ? 'black' : 'black'; //字体颜色
				context.fillText(point.label, point.x - (wordWidth / 2), height - 18);

				if (i < progressDots && !point.future) {
					var tempObj = window.sessionStorage.getItem("temp");
					context.beginPath();
					context.arc(point.x, point.y, 4, 0, Math.PI * 2);
					context.fillText(tempObj+"°C", point.x-10, point.y-10);
					context.fillStyle = '#777'; //节点颜色
					context.fill();
				}

				context.restore();
			}

		});

		context.save();
		context.beginPath();
		context.strokeStyle = '#666'; // 折线颜色
		context.lineWidth = 2;
		// context.stroke();
		// context.moveTo( px, py );
		// context.fill();
		// context.strokeStyle = 'black';  //虚线颜色

		var futureStarted = false;

		data.forEach(function(point, i) {

			if (i <= progressDots) {

				var px = i === 0 ? data[0].x : data[i - 1].x,
					py = i === 0 ? data[0].y : data[i - 1].y;

				var x = point.x,
					y = point.y;

				if (i === progressDots) {
					x = px + ((x - px) * progressFragment);
					y = py + ((y - py) * progressFragment);
				}

				if (point.future && !futureStarted) {
					futureStarted = true;

					context.stroke();
					context.moveTo(px, py);
					context.fill();
					context.strokeStyle = 'black'; //虚线颜色


					if (typeof context.setLineDash === 'function') {
						// context.setLineDash( [2,3] );    //设置增加的线为实线  取消注释为虚线
					}
				}

				if (i === 0) {
					context.moveTo(x, y);
				} else {
					context.lineTo(x, y);
				}

			}

		});

		context.stroke();
		context.restore();

		progress += (1 - progress) * 0.02; // 控制增幅的速度

		requestAnimationFrame(render);

	}

	this.start = function() {
		rendering = true;
	}

	this.stop = function() {
		rendering = false;
		progress = 0;
		format(true);
	}

	this.restart = function() {
		this.stop();
		this.start();
	}

	this.append = function(points) {
		progress -= points.length / data.length;
		data = data.concat(points);
		format();
	}

	this.populate = function(points) {
		progress = 0;
		data = points;
		format();
	}

};

var chart = new LineChart({
	data: []
});

reset();

chart.start();

function append() {
	var timeObj = window.localStorage.getItem("time", timeObj);
	// var tempObj = window.sessionStorage.getItem("temp", tempObj);
	var tempObj = window.sessionStorage.getItem("temp");
	chart.append([{
		label: timeObj,
		value: tempObj,
		future: false
	}]);

}

function refresh() {
	append();
}

function restart() {
	chart.restart();
}

function reset() {
	var timeObj = window.localStorage.getItem("time", timeObj);
	var tempObj = window.sessionStorage.getItem("temp");
	chart.populate([ //populate
		{
			label: timeObj,
			value: tempObj
		},{
			label: timeObj,
			value: tempObj
		}
	]);
}
