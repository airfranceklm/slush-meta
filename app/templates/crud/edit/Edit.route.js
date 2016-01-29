/**
 * <%= _.capitalize(resourceName) %>EditRoute
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the <%= resourceName %>Edit module using ui-router
 */
export default class <%= _.capitalize(resourceName) %>EditRoute {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     */
    static initRoute($stateProvider){
        "ngInject";


        $stateProvider
            .state("<%= resourceNamePlural %>.edit", {
                url: "/edit/:id",
                templateUrl: "app/<%= resourceName %>/<%= resourceName %>Edit/<%= resourceName %>.edit.html",
                controller: "<%= _.capitalize(resourceName) %>EditController",
                controllerAs: "<%= resourceName %>"
            });


    }

}
