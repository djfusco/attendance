var app = (function()
{
	// Application object.
	var app = {};

	// Specify your beacon 128bit UUIDs here.
	var regions =
	[
		// Estimote Beacon factory UUID.
		// {uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D'},
	
		// Sample UUIDs for beacons in our lab.
		{uuid:'2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6'},
		// {uuid:'F7826DA6-4FA2-4E98-8024-BC5B71E0893E'},
		// {uuid:'8DEEFBB9-F738-4297-8040-96668BB44281'},
		// {uuid:'A0B13730-3A9A-11E3-AA6E-0800200C9A66'},
		// {uuid:'E20A39F4-73F5-4BC4-A12F-17D1AD07A961'},
		// {uuid:'A4950001-C5B1-4B44-B512-1370F02D74DE'},
		// {uuid:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0'},
		// {uuid:'585CDE93-1B01-42CC-9A13-25009BEDC65E'},	// Dialog Semiconductor.
	];

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;

	app.initialize = function()
	{
		document.addEventListener(
			'deviceready',
			function() { evothings.scriptsLoaded(onDeviceReady) },
			false);
	};

	function onDeviceReady()
	{
		// Specify a shortcut for the location manager holding the iBeacon functions.
		window.locationManager = cordova.plugins.locationManager;

		// Start tracking beacons!
		startScan();

		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 500);
	}

	function startScan()
	{
		// The delegate object holds the iBeacon callback functions
		// specified below.
		var delegate = new locationManager.Delegate();

		// Called continuously when ranging beacons.
		delegate.didRangeBeaconsInRegion = function(pluginResult)
		{
			//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
			for (var i in pluginResult.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = pluginResult.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
			}
		};

		// Called when starting to monitor a region.
		// (Not used in this example, included as a reference.)
		delegate.didStartMonitoringForRegion = function(pluginResult)
		{
			//console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
		};

		// Called when monitoring and the state of a region changes.
		// (Not used in this example, included as a reference.)
		delegate.didDetermineStateForRegion = function(pluginResult)
		{
			//console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
		};

		// Set the delegate object to use.
		locationManager.setDelegate(delegate);

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		locationManager.requestAlwaysAuthorization();

		// Start monitoring and ranging beacons.
		for (var i in regions)
		{
			var beaconRegion = new locationManager.BeaconRegion(
				i + 1,
				regions[i].uuid);

			// Start ranging.
			locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail(console.error)
				.done();

			// Start monitoring.
			// (Not used in this example, included as a reference.)
			locationManager.startMonitoringForRegion(beaconRegion)
				.fail(console.error)
				.done();
		}
	}

	function displayBeaconList()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();

		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 60000 > timeNow)
			{
				// Map the RSSI value to a width in percent for the indicator.
				var rssiWidth = 1; // Used when RSSI is zero or greater.
				if (beacon.rssi < -100) { rssiWidth = 100; }
				else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }

// Calculate today's date - working
	 			var dateObj = new Date();
 				var month = dateObj.getMonth() + 1;
 				var day = dateObj.getDate();
 				var year = dateObj.getFullYear();
 				var fulldate = month+day+year+beacon.major+beacon.minor;  //added major and minor
 				
 				switch (beacon.major) {
						case 1:
							var lrscoursesubject = "IST"
							break;
						case 2:
							var lrscoursesubject = "SRA"
							break;						
						case	3:
							var lrscoursesubject = "CMPSC"
							break;
				}
			
 // Get currently stored, local ID and DATE for this specific course - working
				var currentstatus = window.localStorage.getItem("DJFID");

				var buildminor = beacon.minor;
				var buildcoursenum = buildminor.toString();	
				var DJFCOURSEID = lrscoursesubject.concat(buildcoursenum);
								
				var currentdate = window.localStorage.getItem(DJFCOURSEID);

 					
				// Create tag to display beacon data.
				var element = $(
					'<li>'
					+	'<strong>UUID: ' + beacon.uuid + '</strong><br />'
					+	'Subject: ' + lrscoursesubject + '<br />'
					+	'Course: ' + beacon.minor + '<br />'
		
				//	+	'CourseID: ' + DJFCOURSEID + '<br />'
		
				//	+	'Proximity: ' + beacon.proximity + '<br />'
				//	+	'RSSI: ' + beacon.rssi + '<br />'
				//	+ 	'<div style="background:rgb(255,128,64);height:20px;width:'
				//	+ 		rssiWidth + '%;"></div>'
				//	+	'User: ' + currentstatus + '<br />'
				//	+	'DATE: ' + currentdate + '<br />'
				//	+	'CALCDATE: ' + fulldate + '<br />'
				//	+	'Month: ' + month + '<br />'
				//	+	'Day: ' + day + '<br />'			
				//	+	'Year: ' + year + '<br />'
					+	'<br />'				
					+	'Your attendance has been recorded <br />'	
					+ '</li>'
				);
				
// Email local storage - working
				if (currentstatus === null) {
					var email = prompt("Please enter your email address.");
					// document.write(email);
					localStorage.setItem("DJFID", email);
				}
			
// Get local storage email again - working				
				var currentlrsemail = window.localStorage.getItem("DJFID");
			
// Check to see if we already cut the record to the LRS - working
				if (currentdate != fulldate) {

// Changed this to work on a per course basis
					localStorage.setItem(DJFCOURSEID, fulldate);
			
// Set up LRS connection info - working								
					var tincan = new TinCan (
    						{
 						       recordStores: [
            						{
                					endpoint: "https://sandbox.watershedlrs.com/api/organizations/2671/lrs/",
                					username: "a1e5qqfdotP6WF",
                					password: "N2uUoo92TdcmaZ",
                					allowFail: false
					            	}
        						]
    						}
					);
					// document.write(fulldate);

// Build Tincan statement variables - working			
					var lrsemail = "mailto:"+currentlrsemail;					
					var minor = beacon.minor;
					var lrscoursenum = minor.toString();	
					var lrscoursenamenum = lrscoursesubject.concat(" ").concat(lrscoursenum);
					
/* Copied from Statement Generator - with "" - WORKS */
tincan.sendStatement(
{
    "actor": {
        "mbox": lrsemail,
        "objectType": "Agent"
    },
    "verb": {
        "id": "http://adlnet.gov/expapi/verbs/attended",
        "display": {
            "en-US": "Attended"
        }
    },
    "object": {
        "id": "http://www.ist.psu.edu/",
        "definition": {
            "name": {
                "en-US": lrscoursenamenum
            },
            "description": {
                "en-US": lrscoursenum
            }
        },
        "objectType": "Activity"
    }
}
);	
				}

				$('#warning').remove();
				$('#found-beacons').append(element);
			}
		});
	}

	return app;
})();

app.initialize();
