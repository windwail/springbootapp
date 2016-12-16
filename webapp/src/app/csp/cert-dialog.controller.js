(function() {
    'use strict';

    angular.module('uzedoApp')
        .controller('CertDialogController',CertDialogController);

    CertDialogController.$inject = ['$scope','$uibModalInstance','certs'];

    function CertDialogController($scope, $uibModalInstance, certs) {
        var vm = this;

        vm.clear = clear;
        vm.save = save;
        vm.certs = certs;
        vm.selectedIndex = -1;


        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save (){
            if(vm.selectedIndex*1>-1){
               var cert = vm.certs[vm.selectedIndex*1];
               $uibModalInstance.close(cert);
            }
        }

    }
})();
