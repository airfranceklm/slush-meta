import UsersMock from "./users/users.mock";
import angular from "angular";
import {} from "angular-mocks";
import AppMock from "./app.mock";
import ImageMock from "./image.mock.directive";
import BackendLocatorService from "./backendLocator.service";

/*eslint no-unused-vars: 0*/
let moduleName = "app.mock";
export default moduleName;

let module = angular
    .module(moduleName, [
        "ngMockE2E"
    ]);

module.constant("mockPicturePathPattern", /users\/\d+\/picture/)
module.constant("picturePlaceholder", "img/annonymous.jpg")
module.constant("restUrl", "api/rest/resources")
module.service("backendLocatorService", BackendLocatorService)
module.directive("img", ImageMock.factory)
module.run(AppMock.initMock);
module.run(UsersMock.initMock);
