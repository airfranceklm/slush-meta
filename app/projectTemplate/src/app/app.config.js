/**
 * Application configuration class.
 */

import Interceptor from "./widgets/http.interceptor";

export default class AppConfig{
    constructor() {

    }

    registerInterceptor(httpProvider, provide) {
        provide.factory("httpInterceptor", Interceptor.factory);
        httpProvider.interceptors.push("httpInterceptor");
    }

    static factory($httpProvider, $provide){
        "ngInject";

        let config = new AppConfig();

        config.registerInterceptor($httpProvider, $provide);

        $httpProvider.defaults.withCredentials = true;
    }
}

