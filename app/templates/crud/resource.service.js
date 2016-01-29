/**
 * <%= _.capitalize(resourceName) %>ResourceService
 * This service is to be initialized as a factory by calling the factory method.
 * It's a resource provider service that works with ngResource module.
 * the <%= resourceName %> service
 */
export default class <%= _.capitalize(resourceName) %>ResourceService {

    constructor() {
    }

    /**
     * Returns the ngResource instance.
     */
    static factory($resource){
        "ngInject";

        return $resource("api/rest/resources/<%= resourceNamePlural %>/:id", {}, {
            "get": {method: "GET", isArray: false},
            "query": {method: "GET", isArray: true},
            "save": {method: "POST", isArray: false},
            "update": {method: "PUT", isArray: false},
            "delete": {method: "DELETE", isArray: false}
        });
    }

}
