(function() {


    angular.module('uzedoApp')
        .run(function() {
            console.log("registrrrr");
        });

    var myAppDev = angular.module('asdf', ['uzedoApp', 'ngMockE2E']);

    myAppDev.run(function ($httpBackend) {

        console.log("REGISTER");

        $httpBackend
            .whenGET(/^documentTypes.*/)
            .respond(["1", "2", "3"]);

        //$httpBackend.whenGET(/[\s\S]*/).passThrough();

    });



})();
