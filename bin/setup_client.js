#!/usr/bin/env node
var path = require( "path" ),
    fs = require( "fs" ),
    shell = require( "shelljs" ),
    rootdir = "C:/dev/projects/snapsupply-app";

function copy_client_assets(client){
    var client_dir = "";
    if(client){
        console.log("Building for client: "+client);
        client_dir = client;
    }
    var	client_asset_dir = rootdir + "/clients/" + client_dir;
    var clientroot = rootdir + "/gen/" + client_dir;
    try {
        fs.lstatSync( clientroot ).isDirectory();
    }
    catch( e ) {	
        console.log( "android platform does not exist. Creating at:"+clientroot );
        shell.mkdir("-p",clientroot);
    }

    shell.cp( "-Rf", rootdir + "/.cordova" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/merges" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/www" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/platforms" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/plugins" , clientroot + "/");
    shell.cp( "-Rf", client_asset_dir + "/www/config.xml" , clientroot + "/www/config.xml" + "/");
    shell.rm( "-Rf", clientroot + "/platforms/android/src/com/teachmatic");
    shell.cp( "-Rf", client_asset_dir + "/android/AndroidManifest.xml", clientroot + "/platforms/android/AndroidManifest.xml");
    shell.cp( "-Rf", client_asset_dir + "/android/src/com/teachmatic/snapsupply", clientroot + "/platforms/android/src/com/teachmatic");

    console.log( "Generated client folder." );
}

exports.copy_client_assets = copy_client_assets;

var main = function(){
    copy_client_assets(process.env.CLIENT);
    process.exit();
}

if (require.main === module) {
    main();
}
