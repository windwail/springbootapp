


describe('getDiv', function () {

    var $httpBackend, $rootScope, createController, authRequestHandler, controller;

    // Set up the module
    beforeEach(module('uzedoApp'));

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('MyCoolController', {'$scope' : $rootScope });
        };
    }));

    it('mock http call', function () {

        authRequestHandler = $httpBackend.when('GET', '/customers')
            .respond({userId: 'userX'}, {'A-Token': 'xxx'});

        $httpBackend.expectGET('/customers');

        var controller = createController();

        console.log(controller);

        $httpBackend.flush();

    });

});