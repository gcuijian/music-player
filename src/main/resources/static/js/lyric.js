function loadLyric(name, fun){
	// ajax加载
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "./getMusicLyric.pro?name=" + name)
	xhr.responseType = "json";
	xhr.onload = function(){
		var res = xhr.response;
		if(res.status == 0 && res.data != null){
			fun(res.data);
		} else {
			fun({0: "该歌曲暂无歌词哦~ 敬请期待~"});
		}
	}
	xhr.send();
	
}

// 加载歌词信息 + 处理歌词信息并展示
function showLyric(name){
	
	var lyFrame = document.getElementById("lyric");
	var lyricList = document.getElementById("lyricList");
	lyricList && lyricList.parentNode.removeChild(lyricList);
	
	var ul = document.createElement("ul");
	ul.setAttribute("id", "lyricList")
	var br1 = document.createElement("br");
	br1.setAttribute("id", "br1");
	ul.appendChild(br1);
	var br2 = document.createElement("br");
	br2.setAttribute("id", "br2");
	ul.appendChild(br2);
	
	loadLyric(name, function(data){
		var count = 0;
		for (let i in data) {
			var li = document.createElement("li");
			li.innerText = data[i];
			li.setAttribute("id", "l" + i);
			if(count == 0){
				li.style.opacity = 1;
			}
			count++;
			ul.appendChild(li);
		}
		lyFrame.appendChild(ul);
	});
	
}

// 对歌词监听等后续操作
function handleLyric(){
	var li = document.getElementById("l"+mv.nowTime);
	if(li != null){
		// 移除所有的焦点
		removeFocus(li);
		// 当前加上焦点
		li.style.opacity = 1;
		// 上移，根据li进行上移，根据class中的lyricLeave进行控制
		makeFocus(li);
	}
}

function removeFocus(li){
	lis = li.parentNode.childNodes;
	for (var i = 0; i < lis.length; i++) {
		lis[i].style.opacity = 0.7;
	}
}

// 将该li调整到面板的正中心
function makeFocus(li){
	
	/**
	 * 正中心特点：
	 * 1. 如果该li是第一个li，0到第0个兄弟标签添加leave
	 * 2. 如果该li是第二个li，0到第1个兄弟标签添加leave
	 * 3. 如果该li是第三个li，0到第2个兄弟标签添加leave
	 * 4. 如果该li是第四个li，0到第3个兄弟标签添加leave
	 * 5. 如果该li是第五个li，0到第4个兄弟标签添加leave
	 */
	
	// 遍历父节点的第一个节点
	var leaved = li.parentNode.firstChild;
	while (true){
		if(getNextLiNode(leaved) == li){
			break;
		}
		leaved.className = "lyricLeave";
		leaved = leaved.nextSibling;
	}
	
}

function getNextLiNode(li){
	return li.nextSibling.nextSibling;
}

// 如果出现跳跃再次方法中重置歌词状态，移除所有歌词的leave属性
function ifToJump(){
	var lyricNode = document.getElementById("lyricList").firstChild;
	lyricNode.className = "";
	while(lyricNode.nextSibling){
		lyricNode.nextSibling.className = "";
		lyricNode.style.opacity = 0.7;
		lyricNode = lyricNode.nextSibling;
	}
}