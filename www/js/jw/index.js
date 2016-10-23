//==============================================
// GLOBAL
//==============================================
console.log(localStorage);
console.log(sessionStorage);

var isApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

// INIT
app.initialize();

// DEV?
if (!isApp) {
    start();
}

$(document).ready(function () {

    $('.modal-trigger').leanModal({
        complete: function () {
            $('.lean-overlay').remove();
        }

    });
    $("sselect").material_select();
    //==============================================
    // LINK VIA JQ
    //==============================================
    $('body').on('click', '[data-go]', function (e) {
        e.preventDefault();
        var href = $(this).attr("data-go");
        sessionStorage.categ_id = 0;
        $("body").fadeOut("fast", function () {
            window.location.href = href;
        });
    });
    //==============================================
    // EXTERNAL LINK VIA JQ
    //==============================================
    $("body").on("click", "[data-url]", function () {
        var url = $(this).attr("data-url");
        cordova.InAppBrowser.open(url, '_blank', 'location=yes');
    });
    //==============================================
    // GO TO POST JQ
    //==============================================
    $('body').on('click', '[data-post]', function () {
        var id = $(this).attr("data-post");
        sessionStorage.post_id = id;
        $("body").fadeOut("fast", function () {
            window.location.href = "post_read.html";
        });
    });
});

//==============================================
// LOAD NAVIGATION MENU
//==============================================
function loadMenu(getfunctions) {
    $.ajax({
        url: "ajax.menu.html"
    }).done(function (data) {
        $('#menu').html(data);
        var rand = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        $('#menu-bg').css("background-image", "url(img/bg" + rand + ".jpg)");
        if (typeof getfunctions !== "undefined") {
            $.getScript("js/functions.js", function (data, textStatus, jqxhr) {
            });
        }
    });
    $.ajax({
        url: "ajax.footer.html"
    }).done(function (data) {
        $('footer').html(data);
    });
}
loadMenu(true);

//==============================================
// LOADING
//==============================================
function preloader(txt, loaderNum, fadeEffect) {
    if (typeof txt === "undefined") {
        txt = "";
    }
    if (txt === false && typeof txt === "boolean") {
        $('#preloader').fadeOut("slow");
        return false;
    }
    if (typeof loaderNum === "undefined") {
        loaderNum = 3;
    }
    if (typeof fadeEffect === "undefined") {
        var fadeEffect = true;
    }
    var html = "";
    html += '<div id="preloader" class="ddark" style="display:none">';
    html += '<div class="loader">';
    html += '<center>';
    html += '<div class="loader_img">';
    html += '<img src="img/loader' + loaderNum + '.gif" style="width:80px" />';
    html += '</div>';
    html += '<div class="loader_txt">';
    html += txt;
    html += '</div>';
    html += '</center>';
    html += '</div>';
    html += '</div>';
    $('body').append(html);
    if (fadeEffect) {
        $('#preloader').fadeIn("slow");
    }
    else {
        $('#preloader').show();
    }
}

//==============================================
// FUNÇÕES GERAIS
//==============================================
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//==============================================
// GOOGLE MAPS
//==============================================
function addressUpdate() {
    var street = $("[name=address_street]").val();
    var number = $("[name=address_number]").val();
    var neigh = $("[name=address_neigh]").val();
    var city = $("[name=address_city]").val();
    var state = $("[name=address_state]").val();
    var country = $("[name=address_country]").val();
    var address = street + ", " + number + ", " + neigh + " - " + city + ", " + state + ", " + country;
    address = encodeURI(address);
    $("#iframe").html('<iframe width="100%" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=' + address + '&hl=es;z=14&amp;output=embed"></iframe>');

    console.log("http://maps.googleapis.com/maps/api/geocode/xml?address=" + address + "&sensor=false");
    $.ajax({
        url: "http://maps.googleapis.com/maps/api/geocode/xml?address=" + address + "&sensor=false",
        dataType: "xml",
        beforeSend: function () {
            console.log('Verificando Lat / Lng ...');
        },
        success: function (xml) {
            console.log(xml);
            $(xml).find('location').each(function () {

                $(this).find('lat').each(function () {
                    var lat = $(this).text();
                    $("[name=post_lat]").val(lat);
                    $("[name=address_lat]").val(lat);
                    console.log("lat=" + lat);
                });
                $(this).find('lng').each(function () {
                    var lng = $(this).text();
                    $("[name=post_lng]").val(lng);
                    $("[name=address_lng]").val(lng);
                    console.log("lng=" + lng);
                });

            });


        }
    });
}
$(document).ready(function () {
    $(".address").change(function () {
        addressUpdate();
    });
});

//==============================================
// ENDEREÇO ATRAVÉS DE CEP
//==============================================
function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");
    document.getElementById('ibge').value = ("");
}

function meu_callback(conteudo) {

    preloader(false);

    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.

        //document.getElementById('rua').value = (conteudo.logradouro);
        //document.getElementById('bairro').value = (conteudo.bairro);
        //document.getElementById('cidade').value = (conteudo.localidade);
        //document.getElementById('uf').value = (conteudo.uf);

        $("#rua").val(conteudo.logradouro).closest('div').find('label').addClass("active");
        $("#bairro").val(conteudo.bairro).closest('div').find('label').addClass("active");
        $("#cidade").val(conteudo.localidade).closest('div').find('label').addClass("active");
        $("#uf").val(conteudo.uf).closest('div').find('label').addClass("active");
        $("#uf").material_select();
        //document.getElementById('ibge').value = (conteudo.ibge);

        if (typeof addressUpdate === 'function') {
            addressUpdate();
        }
    } //end if.
    else {
//CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

function pesquisacep(valor) {
    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');
    //Verifica se campo cep possui valor informado.
    if (cep != "") {
        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;
        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            /*document.getElementById('rua').value = "...";
             document.getElementById('bairro').value = "...";
             document.getElementById('cidade').value = "...";
             document.getElementById('uf').value = "...";*/
            //document.getElementById('ibge').value = "...";

            preloader();

            //Cria um elemento javascript.
            var script = document.createElement('script');
            //Sincroniza com o callback.
            //script.src = '//viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';
            script.src = localStorage.server + '/cep.php?cep=' + cep;
            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
}

//==============================================
// SET PRETTY DATE = REQUER prettydate.js
//==============================================
function pretty() {
    $(".prettydate").prettydate({
        beforeSuffix: "atrás",
        messages: {
            second: "Agora mesmo",
            seconds: "%s segundos %s",
            minute: "Um minuto %s",
            minutes: "%s minutos %s",
            hour: "Uma hora %s",
            hours: "%s horas %s",
            day: "Um dia %s",
            days: "%s dias %s",
            week: "Uma semana %s",
            weeks: "%s semanas %s",
            month: "Um mês %s",
            months: "%s meses %s",
            year: "Um ano %s",
            years: "%s anos %s",
            // Extra
            yesterday: "Ontem",
            beforeYesterday: "Antes de ontem",
            tomorrow: "Amanhã",
            afterTomorrow: "Depois de amanhã"

        }
    });
}

//==============================================
// ALERT DIALOG
//==============================================
function alertx(content, title, button, cb) {
    if (typeof button === "undefined" || button === "") {
        button = "OK";
    }
    if (typeof title === "undefined" || title === "") {
        title = localStorage.appname;
    }
    var html = "";
    var id = getRandomInt(11111, 99999);
    html += '<div id="modal' + id + '" class="modal">';
    html += '<div class="modal-content">';
    html += '<h4>' + title + '</h4>';
    html += '<p>' + content + '</p>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">' + button + '</a>';
    html += '</div>';
    html += '</div>';
    $("#main").prepend(html);
    $("#modal" + id).openModal({
        complete: function () {
            if (isFunction(cb)) {
                cb();
            }
        } // Callback for Modal close
    });
}

//==============================================
// FILL FORM WITH OBJECT DATA
//==============================================
function FF(data, form_elem) {

    console.log("FF() :)");

    console.log(data);

    if (typeof form_elem === "undefined") {
        form_elem = "form";
        console.log(form_elem);
    }

    var $elem = $(form_elem);
    var i = 0;
    for (i = 0; i < data.length; i++) {
        $.each(data[i], function (k, v) {
            //console.log(k + "=" + v);
            if (v !== null) {
                var n = "[name=" + k + "]";
                var input = "";
                input += "textarea" + n + ",";
                input += "select" + n + ",";
                input += "[type=text]" + n + ",";
                input += "[type=password]" + n + ",";
                input += "[type=email]" + n + ",";
                input += "[type=url]" + n + ",";
                input += "[type=number]" + n + ",";
                input += "[type=hidden]" + n + ",";
                input += "[type=search]" + n;
                //==========================
                // INPUT VALUE
                //==========================
                $elem.find(input).val(v);
                //==========================
                // CHECKBOX
                //==========================
                //if (v === "1") {
                $elem.find("[type=checkbox]" + n).prop("checked", "checked");
                //}
                //==========================
                // CHILD ELEMENTS
                //==========================
                $elem.find("[ff-child]" + n).each(function (i) {
                    var child = $(this).attr("ff-child");
                    $(child).show();
                });
                //==========================
                // RELATIVE NAME
                //==========================
                $elem.find("[ff-name]" + n).each(function (i) {
                    var name = $(this).attr("ff-name");
                });
                // bug fix = materializecss labels update
                $elem.find(input).each(function (i, element) {
                    if ($(element).val().length > 0) {
                        $(this).siblings("label, i").addClass("active");
                    }
                });
            } // not null
        }); // each
    } // for
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}