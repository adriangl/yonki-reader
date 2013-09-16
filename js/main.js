var BASE_URL = "http://yonkiblog.com";
var RSS_FEED_URL = BASE_URL+"/feed";
var TAG_URL = BASE_URL+"/tag";
var CATEGORY_URL = BASE_URL+"/category";

var entries = null;

function parseFeed(feedUrl){
	var feed = new google.feeds.Feed(feedUrl);
	feed.includeHistoricalEntries();
	feed.setNumEntries(250);

	feed.load(function(result) {
		if (!result.error) {
			if (result.feed && result.feed.entries) {
				entries = result.feed.entries;
				loadPostsData();
			}
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

		// When the post's content is going to be shown
		$(postContent).on('show', function(){
			// Replace the icon so it displays downwards
			var icon = $(this).parent().find(".icon-chevron-right");
			if (icon != null){				
				$(icon).removeClass("icon-chevron-right").addClass("icon-chevron-down");
			}
			
			// Load post content if not already loaded
			if (!postContent.contentLoaded){
				$(postContent).append(entry.content);
				$(postContent).append("<input type=\"button\" onclick=\"window.open('"+entry.link+"');\" value=\"Ver en la web\">");
				postContent.contentLoaded = true;
			}
		});

		// When the post content is already shown
		$(postContent).on('shown', function(){
			// Scroll to the top of the post
			var scroll = $("#post-"+entryIdx+"-container").offset().top - $('.navbar').height();
			$('html, body').animate({
				scrollTop: scroll
			}, 2000);
		});

		// When the post's content is going to be hidden
		$(postContent).on('hide', function(){
			// Change icon
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

function setupHeader(){
	// Adjust container to display the posts' container correctly, as the
	// navbar is fixed to top
	$('#posts-container').css('padding-top',$('.navbar').height()+'px');
	// Adjust 'about' modal
	$('#about').css(
	{
		'margin-top': function () {
			return +($(this).height() / 2);
		}
	})
}

function main(){
	parseFeed(RSS_FEED_URL);
	setupHeader();
}
