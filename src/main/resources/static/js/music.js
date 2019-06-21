//var name = "I LOVE U.mp3";

var name = "周杰伦-不能说的秘密.flac";

// 真正的数据长度
var size = 256;

var box = document.getElementById("box");
var height, width;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
box.appendChild(canvas);

var mv = new MusicVisualizer({
	size: size,
	visualizer: draw
});

/*******************************************************************************/
// 全部时长
mv.preplay("http://localhost:8080/getMusic.pro?name=" + name, function(allTime){
	// 保存到全局对象
	mv.allTime = allTime;
	document.getElementById("allTime").innerText = formatTime(allTime);

});



/*******************************************************************************/

document.getElementById("play").onclick = function(){
	mv.play(0);
	this.style.display = "none";
	document.getElementById("pause").removeAttribute("style");
	mv.progressInterId = setInterval(function(){
		var nowTime = mv.nowTime;		
		document.getElementById("nowTime").innerText = formatTime(nowTime);
		setProgress(nowTime);
	}, 500);
}

function setProgress(nowTime){
	var percent = (nowTime / mv.allTime) * 100;
	document.getElementById("progress-sign").value = percent;
}

function formatTime(time){
	var s = parseInt(time % 60);
	return ( parseInt(time / 60) ) + ":" + ( (s>=10)?(""+s):("0"+s) );
}

document.getElementById("pause").onclick = function(){
	mv.pause();
	this.style.display = "none";
	document.getElementById("play").removeAttribute("style");
}

// 自主调节进度
document.getElementById("progress-sign").onchange = function(){
	var precent = this.value / 100;
	if(!mv.isPlay){
		console.log("拦截了一次非播放状态下的进度调节请求");
		return;
	}
	console.log("通过拦截");
	mv.stop();
	var nowTime = parseInt(precent * mv.allTime);
	localStorage.playTime = nowTime;
	mv.nowTime = nowTime;
	mv.continuePlay();
}

document.getElementById("progress-sign").mouseover = function(){
	console.log("over:" + this.value);
}

document.getElementById("sound").onclick = mute;

// 静音
function mute(){
	var self = document.getElementById("volume");
	localStorage.nowVolume = self.value;
	self.value = 0;
	self.onchange();
	muteAc();
}

function muteAc(){
	document.getElementById("sound").style.display = "none";
	document.getElementById("nosound").removeAttribute("style");
}

document.getElementById("nosound").onclick = dismute;

// 恢复音量
function dismute(){
	var self = document.getElementById("volume");
	var volume = parseInt(localStorage.nowVolume);
	if(volume <= 100){
		self.value = volume;
	}
	self.onchange();
	dismuteAc();
}

function dismuteAc(){
	document.getElementById("nosound").style.display = "none";
	document.getElementById("sound").removeAttribute("style");
}

function resize(){
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.height = height;
	canvas.width = width;
	
	// 渐变
	var line = ctx.createLinearGradient(0, 0, 0, height);
	// 添加渐变色
	line.addColorStop(0, "BlueViolet");
	line.addColorStop(0.5, "Cyan");
	line.addColorStop(1, "green");
	ctx.fillStyle = line;
}
resize();

window.onresize = resize;

// 绘制函数
function draw(arr){
	ctx.clearRect(0, 0, width, height);
	var w = width / size;
	for (var i = 0; i < size; i++) {
		var h = arr[i] / 256 * height;
		if(h == 0){h = height / 256;}
		ctx.fillRect(w * i, height - h, w * 0.6, h);
	}
}

document.getElementById("volume").onchange = function(){
	if(this.value == 0){
		muteAc();
	} else {
		dismuteAc();
	}
	mv.changeVolume(this.value/this.max);
}

document.getElementById("volume").onchange();
