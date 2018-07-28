/*global $*/

$(document).ready(function(){
    
    $.get('videoList.txt', {}, function(msg){
        var list = JSON.parse(msg);
        //console.log(msg);
        var videoList = (function generateVideosList(showsList){
        	var ul = $('<ul></ul>').attr('id', 'accordion');
        	for(var i = 0; i < showsList.length; i++){
        		var seriesName = showsList[i].seriesName;
        		var seasons = showsList[i].seasons;
        		var li = $('<li>' + seriesName + '</li>');
        		for(var j = 0; j < seasons; j++){
        			var ul2 = $('<ul>Season '+ (j+1) +'</ul>');
        			for(var k = 0; k < showsList[i].episodes[j].length; k++){
        				var ep = showsList[i].episodes[j][k];
        				var epTitle = ep.epTitle;
        				var path = ep.filePath;
        				
        				var li2 = $('<li></li>');
        				var a = $('<a>'+ epTitle + '</a>')
        						.attr('href', 'videoPlayer.php?play=' + path)
        						.attr('target', '_blank');
        				li2.append(a);
        				ul2.append(li2);
        			}			
        			li.append(ul2);
        		}
        		ul.append(li);
        	}
        	return ul;
        }(list));
        $('body').append(videoList);
    }, 'text');

})