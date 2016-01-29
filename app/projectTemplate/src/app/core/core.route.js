/**
 * CoreRoute
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the core module
 */
export default class CoreRoute {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     * @param $urlRouterProvider ui router urlRouterProvider.
     */
    static initRoute($stateProvider, $urlRouterProvider){
        "ngInject";
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("403", {
                url: "/403",
                templateUrl: "app/core/access403.html"
            })
            .state("home", {
                url: "/home",
                templateUrl: "app/core/home.html",
                controller: "HomeController",
                controllerAs: "home"
            });
    }

    /**
     * Will set the $state and $stateParams services in the $rootScope.
     * It allows for example to be able to know what state is currently active from any html template
     * @param $rootScope the rootScope of the app
     * @param $state the ui router state service
     * @param $stateParams the ui router stateParams service.
     */
    static shareUiRouter($rootScope, $state, $stateParams){
        "ngInject";

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

}
