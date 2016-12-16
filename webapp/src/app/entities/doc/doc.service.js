(function() {
    'use strict';
    angular.module('uzedoApp')
        .factory('Doc', Doc);

    Doc.$inject = ['$resource', 'API_PATH'];

    function Doc ($resource, API_PATH) {
        var resourceUrl =  API_PATH + 'document/:id';

        return $resource(resourceUrl, {id: '@id'}, {
            'query': { method: 'GET', url: API_PATH + 'document/list', isArray: true, params:{sort: "created,desc"}},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'save': { method:'POST', url: API_PATH + 'document/save'},
            'documentTypes': {method: 'GET', url: API_PATH + 'document/documentTypes', isArray: true}
        });
    }
})();
