(function() {
    'use strict';

    angular.module('uzedoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('settings', {
            parent: 'app',
            url: '/settings',

            views: {
                'content@': {
                    templateUrl: 'app/settings/settings.html',
                    controller: 'SettingsController',
                    controllerAs: 'vm'
                }
            }
        });
    }

})();
