describe('my app', function () {


    beforeEach(function() {

        browser.addMockModule('httpMocker', function() {
            angular.module('httpMocker', ['ngMockE2E'])
                .run(function($httpBackend) {
                    $httpBackend.whenGET(
                        /^\/customers.*/)
                        .respond([
                            {
                                albumId: 1,
                                id: 1,
                                title: "accusamus beatae ad",
                                url: "http://placehold.it/600/92c952",
                                thumbnailUrl: "http://placekitten.com/g/200/300"
                            }
                        ])

                })
        });

    });

    it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
        console.log(be);
        browser.get('/');
        expect(browser.getCurrentUrl()).toMatch("/");
    });

});
