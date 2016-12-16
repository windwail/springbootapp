(function() {
    'use strict';

    angular.module('uzedoApp')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$state', 'Operator', 'SettingsService', 'OperatorAuth', 'AlertService'];

    function SettingsController ($state, Operator, SettingsService, OperatorAuth, AlertService) {
        var vm = this;

        vm.save = save;
        vm.operator = null;
        vm.testOperator = testOperator;

        if(SettingsService.getOperator()){
            vm.operator = SettingsService.getOperator();
        }

        Operator.query(function (result) {
            vm.operators = result;
        });

        function save() {
            SettingsService.setOperator(vm.operator);
            $state.go('home');
        }

        function testOperator(event){
            event.preventDefault();
            var info = null;

            for(var i=0; i<vm.operators.length; i++){
                 if(vm.operators[i].code === vm.operator){
                     info =  vm.operators[i];
                     break;
                 }
            }

            if(info.authType.indexOf("Certificate")>-1){
                OperatorAuth.authenticate({force:true, operator:info.code}).then(function(token){
                    if(token){
                        AlertService.success("csp.auth.success")
                    }
                }).catch(function(err){
                    AlertService.error(err.message || err, err)
                });
            }else{
                AlertService.warning("csp.auth.unknown_method");
            }
        }
    }
})();
