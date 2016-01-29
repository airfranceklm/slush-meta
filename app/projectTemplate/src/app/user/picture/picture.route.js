/**
 * PictureRoute
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the picture module using ui-router
 */
export default class PictureRoute {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     */
    static initRoute($stateProvider){
        "ngInject";


        $stateProvider
            .state("users.picture", {
                url: "/edit/:id/picture",
                templateUrl: "app/user/picture/picture.html",
                controller: "PictureController",
                controllerAs: "picture"
            });


    }

}
