import angular from 'angular';
import moduleApp from 'app/app.module';
import moduleMock from '../../mock/mock.module';
import AppMock from "../../mock/app.mock";
import 'angular-mocks';
import "json.date-extensions";

JSON.useDateParser();

describe('CurrentUser', function() {
	beforeEach(angular.mock.module(moduleApp));
	beforeEach(angular.mock.module(moduleMock));

	var userResourceService, $rootScope, $httpBackend, restUrl, backendLocatorService;

	beforeEach(inject(function(_userResourceService_, _$rootScope_, _$httpBackend_,  _restUrl_, _backendLocatorService_) {
		$httpBackend = _$httpBackend_;

		userResourceService = _userResourceService_;
		$rootScope = _$rootScope_;
		restUrl = _restUrl_;
		backendLocatorService = _backendLocatorService_;

	}));

	//This test is a dummy test and has no real use.
	describe('.get', function() {
		it('has a user', function() {
			var user;
			user = userResourceService.query();
			console.log(JSON.stringify(user));
			expect(user).not.toBe(undefined);
		});
	});

});
