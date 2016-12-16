(function() {
    'use strict';
    angular.module('uzedoApp')
        .factory('Content', Content);

    Content.$inject = ['$resource', 'API_PATH'];

    function Content ($resource, API_PATH) {
        var resourceUrl =  API_PATH + 'content/:id';

        return $resource(resourceUrl, {id: '@id'}, {
            'query': { method: 'GET', url: API_PATH + 'document/list', isArray: true, params:{sort: "name"}},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            }
        });
    }
})();
