(function() {
    'use strict';

    angular.module('uzedoApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'VERSION', 'User'];

    function NavbarController ($state, VERSION, User) {
        var vm = this;

        vm.VERSION = VERSION;
        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = true;
        vm.user = null;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;

        User.get(function (result) {
            vm.user = result;
        });

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }
    }
})();
