(function() {

	angular.module("uzedoApp", [])
		.controller('MyCoolController',function($scope, $http) {

			$scope.data = "Me";

			$http.get('/customers').then(function(response) {
				$scope.data = response.data;
			});

		});

})();
