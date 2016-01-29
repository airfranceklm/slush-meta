/**
 * BackendLocatorService
 * The service responsible of managing the backend urls depending on the environment.
 */
export default class BackendLocatorService {

    constructor($location) {
        "ngInject";

        this.$location = $location;

    }


    /**
     * This will return the URL of the backend, depending on the url of the front-end.
     * If you have back end and front end on different domain, you may want to change this code to fit your needs.
     * @returns the backend url.
     */
    getUrl(){
        // Here you can add checks that will return the appropriate back-end url according to the front-end url
        //LOCAL
        if( this.$location.absUrl().indexOf("http://localhost:") === 0){
            return "<%= backendAppUrl %>/";
        }

        console.error("Something went wrong, couldn't match " + this.$location.absUrl());
    }
}
