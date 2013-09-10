var RSS_FEED_URL = "http://yonkiblog.com/feed";

var entries = null;

function parseFeed(feedUrl){
	// Use Google AJAX API to read the feed and return the parsed
	// data as JSON
	$.ajax({
		url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=50&q=' + encodeURIComponent(feedUrl),
		dataType : 'json',
		success  : function (data) {
			if (data.responseData.feed && data.responseData.feed.entries) {
				entries = data.responseData.feed.entries;
				loadPostsData();
			}
		},
		error : function(){
			console.log("Error!!");
		}
	});
}

function loadPostsData(){
	var postsContainer = $("#posts-container");
	$.each(entries, function(entryIdx){
		var entry = entries[entryIdx];
		var post = $("<div class=\"well post-"+entryIdx+"\"></div>");
		// Post title
		var postTitle = $("<div class=\"post-title\"></div>");
		$(postTitle).append("<h4>"+entry.title+"</h4>");
		$(postTitle).append("<em><small>"+parseDate(entry.publishedDate)+"</small></em>");
		
		// Post content
		var postContent = $("<div class=\"post-content\"></div>");
		$(postContent).hide();

		$(postContent).append(entry.content);

		$(post).append(postTitle);
		$(post).append(postContent);

		$(post).click(function(){
			var content = $(post).find(".post-content");
			if ($(content).hasClass("enabled")){
				$(content).hide('slow');
				$(content).toggleClass("enabled");
			}
			else{
				$(document).removeClass("enabled");
				$('.post-content').hide('slow');
				$(content).toggleClass("enabled");
				$(content).show("slow");
			}
		})

		$(postsContainer).append(post);
	});
}

function parseDate(dateString){
	var d = new Date(Date.parse(dateString));
	return d.toLocaleString();
}

function main(){
	parseFeed(RSS_FEED_URL);
}