(function () {
        'use strict';

        angular.module('uzedoApp')
            .controller('ExperimentController', ExperimentController);

        ExperimentController.$inject = ['$scope', '$http'];

        function ExperimentController($scope, $http, $httpBackend) {

            console.log($httpBackend !== undefined);

            $scope.userData = {};
            $scope.errorMessages = [];
            $scope.greeting = "Module works!";

            $scope.getCustomers = function() {
                $scope.saving = true;
                $http.
                get('/customers', $scope.userData).
                success(function(data) {
                    $scope.userData = data;
                    $scope.saving = false;
                    $scope.success = true;
                }).
                error(function(err) {
                    console.log(err);
                    $scope.saving = false;
                    $scope.error = err;
                });
            };


        }
})();
