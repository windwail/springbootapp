(function() {
    'use strict';

    angular.module('uzedoApp')
        .config(compileServiceConfig);

    compileServiceConfig.$inject = ['$compileProvider'];

    function compileServiceConfig($compileProvider) {
        // disable debug data on prod profile to improve performance
        $compileProvider.debugInfoEnabled(true);
        
        /*
        If you wish to debug an application with this information
        then you should open up a debug console in the browser
        then call this method directly in this console:

		angular.reloadWithDebugInfo();
		*/
    }
})();
