/**
 * UserController
 * The user controller
 */
export default class UserController {

    constructor(userResourceService, $state, $rootScope, message) {
        "ngInject";

        this.userResourceService = userResourceService;
        this.$state = $state;
        this.message = message;

        //Paging
        this.list = [];
        this.page = 0;
        this.pageSize = 10;

        this.initEvents($rootScope);
        this.getNext();

    }

    /**
     * Loads the next pageSize items from the back end and appends them to the list
     */
    getNext() {
        this.message.showSpinner("USER_LIST_LOADING");
        this.userResourceService.query({"page": this.page, "size": this.pageSize}, (data) => {
            this.list = this.list.concat(data.content);
            this.page++;
            this.message.hideSpinner();
        },
        (error) => {
            this.message.hideSpinner();
            this.message.reportError(error);
        });
    }

    /**
     * Navigates to an item's edit page.
     */
    goToItem(id) {
        this.$state.go(".edit", {"id": id});
    }

    /**
     * Delete an element on the list
     */
    delete(id, index) {
        this.message.showSpinner("USER_LIST_DELETING");
        this.userResourceService.delete({"id": id}, (data) => {
            this.list.splice(index, 1);
            this.message.hideSpinner();
            this.message.success("USER_LIST_DELETED", "USER_LIST_DELETED_MESSAGE", {"id": id});
        },
        (error) => {
            this.message.hideSpinner();
            this.message.reportError(error);
        });
    }

    /**
     * Reloads the entire list from first page to current page.
     * Useful when the list has been modified on the server by another controller.
     */
    reload() {
        this.message.showSpinner("USER_LIST_LOADING");
        this.userResourceService.query({"page": 0, "size": this.pageSize * this.page}, (data) => {
            this.list = data.content;
            this.message.hideSpinner();
        },
        (error) => {
            this.message.hideSpinner();
            this.message.reportError(error);
        });
    }

    /**
     * Initialize event handling when navigating to this state
     */
    initEvents($rootScope) {
        $rootScope.$$listeners.$stateChangeStart = undefined;
        $rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState, fromParams) => {
            // reloads the list when coming back to this state.
            if(toState.name === "users"){
                this.reload();
            }
        });
    }

}
