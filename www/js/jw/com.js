function comSend() {

    $("#modal1 .loading").show();

    // DATA TO SEND
    var data_form = $("#newcom").serialize();
    var data_user = {
        user_email: "...",
        query: "insert"
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/com_send.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                $("#modal1 .loading").hide();
            })

            .fail(function () {
                $("#modal1 .cb_error").show();
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
                        $("#modal1 .cb_success").show();
                        //sessionStorage.post_id = res.success;
                        //window.location.href = "ad.read.html";
                    }

                } // res not null
            }); // after ajax
}

function comList() {

    $('.loadmore').hide();
    $('#loading').fadeIn("fast");

    $.ajax({
        url: localStorage.server + "/com_list.php",
        data: {
            last_id: sessionStorage.com_last_id,
            post_id: sessionStorage.post_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                $('#loading').fadeOut("fast");

            })

            .fail(function () {

            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);

                    if (res.error) {
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

                        }).show();

                        sessionStorage.com_last_id = val["com_id"];
                        console.log(sessionStorage.com_last_id);

                        if (i >= 7)
                            i = 0;

                    });

                    //pretty();

                    addLoadMore();


                } // res not null

            }); // after ajax
}
function addLoadMore() {

    var count = $(".com").length;
    if (typeof sessionStorage.com_total === "undefined" || sessionStorage.com_total === "null") {
        sessionStorage.com_total = 0; // set in post.js => postRead();
    }
    console.log(count + "<" + sessionStorage.com_total);
    if (count < sessionStorage.com_total) {
        $(".loadmore").remove();
        var loadmore = '<center class="loadmore"><a href="#" id="loadmore" class="loadmore waves-effect waves-light btn primary-color" style="font-size:12px;">Mais comentários</a></center>';
        $("#com").append(loadmore);
    }

}