/**
 * <%= _.capitalize(resourceName) %>EditController
 * The controller for editing, creating and deleting a <%= resourceName %>
 */
export default class <%= _.capitalize(resourceName) %>EditController {

    constructor(<%= resourceName %>ResourceService, $stateParams, $state, message) {
        "ngInject";

        this.<%= resourceName %>ResourceService = <%= resourceName %>ResourceService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.message = message;
        this.data = {};

        if($stateParams.id !== "" && $stateParams.id !== -1){
            <%= resourceName %>ResourceService.get({id: $stateParams.id}, (data) => {
                this.data = data;
                this.updateTitle();
            });
        } else {
            this.updateTitle();
        }


    }

    /**
     * Saves the resource if the form is valid.
     */
    save(form){
        if(form.$valid) {
            this.message.showSpinner("<%= resourceName.toUpperCase() %>_EDIT_SAVING");
            if(this.data.<%= idProp %> === undefined){
                this.<%= resourceName %>ResourceService.save(this.data,
                    (data, headers) => {
                    this.message.success("<%= resourceName.toUpperCase() %>_EDIT_CREATED", "<%= resourceName.toUpperCase() %>_CREATED_MESSAGE", {"id": data.<%= idProp %>});
                    this.message.hideSpinner();
                    this.$state.go("^.edit", {"id": data.<%= idProp %>});
                },
                (error) => {
                    this.message.hideSpinner();
                    this.message.reportError(error);
                });
            } else {
                this.<%= resourceName %>ResourceService.update({"id": this.data.<%= idProp %>}, this.data,
                (data) => {
                    this.message.hideSpinner();
                    this.message.success("<%= resourceName.toUpperCase() %>_EDIT_UPDATED", "<%= resourceName.toUpperCase() %>_UPDATED_MESSAGE", {"id": data.<%= idProp %>});
                },
                (error) => {
                    this.message.hideSpinner();
                    this.message.reportError(error);
                });
            }
        } else {
            this.message.warning("<%= resourceName.toUpperCase() %>_EDIT_NOT_VALID_FORM", "<%= resourceName.toUpperCase() %>_EDIT_NOT_VALID_FORM_MESSAGE", {}, 5000);
        }
    }


    /**
     * Updates the title of the page depending on if we update or create a resource.
     */
    updateTitle(){
        if(this.data.<%= idProp %> !== undefined){
            this.title = "<%= resourceName.toUpperCase() %>_EDIT_TITLE";
        } else {
            this.title = "<%= resourceName.toUpperCase() %>_NEW_TITLE";
        }
    }

}
