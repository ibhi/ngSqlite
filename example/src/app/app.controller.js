(function() {
	'use strict';
	angular.module('app')
		.controller('AppController', AppController);
	AppController.$inject = ['cache'];
	function AppController(cache) {
		var vm = this;

		var tableName = 'accounts';

		vm.table = {};
		vm.table.name = 'demo'; 

		vm.table.columns = [{
        	name: 'Id',
        	type: 'TEXT',
        	primary: false,
        	unique: false,
        	notnull: false

        }];

        if(window.localStorage.getItem('table')) {
        	vm.table = JSON.parse(window.localStorage.getItem('table'));
        }

		vm.data = [{
    		Id: '123',
    		FirstName: 'John',
    		LastName: 'Doe',
    		Email: 'johndoe@test.com',
    		MobilePhone: '123456789'
    	},{
    		Id: '456',
    		FirstName: 'Jean',
    		LastName: 'Doe',
    		Email: 'jeandoe@test.com',
    		MobilePhone: '34568790'
    	},{
    		Id: '678',
    		FirstName: 'Arnold',
    		LastName: 'Swaz',
    		Email: 'arnold@test.com',
    		MobilePhone: '456789102'
    	}];

		// cache.init();

		vm.createTable = function() {
		  // 'Id text primary key, FirstName text, LastName text, Email text'
		  var fieldSpec = {
		    Id: {
		      type: 'TEXT',
		      primary: true
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

		var testData = {
		  Id: 'gef',
		  FirstName: 'Iron Man',
		  LastName: 'Man',
		  Email: 'ironman@gmail.com'
		};

		var fieldNames = _.keys(testData);
		var fieldValues = _.values(testData);


		vm.createRecord = function() {
		  

		  cache.upsert(tableName, testData).then(function(result) {
		    console.log(result);
		  }, function(error) {
		    console.log(error);
		  });

		};

		vm.retrieveAll = function() {
		  cache.selectAll(tableName).then(function(result) {
		    console.log(result);
		  }, function(error) {
		    console.log(error);
		  });
		}

		vm.retrieve = function() {
		  var testData = {
		    Id: null,
		    FirstName: 'Test Man',
		    LastName: 'Man',
		    Email: null
		  };

		  cache.select(tableName, testData, ['FirstName', 'LastName']).then(function(result) {
		    console.log(result);
		  }, function(error) {
		    console.log(error);
		  });
		}

		vm.update = function() {
		  var testData = {
		    Id: 'gef',
		    FirstName: 'Test Man',
		    LastName: 'Man',
		    Email: 'testman@gmail.com'
		  };
		  cache.upsert(tableName, testData, ['FirstName', 'LastName']).then(function(result) {
		    console.log(result);
		  }, function(error) {
		    console.log(error);
		  });
		}

		vm.delete = function() {
		  var testData = {
		    Id: 'gef'
		  };
		  cache.delete(tableName, testData, ['Id']).then(function(result) {
		    console.log(result);
		  }, function(error) {
		    console.log(error);
		  });
		}

		vm.bulkUpsert = function() {
		  var testData = [{
		    Id: 'cde',
		    FirstName: 'Ayeesha Siddikka',
		    LastName: 'Ibrahim'
		  },{
		    Id: 'adf',
		    FirstName: 'Ayeesha Siddikka',
		    LastName: 'Ibrahim'
		  }];
		  cache.bulkUpsert(tableName, testData, ['Id']).then(function(result) {
		    console.log(result);
		  }, function(error) {
		    console.log(error);
		  });
		}
	}
})()