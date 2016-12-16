(function() {
    'use strict';
    angular.module('uzedoApp')
        .factory('Operator', Operator);

    Operator.$inject = ['$resource', 'API_PATH'];

    function Operator ($resource, API_PATH) {
        var resourceUrl =  API_PATH+'operator/info';

        return $resource(resourceUrl, null, {
            'query': {
                method: 'GET',
                isArray: true
            }

        });
    }
})();
