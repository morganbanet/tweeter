const advancedResults = async (req, model, options) => {
  const { altQuery, populate, aggregate } = options;

  let { select, sort, page, limit, ...query } = req.query;

  // Include query operators (ie, $gt, $lt, $lte)
  query = JSON.parse(
    JSON.stringify(query).replace(
      /\b(gt|lt|gte|lte|ne|in|eq)\b/g,
      (match) => `$${match}`
    )
  );

  // Seperate queries by space (ie, select('name text'))
  select = select && select.split(',').join(' ');
  sort = sort ? sort.split(',').join(' ') : '-createdAt';

  // Page number and results per page
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 20;

  // Get start and end index of current page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Include next and prev pages in response
  const pagination = {};
  const total = await model.countDocuments(altQuery || query);
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  // @Todo: Fix custom queries

  // prettier-ignore
  let queryChain = aggregate
    ? model.aggregate(aggregate)
    : model.find(altQuery || query).populate(populate).select(select);

  queryChain = queryChain.sort(sort).skip(startIndex).limit(limit);

  const results = await queryChain;

  return { pagination, results };
};

module.exports = advancedResults;
