/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 7230;
var environment = process.env.NODE_ENV;
var mock = process.env.MOCK;
var url = require('url');


console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./target/'));
        break;
    default:
        console.log('** DEV **');
        if(mock === 'YES') {
            app.use(function (req, res, next){
                var parts = url.parse(req.url);
                var m = parts.pathname.match(/^(\/app\/boot\.js)/);
                if( m ) {
                    req.url = '/mock/boot.js';
                };
                next();
            });
        }
        app.use(express.static('./src/'));
        app.use(express.static('./.tmp/'));
        app.use(express.static('./'));

        break;
}

//Middleware error 404
app.use(function(req, res, next) {
    res.status(404);
    res.send('Error 404 : ' + req.originalUrl + ' not found');
    res.end();
});

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});
