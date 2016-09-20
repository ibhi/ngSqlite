ngSqlite
=================

This library is a simple angular wrapper for [cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage) cordova plugin. With this library you dont have to write sql queries and do transactions. This wrapper provides convinence methods for common CRUD operations like createTable, upsert, delete, etc. Also you can use plain POJO's( Plain old javascript objects ) as inputs for these operations.

**Note**: Though this wrapper is designed to be used in cordova based applications, this wrapper will also support HTML5 WebSQL (which is deprecated) which is still available in some browsers like chrome. So if you are using this library in a browser based application, it will fallback to use WebSQL instead of Sqlite.

## How to install

`bower install ngSqlite --save`

## Dependencies
As this library is a angular wrapper on top of cordova-sqlite-storage, obviously we need *angular* and *cordova-sqlite-storage* plugin. Apart from these two the obly dependency needed is *lodash*. If you install this package through bower, then angular and lodash will be installed along with this package.

## Getting Started
* Inject `ngSqlite` module as a dependency in your app module

```javascript
    angular.module('app', ['ngSqlite']);
```

* Inject `cacheProvider` in the config block of your angular app and configure the name of the DB and its location

```javascript
angular.module('app')
        .config(appConfig);

    function appConfig(cacheProvider) {
        var cfg = {
            dbName: 'app',
            dbLocation:'default'
        }
        cacheProvider.config(cfg);
    }
```

* Ininitalize the DB either in run block or in any of your controllers by injecting the `cache` servic and calling its `init` method

```javascript
angular.module('app')
        .run(appRun);

    function appRun(cache) {
        cache.init();
    }
```

* Next, you can inject `cache` service in any controller or service and start using the convinience methods provided by the wrapper. All the methods of this service returns an angularjs promise that you can resolve using `then`.

```javascript
angular
    .module('app')
    .controller('DashboardController', DashboardController);

    function DashboardController(cache) {
        var vm = this;
        var tableName = 'demo';
        //Create Table
        vm.createTable = function() {
          // 'Id text primary key, FirstName text, LastName text, Email text'
          var fieldSpec = {
            Id: {
              type: 'TEXT',
              primary: true,
              notnull: true
            },
            FirstName: {
              type: 'TEXT'
            },
            LastName: {
              type: 'TEXT'
            },
            Email: {
              type: 'TEXT'
            }
          }
          cache.createTable(tableName, fieldSpec).then(function(result) {
            console.log(result);
          }, function(error) {
            console.log(error);
          });

        };
        
        // Create/Insert record
        vm.createRecord = function() {
            var testData = {
                Id: 'ave',
                FirstName: 'Tony',
                LastName: 'Stark',
                Email: 'tonystark@test.com'
            };
            cache.insert(tableName, testData).then(function(result) {
                console.log(result);
            }, function(error) {
                console.log(error);
            });

        };
        
        //Retrieve record with where clause
        vm.retrieve = function() {
            var testData = {
                Id: null,
                FirstName: 'Tony',
                LastName: 'Stark',
                Email: null
            };

            cache.select(tableName, testData, ['FirstName', 'LastName']).then(function(result) {
                console.log(result);
            }, function(error) {
                console.log(error);
            });
        };
        
        // Retrieve all records
        vm.retrieveAll = function() {
            cache.selectAll(tableName).then(function(result) {
                console.log(result);
            }, function(error) {
                console.log(error);
            });
        };
        
        // Update record - keyFields parameter is mandatory as it is used in where clause of the query for udpate
        vm.update = function() {
            var testData = {
                Id: 'ave',
                FirstName: 'Tony Iron Man',
                LastName: 'Stark',
                Email: 'tonystark@gmail.com'
            };
            cache.upsert(tableName, testData, ['Id']).then(function(result) {
                console.log(result);
            }, function(error) {
                console.log(error);
            });
        };

        // Upsert record - Inserts a new record or replaces existing record with the new values (Note: Upsert deletes the matching row and inserts a new row with the provided new values. Also upsert uses primary or unique fields for upsert transaction)
        vm.update = function() {
            var testData = {
                Id: 'ave',
                FirstName: 'Tony Iron Man',
                LastName: 'Stark',
                Email: 'tonystark@gmail.com'
            };
            cache.upsert(tableName, testData, ['Id']).then(function(result) {
                console.log(result);
            }, function(error) {
                console.log(error);
            });
        };

        // Delete record by its Id
        vm.delete = function() {
            var testData = {
                Id: 'ave'
            };
            cache.delete(tableName, testData, ['Id']).then(function(result) {
                console.log(result);
            }, function(error) {
                console.log(error);
            });
        };
        
        // Bulk upsert
        vm.bulkUpsert = function() {
            var testData = [{
                Id: 'cde',
                FirstName: 'Peter',
                LastName: 'Parker',
                Email: 'spiderman@test.com'
            },{
                Id: 'adf',
                FirstName: 'Steve',
                LastName: 'Rogers',
                Email: 'captainamerica@test.com'
            }];
            cache.bulkUpsert(tableName, testData, ['Id']).then(function(result){
                console.log(result);
            }, function(error) {
                console.log(error);
            });
        };

        // Raw query - Exploit full power of raw queries
        vm.query = function() {
            var query = 'SELECT * FROM demo ORDER BY LastName';
            
            cache.query(query, []).then(function(result) {
                    console.log(result);
                }, function(error) {
                    console.log(error);
                });

        };

        // sql batch transactions - A wrapper around sqlBatch method
        vm.sqlBatch = function() {
            var queryList = [
                'CREATE TABLE IF NOT EXISTS DemoTable (name, core), 
                [ 'INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101] ], 
                [ 'INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202] ]
            ];

            cache.sqlBatch(queryList).then(function(result) {
                    console.log(result);
                }, function(error) {
                    console.log(error);
                });
        };

    }
```

## Sample App
Refer the [example](../master/example) folder in this repo for a fully functioning browser app. The same code can be used in cordova app as well :)

## API Reference
**TODO**
