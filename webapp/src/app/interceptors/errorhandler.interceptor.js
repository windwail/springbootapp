(function() {
    'use strict';

    angular.module('uzedoApp')
        .factory('errorHandlerInterceptor', errorHandlerInterceptor);

    errorHandlerInterceptor.$inject = ['$q', '$rootScope', 'MODULE_NAME'];

    function errorHandlerInterceptor ($q, $rootScope, MODULE_NAME) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError (response) {
            if (!(response.status === 401 && response.data === '')) {
                $rootScope.$emit(MODULE_NAME+'.httpError', response);
            }
            return $q.reject(response);
        }
    }
})();
