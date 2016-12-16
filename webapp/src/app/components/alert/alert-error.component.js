(function() {
    'use strict';

    var lbAlertError = {
        template: '<div class="alerts" ng-cloak="">' +
                        '<div ng-repeat="alert in $ctrl.alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                            '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close($ctrl.alerts)"><pre>{{ alert.msg }}</pre></uib-alert>' +
                        '</div>' +
                  '</div>',
        controller: AlertErrorController
    };

    angular.module('uzedoApp')
        .component('lbAlertError', lbAlertError);

    AlertErrorController.$inject = ['$scope', 'AlertService', '$rootScope', '$translate', 'MODULE_NAME'];

    function AlertErrorController ($scope, AlertService, $rootScope, $translate, MODULE_NAME) {
        var vm = this;

        vm.alerts = [];

        function addErrorAlert (message, key, data) {
            key = key && key !== null ? key : message;
            vm.alerts.push(
                AlertService.add(
                    {
                        type: 'danger',
                        msg: key,
                        params: data,
                        timeout: 0,
                        toast: AlertService.isToast(),
                        scoped: true
                    },
                    vm.alerts
                )
            );
        }

        var cleanHttpErrorListener = $rootScope.$on(MODULE_NAME+'.httpError', function (event, httpResponse) {
            var i;
            event.stopPropagation();
            switch (httpResponse.status) {
            // connection refused, server not reachable
            case 0:
                addErrorAlert('Server not reachable','error.NO_RESPONSE');
                break;
            case -1:
                addErrorAlert('Server not reachable','error.NO_RESPONSE');
                break;

            case 400:
                var errorHeader = httpResponse.headers('X-'+MODULE_NAME+'-error');
                var entityKey = httpResponse.headers('X-'+MODULE_NAME+'-params');
                if (errorHeader) {
                    var entityName = $translate.instant('global.menu.entities.' + entityKey);
                    addErrorAlert(errorHeader, errorHeader, {entityName: entityName});
                } else if (httpResponse.data && httpResponse.data.fieldErrors) {
                    for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
                        var fieldError = httpResponse.data.fieldErrors[i];
                        // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                        var convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                        var fieldName = $translate.instant(fieldError.objectName + '.' + convertedField);
                        addErrorAlert('Field ' + fieldName + ' cannot be empty', 'error.' + fieldError.message, {fieldName: fieldName});
                    }
                } else if (httpResponse.data) {
                    var msg = httpResponse.data.message;
                    var data = httpResponse.data;
                    if(!msg){
                        try {
                            var data = JSON.parse(httpResponse.data);
                            msg = data.message;
                        } catch (e) {
                            addErrorAlert(httpResponse.data);
                            return;
                        }
                    }
                    addErrorAlert(msg, msg, httpResponse.data);
                } else {
                    addErrorAlert(httpResponse.data);
                }
                break;

            case 404:
                addErrorAlert('Not found','error.404');
                break;

            default:
                if (httpResponse.data && httpResponse.data.message) {
                    addErrorAlert(httpResponse.data.message, "error."+httpResponse.data.message, httpResponse.data);
                } else {
                    var data = httpResponse.data;

                    try {
                        var data = JSON.parse(httpResponse.data);
                        msg = data.message;
                        addErrorAlert(msg, "error."+msg, data);
                    } catch (e) {
                        addErrorAlert(httpResponse.data);
                        return;
                    }
                }
            }
        });

        $scope.$on('$destroy', function () {
            if(angular.isDefined(cleanHttpErrorListener) && cleanHttpErrorListener !== null){
                cleanHttpErrorListener();
                vm.alerts = [];
            }
        });
    }
})();
