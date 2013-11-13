#!/usr/bin/env node
var path = require( "path" ),
    fs = require( "fs" ),
    shell = require( "shelljs" ),
    rootdir = "/Users/siriley/dev/snapsupply-app";

function copy_client_assets(client){
    setup_android(rootdir);
    setup_ios(rootdir);
    setup_plugins(rootdir); 
    var client_dir = "";
    if(client){
        console.log("Building for client: "+client);
        client_dir = client;
    }
    else{
        console.log("No client set, please set the $CLIENT environment variable");
        console.log("export CLIENT=");
        process.exit(1);
    }

    var	client_asset_dir = rootdir + "/clients/" + client_dir;
    var clientroot = rootdir + "/gen/" + client_dir;
    try {
        fs.lstatSync( clientroot ).isDirectory();
    }
    catch( e ) {	
        console.log( "This client does not exist yet. Creating at:"+clientroot );
        shell.mkdir("-p",clientroot);
    }

    shell.cp( "-Rf", rootdir + "/.cordova" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/merges" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/www" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/platforms" , clientroot + "/");
    shell.cp( "-Rf", rootdir + "/plugins" , clientroot + "/");
    shell.cp( "-Rf", client_asset_dir + "/www/config.xml" , clientroot + "/www/config.xml");
    shell.rm( "-Rf", clientroot + "/platforms/android/src/com/teachmatic");
    shell.cp( "-Rf", client_asset_dir + "/android/AndroidManifest.xml", clientroot + "/platforms/android/AndroidManifest.xml");
    shell.cp( "-Rf", client_asset_dir + "/android/src/com/teachmatic/snapsupply", clientroot + "/platforms/android/src/com/teachmatic");
    shell.cp( "-Rf", client_asset_dir + "/ios/SnapSupply-Info.plist", clientroot + "/platforms/ios/SnapSupply");
    console.log( "Generated client folder." );
}

function setup_plugins(rootdir){
    console.log("Checking plugins...");
    pluginroot = rootdir + "/plugins";
    plugins = ["geolocation","console","splashscreen"];
    for (i = 0;i<plugins.length;i++){
        plugin_package = "org.apache.cordova."+plugins[i];
        plugindir = pluginroot + "/" + plugin_package; 
        try {
            fs.lstatSync( plugindir ).isDirectory();
        }
        catch( e ) {    
            console.log( plugins[i] + " plugin does not exist yet. Adding..." );
            shell.exec("cordova plugin add " + plugin_package);
        }
    }
}

function setup_android(rootdir){
    androidroot = rootdir + "/platforms/android";
    try {
        fs.lstatSync( androidroot ).isDirectory();
    }
    catch( e ) {    
        console.log( "android platform does not exist yet. Creating at:"+androidroot );
        shell.exec("cordova platform add android");
    }
}


function setup_ios(rootdir){
    iosroot = rootdir + "/platforms/ios";
    try {
        fs.lstatSync( iosroot ).isDirectory();
    }
    catch( e ) {    
        console.log( "ios platform does not exist yet. Creating at:"+iosroot );
        shell.exec("cordova platform add ios");
    }
}

exports.copy_client_assets = copy_client_assets;

var main = function(){
    copy_client_assets(process.env.CLIENT);
    process.exit();
}

if (require.main === module) {
    main();
}
