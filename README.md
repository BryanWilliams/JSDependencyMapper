JSDependencyMapper
==================

This little module allows you to map dependencies in an existing project (like in requirejs).  This project is meant to assist in the maintainability of existing software projects which are reliant on javascript files loading synchronously.

EX:

var deps = { //Example
		paths:{
			jquery: '/path/to/js.js',
			underscore: '/path/to/js.js',
			backbone: '/path/to/js.js',
			main: '/path/to/js.js',
			duck:'/path/to/js.js',
			cow: '/path/to/js.js',
			barn: '/path/to/js.js',
			farm: '/path/to/js.js'
		},
		head: ['jquery','underscore','backbone'],
		foot: ['main','barn','farm','duck','cow'],
		deps:{
			main:['backbone'],
			backbone: ['underscore','jquery'],
			farm:['main'],
			barn: ['farm','jquery'],
			duck: ['barn'],
			cow: ['barn']
		}
	};

	DM.init(deps);
	DM.print();
