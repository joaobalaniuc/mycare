function postSend() {
    // DATA TO SEND
    var data_form = $("#post").serialize();
    var data_user = {
        user_email: "...",
        query: "insert"
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
        timeout: 5000
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
                        window.location.href = "ad.read.html";
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
            last_id: sessionStorage.last_id,
            categ_id: sessionStorage.categ_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                if (last_id == 0)
                    preloader(false);
                else
                    $('#loading').fadeOut("fast");
            })

            .fail(function () {
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
                            $(this).find(".post_address").html(val["address_neigh"] + " - " + val["address_city"] + " <div style='float:right'>5km</div>");
                            $(this).find(".post_title").html("#" + val["post_id"] + " " + val["post_title"]);
                            $(this).find(".post_txt").html(val["post_title"]);
                            $(this).find(".post_user").html(val["user_first_name"] + " " + val["user_last_name"]);
                            $(this).find(".post_date").html(val["post_date"]);
                            $(this).find(".go_read").attr("data-id", val["post_id"]);
                            $(this).find(".post_view").html(view);
                            $(this).find(".post_com").html(com);
                            $(this).find(".post_like").html(like);
                            var rand = getRandomInt(1, 7);
                            $(this).find(".post_img").attr("src", "img/simula" + rand + ".jpg");
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

            }); // after ajax
}

function postRead() {
    preloader("", 7);
    $.ajax({
        url: localStorage.server + "/post_read.php",
        data: {
            post_id: sessionStorage.post_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
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
                        return;
                    }

                    var view = res[0]["post_total_view"];
                    if (view == null)
                        view = 0;
                    var com = res[0]["post_total_com"];
                    if (com == null)
                        com = 0;
                    var like = res[0]["post_total_like"];
                    if (like == null)
                        like = 0;

                    $("#post_view").html(view);
                    $("#post_com").html(com);
                    $("#post_like").html(like);

                    $("[name=post_id]").val(res[0]["post_id"]);

                    $("#post_title").html(res[0]["post_title"]);
                    $("#post_neigh_city").html(res[0]["address_neigh"] + " - " + res[0]["address_city"]);
                    if (res[0]["post_view"] === null)
                        res[0]["post_view"] = 0;
                    $("#post_view").html(res[0]["post_view"]);
                    var txt = res[0]["post_txt"];
                    if (txt !== null) {
                        $("#post_txt_").html(txt.substr(0, 1));
                        $("#post_txt").html(txt.substr(1));
                    }
                    if (res[0]["post_home"] == 1) {
                        $("#post_home").show();
                    }
                    if (res[0]["post_home_txt"] !== null) {
                        $("#post_home_txt").html(res[0]["post_home_txt"]).show();
                    }
                    if (res[0]["post_total_com"] !== null && res[0]["post_total_com"] > 0) {
                        $("#post_com_title").html(res[0]["post_total_com"] + " Comentário(s)");
                    }
                    else {
                        $("#post_com_title").html("Nenhum comentário");
                    }
                    if (res[0]["address_id"] !== null) {
                        var ref = "";
                        if (res[0]["address_ref"] !== null) {
                            ref = " - " + res[0]["address_ref"];
                        }
                        else
                            ref = "";

                        var address_txt = res[0]["address_street"] + " " + res[0]["address_number"] + ", " + res[0]["address_neigh"] + " - " + res[0]["address_city"] + " " + res[0]["address_state"] + ref;
                        var address_noRef = res[0]["address_street"] + " " + res[0]["address_number"] + ", " + res[0]["address_neigh"] + " - " + res[0]["address_city"] + " " + res[0]["address_state"];

                        $("#post_address").html(address_txt);
                        $("#post_address_").show();

                        var address = encodeURI(address_noRef);

                        $("#iframe").html('<iframe width="100%" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=' + address + '&hl=es;z=14&amp;output=embed"></iframe>');
                    }
                    if (res["categ"][0]) {
                        var virG = "";
                        $.each(res["categ"], function (k, v) {
                            if (v["categ_name"]) {
                                $("#categ").append(virG + v["categ_name"]);
                                virG = ", ";
                            }
                        });
                    }

                    sessionStorage.com_total = res[0]["post_total_com"];
                    if (res[0]["post_total_com"] == null || res[0]["post_total_com"] == 0) {
                        $(".loadmore").remove();
                    }
                    else {
                        addLoadMore();
                    }

                } // res not null
            }); // after ajax
}