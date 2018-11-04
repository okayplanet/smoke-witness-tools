const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function transformCommentToD3BarData(blogs) {
  blogs = JSON.parse(JSON.stringify(blogs));
	authoredBlogDates = {};
	minDomain = 0;
	maxDomain = 0;
	for (var blog of blogs) {
    blog.created = monthNames[new Date(blog.created).getMonth()];
		if(authoredBlogDates.hasOwnProperty(blog.created)) {
			id = authoredBlogDates[blog.created]['id']
			oldValue = authoredBlogDates[blog.created]['value']
			currentBlogValue = blog.curator_payout_value + blog.total_payout_value;
			newValue = oldValue + currentBlogValue;
			if(newValue > maxDomain) {
				maxDomain = newValue;
			}
			if(currentBlogValue < minDomain) {
				minDomain = currentBlogValue;
			}
			authoredBlogDates[blog.created] = { 'id' : blog.created, 'value' : newValue };
		} else {
			newValue = blog.curator_payout_value + blog.total_payout_value;
			minValue = newValue;
			maxValue = newValue;
			authoredBlogDates[blog.created] = { 'id' : blog.created, 'value' : newValue };
		}
	}


	data = [];
	for (var property in authoredBlogDates) {
			if (authoredBlogDates.hasOwnProperty(property)) {
					data.push({ 'x': authoredBlogDates[property].id, 'y': authoredBlogDates[property].value });
			}
	}
	return {'data' : data, 'min': minDomain, 'max': maxDomain, 'avg': 0 };
}

function transformBlogToD3BarData(blogs) {
  blogs = JSON.parse(JSON.stringify(blogs));
	authoredBlogDates = {};
	minDomain = 0;
	maxDomain = 0;
	for (var blog of blogs) {
    blog.created = monthNames[new Date(blog.created).getMonth()];
		if(authoredBlogDates.hasOwnProperty(blog.created)) {
			id = authoredBlogDates[blog.created]['id']
			oldValue = authoredBlogDates[blog.created]['value']
			currentBlogValue = blog.curator_payout_value + blog.total_payout_value;
			newValue = oldValue + currentBlogValue;
			if(newValue > maxDomain) {
				maxDomain = newValue;
			}
			if(currentBlogValue < minDomain) {
				minDomain = currentBlogValue;
			}
			authoredBlogDates[blog.created] = { 'id' : blog.created, 'value' : newValue };
		} else {
			newValue = blog.curator_payout_value + blog.total_payout_value;
			minValue = newValue;
			maxValue = newValue;
			authoredBlogDates[blog.created] = { 'id' : blog.created, 'value' : newValue };
		}
	}

	data = [];
	for (var property in authoredBlogDates) {
			if (authoredBlogDates.hasOwnProperty(property)) {
					data.push({ 'x': authoredBlogDates[property].id, 'y': authoredBlogDates[property].value });
			}
	}
	return {'data' : data, 'min': minDomain, 'max': maxDomain, 'avg': 0 };
}

function transformBlogToD3LineData(blogs) {
  blogs = JSON.parse(JSON.stringify(blogs));

	authoredBlogDates = {};
	minDomain = 0;
	maxDomain = 0;

  authoredBlogDates = blogs.map(blog => {
    newValue = blog.curator_payout_value + blog.total_payout_value;
    if(newValue > maxDomain) {
      maxDomain = newValue;
    }
    return { 'x': new Date(blog.created), 'y': newValue }
  });

	return {'data' : authoredBlogDates, 'min': minDomain, 'max': maxDomain, 'avg': 0 };
}
