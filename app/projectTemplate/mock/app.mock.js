import angular from "angular";
import securities from "./data/securities";
import languageFr from "./data/language.fr";
import languageEn from "./data/language.en";

export default class AppMock {
    constructor() {
    }

    static initMock($httpBackend, restUrl, backendLocatorService) {
        "ngInject";

        let baseUrl = backendLocatorService.getUrl();

        $httpBackend.whenGET(/.*\.html/).passThrough();
        $httpBackend.whenGET(/.*\.json/).passThrough();

        $httpBackend.whenGET(baseUrl + restUrl + "/securities").respond(securities);
        $httpBackend.whenGET(baseUrl + restUrl + "/translate?lang=fr-FR").respond(languageFr);
        $httpBackend.whenGET(baseUrl + restUrl + "/translate?lang=en-EN").respond(languageEn);

    }
}
