// Combines two collections via _id using the $unionWith operator.
// Removes populated fields from documents that do not need it, similar
// to mongoose populate.

const tweetsAndRetweets = () => {
  const aggregate = [
    { $unionWith: { coll: `retweets` } },

    {
      $lookup: {
        from: `users`,
        localField: `user`,
        foreignField: '_id',
        as: `user`,
      },
    },

    {
      $lookup: {
        from: `tweets`,
        localField: `retweeted`,
        foreignField: '_id',
        as: `retweeted`,
      },
    },

    {
      $lookup: {
        from: `users`,
        localField: `retweeted.user`,
        foreignField: '_id',
        as: `tempUser`,
      },
    },

    { $addFields: { 'retweeted.user': { $arrayElemAt: ['$tempUser', 0] } } },

    { $unset: 'tempUser' },
    { $unset: 'user.password' },
    { $unset: 'retweeted.user.password' },

    // dont put user or retweeted into an array, keep as object
    { $unwind: { path: `$user`, preserveNullAndEmptyArrays: true } },
    { $unwind: { path: `$retweeted`, preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        retweeted: {
          $cond: [{ $eq: [`$retweeted`, []] }, '$$REMOVE', `$retweeted`],
        },
      },
    },
  ];

  return aggregate;
};

module.exports = tweetsAndRetweets;
