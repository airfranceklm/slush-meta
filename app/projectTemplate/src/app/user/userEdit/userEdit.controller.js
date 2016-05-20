/**
 * UserEditController
 * The controller for editing, creating and deleting a user
 */
export default class UserEditController {

    constructor(userResourceService, $stateParams, $state, message) {
        "ngInject";

        this.userResourceService = userResourceService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.message = message;
        this.data = {};

        if($stateParams.id !== "" && $stateParams.id !== -1){
            userResourceService.get({id: $stateParams.id}, (data) => {
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
            this.message.showSpinner("USER_EDIT_SAVING");
            if(this.data.techId === undefined){
                this.userResourceService.save(this.data,
                    (data, headers) => {
                    this.message.success("USER_EDIT_CREATED", "USER_CREATED_MESSAGE", {"id": data.techId});
                    this.message.hideSpinner();
                    this.$state.go("^.edit", {"id": data.techId});
                },
                (error) => {
                    this.message.hideSpinner();
                    this.handleError(error);
                });
            } else {
                this.userResourceService.update({"id": this.data.techId}, this.data,
                (data) => {
                    this.message.hideSpinner();
                    this.message.success("USER_EDIT_UPDATED", "USER_UPDATED_MESSAGE", {"id": data.techId});
                },
                (error) => {
                    this.message.hideSpinner();
                    this.handleError(error);
                });
            }
        } else {
            this.message.warning("NOT_VALID_FORM", "NOT_VALID_FORM_MESSAGE", {}, 5000);
        }
    }

    /**
     * Handle the error on a failed back end call
     */
    handleError(error){
        if(error.data !== undefined && error.data.validationErrorResources !== undefined){
            let errMessage = "";
            for (var i = 0; i < error.data.validationErrorResources.length; i++) {
                errMessage += `${error.data.validationErrorResources[i].field}: ${error.data.validationErrorResources[i].message}.\n`;
            }
            this.message.warning("Validation issue", errMessage, 5000);
        }else{
            this.message.reportError(error);
        }
    }

    /**
     * Updates the title of the page depending on if we update or create a resource.
     */
    updateTitle(){
        if(this.data.techId !== undefined){
            this.title = "USER_EDIT_TITLE";
        } else {
            this.title = "USER_NEW_TITLE";
        }
    }

    /**
     * Edit the user's picture
     */
    editPicture(){
        this.$state.go("^.picture", {"id": this.$stateParams.id});
    }

}
