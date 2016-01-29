/**
 * SpinnerDirective
 * This directive is to be initialized as a directive by calling the factory method.
 * The spinner directive
 */
export default class SpinnerDirective {

    constructor() {
        //for relevant values of attributes see : https://docs.angularjs.org/api/ng/service/$compile
        this.restrict = "E";
        this.templateUrl = "app/widgets/messageManager/spinner/spinner.html";
        this.controller = "SpinnerController";
        this.controllerAs = "spinner";
    }

    static factory(){
        return new SpinnerDirective();
    }

}
