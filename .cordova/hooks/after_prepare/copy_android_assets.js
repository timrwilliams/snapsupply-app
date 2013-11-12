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
    iconroot = rootdir + client_directory + "/assets/icon/android",
    screenroot = rootdir + client_directory + "/assets/screen/android",
    androidroot = rootdir + "/platforms/android";
try {
    fs.lstatSync( androidroot ).isDirectory();
}
catch( e ) {
    console.log( "android platform does not exist. nothing to do here." );
    process.exit(0);
}

// incase there are any spaces in the projectname
var projectname = config.name.replace(" ", "\\ ");

// for some reason, using shell.cp() would throw this error:
// "cp: copy File Sync: could not write to dest file (code=ENOENT)"
shell.exec( "cp -Rf " + iconroot + "/* " + androidroot + "/res", {silent:true} );
shell.exec( "cp -Rf " + screenroot + "/* " + androidroot + "/res", {silent:true} );

console.log( "Copied all android assets." );

process.exit(0);