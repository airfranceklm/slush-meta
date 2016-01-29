import LanguageService from "./language.service";

/**
 * LanguageServiceProvider
 * The service provider responsible for creating the LanguageService instance.
 */
export default class LanguageServiceProvider {

    constructor() {
    }

    $get(){
        if( this.languageService === undefined){
            this.languageService = new LanguageService();
        }

        return this.languageService;
    }

}
