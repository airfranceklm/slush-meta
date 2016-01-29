/**
 * SwitchLanguageDirective
 * This directive is to be initialized as a directive by calling the factory method.
 * The directive responsible for switching languages
 */
export default class SwitchLanguageDirective {

    constructor() {



        //for relevant values of attributes see : https://docs.angularjs.org/api/ng/service/$compile
        this.restrict = "E";
        this.templateUrl = "app/widgets/translate/switchLanguage.html";
        this.controller = "SwitchLanguageController";
        this.controllerAs = "lang";
    }

    static factory(){
        return new SwitchLanguageDirective();
    }

}
