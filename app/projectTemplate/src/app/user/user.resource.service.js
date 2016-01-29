/**
 * UserResourceService
 * This service is to be initialized as a factory by calling the factory method.
 * It's a resource provider service that works with ngResource module.
 * the user service
 */
export default class UserResourceService {

    constructor() {
    }

    /**
     * Returns the ngResource instance.
     */
    static factory($resource){
        "ngInject";

        return $resource("api/rest/resources/users/:id", {}, {
            "get": {method: "GET", isArray: false},
            "query": {method: "GET", isArray: false},
            "save": {method: "POST", isArray: false},
            "update": {method: "PUT", isArray: false},
            "delete": {method: "DELETE", isArray: false}
        });
    }

}
