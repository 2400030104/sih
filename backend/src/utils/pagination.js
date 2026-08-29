/**
 * Reusable Pagination Helper
 */
function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

function buildPaginationMetadata(totalRecords, page, limit) {
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  return {
    page,
    limit,
    totalRecords,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

module.exports = {
  getPaginationParams,
  buildPaginationMetadata
};
