import LanguageServiceProvider from "./language.service.provider";
import SwitchLanguageController from "./switchLanguage.controller";
import SwitchLanguageDirective from "./switchLanguage.directive";
import TranslateConfig from "./translate.config";
import angularTranslate from "angular-translate";
import {} from "angular-translate-loader-static-files";
import angular from "angular";

/*eslint no-unused-vars: 0*/
/**
 * Module translate
 * The module responsible for internationalisation of the application
 */
let moduleName = "app.translate";
export default moduleName;

let module = angular
    .module(moduleName, [
        angularTranslate
    ]);
module.config(TranslateConfig.init);
module.directive("switchLanguage", SwitchLanguageDirective.factory);
module.controller("SwitchLanguageController", SwitchLanguageController);
module.provider("languageService", LanguageServiceProvider);
