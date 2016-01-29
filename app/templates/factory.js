/**
 * <%= _.capitalize(serviceName) %>Service
 * This service is to be initialized as a factory by calling the factory method.
 * <%= serviceDescription %>
 */
export default class <%= _.capitalize(serviceName) %>Service {

    constructor(<% _.each(serviceServices, function(item){ %><%=item%><% if(serviceServices.indexOf(item) != serviceServices.length - 1 ){%>, <%}})%>) {

        <% _.each(serviceServices, function(item){ %>this.<%=item%> = <%=item%>;
        <%})%>
    }

    /**
     * static initialization of this factory.
     */
    static factory(<% _.each(serviceServices, function(item){ %><%=item%><% if(serviceServices.indexOf(item) != serviceServices.length - 1 ){%>, <%}})%>){
        <% if(serviceServices.length > 0){ %>"ngInject";<%}%>

        return new <%= _.capitalize(serviceName) %>Service(<% _.each(serviceServices, function(item){ %><%=item%><% if(serviceServices.indexOf(item) != serviceServices.length - 1 ){%>, <%}})%>);
    }

}
