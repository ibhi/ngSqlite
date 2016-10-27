

angular
  .module('ngSqlite')
  .provider('cache', cacheProvider);

cacheProvider.$inject = ['$qProvider'];

function cacheProvider($qProvider) {

  var config = {
      dbName: 'demo',
      dbLocation:'default'
  };

  this.config = function(cfg) {
      angular.extend(config, cfg);
  };

  this.$get = CacheHelper;

  CacheHelper.$inject = ['$q'];
  
  function CacheHelper($q) {

      function createPlaceholderQuestionmark(fieldNames) {
        return fieldNames.map(function() {
            return '?'
        }).join(',');
      }

      function createUpdateQuery(fieldNames) {
        return fieldNames.map(function(fieldName) {
            return fieldName + '=?'
        }).join(',');
      }

      function whereQuery(fieldNames) {
        return fieldNames.map(function(fieldName) {
            return fieldName + '=?'
        }).join(' AND ');
      }

      function prepareResult(response) {
        var result = [];
        if(response.rows) {
          var len = response.rows.length;
          var i;

          for ( i = 0; i < len; i++ ) {
            result.push(response.rows.item(i));
          } // end for
        }
        return result;
      }
      
      /**
       * Cache constructor
       *
       * @class - Cache constructor
      */

      function Cache(){
          
      }

      Cache.prototype.init = function() {
        if(!window.cordova) {
          if(window.openDatabase) {
            this.db = window.openDatabase(config.dbName + '.db', '1.0', config.dbName + ' DB', 2*1024*1024);
          } else {
            alert('Your browser doesnt support WebSQL. Either use chrome or use this wrapper with cordova sqlite plugin');
          }
        } else {
          this.db = window.sqlitePlugin.openDatabase({name: config.dbName + '.db' , location: config.dbLocation});
          if(!this.db) return new Error('Error creating database');
        }
      }

      /**
       * Method to create tables
       *
       * @param {String} fieldSpec - Fieldnames with type and key information in string format; (ex: id integer primary key, business_id integer, business_name text)
       * @param {String} tableName - Table name
       * @returns {Promise} - Returns angularjs promise
      */

      Cache.prototype.exec = function(query, params) {
        var self = this;
        return $q(function(resolve, reject){
          self.db.transaction(function(tx) {
            tx.executeSql(query, params, function(tx, result) {
              console.log('Transaction completed ', tx, result, prepareResult(result));
              // console.log(resolve);
              resolve(prepareResult(result));
            }, function(tx, error) {
              console.log('Transaction Error: ' + error.message);
              reject(error);
            });
          });
        });
      };

      /*
      db.createTable(tableName, {
              'id': {
                  type: 'INTEGER',
                  primary: true,
                  notnull: true
              },
              'name': {
                  type: 'TEXT',
                  notnull: true,
                  unique: true,
                  default: "'John Doe'"
              },
              'city_id': {
                  type: 'INTEGER',
                  notnull: true,
                  ref: 'cities'
              }
          });
      Id text primary key, FirstName text, LastName text, Email text
      */

      Cache.prototype.createTable = function(tableName, columns) {
          var self = this;
          var query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
          var first = true;
          for (var key in columns) {
            var deflt = columns[key]['default'],
                ref = columns[key].ref;
            var columnDec = (first ? (first = false, '') : ',') + key +
                (columns[key].type ? ' ' + columns[key].type : '') +
                (columns[key].primary ? ' PRIMARY KEY' : '') + 
                (columns[key].unique ? ' UNIQUE' : '') +
                (columns[key].notnull ? ' NOT NULL' : '') +
                (deflt ? (' DEFAULT ' + deflt) : '') + 
                (ref ? (' REFERENCES ' + ref) : '');
            query += columnDec;
          }
          query += ')';

          return $q(function(resolve, reject){
            self.db.transaction(function(tx) {
                tx.executeSql(query, [], function(tx, result) {
                  console.log(tx, result);
                  resolve(result);
                }, function(tx, error) {
                  reject(error);
                });
            });
          });
      };

      // Cache.prototype.upsert = function(tableName, tableData, keyFields) {
      //     var self = this;
      //     keyFields = keyFields || [];
      //     var query;
      //     var fieldNames = Object.keys(tableData);
      //     var where;
      //     var valueFieldsValues;
      //     var keyFieldsValues;
      //     var fieldValues = [];

      //     var valueFields = _.difference(fieldNames, keyFields);

      //     valueFieldsValues = valueFields.map(function(valueField) {
      //       return tableData[valueField];
      //     });

      //     keyFieldsValues = keyFields.map(function(keyField) {
      //       return tableData[keyField];
      //     });

      //     fieldValues = _.concat(valueFieldsValues, keyFieldsValues);

      //     if(keyFields.length > 0) { //update
            
      //       if (Array.isArray(keyFields)) {
      //         where = whereQuery(keyFields);
      //       }
      //       query = 'UPDATE ' + tableName + ' SET ' +  createUpdateQuery(valueFields) + ' WHERE ' + where;

            
      //     } else { //insert

      //       query = 'INSERT INTO ' + tableName + ' (' + fieldNames.join(',') + ') ' + 
      //             ' VALUES (' + createPlaceholderQuestionmark(fieldNames) + ')';
      //     }
          

      //     return self.exec(query, fieldValues);
      // };

      Cache.prototype.insert = function(tableName, tableData) {
        var self = this;
        var query;
        var fieldNames = _.keys(tableData);
        var fieldValues = _.values(tableData);

        query = 'INSERT INTO ' + tableName + ' (' + fieldNames.join(',') + ') ' + ' VALUES (' + createPlaceholderQuestionmark(fieldNames) + ')';

        return self.exec(query, fieldValues);
      };

      Cache.prototype.update = function(tableName, tableData, keyFields) {
          var self = this;
          keyFields = keyFields || [];
          var query;
          var fieldNames = _.keys(tableData);
          var where;
          var valueFieldsValues;
          var keyFieldsValues;
          var fieldValues = [];

          // if(keyFields.length === 0) {
          //   return new Error('Key fields are mandatory for update query');
          // }

          var valueFields = _.difference(fieldNames, keyFields);

          valueFieldsValues = valueFields.map(function(valueField) {
            return tableData[valueField];
          });

          keyFieldsValues = keyFields.map(function(keyField) {
            return tableData[keyField];
          });

          fieldValues = _.concat(valueFieldsValues, keyFieldsValues);

          where = whereQuery(keyFields);
          
          query = 'UPDATE ' + tableName + ' SET ' +  createUpdateQuery(valueFields) + ' WHERE ' + where;

          return self.exec(query, fieldValues);
      };

      Cache.prototype.upsert = function(tableName, tableData) {
        var self = this;

        var fieldNames = _.keys(tableData);
        var fieldValues = _.values(tableData);

        var query = 'INSERT OR REPLACE INTO ' + tableName + ' (' + fieldNames.join(',') + ') ' + ' VALUES (' + createPlaceholderQuestionmark(fieldNames) + ')';

        return self.exec(query, fieldValues);
      };

      /**
       * Method to get single record
       *
       * @param {String} tableName - Name of table to perform the transaction
       * @returns {Promise} - Returns angularjs promise
      */
      Cache.prototype.select = function(tableName, tableData, keyFields) {
          var self = this;
          var query;
          var fieldNames = Object.keys(tableData);
          var where;
          var keyFieldsValues;

          keyFieldsValues = keyFields.map(function(keyField) {
            return tableData[keyField];
          });

          where = whereQuery(keyFields);

          query = 'SELECT ' + fieldNames.join(',') + ' FROM ' + tableName + ' WHERE ' + where;
          return self.exec(query, keyFieldsValues);

      };
      
      
      /**
       * Method to get all records
       *
       * @param {String} tableName - Name of table to perform the transaction
       * @returns {Promise} - Returns angularjs promise
      */
      Cache.prototype.selectAll = function(tableName) {
          var self = this;
          var query = 'SELECT * FROM ' + tableName;
          return self.exec(query, []);
      };


      /**
       * Method to delete a record with unique Id
       *
       * @param {Array} fieldNames - Name of fields to perform the transaction
       * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
       * @param {String} tableName - Name of table to perform the transaction
       * @returns {Promise} - Returns angularjs promise
      */
      Cache.prototype.delete = function(tableName, tableData, keyFields) {
          var self = this;
          var query;
          var fieldNames = Object.keys(tableData);
          var where;
          var keyFieldsValues;

          keyFieldsValues = keyFields.map(function(keyField) {
            return tableData[keyField];
          });

          where = whereQuery(keyFields);

          query = 'DELETE FROM ' + tableName + ' WHERE ' + where;

          return self.exec(query, keyFieldsValues);
      };

      /**
       * Method to delete a record with unique Id
       *
       * @param {Array} fieldNames - Name of fields to perform the transaction
       * @param {Array} fieldValues - Value of fields to perform the transaction including the Id
       * @param {String} tableName - Name of table to perform the transaction
       * @returns {Promise} - Returns angularjs promise
      */
      Cache.prototype.query = function(query, fieldValues) {
          var self = this;
          return self.exec(query, fieldValues);
      };

      Cache.prototype.bulkUpsert = function(tableName, dataList, keyFields) {
        var self = this;

        return $q.all(dataList.map(function(data) {
          return self.upsert(tableName, data, keyFields);
        }));
        
      };

      Cache.prototype.drop = function(tableName) {
        var self = this;
        var query = 'DROP TABLE IF EXISTS ' + tableName;
        return self.exec(query, []);
      }

      Cache.prototype.sqlBatch = function(queries) {
        var self = this;
        if(typeof self.db.sqlBatch !== 'undefined') {
          return $q(function(resolve, reject){
            self.db.sqlBatch(queries, function() {
              resolve('Batch transaction success');
            }, function(error) {
              reject(error.message);
            });
          });
        } else {
          return $q.all(queries.map(function(query) {
            if(_.isArray(query)) {
              if(query.length >= 2) {
                return self.exec(query[0], query[1]);
              }
              else{
                return self.exec(query[0], []);
              }
            }
            return self.exec(query, []);
          }));
        }
      }

      return new Cache();
  }


  }

