var App  = angular.module("weatherApp", ['ngRoute', 'ngAnimate', 'weatherControllers', 'weatherServices']);

App.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/', {
		templateUrl: 'js/views/weather.html',
		controller: 'GetWeatherCtrl'
	});
}]);

var weatherControllers = angular.module("weatherControllers", []);
weatherControllers.controller("AppController", ['$route', '$routeParams', '$location', function($route, $routeParams, $location){

}]);

weatherControllers.controller("GetWeatherCtrl", ['$scope', 'weatherApi', function($scope, weatherApi){
	$scope.currentTime = moment().format('h:mm a');
	weatherApi.getLocation().then(function(res){
		weatherApi.getWeeklyWeather(res.data.city+","+res.data.country_code).then(function(response){
			$scope.data = response.data;
			if ($scope.data.list.length){
				$scope.data.list.forEach(function(i, v){
					var date = moment(i.dt * 1000);
					i.dt = {
						day: date.format("ddd")
					};
					if (moment().format("d") == date.format("d")){
						i.dt.today = true;
					}
				});
			}
		});
	});
}]);

var weatherServices = angular.module('weatherServices', []);

weatherServices.factory('weatherApi', ['myHttp', 
	function(myHttp){
		return { 
		getLocation: function() {
			return	myHttp.jsonp("http://muslimsalat.com/daily.json?callback=JSON_CALLBACK");
		},
		getWeeklyWeather: function(city){
			return myHttp.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+city+'&mode=json&units=metric');
		}
	}
}]);

weatherServices.factory('myHttp', ['$http', 'myCache',
	function($http, myCache){

		var headers = {
			'cache': myCache,
			'dataType': 'json'
		};

		var APPID = "8a707f54a62c5b0ab01b891eb5107264";
		return {
			config: headers,
			get: function(url, success, fail){
				return $http.get(url + "&APPID=" + APPID, this.config);
			},
			getlocal: function(url, success, fail){
				return $http.get(url);
			},
			jsonp: function(url, sucess, fail){
				return $http.jsonp(url, this.config);
			}
		};
	}]);

weatherServices.factory('myCache', function($cacheFactory){
	return $cacheFactory('myCache', {
		capacity: 100
	});
});

function JSON_CALLBACK(){
	//Nothing
}