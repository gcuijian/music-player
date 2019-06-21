function MusicVisualizer(obj){
	this.source = null;
	
	this.count = 0;
	
	this.analyser = MusicVisualizer.ac.createAnalyser();
	this.size = obj.size;
	this.analyser.fftSize = this.size * 2;
	
	this.gainNode = MusicVisualizer.ac[MusicVisualizer.ac.createGain?"createGain":"createGainNode"]();
	this.gainNode.connect(MusicVisualizer.ac.destination);
	
	this.analyser.connect(this.gainNode);
	
	this.xhr = new XMLHttpRequest();
	
	this.visualizer = obj.visualizer;
	
	this.visualize();
	
	// 解码前的音频数据
	this.arraybuffer = null;
	// 时长
	this.allTime = 0;
	
	// 当前音乐时间id
	this.nowTimeId = 0;
	// 当前音乐时间
	this.nowTime = 0;
	
	// 音乐是否在播放
	this.isPlay = 0;
	
	// 进度计数器id
	this.progressInterId = 0;
}

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;
MusicVisualizer.ac = new window.AudioContext();
//MusicVisualizer.ac = new (window.AudioContext || window.webkitAudioContext)();

MusicVisualizer.prototype.load = function(url, fun){
	this.xhr.abort();
	this.xhr.open("POST", url);
	this.xhr.responseType = "arraybuffer";
	var self = this;
	this.xhr.onload = function(){
		fun(self.xhr.response);
	}
	this.xhr.send();
}

MusicVisualizer.prototype.decode = function(arraybuffer, fun){
	MusicVisualizer.ac.decodeAudioData(arraybuffer, function(buffer){
		fun(buffer);
	}, function(err){
		console.log(err);
	});
}

MusicVisualizer.prototype.preplay = function(url, fun){
	var n = ++this.count;
	var self = this;
	this.source && this.stop();
	this.load(url, function(arraybuffer){
		if(n != self.count) return;
		console.log(arraybuffer);
		self.arraybuffer = arraybuffer.slice();
		self.decode(arraybuffer, function(buffer){
			if(n != self.count) return;
			var bs = MusicVisualizer.ac.createBufferSource();
			bs.connect(self.analyser);
			bs.buffer = buffer;
			fun(buffer.duration);
			self.source = bs;
		});
	});
}

MusicVisualizer.prototype.play = function(offset){
	var bs = this.source;
	var self = this;
	
	var inter = setInterval(function(){
		bs = self.source;
		if(bs != null){
			window.clearInterval(inter);
			var pause = parseInt(localStorage.playTime);
			if(pause){
				console.log("pause:" + pause);
				self.continuePlay();
				return;
			}
			bs[bs.start ? "start" : "noteOn"](0, offset);
			self.isPlay = 1;
			// 开启nowTime的计数
			self.dealNowTime();
		}
	}, 500);
	
	
	// 设定在stop的回调函数中，停止所有定时器
//	var id = setInterval(function() {}, 0);
//	while (id--) clearInterval(id);
}

/**
 * 计数当前播放时间
 */
MusicVisualizer.prototype.dealNowTime = function(){
	var self = this;
	this.nowTimeId = setInterval(function(){
		self.nowTime++;
	}, 1000);
}

/**
 * 继续播放
 */
MusicVisualizer.prototype.continuePlay = function(){
	var self = this;
	var arraybuffer = this.arraybuffer.slice();
	var offset = parseInt(localStorage.playTime);
	localStorage.playTime = 0;
	this.decode(arraybuffer, function(buffer){
		var bs = MusicVisualizer.ac.createBufferSource();
		bs.connect(self.analyser);
		bs.buffer = buffer;
		self.source = bs;
		self.play(offset);
	});	
}

/**
 * 主动暂停
 */
MusicVisualizer.prototype.pause = function(){
	console.log("触发一次暂停" + this.nowTime);
	localStorage.playTime = this.nowTime;
	this.stop();
}

/**
 * stop的回调函数里面做播放结束后的行为，必须要将播放调整到初始化状态
 */
MusicVisualizer.prototype.stop = function(){
	window.clearInterval(this.nowTimeId);
	this.isPlay = 0;
	this.source[this.source.stop ? "stop" : "noteOff"](0);
}

MusicVisualizer.prototype.changeVolume = function(percent){
	this.gainNode.gain.value = percent * percent;
}

MusicVisualizer.prototype.visualize = function(){
	var arr = new Uint8Array(this.analyser.frequencyBinCount);

	requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame;
	var self = this;
	function v(){
		self.analyser.getByteFrequencyData(arr);
//		console.log(arr);
//		draw(arr);
		self.visualizer(arr);
		requestAnimationFrame(v);
	}
	requestAnimationFrame(v);
}




