setListData("http://localhost:8080/getMusicList.pro");

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
		for(var i=0; i<result.data.length; i++){
			var data = result.data[i];
			console.log(data);
			
			var li = document.createElement("li");
			var div = document.createElement("div");
			var musicImg = document.createElement("img");
			var musicName = document.createElement("p");
			
			div.setAttribute("class", "list-img-border");
			musicImg.setAttribute("src", "static/img/Tianyi.png");
			div.appendChild(musicImg);
			
			musicName.innerText = data.substring(0, data.indexOf("."));
			
			li.title = data;
			li.appendChild(div);
			li.appendChild(musicName);
		
			list.appendChild(li);
		}
		
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


