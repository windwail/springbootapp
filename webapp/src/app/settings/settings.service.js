(function() {
    'use strict';

    angular.module('uzedoApp')
        .factory('SettingsService', SettingsService);

    SettingsService.$inject = ['$cookies'];

    function SettingsService($cookies) {

        var service = {
            getOperator : getOperator,
            setOperator : setOperator
        };

        return service;

        function getOperator() {
            return $cookies.get("operatorCode");
        }

        function setOperator(code){
            var d = new Date();
            d.setDate(d.getDate() + 365);
            $cookies.put("operatorCode", code, {expires: d});
        }
    }
})();
