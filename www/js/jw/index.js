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

    $("select").material_select();

    //==============================================
    // LINK VIA JQ
    //==============================================
    $('body').on('click', '[data-go]', function (e) {
        e.preventDefault();
        var href = $(this).attr("data-go");

        sessionStorage.categ_id = 0;

        window.location.href = href;
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

function preloader(txt, loaderNum) {
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
    $('#preloader').fadeIn("slow");
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
    var address = street + ", " + number + ", " + neigh + " - " + city + ", " + state;
    address = encodeURI(address);
    $("#iframe").html('<iframe width="100%" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=' + address + '&hl=es;z=14&amp;output=embed"></iframe>');
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
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";
            //document.getElementById('ibge').value = "...";

            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = '//viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

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