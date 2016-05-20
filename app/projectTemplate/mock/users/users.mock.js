import angular from "angular";
import listJson from "./data/users";

/**
 * Mock class for the users resource
 */
export default class UsersMock {
    constructor() {
        this.list = JSON.parseWithDate(JSON.stringify(listJson));
    }

    /**
     *  Initialization static method for the users mock
     */
    static initMock($httpBackend, restUrl, backendLocatorService, $log) {
        "ngInject";

        let baseUrl = backendLocatorService.getUrl();
        let mock = new UsersMock();


        //Simulates the get of a single resource from the back end.
        $httpBackend.whenGET(/\/users\/[0-9]+/).respond(
            (method, url) => {
                let regexp = new RegExp("\\/users\\/([0-9]+)");
                let mockId = url.match(regexp)[1];
                return [200, mock.list[mock.getIndex(mock.list, mockId)]];
             }
        );

        //Simulates the creation of a resource on the back end
        $httpBackend.whenPOST(/\/users$/).respond(
            (method, url, data) => {
                $log.debug("Backend mock : " + data);
                let obj = angular.fromJson(data);
                let item = mock.newItem(mock.getNewId(mock.list), obj);
                mock.list.push(item);
                $log.debug("Backend mock : users has been added : ");
                $log.debug(item);
                return [200, item, {Location: `${baseUrl}${restUrl}/users/${item.techId}`}];
            }
        );

        //Simulates the update of a resource on the back end
        $httpBackend.whenPUT(/\/users\/[0-9]+/).respond(
            (method, url, data) => {
                let regexp = new RegExp("\\/users\\/([0-9]+)");
                let id = url.match(regexp)[1];
                $log.debug("Backend mock : " + data);
                let obj = angular.fromJson(data);
                let index = mock.getIndex(mock.list, id);
                for(let attr in obj){
                    mock.list[index][attr] = obj[attr];
                }
                $log.debug("Backend mock : users has been modified : ");
                $log.debug(mock.list[index]);
                return [200, mock.list[index], {Location: `${baseUrl}${restUrl}/users/${id}`}];
            }
        );

        //Simulates the deletion of a resource on the back end
        $httpBackend.whenDELETE(/\/users\/[0-9]+/).respond(
            (method, url) => {
                let regexp = new RegExp("\\/users\\/([0-9]+)");
                let id = url.match(regexp)[1];
                let index = mock.getIndex(mock.list, id);
                mock.list.splice(index,1);
                $log.debug("Backend mock : users has been deleted : " + (id + 1));
                return [200, {}, {}];
            }
        );

        //Simulates the get of a list of resource with paging.
        $httpBackend.whenGET(/\/users\?*.*/).respond(
            (method, url, data, headers) => {
            let regexp = /.*\?page=(\d*)&size=(\d*)/;
                try{
                    let page = parseInt(url.match(regexp)[1]);
                    let size = parseInt(url.match(regexp)[2]);
                    let start = page * size;
                    let end = start + size;

                    return [200, mock.makeHATEAOS(mock.list.slice(start, end), page, size, mock.list.length), {}];
                } catch(e) {
                    return [200, mock.list, {}];
                }
            }
        );

        //Handles picture update and delete code in the users example.
        $httpBackend.whenPOST(/users\/\d+\/picture/).respond((method, url) => {
            $log.debug("Backend mock : Picture " + url + " has been updated");
            return [200, {}, {}];
        });

        $httpBackend.whenDELETE(/users\/\d+\/picture/).respond((method, url) => {
            $log.debug("Backend mock : Picture " + url + " has been deleted");
            return [200, {}, {}];
        });
    }

    /**
     * format the response for the list according to HATEOS norm.
     */
    makeHATEAOS(list, page, size, totalElements){
        return {
            "links": [
                {
                    "rel": "self",
                    "href": "http://sesstech.cf.eden.klm.com/api/rest/resources/users{?page,size,sort}"
                },
                {
                    "rel": "self",
                    "href": "http://sesstech.cf.eden.klm.com/api/rest/resources/users"
                },
                {
                    "rel": "create_via_post",
                    "href": "http://sesstech.cf.eden.klm.com/api/rest/resources/users"
                }
            ],
            "content": list,
            "page": {
                "size": size,
                "totalElements": totalElements,
                "totalPages": Math.floor(totalElements / size) +1,
                "number": page
            }
        }
    }

    /**
     * Creates a new item
     */
    newItem(id, obj){
        obj.techId = id;
        obj.links = [
            {
                "rel": "self",
                "href": `api/rest/resource/users/${id}`
            },
            {
                "rel": "picture",
                "href": `api/rest/resource/users/${id}/picture`
            },
            {
                "rel": "update_via_put",
                "href": `api/rest/resource/users/${id}`
            },
            {
                "rel": "delete_via_delete",
                "href": `api/rest/resource/users/${id}`
            }
        ];
        return obj;
    }


    /**
     * Get the last available id for a new item
     */
    getNewId (list){
        let maxId = 0;
        for (let item of list){
            if(item.techId > maxId){
                maxId = item.techId;
            }
        }
        return maxId + 1;
    }

    /**
     * get the index of an item in the list given its techId
     */
    getIndex (list, id){
        let index = 0;
        for (let i = 0; i < list.length; i++){
            if(list[i].techId == id){
                index = i;
            }
        }
        return index;
    }
}
