# Slush meta (AKA meta)
Slush meta is a [slush](http://slushjs.github.io/#/) generator, designed to help developers to scaffold Single Page applications.<br>
The generated project uses [Angular](https://angularjs.org/), and [ES6](http://es6-features.org/) javascript.<br>
It uses several javascript tools :

   * [Jspm](http://jspm.io/) for dependencies management.
   * [Gulp](http://gulpjs.com/) as a build system and development assistance.

Note that all these tools are executed on [Node.js](https://nodejs.org) and are installed through [npm](https://www.npmjs.com/).<br>

For ease of use and keeping version consistency, slush meta comes with a CLI called meta.
All commands should be issued through this CLI command.

## Getting started
1. Download and install Node.js from [here](https://nodejs.org/en/download/).

3. Install slush, gulp and jspm globally.<br>
    ```
    npm install -g slush gulp jspm
    ```
    
5. Install slush-meta

    ```
    npm install -g slush-meta
    ```

    Alternatively, if you are cloning this project, and cd in the slush-meta project folder on your local drive and use the command <br>

    ```
    npm link .
    ```

    This will link the current folder as if it was a classic npm module, except that any change in the project will be instantly taken into account.

6. Create a folder and cd in it.

7. Type
   ```
    meta
   ```

8. Enjoy



## Installation troubleshooting

* You may get some issues if git CLI is no installed on your computer and the path to the CLI added to your PATH env variable.
Please install git from [here](https://git-scm.com/downloads)
* You may have some permission issues on OSX that force you to use sudo on each command, see [this stack overflow question](http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo)

## Meta something
Slush meta comes with a set of command that you can use to generate your project or part of it, using the command line " **meta** " keyword<br>

* **meta or meta project** (since 1.0.0)<br>
    This will generate a complete project in the current directory.<br>
    You'll be prompted to enter :
    * A name for the application (default is the name of the current dir).
    * The name of the backend application (used to properly set the backend url calls)    

* **meta module** (since 1.0.0)<br>
    This will create an angular module.<br>
    You'll be prompted to enter :
    * The name of the module.
    * A description of the module. This will be added as the documentation as a comment at the top of the generated file.
    * The module dependencies this module needs. You'll be given a list of module with other modules of the application, and all the available modules from the installed jspm dependencies. Default is none
    * The parent module if this module is a sub-module. Default is "no a sub module".

    This will create a new folder in the src/app folder (or in the parent module folder if it's a sub-module), with a module file named <moduleName>.module.js.<br>
    This file contains the angular declaration of the module.<br>
    Additionally, the new module will be added in the angular declaration in the app.module.js, or in the parent module file if it's a sub-module.<br><br>

* **meta service** (since 1.0.0)<br>
    This will create an angular service.<br>
    You'll be prompted to enter :
    * The module in which you want to create the service.
    * The name of the service. The name will be suffixed by "Service" so if you enter "My", the service will be named "MyService".
    * A description of the service. This will be added as the documentation as a comment at the top of the generated file.
    * The services this service may use. (for example the "message" service available in the generated project). They will be injected to the service constructor and/or to the static factory method.
    * The type of the service. You'll be given 3 choices :
        * *Classic* : This will create a standard ES6 class with a constructor, and will register the service with angular with the module.service method.<br>
        ```
            module.service("myService", MyService);
        ```<br>
        The MessageService is a good example of a classic service. You can find it in the generated project in src/app/widgets/messageManager/message.service.js
        * *Factory* : This will create an ES6 class with a static factory method. This factory method will be responsible of instancing the service and returning the instance.<br>
        The service will be registered with angular as a factory like this : <br>
        ```
            module.factory("myService", MyService.factory);
        ```<br>
        For more information on Services vs factories in angularJS see this [link](http://blog.thoughtram.io/angular/2015/07/07/service-vs-factory-once-and-for-all.html).
        * *Resource* : This will create an ES6 class called \<Name\>ResourceService, with a static factory method. This method, instead of returning an instance of the service, will return a $resource instance (see [ngResource](https://docs.angularjs.org/api/ngResource)).<br>
        The resources will be created with the following url : "api/rest/resources/\<name\>s/:id". Note the "s" at the end of the name. For now it's just appended in future version, we may use the proper pluralized name of the service.<br>
        This convention is here to fit the RESTful conventions.<br>
        The service will be registered with angular as a factory like this : <br>
        ```
            module.factory("myResourceService", MyResourceService.factory);
        ```<br>

    > Note that the registered name of a service is in camel case whereas the class name of the service is capitalized.        

* **meta controller** (since 1.0.0)<br>
    This will create an angular controller.<br>
    You'll be prompted to enter :     
    * The module in which you want to create the controller.
    * The name of the controller. The name will be suffixed by "Controller" so if you enter "My" the controller will be names "MyController".
    * The description of the controller. This will be added as the documentation as a comment at the top of the generated file.
    * The services this controller may use. (for example the "message" service available in the generated project). They will be injected into the controller constructor.

    This will create a new ES6 class with a constructor. The controller will be registered with angular like this : <br>
    ```
        module.controller("MyController", MyController);
    ```

    > Note that the name of the registered controller is capitalized. You may however use camel case names for controllerAs names (see the route section bellow).

* **meta filter** (since 1.0.0)<br>
    This will create an angular filter.<br>
    You'll be prompted to enter :     
    * The module in which you want to create the filter.
    * The name of the filter. The name will be suffixed by "Filter" so if you enter "My" the filter will be names "MyFilter".
    * The description of the filter. This will be added as the documentation as a comment at the top of the generated file.    

    This will create a new ES6 class with a constructor and a static factory method that return a function that does the actual filtering. The filter will be registered with angular like this : <br>
    ```
        module.filter("MyFilter", MyFilter.factory);
    ```
       <br><br>
* **meta directive** (since 1.0.0)<br>
    This will create an angular directive.<br>
    You'll be prompted to enter :
    * The module in which you want to create the directive.
    * The name of the directive. The name will be suffixed by "Directive" so if you enter "MyExample" the directive will be names "MyExampleDirective".
    * The description of the directive. This will be added as the documentation as a comment at the top of the generated file.
    * The services this directive may use. (for example the "message" service available in the generated project). They will be injected into the directive static factory method.

    This will create an ES6 class with a static factory method and some methods relative to the directive : link and compile.<br>
    You may not need those methods so remove them if you don't.<br>
    The directive will be registered with angular like this.<br>
    ```
        module.directive("myExample", MyExampleDirective.factory);
    ```<br>

    > Note that in the HTML code the directive must be referred as my-example.

    A good example is the MessageManagerDirective available in src/app/widgets/messageManager/messageManager.directive.js.
    <br><br>

* **meta route** (since 1.0.0)<br>
    This will create an angular route.<br>
    You'll be prompted to enter :
    * The module in which you want to create the route.

    This will create a \<moduleName\>.route.js in the module folder, with and *empty* route declaration harness.<br>
    The route class has a static method called initRoute where all the route configuration should happen.<br>
    As the routes in the project uses angular ui-router, It's also added as a module dependency in the module declaration.<br>
    The route is registered with angular like this : <br>
    ```
        module.config(\<ModuleName\>Route.initRoute);
    ```
    <br><br>
* **meta view** (since 1.0.0)<br>
    This will create an angular view<br>
    You'll be prompted to enter :
    * The module in which you want to create the route.
    * The name of the view.
    * If you want to create the associated route to this view. If you say yes, you'll be prompted to enter :
        * The url of the view (default is \<moduleName\>/\<viewName\>).
        * The name of the controller class (default is \<ViewName\>Controller).
        * The controllerAs name you'd like to use (default is \<viewName\>).

    This will create an html template named \<viewName\>.html in the corresponding module folder.<br>
    If you answered yes when prompted to create the route, a route file will be creates (as in slush meta route).<br>
    Additionally, the ui-router state will be configured in the route file like this (for a view named myView in a myModule module):<br>

        $stateProvider
            .state("myView", {
                url: "/myModule/myView",
                templateUrl: "app/myModule/myView.html",
                controller: "MyViewController",
                controllerAs: "myView"
            });

    > Note that if the route file already exists the new state will be added to it

* **meta mock** (since 1.0.0)<br>
    This will create angular mock from a json file with data.<br>
    For this to work you need to create a json file with mock data. A nice online tool to do it is [Json Generator](http://www.json-generator.com/).<br>
    The file needs to be in the root folder of the project and named with the resource name in its plural form.<br>
    For example if you want to create the mock for a "car" resource, you have to call the file "cars.json".

    > Some more clever things will be done with pluralisation in future versions but for now it's pretty basic.

    You'll be prompted to enter :

    * The file you want to use to generate the mock (in case there are several of them in the root folder).
    * If you want to delete the file afterward (might be a good idea if you don't want to clutter your project's root folder).
    * The name of the unique identifier property for this resource. (Default is the first property of the first item in the json file).

    This will generate the mock boiler plate for this resource based on [angular-mock](https://docs.angularjs.org/api/ngMock), in the mock folder, outside of the src folder.<br>
    The mock will maintain the data in memory which allow to read from it and write to it.<br>
    This way you can easily simulate the CRUD processes.<br><br>    

* **meta crud** (since 1.0.0)<br>
    This will create a complete interface with CRUD capabilities from a json file with data.
    The process here is the same as for the mock task. However it goes beyond it by creating the GUI so you can perform CRUD operations on your resource.
    There are serveral conventions used to create the CRUD :

    **The list items are done as follow :**

    > idValue - firstAttrValue secondAttrValue<br>
    > thirdAttrLabel thirdAttrValue   fourthAttrLabel fourthAttrValue   fifthAttrLabel fifthAttrValue   sixthAttrLabel sixthAttrValue   

    **The edit form list every attribute as a text input except the id**<br>
    Embeded object are supported an a section will be generated for each one.<br>
    List or array objects are not supported yet.<br>

## Changelog :
* **V 1.0.0-rc.2** :
    - slush and slush-me are now also installed locally to the generated project.
    - Introduction of the meta CLI. The meta command just wraps any "slush meta" command and use the local installation when available or the global one otherwise. This allows to keep the same version of slush-me for a given project and still be able to use newer versions for newer projects.
* **V 1.0.0-rc.1** :
    - initial implementation, first release candidate
