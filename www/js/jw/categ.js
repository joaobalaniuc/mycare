function categRead() {
    preloader();
    $.ajax({
        url: localStorage.server + "/categ_list.php",
        data: {
            type: sessionStorage.categ_type
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
                
                console.log(res);
                if (res !== null) {
                    

                    if (res.error) {
                        return;
                    }

                    var html = "";
                    $.each(res, function (k, v) {
                        if (v['categ_id'] > 0) {
                            html += '<p class="remember animated bouncein delay-6">';
                            html += '<input class="categ" type="checkbox" id="categ_' + v['categ_id'] + '" name="categ_' + v['categ_id'] + '" value="' + v['categ_id'] + '" />';
                            html += '<label for="categ_' + v['categ_id'] + '">' + v['categ_name'] + '</label>';
                            html += '</p>';
                        }
                    });
                    $("#categ").append(html);
                    //FFm("#post", res);

                } // res not null
            }); // after ajax
}