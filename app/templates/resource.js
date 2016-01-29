/**
 * <%= _.capitalize(serviceName) %>ResourceService
 * This service is to be initialized as a factory by calling the factory method.
 * It's a resource provider service that works with ngResource module.
 * <%= serviceDescription %>
 */
export default class <%= _.capitalize(serviceName) %>ResourceService {

    constructor() {
    }

    /**
     * Returns the ngResource instance.
     */
    static factory($resource<% _.each(serviceServices, function(item){ %>, <%=item%><%})%>){
        "ngInject";

        return $resource("api/rest/resources/<%=serviceName.toLowerCase()%>s/:id", {}, {
            "get": {method: "GET", isArray: false},
            "query": {method: "GET", isArray: true},
            "save": {method: "POST", isArray: false},
            "update": {method: "PUT", isArray: false},
            "delete": {method: "DELETE", isArray: false}
        });
    }

}
