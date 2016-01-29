/**
 * MessageService
 * A service that allows to display messages to the user
 */
export default class MessageService {

    constructor($timeout) {
        "ngInject";

        this.messageQueue = [];
        this.$timeout = $timeout;
        this.nextId = 0;
        this.defaultTime = 3000;
        this.spinnerState = {
            "visible": false,
            "text": "",
            "params": {}
        };

    }

    success(title, text, params, time) {
        this.show(title, text, params, time, "success");
    }

    info(title, text, params, time) {
        this.show(title, text, params, time, "info");
    }

    warning(title, text, params, time) {
        this.show(title, text, params, time, "warning");
    }

    danger(title, text, params, time) {
        this.show(title, text, params, time, "danger");
    }

    reportError(error){
        this.danger("GENERIC_ERROR", `${error.status} : ${error.statusText}.`);
    }

    show(title, text, params, time, type) {
        let id = this.nextId;
        if(time === undefined) {
            time = this.defaultTime;
        }
        if(params === undefined){
            params = {};
        }
        this.messageQueue.unshift({
            "id": id,
            "title": title,
            "text": text,
            "type": type,
            "params": params
        });

        this.$timeout( () => {
            this.hide(id);
        }, time);

        this.nextId++;
    }

    hide(id){
        for (var i = 0; i < this.messageQueue.length; i++) {
            let message = this.messageQueue[i];
            if(message.id === id){
                this.messageQueue.splice(i, 1);
                return;
            }
        }
    }

    showSpinner(text, params){
        if(params === undefined){
            params = {};
        }
        this.hideSpinner();
        this.displayPromise = this.$timeout( () => {
            this.spinnerState = {
                "visible": true,
                "text": text,
                "params": params
            };
        }, 500);
    }

    hideSpinner(){
        if(this.displayPromise !== undefined) {
            this.$timeout.cancel(this.displayPromise);
        }
        this.spinnerState = {
            "visible": false,
            "text": "",
            "params": {}
        };
    }

}
