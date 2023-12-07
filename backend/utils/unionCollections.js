// Combines two collections via _id using the $unionWith operator.
// Removes populated fields from documents that do not need it, similar
// to mongoose populate.

// collection - The collection that needs populating
// local - The field to populate
// from - The collection being used to populate

const unionCollections = (collection, local, from) => {
  const aggregate = [
    { $unionWith: { coll: `${collection}` } },

    {
      $lookup: {
        from: `${from}`,
        localField: `${local}`,
        foreignField: '_id',
        as: `${local}`,
      },
    },

    {
      $addFields: {
        [local]: {
          $cond: [{ $eq: [`$${local}`, []] }, '$$REMOVE', `$${local}`],
        },
      },
    },
  ];

  return aggregate;
};

module.exports = unionCollections;
