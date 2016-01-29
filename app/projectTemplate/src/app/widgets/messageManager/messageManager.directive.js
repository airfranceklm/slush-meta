/**
 * MessageManagerDirective
 * This directive is to be initialized as a directive by calling the factory method.
 * The directive responsible of displaying the message manager
 */
export default class MessageManagerDirective {

    constructor() {
        this.restrict = "E";
        this.controller = "MessageManagerController";
        this.controllerAs = "messageManager";
        this.templateUrl = "app/widgets/messageManager/messageManager.html";
    }

    static factory(){
        return new MessageManagerDirective();
    }

}
