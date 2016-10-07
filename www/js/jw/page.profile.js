
function userInfoCb(res) {
    FF(res, "#userForm");
    $(".user_first_name").html(res[0].user_first_name);
    $(".user_email").html(res[0].user_email);

    var fb = res[0].user_fb_pic;
    if (fb != null) {
        //$(".avatar").attr("src", "http://graph.facebook.com/" + fb + "/picture?width=100&height=100");
        $(".avatar").attr("src", fb);
        $("#fb_ass").hide();
        $("#fb_des").show();
    }
}

function userPass() {
    // PRELOADER
    preloader();

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_pass.php",
        data: {
            user_email: localStorage.user_email,
            user_pass: $("[name=user_pass]").val(),
            user_new_pass: $("[name=user_new_pass]").val()
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
                    if (res.success > 0) {
                        $("#passForm").html("<div style='padding:20px;font-size:18px;text-align:center'>Sua senha foi alterada com sucesso.</div>");
                    }


                } // res not null
            }); // after ajax
}

function userUpdate() {
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
        url: localStorage.server + "/user_update.php",
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
                            //$("#user_email").focus().select();
                        });
                        return;
                    }
                    if (res.success) {
                        $("#userSubmit").hide();
                        alertx("Seus dados foram alterados com sucesso.", "", "OK");
                    }

                } // res not null
            }); // after ajax
}