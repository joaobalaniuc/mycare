$(document).ready(function () {

    // EDITAR POST?
    if (sessionStorage.edit_post_id > 0) {
        postRead(sessionStorage.edit_post_id, postReadFormCb);
        sessionStorage.edit_post_id = 0;
        $("#send").html("SALVAR ALTERAÇÕES");
        $("#inserir").html("Editar");
        $("#breadcrumb").show();
    }

    // CANCELAR
    $("#cancel").click(function () {
        if ($("#post").serialize() !== sessionStorage.serialize) {
            if (confirm("Descartar alterações efetuadas?")) {
                window.history.back();
            }
        }
        else {
            window.history.back();
        }
    });

    // ATEND. DOMICILIAR
    $('#post_home').click(function () {
        if ($(this).prop("checked")) {
            $("#post_home_txt").show();
        } else {
            $("#post_home_txt").hide();
        }
    });

    // ENVIAR POST
    $("#send").click(function (e) {

        if ($("#post").valid()) {

            var categ = 0;
            $('.categ').each(function () {
                if ($(this).is(':checked')) {
                    categ++;
                }
            });
            if (categ > 0) {
                postUnmask();
                postSend();
            }
            else {
                alertx("Escolha ao menos uma categoria de serviço.");
            }
        }
        else {
            alertx("Preencha os campos obrigatórios corretamente.");
        }

    });

    // VALIDATE
    $("#post").validate({
        rules: {
            post_title: {
                required: true,
                minlength: 5
            },
            post_phone: {
                required: true
            },
            // ENDEREÇO
            address_street: {
                required: true
            },
            address_number: {
                required: true
            },
            address_neigh: {
                required: true
            },
            address_city: {
                required: true
            },
            address_state: {
                required: true
            }

        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

    // MASK FORM
    postMask();

});

function postMask() {
    $('[name=post_phone]').mask('(00) 0000-00000');
    $('[name=post_phone2]').mask('(00) 0000-00000');
    $('[name=address_zipcode]').mask('00000-000');
}
function postUnmask() {
    $('[name=post_phone]').unmask();
    $('[name=post_phone2]').unmask();
    $('[name=address_zipcode]').unmask();
}