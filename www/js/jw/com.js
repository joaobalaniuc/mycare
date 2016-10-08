//==================================
// REMOVER COMENTÁRIO
//==================================
function comDel(com_id) {

    preloader();
    $.ajax({
        url: localStorage.server + "/com_del.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            com_id: com_id
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

                $("#com_" + com_id).remove();
            });
}

//==================================
// PERMITIR COMENTÁRIOS NO POST?
//==================================
function comStatus(post_id, status) {

    preloader();
    $.ajax({
        url: localStorage.server + "/post_send.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id,
            post_com: status
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
                if (status > 0) {
                    $("#status_0").show();
                    $("#status_1").hide();
                }
                else {
                    $("#status_0").hide();
                    $("#status_1").show();
                }
            });
}

//==================================
// ENVIAR COMENTÁRIO
//==================================
function comSend() {

    $("#modal1 .loading").show();
    // DATA TO SEND
    var data_form = $("#newcom").serialize();
    var data_user = {
        user_id: localStorage.user_id,
        user_email: localStorage.user_email,
        user_pass: localStorage.user_pass,
        //
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

//==================================
// LISTAR COMENTÁRIOS
//==================================
function comList(post_id, cb, start_id) {

    if (typeof start_id === "undefined" || start_id === "") {
        start_id = 0;
    }

    $.ajax({
        url: localStorage.server + "/com_list.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            last_id: sessionStorage.com_last_id,
            post_id: sessionStorage.post_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {

            })

            .fail(function () {
                var r = {"fail": true};
                cb(r);
            })

            .done(function (res) {
                cb(res);
            });
}

/*
 function comListx() {
 
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
 */