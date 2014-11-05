(function() {

	var dependencies = null;

	/*{ //Example
		paths:{
			jquery: '',
			underscore: '',
			backbone: '',
			main: '',
			duck:'',
			cow: '',
			barn: '',
			farm: ''
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
	};*/

	//used internally
	var loadOrder = [];

	//Helper Functions
	function _isInArray(resource, array) {
		for (var i = 0; i < array.length; i++) {
			if(array[i] === resource) {
				return true;
			}
		}
		return false;
	}

	//schema checker
	function _schemaChecker() {
		var paths = dependencies.paths;
		var head = dependencies.head;
		var foot = dependencies.foot;
		var deps = dependencies.deps;
		var key;
		var i,z = 0;

		if(!paths || !head || !foot || !deps ) {
			console.log("");
			return false;
		}

		//See if all the paths are either appended to the head or the foot
		for(key in paths) {
			if(!_isInArray(key,head) && !_isInArray(key,foot)) {
				console.log("You must have all js sources placed either in the head or/and the foot");
				return false;
			}
		}

		//See if all dependencies and dependency mappings have assigned paths 
		for(key in deps) {
			if(paths.hasOwnProperty(key)) {
				for (i = 0; i < deps[key].length; i++) {
					if(!paths.hasOwnProperty(deps[key][i])) {
						console.log("dependency mappings must be assigned paths");
						return false;
					}					
				}
			}
			else {
				console.log("dependencies must be assigned paths");
				return false;
			}
		}

		//Check for mapping loops
		for(key in deps) {
			for (i = 0; i < deps[key].length; i++) {
				//can't have:
				//key -> dep[key]
				// and 
				//dep[key] -> key
				var key2 = deps[key][i];
				if(deps.hasOwnProperty(key2)) {
					for(z = 0; z < deps[key2].length; ++z){
						if(deps[key2][z] === key) {
							console.log("looping dependencies are not allowed");
							return false;
						}
					}
				}
			}
		}

		return true;
	}

	function _isAppended(resource){
		for (var i = 0; i < loadOrder.length; i++) {
			if(loadOrder[i] === resource) {
				return true;
			}
		}
		return false;
	}

	function _getDeps(key){
		var js_dep = "";
		for (var i = 0; i < dependencies.deps[key].length; i++) {
			js_dep = dependencies.deps[key][i];
			if(!_isInArray(js_dep,loadOrder)) {
				if(dependencies.deps.hasOwnProperty(js_dep)) {
					_getDeps(js_dep);
				}
				else {
					loadOrder.push(" > " + js_dep);
				}				
			}
		}
		if(!_isInArray(key,loadOrder)) {
			loadOrder.push(key);
		}
		
	}

	//Order dependencies
	function _orderDeps(){
	
		for(var key in dependencies.paths){
			if(!dependencies.deps.hasOwnProperty(key)) {
				loadOrder.push(key);
			}
		}

		for(var key in dependencies.paths){
			if(dependencies.deps.hasOwnProperty(key)) {
				_getDeps(key);
			}
		}	

		if(_checkHeadAndFoot()) {
			for (var i = 0; i < loadOrder.length; i++) {
				loadJs(dependencies.paths[loadOrder[i]], function(){});				
			}
		}
	}

	function _checkHeadAndFoot() {
		var head = dependencies.head;
		var foot = dependencies.foot;

		var temp_head = [];
		var temp_foot = [];
		var temp_load_order = [];

		for (var i = 0; i < loadOrder.length; i++) {
			if(_isInArray(loadOrder[i],head)) {
				temp_load_order.push(loadOrder[i]);
			}
			else {
				temp_load_order.push(loadOrder[i]);
			}
		}

		for (var z = 0; z < loadOrder.length; z++) {
			if(loadOrder[z] !== temp_load_order[z]) {
				console.log("The dependencies you have in the head and the foot do not satisfy the order they need to loaded");
				return false;
			}			
		}

		return true;
	}

	// Main Functions

	function init(deps) {

		dependencies = deps;
		if(dependencies !== null &&  _schemaChecker()) {
			_orderDeps();
		}

	}
	
	// print order after init is called
	function print() {
		for (var i = 0; i < loadOrder.length; i++) {
			console.log(loadOrder[i]);
		}
	}

	//This function is also used in the init process
	function loadJs(url, callback) {
	  var js = document.createElement('script');
	  js.async = false;
	  js.src = url;
	  var s = document.getElementsByTagName('script')[0];

	  js.onload = callback;

	  s.parentNode.insertBefore(js, s);
	}

	window.DM = {
		init: init,
		print:print,
		loadJs: loadJs
	};
	
})();
