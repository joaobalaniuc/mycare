function getImage(gallery) {
    var type;
    if (typeof gallery === "undefined") {
        type = navigator.camera.PictureSourceType.PHOTOLIBRARY
    } else {
        type = navigator.camera.PictureSourceType.CAMERA
    }
    navigator.camera.getPicture(uploadPhoto, function (message) {
        //alert('get picture failed');
    }, {
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: type,
        quality: 50,
        allowEdit: true,
        targetWidth: 600,
        targetHeight: 600,
        saveToPhotoAlbum: true,
        popoverOptions: true
    });
}

function uploadPhoto(imageURI) {
    preloader("", 7);
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    //alert(JSON.stringify(options.fileName));
    var params = new Object();

    // user data
    params.user_id = localStorage.user_id;
    params.user_email = localStorage.user_email;
    params.user_pass = localStorage.user_pass;
    params.post_id = sessionStorage.edit_post_id; // pic_my.html
    //
    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageURI, localStorage.server + "/upload.php", function (result) {

        //pic.js
        picList(sessionStorage.edit_post_id, picListCb);

    }, function (error) {

        preloader(false);
        alert(JSON.stringify(error));

    }, options);
}

