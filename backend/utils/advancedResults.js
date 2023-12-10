// Allows for custom queries in requests made by the client. If no
// custom query is present in the request (aside from sort, page,
// and limit), then will default to the aggregate option first, and the
// altQuery otherwise. Aggregation will not take place if a custom query
// is present. Will return pagination and the results.

const advancedResults = async (req, model, options = {}) => {
  const { aggregate, altQuery, populate } = options;
  let { sort, page, limit, select, ...query } = req.query;

  // True if request contains query other than sort, page, or limit
  const isCustomQuery = Object.keys(query).length > 0 || select ? true : false;

  // Set query to altQuery if "...query" is empty
  if (!isCustomQuery && altQuery) query = altQuery;

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
  const total = await model.countDocuments(query);
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  let queryChain;

  // Query based on options from controller
  if (!isCustomQuery) {
    queryChain = aggregate
      ? model.aggregate(aggregate)
      : model.find(query).populate(populate).select(select);
  }

  // Query this if request contains query other than sort, skip, limit
  if (isCustomQuery) {
    queryChain = model.find(query).populate(populate).select(select);
  }

  // Add sort & pagination queries to the queryChain
  queryChain = queryChain.sort(sort).skip(startIndex).limit(limit);

  const results = await queryChain;

  return { pagination, results };
};

module.exports = advancedResults;
