function picList(post_id, cb) {

    $.ajax({
        url: localStorage.server + "/pic.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id,
            action: "ls"
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

function picListCb(res) {
    console.log(res);

    var img = res.img;

    $(".grid").html("");

    if (img[0]) {
        $.each(img, function (k, v) {
            if (v["img_fn"]) {

                var url = localStorage.server + "/app/pic/img/" + v["img_fn"];
                var grid = "";

                if (v["img_id"] == res.cover[0].img_id) {
                    console.log(res.cover);
                    var dis = "disabled";
                    $("#cover").css("background-image", "url(" + url + ")");
                }
                else
                    var dis = "";

                grid += '<div class="grid-item" data-id="' + v["img_id"] + '">';
                grid += '<a href="' + url + '" class="swipebox no-smoothState" title="' + v["img_fn"] + '">';
                grid += '<img src="' + url + '" alt="image">';
                grid += '</a>';

                grid += '<center style="margin-top:5px;margin-bottom:10px">';
                grid += '<a href="#!" class="' + dis + ' but cover waves-effect waves-light btn"><i class="fa fa-image"></i></a>';
                grid += '<a href="#!" class="but del waves-effect red waves-light btn"><i class="fa fa-times"></i></a>';
                grid += '</center>';

                grid += '</div>';
                $(".grid").append(grid);
            }
        });
    }

}

function picDel(img_id) {

    preloader();
    $.ajax({
        url: localStorage.server + "/pic.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            img_id: img_id,
            action: "rm"
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
                if (res.success > 0) {
                    $("[data-id=" + img_id + "]").fadeOut("fast");
                }
            });

}

function picCover(post_id, img_id) {

    preloader();
    $.ajax({
        url: localStorage.server + "/pic.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            img_id: img_id,
            post_id: post_id,
            action: "cover"
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
                if (res.success > 0) {
                    picList(sessionStorage.edit_post_id, picListCb);
                }
            });

}
