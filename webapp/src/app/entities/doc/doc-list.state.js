(function() {
    'use strict';

    angular.module('uzedoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', 'EVENT_BASKET_OPEN'];

    function stateConfig($stateProvider, EVENT_BASKET_OPEN) {
        $stateProvider.state('docList', {
            parent: 'app',
            url: '/docList',
            views: {
                'content@': {
                    templateUrl: 'app/entities/doc/doc-list.html',
                    controller: 'DocListController',
                    controllerAs: 'vm'
                }
            }
        });

        $stateProvider.state('docListBasket', {
            parent: 'docList',
            url: '/{basket}',
            onEnter: ['$stateParams', '$rootScope', function($stateParams, $rootScope) {
                if($stateParams.basket){
                    $rootScope.$emit(EVENT_BASKET_OPEN, $stateParams.basket);
                }
            }]
        });
    }
})();
