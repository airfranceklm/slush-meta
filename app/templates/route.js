/**
 * <%= _.capitalize(moduleName) %>Route
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the <%= moduleName.toLowerCase() %> module using ui-router
 */
export default class <%= _.capitalize(moduleName) %>Route {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     */
    static initRoute($stateProvider){
        "ngInject";

        <%if(viewUrl != null){%>
        $stateProvider
            .state("<%= viewName %>", {
                url: "/<%= viewUrl %>",
                templateUrl: "app/<%= modulePath %>/<%= viewName %>.html",
                controller: "<%= controllerName %>",
                controllerAs: "<%= controllerAsName %>"
            });
        <%}%>

    }

}
