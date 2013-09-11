var BASE_URL = "http://yonkiblog.com";
var RSS_FEED_URL = BASE_URL+"/feed";
var TAG_URL = BASE_URL+"/tag";
var CATEGORY_URL = BASE_URL+"/category";

var entries = null;

function parseFeed(feedUrl){
	// Use Google AJAX API to read the feed and return the parsed
	// data as JSON
	$.ajax({
		url      : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=50&q=' + encodeURIComponent(feedUrl),
		dataType : 'json',
		success  : function (data) {
			if (data.responseData.feed && data.responseData.feed.entries) {
				entries = data.responseData.feed.entries;
				loadPostsData();
			}
		},
		error : function(){
			console.log("Error loading data");
		}
	});
}

function loadPostsData(){
	var postsContainer = $("#posts-container");
	$.each(entries, function(entryIdx){
		var entry = entries[entryIdx];
		var post = $("<div class=\"well\" id=\"post-"+entryIdx+"-container\"></div>");
		
		// Post title
		var postTitle = $("<div class=\"post-title-"+entryIdx+"\"></div>");
		var postTitleCollapse = $("<a href=\"#post-"+entryIdx+"\" data-toggle=\"collapse\" data-parent=\"#posts-container\"></a>");
		$(postTitleCollapse).append("<h4 class=\"inline-block\">"+entry.title+"</h4>");
		// Add icon
		$(postTitleCollapse).append("<i class=\"icon-chevron-right icon-2x pull-right\"></i>");
		$(postTitle).append(postTitleCollapse);

		
		// Post content
		var postContent = $("<div id =\"post-"+entryIdx+"\" class=\"collapse post-content\"></div>");

		// Listeners to change icon status when showing or hiding the content
		$(postContent).on('show', function(){
			var icon = $(this).parent().find(".icon-chevron-right");
			if (icon != null){				
				$(icon).removeClass("icon-chevron-right").addClass("icon-chevron-down");
			}
			//$(postContent).append(entry.content);
			if (!postContent.contentLoaded){
				$(postContent).append("<p>AAAAA</p>");
				$(postContent).append("<input type=\"button\" onclick=\"window.open('"+entry.link+"');\" value=\"Ver en la web\">");
				postContent.contentLoaded = true;
			}
		});

		$(postContent).on('hide', function(){
			var icon = $(this).parent().find(".icon-chevron-down");
			if (icon != null){				
				$(icon).removeClass("icon-chevron-down").addClass("icon-chevron-right");
			}
		});


		$(post).append(postTitle);
		$(post).append(postContent);

		// Add CATEGORY, tags and date
		$(post).append("<em><small>"+parseDate(entry.publishedDate)+"</small></em>");
		var categoriesDiv = $("<div class=\"categories\"></div>");
		for (catIdx in entry.categories){
			var category = entry.categories[catIdx];
			var url = "";
			var labelStyle = ""
			if (catIdx == 0){
				labelStyle = "label-info"
				$(categoriesDiv).append("<span class=\"label "+labelStyle+"\">"+category+"</span>");
			}
			else{
				url = TAG_URL+"/"+category;
				$(categoriesDiv).append("<a target=\"_blank\" href=\""+url+"\"><span class=\"label\">"+category+"</span></a>");
			}
			
		}
		$(post).append(categoriesDiv);

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
