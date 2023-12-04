// @Note: MongoDB aggregation $lookup for tweets & comments?
// - Perform aggregation: https://stackoverflow.com/questions/35795480/mongoose-query-to-get-data-from-multiple-collections

// @desc        Get user
// @route       GET /api/users/:id
// @access      Public

// @desc        Get tweets
// @route       GET /api/users/:id/tweets
// @access      Public

// @desc        Get comments
// @route       GET /api/users/:id/comments
// @access      Public

// @desc        Get likes
// @route       GET /api/users/:id/likes
// @access      Public

// @desc        Get retweets
// @route       GET /api/users/:id/retweets
// @access      Public

// @desc        Get bookmarks
// @route       GET /api/users/:id/bookmarks
// @access      Private

// @desc        Follow user
// @route       POST /api/users/:id/follow
// @access      Private

// @desc        Unfollow user
// @route       DELETE /api/users/:id/unfollow
// @access      Private