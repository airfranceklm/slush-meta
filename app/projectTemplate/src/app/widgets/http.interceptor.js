/*global window: false*/
//This is a hack to have angular regognize the "this" in an interceptor context.
//see this Stack overflow http://stackoverflow.com/questions/28638600/angularjs-http-interceptor-class-es6-loses-binding-to-this
let self;

export default class Interceptor {
    constructor($q, backendLocatorService){
        self = this;
        self.$q = $q;
        self.backendLocatorService = backendLocatorService;
    }

    request(config){
        // This will prepend the backend url to any api call, this is useful when the backend and the front end are on different domains.
        if (config.url.indexOf("api/") === 0){
            config.url = self.backendLocatorService.getUrl() + config.url;
        }
        return config;
    }

    response(response) {
        return response;
    }

    responseError(response) {
        if ((response.status === 403)) {
            window.location = "./index.html#/403";
        }

        // otherwise, default behaviour
        return self.$q.reject(response);
    }

    static factory($q, backendLocatorService){
        "ngInject";
        return new Interceptor($q, backendLocatorService);
    }


}
