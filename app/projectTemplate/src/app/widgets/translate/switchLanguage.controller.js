/**
 * SwitchLanguageController
 * The controller of the SwitchLanguageDirective
 */
export default class SwitchLanguageController {

    constructor($translate, languageService) {
        "ngInject";

        this.$translate = $translate;
        this.languageService = languageService;
        this.languageService.current = $translate.use();
    }

    switch(language){
        this.languageService.current = language;
        this.$translate.use(language);
    }

}
