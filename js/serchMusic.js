$(function(){

	var $musictype = $("#music-type"),
	    $musicList = $(".music-list"),
	    $musicShow = $("#music-show"),
	    $searchBtn = $(".submit"),
	    $searchInput = $(".search"),
	    audio = document.getElementById("play-audio");
    initialList();

    // 点击选择相应种类的歌曲
    $musictype.on("click","a",function(){
    	audio.pause();
    	var type = $(this).data("type"),
    	    url = "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=?&from=webapp_music&method=baidu.ting.billboard.billList&size=100&type="+type;
    	    that = this;
        $.getJSON(url,function(data){
        	var song_list  = data.song_list;
        	if(song_list){
        		showList(song_list);
                $musicShow.children("h1").text($(that).text());
        	}else{
        		$musicList.replace("<p>无结果</p>");
        	}
			
        });
        return false;
    });

    //搜索歌曲 回车及点击提交
    $searchInput.keyup(function(e){
    	if(e.keyCode == 13){
    		$searchBtn.click();
    	}
    });
    $searchBtn.on("click",function(){
    	var input = $searchInput.val();
    	if(input !== ""){
    		audio.pause();
    		input = encodeURIComponent(input);
    		var url = "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=?&from=webapp_music&method=baidu.ting.search.catalogSug&query="+input;
    		$.getJSON(url,function(data){
    			var song_list  = data.song;
    			if(song_list){
    				showList(song_list);
			        $musicShow.children("h1").text("搜索结果如下：");
    			}else{
    				$musicList.hide();
    				$(".no-result").remove();
    				$musicShow.append("<p class='no-result'>无结果</p>");
    			}
			    
    		});
    	}else{
    		alert("请输入内容！");
    	}
    });

    //点击播放音乐
    $musicList.on("click",".pause",function(){
    	var that = this;
    	    id = $(this).parents("li").attr("data-song-id");
    	playMusic(id);
    	$(this).removeClass("pause").addClass("play")
    	       .parents("li").siblings().find(".controll").removeClass("play").addClass("pause");
    	var t = setInterval(function(){
    		if(audio.ended){
    			$(that).removeClass("play").addClass("pause");
    			clearInterval(t);
    		}
    	},1000);
       	return false;
    }).on("click",".play",function(){
    	audio.pause();
    	$(that).removeClass("play").addClass("pause");
    	return false;
    });

    //播放音乐
    function playMusic(id){
        var url = "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=?&from=webapp_music&method=baidu.ting.song.playAAC&songid="+id;
        $.getJSON(url,function(data){
        	var src = data.bitrate.file_link;
        	$(audio).children("source").attr("src",src);
    	    audio.load();
    	    audio.play();
        });

    }

    
	//页面加载后获得推荐列表
	function initialList(){
		var url = "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=?&from=webapp_music&method=baidu.ting.billboard.billList&type=1&size=100&offset=0";
		$.getJSON(url,function(data){
			var song_list  = data.song_list;
			if(song_list){
				showList(song_list);
			}else{
				$musicList.hide();
    		    $musicShow.append("<p class='no-result'>无结果</p>");
			}
			
		});
	}



	//将歌曲列表插入页面相应位置
	function showList(arr){
		$musicList.show()
		          .find(".controll").removeClass("play").addClass("pause");
		$(".no-result").remove();

        if($musicList.children("li").length > 1){
        	$(".music-list > li:nth-child(n+2)").remove();
        }

		var fragment = document.createDocumentFragment();
		    
		arr.forEach(function(item,index){
			var time,
			    id = item.song_id || item.songid,
			    title = item.title || item.songname,
                author = item.author || item.artistname;

            if(item.file_duration){
            	time = timeFormat(item.file_duration);
            }else{
            	var url = "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=?&from=webapp_music&method=baidu.ting.song.playAAC&songid="+id;
                $.getJSON(url,function(data){
                	time = timeFormat(data.bitrate.file_duration);
                });
            }

            var $firstLi = $musicList.children("li").eq(0);

            if(index == 0){
            	$firstLi.children(".song-name").text(title);
            	$firstLi.children(".singer-name").text(author);
            	$firstLi.children(".song-time").text(time);
            	$firstLi.attr("data-song-id",id);
            }else{
            	var $cloneLi = $firstLi.clone();
            	$cloneLi.children(".song-name").text(title);
            	$cloneLi.children(".singer-name").text(author);
            	$cloneLi.children(".song-time").text(time);
            	$cloneLi.attr("data-song-id",id);
            	$(fragment).append($cloneLi);
            }
		});

		$musicList.append($(fragment));
	}

	//格式化时间
	function timeFormat(num){
		var minute = parseInt(num/60),
		    second = num%60;

		if(second < 10){
			second = "0"+second;
		}

		return minute+":"+second;
	}

})

