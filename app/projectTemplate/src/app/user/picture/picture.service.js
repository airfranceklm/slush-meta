import angular from "angular";

/**
 * UserPictureService
 * This service allows to fetch and send user picture data from and to the server.
 */
export default class PictureService{
    constructor($http, $q) {
        "ngInject";

        this.$http = $http;
        this.$q = $q;
    }

    updatePicture(url, requestData) {
        //Creating a deferred object
        let deferred = this.$q.defer();

        //Calling Web API to fetch shopping cart items
        this.$http.post(
            url,
            requestData,
            {headers: {"Content-Type": undefined}, transformRequest: angular.identity, withCredentials: true}
        ).success(
            function (responseData) {
                //Passing data to deferred"s resolve function on successful completion
                deferred.resolve(responseData);
            }
        ).error(
            function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    }

    deletePicture(url) {
        //Creating a deferred object
        let deferred = this.$q.defer();

        //Calling Web API to fetch shopping cart items
        this.$http.delete(
            url,
            "",
            { withCredentials: true}
        ).success(
            function () {
                deferred.resolve("Suppression de l\"image OK");
            }
        ).error(
            function () {
                deferred.reject("An error occured while fetching items");
            }
        );
        return deferred.promise;
    }
}
