class APIfeatures {
  // query => all the Tour.find() || queryString => req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const execludedFields = ['page', 'sort', 'limit', 'fields'];
    execludedFields.forEach((qr) => delete queryObj[qr]);
    // { duration: { gte: '5' } }
    // { duration: { $gte: '5' } }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // This will be a query which accepts chaning without result documents
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    // Sorting
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortedBy);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }

  limitation() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || process.env.LIMITED * 1;
    const skipped = (page - 1) * limit;
    this.query = this.query.skip(skipped).limit(limit);
  }
}

module.exports = APIfeatures;
