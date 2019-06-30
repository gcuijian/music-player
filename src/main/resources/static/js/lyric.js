var lyric = {
	0:"周杰伦-稻香",
	30:"对这个世界如果你有太多的抱怨",
	34:"跌倒了 就不敢继续往前走",
	37:"为什么 人要这么的脆弱 堕落",
	41:"请你打开电视看看",
	43:"多少人为生命在努力勇敢的走下去",
	47:"我们是不是该知足",
	49:"珍惜一切就算没有拥有",
	54:"还记得 你说家是唯一的城堡",
	57:"随着稻香河流继续奔跑",
	60:"微微笑 小时候的梦我知道",
	65:"不要哭 让萤火虫带着你逃跑",
	69:"乡间的歌谣 永远的依靠",
	72:"回家吧 回到最初的美好",
	76:"……",
	100:"不要这么容易 就想放弃",
	103:"就像我说的",
	104:"追不到的梦想 换个梦不就得了",
	107:"为自己的人生鲜艳上色",
	109:"先把爱涂上喜欢的颜色",
	112:"笑一个吧",
	113:"功成名就不是目的",
	115:"让自己快乐快乐",
	117:"这才叫做意义",
	118:"童年的纸飞机",
	120:"现在终于飞回我手里",
	124:"所谓的那快乐",
	125:"赤脚在田里追蜻蜓 追到累了",
	128:"偷摘水果被蜜蜂给 叮到怕了",
	131:"谁在偷笑呢",
	133:"我靠着稻草人 吹着风 唱着歌 睡着了 哦 哦",
	137:"午后吉它在虫鸣中更清脆 哦 哦",
	139:"阳光洒在路上不怕心碎",
	142:"珍惜 一切就算没有拥有",
	147:"还记得 你说家是唯一的城堡",
	151:"随着稻香河流继续奔跑",
	154:"微微笑 小时候的梦我知道",
	159:"不要哭 让萤火虫带着你逃跑",
	163:"乡间的歌谣永远的依靠",
	165:"回家吧 回到最初的美好",
	170:"还记得 你说家是唯一的城堡",
	174:"随着稻香河流继续奔跑",
	177:"微微笑 小时候的梦我知道",
	182:"不要哭 让萤火虫带着你逃跑",
	186:"乡间的歌谣 永远的依靠",
	189:"回家吧 回到最初的美好",
	194:"(完)",
	200:"《歌词来源网络-感谢小剑的整理添加》",
	210:"《感谢您的收听》"
};

function loadLyric(name, fun){
	if (name == "周杰伦-稻香.mp3") {
		fun(lyric);
		return;
	}
	
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