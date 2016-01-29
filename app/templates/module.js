import angular from "angular";

<% _.each(moduleDependencies, function(item){ %>import <%= _.camelCase(item.module)%> from "<%= item.path %>";
<%})%>
/*eslint no-unused-vars: 0*/
/**
 * Module <%= moduleName %>
 * <%= moduleDescription %>
 */
let moduleName = "app.<%if(parentModule != ""){%><%= parentModule.replace(/\//g,".") %>.<%}%><%= _.camelCase(moduleName) %>";
export default moduleName;

let module = angular
    .module(moduleName, [
        <% _.each(moduleDependencies, function(item){ %><%= _.camelCase(item.module)%><% if(moduleDependencies.indexOf(item) != moduleDependencies.length - 1 ){%>,
        <%}})%>
    ]);
