/**
 * <%= _.capitalize(serviceName) %>Service
 * <%= serviceDescription %>
 */
export default class <%= _.capitalize(serviceName) %>Service {

    constructor(<% _.each(serviceServices, function(item){ %><%=item%><% if(serviceServices.indexOf(item) != serviceServices.length - 1 ){%>, <%}})%>) {
        <% if(serviceServices.length > 0){ %>"ngInject";<%}%>

        <% _.each(serviceServices, function(item){ %>this.<%=item%> = <%=item%>;
        <%})%>
    }

}
