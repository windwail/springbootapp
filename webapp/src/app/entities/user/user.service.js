(function() {
    'use strict';
    angular.module('uzedoApp')
        .factory('User', User);

    User.$inject = ['$resource', 'API_PATH'];

    function User ($resource, API_PATH) {
        var resourceUrl =  API_PATH+'user';

        return $resource(resourceUrl, null, {
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
