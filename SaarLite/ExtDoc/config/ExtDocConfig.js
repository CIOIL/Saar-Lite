Ext.define('ExtDoc.config.ExtDocConfig', {
    singleton: true,
    restUrl: 'http://localhost:8080/NessDctmRest/',
	autoUploadType: 'gov_document',
	folderType: 'gov_folder',
	language: 'he',
	authenticationType: 'basic',
	//authenticationType: 'govsc',
	//authenticationType: 'kerberos',
	//kerberosDisplayDocbases: 'false', 
	//kerberosDocbase: 'saar_test',
	//authenticationType: window.location.href.indexOf('f5') > -1 ? 'govsc' : 'basic',
	//checkoutScheme: 'SaarLite',    //using files.properties
    checkoutScheme: 'Saar',    //using documentum.ini	
    checkoutPath: '', //used when checkoout_path is different from default. Examples: 'S:\\XXX\\YYY', 'X:\\folder1\\folder2\\folder3' or empty string for default
    version: '1.1.8', 
    url: window.location.origin + '/SaarLite', 
    guideUrl: window.location.href.concat('help/userguide.pdf'),
    timeout: 100, //in minutes
    remember_me_timeout: 720, //in minutes (currently not in use)
    toast_timeout: 6000,
    saarUrl: 'http://localhost:8080/saar', //saar url for distribution
    allowLimitedAccess: true,
    outlookConnection: 'addin'
    //outlookConnection: 'redemption'
});
