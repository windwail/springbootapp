describe('my app', function () {


    var $httpBackend, $rootScope, createController, authRequestHandler;


    beforeEach(function () {

    })
    
    it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });


    it('soooo', function () {
        //var elements = element.all(protractor.By.css('.clearfix .col206'));
        browser.get('http://localhost:8000/#/docList');
        var filter = element(by.model('vm.filter'));
        expect(filter.isPresent()).toEqual(true);
        filter.sendKeys("filter it!");
        filter.getText().then(function(text) {
            console.log(text);
        });
    });

});
