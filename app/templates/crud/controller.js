/**
 * <%= _.capitalize(resourceName) %>Controller
 * The <%= resourceName %> controller
 */
export default class <%= _.capitalize(resourceName) %>Controller {

    constructor(<%= resourceName %>ResourceService, $state, $rootScope, message) {
        "ngInject";

        this.<%= resourceName %>ResourceService = <%= resourceName %>ResourceService;
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
        this.message.showSpinner("<%= resourceName.toUpperCase() %>_LIST_LOADING");
        this.<%= resourceName %>ResourceService.query({"page": this.page, "size": this.pageSize}, (data) => {
            this.list = this.list.concat(data);
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
        this.message.showSpinner("<%= resourceName.toUpperCase() %>_LIST_DELETING");
        this.<%= resourceName %>ResourceService.delete({"id": id}, (data) => {
            this.list.splice(index, 1);
            this.message.hideSpinner();
            this.message.success("<%= resourceName.toUpperCase() %>_LIST_DELETED", "<%= resourceName.toUpperCase() %>_LIST_DELETED_MESSAGE", {"id": id});
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
        this.message.showSpinner("<%= resourceName.toUpperCase() %>_LIST_LOADING");
        this.<%= resourceName %>ResourceService.query({"page": 0, "size": this.pageSize * this.page}, (data) => {
            this.list = data;
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
        $rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState, fromParams) => {
            // reloads the list when coming back to this state.
            if(toState.name === "<%= resourceNamePlural %>"){
                this.reload();
            }
        });
    }

}
