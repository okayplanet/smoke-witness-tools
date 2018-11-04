steem.api.setOptions({ url: 'https://rpc.smoke.io/' });
steem.config.set('address_prefix', 'steem');
steem.config.set('chain_id', '1ce08345e61cd3bf91673a47fc507e7ed01550dab841fd9cdb0ab66ef576aaf0');

/*
steem.api.getAccounts(['emeraldtreasury'], function(err, result) {
	//console.log(err, result);
});

steem.api.getBlogEntries("emeraldtreasury", 9999, 100, function(err, data){
  //console.log(err, data);
});
*/

const testUser = 'goldendawne';
var blogQuery = {
	tag: testUser,
  limit: 100
};

let _blogs = [];
let _posts = [];
let _resmokes = [];
let _comments = [];

steem.api.getDiscussionsByBlog(blogQuery, function (err, discussions) {
  discussions.map(function (discussion) {
    validKeys = [ 'author', 'title', 'curator_payout_value', 'total_payout_value', 'url', 'created', 'first_reblogged_on' ];
    Object.keys(discussion).forEach((key) => validKeys.includes(key) || delete discussion[key]);
    if(discussion.author == testUser) {
      _posts.push(discussion);
    } else {
      _resmokes.push(discussion);
    }
		_blogs.push(discussion);
		//console.log(_blogs);
  });
});

var commentQuery = {
	start_author: testUser,
  limit: 100
};

steem.api.getDiscussionsByComments(commentQuery, function (err, comments) {
  comments.map(function (comment) {
    validKeys = [ 'author', 'body', 'curator_payout_value', 'total_payout_value', 'url', 'created' ];
    Object.keys(comment).forEach((key) => validKeys.includes(key) || delete comment[key]);
    if(comment.author == testUser) {
      _comments.push(comment);
    }
  });
  //console.log(comments);
});

var counter = 0;
var commentArraySet = false;
var blogArraySet = false;
var graphsSet = false;

var formattedComments = {};
var authoredBlogs = {};
var resmokedBlogs = {};
var i = setInterval(function(){
    if(_comments.length > 0 && !commentArraySet) {
			commentArraySet = true;
			formattedComments = _comments.map(blog => {
				copy = JSON.parse(JSON.stringify(blog));
				copy.curator_payout_value = parseInt(copy.curator_payout_value.replace(" SMOKE", ""));
				copy.total_payout_value = parseInt(copy.total_payout_value.replace(" SMOKE", ""));
				return copy;
			});
			//clearInterval(i);
		}

		if(_blogs.length > 0 && !blogArraySet) {
			blogArraySet = true;
			authoredBlogs = _blogs.map(blog => {
				copy = JSON.parse(JSON.stringify(blog));
				copy.curator_payout_value = parseInt(copy.curator_payout_value.replace(" SMOKE", ""));
				copy.total_payout_value = parseInt(copy.total_payout_value.replace(" SMOKE", ""));
				return copy;
			}).filter(blog => blog.author === testUser);

			resmokedBlogs = _blogs.map(blog => {
				copy = JSON.parse(JSON.stringify(blog));
				copy.curator_payout_value = parseInt(copy.curator_payout_value.replace(" SMOKE", ""));
				copy.total_payout_value = parseInt(copy.total_payout_value.replace(" SMOKE", ""));
				return copy;
			}).filter(blog => blog.author !== testUser);

			//clearInterval(i);
		}

		if(commentArraySet && blogArraySet && !graphsSet) {
			graphsSet = true;
			var margin = {
				top: 100,
				right: 150,
				bottom: 100,
				left: 150
			}
			let width = 1920 - (margin.left + margin.right);
			let height = 1080 - (margin.top + margin.bottom);

			authoredBarData = transformBlogToD3BarData(authoredBlogs);
			plotBarGraph("#smoke-for-authored-bar", width, height, margin, authoredBarData.data.reverse());
			authoredLineData = transformBlogToD3LineData(authoredBlogs);
			plotLineGraph("#smoke-for-authored-line", width, height, margin, authoredLineData.data)

			commentBarData = transformCommentToD3BarData(formattedComments);
			plotBarGraph("#smoke-for-comments-bar", width, height, margin, commentBarData.data.reverse());
			commentLineData = transformBlogToD3LineData(formattedComments);
			plotLineGraph("#smoke-for-comments-line", width, height, margin, commentLineData.data);
		}

    counter++;
    if(counter === 10) {
        clearInterval(i);
    }

}, 200);
