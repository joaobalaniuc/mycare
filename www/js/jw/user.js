function userSend() {
    // DATA TO SEND
    var data_form = $("#userForm").serialize();
    var data_user = {
        //user_email: "...",
        //query: "insert"
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);
    preloader();
    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_send.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                preloader(false);
            })

            .fail(function () {
                alert("err");
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        alertx(res.error, "Ops!", "OK", function () {
                            $("#user_email").focus().select();
                        });
                        return;
                    }
                    if (res.id) {
                        localStorage.user_id = res.id;
                        localStorage.user_email = res.email;
                        localStorage.user_pass = res.pass;
                        window.location.href = "index.html";
                    }

                } // res not null
            }); // after ajax
}

function userLogin() {

    // PRELOADER
    preloader();

    // DATA TO SEND
    var data_form = $("#userForm").serialize();
    var data_user = {
        //user_email: "...",
        //query: "insert"
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_login.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                preloader(false);
            })

            .fail(function () {
                alertx("Ocorreu um erro interno. Tente novamente mais tarde.", "Desculpe...");
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        alertx(res.error, "Ops!");
                        return;
                    }
                    if (res.id) {
                        localStorage.user_id = res.id;
                        localStorage.user_email = res.email;
                        localStorage.user_pass = res.pass;
                        window.location.href = "index.html";
                    }

                } // res not null
            }); // after ajax
}

function userInfo(user_email, cb) {

    // PRELOADER
    preloader();

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_info.php",
        data: {
            user_email: user_email
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                preloader(false);
            })

            .fail(function () {
                alertx("Ocorreu um erro interno. Tente novamente mais tarde.", "Desculpe...");
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        alertx(res.error, "Ops!");
                        return;
                    }
                    cb(res);

                } // res not null
            }); // after ajax
}
