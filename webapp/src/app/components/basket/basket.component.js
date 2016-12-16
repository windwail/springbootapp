(function() {
    'use strict';

    var lbBasket = {
        template: '<div sir-accordion collection="vm.accordionData" config="vm.accordionConfig"></div>',
        controller: BasketController,
        controllerAs: "vm",
        bindings : {
            name : '@',
            rootPath: '@'
        }
    };

    angular.module('uzedoApp')
        .component('lbBasket', lbBasket);

    BasketController.$inject = ['$rootScope','$scope', '$state', 'Baskets', 'EVENT_BASKET_OPEN'];

    function BasketController($rootScope, $scope, $state, Baskets, EVENT_BASKET_OPEN) {
        var vm = this;
        vm.loadBasketTree = loadBasketTree;
        vm.mapBasketsToWidget = mapBasketsToWidget;
        vm.basketsById = [];

        vm.preopenedBasket = ($state.params.basket && $state.params.basket != "")? $state.params.basket : null;

        vm.accordionConfig = {
            debug: false, //For developing
            animDur: 200, //Animations duration minvalue is 0
            expandFirst: false, //Auto expand first item
            autoCollapse: true, //Auto collapse item flag
            watchInternalChanges: false, //watch internal attrs of the collection (false if not needed)
            headerClass: '', //Adding extra class for the headers
            beforeHeader: '', //Adding code or text before all the headers inner content
            afterHeader: '', //Adding code or text after all the headers inner content
            topContentClass: '', //Adding extra class for topContent
            beforeTopContent: '', //Adding code or text before all the topContent if present on item
            afterTopContent: '', //Adding code or text after all the topContent if present on item
            bottomContentClass: '', //Adding extra class for topContent
            beforeBottomContent: '', //Adding code or text before all the topContent if present on item
            afterBottomContent: '' //Adding code or text before all the topContent if present on item
        };

        vm.loadBasketTree();

        $scope.$on('sacDoneLoading', function ($event) {
            if(vm.preopenedBasket){
                if(vm.basketsById[vm.preopenedBasket]){
                    var index = vm.basketsById[vm.preopenedBasket].index;
                    $scope.$broadcast('sacExpandContentById',index)
                }
            }
        });

        function loadBasketTree() {

            if(!vm.name || vm.name==""){
                throw("Baskets name is missing!")
            }

            if(vm.name){
                Baskets.get({id:vm.name},function(result){
                    vm.baskets = result;
                    vm.accordionData = vm.mapBasketsToWidget(result);

                });
            }
        }

        function mapBasketsToWidget(baskets, parentIndex){
            if(!baskets) return [];

            var getTitle = function(basket){
                if(basket.selectable){
                    return "<a href=\"#"+(vm.rootPath || "")+basket.id+"\">"+basket.title+"</a>"
                }else{
                    return basket.title
                }
            };

            var transformFunc = function(basket){
                return {
                    //icon: basket.icon || null,
                    title: getTitle(basket),
                    id: basket.id,
                    topContent: "",
                    bottomContent: "",
                    subCollection: (basket.childBaskets && basket.childBaskets.length>0?vm.mapBasketsToWidget(basket.childBaskets, basket.index):null)

                }
            };

            var result = [];
            for(var i=0; i<baskets.length; i++){
                if(parentIndex){
                    baskets[i].index = parentIndex+"-"+(i+1);
                }else{
                    baskets[i].index = ""+(i+1);
                }

                vm.basketsById[baskets[i].id] = baskets[i];

                if(!vm.preopenedBasket){
                    if(baskets[i].selectable){
                        vm.preopenedBasket = baskets[i].id;
                        //$state.go($state.current, {basket: baskets[i].id}, { reload: true})
                        $rootScope.$emit(EVENT_BASKET_OPEN, baskets[i].id);
                    }
                }
                result.push(transformFunc(baskets[i]));
            }
            return result;
        }
    }


})();
