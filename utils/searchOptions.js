class SearchOptions {
  constructor(query) {
    if (query.limit) {
      this.limit = parseInt(query.limit);
    }

    this.sortFields = {};
    if (query.sortBy) {
      const sortStr = query.sortBy.split(",");
      sortStr.forEach((field) => {
        field[0] != "-"
          ? (this.sortFields[field] = "1")
          : (this.sortFields[field.slice(1)] = "-1");
      });
    }
  }
}

module.exports = SearchOptions;
