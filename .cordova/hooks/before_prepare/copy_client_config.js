#!/usr/bin/env node
var path = require( "path" ),
    fs = require( "fs" ),
    shell = require( "shelljs" ),
    rootdir = process.argv[ 2 ],
    client = process.env.CLIENT;
var client_directory = "";
if(client){
  client_directory = "/clients/"+ client;
}
var config = require(rootdir + "/.cordova/config.json"),
    clientroot = rootdir + client_directory,
    androidroot = rootdir + "/platforms/android";
    wwwroot = rootdir + "/platforms/android/assets/www/";
try {
    fs.lstatSync( wwwroot ).isDirectory();
}
catch( e ) {
    console.log( "android platform does not exist. nothing to do here." );
    process.exit(0);
}

// incase there are any spaces in the projectname
var projectname = config.name.replace(" ", "\\ ");

shell.exec( "cp -f " + clientroot + "/www/config.xml " + androidroot + "/assets/www/" , {silent:true} );
shell.exec( "cp -f " + clientroot + "/android/res/values/strings.xml " + androidroot + "/res/values/" , {silent:true} );

console.log( "Copied client config." );

process.exit(0);