fileReader.onload = function (event) {
    var image = new Image();

    image.onload=function(){
        document.getElementById("original-Img").src=image.src;
        var canvas=document.createElement("canvas");
        var context=canvas.getContext("2d");
        canvas.width=image.width/4;
        canvas.height=image.height/4;
        context.drawImage(image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            canvas.width,
            canvas.height
        );

        document.getElementById("upload-Preview").src = canvas.toDataURL();
    }
    image.src=event.target.result;
};

var loadImageFile = function () {
    var uploadImage = document.getElementById("upload-Image");

    //check and retuns the length of uploded file.
    if (uploadImage.files.length === 0) {
        return;
    }

    //Is Used for validate a valid file.
    var uploadFile = document.getElementById("upload-Image").files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image.");
        return;
    }

    fileReader.readAsDataURL(uploadFile);
}