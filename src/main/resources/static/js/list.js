setListData("./getMusicList.pro");

function loadList(url, fun){
	var req = new XMLHttpRequest();
	req.open("POST", url);
	req.responseType = "json";
	req.onload = function(){
		fun(req.response);
	}
	req.send();
}

function setListData(url){
	var list = document.getElementById("musicList");
	loadList(url, function(result){
		if (result.data == null) {
			console.log("music is null.");
			return;
		}
		for(var i=0; i<result.data.length; i++){
			var data = result.data[i];
			
			var li = document.createElement("li");
			var div = document.createElement("div");
			var musicImg = document.createElement("img");
			var musicName = document.createElement("p");
			
			div.setAttribute("class", "list-img-border");
			musicImg.setAttribute("src", "static/img/she.png");
			div.appendChild(musicImg);
			
			musicName.innerText = data.substring(0, data.indexOf("."));
			
			li.title = data;
			li.setAttribute("class", "music-node");
			li.appendChild(div);
			li.appendChild(musicName);
		
			list.appendChild(li);
		}
		var div = document.createElement("div");
		div.style.clear = "both";
		list.appendChild(div);
		addMusicListEvent();
	});
}

document.getElementById("closeBar").onclick = function(){
	var list = document.getElementsByClassName("menu-list")[0];
	var height = list.offsetHeight;
	
	var inter = setInterval(function(){
		list.style.height = (height = height - 10) + "px";
		if(height <= 0){
			clearInterval(inter);
			document.getElementById("openBar").hidden = false;
		}
	}, 10);
	
}

document.getElementById("openBar").onclick = function(){
	var list = document.getElementsByClassName("menu-list")[0];
	
	var self = this;
	var height = 0;
	var inter = setInterval(function(){
		list.style.height = (height = height + 10) + "px";
		if(height >= 460){
			clearInterval(inter);
		}
	}, 10);
	
	self.hidden = true;
}

document.getElementById("closeBar").click();

function addMusicListEvent(){
	var playNow = 1;
	var nodes = document.getElementsByClassName("music-node");
	for(let i in nodes){
		nodes[i].onclick = function(){
			for (let j in nodes) {
				nodes[j].className = "music-node";
			}
			this.className = "music-node music-list-select";
			getMusicByName(this.title, playNow);
		}
	}
	if(nodes != null){
		nodes[0].className = "music-node music-list-select";
		getMusicByName(nodes[0].title);
	}
}

// 列表循环下一曲
function toNextMusic(){
	var playNow = 1;
	var next = null;
	var nodes = document.getElementsByClassName("music-node");
	for (let i in nodes) {
		if(nodes[i].className == "music-node music-list-select"){
			if((parseInt(i)+1) == nodes.length){
				// 列表最后一首歌曲
				next = nodes[0];
			} else {
				next = nodes[parseInt(i) + 1];
			}
			nodes[i].className = "music-node";
		}
	}
	next.className = "music-node music-list-select";
	getMusicByName(next.title, playNow);
}

function toRandomMusic(){
	var playNow = 1;
	var nowNum = null;
	var nodes = document.getElementsByClassName("music-node");
	for (let i in nodes) {
		if(nodes[i].className == "music-node music-list-select"){
			nowNum = parseInt(i);
			nodes[i].className = "music-node";
		}
	}
	var all = nodes.length;
	var nextNum = null;
	while(nextNum == null || nextNum == nowNum){
		nextNum = parseInt(Math.random() * all);
	}
	var next = nodes[nextNum];
	next.className = "music-node music-list-select";
	getMusicByName(next.title, playNow);
}

function toLastMusic(){
	var playNow = 1;
	var next = null;
	var musicName = mv.historyMusic[mv.historyMusic.length - 2];
	if(musicName == null || musicName == undefined){
		musicName = mv.historyMusic[mv.historyMusic.length - 1];
	}
	var nodes = document.getElementsByClassName("music-node");
	for (let i in nodes) {
		if(nodes[i].className == "music-node music-list-select"){
			nowNum = parseInt(i);
			mv.historyMusic.push(nodes[i].title);
			nodes[i].className = "music-node";
		}
		// 根据title查找到对应的li
		if(nodes[i].title == musicName){
			next = nodes[i];
		}
	}
	next.className = "music-node music-list-select";
	getMusicByName(next.title, playNow);
}

// 跳到下一个
document.getElementById("oncePlay").onclick = function(){
	this.style.display = "none";
	document.getElementById("allPlay").style.display = "";
	clearLoop();
	mv.allLoop = 1;
}

document.getElementById("allPlay").onclick = function(){
	this.style.display = "none";
	document.getElementById("randomPlay").style.display = "";
	clearLoop();
	mv.randomNext = 1;
}

document.getElementById("randomPlay").onclick = function(){
	this.style.display = "none";
	document.getElementById("oncePlay").style.display = "";
	clearLoop();
	mv.onceLoop = 1;
	mv.source.loop = true;
}

function clearLoop(){
	mv.onceLoop = 0;
	mv.allLoop = 0;
	mv.randomNext = 0;
	mv.source.loop = false;
}

document.getElementById("lastMusic").onclick = toLastMusic;

document.getElementById("nextMusic").onclick = function(){
	var id = setInterval(function() {}, 0);
	while (id--) clearInterval(id);
	mv.allLoop && toNextMusic();
	mv.randomNext && toRandomMusic();
	if(mv.onceLoop){
		toLastMusic();
	}
}