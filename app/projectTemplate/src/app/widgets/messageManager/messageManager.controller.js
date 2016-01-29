/**
 * MessageManagerController
 * The controller responsible for managing the message manager
 */
export default class MessageManagerController {

    constructor(message) {
        "ngInject";

        this.messageService = message;
    }

}
