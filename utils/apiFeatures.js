class apiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    //filter
    filter() {
        //exclude non-desirable query string fields
        const excludedFields = ['sort', 'limit', 'page', 'fields'];
        let queryObj = { ...this.queryString };
        excludedFields.forEach(element => delete queryObj[element]);

        //handle comparison operators
        queryObj = JSON.parse(JSON.stringify(queryObj).replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`));

        this.query.find(queryObj);

        return this;
    }
    //sort
    sort() {
        let sortBy = 'CreatedAt';
        if (this.queryString.sort) {
            sortBy = this.queryString.sort.replaceAll(',', ' ');
        }

        this.query.sort(sortBy);

        return this;
    }
    //pagination
    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = (page - 1) * limit;

        this.query.skip(skip).limit(limit);

        return this;
    }
    //field limiting
    fieldLimiting() {
        let fields = "-__v";
        if (this.queryString.fields) {
            fields = this.queryString.fields.split(',').join(" ");//.replaceAll(",", " ");
        }

        this.query.select(fields);
        //return
        return this;
    }
};

module.exports = apiFeatures;