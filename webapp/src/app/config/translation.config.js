(function() {
    'use strict';

    angular.module('uzedoApp')
        .config(translationConfig);

    translationConfig.$inject = ['$translateProvider'];

    function translationConfig($translateProvider) {
        // Initialize angular-translate

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('ru');

        $translateProvider.useSanitizeValueStrategy('escaped');

    }
})();
