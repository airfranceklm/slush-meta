import PictureFilter from "../picture/picture.filter";
/**
 * UserPictureController
 * Handles the change picture page for a user.
 */
export default class PictureController {
    constructor($scope, pictureService, userResourceService, $log, message, $stateParams, $state) {
        "ngInject";

        this.pictureService = pictureService;
        this.$log = $log;
        this.message = message;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$state = $state;

        this.data = {};
        userResourceService.get({id: $stateParams.id}, (data) => {
            this.data = data;
        });


    }

    /**
     * Store files in an array to be able to display the size and the file name in user-picture.html.
     * This is called on an onchange event of the file input field (path to the picture).
     * Also allow to display the upload button only if files.length is greater than 0.
     *
     * Note that the $scope.$apply is a workaround to this issue https://github.com/angular/angular.js/issues/1375
     * Angular does not bind the change event to ng-change on an input type file.
     * also see in user-picture.html the call to this function is also a bit peculiar.
     * onchange="angular.element(this).scope().userPicture.setFiles(this)"
     * This is the only working workaround
     */
     setFiles(element) {
        this.$scope.$apply(function ($scope) {
            //	File storage in an Array
            $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                $scope.files.push(element.files[i]);
            }
        });
     }

     /**
      * Updates the image on the back end.
      * Called when the user clicks on the update button
      */
     uploadFile() {
        var fd = new FormData();
        let url = PictureFilter.factory()(this.data.links, "picture")[0].href;
        fd.append("user_picture", this.$scope.files[0]);

        if (url) {
            this.message.showSpinner("USER_PICTURE_UPLOADING");
            this.pictureService.updatePicture(url, fd).then(
                () => {
                    this.$log.debug("OK update picture");
                    this.message.success("USER_PICTURE_UPDATED", "USER_PICTURE_UPDATED_MESSAGE");
                    this.message.hideSpinner();
                    this.gotoUserPage();
                },
                (error) => {
                    this.reportError();
                }
            );
        }
    }

    /**
     * delete the user's picture
     */
    delete(){
        let url = PictureFilter.factory()(this.data.links, "picture")[0].href;
        this.pictureService.deletePicture(url).then(
            () => {
                this.$log.debug("OK delete picture");
                this.message.success("USER_PICTURE_DELETED", "USER_PICTURE_DELETED_MESSAGE");                
                this.message.hideSpinner();
                this.gotoUserPage();
            },
            (error) => {
                this.reportError();
            }
        );
    }

    reportError(error){
        this.$log.error(`Error : ${error.label} / ${error.detailMessage}`);
        this.message.hideSpinner();
        this.message.danger("GENERIC_ERROR", `${error.label} / ${error.detailMessage}`);
    }

    /**
    * returns to the user page
    */
    gotoUserPage() {
        this.$state.go("^.edit", {"id": this.$stateParams.id}, {reload: true});
    }

}
