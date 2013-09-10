var BASE_URL = "http://yonkiblog.com";
var RSS_FEED_URL = BASE_URL+"/feed";
var TAG_URL = BASE_URL+"/tags";

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
		$(postTitle).append("<h4 class=\"inline-block\">"+entry.title+"</h4>");
		// Add icon
		$(postTitle).append("<i class=\"icon-chevron-right icon-2x pull-right\"></i>");

		// Post content
		var postContent = $("<div class=\"post-content\"></div>");
		$(postContent).append(entry.content);
		$(postContent).append("<input type=\"button\" onclick=\"window.open("+entry.link+")\" value=\"Ver en la web\">");

		$(postContent).hide();

		$(post).append(postTitle);
		$(post).append(postContent);

		// Add tags and date
		$(post).append("<em><small>"+parseDate(entry.publishedDate)+"</small></em>");
		var categoriesDiv = $("<div class=\"categories\"></div>");
		for (catIdx in entry.categories){
			var category = entry.categories[catIdx];
			$(categoriesDiv).append("<a target=\"_blank\" href=\""+TAG_URL+"/"+category+"\"><span class=\"label label-info\">"+category+"</span></a>");
		}
		$(post).append(categoriesDiv);

		$(post).click(function(){
			var content = $(post).find(".post-content");
			var downIcon = $(document).find(".icon-chevron-down");
			if (downIcon != null){				
				$(downIcon).removeClass("icon-chevron-down").addClass("icon-chevron-right");
			}

			if ($(content).hasClass("enabled")){
				$(content).hide('slow');
				$(content).toggleClass("enabled");
			}
			else{
				$(document).removeClass("enabled");
				$('.post-content').hide('slow');
				$(content).toggleClass("enabled");
				var icon = $(post).find(".icon-chevron-right");
				$(icon).removeClass("icon-chevron-right").addClass("icon-chevron-down");
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