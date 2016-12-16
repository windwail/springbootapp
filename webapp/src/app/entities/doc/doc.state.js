(function() {
    'use strict';

    angular.module('uzedoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('doc', {
            parent: 'app',
            url: '/doc',
            views: {
                'content@': {
                    templateUrl: 'app/entities/doc/doc.html',
                    controller: 'DocController',
                    controllerAs: 'vm'
                }
            },
            resolve: {entity: angular.noop}
        })
        .state('doc-new', {
            parent: 'app',
            url: '/doc',
            views: {
                'content@': {
                    templateUrl: 'app/entities/doc/doc.html',
                    controller: 'DocController',
                    controllerAs: 'vm'
                }
            },
            resolve: {entity: angular.noop}
        })
        .state('doc-view', {
            parent: 'app',
            url: '/doc/{id}',
            views: {
                'content@': {
                    templateUrl: 'app/entities/doc/doc.html',
                    controller: 'DocController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Doc', function($stateParams, Doc) {
                    return Doc.get({id : $stateParams.id}).$promise;
                }]
            }
        })

        ;
    }
})();
