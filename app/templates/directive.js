/**
 * <%= _.capitalize(directiveName) %>Directive
 * This directive is to be initialized as a directive by calling the factory method.
 * <%= directiveDescription %>
 */
export default class <%= _.capitalize(directiveName) %>Directive {

    constructor(<% _.each(directiveServices, function(item){ %><%=item%><% if(directiveServices.indexOf(item) != directiveServices.length - 1 ){%>, <%}})%>) {

        <% _.each(directiveServices, function(item){ %>this.<%=item%> = <%=item%>;
            <%})%>

        //for relevant values of attributes see : https://docs.angularjs.org/api/ng/service/$compile
        this.restrict = "AEC";
        this.require = "";

    }

    /**
     * Called at compilation stage of the directive.
     */
    compile(tElement, tAttrs, transclude) {
        //Insert directive compile code here if needed.
    }

    /**
     * Called at link stage of the directive
     */
    link(scope, iElement, iAttrs, ngModelCtrl) {
        //Insert directive link code here if needed.
    }

    static factory(<% _.each(directiveServices, function(item){ %><%=item%><% if(directiveServices.indexOf(item) != directiveServices.length - 1 ){%>, <%}})%>){
        <% if(directiveServices.length > 0){ %>"ngInject";<%}%>

        return new <%= _.capitalize(directiveName) %>Directive(<% _.each(directiveServices, function(item){ %><%=item%><% if(directiveServices.indexOf(item) != directiveServices.length - 1 ){%>, <%}})%>);
    }

}
