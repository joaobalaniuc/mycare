$(".com_title").html(sessionStorage.edit_post_title);

if (sessionStorage.edit_post_com === "0") {
    $("#status_1").show();
    $("#status_0").hide();
}
else {
    $("#status_1").hide();
    $("#status_0").show();
}

preloader();
$.ajax({
    url: localStorage.server + "/com_list.php",
    data: {
        user_id: localStorage.user_id,
        user_email: localStorage.user_email,
        user_pass: localStorage.user_pass,
        //
        all: true,
        post_id: sessionStorage.edit_post_id
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
            alert(0);
            //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
        })

        .done(function (res) {

            if (res !== null) {
                console.log(res);

                if (res === false) {
                    $("#nenhum").show();
                    $(".com_total").html(0);
                    return;
                }

                var total = 0;
                $.each(res, function (key, val) {
                    total++;
                    $("#com_template")
                            .clone()
                            .prop({
                                id: "com_" + val["com_id"]
                            })
                            .appendTo("#com")
                            .attr("data-id", val["com_id"]);


                    $("#com_" + val["com_id"]).each(function (index) {

                        $(this).find(".com_txt").html(val["com_txt"]);
                        $(this).find(".com_date").html(val["com_date"]);
                        $(this).find(".com_user").html(val["user_first_name"] + " " + val["user_last_name"]);
                        if (val["user_fb_pic"] !== null) {
                            $(this).find(".avatar").html(val["user_fb_pic"]);
                        }
                        var rand = getRandomInt(1, 7);
                        $(this).find(".post_img").attr("src", "img/simula" + rand + ".jpg");

                    }).show();

                });
                $(".com_total").html(total);
                pretty();

            } // res not null
            else {
                $("#nenhum").show();
                $(".com_total").html(0);
                return;
            }
        }); // after ajax