import translate from "./translate/translate.module";
import angular from "angular";
import messageManager from "./messageManager/messageManager.module";

/*eslint no-unused-vars: 0*/
/**
 * The widget module contains several useful tools.
 */
let moduleName = "app.widgets";
export default moduleName;

let module = angular
    .module(moduleName, [
        messageManager,
        translate
    ]);
