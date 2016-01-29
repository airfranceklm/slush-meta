/**
 * <%= _.capitalize(controllerName) %>Controller
 * <%= controllerDescription %>
 */
export default class <%= _.capitalize(controllerName) %>Controller {

    constructor(<% _.each(controllerServices, function(item){ %><%=item%><% if(controllerServices.indexOf(item) != controllerServices.length - 1 ){%>, <%}})%>) {
        <% if(controllerServices.length > 0){ %>"ngInject";<%}%>

        <% _.each(controllerServices, function(item){ %>this.<%=item%> = <%=item%>;
        <%})%>
    }

}
