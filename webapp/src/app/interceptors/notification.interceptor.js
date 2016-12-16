(function() {
    'use strict';

    angular.module('uzedoApp')
        .factory('notificationInterceptor', notificationInterceptor);

    notificationInterceptor.$inject = ['$q', 'AlertService', 'MODULE_NAME'];

    function notificationInterceptor ($q, AlertService, MODULE_NAME) {
        var service = {
            response: response
        };

        return service;

        function response (response) {
            var alertKey = response.headers('X-'+MODULE_NAME+'-alert');
            if (angular.isString(alertKey)) {
                AlertService.success(alertKey, { param : response.headers('X-'+MODULE_NAME+'-params')});
            }
            return response;
        }
    }
})();
