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
var iconroot = rootdir + client_directory + "/ios/Resources/icons",
    splashroot = rootdir + client_directory + "/ios/Resources/splash",
    iosroot = rootdir + "/platforms/ios";
try {
    fs.lstatSync( iosroot ).isDirectory();
}
catch( e ) {
    console.log( "ios platform does not exist. nothing to do here." );
    process.exit(0);
}

// for some reason, using shell.cp() would throw this error:
// "cp: copy File Sync: could not write to dest file (code=ENOENT)"
shell.exec( "cp -Rf " + iconroot + "/* " + iosroot + "/SnapSupply/Resources/icons/");
shell.exec( "cp -Rf" + splashroot + "/* " + iosroot + "/SnapSupply/Resources/splash/");

console.log( "Copied ios assets." );

process.exit(0);