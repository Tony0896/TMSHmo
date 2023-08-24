function cameraStart(callback) {
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
        this.deviceVideo = 0;
        devices.forEach(device => {
            if (device.kind == 'videoinput') {
                this.deviceVideo = this.deviceVideo + 1;   
            }
        });
    })
    .catch((err) => {
        console.log(err)
    });

    cameraSensor = document.querySelector("#camera-frame");
    cameraView = document.querySelector("#camera-view");
    cameraTrigger = document.querySelector("#take");
    constraints = {video:{facingMode:{exact:"environment"},width:window.innerHeight,height:window.innerWidth},audio:false};
    image = new Image();
    this.flash = false;
    angleInDegrees = 0;
    imageData = 0;
    track = null;
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getVideoTracks()[0];
            this.stream = stream;
            cameraView.srcObject = stream;
            track.applyConstraints({
                advanced: [{ 
                    exposureMode: "continuous" , whiteBalanceMode: "continuous"
                }]
            }).catch(e => console.log(e));
            ctx = cameraSensor.getContext("2d");
            setTimeout(() => {
                $('#camera-view').css('display','block');
            }, 100);
        })
        .catch(function(error) {
            console.error("Error al tomar la foto:", error);
        });
    this.callbackPhoto = callback;
}

function onCancelCamera(){
    if(typeof track !== 'undefined'){
        track.stop();
    }
    delete constraints;
    delete cameraView;
    delete track;
    delete cameraSensor;
    delete cameraTrigger;
    delete angleInDegrees;
    delete image;
    $("fwm").empty();
}
function onCancelPicture(){
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getVideoTracks()[0];
            cameraView.srcObject = stream;
            setTimeout(() => {
                $('#camera-view').css('display','block');
            }, 100);
        })
        .catch(function(error) {
            console.error("Error al tomar la foto:", error);
        });
    angleInDegrees = 0;
    $("#cancelCamera").css("display","block");
    $("#cancelPicure").css("display","none");
    $("#take").css("display","block");
    $("#switch").css("display","block");
    $("#torch").css("display","block");
    $("#phototaked").css("display","none");
    $("#phototaked").removeClass("portPhoto");
    $("#phototaked").removeClass("landPhoto");
    $("#select").css("display","none");
    $("#rotateRight").css("display","none");
    $("#rotateLeft").css("display","none");
}
function onTake() {
    if(this.flash == true && constraints.video.facingMode.exact == "environment"){
        if(this.deviceVideo > 2){
            window.plugins.flashlight.toggle();
        } else {
            track.applyConstraints({
                advanced: [{ torch: this.flash }]
            }).catch(e => console.log(e));
        }
        audio.play();
        setTimeout(function(){
            cameraSensor.width = cameraView.videoWidth;
            cameraSensor.height = cameraView.videoHeight;
            cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
            $("#phototaked").addClass("portPhoto");
            $("#phototaked").css("display","block");
            $("#phototaked").attr("src",cameraSensor.toDataURL("image/jpeg", 1.0));
            image.src = cameraSensor.toDataURL("image/jpeg", 1.0);
            imageData = cameraSensor.toDataURL("image/jpeg", 1.0);
            this.flash = false;
            if(this.deviceVideo > 2){
                window.plugins.flashlight.toggle();
            } else {
                track.applyConstraints({
                    advanced: [{ torch: this.flash }]
                    }).catch(e => console.log(e));
            }
            track.stop();
            this.flash = true;
        }, 1500);
    } else {
        audio.play();
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;
        cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
        $("#phototaked").addClass("portPhoto");
        $("#phototaked").css("display","block");
        $("#phototaked").attr("src",cameraSensor.toDataURL("image/jpeg", 1.0));
        image.src = cameraSensor.toDataURL("image/jpeg", 1.0);
        imageData = cameraSensor.toDataURL("image/jpeg", 1.0);
        track.stop();
    }
    $("#take").css("display","none");
    $("#camera-view").css("display","none");
    $("#switch").css("display","none");
    $("#torch").css("display","none");
    $("#select").css("display","block");
    $("#cancelCamera").css("display","none");
    $("#cancelPicure").css("display","block");
    $("#rotateRight").css("display","block");
    $("#rotateLeft").css("display","block");
    onGetOrientation();
};

function onTorch() {
    this.flash = (this.flash) ? false : true;
    if(this.flash == true){
        $("#flash").attr('src','img/flash_on.svg');
    } else {
        $("#flash").attr('src','img/flash_off.svg');
    }
}

function onDone() {
    $("fwm").append("<canvas id='tempCanvas' width='800' height='800' style='display:none'></canvas>");
    var canvas = document.getElementById("tempCanvas");
    var ctx = canvas.getContext("2d");
    var maxW=900;
    var maxH=800;
    var img = new Image;
    img.src = imageData;
    img.onload = function(){
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW/iw),(maxH/ih));
        var iwScaled = iw*scale;
        var ihScaled = ih*scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        ctx.drawImage(img,0,0,iwScaled,ihScaled);
        sendingBack(canvas.toDataURL("image/jpeg"));
        app.sheet.close('#camera')
        $("#tempCanvas").remove();
    }
}

function sendingBack(image){
    var callingBack = this.callbackPhoto;
    callingBack(image);
}

function onSwitch(){
    if(constraints.video.facingMode.exact == "environment"){
        constraints = {video:{facingMode:{exact:"user"},width:window.innerHeight,height:window.innerWidth},audio:false};
    } else {
        constraints = {video:{facingMode:{exact:"environment"},width:window.innerHeight,height:window.innerWidth},audio:false};
    }
    track.stop();
    $('#camera-view').css('display','none');
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getVideoTracks()[0];
            cameraView.srcObject = stream;
            if(constraints.video.facingMode.exact == "user"){
                track.applyConstraints({
                    advanced: [{ 
                        exposureMode: "continuous" , whiteBalanceMode: "continuous"
                    }]
                }).catch(e => console.log(e));
            }
            setTimeout(() => {
                $('#camera-view').css('display','block');
            }, 100);
        })
        .catch(function(error) {
            console.error("Error al tomar la foto:", error);
        });
}

function onRotateRight() {
    angleInDegrees += 90;
    ctx.clearRect(0,0,cameraSensor.width,cameraSensor.height);
    ctx.save();
    currentwidth = cameraSensor.height;
    currentheight = cameraSensor.width;
    cameraSensor.width = currentwidth;
    cameraSensor.height = currentheight;
    ctx.translate(cameraSensor.width/2,cameraSensor.height/2);
    ctx.rotate(angleInDegrees*Math.PI/180);
    ctx.drawImage(image,-image.width/2,-image.height/2);
    ctx.restore();
    if($("#phototaked").hasClass("portPhoto")){
        $("#phototaked").removeClass("portPhoto");
        $("#phototaked").addClass("landPhoto");
    } else {
        $("#phototaked").removeClass("landPhoto");
        $("#phototaked").addClass("portPhoto");
    }
    imageData = cameraSensor.toDataURL('image/jpeg', 1.0);
    $("#phototaked").attr("src",imageData);
}


function onRotateLeft() {
    angleInDegrees -= 90;
    ctx.clearRect(0,0,cameraSensor.width,cameraSensor.height);
    ctx.save();
    currentwidth = cameraSensor.height;
    currentheight = cameraSensor.width;
    cameraSensor.width = currentwidth;
    cameraSensor.height = currentheight;
    ctx.translate(cameraSensor.width/2,cameraSensor.height/2);
    ctx.rotate(angleInDegrees*Math.PI/180);
    ctx.drawImage(image,-image.width/2,-image.height/2);
    ctx.restore();
    if($("#phototaked").hasClass("portPhoto")){
        $("#phototaked").removeClass("portPhoto");
        $("#phototaked").addClass("landPhoto");
    } else {
        $("#phototaked").removeClass("landPhoto");
        $("#phototaked").addClass("portPhoto");
    }
    imageData = cameraSensor.toDataURL('image/jpeg', 1.0);
    $("#phototaked").attr("src",imageData);
}

function onGetOrientation(){
    var currentOrientation;
    var count = 0;
    var smoothx = 0;
    window.addEventListener("deviceorientation", getOrientation,true);
    function getOrientation(event){
        count = count + 1;
        var b = Math.abs(event.beta)/90;
        if(b>1) b = 2-b;
        var g = event.gamma/90;
        if(Math.abs(event.beta)>90) g = -g;
        var x = g/Math.max(0.25,b);
        smoothx = smoothx*0.7+x*0.3;
        var orientation = smoothx.toFixed(1);
        var left = -2;
        var right = 2;
        if(orientation <= left){
            currentOrientation = "Landscape Left";
        } else if(orientation >= right){
            currentOrientation = "Landscape Right";
        } else {
            currentOrientation = "Portrait";
        }
        if(count == 3){
            window.removeEventListener("deviceorientation", getOrientation, true);
            if(currentOrientation == "Landscape Left"){
                onRotateLeft();
            } else if(currentOrientation == "Landscape Right"){
                onRotateRight();
            } else {}
        }
    }
}