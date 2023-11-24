function addCreatedAtDesc(queryObj) {
  const newQueryObj = { ...queryObj };

  if (newQueryObj.createdAt && typeof newQueryObj.createdAt === "object") {
    const timingKeys = Object.keys(newQueryObj.createdAt);
    timingKeys.forEach((key) => {
      newQueryObj.createdAt[key] = new Date(`${newQueryObj.createdAt[key]}`);
    });
  }

  if (newQueryObj.createdAt && typeof newQueryObj.createdAt === "string") {
    let createdFrom;
    let createdTo;

    if (newQueryObj.createdAt.includes(",")) {
      const createdAtArr = newQueryObj.createdAt.split(",");
      createdFrom = createdAtArr[0].trim();
      createdTo = createdAtArr[1].trim();
    } else {
      createdFrom = newQueryObj.createdAt;
      createdTo = newQueryObj.createdAt;
    }
    newQueryObj.createdAt = {
      $gte: new Date(`${createdFrom}T00:00:00.000Z`),
      $lte: new Date(`${createdTo}T23:59:59.000Z`),
    };
  }
  return newQueryObj;
}

function addRegexCaseInsensitive(queryObj) {
  const newQueryObj = { ...queryObj };
  const queryArr = Object.keys(newQueryObj);

  for (let i = 0; i < queryArr.length; i += 1) {
    const currentQuery = queryArr[i];
    if (newQueryObj[currentQuery].$regex) {
      newQueryObj[currentQuery].$options = "i";
    }
  }
  return newQueryObj;
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`,
    );

    queryObj = JSON.parse(queryStr);
    queryObj = addCreatedAtDesc(queryObj);
    queryObj = addRegexCaseInsensitive(queryObj);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
