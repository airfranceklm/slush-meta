# <%= appName %>

This is the default readme, please briefly describe your project.

## Getting started
1. Download and install Node.js from [here](https://nodejs.org/en/download/).

3. Install slush, gulp and jspm globally.<br>
    ```
    npm install -g slush gulp jspm
    ```<br>

3. Install the project global prerequisites (if not already installed)<br>
    ```
    npm install -g slush gulp jspm slush-meta  
    ```
5. Install the project dependencies.<br>
    ```
    npm install --no-optional
    ```<br>
6. You can now use any of the Gulp commands listed in the next section

## Gulp commands

You can use the following gulp commands :

* **gulp analyse**<br>
    Analyses the source for code syntax and style.
* **gulp apk**<br>
    Builds an apk file with the optimized application so that it can be deployed on an android device.
    **--mock** package the application with  mocked data
* **gulp clean**<br>
    Cleans up the folders created by the different build tasks
* **gulp dist**<br>
    Builds a static distribution of the application in a zip file so that it can be deployed on a web server.
    **--mock** package the application with  mocked data
    **--pretty** Will generate the js application as human readable code
* **gulp help**<br>
    Display this help text. Aliases: -h, h, ?
* **gulp i18n \[--pretty\]**<br>
    Creates the languages files gathering all languages json files in the app.<br>
    **--pretty** Makes the generated language file readable for a human being.
* **gulp optimize**<br>
    Optimizes the application in the target folder.
    **--mock** package the application with  mocked data
    **--pretty** Will generate the js application as human readable code
* **gulp serve-build**<br>
    Builds and serves the live ready application (concat and minification)
    **--mock** Starts the server with mocked data
    **--pretty** Will generate the js application as human readable code
* **gulp serve-dev \[--mock\]**<br>
    Serves the application in dev mode (no concat or minification)<br>
    **--mock** Starts the server with mocked data
* **gulp test**<br>
    Launches the unit tests and the end to end tests.
* **gulp test-e2e**<br>
    Launches the end to end tests.
* **gulp test-unit**<br>
    Launches the unit tests.
* **gulp war**<br>
    Builds a war with the optimized application so that it can be deployed on a JEE container.
    **--mock** package the application with  mocked data
    **--pretty** Will generate the js application as human readable code

## Meta commands
For information about Meta scaffolding commands, please visit [this site](https://github.com/afklm/slush-meta)
