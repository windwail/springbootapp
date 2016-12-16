(function() {
    'use strict';

    angular.module('uzedoApp')
        .controller('DocListController', DocListController);

    DocListController.$inject = ['$rootScope','$scope', '$state', 'Doc', 'EVENT_BASKET_OPEN', 'uibPaginationConfig'];

    function DocListController ($rootScope, $scope, $state, Doc, EVENT_BASKET_OPEN, uibPaginationConfig) {
        var vm = this;

        vm.showDocuments = showDocuments;
        vm.loadPage = loadPage;
        vm.docSign = docSign;
        vm.selectedDocs = selectedDocs;

        vm.selected = undefined;
        vm.filter = "";
        vm.currentBasket = undefined;
        vm.currentPage = 1;
        vm.totalItems = null;

        //подписка на событие перехода в корзины
        var cleanBasketOpenListener = $rootScope.$on(EVENT_BASKET_OPEN, function (event, basketId) {
            vm.currentBasket = basketId;
            vm.loadPage(1);
        });

        //проверим не открыли ли корзину по прямому адресу (F5)
        if($state.params.basket && $state.params.basket != ""){
            vm.currentBasket = $state.params.basket;
            vm.loadPage(1);
        }

        function docSign() {
            var docIds = vm.selectedDocs();
            if(docIds) {
                alert("sign: " + docIds);
            }
        }

        function selectedDocs() {
            if(vm.selected) {
                return vm.documents.filter(function(doc){
                    return vm.selected[doc.id]
                });
            }
            return undefined;
        }

        function loadPage(pageNumber) {
            vm.currentPage = pageNumber;
            this.showDocuments(vm.currentBasket);
        }

        function showDocuments(basket, $event){
            Doc.query({
                basketId: basket,
                page: vm.currentPage-1,
                searchTerm: vm.filter,
                size: uibPaginationConfig.itemsPerPage
            }, function(result, headers){
                vm.documents = result;
                vm.totalItems = headers('X-Total-Count');
            });

            if($event) {
                // Prevent bubbling to showItem.
                // On recent browsers, only $event.stopPropagation() is needed
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }
        }


        //чистка подписки на событие
        $scope.$on('$destroy', function () {
            if(angular.isDefined(cleanBasketOpenListener) && cleanBasketOpenListener !== null){
                cleanBasketOpenListener();
            }
        });

    }
})();
