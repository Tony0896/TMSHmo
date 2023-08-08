    var IdUsuario = localStorage.getItem("IdUsuario");
    $("#IdUsuario").val(IdUsuario);
    //Borrar variables de sesión y regresar a el Log-in
    function logaout(){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("DELETE FROM Actualizaciones",
                    [],
                    function(tx5, results){
                        StatusBar.backgroundColorByHexString("#124F90");
                        window.localStorage.clear();
                        window.location.href = "index.html";
                    }
                )
            }
        );
    }

    function deleteForm() {
        document.getElementById("demo-form").reset();
    }
    
    function rotate(){
        if(localStorage.getItem("currentOrientation") == "portrait"){
            screen.orientation.lock('landscape');
            localStorage.setItem("currentOrientation", "landscape");
        } else {
            screen.orientation.lock('portrait');
            localStorage.setItem("currentOrientation", "portrait");
        }
    }
    function validateScan(){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                var texto =  result.text;
                var camera = app.popup.create({
                    content: `
                    <div class="popup" id="camera">
                        <div class="headerPopupPhoto" style="width: 90%;display: flex;justify-content: end;padding-left: 20px;margin-top:20px">
                            <a class="link popup-close">Cerrar</a>
                        </div>
                        <div id="log"></div>
                        <div class="app">
                            <div id="deviceready">
                                <pre style="display: inline-block;white-space: break-spaces;">${result.text}</pre>
                                <p>Formato: ${result.format}</p>
                            </div>
                        </div>
                    </div>
                    `,
                    on: {
                        open: function (popup) {},
                    }
                });
                camera.open();
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera : false,
                showFlipCameraButton : true,
                showTorchButton : true,
                torchOn: false,
                saveHistory: false,
                prompt : "Coloca el codigo de barras en la zona marcada",
                resultDisplayDuration: 500,
                orientation : "portrait",
                disableAnimations : true,
                disableSuccessBeep: false
            }
          );
    }
    function restorientation(){
        screen.orientation.lock('portrait');
        localStorage.setItem("currentOrientation", "portrait");
    }
  
    // Funcion global Inicio
    function eliminaCache(){
        var success = function(status) {
            $("#process").hide();
            updateData();
        };
        var error = function(status) {
          $("#process").hide();
          console.log('Error: ' + status);
        };
        window.CacheClear(success, error);
    }
    function changeCamera(check){
        if(check.includes('0')){
            localStorage.setItem("camera", "0");
            swal("","Se cambio exitosamente la configuracion de la camara.","success");
        } else {
            localStorage.setItem("camera", "1");
            swal("","Se cambio exitosamente la configuracion de la camara.","success");
        }
    }
    function capturePhoto() {
        var camera = 1;
        if(camera == 0){
            var camera = app.popup.create({
                content: `
                <div class="popup" id="camera">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">
                        <div class="camera">
                            <div class="take" id="take" onclick="onTake()">
                                <div class="bubble-take"></div>
                            </div>
                            <div class="select" id="select" style="display: none;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                        </div>
                        <div class="left-action">
                            <div class="cancel popup-close" id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            <div class="cancel " id="cancelPicure" onClick="onCancelPicture()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                        </div>
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()"><img id="flash" src="img/flash_off.svg" width="30px"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        <div class="right-action">
                            <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                        </div>
                        <audio id="audio" controls style="display: none;">
                            <source type="audio/mp3" src="img/camera.mp3">
                        </audio>
                        <input type="hidden" id="deviceOrientation" name="deviceOrientation"/>
                    </div>
                    <fwm></fwm>
                    </div>
                </div>
                `,
                on: {
                    open: function (popup) {
                        var permissions = cordova.plugins.permissions;
                        permissions.checkPermission(permissions.CAMERA, function( status ){
                            if (status.hasPermission){
                                cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                function empresaCargada(){
                                    cameraStart(onPhotoDataSuccess)
                                }
                                function cargarEmpresa(url, callback){
                                    var pie = document.getElementsByTagName('fwm')[0];
                                    var script = document.createElement('script');
                                    script.type = 'text/javascript';
                                    script.src = url;
                                    script.id = "cameraSource";
                                    script.onload = callback;
                                    pie.appendChild(script);
                                }
                            }else{
                                permissions.requestPermission(permissions.CAMERA, success, error);
                                function error() {
                                    app.sheet.close('.popup')
                                    swal("Se Requiere los permisos","Para poder tomar las evidencias fotograficas necesitamos el permiso.","warning");
                                }
                                function success( status ){
                                    if(!status.hasPermission){
                                        error();
                                    } else {
                                        cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                        function empresaCargada(){
                                            cameraStart(onPhotoDataSuccess)
                                        }
                                        function cargarEmpresa(url, callback){
                                            var pie = document.getElementsByTagName('fwm')[0];
                                            var script = document.createElement('script');
                                            script.type = 'text/javascript';
                                            script.src = url;
                                            script.id = "cameraSource";
                                            script.onload = callback;
                                            pie.appendChild(script);
                                        }
                                    }

                                }
                            }
                        });
                    },
                    opened: function (popup) {
                      localStorage.setItem("cameraField", "Active");
                    },
                    closed: function (popup) {
                      window.localStorage.removeItem("cameraField");
                    },
                }
            });
            camera.open();
        } else {
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                quality: 100,
                destinationType: destinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 500,
                correctOrientation: true,
            });
        }
    }
    //Opcion para ir a menu
    function checkStatus(check){
        if(check.includes('1')){
            var valCheck = document.getElementById(check).checked;
            if(valCheck ==true){
                var name = check.replace('1','');
                var otherCheck = name + '0';
                document.getElementById(otherCheck).checked = false;
            }
        } else {
            var valCheck = document.getElementById(check).checked;
            if(valCheck ==true){
                var name = check.replace('0','');
                var otherCheck = name + '1';
                document.getElementById(otherCheck).checked = false;
            }
        }
    }
    function moveMenu(val) {
        if (val) {
            val == 1 
            ? app.views.main.router.navigate({ name: 'formCapacita1'})
                : val == 2 
                ? generarAsistencia()
                :  val == 3
                ? app.views.main.router.back('/formCapacita4/', {force: true, ignoreCache: true, reload: true})
            : false ;
        } else {
            var Modulos = localStorage.getItem("Modulos");
            localStorage.setItem("Opcion", '1');
            if(Modulos == "Limpieza"){
                app.views.main.router.navigate({ name: 'yallegueLimp'});
            }else if(Modulos == "Imagen"){
                app.views.main.router.navigate({ name: 'yallegue'});
            } else if(Modulos == "Desincorporaciones"){
                iniciarDesincorporaciones();
            } else if(Modulos == "Recaudo"){
                preingresoRecaudo();
            }
        }
    }
    function EliminarActualizacionesAntiguas(){
        var IdUsuario = localStorage.getItem("Usuario");
        var fecha = new Date();
        var fecha_ingreso = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate();
        fecha_eliminar = editar_fecha(fecha_ingreso, "-30", "d","-");
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT * FROM Actualizaciones  WHERE Fecha < ? AND IdUsuario = ?",
                    [fecha_eliminar,IdUsuario],
                    function(tx5, results){
                        var length = results.rows.length;
                        for(var i = 0; i< length; i++){
                            var item2 = results.rows.item(i);
                            var IdEliminar = item2.idActualizacion;
                            databaseHandler.db.transaction(
                                function(tx4){
                                    tx4.executeSql(
                                        "DELETE FROM Actualizaciones WHERE idActualizacion = ?",
                                        [IdEliminar],
                                        function(tx4, results){
                                        },
                                        function(tx4, error){
                                            console.errror("Error al eliminar: " + error.message);
                                        }
                                    );
                                },
                                function(error){
                                    console.error("Error al seleccionar actualzaciones:" + error.message)
                                },
                                function(){}
                            );
                        }
                    }
                )
            }
        );
    }
    function inputLleno(id,value){
        id = "#"+id;
        if (value == "") {
            $(id).css("background-color","#ffffff");
        } else if(value == "0"){
            $(id).css("background-color","#ffffff");
        } else {
            $(id).css("background-color","#E0F8F7");
        }
    }
    // Funcion global Fin
    //Pantalla vertical
    function vertical(){
        screen.orientation.lock('portrait');
        // screen.orientation.unlock();
    }
    //Pantalla horizontal
    function landsca(){
        screen.orientation.lock('landscape');
        //screen.orientation.unlock();
    }
    // Cerrar Popup
    function gClose(){
        screen.orientation.lock('portrait');
        // screen.orientation.unlock();
    }
    var testFirma;

    function createFirma(){
        screen.orientation.lock('landscape');
        var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(6, 62, 127)'
        });
        testFirma = signaturePad;
    }

    function cleanFirma(){
        var signaturePad = testFirma;
        signaturePad.clear();
    }

    // Tomar foto firma
    function capturaFirma() {
        var camera = localStorage.getItem("camera");
            if(camera == 0){
            var camera = app.popup.create({
                content: `
                <div class="popup" id="camera">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">
                        <div class="camera">
                            <div class="take" id="take" onclick="onTake()">
                                <div class="bubble-take"></div>
                            </div>
                            <div class="select" id="select" style="display: none;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                        </div>
                        <div class="left-action">
                            <div class="cancel popup-close" id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            <div class="cancel" id="cancelPicure" onClick="onCancelPicture()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                        </div>
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()"><img id="flash" src="img/flash_off.svg" width="30px"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        <div class="right-action">
                            <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                        </div>
                        <audio id="audio" controls style="display: none;">
                            <source type="audio/mp3" src="img/camera.mp3">
                        </audio>
                        <input type="hidden" id="deviceOrientation" name="deviceOrientation"/>
                    </div>
                    <fwm></fwm>
                    </div>
                </div>
            `,
            on: {
                open: function (popup) {
                    var permissions = cordova.plugins.permissions;
                    permissions.checkPermission(permissions.CAMERA, function( status ){
                        if (status.hasPermission){
                            cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                            function empresaCargada(){
                                cameraStart(onPhotoSingSuccess)
                            }
                            function cargarEmpresa(url, callback){
                                var pie = document.getElementsByTagName('fwm')[0];
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        }else{
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close('.popup')
                                swal("Se requiere los permisos","Para poder tomar las evidencias fotograficas necesitamos el permiso.","warning");
                            }
                            function success( status ){
                                if(!status.hasPermission){
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada(){
                                        cameraStart(onPhotoSingSuccess)
                                    }
                                    function cargarEmpresa(url, callback){
                                        var pie = document.getElementsByTagName('fwm')[0];
                                        var script = document.createElement('script');
                                        script.type = 'text/javascript';
                                        script.src = url;
                                        script.id = "cameraSource";
                                        script.onload = callback;
                                        pie.appendChild(script);
                                    }
                                }

                            }
                        }
                    });
                },
                opened: function (popup) {
                localStorage.setItem("cameraField", "Active");
                },
                closed: function (popup) {
                window.localStorage.removeItem("cameraField");
                },
            }
                });
                camera.open();
            } else {
            navigator.camera.getPicture(onPhotoSingSuccess,onFail, {
                quality: 100,
                destinationType: destinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 500,
                correctOrientation: true
            });
            }
        $('#FotoYaLLegue').attr('src', "img/camara.png");
    }
    // Funcion si se logra tomar la foto a la firma
    function onPhotoSingSuccess(imageData) {
        var camera = localStorage.getItem("camera");
        if(camera == 0){
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'flex';
            var nameima = imageData;
            smallImage.src = imageData;
            $('#imgSigPhoto').val(nameima);
            $("#photoIcon").attr("src","img/reload.svg");
        }else{
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'flex';
            var nameima = "data:image/jpeg;base64," + imageData;
            smallImage.src = "data:image/jpeg;base64," + imageData;
            $('#imgSigPhoto').val(nameima);
            $("#photoIcon").attr("src","img/reload.svg");
        }
    }

function verpdf(IdCte, IdCed, TipoC) {
    if(TipoC){
        localStorage.setItem("IdCed", IdCed);
        localStorage.setItem("TipoC", TipoC);
        app.views.main.router.navigate({
            name: "visualizar",
        });
    }
}
function clientSelected(clientName){
    var mes = $("#month").val();
    localStorage.setItem("id_cliente",clientName);
    localStorage.setItem("mes_detalle",mes);
    app.views.main.router.navigate({name: 'verVisita'});
}
function clientSelected2(clientName,fecha){
    let fechaDetalle = fecha.split("-");
    localStorage.setItem("id_cliente",clientName);
    localStorage.setItem("year_detalle",fechaDetalle[0]);
    localStorage.setItem("month_detalle",fechaDetalle[1]);
    localStorage.setItem("day_detalle",fechaDetalle[2]);
    app.views.main.router.navigate({name: 'calendar-page'});
}

function horizontal(){
    screen.orientation.lock('landscape');
}

function Results(){
    $( "#Resultados" ) .show( "fast");
    $( "#LimSani" )    .hide( "fast");
    $( "#ManAli" )     .hide( "fast");
    $( "#higPerso" )   .hide( "fast");
    $( "#ContTemp" )   .hide( "fast");
    $( "#ContPlag" )   .hide( "fast");
    var valCheckuno = document.getElementById("uno").checked;
  //  alert(valCheckuno);
    var valCheckdos = document.getElementById("dos").checked;
  //  alert(valCheckdos);
    if(valCheckuno == true){var n1 = 10;}
    if(valCheckdos == true){ var n2 = 10;}

    var suma = parseInt(n1) + parseInt(n2);
   // alert("La suma es: "+suma);
    $("#res").html("<span>La suma es: "+suma+"</span");
}

function editar_fecha(fecha, intervalo, dma, separador) {
    var separador = separador || "-";
    var arrayFecha = fecha.split(separador);
    var dia = arrayFecha[2];
    var mes = arrayFecha[1];
    var anio = arrayFecha[0];

    var fechaInicial = new Date(anio, mes - 1, dia);
    var fechaFinal = fechaInicial;
    if(dma=="m" || dma=="M"){
      fechaFinal.setMonth(fechaInicial.getMonth()+parseInt(intervalo));
    }else if(dma=="y" || dma=="Y"){
      fechaFinal.setFullYear(fechaInicial.getFullYear()+parseInt(intervalo));
    }else if(dma=="d" || dma=="D"){
      fechaFinal.setDate(fechaInicial.getDate()+parseInt(intervalo));
    }else{
       return fecha;
    }
    dia = fechaFinal.getDate();
    mes = fechaFinal.getMonth() + 1;
    anio = fechaFinal.getFullYear();
    dia = (dia.toString().length == 1) ? "0" + dia.toString() : dia;
    mes = (mes.toString().length == 1) ? mes.toString() : mes;
    return anio + "-" + mes + "-" + dia;
}
function cambiaimgempresa(val){
    if(val == 1){
        $("#img_logo").attr("src","img/ACHSA.png");
    } else if(val == 35){
        $("#img_logo").attr("src","img/AMTM.png");
    } else if(val == 2){
        $("#img_logo").attr("src","img/ATROL.png");
    } else if(val == 37){
        $("#img_logo").attr("src","img/AULSA.png");
    } else if(val == 20){
        $("#img_logo").attr("src","img/BUSSI.png");
    } else if(val == 3){
        $("#img_logo").attr("src","img/CCA.png");
    } else if(val == 4){
        $("#img_logo").attr("src","img/CISA.png");
    } else if(val == 5){
        $("#img_logo").attr("src","img/COAVE.png");
    } else if(val == 41){
        $("#img_logo").attr("src","img/CODIV.png");
    } else if(val == 6){
        $("#img_logo").attr("src","img/COPE.png");
    } else if(val == 7){
        $("#img_logo").attr("src","img/CORENSA.png");
    } else if(val == 8){
        $("#img_logo").attr("src","img/COREV.png");
    } else if(val == 9){
        $("#img_logo").attr("src","img/COTAN.png");
    } else if(val == 10){
        $("#img_logo").attr("src","img/COTOBUSA.png");
    } else if(val == 39){
        $("#img_logo").attr("src","img/COTXS.png");
    } else if(val == 22){
        $("#img_logo").attr("src","img/ESASA.png");
    } else if(val == 11){
        $("#img_logo").attr("src","img/MIHSA.png");
    } else if(val == 12){
        $("#img_logo").attr("src","img/RECSA.png");
    } else if(val == 13){
        $("#img_logo").attr("src","img/SIMES.png");
    } else if(val == 14){
        $("#img_logo").attr("src","img/SKYBUS.png");
    } else if(val == 15){
        $("#img_logo").attr("src","img/STMP.png");
    } else if(val == 16){
        $("#img_logo").attr("src","img/TCGSA.png");
    } else if(val == 17){
        $("#img_logo").attr("src","img/TREPSA.png");
    } else if(val == 19){
        $("#img_logo").attr("src","img/TUZOBUS.png");
    } else if(val == 18){
        $("#img_logo").attr("src","img/VYCSA.png");
    } else{
        $("#img_logo").attr("src","img/logo1.png");
    }
}
function recarga_history(mes_pdfs,year_pdfs){
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    if(localStorage.getItem("Modulos") == 'Imagen'){
        var tipo = "checklist";
    } else if(localStorage.getItem("Modulos") == 'Limpieza'){
        var tipo = "Limpieza";
    } else {
        var tipo = localStorage.getItem("Modulos");
    }

    var url = localStorage.getItem("url");
    app.request.get(url+'/historial.php', { IdUsuario: IdU, mes_pdfs : mes_pdfs, year_pdfs: year_pdfs, tipo:tipo}, function (data) {
        var content = JSON.parse(data);
        if(content == 0){
            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
        }else{
            if(data == 'null'){
                $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
            } else {
                if(content.length > 0){
                    var html = '';
                    for(var e=0; e < content.length; e++){
                        var fecha = content[e].FechaCaptura.split(' ');
                        //$("#cedul").html("<li><div class='item-content'><div class='item-media' style='font-size:12px'>"+TipoCed+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class='item-inner'><div class='item-title' style='font-size:12px'>"+unescape(content[e].Cliente)+ "</div><div class='item-after' style='font-size: 12px;color: black;display: flex;flex-direction: row;align-items: center'>"+resp[0]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='verpdf(\""+content[e].IdCte+"\","+content[e].IdCedula+",\""+content[e].TipoCed+"\")' style='border: none; outline:none;'><img src='img/ver.svg' width='40px' /></a></div></div></div></li>");
                        html = html + `<tr> <td><span>`+content[e].Cliente+`</span></td> <td><span>`+fecha[0]+`</span></td> <td><a href='#' onclick="verpdf('`+content[e].IdCte+`','`+content[e].IdCedula+`','`+content[e].TipoCed+`')" style='border: none; outline:none;'><i class="material-icons md-light" style="font-size: 30px;">description</i></a></td> </tr>`;
                    }
                    $("#cedul").html(html);
                } else {
                    $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                }
            }
        }
    },function (xhr) {
        $('.preloader').remove();
        $("#content-page").css('display','none');
        $("#nointernet-page").css('display','block');
    });
}
function recargacedulas(){
    $("#pendientes").html("");
    if(localStorage.getItem("Modulos") == 'Imagen'){
        var tipo = "checklist";
    } else if(localStorage.getItem("Modulos") == 'Limpieza'){
        var tipo = "Limpieza";
    }
      
    var estatus = 0;
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                [estatus, tipo],
                function(tx5, results){
                    var length = results.rows.length;
                    for(var i = 0; i< length; i++){
                        var item2 = results.rows.item(i);
                        var fechas = item2.fecha_entrada.split(" ");
                        if(item2.tipo_cedula == 'checklist'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Rev. Imagen</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,1);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        } else if(item2.tipo_cedula == 'Limpieza'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Rev. Limpieza</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,2);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        } else if(item2.tipo_cedula == 'Desincorporaciones'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,3);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;</div></div></div></li>");
                        } else if(item2.tipo_cedula == 'Recaudo'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Recaudo</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,4);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        }
                    }
                },
                function(tx5, error){
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );  
        },
    function(error){},
    function(){}
    );
}
//inicio checklist
function continuarCed(id_cedula,tipo){
    localStorage.setItem("IdCedula",id_cedula);
    localStorage.setItem("Opcion", '1');
    localStorage.setItem("page", 1);
    if(tipo == 1){
        app.views.main.router.back('/formCheck1/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 2){
        app.views.main.router.back('/formLimp1/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 3){
        app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 4){
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 5){
        app.views.main.router.back('/formCapacita2/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 6){
        app.views.main.router.back('/formCapacita3/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 7){
        app.views.main.router.back('/formCapacita5/', {force: true, ignoreCache: true, reload: true});
    }
}

function continuarCedCap(id_cedula,tipo){
    localStorage.setItem("IdCedula",id_cedula);
    
    if(tipo == 0){
        app.views.main.router.back('/formCapacita3/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 1){
        app.views.main.router.back('/formCapacita2/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 2){
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql(
                    "Select * from cedulas_general cd INNER JOIN datosGeneralesCurso dg ON cd.id_cedula = dg.id_cedula where cd.id_cedula= ?",
                    [id_cedula],
                    function(tx, results){
                        var item2 = results.rows.item(0);
                        localStorage.setItem("FK_Becario", item2.id_candidato);
                        localStorage.setItem("IDCurso", item2.geolocalizacion_entrada);
                        localStorage.setItem("IDTipoCurso", item2.geolocalizacion_salida);
                        localStorage.setItem("NombreCurso", item2.nombre_evalua);
                        localStorage.setItem("nameBecario", item2.nombre_cliente);
                        app.views.main.router.back('/formCapacita5/', {force: true, ignoreCache: true, reload: true});
                    }
                );
            },
            function(error){},
            function(){}
        );
    } else if(tipo == 3 || tipo == 4){
        app.views.main.router.back('/formCapacita6/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 5){
        app.views.main.router.back('/formCapacita7/', {force: true, ignoreCache: true, reload: true});
    }
}

function IniciaCheckList(){
    if($("#autocomplete-dropdown-ajax").val()){
        var Unidad = $("#autocomplete-dropdown-ajax").val();
        var Chasis = $("#Chasis").val();
        var Familia = $("#Familia").val();
        var marca = $("#marca").val();
        var Empresa = $("#Empresa").val();
        var FK_id_unidad = $("#FK_unidad").val();
        var id_unidad_vs = $("#id_unidad").val();
        var FK_id_empresa = $("#FK_unidad_danos_empresa").val();
        var id_modelo_check = $("#modelo_check").val();
        var fecha_revision =  $("#fecha_revision").val();
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = localStorage.getItem("empresa");
        var tipo_cedula = 'checklist';
        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    //app.dialog.progress('Generando CheckList','red');
                    var progress = 0;
                    var dialog = app.dialog.progress('Generando CheckList', progress, 'red');
                    var empresa = localStorage.getItem("empresa");
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    productHandler.addDatosGenerales(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision);
                    var NomJson = 'datos_check_desc'+empresa;
                    app.request({
                        url: cordova.file.dataDirectory + "jsons/"+NomJson+".json",
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            var aux = 0;
                            var aux2 = 0;
                            for (var j = 0; j < data.length; j++) {
                                if(data[j].modelos == id_modelo_check){
                                    aux ++;
                                }
                            }
                            if(aux == 0){
                                app.dialog.close();
                                swal("","Algo salió mal.","warning");
                            }else{
                                dialog.setText('1 de ' + aux);
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].modelos == id_modelo_check){
                                        aux2++;
                                        productHandler.insertPreguntas(id_cedula,data[j].id_pregunta,data[j].revision,data[j].nombre_fase,data[j].nombre_seccion,data[j].fase,data[j].obligatorio,data[j].no_pregunta,1,data[j].modelos,aux,aux2,data[j].multiple);
                                    }
                                }
                            }
                        }
                    });
                },
                function (tx, error) {
                  console.log("Error al guardar cedula: " + error.message);
                }
              );
            },
            function (error) {},
            function () {}
          );
    }else{
        swal("","Selecciona una unidad para poder ingresar.","warning");
    }
}

function validaradios(id, numero){
    if(numero == 3){
        var ids = id.split("-");
        var check = ids[1];
        if(check.includes('1')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels1).addClass("checked");
                $("#"+labels2).removeClass("checked");
            }
        }else if(check.includes('2')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels2).addClass("checked");
                $("#"+labels1).removeClass("checked");
                var id_pregunta = ids[0].replace('radio','');
                SeleccionarDanos(id_pregunta);
            }
        }       
        actualizacheck(id);
    }
}

function moveChecklist(fase){
    localStorage.setItem("fase", fase);
    var page = localStorage.getItem("page");
    if(page == 1){
        app.views.main.router.back('/formCheck2/', {force: true, ignoreCache: true, reload: true});
    }else if(page == 2){
        app.views.main.router.back('/formCheck1/', {force: true, ignoreCache: true, reload: true});
    }
}

function actualizacheck(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio','');
        $("#span-"+id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist SET respuesta = ?,comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta,comentarios,id_cedula,id_pregunta],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    }else if(check.includes('2')){
        var respuesta = 2;var id_pregunta = ids[0].replace('radio','');
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist SET respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta,id_cedula,id_pregunta],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    }
}

function TerminarCheckList(){
    app.views.main.router.back('/formCheck3/', {force: true, ignoreCache: true, reload: true});
}

function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function agregaComentarios(id_pregunta,mul){
    if(mul == 1 || mul == 2){
        var seleccionados = $("#opts_modal").val();
        if(seleccionados.length == 0){
            swal("","Selecciona al menos una opción del desplegable.","warning");
            return false;
        }else{
            var opts = '';
            $("#opts_modal option").each(function(){
                if(this.selected){
                    opts = opts +", "+ capitalizarPrimeraLetra($(this).text());
                }
            });
            opts = opts.slice(1);
            opts = opts+":";
        }
    }else{
        var opts = '';
    }
    var campos;
    var comentarios = '';
    
    campos = document.querySelectorAll('#div_cboxs .obligatorio');
    var valido = false;

    [].slice.call(campos).forEach(function(campo) {
        if (campo.checked == true) {
            valido = true;
            comentarios = comentarios+", "+campo.value;
        }
    });

    if (valido) {
        var str = comentarios;
        var name = str.slice(1);
        name = opts+""+name;
        name = name.trim();
        name = capitalizarPrimeraLetra(name);
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist SET comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [name,id_cedula,id_pregunta],
                    function(tx, results){
                        $("#span-"+id_pregunta).html(name);
                        app.sheet.close('#sheet-modal');
                        swal("","Comentario guardado correctamente","success");
                    },
                    function(tx, error){
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    } else {
        swal("","Selecciona almenos un daño para poder guardar","warning");
    }
}

function guardaComentarios_generales(val){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datos_generales_checklist SET comentarios_generales = ? WHERE id_cedula = ?",
                [val,id_cedula],
                function(tx, results){
                    swal("","Observaciones guardadas correctamente","success");
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function EnviarCheckList(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar el checklist?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_cedula = localStorage.getItem("IdCedula");
            var fecha = new Date();
            var fecha_salida = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
            var estatus = 1;
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                        [fecha_salida,estatus,id_cedula],
                        function(tx, results){
                            window.location.href = "./menu.html";
                        },
                        function(tx, error){
                            swal("Error al guardar",error.message,"error");
                        }
                    );
                },
                function(error){},
                function(){}
            );              
        }
    });
}

function SeleccionarDanos(id){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM checklist WHERE id_pregunta = ? AND id_cedula = ?",
                [id,id_cedula],
                function(tx5, results){
                    var item2 = results.rows.item(0);
                    if(item2.multiple == 1){
                        var text = item2.revision;
                        let result = text.includes("(");
                        if(result){
                            var resultados = text.split("(");
                            var titulo_modal = resultados[0].trim();
                            var divididos = resultados[1].split(",");
                            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                            var quitapar = '';
                            for(i=0; i<divididos.length; i++){
                                quitapar = divididos[i].replace("(","");
                                quitapar = quitapar.replace(")","");
                                quitapar = capitalizarPrimeraLetra(quitapar);
                                opciones = opciones +`<option value=`+quitapar.trim()+`>`+quitapar.trim()+`</option>`;
                            }
                            opciones = opciones+'</select>';
                            CreaModalOption(id,opciones,1,titulo_modal);
                        }else{
                            var titulo_modal = "";
                            var divididos = text.split(",");
                            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                            var quitapar = '';
                            for(i=0; i<divididos.length; i++){
                                quitapar = divididos[i].replace("(","");
                                quitapar = quitapar.replace(")","");
                                quitapar = capitalizarPrimeraLetra(quitapar);
                                opciones = opciones +`<option value=`+quitapar.trim()+`>`+quitapar.trim()+`</option>`;
                            }
                            opciones = opciones+'</select>';
                            var titulo_modal = "";    
                            CreaModalOption(id,opciones,2,titulo_modal);
                        }
                        
                    }else{
                        var opciones = false;
                        var titulo_modal = "";
                        CreaModalOption(id,opciones,3,titulo_modal);
                    }
                }
            )
        }
    );
}

function CreaModalOption(id,opciones,mul,titulo_modal){
    if(mul==3){
        var display = "none";//div_opt
        var display1 = "none";//titulo_modal
    }else if(mul == 2){
        var display = "block";//div_opt
        var display1 = "none";//titulo_modal
    }else if(mul == 1){
        var display = "block";//div_opt
        var display1 = "block";//titulo_modal
    }

    var NomDescCli = "danios";
    var html = '';

    app.request.get(cordova.file.dataDirectory + "jsons/"+NomDescCli+".json", function (data) {
        var content2 = JSON.parse(data);
        for(var x = 0; x < content2.length; x++) {
            html = html + `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox`+content2[x].id_danio+`" value="`+content2[x].tipo_danio+`">`+content2[x].tipo_danio+`</label><br>`;
        }
        var popEvidencia = app.popup.create({
            content: `
            <div class="sheet-modal my-sheet" id="sheet-modal" name="sheet">
            <div class="toolbar">
                <div class="toolbar-inner">
                    <div class="left"></div>
                    <div class="right"><a class="link" id="close_sheet" href="#">Cerrar</a></div>
                </div>
            </div>
            <div class="sheet-modal-inner" style="overflow-y: scroll;">
                <div class="block">
                    <h3 class="FWN-titulo-2">¿Que tipo de daño es?</h3><hr>
                    <span id="titulo_modal" style="display:`+display1+`;color: #FF0037;" class="span FWM-span-form">`+titulo_modal+`</span>
                    <div id="div_opt" style="display:`+display+`; padding-top: 10px;margin-bottom: 20px;">
                    `+opciones+`
                    </div>
                    <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                        <input type="hidden" id="inputEvidencia" value=`+id+`>
                        <input type="hidden" id="pasa" value="0">
                            `+html+`
                        <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                            <div class="row align-items-stretch" style="text-align: center;">
                                <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                    <span class="resize-handler"></span>
                                    <a href="#" onclick="agregaComentarios(`+id+`,`+mul+`);" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        swipeToClose:false,
        closeByOutsideClick:false,
        closeByBackdropClick:false,
        closeOnEscape:false,
                on: {
                    open: function (popup) {
    
                        $('#close_sheet').click(function () {
                            if($('#pasa').val()!=0){
                                app.sheet.close('#sheet-modal');
                            }else{
                                swal({
                                    title: "Aviso",
                                    text: "Aún no seleccionas o guardas una opción, ¿Estas seguro que deseas regresar?",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: false,
                                }).then((willGoBack) => {
                                    if (willGoBack){
                                        var otherCheck = "radio"+ id + "-2";
                                        document.getElementById(otherCheck).checked = false;
                                        var Check = "radio"+ id + "-1";
                                        document.getElementById(Check).checked = true;
                                        var labels1 = Check.replace('radio','label');
                                        var labels2 = otherCheck.replace('radio','label');
                                        $("#"+labels1).addClass("checked");
                                        $("#"+labels2).removeClass("checked");
                                        actualizacheck(Check);
                                        app.sheet.close('#sheet-modal');
                                    } else {}
                                });
                            }
                        });
                    },
                }
        });
       
        popEvidencia.open();
    });
}
//fin checklist
//inicio de Revision Limpieza
function IniciaCheckListLimp(){
    if($("#autocomplete-dropdown-ajax").val()){
        var Unidad = $("#autocomplete-dropdown-ajax").val();
        var Chasis = $("#Chasis").val();
        var Familia = $("#Familia").val();
        var marca = $("#marca").val();
        var Empresa = $("#Empresa").val();
        var FK_id_unidad = $("#FK_unidad").val();
        var id_unidad_vs = $("#id_unidad").val();
        var FK_id_empresa = $("#FK_unidad_danos_empresa").val();
        var id_modelo_check = $("#modelo_check").val();
        var fecha_revision =  $("#fecha_revision").val();
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = localStorage.getItem("empresa");
        var tipo_cedula = 'Limpieza';
        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    //app.dialog.progress('Generando CheckList','red');
                    var progress = 0;
                    var dialog = app.dialog.progress('Generando CheckList', progress, 'red');
                    var empresa = localStorage.getItem("empresa");
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    productHandler.addDatosGenerales_limp(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision);
                    var NomJson = 'datos_check_desc'+empresa;
                    app.request({
                        url: cordova.file.dataDirectory + "jsons_limp/"+NomJson+".json",
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            var aux = 0;
                            var aux2 = 0;
                            for (var j = 0; j < data.length; j++) {
                                if(data[j].modelos == id_modelo_check){
                                    aux ++;
                                }
                            }
                            if(aux == 0){
                                app.dialog.close();
                                swal("","Algo salió mal.","warning");
                            }else{
                                dialog.setText('1 de ' + aux);
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].modelos == id_modelo_check){
                                        aux2++;
                                        productHandler.insertPreguntas_limp(id_cedula,data[j].id_pregunta,data[j].revision,data[j].nombre_fase,data[j].nombre_seccion,data[j].fase,data[j].obligatorio,data[j].no_pregunta,1,data[j].modelos,aux,aux2,data[j].multiple);
                                    }
                                }
                            }
                        }
                    });
                },
                function (tx, error) {
                  console.log("Error al guardar cedula: " + error.message);
                }
              );
            },
            function (error) {},
            function () {}
          );
    }else{
        swal("","Selecciona una unidad para poder ingresar.","warning");
    }
}

function moveChecklist_limp(fase){
    localStorage.setItem("fase", fase);
    var page = localStorage.getItem("page");
    if(page == 1){
        app.views.main.router.back('/formLimp2/', {force: true, ignoreCache: true, reload: true});
    }else if(page == 2){
        app.views.main.router.back('/formLimp1/', {force: true, ignoreCache: true, reload: true});
    }
}

function validaradios_limp(id, numero){
    if(numero == 3){
        var ids = id.split("-");
        var check = ids[1];
        if(check.includes('1')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels1).addClass("checked");
                $("#"+labels2).removeClass("checked");
            }
        }else if(check.includes('2')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels2).addClass("checked");
                $("#"+labels1).removeClass("checked");
            }
        }       
        actualizacheck_limp(id);
    }
}
function actualizacheck_limp(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio','');
        $("#span-"+id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist_revlimp SET respuesta = ?,comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta,comentarios,id_cedula,id_pregunta],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    }else if(check.includes('2')){
        var respuesta = 2;var id_pregunta = ids[0].replace('radio','');
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist_revlimp SET respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta,id_cedula,id_pregunta],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    }
}
function TerminarCheckList_limp(){
    app.views.main.router.back('/formLimp3/', {force: true, ignoreCache: true, reload: true});
}
function guardaComentarios_generales_limp(val){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datos_generales_revlimp SET comentarios_generales = ? WHERE id_cedula = ?",
                [val,id_cedula],
                function(tx, results){
                    swal("","Observaciones guardadas correctamente","success");
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );   
}
//fin de Revision Limpieza
function getDateWhitZeros(){
    var MyDate = new Date();
    var MyDateString = MyDate.getFullYear() +"-"+ ('0' + (MyDate.getMonth()+1)).slice(-2) +"-"+ ('0' + MyDate.getDate()).slice(-2)+" "+('0' + MyDate.getHours()).slice(-2)+":"+('0' + MyDate.getMinutes()).slice(-2)+":"+('0' + MyDate.getSeconds()).slice(-2);
    return MyDateString;
}
function NombreEmpresa(val){
    if(val == 1){
        return "ACHSA";
    } else if(val == 35){
        return "AMTM";
    } else if(val == 2){
        return "ATROL";
    } else if(val == 37){
        return "AULSA";
    } else if(val == 20){
        return "BUSSI";
    } else if(val == 3){
        return "CCA";
    } else if(val == 4){
        return "CISA";
    } else if(val == 5){
        return "COAVE";
    } else if(val == 41){
        return "CODIV";
    } else if(val == 6){
        return "COPE";
    } else if(val == 7){
        return "CORENSA";
    } else if(val == 8){
        return "COREV";
    } else if(val == 9){
        return "COTAN";
    } else if(val == 10){
        return "COTOBUSA";
    } else if(val == 39){
        return "COTXS";
    } else if(val == 22){
        return "ESASA";
    } else if(val == 11){
        return "MIHSA";
    } else if(val == 12){
        return "RECSA";
    } else if(val == 13){
        return "SIMES";
    } else if(val == 14){
        return "SKYBUS";
    } else if(val == 15){
        return "STMP";
    } else if(val == 16){
        return "TCGSA";
    } else if(val == 17){
        return "TREPSA";
    } else if(val == 19){
        return "TUZOBUS";
    } else if(val == 18){
        return "VYCSA";
    } else{
        return "logo1";
    }
}
//inicio de Desincorporacion
function NuevaDesincorporacion(){
    app.views.main.router.back('/formDesin1/', {force: true, ignoreCache: true, reload: true});
}
function regresarDesincorporacion(){
    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
}
function GuardaDesincorporacion(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var id_cedula = localStorage.getItem("IdCedula");
        var UsuarioDes = localStorage.getItem("Usuario");
        var HoraDes = $("#hora_des").val();        
        var UnidadDesinID = $("#UnidadDesinID").val()
        var UnidadDesin = $("#unidad_des").val();
        var Itinerario = $("#itinerario").val();
        var OperadorDes = $("#operador_des").val();
        var id_operador_des = $("#id_operador_des").val();
        var Falla = $("#falla").val();
        var DetalleFalla = $("#detalle_falla").val();
        var SentidoDes = $("#sentido").val();
        var KmDes = $("#km_unidad").val();
        var FolioDes = $("#folio_inicial").val();
        var UbicacionDes = $("#ubicacion").val();
        if($("#check_jornada").prop("checked") == true){
            var jornadas = 1;
        } else {
            var jornadas = 0;
        }
        if($("#check_apoyo").prop("checked") == true){
            var apoyo = 1;
        } else {
            var apoyo = 0;
        }
        var estatus_servidor = 0;
        var id_servidor = 0;
        var fecha = getDateWhitZeros();
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer guardar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                databaseHandler.db.transaction(
                    function (tx) {
                      tx.executeSql(//
                        "insert into desincorporacionesD(id_cedula, apoyo, jornadas, HoraDes, UnidadDesinID, UnidadDesin, Itinerario, Falla, DetalleFalla, SentidoDes, UbicacionDes, OperadorDes, id_operador_des, KmDes, FolioDes, UsuarioDes,estatus_servidor, id_servidor, HoraDesR) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [id_cedula, apoyo, jornadas, HoraDes, UnidadDesinID, UnidadDesin, Itinerario, Falla, DetalleFalla, SentidoDes, UbicacionDes, OperadorDes, id_operador_des, KmDes, FolioDes, UsuarioDes, estatus_servidor, id_servidor, fecha],
                        function (tx, results) {
                            swal("","Guardado correctamente","success");
                            setTimeout(function () {
                                swal.close();
                                app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                            }, 1500);  
                        },
                        function (tx, error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                      );
                    },
                    function (error) {console.error("Error al consultar bandeja de salida: " + error.message);},
                    function (error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                );           
            }
        });
    }else{
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }
}
function check_jornada(val){
    if(val){
        if(val == 1){
            if($("#check_jornada").prop("checked") == true){
                var campos;
                campos = document.querySelectorAll('#datos_form .opta');
                [].slice.call(campos).forEach(function(campo) {
                    $("#"+$(campo).attr("id")).removeClass("obligatorio");
                    $("#"+$(campo).attr("id")).val("");
                    $("#"+$(campo).attr("id")).prop("readonly", true);
                });
                $("#sentido_inc").prop("disabled", true);
                $("#sentido_inc").css("background-color", "#f5f5f5", "!important");
                $("#incumplimiento").addClass("obligatorio");
                $("#incumplimiento").prop("readonly", false);
                $("#km_perdidos").addClass("obligatorio");
                $("#km_perdidos").prop("readonly", false);
            } else {
                var campos;
                campos = document.querySelectorAll('#datos_form .opta');
                [].slice.call(campos).forEach(function(campo) {
                    $("#"+$(campo).attr("id")).addClass("obligatorio");
                    $("#"+$(campo).attr("id")).val("");
                    $("#"+$(campo).attr("id")).prop("readonly", false);
                });
                $("#sentido_inc").css("background-color", "#ffffff", "!important");
                $("#sentido_inc").prop("disabled", false);
            }
        }
    } else {
        if($("#check_jornada").prop("checked") == true){
            $("#unidad_des").removeClass("obligatorio");
            $("#operador_des").removeClass("obligatorio");
            $("#km_unidad").removeClass("obligatorio");
            $("#hora_des").removeClass("obligatorio");
            $("#hora_des").val("");
            $("#hora_des").prop("readonly", true);
        } else {
            $("#unidad_des").addClass("obligatorio");
            $("#unidad_des").val("");
            $("#unidad_des").prop("readonly", false);
            $("#operador_des").addClass("obligatorio");
            $("#operador_des").val("");
            $("#operador_des").prop("readonly", false);
            $("#km_unidad").addClass("obligatorio");
            $("#km_unidad").val("");
            $("#km_unidad").prop("readonly", false);
            $("#hora_des").addClass("obligatorio");
            $("#hora_des").val("");
            $("#hora_des").prop("readonly", false);
        }
    }
}
function check_apoyo(){
    // if($("#check_jornada").prop("checked") == true){
    //     swal("","No se puede marcar la opción de apoyo cuando la jornada es no incorporada.","warning");
    //     $("#check_apoyo").prop("checked",false);
    // }
}
function get_datos_completos(form){
    var campos;
    var trae_los_campos_sin_llennar='';
    campos = document.querySelectorAll('#'+form+' .obligatorio');
    var valido = true;

    [].slice.call(campos).forEach(function(campo) {
        if($(campo).get(0).tagName == 'SELECT'){
            if (campo.value.trim() == 0 || campo.value.trim() == '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", "+$(campo).attr("name");
            }
        }else if($(campo).get(0).tagName == 'TEXTAREA'){
            if (campo.value.trim() === '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", "+$(campo).attr("name");
            }
        }else{
            if (campo.value.trim() === '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", "+$(campo).attr("name");
            }
        }
    });

    if (valido) {
        return {
            valido: valido,
            reponse: 1
        };
    } else {
        const str = trae_los_campos_sin_llennar;
        const quita_coma = str.slice(1)
        return {
            valido: valido,
            response: quita_coma
        };
    }
}
function iniciarDesincorporaciones(){
    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");
    var id_cliente = localStorage.getItem("empresa");

    if(id_cliente == 1){
        var nombre_cliente = "ACHSA";
    } else if(id_cliente == 35){
        var nombre_cliente = "AMTM";
    } else if(id_cliente == 2){
        var nombre_cliente = "ATROL";
    } else if(id_cliente == 37){
        var nombre_cliente = "AULSA";
    } else if(id_cliente == 20){
        var nombre_cliente = "BUSSI";
    } else if(id_cliente == 3){
        var nombre_cliente = "CCA";
    } else if(id_cliente == 4){
        var nombre_cliente = "CISA";
    } else if(id_cliente == 5){
        var nombre_cliente = "COAVE";
    } else if(id_cliente == 41){
        var nombre_cliente = "CODIV";
    } else if(id_cliente == 6){
        var nombre_cliente = "COPE";
    } else if(id_cliente == 7){
        var nombre_cliente = "CORENSA";
    } else if(id_cliente == 8){
        var nombre_cliente = "COREV";
    } else if(id_cliente == 9){
        var nombre_cliente = "COTAN";
    } else if(id_cliente == 10){
        var nombre_cliente = "COTOBUSA";
    } else if(id_cliente == 39){
        var nombre_cliente = "COTXS";
    } else if(id_cliente == 22){
        var nombre_cliente = "ESASA";
    } else if(id_cliente == 11){
        var nombre_cliente = "MIHSA";
    } else if(id_cliente == 12){
        var nombre_cliente = "RECSA";
    } else if(id_cliente == 13){
        var nombre_cliente = "SIMES";
    } else if(id_cliente == 14){
        var nombre_cliente = "SKYBUS";
    } else if(id_cliente == 15){
        var nombre_cliente = "STMP";
    } else if(id_cliente == 16){
        var nombre_cliente = "TCGSA";
    } else if(id_cliente == 17){
        var nombre_cliente = "TREPSA";
    } else if(id_cliente == 19){
        var nombre_cliente = "TUZOBUS";
    } else if(id_cliente == 18){
        var nombre_cliente = "VYCSA";
    } else{
        var nombre_cliente = "N/A";
    }

    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "Select id_cedula from desincorporaciones where DATE(fecha) = ? AND empresa = ?",
            [hoy[0], nombre_cliente],
            function (tx, results) {
                var length = results.rows.length;
                if(length == 0){
                    swal({
                        title: "Aviso",
                        text: "¿Estas seguro de querer iniciar un nuevo Reporte?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            var id_usuario = localStorage.getItem("Usuario");
                            var nombre_usuario = localStorage.getItem("nombre");
                            var Usuario = localStorage.getItem("Usuario");
                            var fecha_llegada = getDateWhitZeros();
                            var horario_programado = fecha_llegada;
                            var estatus = 0;
                            var geolocation = '';
                
                            var tipo_cedula = 'Desincorporaciones';
                            productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
                
                            databaseHandler.db.transaction(
                                function (tx) {
                                  tx.executeSql(
                                    "Select MAX(id_cedula) as Id from cedulas_general",
                                    [],
                                    function (tx, results) {
                                        var item = results.rows.item(0);
                                        localStorage.setItem("IdCedula", item.Id);
                                        var id_cedula = item.Id;
                                        var estatusd = "Abierto";
                                        productHandler.addDesincorHeader(id_cedula,nombre_cliente,fecha_llegada,estatusd,Usuario, 0, 0);
                                        app.views.main.router.navigate({ name: 'yallegue_desin'});         
                                    },
                                    function (tx, error) {}
                                  );
                                },
                                function (error) {},
                                function () {}
                            );
                        }
                    });
                } else {
                    swal("","Actualmente ya existe un registro del día de hoy. Puedes acceder a el en la sección de bandeja de salida","warning");
                }
            },
            function (tx, error) {}
          );
        },
        function (error) {},
        function () {}
    );
}
function RevisaHeaders(){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Header_'+empresa;

    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");

    var encontro = false;
    var id = '';
    var folio = '';
    var fecha = '';
    var estatus = '';
    var usuarioApertura = '';
    var usuarioCierre = '';
    var empresa = '';

    app.request.get(cordova.file.dataDirectory + "jsons_desin/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                if(content2[x].Fecha2 == hoy[0]){
                    encontro = true;
                    id = content2[x].ID;
                    empresa = content2[x].Empresa;
                    folio = content2[x].Folio;
                    fecha = content2[x].Fecha;
                    estatus = content2[x].Estatus;
                    usuarioApertura = content2[x].UsuarioApertura;
                    usuarioCierre = content2[x].UsuarioCierre;
                    GuardaHeaderDesktop(id, empresa, folio, fecha, estatus, usuarioApertura, usuarioCierre);
                }         
            }
        }
    });
}

function GuardaHeaderDesktop(id, empresa, folio, fecha, estatus, usuarioApertura, usuarioCierre){
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM desincorporaciones WHERE fecha = ? ",
                [fecha],
                function(tx5, results){
                    var length = results.rows.length;
                    if(length == 0){
                        var id_usuario = localStorage.getItem("Usuario");
                        var nombre_usuario = localStorage.getItem("nombre");
                        var id_cliente = localStorage.getItem("empresa");
                        var estatus = 0;
                        var geolocation = '';
                        var tipo_cedula = 'Desincorporaciones';
                        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha,geolocation,id_cliente,empresa,fecha,estatus,tipo_cedula);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    var item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    var id_cedula = item.Id;
                                    if(usuarioCierre){
                                        var estatusd = "Concluido";
                                        productHandler.addDesincorHeader2(id_cedula,empresa,fecha,estatusd,usuarioApertura, 4, id, usuarioCierre);
                                        PintaCedulas(0, "Desincorporaciones");
                                    } else {
                                        var estatusd = "Abierto";
                                        productHandler.addDesincorHeader(id_cedula,empresa,fecha,estatusd,usuarioApertura, 2, id);
                                        PintaCedulas(0, "Desincorporaciones");
                                    }
                                    InsertaDetails(id_cedula, id);
                                },
                                function (tx, error) {}
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else {
                        var item2 = results.rows.item(0);
                        var id_cedula = item2.id_cedula;
                        if(usuarioCierre){
                            var estatusd = "Cerrado";
                            var estatusn = 4;
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                    "UPDATE desincorporaciones SET userApertura = ?, userCierre = ?,estatus = ?, estatus_servidor = ?, fecha2 = ? WHERE id_cedula = ?",
                                    [usuarioApertura, usuarioCierre, estatusd ,estatusn, fecha, id_cedula],
                                    function (tx, results) {
                                        PintaCedulas(0, "Desincorporaciones");
                                        InsertaDetails(id_cedula, item2.id_servidor);
                                        databaseHandler.db.transaction(
                                            function(tx){
                                                tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                    [fecha,3,id_cedula],
                                                    function(tx, results){
                                                    },
                                                    function(tx, error){
                                                        swal("Error al guardar",error.message,"error");
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        } else {
                            var estatusd = "Abierto";
                            var estatus = 2;
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                    "UPDATE desincorporaciones SET userApertura = ?, userCierre = ?,estatus = ?, estatus_servidor = ?, fecha2 = ? WHERE id_cedula = ?",
                                    [usuarioApertura, usuarioCierre, estatusd ,estatusn, fecha, id_cedula],
                                    function (tx, results) {
                                        PintaCedulas(0, "Desincorporaciones");
                                        InsertaDetails(id_cedula, item2.id_servidor);
                                    },
                                    function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        }
                    }
                },
                function(tx5, error){
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );  
        },
      function(error){},
      function(){}
    );
}

function PintaCedulas(estatus, tipo){
    if(tipo == "Desincorporaciones"){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                    [estatus, tipo],
                    function(tx5, results){
                        var length = results.rows.length;
                        var html = '';
                        for(var i = 0; i< length; i++){
                            var item2 = results.rows.item(i);
                            var fechas = item2.fecha_entrada.split(" ");
                            var html = html + `<li id='conc${item2.id_cedula}'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> ${item2.nombre_cliente + "| "+fechas[0]}</div> </div><div class='item-after'><a href='#' onclick='continuarCed(${item2.id_cedula},3);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;</div></div></div></li>`;
                        }
                        $("#pendientes").html(html);
                    },
                    function(tx5, error){
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );  
            },
          function(error){},
          function(){}
        );
    } else if(tipo == "Recaudo"){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                    [estatus, tipo],
                    function(tx5, results){
                        var length = results.rows.length;
                        var html = '';
                        for(var i = 0; i< length; i++){
                            var item2 = results.rows.item(i);
                            var fechas = item2.fecha_entrada.split(" ");
                            var html = html + "<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Recaudo</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,4);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>";
                        }
                        $("#pendientes").html(html);
                    },
                    function(tx5, error){
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );  
            },
          function(error){console.error("Error al consultar bandeja de salida: " + error.message);},
          function(error){console.error("Error al consultar bandeja de salida: " + error.message);}
        );
    }
}
function InsertaDetails(id_cedula, id_servidor){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Details_'+empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_desin/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                if(id_servidor == content2[x].IDCabecero){
                    productHandler.addDetailsDes(content2[x].ID, content2[x].IDCabecero, content2[x].Apoyo, content2[x].JornadasNoIncorporadas, content2[x].HoraD, content2[x].HoraI, content2[x].UnidadDID, content2[x].UnidadD, content2[x].UnidadIID, content2[x].UnidadI, content2[x].Itinerario, content2[x].Motivo, content2[x].Falla, content2[x].SentidoD, content2[x].SentidoI, content2[x].UbicacionD, content2[x].Incumplimiento, content2[x].OperadorD, content2[x].OperadorI, content2[x].KmD, content2[x].KmI, content2[x].KmPerdidos, content2[x].FolioD, content2[x].FolioI, content2[x].UsuarioI, content2[x].UsuarioD, content2[x].HoraCapturaD, content2[x].HoraCapturaI, content2[x].Origen, content2[x].UbicacionI, content2[x].JornadaSinIncorporacion, x, content2.length, id_cedula)
                }
            }
        }
    });
    var NomJson2 = 'DetailsApoyos_'+empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_desin/"+NomJson2+".json", function (data) {
        var content3 = JSON.parse(data);
        if (content3 == null){}else{
            for(var x = 0; x < content3.length; x++) {
                if(id_servidor == content3[x].IDCabecero){
                    productHandler.addDetailsApoyo(content3[x].ID, content3[x].IDCabecero, content3[x].Apoyo,content3[x].TipoUnidad, content3[x].Hora, content3[x].UnidadID,content3[x].Unidad,content3[x].Ubicacion,content3[x].Itinerario,content3[x].TramoDeApoyo,content3[x].Sentido,content3[x].kilometrajeUnidad,content3[x].kilometrajeApoyo,content3[x].Operador,content3[x].Usuario,content3[x].HoraCaptura,content3[x].Origen, x, content3.length, id_cedula)
                }
            }
        }
    });
}
function GuardaIncorporacion(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var UnidadIncID = $("#UnidadIncID").val();
        var HoraInc = $("#hora_inc").val();
        var UnidadInc = $("#unidad_inc").val();
        var OperadorInc = $("#operador_inc").val();
        var UbicacionInc = $("#ubicacion_inc").val();
        var SentidoInc = $("#sentido_inc").val();
        var Inclumplimiento = $("#incumplimiento").val();
        var KmPerdidos = $("#km_perdidos").val();
        var KmInc = $("#km_inc").val();
        var FolioInc = $("#folio_final").val();
        var fecha = getDateWhitZeros();
        var id_operador_inc = $("#id_operador_inc").val();
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer guardar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                if($("#check_jornada").prop("checked") == true){
                    var jornadaSIncorporacion = 1;
                } else {
                    var jornadaSIncorporacion = 0;
                }
                var id_cedula = localStorage.getItem("IdCedula");
                var id_desD = localStorage.getItem("detalle_incorpora");
                var Usuarioinc = localStorage.getItem("Usuario");     
                databaseHandler.db.transaction(
                    function (tx) {
                    tx.executeSql(
                        "Select estatus_servidor from desincorporacionesD where id_cedula = ? AND id_desD = ?",
                        [id_cedula, id_desD],
                        function (tx, results) {
                            var item = results.rows.item(0);
                            if (item.estatus_servidor == 0){
                                var new_estatus = 1;
                            } else if (item.estatus_servidor == 2){
                                var new_estatus = 3;
                            }
                            databaseHandler.db.transaction(
                                function (tx) {
                                  tx.executeSql(
                                    "UPDATE desincorporacionesD SET HoraInc = ?, UnidadIncID = ?, UnidadInc = ?, SentidoInc = ?, UbicacionInc = ?, Inclumplimiento = ?, OperadorInc = ?, KmInc = ?, FolioInc = ?, Usuarioinc = ?, KmPerdidos = ?, HoraIncR = ?, estatus_servidor = ?, id_operador_inc = ?, jornadaSIncorporacion = ? WHERE id_cedula = ? AND id_desD = ?",
                                    [HoraInc, UnidadIncID, UnidadInc, SentidoInc, UbicacionInc, Inclumplimiento, OperadorInc, KmInc, FolioInc, Usuarioinc, KmPerdidos, fecha, new_estatus,id_operador_inc, jornadaSIncorporacion, id_cedula, id_desD],
                                    function (tx, results) {
                                        swal("","Guardado correctamente","success");
                                        setTimeout(function () {
                                            swal.close();
                                            app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                                        }, 1500);  
                                    },
                                    function (tx, error) {}
                                  );
                                },
                                function (error) {},
                                function () {}
                            );
                        },
                        function (tx, error) {}
                    );
                    },
                    function (error) {},
                    function () {}
                );
            }
        });
    }else{
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }   
}
function IncorporarUnidad(val){
    localStorage.setItem("detalle_incorpora",val);
    app.views.main.router.back('/formDesin2/', {force: true, ignoreCache: true, reload: true});
}
function VerDetalleDesinc(val){
    localStorage.setItem("detalle_incorpora",val);
    app.views.main.router.back('/formDesin3/', {force: true, ignoreCache: true, reload: true});
}
function RefreshDataSustitucion(){
    var onestep = localStorage.getItem("one_step");
    localStorage.setItem("tap_refresh", 1);
    if(!onestep){
        localStorage.setItem("one_step", 1);
        swal("Actualizando...!", "...", "success");
        EnvioDatosTrafico();

        setTimeout(function(){
            localStorage.removeItem("one_step");
        },3000)
    }
}
function CerrarReporte(){
    var MyDate = new Date();
    var time1 = ('0' + MyDate.getHours()).slice(-2)+":"+('0' + MyDate.getMinutes()).slice(-2)+":"+('0' + MyDate.getSeconds()).slice(-2);

    const date1 = new Date('2023-01-01 ' + time1);
    const date2 = new Date('2023-01-01 23:00');
    const date3 = new Date('2023-01-01 03:00');

    if (date1.getTime() < date2.getTime() && date1.getTime() > date3.getTime()) {
        swal("", "Este botón solo estará activo después de las 23 horas", "warning");
        return false;
    } 

    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT id_cedula FROM desincorporacionesD WHERE id_cedula = ? AND jornadaSIncorporacion IS NULL",
                [id_cedula],
                function(tx5, results){
                    var length = results.rows.length;
                    if(length == 0){} else {
                        swal("", "Aún tienes jornadas que no se han incorporado, debes cerrarlas para poder finalizar el reporte.", "warning");
                        return false;
                    }
                },
                function(tx5, error){
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );  
        },
        function(error){},
        function(){}
    );
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer cerrar el reporte?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_cedula = localStorage.getItem("IdCedula");
            var usuarioCierre = localStorage.getItem("Usuario");
            var fecha_salida = getDateWhitZeros();
            var estatus = 1;
            var cierre = "CERRADO";
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("UPDATE desincorporaciones SET fecha2  = ?, userCierre = ?, Estatus = ?, estatus_servidor = ? WHERE id_cedula = ?",
                        [fecha_salida, usuarioCierre, cierre,3, id_cedula],
                        function(tx, results){
                            databaseHandler.db.transaction(
                                function(tx){
                                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                        [fecha_salida,estatus,id_cedula],
                                        function(tx, results){
                                            window.location.href = "./menu.html";
                                        },
                                        function(tx, error){
                                            swal("Error al guardar",error.message,"error");
                                        }
                                    );
                                },
                                function(error){},
                                function(){}
                            );              
                        },
                        function(tx, error){
                            swal("Error al guardar",error.message,"error");
                        }
                    );
                },
                function(error){},
                function(){}
            );
        }
    });
}
function CambiaBolita(id, estatus){
    if(estatus == 2){
        $("#bol_"+id).css("color", "#F39C12");
    } else  if(estatus == 4){
        $("#bol_"+id).css("color", "#2ECC71");
    }
}
function CambiaBolita2(id, estatus){
    if(estatus == 1){
        $("#bolac_"+id).css("color", "#F39C12");
    } else  if(estatus == 4){
        $("#bolac_"+id).css("color", "#2ECC71");
    }
}
function edit_folio(id, folio){
    localStorage.setItem("Folio", folio);
    localStorage.setItem("id_detalle_folio", id);
    if(folio == 1){
        app.views.main.router.back('/formDesin4/', {force: true, ignoreCache: true, reload: true});
    } else if(folio == 2){
        app.views.main.router.back('/formDesin4/', {force: true, ignoreCache: true, reload: true});
    } 
}
function ActualizaFolio(){
    var id_desD = $("#id_des").val();
    var folio = localStorage.getItem("Folio");
    var id_cedula = localStorage.getItem("IdCedula");
    
    var Inclumplimiento = $("#incumplimiento").val();
    var Folios = $("#folio_inicial").val();
    var km_perdidos = $("#km_perdidos").val();

    var estatus_s = $("#estatus_servidor").val();
    if (estatus_s == 4){
        var estatus_servidor = 3;
    } else {
        estatus_servidor = estatus_s;
    }
    
    if (folio == 1){
        var sql = "UPDATE desincorporacionesD SET FolioDes = ?, Inclumplimiento = ?, KmPerdidos = ?, estatus_servidor = ? WHERE id_cedula = ? AND id_desD = ?";
    } else if (folio == 2){
        var sql = "UPDATE desincorporacionesD SET FolioInc = ?, Inclumplimiento = ?, KmPerdidos = ?, estatus_servidor = ? WHERE id_cedula = ? AND id_desD = ?";
    }

    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            sql,
            [Folios,Inclumplimiento, km_perdidos, estatus_servidor ,id_cedula, id_desD],
            function (tx, results) {
                swal("","Guardado correctamente","success");
                setTimeout(function () {
                    swal.close();
                    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                }, 1500);       
            },
            function (tx, error) {}
          );
        },
        function (error) {},
        function () {}
    );
}
function check_hour(val){
    var horades = $("#hora_des").val();
    if (horades <= val) {}else{
        swal("","La hora no puede ser menor a la hora de desincorporación.","warning");
        $("#hora_inc").val("");
    } 
}
function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function numberWithZeros(num) {
    if(num.split(".").length == 1){
        return num+".00";
    } else {
        return num;
    }
}

function NuevoApoyo(){
    app.views.main.router.back('/formDesin5/', {force: true, ignoreCache: true, reload: true});
}

function GuardarTRFApoyos(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var id_cedula = localStorage.getItem("IdCedula");
        var Usuario = localStorage.getItem("Usuario");
        var id_operador = $("#id_operador").val();
        var Hora = $("#Hora").val();
        var Itinerario = $("#Itinerario").val();
        var Unidad = $("#Unidad").val();
        var kilometrajeUnidad = $("#kilometrajeUnidad").val();
        var Operador = $("#Operador").val();
        var Ubicacion = $("#Ubicacion").val();
        var Sentido = $("#Sentido").val();
        var TramoDeApoyo = $("#TramoDeApoyo").val();
        var kilometrajeApoyo = $("#kilometrajeApoyo").val();
        var UnidadID = $("#UnidadID").val();
        if($("#TipoUnidad").prop("checked") == true){
            var TipoUnidad = 1;
        } else {
            var TipoUnidad = 0;
        }
        if($("#Apoyo").prop("checked") == true){
            var Apoyo = 1;
        } else {
            var Apoyo = 0;
        }

        var estatus_servidor = 0;
        var id_servidor = 0;
        var HoraCaptura = getDateWhitZeros();

        if(Apoyo == 0 && TipoUnidad == 0){
            swal("","Debes marcar una opción del tipo de apoyo.","warning");
            return false;
        }

        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer guardar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                if($("#id_apoyo").val()){
                    var id_apoyo = $("#id_apoyo").val();
                    if($("#estatus_servs").val() == 0){
                        estatus_servidor = 0;
                    } else if($("#estatus_servs").val() == 2){
                        estatus_servidor = 1;
                    } else if($("#estatus_servs").val() == 4){
                        estatus_servidor = 1;
                    }
                    databaseHandler.db.transaction(
                        function (tx) {
                          tx.executeSql(
                            "UPDATE TRFapoyo SET TramoDeApoyo = ?, kilometrajeApoyo = ?, estatus_servidor = ? WHERE id_apoyo = ?",
                            [TramoDeApoyo, kilometrajeApoyo, estatus_servidor, id_apoyo],
                            function (tx, results) {
                                swal("","Guardado correctamente","success");
                                setTimeout(function () {
                                    swal.close();
                                    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                                }, 1500);  
                            },
                            function (tx, error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                          );
                        },
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);},
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                    );
                } else {
                    databaseHandler.db.transaction(
                        function (tx) {
                          tx.executeSql(
                            "insert into TRFapoyo (id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo],
                            function (tx, results) {
                                swal("","Guardado correctamente","success");
                                setTimeout(function () {
                                    swal.close();
                                    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                                }, 1500);  
                            },
                            function (tx, error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                          );
                        },
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);},
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                    );  
                }         
            }
            // TRFapoyo(id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo);
        });
    }else{
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }   
}

function edit_apoyo(val, estatus){
    localStorage.setItem("id_detalle_folio", val);
    localStorage.setItem("estatus_servs", estatus);
    app.views.main.router.back('/formDesin5/', {force: true, ignoreCache: true, reload: true});
}
function sincronizaDatos(){
    var EmpresaID = localStorage.getItem("empresa");
    // var urlBase2 = "http://192.168.100.6/Desarrollo/CISAApp";
    var urlBase2 = "http://mantto.ci-sa.com.mx/www.CISAAPP.com";
    var url = urlBase2 + "/Exec/datos_desin.php?empresa="+EmpresaID;
    var url2 = urlBase2 + "/Exec/datos_desin_H.php?empresa="+EmpresaID;

    fetch(url)
        .then((response) => {
    });

    fetch(url2)
        .then((response) => {
    });
    // console.log("Sincroniza datos")
}
function CheckApoyoTipo(val){
    if(val == 0){
        var valCheck = document.getElementById("TipoUnidad").checked;
        if(valCheck == true){
            document.getElementById("Apoyo").checked = false;
        }
    }else {
        var valCheck = document.getElementById("Apoyo").checked;
        if(valCheck ==true){
            document.getElementById("TipoUnidad").checked = false;
        }
    }
}
function getIDEmpresa(val){
    if(val == "ACHSA"){
        return 1;
    }else if(val == "AMTM"){
        return 35;
    }else if(val == "ATROL"){
        return 2;
    }else if(val == "AULSA"){
        return 37;
    }else if(val == "BUSSI"){
        return 20;
    }else if(val == "CCA"){
        return 3;
    }else if(val == "CISA"){
        return 4;
    }else if(val == "COAVE"){
        return 5;
    }else if(val == "CODIV"){
        return 41;
    }else if(val == "COPE"){
        return 6;
    }else if(val == "CORENSA"){
        return 7;
    }else if(val == "COREV"){
        return 8;
    }else if(val == "COTAN"){
        return 9;
    }else if(val == "COTOBUSA"){
        return 10;
    }else if(val == "COTXS"){
        return 39;
    }else if(val == "ESASA"){
        return 22;
    }else if(val == "MIHSA"){
        return 11;
    }else if(val == "RECSA"){
        return 12;
    }else if(val == "SIMES"){
        return 13;
    }else if(val == "SKYBUS"){
        return 14;
    }else if(val == "STMP"){
        return 15;
    }else if(val == "TCGSA"){
        return 16;
    }else if(val == "TREPSA"){
        return 17;
    }else if(val == "TUZOBUS"){
        return 19;
    }else if(val == "VYCSA"){
        return 18;
    }else if(val == "REFORMA"){
        return 40;
    }else if(val == "logo1"){
        return 0;
    }
}
//Inicio Recaudo
function iniciarRecaudo(){
    var id_usuario = localStorage.getItem("Usuario");
    var nombre_usuario = localStorage.getItem("nombre");
    var fecha_llegada =  getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = "Recaudo";
    var estatus = 0;
    var geolocation = '';
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = 'Recaudo';
    productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
            "Select MAX(id_cedula) as Id from cedulas_general",
            [],
            function (tx, results) {
                var item = results.rows.item(0);
                localStorage.setItem("IdCedula", item.Id);
                var id_cedula = item.Id;
                productHandler.addDatosGenerales_Recaudo(id_cedula, fecha_llegada, id_usuario, id_cliente);
                app.views.main.router.navigate({ name: 'yallegueRecaudo'});
            },
            function (tx, error) {
                console.log("Error al guardar cedula: " + error.message);
            }
            );
        },
        function (error) {},
        function () {}
    );
}
function recaudarUnidad(){
    if($("#id_unidad").val()){
        var id_cedula = localStorage.getItem("IdCedula");
        var eco = $("#autocomplete-dropdown-ajax").val();
        var fecha = getDateWhitZeros();
        var id_unidad = $("#id_unidad").val();
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                "Select id_cedula from detalle_recaudo Where id_cedula = ? AND eco = ?",
                [id_cedula, eco],
                function (tx, results) {
                    var item = results.rows.item(0);
                    if(item.id_cedula){
                        swal({
                            title: "Aviso",
                            text: "Esta unidad ya se encuentra en este recaudo. ¿Quieres hacer otro recaudo de la unidad?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((RESP) => {
                            if (RESP == true) {
                                productHandler.addDetalle_Recaudo(id_cedula, id_unidad, eco, fecha, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                        "Select MAX(id_detalle) as Id from detalle_recaudo Where id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var item = results.rows.item(0);
                                            localStorage.setItem("IdDetalle", item.Id);
                                            app.views.main.router.back('/formRecaudo1/', {force: true, ignoreCache: true, reload: true});
                                        },
                                        function (tx, error) {
                                            console.log("Error al guardar cedula: 1" + error.message);
                                        }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            }
                        });
                    }
                },
                function (tx, error) {console.log("Error al guardar cedula: 2" + error.message);}
                );
            },
            function (error) {
                productHandler.addDetalle_Recaudo(id_cedula, id_unidad, eco, fecha, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                        "Select MAX(id_detalle) as Id from detalle_recaudo Where id_cedula = ?",
                        [id_cedula],
                        function (tx, results) {
                            var item = results.rows.item(0);
                            localStorage.setItem("IdDetalle", item.Id);
                            app.views.main.router.back('/formRecaudo1/', {force: true, ignoreCache: true, reload: true});
                        },
                        function (tx, error) {
                            console.log("Error al guardar cedula: 1" + error.message);
                        }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            },
            function (error) {console.log("Error al guardar cedula: 4" + error.message);}
        );
    }else {
        swal("","No haz seleccionado una unidad","warning");
    }
}
function FinalizarRecaudo(){
    if($("#recaudo_momento").val()){
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer finalizar el recaudo?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                var bolsa1 = $("#fin_recaudo").data("bolsa1"); //cuantas bolsa de $1
                var bolsa2 = $("#fin_recaudo").data("bolsa2"); //cuantas bolsa de $2
                var bolsa5 = $("#fin_recaudo").data("bolsa5"); //cuantas bolsa de $5
                var bolsa10 = $("#fin_recaudo").data("bolsa10"); //cuantas bolsa de $10
                var bolsa50c = $("#fin_recaudo").data("bolsa50c"); //cuantas bolsa de $50c
                var bolsas_totales = $("#fin_recaudo").data("bolsas_totales"); //cuantas bolsas totales
                
                var monto1 = $("#fin_recaudo").data("monto1"); //suma sin cacharpa
                var total_unidades = $("#fin_recaudo").data("total_unidades");//
                var unidades_recaudads = $("#fin_recaudo").data("unidades_recaudads"); //

                var pico1 = $("#fin_recaudo").data("pico1");  //pico de monedas de $1
                var pico2 = $("#fin_recaudo").data("pico2");  //pico de monedas de $2
                var pico5 = $("#fin_recaudo").data("pico5");  //pico de monedas de $5
                var pico10 = $("#fin_recaudo").data("pico10");  //pico de monedas de $10
                var pico50c = $("#fin_recaudo").data("pico50c");  //pico de monedas de $50c

                var promedio = $("#fin_recaudo").data("promedio"); //promedio de recaudo
                var recaudo_sin_billetes = $("#fin_recaudo").data("recaudo_sin_billetes"); //total sin billetes
                var recaudo_total = $("#fin_recaudo").data("recaudo_total"); // recaudo total + total cacharpa si hay
                var total_billetes = $("#fin_recaudo").data("total_billetes"); //suma de los billetes

                var id_cedula = localStorage.getItem("IdCedula");

                databaseHandler.db.transaction(
                    function(tx){
                        tx.executeSql("UPDATE datos_generales_recaudo SET bolsa1 = ?, bolsa2 = ?, bolsa5 = ?, bolsa10 = ?, bolsa50c = ?, bolsas_totales = ?, monto1 = ?, total_unidades = ?, unidades_recaudads = ?, pico1 = ?, pico2 = ?, pico5 = ?, pico10 = ?, pico50c = ?, promedio = ?, recaudo_sin_billetes = ?, recaudo_total = ?, total_billetes = ? WHERE id_cedula = ?",
                            [bolsa1,bolsa2,bolsa5,bolsa10,bolsa50c,bolsas_totales,monto1,total_unidades,unidades_recaudads,pico1,pico2,pico5,pico10,pico50c,promedio,recaudo_sin_billetes,recaudo_total,total_billetes,id_cedula],
                            function(tx, results){
                                app.views.main.router.back('/formRecaudo2/', {force: true, ignoreCache: true, reload: true});
                            },
                            function(tx, error){
                                console.error("Error al guardar cierre: " + error.message);
                            }
                        );
                    },
                    function(error){},
                    function(){}
                );
            }
        });
    } else {
        swal("", "Aún no haz recaudado para poder finalizar", "warning");
    }
}
function editarUnidadRecaudo(id){
    localStorage.setItem("IdDetalle", id);
    app.views.main.router.back('/formRecaudo1/', {force: true, ignoreCache: true, reload: true});
}

function editarMonedaRecaudo(id_detalle, monedabd){
    modalCantidad(monedabd)
}
function modalCantidad(val){
    var ruta = '';
    var clase= '';
    var texto = '';
    var valor = 0;
    if(val == 0){
        ruta = 'img/currency/50c.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = .5;
    } else if(val == 1){
        ruta = 'img/currency/1.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 1;
    } else if(val == 2){
        ruta = 'img/currency/2.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 2;
    } else if(val == 5){
        ruta = 'img/currency/5.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 5;
    } else if(val == 10){
        ruta = 'img/currency/10.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 10;
    } else if(val == 20){
        ruta = 'img/currency/20.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 20;
    } else if(val == 50){
        ruta = 'img/currency/50.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 50;
    } else if(val == 100){
        ruta = 'img/currency/100.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 100;
    } else if(val == 200){
        ruta = 'img/currency/200.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 200;
    } else if(val == 500){
        ruta = 'img/currency/500.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 500;
    } 
    var popEvidencia = app.popup.create({
        content: `
        <div class="sheet-modal my-sheet" id="sheet-modal" name="sheet" style="height: 90%;">
        <div class="toolbar">
            <div class="toolbar-inner">
                <div class="left"></div>
                <div class="right"><a class="link" id="close_sheet" href="#">Cerrar</a></div>
            </div>
        </div>
        <div class="sheet-modal-inner" style="overflow-y: scroll;">
            <div class="block">
                <div class="FWM-photo-container">
                    <a>
                        <img src="`+ruta+`" alt="" class="`+clase+`">
                    </a>
                </div>

                <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                    <span class="span FWM-span-form" style="color: #005D99;">Ingresa la cantidad de pzas.</span>
                    <input type="text" class="FWM-input" id="recuento" readonly>
                    <input type="hidden" id="valor" value="`+valor+`">
                    <input type="hidden" id="importe2">
                    <span class="span FWM-span-form" style="color: #FF0037;" id="importe">0 `+texto+` es = $0.00</span>
                    
                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(1)">1</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(2)">2</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(3)">3</button>
                        </div>
                    </div>

                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(4)">4</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(5)">5</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(6)">6</button>
                        </div>
                    </div>

                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(7)">7</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(8)">8</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(9)">9</button>
                        </div>
                    </div>

                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora('borra')"><i class="material-icons md-light" style="color: #FF0037;vertical-align: middle;font-size: 30px;">backspace</i></button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(0)">0</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora"  onclick="calculadora('termina')"><i class="material-icons md-light" style="color: #2ECC71;vertical-align: middle;font-size: 30px;">check_circle</i></button>
                        </div>
                    </div>

                    <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                        <div class="row align-items-stretch" style="text-align: center;">
                            <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                <span class="resize-handler"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    swipeToClose:false,
    closeByOutsideClick:false,
    closeByBackdropClick:false,
    closeOnEscape:false,
            on: {
                open: function (popup) {
                    $('#close_sheet').click(function () {
                        if($('#pasa').val()!=0){
                            app.sheet.close('#sheet-modal');
                        }else{
                            swal({
                                title: "Aviso",
                                text: "Aún no seleccionas o guardas una opción, ¿Estas seguro que deseas regresar?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack){
                                    var otherCheck = "radio"+ id + "-2";
                                    document.getElementById(otherCheck).checked = false;
                                    var Check = "radio"+ id + "-1";
                                    document.getElementById(Check).checked = true;
                                    var labels1 = Check.replace('radio','label');
                                    var labels2 = otherCheck.replace('radio','label');
                                    $("#"+labels1).addClass("checked");
                                    $("#"+labels2).removeClass("checked");
                                    actualizacheck(Check);
                                    app.sheet.close('#sheet-modal');
                                }
                            });
                        }
                    });
                },
            }
    });
   
    popEvidencia.open();
}
function finRecaudoUnidad(){
    if($("#id_unidad").val()){
        var eco = $("#autocomplete-dropdown-ajax").val();
        var id_detalle = localStorage.getItem("IdDetalle");
        var id_cedula = localStorage.getItem("IdCedula");
        var id_unidad = $("#id_unidad").val();
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT id_cedula FROM detalle_recaudo WHERE id_cedula = ? AND eco = ? ",
                    [id_cedula, eco],
                    function(tx5, results){
                        var length = results.rows.length;
                        if(length > 0){
                            swal({
                                title: "Aviso",
                                text: "Ya existe una unidad recaudada con este eco, ¿Deseas aún así hacer el cambio?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack){
                                    databaseHandler.db.transaction(
                                        function(tx){
                                            tx.executeSql("UPDATE detalle_recaudo SET eco = ?, id_unidad = ? WHERE id_cedula = ? AND id_detalle = ?",
                                                [eco,id_unidad,id_cedula,id_detalle],
                                                function(tx, results){
                                                    swal("","Unidad actualizada correctamente", "success");
                                                    app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});                
                                                },
                                                function(tx, error){
                                                    console.error("Error al guardar cierre: " + error.message);
                                                }
                                            );
                                        },
                                        function(error){},
                                        function(){}
                                    );
                                }
                            });
                        } else {
                            databaseHandler.db.transaction(
                                function(tx){
                                    tx.executeSql("UPDATE detalle_recaudo SET eco = ?, id_unidad = ? WHERE id_cedula = ? AND id_detalle = ?",
                                        [eco,id_unidad,id_cedula,id_detalle],
                                        function(tx, results){
                                            swal("","Unidad actualizada correctamente", "success");
                                            app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});                
                                        },
                                        function(tx, error){
                                            console.error("Error al guardar cierre: " + error.message);
                                        }
                                    );
                                },
                                function(error){},
                                function(){}
                            );
                        }
                    },
                    function(tx5, error){
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );  
            },
        function(error){},
        function(){}
        );

        
    } else {
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    }
}

function regresaRecaudo(val){
    if(val == 1){
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    } else if(val == 2){
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    }
}

function calculadora(valor){
    var cuenta = $("#recuento").val();
    if(valor == 'borra'){
        cuenta = cuenta.substring(0, cuenta.length - 1);
    } else if(valor == 'termina'){
        if($("#recuento").val()){
            guardarMoneda($("#recuento").val(),$("#importe2").val(),$("#valor").val());
        }else{
            swal({
                title: "Aún no haz ingresado la cantidad de piezas",
                text: 'Si quieres reiniciar la cantidad en 0 da en "ok" de lo contrario en "cancelar"',
                icon: "warning",
                buttons: true,
                dangerMode: false,
            }).then((willGoBack) => {
                if (willGoBack){
                    guardarMoneda(0,0,$("#valor").val());
                }
            });
        }
    } else if(valor == 0){
        if ($("#recuento").val()){
            cuenta = cuenta + valor; 
        }
    } else {
        cuenta = cuenta + valor; 
    }
    $("#recuento").val(cuenta);
    var moneda = parseFloat($("#valor").val());
    var importe = parseFloat(cuenta)* moneda;
    if(!isNaN(importe)){
        if($("#valor").val() == '0.5' || $("#valor").val() == '1' || $("#valor").val() == '2' || $("#valor").val() == '5' || $("#valor").val() == '10'){
            $("#importe").html(numberWithCommas(cuenta) +" monedas es = $"+numberWithCommas(importe));
            $("#importe2").val(importe);
        } else if($("#valor").val() == '20' || $("#valor").val() == '50' || $("#valor").val() == '100' || $("#valor").val() == '200' || $("#valor").val() == '500'){
            $("#importe").html(numberWithCommas(cuenta) +" billetes es = $"+numberWithCommas(importe));
            $("#importe2").val(importe);
        }
    }else{
        if($("#valor").val() == '.5' || $("#valor").val() == '1' || $("#valor").val() == '2' || $("#valor").val() == '5' || $("#valor").val() == '10'){
            $("#importe").html(0 +" monedas es = $0.00");
            $("#importe2").val(0);
        } else if($("#valor").val() == '20' || $("#valor").val() == '50' || $("#valor").val() == '100' || $("#valor").val() == '200' || $("#valor").val() == '500'){
            $("#importe").html(0 +" billetes es = $0.00");
            $("#importe2").val(0);
        }
    }
}

function guardarMoneda(piezas, importe, moneda){
    var id_detalle = localStorage.getItem("IdDetalle");
    var id_cedula = localStorage.getItem("IdCedula");
    if(moneda == "0.5"){
        var modedabd  = 'Moneda50c';
        var importebd = 'importe50c';
        var newMoneda = 1;
    }else{
        var modedabd = 'Moneda'+moneda;
        var importebd = 'importe'+moneda;
        if(moneda == 1){
            var newMoneda = 2;
        } else if(moneda == 2){
            var newMoneda = 5;
        } else if(moneda == 5){
            var newMoneda = 10;
        } else if(moneda == 10){
            var newMoneda = 20;
        } else if(moneda == 20){
            var newMoneda = 50;
        } else if(moneda == 50){
            var newMoneda = 100;
        } else if(moneda == 100){
            var newMoneda = 200;
        } else if(moneda == 200){
            var newMoneda = 500;
        } else {
            var newMoneda = '';
        }
    }

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE detalle_recaudo SET "+modedabd+" = ?, "+importebd+" = ? WHERE id_cedula = ? AND id_detalle = ?",
                [piezas,importe,id_cedula,id_detalle],
                function(tx, results){
                    app.sheet.close('#sheet-modal');
                    // swal("","Guardado correctamente.","success");
                    setTimeout(function() {
                        // swal.close();
                        // if(newMoneda){
                             modalCantidad(newMoneda);
                        // }
                    }, 400)
                    $("#tb_recaudo").empty();
                    databaseHandler.db.transaction(
                        function(tx5){
                            tx5.executeSql("SELECT * FROM detalle_recaudo WHERE id_detalle = ? AND id_cedula = ?",
                                [id_detalle, id_cedula],
                                function(tx5, results){
                                    var length = results.rows.length;
                                    if(length == 0){
                                        $("#message-nr").css("display", "block");
                                    }else{
                                        $("#message-nr").css("display", "none");
                                        for(var i = 0; i< length; i++){
                                            var item2 = results.rows.item(i);
                                            $("#tb_recaudo").append("<tr><td>$0.5</td><td>"+item2.Moneda50c+"</td><td>$"+numberWithCommas(item2.importe50c)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",0);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$1</td><td>"+item2.Moneda1+"</td><td>$"+numberWithCommas(item2.importe1)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",1);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$2</td><td>"+item2.Moneda2+"</td><td>$"+numberWithCommas(item2.importe2)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",2);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$5</td><td>"+item2.Moneda5+"</td><td>$"+numberWithCommas(item2.importe5)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",5);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$10</td><td>"+item2.Moneda10+"</td><td>$"+numberWithCommas(item2.importe10)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",10);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$20</td><td>"+item2.Moneda20+"</td><td>$"+numberWithCommas(item2.importe20)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",20);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$50</td><td>"+item2.Moneda50+"</td><td>$"+numberWithCommas(item2.importe50)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",50);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$100</td><td>"+item2.Moneda100+"</td><td>$"+numberWithCommas(item2.importe100)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",100);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$200</td><td>"+item2.Moneda200+"</td><td>$"+numberWithCommas(item2.importe200)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",200);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$500</td><td>"+item2.Moneda500+"</td><td>$"+numberWithCommas(item2.importe500)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",500);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");

                                            var piezastotales = parseInt(item2.Moneda50c)+parseInt(item2.Moneda1)+parseInt(item2.Moneda2)+parseInt(item2.Moneda5)+parseInt(item2.Moneda10)+parseInt(item2.Moneda20)+parseInt(item2.Moneda50)+parseInt(item2.Moneda100)+parseInt(item2.Moneda200)+parseInt(item2.Moneda500);
                                            var importetotal = parseFloat(item2.importe50c)+parseFloat(item2.importe1)+parseFloat(item2.importe2)+parseFloat(item2.importe5)+parseFloat(item2.importe10)+parseFloat(item2.importe20)+parseFloat(item2.importe50)+parseFloat(item2.importe100)+parseFloat(item2.importe200)+parseFloat(item2.importe500);
                                            $(".title").html("Recaudo | "+item2.eco+" - $"+numberWithCommas(importetotal));
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("UPDATE detalle_recaudo SET piezas_totales = ?, importe_total = ? WHERE id_cedula = ? AND id_detalle = ?",
                                                        [piezastotales,importetotal,id_cedula,id_detalle],
                                                        function(tx, results){
                                                            $("#tb_recaudo").append("<tr style='text-align: center;background-color: #005D99;color: white;''><td>Totales</td><td>"+numberWithCommas(piezastotales)+"</td><td>$"+numberWithCommas(importetotal)+"</td><td>&nbsp;</td></tr>");
                                                        },
                                                        function(tx, error){
                                                            console.error("Error al guardar cierre: " + error.message);
                                                        }
                                                    );
                                                },
                                                function(error){},
                                                function(){}
                                            );
                                        }
                                    }
                                },
                                function(tx5, error){
                                    console.error("Error al consultar bandeja de salida: " + error.message);
                                }
                            );  
                        },
                    function(error){},
                    function(){}
                    );
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}
function validarRadio(id){
    var ids = id.split("-");
    var apartado = ids[1];
    var check = ids[2];
    var valCheck = document.getElementById(ids[0]+"-"+ids[1]+"-"+ids[2]).checked;
    if(check.includes('1')){
        if(valCheck ==true){
            var otherCheck = ids[0] + "-"+ids[1]+"-2";
            document.getElementById(otherCheck).checked = false;
            $("#div_"+apartado).css("display","block");
            if(apartado == 'monto'){
                $("#div_folio2").css("display","flex");
            }
        }
    }else{
        if(valCheck ==true){
            var otherCheck = ids[0] + "-"+ids[1]+"-1";
            document.getElementById(otherCheck).checked = false;
            $("#div_"+apartado).css("display","none");
            if(apartado == 'monto'){
                $("#div_cacharpa").css("display","none");
                $("#div_folio2").css("display","none");
            }
        }
    }
}
function CalculaBolsa(bolsa){
    var bolsaCacharpa10 = $("#bolsaCacharpa10").val();
    var bolsaCacharpa20 = $("#bolsaCacharpa20").val();
    var bolsaCacharpa50 = $("#bolsaCacharpa50").val();

    var monto10c = parseInt(bolsaCacharpa10*500)
    var monto20c = parseInt(bolsaCacharpa20*500)
    var monto50c = parseInt(bolsaCacharpa50*1000)

    var cuenta = monto10c + monto20c + monto50c;

    $("#Acumulado1").val(cuenta);
    $("#Acumulado1_text").html(`Acumulado: $${numberWithCommas(cuenta.toFixed(2))}`);

    if(bolsa == 50){
        $("#max_bolsa50c").val(parseInt($("#bolsas_50co").val())+parseInt($("#bolsaCacharpa50").val()));
    }
}
function ingresarBolsasMonto(){
    if(parseInt($("#monto").val()) > parseInt($("#recaudo_sin_billetes").val())){
        swal("","El monto no puede ser mayor a lo recaudado.","warning");
        $("#monto").val("");
        $("#Acumulado3_text").text("Monto: $0.00");
        $("#div_cacharpa").css("display", "none");
    } else{
        $("#div_cacharpa").css("display", "block");
    }
}
function CalculaBolsa2(bolsa){
    $("#monto").prop("disabled", true);
    $("#monto").css("background-color", "#F4F4F4");
    var bolsas50c = $("#step_moneda0").val();
    var bolsas1 = $("#step_moneda1").val();
    var bolsas2 = $("#step_moneda2").val();
    var bolsas5 = $("#step_moneda5").val();
    var bolsas10 = $("#step_moneda10").val();

    var monto0 = parseInt(bolsas50c*1000);
    var monto1 = parseInt(bolsas1*2000);
    var monto2 = parseInt(bolsas2*4000);
    var monto5 = parseInt(bolsas5*6000);
    var monto10 = parseInt(bolsas10*5000);

    var Acumulado2 = monto0+monto1+monto2+monto5+monto10;
    
    if(Acumulado2 > $("#monto").val()){
        swal("","Agregando esta bolsa el monto acumulado sería mayor.","warning");
        if(bolsa == 0){
            var stepper = app.stepper.get('#steper0');
            stepper.decrement();
        } else if(bolsa == 1){
            $("#step_moneda1").val($("#step_moneda1").val()-1);
            var stepper = app.stepper.get('#steper1');
            stepper.decrement();
        } else if(bolsa == 2){
            $("#step_moneda2").val($("#step_moneda2").val()-1);
            var stepper = app.stepper.get('#steper2');
            stepper.decrement();
        } else if(bolsa == 5){
            $("#step_moneda5").val($("#step_moneda5").val()-1);
            var stepper = app.stepper.get('#steper5');
            stepper.decrement();
        } else if(bolsa == 10){
            $("#step_moneda10").val($("#step_moneda10").val()-1);
            var stepper = app.stepper.get('#steper10');
            stepper.decrement();
        }
        return false;
    }
    if(bolsa == 0){
        var stepper = app.stepper.get('#steper0');
        if(parseInt($("#step_moneda0").val()) > parseInt($("#max_bolsa50c").val())){
            swal("","No tienes bolsas suficientes de esta denominación, para continar la acción intenta con otra bolsa","warning");
            stepper.decrement();
            return false;
        }
    } else if(bolsa == 1 || bolsa == 2 || bolsa == 5 || bolsa == 10){
        var stepper = app.stepper.get('#steper'+bolsa);
        if(parseInt($("#step_moneda"+bolsa).val()) > parseInt($("#max_bolsa"+bolsa).val())){
            swal("","No tienes bolsas suficientes de esta denominación, para continar la acción intenta con otra bolsa","warning");
            stepper.decrement();
            return false;
        }
    }
    $("#Acumulado2_text").html(`Acumulado: $${numberWithCommas(Acumulado2.toFixed(2))}`);
    $("#Acumulado2").val(Acumulado2);
}
function finRecaudo(){
    var id_cedula = localStorage.getItem("IdCedula");
    if($("#radio-bolsas-2").prop("checked")){
        var opc_cacharpa = '0';
        var bolsaCacharpa10 = 0  //cuantas bolsas se van a mandar de $10C
        var bolsaCacharpa20 = 0  //cuantas bolsas se van a mandar de $20C
        var bolsaCacharpa50 = 0  //cuantas bolsas se van a mandar de $50C
        var total_cacharpa = 0 //suma de cacharpa monto adicional
    }else{
        var opc_cacharpa = '1';
        var bolsaCacharpa10 = $("#bolsaCacharpa10").val();
        var bolsaCacharpa20 = $("#bolsaCacharpa20").val();
        var bolsaCacharpa50 = $("#bolsaCacharpa50").val();

        var total_cacharpa = parseInt(bolsaCacharpa10)+parseInt(bolsaCacharpa20)+parseInt(bolsaCacharpa50)
    }

    if(!$("#folio").val()){
        swal("","Favor de indicar el folio de traslado.","warning");
        return false;
    }else{
        var folio = $("#folio").val();
    }

    if($("#radio-monto-2").prop("checked")){
        var opc_adicional = '0';
        var monto_adicional = 0;
        var bolsaAdd50c = 0;
        var bolsaAdd1 = 0;
        var bolsaAdd2 = 0;
        var bolsaAdd5 = 0;
        var bolsaAdd10 = 0;
        var folio2 = "";
    }else{
        var opc_adicional = '1';
        if($("#monto").val() == $("#Acumulado2").val()){
            if(!$("#folio2").val()){
                swal("","Favor de indicar el folio 2 de traslado.","warning");
                return false;
            }else{
                var folio2 = $("#folio2").val();        
            }
        }else{
            swal("","El monto adicional y el acumulado no coinciden.","warning");
            return false;
        }
        var monto_adicional = $("#monto").val();
        var bolsaAdd50c = $("#step_moneda0").val();
        var bolsaAdd1 = $("#step_moneda1").val();
        var bolsaAdd2 = $("#step_moneda2").val();
        var bolsaAdd5 = $("#step_moneda5").val();
        var bolsaAdd10 = $("#step_moneda10").val();
    }

    var plomo = $("#CountPlomos").val();
    for(var i = 1; i<= plomo; i++){
        if(i == 1){
            if(!$("#plomo").val()){
                swal("","Favor de indicar el plomo 1.","warning");
                return false;
            }
        } else {
            if(!$("#plomo"+i).val()){
                swal("","Favor de indicar el plomo "+i+".","warning");
                return false;
            }
        }
    }

    if($("#total_billetes").val() == 0){}else{
        if(!$("#plomo").val()){
            swal("","Debes indicar al menos un plomo.","warning");
            return false;
        }
    }

    var plomo1 = $("#plomo").val();
    var plomo2 = $("#plomo2").val();
    var plomo3 = $("#plomo3").val();
    var plomo4 = $("#plomo4").val();
    var plomo5 = $("#plomo5").val();

    if(!$("#obs_recaudo").val()){
        var observaciones = "Sin comentarios";
    }else {
        var observaciones = $("#obs_recaudo").val();
    }
    var importe_cacharpa = $("#Acumulado1").val();

    var recaudo_sin_billetes = $("#recaudo_sin_billetes").val();
    var monto1 = parseInt(recaudo_sin_billetes)+parseInt(importe_cacharpa);

    var peso_cacharpa = $("#peso_cacharpa").val();

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datos_generales_recaudo SET opc_cacharpa = ?, monto1 = ?, bolsaCacharpa10 = ?, bolsaCacharpa20 = ?, bolsaCacharpa50 = ?, total_cacharpa = ?, opc_adicional = ?, monto_adicional = ?, bolsaAdd50c = ?, bolsaAdd1 = ?, bolsaAdd2 = ?, bolsaAdd5 = ?, bolsaAdd10 = ?, folio2 = ?, folio = ?, plomo = ?, plomo2 = ?, plomo3 = ?, plomo4 = ?, plomo5 = ?, observaciones = ?, importe_cacharpa = ?, peso_cacharpa = ? WHERE id_cedula = ?",
                [opc_cacharpa, monto1, bolsaCacharpa10, bolsaCacharpa20, bolsaCacharpa50, total_cacharpa, opc_adicional, monto_adicional, bolsaAdd50c, bolsaAdd1, bolsaAdd2, bolsaAdd5, bolsaAdd10, folio2, folio, plomo1,plomo2, plomo3, plomo4, plomo5, observaciones, importe_cacharpa, peso_cacharpa, id_cedula],
                function(tx, results){
                    swal("","Guardado correctamente.","success");
                    EnviarRecaudo();
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}
function EnviarRecaudo(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar el Recaudo del día?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_cedula = localStorage.getItem("IdCedula");
            var fecha = new Date();
            var fecha_salida = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
            var estatus = 1;
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                        [fecha_salida,estatus,id_cedula],
                        function(tx, results){
                            window.location.href = "./menu.html";
                        },
                        function(tx, error){
                            swal("Error al guardar",error.message,"error");
                        }
                    );
                },
                function(error){},
                function(){}
            );              
        }
    });
}
function showPlomos(){
    var plomo = $("#CountPlomos").val();
    for(var i = 1; i<= plomo; i++){
        $("#div_plomo"+i).css("display", "flex");
    }

    for(var i = 5; i > plomo; i--){
        $("#div_plomo"+i).css("display", "none");
    }
}
function ver_preliminar(id){
    localStorage.setItem("IdCedula", id);
    app.views.main.router.back('/formRecaudo3/', {force: true, ignoreCache: true, reload: true});
}
function preingresoRecaudo(){
    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");
    var id_empresa = localStorage.getItem("empresa");
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "Select id_cedula from datos_generales_recaudo where DATE(fecha) = ? AND id_empresa = ?",
            [hoy[0], id_empresa],
            function (tx, results) {
                var length = results.rows.length;
                if(length == 0){
                    swal({
                        title: "Aviso",
                        text: "¿Estas seguro de querer empezar un nuevo registro para recaudar?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            iniciarRecaudo();
                        }
                    });
                } else {
                    swal({
                        title: "Aviso",
                        text: "¿Ya se ha realizado un recaudo con la fecha de hoy, deseas generar un recaudo nuevo?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            iniciarRecaudo();
                        }
                    });
                }
            },
            function (tx, error) {}
          );
        },
        function (error) {},
        function () {}
    );
}
function actualiza_fecha(){
    if($("#fecha").val()){
        var fecha_s = $("#fecha").val().split("-");
        var fecha = $("#fecha").val()+" "+$("#hora").val();
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("UPDATE datos_generales_recaudo SET fecha = ? WHERE id_cedula = ?",
                    [fecha, id_cedula],
                    function(tx5, results){
                        swal("", "Fecha actualizada.","success");
                        var MyDateString = fecha_s[2]+"-"+fecha_s[1]+"-"+fecha_s[0];
                        $(".title").html("Recaudo | "+MyDateString);
                        databaseHandler.db.transaction(
                            function(tx5){
                                tx5.executeSql("UPDATE cedulas_general SET fecha_entrada = ? WHERE id_cedula = ?",
                                    [fecha, id_cedula],
                                    function(tx5, results){},
                                    function(tx5, error){}
                                );  
                            },
                            function(error){},
                            function(){}
                        );
                    },
                    function(tx5, error){
                        console.error("Error update: " + error.message);
                    }
                );  
            },
            function(error){},
            function(){}
        );
    } else {
        swal("", "Debes elegir una fecha válida", "warning");
    }
}

function RevisaHeaders_recaudo(){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Recaudo_'+empresa;

    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");

    var encontro = false;
    var empresa = '';

    app.request.get(cordova.file.dataDirectory + "jsons_recaudo/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                guardaHeaderRecaudo(content2[x].fecha,content2[x].id_cedula,content2[x].id_dato, content2[x].id_usuario, content2[x].id_empresa, content2[x].observaciones, content2[x].folio, content2[x].folio2, content2[x].recaudo_total, content2[x].recaudo_sin_billetes, content2[x].total_billetes, content2[x].total_cacharpa, content2[x].bolsas_totales, content2[x].plomo, content2[x].monto1, content2[x].total_unidades, content2[x].unidades_recaudads, content2[x].promedio, content2[x].bolsa50c, content2[x].bolsa1, content2[x].bolsa2, content2[x].bolsa5, content2[x].bolsa10, content2[x].pico50c, content2[x].pico1, content2[x].pico2, content2[x].pico5, content2[x].pico10, content2[x].opc_cacharpa, content2[x].opc_adicional, content2[x].bolsaCacharpa10, content2[x].bolsaCacharpa20, content2[x].bolsaCacharpa50, content2[x].monto_adicional, content2[x].bolsaAdd50c, content2[x].bolsaAdd1, content2[x].bolsaAdd2, content2[x].bolsaAdd5, content2[x].bolsaAdd10, content2[x].importe_cacharpa, content2[x].estatus, content2[x].origen, content2[x].plomo2, content2[x].plomo3, content2[x].plomo4, content2[x].plomo5, content2[x].peso_cacharpa);
            }
        }
    });
}

function guardaHeaderRecaudo(fecha,id,id_dato,id_usuario,id_empresa,observaciones,folio,folio2,recaudo_total,recaudo_sin_billetes,total_billetes,total_cacharpa,bolsas_totales,plomo,monto1,total_unidades,unidades_recaudads,promedio,bolsa50c,bolsa1,bolsa2,bolsa5,bolsa10,pico50c,pico1,pico2,pico5,pico10,opc_cacharpa,opc_adicional,bolsaCacharpa10,bolsaCacharpa20,bolsaCacharpa50,monto_adicional,bolsaAdd50c,bolsaAdd1,bolsaAdd2,bolsaAdd5,bolsaAdd10,importe_cacharpa,estatus,origen,plomo2, plomo3, plomo4, plomo5, peso_cacharpa){
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM datos_generales_recaudo WHERE fecha = ? ",
                [fecha],
                function(tx5, results){
                    var length = results.rows.length;
                    if(length == 0){
                        var nombre_usuario = localStorage.getItem("nombre");
                        var id_cliente = localStorage.getItem("empresa");
                        var empresa = NombreEmpresa(id_cliente);
                        var estatus = 0;
                        var geolocation = '';
                        var tipo_cedula = 'Recaudo';
                        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha,geolocation,id_cliente,empresa,fecha,estatus,tipo_cedula);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    var item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    var id_cedula = item.Id;
                                    productHandler.addDesincorHeaderRecaudo(id_cedula, empresa, fecha, id_usuario, id_empresa, observaciones, folio, folio2, recaudo_total, recaudo_sin_billetes, total_billetes, total_cacharpa, bolsas_totales, plomo, monto1, total_unidades, unidades_recaudads, promedio, bolsa50c, bolsa1, bolsa2, bolsa5, bolsa10, pico50c, pico1, pico2, pico5, pico10, opc_cacharpa, opc_adicional, bolsaCacharpa10, bolsaCacharpa20, bolsaCacharpa50, monto_adicional, bolsaAdd50c, bolsaAdd1, bolsaAdd2, bolsaAdd5, bolsaAdd10, importe_cacharpa, plomo2, plomo3, plomo4, plomo5, peso_cacharpa, estatus, origen, id);
                                    PintaCedulas(0, "Recaudo");
                                    InsertaDetailsRecaudo(id_cedula, id);
                                },
                                function (tx, error) {}
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } 
                },
                function(tx5, error){
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );  
        },
      function(error){},
      function(){}
    );
}
function InsertaDetailsRecaudo(id_cedula, id_servidor){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Recaudo_desc_'+empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_recaudo/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                if(id_servidor == content2[x].id_cedula){
                    productHandler.addDetailsDesRecaudo(content2[x].id_detalle, id_cedula, content2[x].eco, content2[x].Moneda50c, content2[x].Moneda1, content2[x].Moneda2, content2[x].Moneda5, content2[x].Moneda10, content2[x].Moneda20, content2[x].Moneda50, content2[x].Moneda100, content2[x].Moneda200, content2[x].Moneda500, content2[x].importe50c, content2[x].importe1, content2[x].importe2, content2[x].importe5, content2[x].importe10, content2[x].importe20, content2[x].importe50, content2[x].importe100, content2[x].importe200, content2[x].importe500, content2[x].piezas_totales, content2[x].importe_total, content2[x].id_unidad);
                }
            }
        }
    });
}
//Fin Recaudo
//Inicio HMO
//Inicio Capacitacion 
function validarRadioCapa(id,val,valor, OpCorrecta){
    var ids = id.split("-");
    var check = ids[1];
    var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
    if(check.includes('1')){
        if(valCheck ==true){
            var checkcheck = ids[0] + "-1";
            var otherCheck = ids[0] + "-0";
            document.getElementById(otherCheck).checked = false;
            $("#label-"+checkcheck).addClass("checked");
            $("#label-"+otherCheck).removeClass("checked");
        }
    }else{
        if(valCheck ==true){
            var otherCheck = ids[0] + "-1";
            var checkcheck = ids[0] + "-0";
            document.getElementById(otherCheck).checked = false;
            $("#label-"+checkcheck).addClass("checked");
            $("#label-"+otherCheck).removeClass("checked");
        }
    }
    if(val){
        if(val==1){
            actualizaRespuestaCiertoFalso(id);
        } else if(val==2){
            actualizaRespuestaSiNoPuntuacion(id,valor, OpCorrecta);
        }
    }
}

function validarRadioCapaMultiple(id,val,FK_IDPregunta){
    $(".in_"+FK_IDPregunta).prop("checked", false)
    $(".rad_"+FK_IDPregunta).removeClass("checked");
    document.getElementById(id).checked = true;
    $("#label-"+id).addClass("checked");
    if(val){
        if(val==1){
            actualizaRespuestasMultiples(id, FK_IDPregunta);
        }
    }
}

function actualizaRespuestasMultiples(id, FK_IDPregunta){
    var id_cedula = localStorage.getItem("IdCedula");
    var respuestas = id.split("-");
    var respuesta = respuestas[1]
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE CAP_RespuestasMultiple SET Respuesta = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta,id_cedula,FK_IDPregunta],
                function(tx, results){
                    
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function actualizaRespuestaCiertoFalso(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
        var id_pregunta = ids[0].replace('op','');
        
    } else if(check.includes('0')){
        var respuesta = 0;
        var id_pregunta = ids[0].replace('op','');
    }
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE cursoCiertoFalso SET respuesta = ? WHERE id_cedula = ? AND IDPregunta = ?",
                [respuesta,id_cedula,id_pregunta],
                function(tx, results){
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function generaEvaluacion(val){
    console.log(val)
    if(val == 1){
        app.sheet.close('#sheet-modal-1');
        localStorage.setItem("SaltoCurso", 1);
        app.views.main.router.back('/formCapacita1/', {force: true, ignoreCache: true, reload: true})
    } else {
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha_llegada = getDateWhitZeros();
        var geolocation = localStorage.getItem("IDTipoCurso");
        var id_cliente = localStorage.getItem("empresa");
        var nombre_cliente = localStorage.getItem("nameBecario");
        var horario_programado = fecha_llegada;
        var estatus = 0;
        var tipo_cedula = 'Capacitación';
        var nombre_evalua = localStorage.getItem("NombreCurso");
        
        var fechas =fecha_llegada.split(" ");
        var fecha = fechas[0];
        var nombreInstructor = localStorage.getItem("nombre");
        var nombreCandidato = localStorage.getItem("nameBecario");
        var edad = 0;
        var telCelular = 0;
        var antecedentesManejo = "";
        var name_course = localStorage.getItem("NombreCurso");
        var id_instructor = localStorage.getItem("id_usuario");
        var id_candidato = localStorage.getItem("FK_Becario");
        var fecha_captura = getDateWhitZeros();
        var id_course = localStorage.getItem("IDCurso");
        var IDTipoCurso = localStorage.getItem("IDTipoCurso");
        var ID_AT = localStorage.getItem("ID_AT");
        var costo = localStorage.getItem("Costo");
        var Prueba = 0

        productHandler.addCedula(id_usuario,nombre_usuario,fecha_llegada,id_course,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula,nombre_evalua,geolocation);
        databaseHandler.db.transaction(
            function (tx) {
            tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    //app.dialog.progress('Generando CheckList','red');
                    var progress = 0;
                    var dialog = app.dialog.progress('Generando Curso', progress, 'red');
                    var empresa = localStorage.getItem("empresa");
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    if(IDTipoCurso == 1){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'CursoCiertoFalso'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasCiertoFalso(id_cedula,data[j].IDPregunta,data[j].Pregunta,data[j].texto1,data[j].texto2,id_course,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 2){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'CursoSiNoValor'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasSiNoValor(id_cedula,data[j].IDPregunta,data[j].Pregunta,id_course,data[j].OpCorrecta,data[j].Valor,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 3){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'PreguntasMultiple_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasMultiple(id_cedula,data[j].IDPregunta,data[j].Pregunta,id_course,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                        var NomJson2 = 'RespuestasMultiples_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson2+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].FK_IDCurso == id_course){                                        
                                        productHandler.insertOptionsMultiple(id_cedula,data[j].ID,data[j].FK_Pregunta,data[j].Opcion,data[j].Correcta,data[j].Image, id_course);
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 4){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'PreguntasMultiple_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasMultiple(id_cedula,data[j].IDPregunta,data[j].Pregunta,id_course,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                        var NomJson2 = 'RespuestasMultiples_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson2+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].FK_IDCurso == id_course){                                        
                                        productHandler.insertOptionsMultiple(id_cedula,data[j].ID,data[j].FK_Pregunta,data[j].Opcion,data[j].Correcta,data[j].Image, id_course);
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 5){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                    }
                },
                function (tx, error) {
                console.log("Error al guardar cedula: " + error.message);
                }
            );
            },
            function (error) {},
            function () {}
        );
    }
}

function guardarCursoCiertoFalso(){
    // if($("#observaciones").val() && $("#signate").val()){
    //     console.log("true")
    // } 
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1: apto = 0;

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                [apto,observaciones,firmaInstructor, id_cedula],
                function(tx, results){
                    swal({
                        title: "Aviso",
                        text: "¿Estas seguro de querer finalizar la prueba?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            var fecha_salida = getDateWhitZeros();
                            var estatus = 1;
                            databaseHandler.db.transaction(
                                function(tx){
                                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                        [fecha_salida,estatus,id_cedula],
                                        function(tx, results){
                                            window.location.href = "./menu.html";
                                        },
                                        function(tx, error){
                                            swal("Error al guardar",error.message,"error");
                                        }
                                    );
                                },
                                function(error){},
                                function(){}
                            );              
                        }
                    });
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function gfirma(val){
    var signaturePad = testFirma;
    var data = signaturePad.toDataURL('data:image/jpeg;base64,');
    screen.orientation.lock('portrait');
    // screen.orientation.unlock();
    $("#signate").val(data);
    $('#ImagenFirmaView').attr('src', data);
    $('#VolverFirmar').html("Evidencia");
    $("#VolverAFirmar").html("Volver a Firmar <i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;'>border_color</i>");
    if(val){
        var element = document.querySelector(".page-content");
        element.scrollTop = element.scrollHeight;
    }
}

function getPromedio(respuesta, length){
    var promedio = respuesta*100;
    promedio = promedio/length;
    return promedio.toFixed(2);
}

function generarAsistencia(){
    var fechas = getDateWhitZeros();
    var fecha = fechas.split(" ");
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT COUNT(id_cedula) as cuenta FROM asistenciaHeader WHERE fecha = ? ",
                [fecha[0]],
                function(tx5, results){
                    var item2 = results.rows.item(0);
                    var count = item2.cuenta;
                    if(count == 0){
                        var id_usuario = localStorage.getItem("Usuario");
                        var nombre_usuario = localStorage.getItem("nombre");
                        var fecha_llegada = getDateWhitZeros();
                        var geolocation = '0';
                        var id_cliente = localStorage.getItem("empresa");
                        var nombre_cliente = 'Lista Asistencia';
                        var horario_programado = fecha_llegada;
                        var estatus = 0;
                        var tipo_cedula = 'Capacitación';
                        var nombre_evalua = 'Lista de Asistencia';
                        var nombreInstructor = localStorage.getItem("nombre");;
                        var id_instructor = localStorage.getItem("id_usuario");
                        var fecha_captura = getDateWhitZeros();
                        var id_course = 0; //! dinamic
                        productHandler.addCedula(id_usuario,nombre_usuario,fecha_llegada,id_course,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula,nombre_evalua,geolocation);
                        databaseHandler.db.transaction(
                            function (tx) {
                            tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    var progress = 0;
                                    var dialog = app.dialog.progress('Generando Lista', progress, 'red');
                                    var empresa = localStorage.getItem("empresa");
                                    var item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    var id_cedula = item.Id;
                                    productHandler.asistenciaHeader(id_cedula, fecha[0], id_instructor, nombreInstructor, fecha_captura);
                                    var NomJson = 'BecariosVsInstructor_'+empresa;
                                    app.request({
                                        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                                        method: 'GET',
                                        dataType: 'json',
                                        success: function (data) {
                                            var aux = 0;
                                            var aux2 = 0;
                                            for (var j = 0; j < data.length; j++) {
                                                if(data[j].FKPersonalInstructor == id_instructor){
                                                    aux ++;
                                                }
                                            }
                                            if(aux == 0){
                                                app.dialog.close();
                                                swal("","Algo salió mal. No tienes Becarios Asignados.","error");
                                            }else{
                                                dialog.setText('1 de ' + aux);
                                                for (var j = 0; j < data.length; j++) {
                                                    if(data[j].FKPersonalInstructor == id_instructor){
                                                        aux2++;
                                                        // asistenciaDetails(id_cedula integer, fecha text, id_becario int,claveBecario, nameBecario, asiste int, fechaCaptura text)
                                                        productHandler.asistenciaDetails(id_cedula,fecha[0], data[j].ID, data[j].claveBecario, data[j].nameBecario, 0, fecha_captura, aux, aux2);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                },
                                function (tx, error) {
                                console.log("Error al guardar cedula: " + error.message);
                                }
                            );
                            },
                            function (error) {},
                            function () {}
                        );

                    } else {
                        swal("", "Ya existe una asistencia registrada", "warning")
                    }
                },
                function(tx5, error){ console.error("Error al consultar bandeja de salida: " + error.message); }
            );  
        },
    function(error){},
    function(){}
    );
}

function actualizaLista(id){
    var id_asistenciaD = id.replace('cb3-','');
    var assite = 0;
    $("#"+id).prop("checked") == true ? assite = 1 : assite = 0;
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE asistenciaDetails SET asiste = ? WHERE id_asistenciaD = ?",
                [assite,id_asistenciaD],
                function(tx, results){
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function guardarAsistencia(){
    var id_cedula = localStorage.getItem("IdCedula");

    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar la asistencia?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var fecha_salida = getDateWhitZeros();
            var estatus = 1;
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                        [fecha_salida,estatus,id_cedula],
                        function(tx, results){
                            window.location.href = "./menu.html";
                        },
                        function(tx, error){
                            swal("Error al guardar",error.message,"error");
                        }
                    );
                },
                function(error){},
                function(){}
            );              
        }
    });
}

function verSeguimientoCapacitacion(ID, FKPersonalBecario,nameBecario){
    var popEvidencia = app.popup.create({
        content: `
        <div class="sheet-modal my-sheet" id="sheet-modal" name="sheet">
        <div class="toolbar">
            <div class="toolbar-inner">
                <div class="left"></div>
                <div class="right"><a class="link" id="close_sheet" href="#">Cerrar</a></div>
            </div>
        </div>
        <div class="sheet-modal-inner" style="overflow-y: scroll;">
            <div class="block">
                <div class="card-content">
                    <div class="card" style="text-align: center;">
                        <a href="#" onclick="LLamarCursos(${ID}, ${FKPersonalBecario}, '${nameBecario}');">
                            <p class="texto_master" style="margin: 20px 0 20px 0;">CURSOS</p>
                        </a>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card" style="text-align: center;">
                        <a href="#" onclick="LLamarIMTES(${ID}, ${FKPersonalBecario}, '${nameBecario}');">
                            <p class="texto_master" style="margin: 20px 0 20px 0;">IMTES</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    swipeToClose:false,
    closeByOutsideClick:false,
    closeByBackdropClick:false,
    closeOnEscape:false,
            on: {
                open: function (popup) {
                    $('#close_sheet').click(function () {
                        app.sheet.close('#sheet-modal');
                    });
                },
            }
    });
    popEvidencia.open();
}

function LLamarCursos(ID, FKPersonalBecario,nameBecario){
    app.sheet.close('#sheet-modal');
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'BecariosCursos_'+empresa;
    var html = '';
    localStorage.setItem("nameBecario", nameBecario)
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if(length == 0){
            } else {
                for (var j = 0; j < data.length; j++) {
                    if(data[j].FK_Becario == FKPersonalBecario){
                        if(data[j].Certificadora == 0){
                            html += `<div class="card-content">
                                <div class="card" style="text-align: center;">
                                    <a href="#" onclick="GenerarCurso(${ID}, ${FKPersonalBecario}, ${data[j].ID}, ${data[j].FK_TipoCurso}, ${data[j].Diario}, '${data[j].NombreCurso}','${data[j].realizado}','${data[j].Costo}');">
                                        <p class="texto_master" style="margin: 20px 0 20px 0;">${data[j].NombreCurso}</p>
                                    </a>
                                </div>
                            </div>`;
                        }
                    }
                }
                // $("#tbody_becarios").html(html);
                var popEvidencia = app.popup.create({
                    content: `
                    <div class="sheet-modal my-sheet" id="sheet-modal-1" name="sheet">
                    <div class="toolbar">
                        <div class="toolbar-inner">
                            <div class="left"></div>
                            <div class="right"><a class="link" id="close_sheet-1" href="#">Cerrar</a></div>
                        </div>
                    </div>
                    <div class="sheet-modal-inner" style="overflow-y: scroll;">
                        <div class="block">
                           ${html}
                        </div>
                        <div style="margin-bottom: 100px;"></div>
                    </div>
                </div>`,
                swipeToClose:false,
                closeByOutsideClick:false,
                closeByBackdropClick:false,
                closeOnEscape:false,
                        on: {
                            open: function (popup) {
                                $('#close_sheet-1').click(function () {
                                    app.sheet.close('#sheet-modal-1');
                                });
                            },
                        }
                });
                popEvidencia.open();
            }
        }
    });
}

function LLamarIMTES(ID, FKPersonalBecario, nameBecario){
    app.sheet.close('#sheet-modal');
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'BecariosCursos_'+empresa;
    var html = '';
    localStorage.setItem("nameBecario", nameBecario)
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if(length == 0){
            } else {
                for (var j = 0; j < data.length; j++) {
                    if(data[j].FK_Becario == FKPersonalBecario){
                        if(data[j].Certificadora == 1){
                            html += `<div class="card-content">
                                <div class="card" style="text-align: center;">
                                    <a href="#" onclick="GenerarCurso(${ID}, ${FKPersonalBecario}, ${data[j].ID}, ${data[j].FK_TipoCurso}, ${data[j].Diario}, '${data[j].NombreCurso}','${data[j].realizado}','${data[j].Costo}');">
                                        <p class="texto_master" style="margin: 20px 0 20px 0;">${data[j].NombreCurso}</p>
                                    </a>
                                </div>
                            </div>`;
                        }
                    }
                }
                var popEvidencia = app.popup.create({
                    content: `
                    <div class="sheet-modal my-sheet" id="sheet-modal-2" name="sheet">
                    <div class="toolbar">
                        <div class="toolbar-inner">
                            <div class="left"></div>
                            <div class="right"><a class="link" id="close_sheet-2" href="#">Cerrar</a></div>
                        </div>
                    </div>
                    <div class="sheet-modal-inner" style="overflow-y: scroll;">
                        <div class="block">
                           ${html}
                        </div>
                        <div style="margin-bottom: 100px;"></div>
                    </div>
                </div>`,
                swipeToClose:false,
                closeByOutsideClick:false,
                closeByBackdropClick:false,
                closeOnEscape:false,
                        on: {
                            open: function (popup) {
                                $('#close_sheet-2').click(function () {
                                    app.sheet.close('#sheet-modal-2');
                                });
                            },
                        }
                });
                popEvidencia.open();
            }
        }
    });
}

function GenerarCurso(IDMov, FK_Becario, IDCurso, IDTipoCurso, OpDiario, NombreCurso, Realizado, costo){
    localStorage.setItem("IDMov", IDMov);
    localStorage.setItem("FK_Becario", FK_Becario);
    localStorage.setItem("IDCurso", IDCurso);
    localStorage.setItem("IDTipoCurso", IDTipoCurso);
    localStorage.setItem("OpDiario", OpDiario);
    localStorage.setItem("NombreCurso", NombreCurso);
    localStorage.setItem("Costo", costo);

    if(OpDiario == 1){
        generaEvaluacion(IDCurso)
    } else {
        if(Realizado == 1){
            app.sheet.close('#sheet-modal-1');
            app.sheet.close('#sheet-modal-2');
            var empresa = localStorage.getItem("empresa");
            var NomJson = 'DatosEvaluacionS_'+empresa;
            var html = `<div class="card-content">
                <div class="card" style="text-align: center;padding-left: 15px;padding-right: 15px;border: 1px solid #005D99;border-radius: 10px;">
                    <span class="span FWM-span-form">Evaluacion no disponible</span>
                </div></div>`;
            app.request({
                url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    var length = data.length;
                    if(length == 0){
                    } else {
                        for (var j = 0; j < data.length; j++) {
                            if(data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario){
                                var check = ''
                                data[j].apto == 1 ? check = 'checked': check = '';
                                html = `<div class="card-content">
                                    <div class="card" style="text-align: center;padding-left: 15px;padding-right: 15px;border: 1px solid #005D99;border-radius: 10px;">
                                        <div class="container-check">
                                            <span class="span FWM-span-form">Fecha Evaluacion</span>
                                            <span class="span FWM-span-form span-dato" style="color:#005D99;">${data[j].fecha}</span>
                                        </div>
                                        <div class="container-check">
                                            <span class="span FWM-span-form">Instructor</span>
                                            <span class="span FWM-span-form span-dato" style="color:#005D99;">${data[j].nameInstructor}</span>
                                        </div>
                                        <div class="container-check">
                                            <span class="span FWM-span-form">Becario</span>
                                            <span class="span FWM-span-form span-dato" style="color:#005D99;">${data[j].nameBecario}</span>
                                        </div>
                                        <div class="container_options" style="display: flex;">
                                            <span class="span FWM-span-form" style="width: 50%;">El candidato es Apto?:</span>
                                            <div style="width: 50%;">
                                                <input class="tgl tgl-skewed" id="cb3" type="checkbox" ${check}></input>
                                                <label class="tgl-btn" data-tg-off="NO" data-tg-on="SI" for="" style="font-size: 20px;border-radius: 5px;"></label>
                                            </div>
                                        </div>
                                        <div class="container-check">
                                        <span class="span FWM-span-form">Observaciones</span>
                                        <span class="span FWM-span-form span-dato" style="color:#005D99;">${data[j].observaciones}</span>
                                    </div>
                                    </div>
                                </div>`;
                            }
                        }
                        var popEvidencia = app.popup.create({
                            content: `
                            <div class="sheet-modal my-sheet" id="sheet-modal-3" name="sheet">
                            <div class="toolbar">
                                <div class="toolbar-inner">
                                    <div class="left"></div>
                                    <div class="right"><a class="link" id="close_sheet-3" href="#">Cerrar</a></div>
                                </div>
                            </div>
                            <div class="sheet-modal-inner" style="overflow-y: scroll;">
                                <div class="block">
                                    ${html}
                                </div>
                            </div>
                        </div>`,
                        swipeToClose:false,
                        closeByOutsideClick:false,
                        closeByBackdropClick:false,
                        closeOnEscape:false,
                                on: {
                                    open: function (popup) {
                                        $('#close_sheet-3').click(function () {
                                            app.sheet.close('#sheet-modal-3');
                                        });
                                    },
                                }
                        });
                        popEvidencia.open();
                    }
                }
            });
        } else {
            generaEvaluacion(IDCurso);
        }
        
    }
}

function actualizaRespuestaSiNoPuntuacion(id, valor, OpCorrecta){
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
        var id_pregunta = ids[0].replace('op','');
        if(OpCorrecta == 1){
            var prePunto = 1*valor;
        } else {
            var prePunto = -1*valor;
        }
        
    } else if(check.includes('0')){
        var respuesta = 0;
        var id_pregunta = ids[0].replace('op','');
        if(OpCorrecta == 0){
            var prePunto = 1*valor;
        } else {
            var prePunto = -1*valor;
        }
    }

    var PuntosCurso = Number($("#calificacion_number").val());
    var totalPuntos = PuntosCurso+prePunto;
    $("#calificacion_number").val(totalPuntos)

    getCalificacionCursoValor(totalPuntos)

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE CAP_RespuestasSiNoPuntuacion SET Respuesta = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta,id_cedula,id_pregunta],
                function(tx, results){
                },
                function(tx, error){
                    console.error("Error al guardar: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function sincronizaDatosCapacitacion(){
    let EmpresaID = 1
    let paso = 1;
    let urlBase2 = "http://192.168.100.6/Desarrollo/CISAApp/HMOFiles/Exec";
    // var urlBase2 = "http://192.168.1.71/Desarrollo/CISAApp/HMOFiles/Exec";
    // var urlBase2 = "http://mantto.ci-sa.com.mx/www.CISAAPP.com";
    let url = urlBase2 + "/capacitacion/datos.php?empresa="+EmpresaID+"&paso="+paso;

    fetch(url)
        .then((response) => {
            console.log("Sincroniza datos OK!")
            eliminaCache();
    });
}

function guardarCursoMultiple(){
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1: apto = 0;

    $("#PuntosCurso").val(0)
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select FK_IDPregunta, Respuesta from CAP_RespuestasMultiple where id_cedula= ?",
                [id_cedula],
                function(tx, results){
                    var length = results.rows.length;
                    var FK_IDPregunta = ''
                    var Respuesta = ''
                    for(var i = 0; i< length; i++){
                        var item2 = results.rows.item(i);
                        FK_IDPregunta = item2.FK_IDPregunta
                        Respuesta = item2.Respuesta
                        getOpcionesMultiples(FK_IDPregunta, Respuesta, length)
                    }
                    databaseHandler.db.transaction(
                        function(tx){
                            tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                                [apto,observaciones,firmaInstructor, id_cedula],
                                function(tx, results){
                                    swal({
                                        title: "Aviso",
                                        text: "¿Estas seguro de querer finalizar la prueba?",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                    }).then((RESP) => {
                                        if (RESP == true) {
                                            var fecha_salida = getDateWhitZeros();
                                            var estatus = 1;
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                        [fecha_salida,estatus,id_cedula],
                                                        function(tx, results){
                                                            window.location.href = "./menu.html";
                                                        },
                                                        function(tx, error){
                                                            swal("Error al guardar",error.message,"error");
                                                        }
                                                    );
                                                },
                                                function(error){},
                                                function(){}
                                            );              
                                        }
                                    });
                                },
                                function(tx, error){
                                    console.error("Error al guardar cierre: " + error.message);
                                }
                            );
                        },
                        function(error){},
                        function(){}
                    );
                }
            );
        },
        function(error){},
        function(){}
    );
}
function getOpcionesMultiples(FK_IDPregunta, Respuesta, length2){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select * from CAP_OPMultipleOpts where id_cedula= ? AND FK_IDPregunta = ?",
                [id_cedula, FK_IDPregunta],
                function(tx, results){
                    var length = results.rows.length;
                    var letter = 64
                    let puntos = Number($("#PuntosCurso").val())
                    for(var j = 0; j< length; j++){
                        letter++
                        var item3 = results.rows.item(j);
                        Respuesta == letter && item3.Correcta == 1 ? puntos++ : null ;
                    }
                    let promedio = (puntos*100)/length2 
                    $("#PuntosCurso").val(puntos)
                    actualizaPromedio2(promedio.toFixed(2))
                }
            );
        },
        function(error){},
        function(){}
    );
}
function verDetalleCapacitacion(ID, FKPersonalBecario,nameBecario){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'BecariosCursos_'+empresa;
    var html = ''
    var coursesHTML = ''
    var imtesHTML = ''
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            for (var j = 0; j < data.length; j++) {
                if(data[j].FK_Becario == FKPersonalBecario){
                    let check = ''
                    let apto = ''
                    data[j].aprobado == 1 ? apto = 'checked': apto = ''
                    data[j].realizado == 1 ? check = 'checked' : check = ''
                    if(data[j].Certificadora == 0){
                        coursesHTML += `<div style="display: flex; justify-content: space-around; align-items: center;" class="card">
                            <input type="checkbox" id="" ${check} onclick="return false;">
                            <h2 style=" font-size: 18px;color: #000;">${data[j].NombreCurso}</h2>
                            <div class="container_options">
                                <span class="span FWM-span-form">El candidato es Apto?:</span>
                                <input class="tgl tgl-skewed" id="cb3" type="checkbox" ${apto} onclick="return false;"></input>
                                <label class="tgl-btn" data-tg-off="NO" data-tg-on="SI" for="cb3" style="font-size: 20px;border-radius: 5px;"></label>
                            </div>
                        </div>`
                    } else {
                        imtesHTML += `<div style="display: flex; justify-content: space-around; align-items: center;" class="card">
                            <input type="checkbox" id="" ${check} onclick="return false;">
                            <h2 style=" font-size: 18px;color: #000;">${data[j].NombreCurso}</h2>
                            <div class="container_options">
                                <span class="span FWM-span-form">El candidato es Apto?:</span>
                                <input class="tgl tgl-skewed" id="cb3" type="checkbox" ${apto} onclick="return false;"></input>
                                <label class="tgl-btn" data-tg-off="NO" data-tg-on="SI" for="cb3" style="font-size: 20px;border-radius: 5px;"></label>
                            </div>
                        </div>`
                    }
                }
            }
            // <div class="block">
            //     <div class="card-content">
            //         <div class="card" style="text-align: center;"></div>
            html = `<div class="sheet-modal my-sheet" id="sheet-modal-4" name="sheet">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="left"></div>
                        <div class="right"><a class="link" id="close_sheet" href="#">Cerrar</a></div>
                    </div>
                </div>
                <div class="sheet-modal-inner" style="overflow-y: scroll;">
                    <div class="block">
                        <div class="card-content">
                            <div class="card">
                                <div>
                                    <div>
                                        <h2 style="width: fit-content;margin-left: auto;margin-right: auto;background-color: #cce7ff;padding: 10px 25px 8px 25px;border-radius: 10px;">Cursos</h2>
                                    </div>
                                </div>
                                <div id="div_cursos" class="card">
                                    ${coursesHTML}
                                </div>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="card">
                                <div>
                                    <div>
                                        <h2 style="width: fit-content;margin-left: auto;margin-right: auto;background-color: #cce7ff;padding: 10px 25px 8px 25px;border-radius: 10px;">IMTES</h2>
                                    </div>   
                                </div>
                                <div id="div_imtes" class="card">
                                    ${imtesHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            var popEvidencia = app.popup.create({
                content: `
                ${html}`,
            swipeToClose:false,
            closeByOutsideClick:false,
            closeByBackdropClick:false,
            closeOnEscape:false,
                    on: {
                        open: function (popup) {
                            $('#close_sheet').click(function () {
                                app.sheet.close('#sheet-modal-4');
                            });
                        },
                    }
            });

            popEvidencia.open();
            
        }
    });
}

function GuardarPhoto(){
    //CAP_Evidencias( id_cedula integer, evidencia blob, fecha text
    var id_cedula = localStorage.getItem("IdCedula");
    var foto = $("#imagenC").val();
    if(foto){
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("INSERT INTO CAP_Evidencias(id_cedula,evidencia,fecha) VALUES (?,?,?)",
                    [id_cedula,foto,getDateWhitZeros()],
                    function(tx, results){
                        databaseHandler.db.transaction(
                            function(tx1){
                                tx1.executeSql(
                                    "Select * from CAP_Evidencias where id_cedula= ? ORDER BY id_evidencia DESC LIMIT 1",
                                    [id_cedula],
                                    function(tx, results){
                                        var item = results.rows.item(0);
                                        $("#evidencias_div").css("display", "none")
                                        $("#div_botones_camara").html(`<div style="min-width: 50px; border-style: none;">
                                            <span class="resize-handler"></span>
                                            <a href="#" onclick="ValidarCapturePhoto()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                                Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                                            </a>
                                        </div>`)
                                        $("#imagenC").val('');
                                        swal("","Foto guardada correctamente","success");
                                        $("#facturas").append("<tr id='fila"+ item.id_evidencia +"'><td style='text-align: center;'><img src='"+item.evidencia+"' width='60px' style='margin-top: 4px;'/></td><td style='text-align: center;'><a href='#' onclick='eliminarFilaFoto("+item.id_evidencia +",1);' style='border: none; outline:none;'><i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;color:#FF0037;font-size: 40px;'>delete_forever</i></a></td></tr>");
                                        $("#message-nr").css("display", "none");
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    },
                    function(tx, error){
                    }
                );
            },function(error){},function(){
            }
        );
    }else{
        swal("","Debes tomar una fotografía de la factura(s):", "warning");
    }
}

function ValidarCapturePhoto(){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx1){
            tx1.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_Evidencias where id_cedula= ?",
                [id_cedula],
                function(tx, results){
                    var item = results.rows.item(0);
                    if(item.cuenta <= 2){
                        capturePhoto()
                    } else {
                        swal("", "Solo puedes agregar máx. 3 fotos", "warning")
                    }
                }
            );
        },
        function(error){},
        function(){}
    );
}

function eliminarFilaFoto(index, val){
    if(val == 1){
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql(
                    "DELETE FROM CAP_Evidencias WHERE id_evidencia = ?",
                    [index],
                    function(tx, results){
                         swal("","El registro se elimino satisfactoriamente","success");
                         $("#fila" + index).remove();
                    },
                    function(tx, error){
                        swal("Error al eliminar registro",error.message,"error");
                    }
                );
            },
            function(error){},
            function(){}
        );
    }
}

function guardarCursoEvidencias(){
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1: apto = 0;

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                [apto,observaciones,firmaInstructor, id_cedula],
                function(tx, results){
                    swal({
                        title: "Aviso",
                        text: "¿Estas seguro de querer finalizar la prueba?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            var fecha_salida = getDateWhitZeros();
                            var estatus = 1;
                            databaseHandler.db.transaction(
                                function(tx){
                                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                        [fecha_salida,estatus,id_cedula],
                                        function(tx, results){
                                            window.location.href = "./menu.html";
                                        },
                                        function(tx, error){
                                            swal("Error al guardar",error.message,"error");
                                        }
                                    );
                                },
                                function(error){},
                                function(){}
                            );              
                        }
                    });
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function generarCursoManejo(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha_llegada = getDateWhitZeros();
        var geolocation = $("#CursosTecnicos").find('option:selected').attr("name");
        var id_cliente = localStorage.getItem("empresa");
        var nombre_cliente = $("#nombreCandidato").val();
        var horario_programado = fecha_llegada;
        var estatus = 0;
        var tipo_cedula = 'Capacitación';
        var nombre_evalua = $("#name_course").val();

        var fecha = $("#fecha").val();
        var nombreInstructor = $("#nombreInstructor").val();
        var nombreCandidato = $("#nombreCandidato").val();
        var edad = $("#edad").val();
        var telCelular = $("#telCelular").val();
        var antecedentesManejo = $("#antecedentesManejo").val();
        var name_course = $("#name_course").val();
        var id_instructor = localStorage.getItem("id_usuario");
        var id_candidato = $("#id_candidato").val();
        var fecha_captura = getDateWhitZeros();
        var id_course = $("#CursosTecnicos").val(); //! dinamic
        var IDTipoCurso =  $("#CursosTecnicos").find('option:selected').attr("name");
        var ID_AT = $("#ID_AT").val();
        var costo = 0
        var Prueba = 1

        productHandler.addCedula(id_usuario,nombre_usuario,fecha_llegada,id_course,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula,nombre_evalua,geolocation);
        databaseHandler.db.transaction(
            function (tx) {
            tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    //app.dialog.progress('Generando CheckList','red');
                    var progress = 0;
                    var dialog = app.dialog.progress('Generando Curso', progress, 'red');
                    var empresa = localStorage.getItem("empresa");
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    if(IDTipoCurso == 1){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'CursoCiertoFalso'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasCiertoFalso(id_cedula,data[j].IDPregunta,data[j].Pregunta,data[j].texto1,data[j].texto2,id_course,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 2){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'CursoSiNoValor'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasSiNoValor(id_cedula,data[j].IDPregunta,data[j].Pregunta,id_course,data[j].OpCorrecta,data[j].Valor,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 3){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'PreguntasMultiple_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasMultiple(id_cedula,data[j].IDPregunta,data[j].Pregunta,id_course,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                        var NomJson2 = 'RespuestasMultiples_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson2+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].FK_IDCurso == id_course){                                        
                                        productHandler.insertOptionsMultiple(id_cedula,data[j].ID,data[j].FK_Pregunta,data[j].Opcion,data[j].Correcta,data[j].Image, id_course);
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 4){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        var NomJson = 'PreguntasMultiple_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].IDNombreCurso == id_course){
                                        aux ++;
                                    }
                                }
                                if(aux == 0){
                                    app.dialog.close();
                                    swal("","Algo salió mal.","error");
                                }else{
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if(data[j].IDNombreCurso == id_course){
                                            aux2++;
                                            productHandler.insertPreguntasMultiple(id_cedula,data[j].IDPregunta,data[j].Pregunta,id_course,aux,aux2);
                                        }
                                    }
                                }
                            }
                        });
                        var NomJson2 = 'RespuestasMultiples_'+empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson2+".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].FK_IDCurso == id_course){                                        
                                        productHandler.insertOptionsMultiple(id_cedula,data[j].ID,data[j].FK_Pregunta,data[j].Opcion,data[j].Correcta,data[j].Image, id_course);
                                    }
                                }
                            }
                        });
                    } else if(IDTipoCurso == 5){
                        productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                    }
                },
                function (tx, error) {
                console.log("Error al guardar cedula: " + error.message);
                }
            );
            },
            function (error) {},
            function () {}
        );
    } else {
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }
}

function validaEventos(fecha){
    var id_cedula = localStorage.getItem("IdCedula");

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select id_becario from asistenciaDetails where id_cedula= ?",
                [id_cedula],
                function(tx, results){
                    var length = results.rows.length;
                    if(length == 0){
                    }else{
                        for(var i = 0; i< length; i++){
                            var item = results.rows.item(i);
                            validaEventosDetails(fecha,item.id_becario)
                        }
                    }
                }
            );
        },
        function(error){},
        function(){}
    );

}

function validaEventosDetails(fecha,id_becario){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'ViewIncidencias_'+empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if(length == 0){
            } else {
                for (var j = 0; j < data.length; j++) {
                    if(data[j].fecha_e == fecha){
                        if(data[j].FK_Becario == id_becario){
                            $("#div_evento_"+id_becario).html(`
                                <span class="element_asis_evt">${data[j].flag_incidencia}</span>
                            `)
                            $("#toogle_"+id_becario).attr("data-tg-on", "Confirmado")
                        }
                    }
                }
            }
        }
    });
}

function getCalificacionCursoValor(puntos){
    let IDCurso = localStorage.getItem("IDCurso");
    let empresa = localStorage.getItem("empresa");
    let NomJson = 'Calificaciones_'+empresa;
    let califf = 0
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let length = data.length;
            if(length == 0){
            } else {
                data.forEach(function (dat, index) {
                    if(dat.FKCurso == IDCurso){
                        let min = Number(dat.Calif7)
                        min--
                        if(puntos > min && puntos <= dat.Calif7){
                            califf = 7
                        } else if( puntos >= dat.Calif7 && puntos <= dat.Calif8){
                            califf = 8
                        } else if(puntos > dat.Calif8 && puntos <= dat.Calif9){
                            califf = 9
                        } else if(puntos > dat.Calif9 && puntos <= dat.Calif10){
                            califf = 10
                        } else {
                            califf = 0
                        }
                        $("#calificacion_text").html('Puntaje Obtenido: '+ puntos + ", Calificación: "+(califf))
                        actualizaPromedio2(califf)
                    }
                })
            }
        }
    });
}

function actualizaPromedio2(valor){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datosGeneralesCurso SET promedio = ? WHERE id_cedula = ?",
                [valor,id_cedula],
                function(tx, results){
                },
                function(tx, error){
                    console.error("Error al guardar: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

//fin Capacitacion 
//fin HMO