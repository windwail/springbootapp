(function() {
    'use strict';
    angular.module('uzedoApp')
        .factory('Baskets', Baskets);

    Baskets.$inject = ['$resource', 'API_PATH'];

    function Baskets ($resource, API_PATH) {
        var resourceUrl =  API_PATH + 'baskets/:id';

        return $resource(resourceUrl, {id: '@id'}, {
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    }
})();
