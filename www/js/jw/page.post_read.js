//--------------------------------
// VER POST
// DEPEND: post.js
//--------------------------------
function postReadCb(res) {
    preloader(false);

    var cat = res["categ"];
    var post = res["post"];
    var img = res["img"];

    console.log(cat);
    console.log(post);
    console.log(img);

    if (post[0]["post_com"] === "0") {
        $("#post_div").hide();
    }

    if (res === null || res.fail || res.error) {
        return;
    }

    var view = post[0]["post_total_view"];
    if (view == null)
        view = 0;
    var com = post[0]["post_total_com"];
    if (com == null)
        com = 0;
    var like = post[0]["post_total_like"];
    if (like == null)
        like = 0;

    var img_fn = post[0]["img_fn"];
    if (img_fn != null) {
        $("#img_fn").attr("src", localStorage.server + "/app/pic/img/" + img_fn);
    }

    $("#post_view").html(view);
    $("#post_com").html(com);
    $("#post_like").html(like);
    $("[name=post_id]").val(post[0]["post_id"]);
    $(".post_title").html(post[0]["post_title"]);
    $("#post_neigh_city").html(post[0]["address_neigh"] + " - " + post[0]["address_city"]);
    if (post[0]["post_view"] === null)
        post[0]["post_view"] = 0;
    $("#post_view").html(post[0]["post_view"]);
    var txt = post[0]["post_txt"];
    if (txt !== null) {
        if (txt.len > 32) {
            $("#post_txt_").html(txt.substr(0, 1));
            $("#post_txt").html(txt.substr(1));
        }
        else {
            $("#post_txt").html(txt);
        }
    }
    if (post[0]["post_home"] == 1) {
        $("#post_home").show();
    }
    if (post[0]["post_home_txt"] !== null) {
        $("#post_home_txt").html(post[0]["post_home_txt"]).show();
    }
    if (post[0]["post_total_com"] !== null && post[0]["post_total_com"] > 0) {
        $("#post_com_title").html(post[0]["post_total_com"] + " Comentário(s)");
    }
    else {
        $("#post_com_title").html("Nenhum comentário");
    }
    if (post[0]["like_id"] > 0) {
        $("#post_like").css("color", "blue");
        $("#post_like_txt").css("color", "blue").html("Curtiu");
    }
    if (post[0]["address_id"] !== null) {
        var ref = "";
        if (post[0]["address_ref"] !== null) {
            ref = " - " + post[0]["address_ref"];
        }
        else
            ref = "";

        var address_txt = post[0]["address_street"] + " " + post[0]["address_number"] + ", " + post[0]["address_neigh"] + " - " + post[0]["address_city"] + " " + post[0]["address_state"] + ref;
        var address_noRef = post[0]["address_street"] + " " + post[0]["address_number"] + ", " + post[0]["address_neigh"] + " - " + post[0]["address_city"] + " " + post[0]["address_state"];

        $("#post_address").html(address_txt);
        $("#post_address_").show();

        var address = encodeURI(address_noRef);

        $("#iframe").html('<iframe width="100%" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=' + address + '&hl=es;z=14&amp;output=embed"></iframe>');
    }
    if (cat[0]) {
        var virG = "";
        $.each(cat, function (k, v) {
            if (v["categ_name"]) {
                $("#categ").append(virG + v["categ_name"]);
                virG = ", ";
            }
        });
    }

    if (img[0]) {
        $.each(img, function (k, v) {
            if (v["img_fn"]) {
                var url = localStorage.server + "/app/pic/img/" + v["img_fn"];
                var grid = "";
                grid += '<div class="grid-item">';
                grid += '<a href="' + url + '" class="swipebox no-smoothState" title="' + v["img_fn"] + '">';
                grid += '<img src="' + url + '" alt="image">';
                grid += '</a>';
                grid += '</div>';
                $(".grid").append(grid);
            }
        });
    }
    else {
        $(".tabs").hide();
        $("#fotos").hide();
    }

    sessionStorage.com_total = post[0]["post_total_com"];

    $(".loadmore").remove();

    if (post[0]["post_total_com"] != null || post[0]["post_total_com"] != 0) {
        addLoadMore(); // com.js
    }

}

//--------------------------------
// EDITAR POST
// DEPEND: post.js
//--------------------------------
function postReadFormCb(res) {
    FF(res.post, "#post");

    // SETAR CATEGORIAS (AGUARDAR AJAX CATEG, 1 SEG)
    setTimeout(function () {
        $.each(res.categ, function (key, val) {
            $("#categ_" + val["categ_id"]).prop("checked", "checked");
        });

        sessionStorage.serialize = $("#post").serialize();

    }, 1000);



}

//--------------------------------
// DEPEND: com.js
//--------------------------------
function comListCb(res) {

    console.log(res);

    $('#comLoading').fadeOut("fast");

    if (res === null || res.fail || res.error) {
        return;
    }

    var i = 0; // delay-i

    $.each(res, function (key, val) {

        i++;

        $("#com_template")
                .clone()
                .prop({
                    id: "com_" + val["com_id"]
                })
                .appendTo("#com")
                .attr("data-id", val["com_id"])
                .addClass("delay-" + i)
                .addClass("com");

        $("#com_" + val["com_id"]).each(function (index) {

            $(this).find(".com_user").html(val["user_first_name"]);
            $(this).find(".com_txt").html(val["com_txt"]);
            if (val["user_fb"] != null) {
                $(this).find(".avatar").attr("src", "http://graph.facebook.com/" + val["user_fb"] + "/picture?width=100&height=100");
            }
            $(this).find(".com_date").html(val["com_date"]);
        }).show();

        pretty();

        sessionStorage.com_last_id = val["com_id"];
        console.log(sessionStorage.com_last_id);

        if (i >= 7)
            i = 0;

    });

    //pretty();

    addLoadMore();

}
function addLoadMore() {
    var count = $(".com").length;
    if (typeof sessionStorage.com_total === "undefined" || sessionStorage.com_total === "null") {
        sessionStorage.com_total = 0; // set in post.js => postRead();
    }
    console.log(count + "<" + sessionStorage.com_total);
    if (count < sessionStorage.com_total) {
        var loadmore = '<center class="loadmore"><a href="#" id="loadmore" class="loadmore waves-effect waves-light btn primary-color" style="font-size:12px;">Mais comentários</a></center>';
        $("#com").append(loadmore);
    }

}