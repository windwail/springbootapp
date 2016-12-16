describe('getDiv', function () {

    beforeEach(module('uzedoApp'));

    afterEach(inject(function ($httpBackend) {
        //These two calls will make sure that at the end of the test, all expected http calls were made
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('Should exist', function () {
        expect(true).toBe(true);
    });

    it('mock http call', inject(function ($httpBackend, User) {
        var resource = new User();

        //Create an expectation for the correct url, and respond with a mock object
        $httpBackend.expectGET('client_api/user').respond(200, JSON.stringify({
            name: "dev_mode",
            roles: ["USER", "ADMIN"]
        }));

        //Make the query
        resource.$query();

        //Because we're mocking an async action, ngMock provides a method for us to explicitly flush the request
        $httpBackend.flush();

        //Now the resource should behave as expected
        expect(resource.name).toBe('dev_mode');
    }));
});