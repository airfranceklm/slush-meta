/**
 * <%= _.capitalize(resourceName) %>Route
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the <%= resourceName %> module using ui-router
 */
export default class <%= _.capitalize(resourceName) %>Route {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     */
    static initRoute($stateProvider){
        "ngInject";


        $stateProvider
            .state("<%= resourceNamePlural %>", {
                url: "/<%= resourceNamePlural %>",
                templateUrl: "app/<%= resourceName %>/<%= resourceName %>.list.html",
                controller: "<%= _.capitalize(resourceName) %>Controller",
                controllerAs: "<%= controllerName %>"
            });


    }

}
