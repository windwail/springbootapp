(function() {

	angular.module("uzedoApp", [])
		.controller('MyCoolController',function($scope, $http) {

			$scope.data = "Me";

			$http.get('/customers?some=shit').then(function(response) {
				console.log(response.data);
				$scope.data = response.data;
			});

		});

})();
