import angular from "angular";
import listJson from "./data/<%= name %>";

/**
 * Mock class for the <%= name %> resource
 */
export default class <%= className %> {
    constructor() {
        this.list = JSON.parseWithDate(JSON.stringify(listJson));
    }

    /**
     *  Initialization static method for the <%= name %> mock
     */
    static initMock($httpBackend, restUrl, backendLocatorService, $log) {
        "ngInject";

        let baseUrl = backendLocatorService.getUrl();
        let mock = new <%= className %>();


        //Simulates the get of a single resource from the back end.
        $httpBackend.whenGET(/\/<%= name %>\/[0-9]+/).respond(
            (method, url) => {
                let regexp = new RegExp("\\/<%= name %>\\/([0-9]+)");
                let mockId = url.match(regexp)[1];
                return [200, mock.list[mock.getIndex(mock.list, mockId)]];
             }
        );

        //Simulates the creation of a resource on the back end
        $httpBackend.whenPOST(/\/<%= name %>$/).respond(
            (method, url, data) => {
                $log.debug("Backend mock : " + data);
                let obj = angular.fromJson(data);
                let item = mock.newItem(mock.getNewId(mock.list), obj);
                mock.list.push(item);
                $log.debug("Backend mock : <%= name %> has been added : ");
                $log.debug(item);
                return [200, item, {Location: `${baseUrl}${restUrl}/<%= name %>/${item.<%= idProp %>}`}];
            }
        );

        //Simulates the update of a resource on the back end
        $httpBackend.whenPUT(/\/<%= name %>\/[0-9]+/).respond(
            (method, url, data) => {
                let regexp = new RegExp("\\/<%= name %>\\/([0-9]+)");
                let id = url.match(regexp)[1];
                $log.debug("Backend mock : " + data);
                let obj = angular.fromJson(data);
                let index = mock.getIndex(mock.list, id);
                for(let attr in obj){
                    mock.list[index][attr] = obj[attr];
                }
                $log.debug("Backend mock : <%= name %> has been modified : ");
                $log.debug(mock.list[index]);
                return [200, mock.list[index], {Location: `${baseUrl}${restUrl}/<%= name %>/${id}`}];
            }
        );

        //Simulates the deletion of a resource on the back end
        $httpBackend.whenDELETE(/\/<%= name %>\/[0-9]+/).respond(
            (method, url) => {
                let regexp = new RegExp("\\/<%= name %>\\/([0-9]+)");
                let id = url.match(regexp)[1];
                let index = mock.getIndex(mock.list, id);
                mock.list.splice(index,1);
                $log.debug("Backend mock : <%= name %> has been deleted : " + (id + 1));
                return [200, {}, {}];
            }
        );

        //Simulates the get of a list of resource with paging.
        $httpBackend.whenGET(/\/<%= name %>\?*.*/).respond(
            (method, url, data, headers) => {
            let regexp = /.*\?page=(\d*)&size=(\d*)/;
                try{
                    let page = parseInt(url.match(regexp)[1]);
                    let size = parseInt(url.match(regexp)[2]);
                    let start = page * size;
                    let end = start + size;

                    return [200, mock.list.slice(start, end), {}];
                } catch(e) {
                    return [200, mock.list, {}];
                }
            }
        );
    }

    /**
     * Creates a new item
     */
    newItem(id, obj){
        obj.<%= idProp %> = id;
        return obj;
    }

    /**
     * Get the last available id for a new item
     */
    getNewId (list){
        let maxId = 0;
        for (let item of list){
            if(item.<%= idProp %> > maxId){
                maxId = item.<%= idProp %>;
            }
        }
        return maxId + 1;
    }

    /**
     * get the index of an item in the list given its <%= idProp %>
     */
    getIndex (list, id){
        let index = 0;
        for (let i = 0; i < list.length; i++){
            if(list[i].<%= idProp %> == id){
                index = i;
            }
        }
        return index;
    }
}
