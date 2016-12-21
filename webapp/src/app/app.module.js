(function() {

	angular.module("uzedoApp", ['ngMockE2E'])
		.controller('MyCoolController',function($scope, $http) {

			$scope.data = "Me";
			$scope.cata = {};

			$http.get('/customers?some=shit').then(function(response) {
				console.log(response.data);
				$scope.data = response.data;
			});

            $http.get('/data?some=shit').then(function(response) {
                console.log(response.data);
                $scope.cata = response.data;
            });

		})
		.run(function($httpBackend){
			console.log("httpBackend inited => "+!!$httpBackend)

            $httpBackend
                .whenGET(/^\/customers.*/)
                .respond(["1", "2", "3"]);

            $httpBackend.whenGET(/[\s\S]*/).passThrough();

		});

})();
