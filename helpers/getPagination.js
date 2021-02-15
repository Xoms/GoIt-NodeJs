const getPagination = (page, limit) => {
  const size = limit ? +limit : 20;
  const offset = page ? (page - 1) * limit : 0;

  return { size, offset };
};
module.exports = getPagination;