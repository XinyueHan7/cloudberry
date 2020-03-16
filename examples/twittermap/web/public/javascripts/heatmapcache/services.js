'use strict';
angular.module('cloudberry.heatmapcache', ['cloudberry.common'])
  .service('heatMapResultCache', function () {

  // The key-value store that stores heatmap results of a query.
  var store = [];
  // To check if time range in query changed (new query?)
  var endDate = new Date();
  var endDateAssigned = false;
  // Deducts -1 to create a default value that can't exist
  endDate.setDate(endDate.getDate() - 1);
  var currentTimeRange = {
    start: new Date(),
    end: endDate
  };

  this.emptyStore = function () {
    store = [];
    currentTimeRange.start = new Date();
    currentTimeRange.end = new Date();
  }

  this.cacheIsDone = function(timeInterval) {
    return currentTimeRange.end >= timeInterval.end && currentTimeRange.start <= timeInterval.start;
  }

  /**
   * Retrieves map results data from the cache; ignores empty objects
  */
  this.getValues = function (timeInterval) {
    var resultArray = [];
    for (var j = 0; j < store.length; j++) {
      var day = new Date(store[j]["create_at"]);
      if (day >= timeInterval.start && day <= timeInterval.end) {
        resultArray.push(store[j]);
      }
    }
    return resultArray;
  };

  /**
   * Updates the store with map result each time the middleware responds to json request.
  */
  this.putValues = function (mapResult, timeInterval) {
    for (var i = 0; i < mapResult.length; i++) {
      store.push(mapResult[i])
    }
    if (!endDateAssigned){
      currentTimeRange.end = new Date(timeInterval.end);
      endDateAssigned = true;
    }
    currentTimeRange.start = new Date(timeInterval.start);
  };
});