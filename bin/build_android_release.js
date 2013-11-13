#!/usr/bin/env node
/*setup.copy_client_assets(process.env.CLIENT);
shell.cd(rootdir+"/gen/"+process.env.CLIENT);
shell.exec('cordova build android --release');
shell.cd('platforms/android/bin');
child_process.exec('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "C:/Users/Tim/Google Drive/Keystore/teachmatic.keystore" SnapSupply-release-unsigned.apk teachmatic')
shell.exec('zipalign -f -v 4 SnapSupply-release-unsigned.apk %CLIENT%-release.apk')
*/

var main = function(){
	ask("Keypass password", /.+/, function(password) {
	var path = require( "path" ),
    	fs = require( "fs" ),
    	shell = require( "shelljs" ),
    	client = process.env.CLIENT,
    	child_process = require( "child_process"),
    	rootdir = "C:/dev/projects/snapsupply-app";
	var setup = require('./setup_client');
	setup.copy_client_assets(client);
	shell.cd(rootdir+"/gen/"+client);
	shell.exec('cordova build android --release');
	shell.cd('platforms/android/bin');
	var pass_args = " -keypass " + password + " -storepass " + password;
	shell.exec('jarsigner'+pass_args+' -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "C:/Users/Tim/Google Drive/Keystore/teachmatic.keystore" SnapSupply-release-unsigned.apk teachmatic', [], { stdio: 'inherit' }); 
	shell.exec('zipalign -f -v 4 SnapSupply-release-unsigned.apk '+client+'-release.apk')
    process.exit();
});    
}

if (require.main === module) {
    main();
}

function ask(question, format, callback) {
 var stdin = process.stdin, stdout = process.stdout;
 
 stdin.resume();
 stdout.write(question + ": ");
 
 stdin.once('data', function(data) {
   data = data.toString().trim();
 
   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });
}