function postSend() {
    // DATA TO SEND
    var data_form = $("#post").serialize();
    var data_user = {
        user_id: localStorage.user_id,
        user_email: localStorage.user_email,
        user_pass: localStorage.user_pass
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);
    preloader();
    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/post_send.php",
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
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        //myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        //alert(res.error);
                        return;
                    }
                    if (res.success) {

                        sessionStorage.post_id = res.success;
                        // APÓS EDITAR
                        if (sessionStorage.edit_post_id > 0) {
                            window.location.href = "post_read.html";
                        }
                        // APÓS INSERIR
                        else {
                            sessionStorage.edit_post_id = sessionStorage.post_id;
                            sessionStorage.edit_post_title = $("[name=post_title]").val();
                            sessionStorage.edit_post_address = $("[name=address_neigh]").val() + " - " + $("[name=address_city]").val();
                            window.location.href = "pic_my.html";
                        }
                    }

                } // res not null
            }); // after ajax
}

function postList(last_id) {

    if (sessionStorage.last_id === 0)
        preloader("", 7);
    else
        $('#loading').fadeIn("slow");

    //alert(sessionStorage.last_id+" "+sessionStorage.categ_id);

    $.ajax({
        url: localStorage.server + "/post_list.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            last_id: sessionStorage.last_id,
            categ_id: sessionStorage.categ_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                if (last_id == 0)
                    preloader(false);
                else
                    $('#loading').fadeOut("fast");
            })

            .fail(function () {
                alertx("Ocorreu um erro interno");
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);

                    if (res === false && sessionStorage.last_id == 0) {
                        $("#loading").hide();
                        $("#ads").html("<div style='margin:32px;text-align:center;font-size:18px;margin-bottom:50px;margin-top:50px'>Desculpe, sua busca não retornou resultados</div>");
                        return;
                    }

                    if (res.error) {
                        return;
                    }
                    var i = 0;
                    $.each(res, function (key, val) {

                        i++;

                        $("#card_template")
                                .clone()
                                .prop({
                                    id: "post_" + val["post_id"]
                                })
                                .appendTo("#ads")
                                .attr("data-id", val["post_id"])
                                .addClass("delay-" + i);

                        $("#post_" + val["post_id"]).each(function (index) {

                            var view = val["post_total_view"];
                            if (view == null)
                                view = 0;
                            var com = val["post_total_com"];
                            if (com == null)
                                com = 0;
                            var like = val["post_total_like"];
                            if (like == null)
                                like = 0;

                            if (val["like_id"] > 0) {
                                $(this).find(".post_like").css("color", "blue");
                                $(this).find(".post_like_txt").css("color", "blue").html("Curtiu");
                            }
                            if (val["img_fn"] != null) {

                                $(this).find(".img_bg").css("background-image", "url(" + localStorage.server + localStorage.server_img + val["img_fn"] + ")");
                            }
                            if (val["user_fb"] != null) {
                                $(this).find(".avatar").attr("src", "http://graph.facebook.com/" + val["user_fb"] + "/picture?width=100&height=100");
                            }

                            if (val["user_last_name"] != null) {
                                var lastname = val["user_last_name"];
                            }
                            else
                                var lastname = "";

                            $(this).find(".post_address").html(val["address_neigh"] + " - " + val["address_city"] + " <div style='float:right'>5km</div>");
                            $(this).find(".post_title").html("#" + val["post_id"] + " " + val["post_title"]);
                            $(this).find(".post_txt").html(val["post_title"]);
                            $(this).find(".post_user").html(val["user_first_name"] + " " + lastname);
                            $(this).find(".post_date").html(val["post_date"]);
                            $(this).find(".go_read").attr("data-id", val["post_id"]);
                            $(this).find(".post_view").html(view);
                            $(this).find(".post_com").html(com);
                            $(this).find(".post_like").html(like);

                            //var rand = getRandomInt(1, 7);

                        }).show();

                        if (i > 7)
                            i = 0;

                        sessionStorage.last_id = val["post_id"];
                        console.log(sessionStorage.last_id);

                    });

                    $(".post_txt").text(function (index, currentText) {
                        if (currentText.length > 64) {
                            return currentText.substr(0, 64) + " ...";
                        }
                    });

                    pretty();


                } // res not null
                else {
                    alertx("Erro interno.");
                }

            }); // after ajax
}

function postRead(post_id, cb) {

    preloader();
    $.ajax({
        url: localStorage.server + "/post_read.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id
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
                var r = {"fail": true};
                cb(r);
            })

            .done(function (res) {
                cb(res);
            }); // after ajax
}

function postDel(post_id) {

    preloader();
    $.ajax({
        url: localStorage.server + "/post_del.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id
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
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {

                $("#post_" + post_id).remove();

            });

}
