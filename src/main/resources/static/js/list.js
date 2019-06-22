loadList("http://localhost:8080/getMusicList.pro");
function loadList(url){
	var req = new XMLHttpRequest();
	req.open("POST", url);
	req.responseType = "json";
	req.onload = function(){
		console.log(req.response);
	}
	req.send();
}
