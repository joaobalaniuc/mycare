//==============================================
// FACEBOOK API
//==============================================

var fb = {
    login: function () {

        facebookConnectPlugin.login(['email', 'public_profile', 'user_birthday'], function (result) {
            alert("fb.login() = " + JSON.stringify(result));
            localStorage.fb_id = result.authResponse.userID;
            localStorage.fb_token = result.authResponse.accessToken;
            localStorage.fb_status = 'connected';
            //
            facebookConnectPlugin.api("/me?fields=id,birthday,gender,first_name,age_range,last_name,name,picture.width(400),email", [],
                    function (result) {
                        alert("/me = " + JSON.stringify(result));
                    },
                    function (error) {
                        alert("/me failed = " + error);
                    });
            //
        }, function (err) {
            alert('an error occured while trying to login. please try again. Err:' + err);
        });
    },
    /*,
     getUserInfo: function () {
     //facebookConnectPlugin.api(localStorage.fb_id + "/?fields=id,email,first_name,last_name,gender,picture,birthday", ["public_profile", "user_birthday"],
     facebookConnectPlugin.api("/me", ["public_profile"],
     function (result) {
     alert("fb.getUserInfo() = " + JSON.stringify(result));
     localStorage.fb_id = result.id;
     localStorage.fb_first_name = result.first_name;
     localStorage.fb_last_name = result.last_name;
     localStorage.fb_gender = result.gender;
     localStorage.fb_email = result.email;
     localStorage.fb_birthday = result.birthday;
     //alert(localStorage.fb_email);
     },
     function (error) {
     alert("Failed: " + error);
     });
     },
     */
    getLoginStatusX: function () {

        facebookConnectPlugin.getLoginStatus(
                function (response) {

                    alert("fb.getLoginStatusX() = " + JSON.stringify(response));
                    localStorage.fb_status = response.status;
                    if (response.status === 'connected') {
                        var uid = response.authResponse.userID;
                        var accessToken = response.authResponse.accessToken;
                        localStorage.fb_id = result.authResponse.userID;
                        localStorage.fb_token = result.authResponse.accessToken;
                        alert("AUTH OK");
                        //return "OK MESMO";
                    } else if (response.status === 'not_authorized') {
                        alert("NOT AUTH");
                    } else {
                        alert("NOG LOGGED");
                    }
                },
                function (error) {
                    alert("Failed: " + error);
                });

    }/*,
     getLoginStatus: function () {
     
     facebookConnectPlugin.getLoginStatus(function (response) {
     
     //alert("fb.getLoginStatus() = ");
     localStorage.fb_status = response.status;
     
     if (response.status === 'connected') {
     var uid = response.authResponse.userID;
     var accessToken = response.authResponse.accessToken;
     localStorage.fb_id = result.authResponse.userID;
     localStorage.fb_token = result.authResponse.accessToken;
     alert("AUTH OK");
     //return "OK MESMO";
     } else if (response.status === 'not_authorized') {
     alert("NOT AUTH");
     } else {
     alert("NOG LOGGED");
     }
     });
     }*/,
    logout: function () {
        facebookConnectPlugin.logout(
                function () {
                    alert("logout ok");
                },
                function () {
                    alert("logout error");
                });
    }

};
