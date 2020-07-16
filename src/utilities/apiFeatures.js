/**
 * @file Manages all advanced filtering done on popular destinations
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */


/**
 * @class APIFeatures
 * @classdesc  a class with static document filtering methods, this class contains method that are used to filter the popular destinations.
 * @param query - mongodb query
 * @param queryString - data returned after query
 */
class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
     /**
   * @description A static method to filter out properties selected from with the query.
   * @returns document (this)
   */
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // 1B) Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }

     /**
   * @description A static method to sort the data by provided parameters.
   * @returns document (this)
   */
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
     /**
   * @description A static method to filter out properties selected from with the query.
   * @returns document (this)
   */
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
     /**
   * @description A static method for pagination.
   * @returns document (this)
   */
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

// exports class as a module
  module.exports = APIFeatures;
  