/**
 * BackendLocatorService
 * The service responsible of managing the backend urls depending on the environment.
 * This one will override the main application BackendLocatorService when the app is started in mock mode locally.
 */
export default class BackendLocatorService {

    constructor($location) {
        "ngInject";

        this.$location = $location;
        
    }

    /**
     * This will return the backend url in mock mode.
     * @returns {string}
     */
    getUrl() {
        return "http://localhost:3000/";
    }
}
