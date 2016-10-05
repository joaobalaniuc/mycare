//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

    //alert("start");

    // App config
    localStorage.appname = "MyCare";
    localStorage.version = "1.0.0";

    // Server
    localStorage.server = "http://192.168.0.100/mycare/server/";
    //localStorage.server = "http://localhost/mycare/server/";
    //localStorage.server = "http://10.0.0.35/mycare/server/";

    // Ajax timeout
    localStorage.timeout = 5000; // ajax
}

var app = {
// Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("online", onOnline, false);
        function onOnline() {
            sessionStorage.online = true;
        }
        document.addEventListener("offline", onOffline, false);
        function onOffline() {
            sessionStorage.online = false;
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        app.receivedEvent('deviceready');

        // GEOLOCATION
        geo();

        // CURRENT FILE
        var fn = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        alert(fn);
        app.ready(fn);
    },
    // Update DOM on a Received Event
    ready: function (fn) {
        //alert(fn);
        switch (fn) {

            case "index.html":
                start();
                // SPLASHSCREEN (CONFIG.XML BUGFIX)
                setTimeout(function () {
                    navigator.splashscreen.hide();
                    if (window.StatusBar) {
                        /*StatusBar.overlaysWebView(false);
                         StatusBar.backgroundColorByHexString("#3f51b5");
                         StatusBar.styleLightContent();*/
                    }
                }, 500);
                break;

            case "contact.html":
                break;
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');
         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');*/
        console.log('Received Event: ' + id);
    }
};


function geo() {
    var onSuccess = function (position) {
        sessionStorage.lat = position.coords.latitude;
        sessionStorage.lng = position.coords.longitude;
        /*alert('Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n' +
                'Altitude: ' + position.coords.altitude + '\n' +
                'Accuracy: ' + position.coords.accuracy + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                'Heading: ' + position.coords.heading + '\n' +
                'Speed: ' + position.coords.speed + '\n' +
                'Timestamp: ' + position.timestamp + '\n');*/
    };
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}