var IdUsuario = localStorage.getItem("IdUsuario");
$("#IdUsuario").val(IdUsuario);
//Borrar variables de sesión y regresar a el Log-in
function logaout() {
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("DELETE FROM Actualizaciones",
                [],
                function (tx5, results) {
                    StatusBar.backgroundColorByHexString("#2B5875");
                    window.localStorage.clear();
                    window.location.href = "index.html";
                }
            )
        }
    );
}

function cambiaCamara(){
    let camara = $("#camara_activa").val()
    localStorage.setItem("camera",camara)
    swal("", "Se cambio la configuracion de la camara.", "success");
}

function deleteForm() {
    document.getElementById("demo-form").reset();
}

function rotate() {
    if (localStorage.getItem("currentOrientation") == "portrait") {
        screen.orientation.lock('landscape');
        localStorage.setItem("currentOrientation", "landscape");
    } else {
        screen.orientation.lock('portrait');
        localStorage.setItem("currentOrientation", "portrait");
    }
}
function validateScan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var texto = result.text;
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
                    open: function (popup) { },
                }
            });
            camera.open();
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera: false,
            showFlipCameraButton: true,
            showTorchButton: true,
            torchOn: false,
            saveHistory: false,
            prompt: "Coloca el codigo de barras en la zona marcada",
            resultDisplayDuration: 500,
            orientation: "portrait",
            disableAnimations: true,
            disableSuccessBeep: false
        }
    );
}
function restorientation() {
    screen.orientation.lock('portrait');
    localStorage.setItem("currentOrientation", "portrait");
}

// Funcion global Inicio
function eliminaCache() {
    var success = function (status) {
        $("#process").hide();
        updateData();
    };
    var error = function (status) {
        $("#process").hide();
        console.log('Error: ' + status);
    };
    window.CacheClear(success, error);
}
function changeCamera(check) {
    if (check.includes('0')) {
        localStorage.setItem("camera", "0");
        swal("", "Se cambio exitosamente la configuracion de la camara.", "success");
    } else {
        localStorage.setItem("camera", "1");
        swal("", "Se cambio exitosamente la configuracion de la camara.", "success");
    }
}
function capturePhoto() {
    var camera = localStorage.getItem("camera");
    if (camera == 0) {
        var camera = app.popup.create({
            content: `
                <div class="popup" id="camera" style="display: block;width: 100%;height: 100%;margin-top: 0px;margin-left: 0px;top: 0;left: 0;">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">
                        <div>
                            <div class="left-action">
                                <div class="cancel popup-close" id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                                <div class="cancel " id="cancelPicure" onClick="onCancelPicture()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            </div>
                            <div class="camera">
                                <div class="take" id="take" onclick="onTake()">
                                    <div class="bubble-take"></div>
                                </div>
                                <div class="select" id="select" style="display: none;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                            </div>
                            <div class="right-action">
                                <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                            </div>
                        </div>
                        
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()"><img id="flash" src="img/flash_off.svg" width="30px" style="display:none;"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
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
                    permissions.checkPermission(permissions.CAMERA, function (status) {
                        if (status.hasPermission) {
                            cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                            function empresaCargada() {
                                cameraStart(onPhotoDataSuccess)
                            }
                            function cargarEmpresa(url, callback) {
                                var pie = document.getElementsByTagName('fwm')[0];
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        } else {
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close('.popup')
                                swal("Se Requiere los permisos", "Para poder tomar las evidencias fotograficas necesitamos el permiso.", "warning");
                            }
                            function success(status) {
                                if (!status.hasPermission) {
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada() {
                                        cameraStart(onPhotoDataSuccess)
                                    }
                                    function cargarEmpresa(url, callback) {
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
function checkStatus(check) {
    if (check.includes('1')) {
        var valCheck = document.getElementById(check).checked;
        if (valCheck == true) {
            var name = check.replace('1', '');
            var otherCheck = name + '0';
            document.getElementById(otherCheck).checked = false;
        }
    } else {
        var valCheck = document.getElementById(check).checked;
        if (valCheck == true) {
            var name = check.replace('0', '');
            var otherCheck = name + '1';
            document.getElementById(otherCheck).checked = false;
        }
    }
}
function moveMenu(val) {
    if (val) {
        val == 1
            ? app.views.main.router.navigate({ name: 'formCapacita1' })
            : val == 2
                ? generarAsistencia()
                : val == 3
                    ? app.views.main.router.back('/formCapacita4/', { force: true, ignoreCache: true, reload: true })
                    : false;
    } else {
        var Modulos = localStorage.getItem("Modulos");
        localStorage.setItem("Opcion", '1');
        if (Modulos == "Limpieza") {
            app.views.main.router.navigate({ name: 'yallegueLimp' });
        } else if (Modulos == "Imagen") {
            app.views.main.router.navigate({ name: 'yallegue' });
        } else if (Modulos == "Desincorporaciones") {
            iniciarDesincorporaciones();
        } else if (Modulos == "Recaudo") {
            preingresoRecaudo();
        } else if(Modulos == "tecnologiasHmo"){
            preInicioTech()
            // app.views.main.router.navigate({ name: 'yallegueTecnologiasHMO'});
        } else if(Modulos == "Relevos"){
            app.views.main.router.navigate({ name: 'formRelevos1'});
        } 
    }
}
function EliminarActualizacionesAntiguas() {
    var IdUsuario = localStorage.getItem("Usuario");
    var fecha = new Date();
    var fecha_ingreso = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    fecha_eliminar = editar_fecha(fecha_ingreso, "-30", "d", "-");
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("SELECT * FROM Actualizaciones  WHERE Fecha < ? AND IdUsuario = ?",
                [fecha_eliminar, IdUsuario],
                function (tx5, results) {
                    var length = results.rows.length;
                    for (var i = 0; i < length; i++) {
                        var item2 = results.rows.item(i);
                        var IdEliminar = item2.idActualizacion;
                        databaseHandler.db.transaction(
                            function (tx4) {
                                tx4.executeSql(
                                    "DELETE FROM Actualizaciones WHERE idActualizacion = ?",
                                    [IdEliminar],
                                    function (tx4, results) {
                                    },
                                    function (tx4, error) {
                                        console.errror("Error al eliminar: " + error.message);
                                    }
                                );
                            },
                            function (error) {
                                console.error("Error al seleccionar actualzaciones:" + error.message)
                            },
                            function () { }
                        );
                    }
                }
            )
        }
    );
}
function inputLleno(id, value) {
    id = "#" + id;
    if (value == "") {
        $(id).css("background-color", "#ffffff");
    } else if (value == "0") {
        $(id).css("background-color", "#ffffff");
    } else {
        $(id).css("background-color", "#E0F8F7");
    }
}
// Funcion global Fin
//Pantalla vertical
function vertical() {
    screen.orientation.lock('portrait');
    // screen.orientation.unlock();
}
//Pantalla horizontal
function landsca() {
    screen.orientation.lock('landscape');
    //screen.orientation.unlock();
}
// Cerrar Popup
function gClose() {
    screen.orientation.lock('portrait');
    // screen.orientation.unlock();
}
var testFirma;

function createFirma() {
    screen.orientation.lock('landscape');
    var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(6, 62, 127)'
    });
    testFirma = signaturePad;
}

function cleanFirma() {
    var signaturePad = testFirma;
    signaturePad.clear();
}

// Tomar foto firma
function capturaFirma() {
    var camera = localStorage.getItem("camera");
    if (camera == 0) {
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
                    permissions.checkPermission(permissions.CAMERA, function (status) {
                        if (status.hasPermission) {
                            cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                            function empresaCargada() {
                                cameraStart(onPhotoSingSuccess)
                            }
                            function cargarEmpresa(url, callback) {
                                var pie = document.getElementsByTagName('fwm')[0];
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        } else {
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close('.popup')
                                swal("Se requiere los permisos", "Para poder tomar las evidencias fotograficas necesitamos el permiso.", "warning");
                            }
                            function success(status) {
                                if (!status.hasPermission) {
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada() {
                                        cameraStart(onPhotoSingSuccess)
                                    }
                                    function cargarEmpresa(url, callback) {
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
        navigator.camera.getPicture(onPhotoSingSuccess, onFail, {
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
    if (camera == 0) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'flex';
        var nameima = imageData;
        smallImage.src = imageData;
        $('#imgSigPhoto').val(nameima);
        $("#photoIcon").attr("src", "img/reload.svg");
    } else {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'flex';
        var nameima = "data:image/jpeg;base64," + imageData;
        smallImage.src = "data:image/jpeg;base64," + imageData;
        $('#imgSigPhoto').val(nameima);
        $("#photoIcon").attr("src", "img/reload.svg");
    }
}

function verpdf(IdCte, IdCed, TipoC) {
    if (TipoC) {
        localStorage.setItem("IdCed", IdCed);
        localStorage.setItem("TipoC", TipoC);
        app.views.main.router.navigate({
            name: "visualizar",
        });
    }
}
function clientSelected(clientName) {
    var mes = $("#month").val();
    localStorage.setItem("id_cliente", clientName);
    localStorage.setItem("mes_detalle", mes);
    app.views.main.router.navigate({ name: 'verVisita' });
}
function clientSelected2(clientName, fecha) {
    let fechaDetalle = fecha.split("-");
    localStorage.setItem("id_cliente", clientName);
    localStorage.setItem("year_detalle", fechaDetalle[0]);
    localStorage.setItem("month_detalle", fechaDetalle[1]);
    localStorage.setItem("day_detalle", fechaDetalle[2]);
    app.views.main.router.navigate({ name: 'calendar-page' });
}

function horizontal() {
    screen.orientation.lock('landscape');
}

function Results() {
    $("#Resultados").show("fast");
    $("#LimSani").hide("fast");
    $("#ManAli").hide("fast");
    $("#higPerso").hide("fast");
    $("#ContTemp").hide("fast");
    $("#ContPlag").hide("fast");
    var valCheckuno = document.getElementById("uno").checked;
    //  alert(valCheckuno);
    var valCheckdos = document.getElementById("dos").checked;
    //  alert(valCheckdos);
    if (valCheckuno == true) { var n1 = 10; }
    if (valCheckdos == true) { var n2 = 10; }

    var suma = parseInt(n1) + parseInt(n2);
    // alert("La suma es: "+suma);
    $("#res").html("<span>La suma es: " + suma + "</span");
}

function editar_fecha(fecha, intervalo, dma, separador) {
    var separador = separador || "-";
    var arrayFecha = fecha.split(separador);
    var dia = arrayFecha[2];
    var mes = arrayFecha[1];
    var anio = arrayFecha[0];

    var fechaInicial = new Date(anio, mes - 1, dia);
    var fechaFinal = fechaInicial;
    if (dma == "m" || dma == "M") {
        fechaFinal.setMonth(fechaInicial.getMonth() + parseInt(intervalo));
    } else if (dma == "y" || dma == "Y") {
        fechaFinal.setFullYear(fechaInicial.getFullYear() + parseInt(intervalo));
    } else if (dma == "d" || dma == "D") {
        fechaFinal.setDate(fechaInicial.getDate() + parseInt(intervalo));
    } else {
        return fecha;
    }
    dia = fechaFinal.getDate();
    mes = fechaFinal.getMonth() + 1;
    anio = fechaFinal.getFullYear();
    dia = (dia.toString().length == 1) ? "0" + dia.toString() : dia;
    mes = (mes.toString().length == 1) ? mes.toString() : mes;
    return anio + "-" + mes + "-" + dia;
}
function cambiaimgempresa(val) {
    if (val == 1) {
        $("#img_logo").attr("src", "img/ACHSA.png");
    } else if (val == 35) {
        $("#img_logo").attr("src", "img/AMTM.png");
    } else if (val == 2) {
        $("#img_logo").attr("src", "img/ATROL.png");
    } else if (val == 37) {
        $("#img_logo").attr("src", "img/AULSA.png");
    } else if (val == 20) {
        $("#img_logo").attr("src", "img/BUSSI.png");
    } else if (val == 3) {
        $("#img_logo").attr("src", "img/CCA.png");
    } else if (val == 4) {
        $("#img_logo").attr("src", "img/CISA.png");
    } else if (val == 5) {
        $("#img_logo").attr("src", "img/COAVE.png");
    } else if (val == 41) {
        $("#img_logo").attr("src", "img/CODIV.png");
    } else if (val == 6) {
        $("#img_logo").attr("src", "img/COPE.png");
    } else if (val == 7) {
        $("#img_logo").attr("src", "img/CORENSA.png");
    } else if (val == 8) {
        $("#img_logo").attr("src", "img/COREV.png");
    } else if (val == 9) {
        $("#img_logo").attr("src", "img/COTAN.png");
    } else if (val == 10) {
        $("#img_logo").attr("src", "img/COTOBUSA.png");
    } else if (val == 39) {
        $("#img_logo").attr("src", "img/COTXS.png");
    } else if (val == 22) {
        $("#img_logo").attr("src", "img/ESASA.png");
    } else if (val == 11) {
        $("#img_logo").attr("src", "img/MIHSA.png");
    } else if (val == 12) {
        $("#img_logo").attr("src", "img/RECSA.png");
    } else if (val == 13) {
        $("#img_logo").attr("src", "img/SIMES.png");
    } else if (val == 14) {
        $("#img_logo").attr("src", "img/SKYBUS.png");
    } else if (val == 15) {
        $("#img_logo").attr("src", "img/STMP.png");
    } else if (val == 16) {
        $("#img_logo").attr("src", "img/TCGSA.png");
    } else if (val == 17) {
        $("#img_logo").attr("src", "img/TREPSA.png");
    } else if (val == 19) {
        $("#img_logo").attr("src", "img/TUZOBUS.png");
    } else if (val == 18) {
        $("#img_logo").attr("src", "img/VYCSA.png");
    } else {
        $("#img_logo").attr("src", "img/logo1.png");
    }
}
function recarga_history(mes_pdfs, year_pdfs) {
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    if (localStorage.getItem("Modulos") == 'Imagen') {
        var tipo = "checklist";
    } else if (localStorage.getItem("Modulos") == 'Limpieza') {
        var tipo = "Limpieza";
    } else {
        var tipo = localStorage.getItem("Modulos");
    }

    var url = localStorage.getItem("url");
    app.request.get(url + '/historial.php', { IdUsuario: IdU, mes_pdfs: mes_pdfs, year_pdfs: year_pdfs, tipo: tipo }, function (data) {
        var content = JSON.parse(data);
        if (content == 0) {
            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
        } else {
            if (data == 'null') {
                $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
            } else {
                if (content.length > 0) {
                    var html = '';
                    for (var e = 0; e < content.length; e++) {
                        var fecha = content[e].FechaCaptura.split(' ');
                        //$("#cedul").html("<li><div class='item-content'><div class='item-media' style='font-size:12px'>"+TipoCed+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class='item-inner'><div class='item-title' style='font-size:12px'>"+unescape(content[e].Cliente)+ "</div><div class='item-after' style='font-size: 12px;color: black;display: flex;flex-direction: row;align-items: center'>"+resp[0]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='verpdf(\""+content[e].IdCte+"\","+content[e].IdCedula+",\""+content[e].TipoCed+"\")' style='border: none; outline:none;'><img src='img/ver.svg' width='40px' /></a></div></div></div></li>");
                        html = html + `<tr> <td><span>` + content[e].Cliente + `</span></td> <td><span>` + fecha[0] + `</span></td> <td><a href='#' onclick="verpdf('` + content[e].IdCte + `','` + content[e].IdCedula + `','` + content[e].TipoCed + `')" style='border: none; outline:none;'><i class="material-icons md-light" style="font-size: 30px;">description</i></a></td> </tr>`;
                    }
                    $("#cedul").html(html);
                } else {
                    $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                }
            }
        }
    }, function (xhr) {
        $('.preloader').remove();
        $("#content-page").css('display', 'none');
        $("#nointernet-page").css('display', 'block');
    });
}
function recargacedulas() {
    $("#pendientes").html("");
    if (localStorage.getItem("Modulos") == 'Imagen') {
        var tipo = "checklist";
    } else if (localStorage.getItem("Modulos") == 'Limpieza') {
        var tipo = "Limpieza";
    } else {
        var tipo = localStorage.getItem("Modulos")
    }

    var estatus = 0;
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                [estatus, tipo],
                function (tx5, results) {
                    var length = results.rows.length;
                    for (var i = 0; i < length; i++) {
                        var item2 = results.rows.item(i);
                        var fechas = item2.fecha_entrada.split(" ");
                        if (item2.tipo_cedula == 'checklist') {
                            $("#pendientes").append("<li id='conc" + item2.id_cedula + "'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> " + item2.nombre_cliente + "| " + fechas[0] + "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Rev. Imagen</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,1);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula + ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        } else if (item2.tipo_cedula == 'Capacitación') {
                            if(item2.nombre_evalua == 'Prueba Manejo'){
                                $("#pendientes").append("<li id='conc" + item2.id_cedula + "'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> " + item2.nombre_cliente + "| " + fechas[0] + "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Prueba Manejo</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,5);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula + ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                            } else {
                                $("#pendientes").append("<li id='conc" + item2.id_cedula + "'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> " + item2.nombre_cliente + "| " + fechas[0] + "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>"+item2.nombre_evalua+"</div> </div><div class='item-after'><a href='#' onclick='continuarCedCap(`" + item2.id_cedula + "`,`" +item2.geolocalizacion_salida+ "`);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula + ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                            }
                        } else {
                            $("#pendientes").append(`<li id='conc${item2.id_cedula}'><div class='item-content'><div class='item-media'> <i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i> </div><div class='item-inner'><div class='item-title'> <div>${item2.nombre_cliente} | ${fechas[0]}</div>  <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>${item2.nombre_cliente}</div>  </div><div class='item-after'> <a href='#' onclick="continuarCed2(${item2.id_cedula},'${item2.tipo_cedula}');" style='border: none; outline:none;'> <i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp; <a href='#' onclick="EliminarReg(${item2.id_cedula},'${item2.tipo_cedula}')" style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>`);
                        }
                    }
                },
                function (tx5, error) {
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}
//inicio checklist
function continuarCed(id_cedula, tipo) {
    localStorage.setItem("IdCedula", id_cedula);
    localStorage.setItem("Opcion", '1');
    localStorage.setItem("page", 1);
    if (tipo == 1) {
        app.views.main.router.back('/formCheck1/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 2) {
        app.views.main.router.back('/formLimp1/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 3) {
        app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 4) {
        app.views.main.router.back('/yallegueRecaudo/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 5) {
        app.views.main.router.back('/formCapacita2/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 6) {
        app.views.main.router.back('/formCapacita3/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 7) {
        app.views.main.router.back('/formCapacita5/', { force: true, ignoreCache: true, reload: true });
    }
}

function continuarCedCap(id_cedula, tipo) {
    localStorage.setItem("IdCedula", id_cedula);

    if (tipo == 0) {
        app.views.main.router.back('/formCapacita3/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 1) {
        app.views.main.router.back('/formCapacita2/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 2) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select * from cedulas_general cd INNER JOIN datosGeneralesCurso dg ON cd.id_cedula = dg.id_cedula where cd.id_cedula= ?",
                    [id_cedula],
                    function (tx, results) {
                        var item2 = results.rows.item(0);
                        localStorage.setItem("FK_Becario", item2.id_candidato);
                        localStorage.setItem("IDCurso", item2.geolocalizacion_entrada);
                        localStorage.setItem("IDTipoCurso", item2.geolocalizacion_salida);
                        localStorage.setItem("NombreCurso", item2.nombre_evalua);
                        localStorage.setItem("nameBecario", item2.nombre_cliente);
                        app.views.main.router.back('/formCapacita5/', { force: true, ignoreCache: true, reload: true });
                    }
                );
            },
            function (error) { },
            function () { }
        );
    } else if (tipo == 3 || tipo == 4) {
        app.views.main.router.back('/formCapacita6/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 5) {
        app.views.main.router.back('/formCapacita7/', { force: true, ignoreCache: true, reload: true });
    }
}

function IniciaCheckList() {
    if ($("#autocomplete-dropdown-ajax").val()) {
        var Unidad = $("#autocomplete-dropdown-ajax").val();
        var Chasis = $("#Chasis").val();
        var Familia = $("#Familia").val();
        var marca = $("#marca").val();
        var Empresa = $("#Empresa").val();
        var FK_id_unidad = $("#FK_unidad").val();
        var id_unidad_vs = $("#id_unidad").val();
        var FK_id_empresa = $("#FK_unidad_danos_empresa").val();
        var id_modelo_check = $("#modelo_check").val();
        var fecha_revision = $("#fecha_revision").val();
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = localStorage.getItem("empresa");
        var tipo_cedula = 'checklist';
        productHandler.addCedulayb(id_usuario, nombre_usuario, fecha_llegada, geolocation, id_cliente, nombre_cliente, horario_programado, estatus, tipo_cedula);
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
                        var NomJson = 'datos_check_desc' + empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons/" + NomJson + ".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if (data[j].modelos == id_modelo_check) {
                                        aux++;
                                    }
                                }
                                if (aux == 0) {
                                    app.dialog.close();
                                    swal("", "Algo salió mal.", "warning");
                                } else {
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].modelos == id_modelo_check) {
                                            aux2++;
                                            productHandler.insertPreguntas(id_cedula, data[j].id_pregunta, data[j].revision, data[j].nombre_fase, data[j].nombre_seccion, data[j].fase, data[j].obligatorio, data[j].no_pregunta, 1, data[j].modelos, aux, aux2, data[j].multiple);
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
            function (error) { },
            function () { }
        );
    } else {
        swal("", "Selecciona una unidad para poder ingresar.", "warning");
    }
}

function validaradios(id, numero, pregunta, multiple, FK_equipo) {
    if (numero == 3) {
        var ids = id.split("-");
        var check = ids[1];
        if (check.includes('1')) {
            var valCheck = document.getElementById(ids[0] + "-" + ids[1]).checked;
            if (valCheck == true) {
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio', 'label') + "-1";
                var labels2 = ids[0].replace('radio', 'label') + "-2";
                $("#" + labels1).addClass("checked");
                $("#" + labels2).removeClass("checked");
            }
        } else if (check.includes('2')) {
            var valCheck = document.getElementById(ids[0] + "-" + ids[1]).checked;
            if (valCheck == true) {
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio', 'label') + "-1";
                var labels2 = ids[0].replace('radio', 'label') + "-2";
                $("#" + labels2).addClass("checked");
                $("#" + labels1).removeClass("checked");
                var id_pregunta = ids[0].replace('radio', '');
                SeleccionarDanos(id_pregunta);
            }
        }
        actualizacheck(id);
    } else if(numero == 4){
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
                SeleccionarDanosControlTec(id_pregunta, pregunta, multiple, FK_equipo);
            }
        }
        actualizacheckControlTec(id);
    }
}

function moveChecklist(fase) {
    localStorage.setItem("fase", fase);
    var page = localStorage.getItem("page");
    if (page == 1) {
        app.views.main.router.back('/formCheck2/', { force: true, ignoreCache: true, reload: true });
    } else if (page == 2) {
        app.views.main.router.back('/formCheck1/', { force: true, ignoreCache: true, reload: true });
    }
}

function actualizacheck(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes('1')) {
        var respuesta = 1;
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio', '');
        $("#span-" + id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("UPDATE checklist SET respuesta = ?,comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta, comentarios, id_cedula, id_pregunta],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    } else if (check.includes('2')) {
        var respuesta = 2; var id_pregunta = ids[0].replace('radio', '');
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("UPDATE checklist SET respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta, id_cedula, id_pregunta],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    }
}

function TerminarCheckList() {
    app.views.main.router.back('/formCheck3/', { force: true, ignoreCache: true, reload: true });
}

function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function agregaComentarios(id_pregunta, mul) {
    if (mul == 1 || mul == 2) {
        var seleccionados = $("#opts_modal").val();
        if (seleccionados.length == 0) {
            swal("", "Selecciona al menos una opción del desplegable.", "warning");
            return false;
        } else {
            var opts = '';
            $("#opts_modal option").each(function () {
                if (this.selected) {
                    opts = opts + ", " + capitalizarPrimeraLetra($(this).text());
                }
            });
            opts = opts.slice(1);
            opts = opts + ":";
        }
    } else {
        var opts = '';
    }
    var campos;
    var comentarios = '';

    campos = document.querySelectorAll('#div_cboxs .obligatorio');
    var valido = false;

    [].slice.call(campos).forEach(function (campo) {
        if (campo.checked == true) {
            valido = true;
            comentarios = comentarios + ", " + campo.value;
        }
    });

    if (valido) {
        var str = comentarios;
        var name = str.slice(1);
        name = opts + "" + name;
        name = name.trim();
        name = capitalizarPrimeraLetra(name);
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("UPDATE checklist SET comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [name, id_cedula, id_pregunta],
                    function (tx, results) {
                        $("#span-" + id_pregunta).html(name);
                        app.sheet.close('#sheet-modal');
                        swal("", "Comentario guardado correctamente", "success");
                    },
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    } else {
        swal("", "Selecciona almenos un daño para poder guardar", "warning");
    }
}

function guardaComentarios_generales(val) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE datos_generales_checklist SET comentarios_generales = ? WHERE id_cedula = ?",
                [val, id_cedula],
                function (tx, results) {
                    swal("", "Observaciones guardadas correctamente", "success");
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function EnviarCheckList() {
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
            var fecha_salida = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
            var estatus = 1;
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                        [fecha_salida, estatus, id_cedula],
                        function (tx, results) {
                            window.location.href = "./menu.html";
                        },
                        function (tx, error) {
                            swal("Error al guardar", error.message, "error");
                        }
                    );
                },
                function (error) { },
                function () { }
            );
        }
    });
}

function SeleccionarDanos(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("SELECT * FROM checklist WHERE id_pregunta = ? AND id_cedula = ?",
                [id, id_cedula],
                function (tx5, results) {
                    var item2 = results.rows.item(0);
                    if (item2.multiple == 1) {
                        var text = item2.revision;
                        let result = text.includes("(");
                        if (result) {
                            var resultados = text.split("(");
                            var titulo_modal = resultados[0].trim();
                            var divididos = resultados[1].split(",");
                            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                            var quitapar = '';
                            for (i = 0; i < divididos.length; i++) {
                                quitapar = divididos[i].replace("(", "");
                                quitapar = quitapar.replace(")", "");
                                quitapar = capitalizarPrimeraLetra(quitapar);
                                opciones = opciones + `<option value=` + quitapar.trim() + `>` + quitapar.trim() + `</option>`;
                            }
                            opciones = opciones + '</select>';
                            CreaModalOption(id, opciones, 1, titulo_modal);
                        } else {
                            var titulo_modal = "";
                            var divididos = text.split(",");
                            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                            var quitapar = '';
                            for (i = 0; i < divididos.length; i++) {
                                quitapar = divididos[i].replace("(", "");
                                quitapar = quitapar.replace(")", "");
                                quitapar = capitalizarPrimeraLetra(quitapar);
                                opciones = opciones + `<option value=` + quitapar.trim() + `>` + quitapar.trim() + `</option>`;
                            }
                            opciones = opciones + '</select>';
                            var titulo_modal = "";
                            CreaModalOption(id, opciones, 2, titulo_modal);
                        }

                    } else {
                        var opciones = false;
                        var titulo_modal = "";
                        CreaModalOption(id, opciones, 3, titulo_modal);
                    }
                }
            )
        }
    );
}

function CreaModalOption(id, opciones, mul, titulo_modal) {
    if (mul == 3) {
        var display = "none";//div_opt
        var display1 = "none";//titulo_modal
    } else if (mul == 2) {
        var display = "block";//div_opt
        var display1 = "none";//titulo_modal
    } else if (mul == 1) {
        var display = "block";//div_opt
        var display1 = "block";//titulo_modal
    }

    var NomDescCli = "danios";
    var html = '';

    app.request.get(cordova.file.dataDirectory + "jsons/" + NomDescCli + ".json", function (data) {
        var content2 = JSON.parse(data);
        for (var x = 0; x < content2.length; x++) {
            html = html + `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox` + content2[x].id_danio + `" value="` + content2[x].tipo_danio + `">` + content2[x].tipo_danio + `</label><br>`;
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
                    <span id="titulo_modal" style="display:`+ display1 + `;color: #FF0037;" class="span FWM-span-form">` + titulo_modal + `</span>
                    <div id="div_opt" style="display:`+ display + `; padding-top: 10px;margin-bottom: 20px;">
                    `+ opciones + `
                    </div>
                    <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                        <input type="hidden" id="inputEvidencia" value=`+ id + `>
                        <input type="hidden" id="pasa" value="0">
                            `+ html + `
                        <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                            <div class="row align-items-stretch" style="text-align: center;">
                                <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                    <span class="resize-handler"></span>
                                    <a href="#" onclick="agregaComentarios(`+ id + `,` + mul + `);" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
            swipeToClose: false,
            closeByOutsideClick: false,
            closeByBackdropClick: false,
            closeOnEscape: false,
            on: {
                open: function (popup) {

                    $('#close_sheet').click(function () {
                        if ($('#pasa').val() != 0) {
                            app.sheet.close('#sheet-modal');
                        } else {
                            swal({
                                title: "Aviso",
                                text: "Aún no seleccionas o guardas una opción, ¿Estas seguro que deseas regresar?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack) {
                                    var otherCheck = "radio" + id + "-2";
                                    document.getElementById(otherCheck).checked = false;
                                    var Check = "radio" + id + "-1";
                                    document.getElementById(Check).checked = true;
                                    var labels1 = Check.replace('radio', 'label');
                                    var labels2 = otherCheck.replace('radio', 'label');
                                    $("#" + labels1).addClass("checked");
                                    $("#" + labels2).removeClass("checked");
                                    actualizacheck(Check);
                                    app.sheet.close('#sheet-modal');
                                } else { }
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
function IniciaCheckListLimp() {
    if ($("#autocomplete-dropdown-ajax").val()) {
        var Unidad = $("#autocomplete-dropdown-ajax").val();
        var Chasis = $("#Chasis").val();
        var Familia = $("#Familia").val();
        var marca = $("#marca").val();
        var Empresa = $("#Empresa").val();
        var FK_id_unidad = $("#FK_unidad").val();
        var id_unidad_vs = $("#id_unidad").val();
        var FK_id_empresa = $("#FK_unidad_danos_empresa").val();
        var id_modelo_check = $("#modelo_check").val();
        var fecha_revision = $("#fecha_revision").val();
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = localStorage.getItem("empresa");
        var tipo_cedula = 'Limpieza';
        productHandler.addCedulayb(id_usuario, nombre_usuario, fecha_llegada, geolocation, id_cliente, nombre_cliente, horario_programado, estatus, tipo_cedula);
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
                        var NomJson = 'datos_check_desc' + empresa;
                        app.request({
                            url: cordova.file.dataDirectory + "jsons_limp/" + NomJson + ".json",
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                var aux = 0;
                                var aux2 = 0;
                                for (var j = 0; j < data.length; j++) {
                                    if (data[j].modelos == id_modelo_check) {
                                        aux++;
                                    }
                                }
                                if (aux == 0) {
                                    app.dialog.close();
                                    swal("", "Algo salió mal.", "warning");
                                } else {
                                    dialog.setText('1 de ' + aux);
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].modelos == id_modelo_check) {
                                            aux2++;
                                            productHandler.insertPreguntas_limp(id_cedula, data[j].id_pregunta, data[j].revision, data[j].nombre_fase, data[j].nombre_seccion, data[j].fase, data[j].obligatorio, data[j].no_pregunta, 1, data[j].modelos, aux, aux2, data[j].multiple);
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
            function (error) { },
            function () { }
        );
    } else {
        swal("", "Selecciona una unidad para poder ingresar.", "warning");
    }
}

function moveChecklist_limp(fase) {
    localStorage.setItem("fase", fase);
    var page = localStorage.getItem("page");
    if (page == 1) {
        app.views.main.router.back('/formLimp2/', { force: true, ignoreCache: true, reload: true });
    } else if (page == 2) {
        app.views.main.router.back('/formLimp1/', { force: true, ignoreCache: true, reload: true });
    }
}

function validaradios_limp(id, numero) {
    if (numero == 3) {
        var ids = id.split("-");
        var check = ids[1];
        if (check.includes('1')) {
            var valCheck = document.getElementById(ids[0] + "-" + ids[1]).checked;
            if (valCheck == true) {
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio', 'label') + "-1";
                var labels2 = ids[0].replace('radio', 'label') + "-2";
                $("#" + labels1).addClass("checked");
                $("#" + labels2).removeClass("checked");
            }
        } else if (check.includes('2')) {
            var valCheck = document.getElementById(ids[0] + "-" + ids[1]).checked;
            if (valCheck == true) {
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio', 'label') + "-1";
                var labels2 = ids[0].replace('radio', 'label') + "-2";
                $("#" + labels2).addClass("checked");
                $("#" + labels1).removeClass("checked");
            }
        }
        actualizacheck_limp(id);
    }
}
function actualizacheck_limp(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes('1')) {
        var respuesta = 1;
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio', '');
        $("#span-" + id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("UPDATE checklist_revlimp SET respuesta = ?,comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta, comentarios, id_cedula, id_pregunta],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    } else if (check.includes('2')) {
        var respuesta = 2; var id_pregunta = ids[0].replace('radio', '');
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("UPDATE checklist_revlimp SET respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta, id_cedula, id_pregunta],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    }
}
function TerminarCheckList_limp() {
    app.views.main.router.back('/formLimp3/', { force: true, ignoreCache: true, reload: true });
}
function guardaComentarios_generales_limp(val) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE datos_generales_revlimp SET comentarios_generales = ? WHERE id_cedula = ?",
                [val, id_cedula],
                function (tx, results) {
                    swal("", "Observaciones guardadas correctamente", "success");
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}
//fin de Revision Limpieza
function getDateWhitZeros() {
    var MyDate = new Date();
    var MyDateString = MyDate.getFullYear() + "-" + ('0' + (MyDate.getMonth() + 1)).slice(-2) + "-" + ('0' + MyDate.getDate()).slice(-2) + " " + ('0' + MyDate.getHours()).slice(-2) + ":" + ('0' + MyDate.getMinutes()).slice(-2) + ":" + ('0' + MyDate.getSeconds()).slice(-2);
    return MyDateString;
}
function NombreEmpresa(val) {
    if (val == 1) {
        return "ACHSA";
    } else if (val == 35) {
        return "AMTM";
    } else if (val == 2) {
        return "ATROL";
    } else if (val == 37) {
        return "AULSA";
    } else if (val == 20) {
        return "BUSSI";
    } else if (val == 3) {
        return "CCA";
    } else if (val == 4) {
        return "CISA";
    } else if (val == 5) {
        return "COAVE";
    } else if (val == 41) {
        return "CODIV";
    } else if (val == 6) {
        return "COPE";
    } else if (val == 7) {
        return "CORENSA";
    } else if (val == 8) {
        return "COREV";
    } else if (val == 9) {
        return "COTAN";
    } else if (val == 10) {
        return "COTOBUSA";
    } else if (val == 39) {
        return "COTXS";
    } else if (val == 22) {
        return "ESASA";
    } else if (val == 11) {
        return "MIHSA";
    } else if (val == 12) {
        return "RECSA";
    } else if (val == 13) {
        return "SIMES";
    } else if (val == 14) {
        return "SKYBUS";
    } else if (val == 15) {
        return "STMP";
    } else if (val == 16) {
        return "TCGSA";
    } else if (val == 17) {
        return "TREPSA";
    } else if (val == 19) {
        return "TUZOBUS";
    } else if (val == 18) {
        return "VYCSA";
    } else {
        return "logo1";
    }
}
//inicio de Desincorporacion
function NuevaDesincorporacion() {
    app.views.main.router.back('/formDesin1/', { force: true, ignoreCache: true, reload: true });
}
function regresarDesincorporacion() {
    app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
}
function GuardaDesincorporacion() {
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
        if ($("#check_jornada").prop("checked") == true) {
            var jornadas = 1;
        } else {
            var jornadas = 0;
        }
        if ($("#check_apoyo").prop("checked") == true) {
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
                                swal("", "Guardado correctamente", "success");
                                setTimeout(function () {
                                    swal.close();
                                    app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
                                }, 1500);
                            },
                            function (tx, error) { console.error("Error al consultar bandeja de salida: " + error.message); }
                        );
                    },
                    function (error) { console.error("Error al consultar bandeja de salida: " + error.message); },
                    function (error) { console.error("Error al consultar bandeja de salida: " + error.message); }
                );
            }
        });
    } else {
        swal("", "Debes llenar estos campos para poder guardar: " + quita_coma, "warning");
        return false;
    }
}
function check_jornada(val) {
    if (val) {
        if (val == 1) {
            if ($("#check_jornada").prop("checked") == true) {
                var campos;
                campos = document.querySelectorAll('#datos_form .opta');
                [].slice.call(campos).forEach(function (campo) {
                    $("#" + $(campo).attr("id")).removeClass("obligatorio");
                    $("#" + $(campo).attr("id")).val("");
                    $("#" + $(campo).attr("id")).prop("readonly", true);
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
                [].slice.call(campos).forEach(function (campo) {
                    $("#" + $(campo).attr("id")).addClass("obligatorio");
                    $("#" + $(campo).attr("id")).val("");
                    $("#" + $(campo).attr("id")).prop("readonly", false);
                });
                $("#sentido_inc").css("background-color", "#ffffff", "!important");
                $("#sentido_inc").prop("disabled", false);
            }
        }
    } else {
        if ($("#check_jornada").prop("checked") == true) {
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
function check_apoyo() {
    // if($("#check_jornada").prop("checked") == true){
    //     swal("","No se puede marcar la opción de apoyo cuando la jornada es no incorporada.","warning");
    //     $("#check_apoyo").prop("checked",false);
    // }
}
function get_datos_completos(form) {
    var campos;
    var trae_los_campos_sin_llennar = '';
    campos = document.querySelectorAll('#' + form + ' .obligatorio');
    var valido = true;

    [].slice.call(campos).forEach(function (campo) {
        if ($(campo).get(0).tagName == 'SELECT') {
            if (campo.value.trim() == 0 || campo.value.trim() == '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", " + $(campo).attr("name");
            }
        } else if ($(campo).get(0).tagName == 'TEXTAREA') {
            if (campo.value.trim() === '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", " + $(campo).attr("name");
            }
        } else {
            if (campo.value.trim() === '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", " + $(campo).attr("name");
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
function iniciarDesincorporaciones() {
    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");
    var id_cliente = localStorage.getItem("empresa");

    if (id_cliente == 1) {
        var nombre_cliente = "ACHSA";
    } else if (id_cliente == 35) {
        var nombre_cliente = "AMTM";
    } else if (id_cliente == 2) {
        var nombre_cliente = "ATROL";
    } else if (id_cliente == 37) {
        var nombre_cliente = "AULSA";
    } else if (id_cliente == 20) {
        var nombre_cliente = "BUSSI";
    } else if (id_cliente == 3) {
        var nombre_cliente = "CCA";
    } else if (id_cliente == 4) {
        var nombre_cliente = "CISA";
    } else if (id_cliente == 5) {
        var nombre_cliente = "COAVE";
    } else if (id_cliente == 41) {
        var nombre_cliente = "CODIV";
    } else if (id_cliente == 6) {
        var nombre_cliente = "COPE";
    } else if (id_cliente == 7) {
        var nombre_cliente = "CORENSA";
    } else if (id_cliente == 8) {
        var nombre_cliente = "COREV";
    } else if (id_cliente == 9) {
        var nombre_cliente = "COTAN";
    } else if (id_cliente == 10) {
        var nombre_cliente = "COTOBUSA";
    } else if (id_cliente == 39) {
        var nombre_cliente = "COTXS";
    } else if (id_cliente == 22) {
        var nombre_cliente = "ESASA";
    } else if (id_cliente == 11) {
        var nombre_cliente = "MIHSA";
    } else if (id_cliente == 12) {
        var nombre_cliente = "RECSA";
    } else if (id_cliente == 13) {
        var nombre_cliente = "SIMES";
    } else if (id_cliente == 14) {
        var nombre_cliente = "SKYBUS";
    } else if (id_cliente == 15) {
        var nombre_cliente = "STMP";
    } else if (id_cliente == 16) {
        var nombre_cliente = "TCGSA";
    } else if (id_cliente == 17) {
        var nombre_cliente = "TREPSA";
    } else if (id_cliente == 19) {
        var nombre_cliente = "TUZOBUS";
    } else if (id_cliente == 18) {
        var nombre_cliente = "VYCSA";
    } else {
        var nombre_cliente = "N/A";
    }

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select id_cedula from desincorporaciones where DATE(fecha) = ? AND empresa = ?",
                [hoy[0], nombre_cliente],
                function (tx, results) {
                    var length = results.rows.length;
                    if (length == 0) {
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
                                productHandler.addCedulayb(id_usuario, nombre_usuario, fecha_llegada, geolocation, id_cliente, nombre_cliente, horario_programado, estatus, tipo_cedula);

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
                                                productHandler.addDesincorHeader(id_cedula, nombre_cliente, fecha_llegada, estatusd, Usuario, 0, 0);
                                                app.views.main.router.navigate({ name: 'yallegue_desin' });
                                            },
                                            function (tx, error) { }
                                        );
                                    },
                                    function (error) { },
                                    function () { }
                                );
                            }
                        });
                    } else {
                        swal("", "Actualmente ya existe un registro del día de hoy. Puedes acceder a el en la sección de bandeja de salida", "warning");
                    }
                },
                function (tx, error) { }
            );
        },
        function (error) { },
        function () { }
    );
}
function RevisaHeaders() {
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Header_' + empresa;

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

    app.request.get(cordova.file.dataDirectory + "jsons_desin/" + NomJson + ".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null) { } else {
            for (var x = 0; x < content2.length; x++) {
                if (content2[x].Fecha2 == hoy[0]) {
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

function GuardaHeaderDesktop(id, empresa, folio, fecha, estatus, usuarioApertura, usuarioCierre) {
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("SELECT * FROM desincorporaciones WHERE fecha = ? ",
                [fecha],
                function (tx5, results) {
                    var length = results.rows.length;
                    if (length == 0) {
                        var id_usuario = localStorage.getItem("Usuario");
                        var nombre_usuario = localStorage.getItem("nombre");
                        var id_cliente = localStorage.getItem("empresa");
                        var estatus = 0;
                        var geolocation = '';
                        var tipo_cedula = 'Desincorporaciones';
                        productHandler.addCedulayb(id_usuario, nombre_usuario, fecha, geolocation, id_cliente, empresa, fecha, estatus, tipo_cedula);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "Select MAX(id_cedula) as Id from cedulas_general",
                                    [],
                                    function (tx, results) {
                                        var item = results.rows.item(0);
                                        localStorage.setItem("IdCedula", item.Id);
                                        var id_cedula = item.Id;
                                        if (usuarioCierre) {
                                            var estatusd = "Concluido";
                                            productHandler.addDesincorHeader2(id_cedula, empresa, fecha, estatusd, usuarioApertura, 4, id, usuarioCierre);
                                            PintaCedulas(0, "Desincorporaciones");
                                        } else {
                                            var estatusd = "Abierto";
                                            productHandler.addDesincorHeader(id_cedula, empresa, fecha, estatusd, usuarioApertura, 2, id);
                                            PintaCedulas(0, "Desincorporaciones");
                                        }
                                        InsertaDetails(id_cedula, id);
                                    },
                                    function (tx, error) { }
                                );
                            },
                            function (error) { },
                            function () { }
                        );
                    } else {
                        var item2 = results.rows.item(0);
                        var id_cedula = item2.id_cedula;
                        if (usuarioCierre) {
                            var estatusd = "Cerrado";
                            var estatusn = 4;
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE desincorporaciones SET userApertura = ?, userCierre = ?,estatus = ?, estatus_servidor = ?, fecha2 = ? WHERE id_cedula = ?",
                                        [usuarioApertura, usuarioCierre, estatusd, estatusn, fecha, id_cedula],
                                        function (tx, results) {
                                            PintaCedulas(0, "Desincorporaciones");
                                            InsertaDetails(id_cedula, item2.id_servidor);
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                        [fecha, 3, id_cedula],
                                                        function (tx, results) {
                                                        },
                                                        function (tx, error) {
                                                            swal("Error al guardar", error.message, "error");
                                                        }
                                                    );
                                                },
                                                function (error) { },
                                                function () { }
                                            );
                                        },
                                        function (tx, error) { }
                                    );
                                },
                                function (error) { },
                                function () { }
                            );
                        } else {
                            var estatusd = "Abierto";
                            var estatus = 2;
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE desincorporaciones SET userApertura = ?, userCierre = ?,estatus = ?, estatus_servidor = ?, fecha2 = ? WHERE id_cedula = ?",
                                        [usuarioApertura, usuarioCierre, estatusd, estatusn, fecha, id_cedula],
                                        function (tx, results) {
                                            PintaCedulas(0, "Desincorporaciones");
                                            InsertaDetails(id_cedula, item2.id_servidor);
                                        },
                                        function (tx, error) { }
                                    );
                                },
                                function (error) { },
                                function () { }
                            );
                        }
                    }
                },
                function (tx5, error) {
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function PintaCedulas(estatus, tipo) {
    if (tipo == "Desincorporaciones") {
        databaseHandler.db.transaction(
            function (tx5) {
                tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                    [estatus, tipo],
                    function (tx5, results) {
                        var length = results.rows.length;
                        var html = '';
                        for (var i = 0; i < length; i++) {
                            var item2 = results.rows.item(i);
                            var fechas = item2.fecha_entrada.split(" ");
                            var html = html + `<li id='conc${item2.id_cedula}'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> ${item2.nombre_cliente + "| " + fechas[0]}</div> </div><div class='item-after'><a href='#' onclick='continuarCed(${item2.id_cedula},3);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;</div></div></div></li>`;
                        }
                        $("#pendientes").html(html);
                    },
                    function (tx5, error) {
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    } else if (tipo == "Recaudo") {
        databaseHandler.db.transaction(
            function (tx5) {
                tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                    [estatus, tipo],
                    function (tx5, results) {
                        var length = results.rows.length;
                        var html = '';
                        for (var i = 0; i < length; i++) {
                            var item2 = results.rows.item(i);
                            var fechas = item2.fecha_entrada.split(" ");
                            var html = html + "<li id='conc" + item2.id_cedula + "'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> " + item2.nombre_cliente + "| " + fechas[0] + "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Recaudo</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,4);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula + ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>";
                        }
                        $("#pendientes").html(html);
                    },
                    function (tx5, error) {
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );
            },
            function (error) { console.error("Error al consultar bandeja de salida: " + error.message); },
            function (error) { console.error("Error al consultar bandeja de salida: " + error.message); }
        );
    }
}
function InsertaDetails(id_cedula, id_servidor) {
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Details_' + empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_desin/" + NomJson + ".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null) { } else {
            for (var x = 0; x < content2.length; x++) {
                if (id_servidor == content2[x].IDCabecero) {
                    productHandler.addDetailsDes(content2[x].ID, content2[x].IDCabecero, content2[x].Apoyo, content2[x].JornadasNoIncorporadas, content2[x].HoraD, content2[x].HoraI, content2[x].UnidadDID, content2[x].UnidadD, content2[x].UnidadIID, content2[x].UnidadI, content2[x].Itinerario, content2[x].Motivo, content2[x].Falla, content2[x].SentidoD, content2[x].SentidoI, content2[x].UbicacionD, content2[x].Incumplimiento, content2[x].OperadorD, content2[x].OperadorI, content2[x].KmD, content2[x].KmI, content2[x].KmPerdidos, content2[x].FolioD, content2[x].FolioI, content2[x].UsuarioI, content2[x].UsuarioD, content2[x].HoraCapturaD, content2[x].HoraCapturaI, content2[x].Origen, content2[x].UbicacionI, content2[x].JornadaSinIncorporacion, x, content2.length, id_cedula)
                }
            }
        }
    });
    var NomJson2 = 'DetailsApoyos_' + empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_desin/" + NomJson2 + ".json", function (data) {
        var content3 = JSON.parse(data);
        if (content3 == null) { } else {
            for (var x = 0; x < content3.length; x++) {
                if (id_servidor == content3[x].IDCabecero) {
                    productHandler.addDetailsApoyo(content3[x].ID, content3[x].IDCabecero, content3[x].Apoyo, content3[x].TipoUnidad, content3[x].Hora, content3[x].UnidadID, content3[x].Unidad, content3[x].Ubicacion, content3[x].Itinerario, content3[x].TramoDeApoyo, content3[x].Sentido, content3[x].kilometrajeUnidad, content3[x].kilometrajeApoyo, content3[x].Operador, content3[x].Usuario, content3[x].HoraCaptura, content3[x].Origen, x, content3.length, id_cedula)
                }
            }
        }
    });
}
function GuardaIncorporacion() {
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
                if ($("#check_jornada").prop("checked") == true) {
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
                                if (item.estatus_servidor == 0) {
                                    var new_estatus = 1;
                                } else if (item.estatus_servidor == 2) {
                                    var new_estatus = 3;
                                }
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "UPDATE desincorporacionesD SET HoraInc = ?, UnidadIncID = ?, UnidadInc = ?, SentidoInc = ?, UbicacionInc = ?, Inclumplimiento = ?, OperadorInc = ?, KmInc = ?, FolioInc = ?, Usuarioinc = ?, KmPerdidos = ?, HoraIncR = ?, estatus_servidor = ?, id_operador_inc = ?, jornadaSIncorporacion = ? WHERE id_cedula = ? AND id_desD = ?",
                                            [HoraInc, UnidadIncID, UnidadInc, SentidoInc, UbicacionInc, Inclumplimiento, OperadorInc, KmInc, FolioInc, Usuarioinc, KmPerdidos, fecha, new_estatus, id_operador_inc, jornadaSIncorporacion, id_cedula, id_desD],
                                            function (tx, results) {
                                                swal("", "Guardado correctamente", "success");
                                                setTimeout(function () {
                                                    swal.close();
                                                    app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
                                                }, 1500);
                                            },
                                            function (tx, error) { }
                                        );
                                    },
                                    function (error) { },
                                    function () { }
                                );
                            },
                            function (tx, error) { }
                        );
                    },
                    function (error) { },
                    function () { }
                );
            }
        });
    } else {
        swal("", "Debes llenar estos campos para poder guardar: " + quita_coma, "warning");
        return false;
    }
}
function IncorporarUnidad(val) {
    localStorage.setItem("detalle_incorpora", val);
    app.views.main.router.back('/formDesin2/', { force: true, ignoreCache: true, reload: true });
}
function VerDetalleDesinc(val) {
    localStorage.setItem("detalle_incorpora", val);
    app.views.main.router.back('/formDesin3/', { force: true, ignoreCache: true, reload: true });
}
function RefreshDataSustitucion() {
    var onestep = localStorage.getItem("one_step");
    localStorage.setItem("tap_refresh", 1);
    if (!onestep) {
        localStorage.setItem("one_step", 1);
        swal("Actualizando...!", "...", "success");
        EnvioDatosTrafico();

        setTimeout(function () {
            localStorage.removeItem("one_step");
        }, 3000)
    }
}
function CerrarReporte() {
    var MyDate = new Date();
    var time1 = ('0' + MyDate.getHours()).slice(-2) + ":" + ('0' + MyDate.getMinutes()).slice(-2) + ":" + ('0' + MyDate.getSeconds()).slice(-2);

    const date1 = new Date('2023-01-01 ' + time1);
    const date2 = new Date('2023-01-01 23:00');
    const date3 = new Date('2023-01-01 03:00');

    if (date1.getTime() < date2.getTime() && date1.getTime() > date3.getTime()) {
        swal("", "Este botón solo estará activo después de las 23 horas", "warning");
        return false;
    }

    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("SELECT id_cedula FROM desincorporacionesD WHERE id_cedula = ? AND jornadaSIncorporacion IS NULL",
                [id_cedula],
                function (tx5, results) {
                    var length = results.rows.length;
                    if (length == 0) { } else {
                        swal("", "Aún tienes jornadas que no se han incorporado, debes cerrarlas para poder finalizar el reporte.", "warning");
                        return false;
                    }
                },
                function (tx5, error) {
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
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
                function (tx) {
                    tx.executeSql("UPDATE desincorporaciones SET fecha2  = ?, userCierre = ?, Estatus = ?, estatus_servidor = ? WHERE id_cedula = ?",
                        [fecha_salida, usuarioCierre, cierre, 3, id_cedula],
                        function (tx, results) {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                        [fecha_salida, estatus, id_cedula],
                                        function (tx, results) {
                                            window.location.href = "./menu.html";
                                        },
                                        function (tx, error) {
                                            swal("Error al guardar", error.message, "error");
                                        }
                                    );
                                },
                                function (error) { },
                                function () { }
                            );
                        },
                        function (tx, error) {
                            swal("Error al guardar", error.message, "error");
                        }
                    );
                },
                function (error) { },
                function () { }
            );
        }
    });
}
function CambiaBolita(id, estatus) {
    if (estatus == 2) {
        $("#bol_" + id).css("color", "#F39C12");
    } else if (estatus == 4) {
        $("#bol_" + id).css("color", "#2ECC71");
    }
}
function CambiaBolita2(id, estatus) {
    if (estatus == 1) {
        $("#bolac_" + id).css("color", "#F39C12");
    } else if (estatus == 4) {
        $("#bolac_" + id).css("color", "#2ECC71");
    }
}
function edit_folio(id, folio) {
    localStorage.setItem("Folio", folio);
    localStorage.setItem("id_detalle_folio", id);
    if (folio == 1) {
        app.views.main.router.back('/formDesin4/', { force: true, ignoreCache: true, reload: true });
    } else if (folio == 2) {
        app.views.main.router.back('/formDesin4/', { force: true, ignoreCache: true, reload: true });
    }
}
function ActualizaFolio() {
    var id_desD = $("#id_des").val();
    var folio = localStorage.getItem("Folio");
    var id_cedula = localStorage.getItem("IdCedula");

    var Inclumplimiento = $("#incumplimiento").val();
    var Folios = $("#folio_inicial").val();
    var km_perdidos = $("#km_perdidos").val();

    var estatus_s = $("#estatus_servidor").val();
    if (estatus_s == 4) {
        var estatus_servidor = 3;
    } else {
        estatus_servidor = estatus_s;
    }

    if (folio == 1) {
        var sql = "UPDATE desincorporacionesD SET FolioDes = ?, Inclumplimiento = ?, KmPerdidos = ?, estatus_servidor = ? WHERE id_cedula = ? AND id_desD = ?";
    } else if (folio == 2) {
        var sql = "UPDATE desincorporacionesD SET FolioInc = ?, Inclumplimiento = ?, KmPerdidos = ?, estatus_servidor = ? WHERE id_cedula = ? AND id_desD = ?";
    }

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                sql,
                [Folios, Inclumplimiento, km_perdidos, estatus_servidor, id_cedula, id_desD],
                function (tx, results) {
                    swal("", "Guardado correctamente", "success");
                    setTimeout(function () {
                        swal.close();
                        app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
                    }, 1500);
                },
                function (tx, error) { }
            );
        },
        function (error) { },
        function () { }
    );
}
function check_hour(val) {
    var horades = $("#hora_des").val();
    if (horades <= val) { } else {
        swal("", "La hora no puede ser menor a la hora de desincorporación.", "warning");
        $("#hora_inc").val("");
    }
}
function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function numberWithZeros(num) {
    if (num.split(".").length == 1) {
        return num + ".00";
    } else {
        return num;
    }
}

function NuevoApoyo() {
    app.views.main.router.back('/formDesin5/', { force: true, ignoreCache: true, reload: true });
}

function GuardarTRFApoyos() {
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
        if ($("#TipoUnidad").prop("checked") == true) {
            var TipoUnidad = 1;
        } else {
            var TipoUnidad = 0;
        }
        if ($("#Apoyo").prop("checked") == true) {
            var Apoyo = 1;
        } else {
            var Apoyo = 0;
        }

        var estatus_servidor = 0;
        var id_servidor = 0;
        var HoraCaptura = getDateWhitZeros();

        if (Apoyo == 0 && TipoUnidad == 0) {
            swal("", "Debes marcar una opción del tipo de apoyo.", "warning");
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
                if ($("#id_apoyo").val()) {
                    var id_apoyo = $("#id_apoyo").val();
                    if ($("#estatus_servs").val() == 0) {
                        estatus_servidor = 0;
                    } else if ($("#estatus_servs").val() == 2) {
                        estatus_servidor = 1;
                    } else if ($("#estatus_servs").val() == 4) {
                        estatus_servidor = 1;
                    }
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "UPDATE TRFapoyo SET TramoDeApoyo = ?, kilometrajeApoyo = ?, estatus_servidor = ? WHERE id_apoyo = ?",
                                [TramoDeApoyo, kilometrajeApoyo, estatus_servidor, id_apoyo],
                                function (tx, results) {
                                    swal("", "Guardado correctamente", "success");
                                    setTimeout(function () {
                                        swal.close();
                                        app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
                                    }, 1500);
                                },
                                function (tx, error) { console.error("Error al consultar bandeja de salida: " + error.message); }
                            );
                        },
                        function (error) { console.error("Error al consultar bandeja de salida: " + error.message); },
                        function (error) { console.error("Error al consultar bandeja de salida: " + error.message); }
                    );
                } else {
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "insert into TRFapoyo (id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo],
                                function (tx, results) {
                                    swal("", "Guardado correctamente", "success");
                                    setTimeout(function () {
                                        swal.close();
                                        app.views.main.router.back('/yallegue_desin/', { force: true, ignoreCache: true, reload: true });
                                    }, 1500);
                                },
                                function (tx, error) { console.error("Error al consultar bandeja de salida: " + error.message); }
                            );
                        },
                        function (error) { console.error("Error al consultar bandeja de salida: " + error.message); },
                        function (error) { console.error("Error al consultar bandeja de salida: " + error.message); }
                    );
                }
            }
            // TRFapoyo(id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo);
        });
    } else {
        swal("", "Debes llenar estos campos para poder guardar: " + quita_coma, "warning");
        return false;
    }
}

function edit_apoyo(val, estatus) {
    localStorage.setItem("id_detalle_folio", val);
    localStorage.setItem("estatus_servs", estatus);
    app.views.main.router.back('/formDesin5/', { force: true, ignoreCache: true, reload: true });
}
function sincronizaDatos() {
    var EmpresaID = localStorage.getItem("empresa");
    // var urlBase2 = "http://192.168.100.4/Desarrollo/CISAApp";
    var urlBase2 = "http://mantto.ci-sa.com.mx/www.CISAAPP.com";
    var url = urlBase2 + "/Exec/datos_desin.php?empresa=" + EmpresaID;
    var url2 = urlBase2 + "/Exec/datos_desin_H.php?empresa=" + EmpresaID;

    fetch(url)
        .then((response) => {
        });

    fetch(url2)
        .then((response) => {
        });
    // console.log("Sincroniza datos")
}
function CheckApoyoTipo(val) {
    if (val == 0) {
        var valCheck = document.getElementById("TipoUnidad").checked;
        if (valCheck == true) {
            document.getElementById("Apoyo").checked = false;
        }
    } else {
        var valCheck = document.getElementById("Apoyo").checked;
        if (valCheck == true) {
            document.getElementById("TipoUnidad").checked = false;
        }
    }
}
function getIDEmpresa(val) {
    if (val == "ACHSA") {
        return 1;
    } else if (val == "AMTM") {
        return 35;
    } else if (val == "ATROL") {
        return 2;
    } else if (val == "AULSA") {
        return 37;
    } else if (val == "BUSSI") {
        return 20;
    } else if (val == "CCA") {
        return 3;
    } else if (val == "CISA") {
        return 4;
    } else if (val == "COAVE") {
        return 5;
    } else if (val == "CODIV") {
        return 41;
    } else if (val == "COPE") {
        return 6;
    } else if (val == "CORENSA") {
        return 7;
    } else if (val == "COREV") {
        return 8;
    } else if (val == "COTAN") {
        return 9;
    } else if (val == "COTOBUSA") {
        return 10;
    } else if (val == "COTXS") {
        return 39;
    } else if (val == "ESASA") {
        return 22;
    } else if (val == "MIHSA") {
        return 11;
    } else if (val == "RECSA") {
        return 12;
    } else if (val == "SIMES") {
        return 13;
    } else if (val == "SKYBUS") {
        return 14;
    } else if (val == "STMP") {
        return 15;
    } else if (val == "TCGSA") {
        return 16;
    } else if (val == "TREPSA") {
        return 17;
    } else if (val == "TUZOBUS") {
        return 19;
    } else if (val == "VYCSA") {
        return 18;
    } else if (val == "REFORMA") {
        return 40;
    } else if (val == "logo1") {
        return 0;
    }
}

//Inicio HMO
//Inicio Capacitacion 
function validarRadioCapa(id, val, valor, OpCorrecta) {
    var ids = id.split("-");
    var check = ids[1];
    var valCheck = document.getElementById(ids[0] + "-" + ids[1]).checked;
    if (check.includes('1')) {
        if (valCheck == true) {
            var checkcheck = ids[0] + "-1";
            var otherCheck = ids[0] + "-0";
            document.getElementById(otherCheck).checked = false;
            $("#label-" + checkcheck).addClass("checked");
            $("#label-" + otherCheck).removeClass("checked");
        }
    } else {
        if (valCheck == true) {
            var otherCheck = ids[0] + "-1";
            var checkcheck = ids[0] + "-0";
            document.getElementById(otherCheck).checked = false;
            $("#label-" + checkcheck).addClass("checked");
            $("#label-" + otherCheck).removeClass("checked");
        }
    }
    if (val) {
        if (val == 1) {
            actualizaRespuestaCiertoFalso(id);
        } else if (val == 2) {
            actualizaRespuestaSiNoPuntuacion(id, valor, OpCorrecta);
        }
    }
}

function validarRadioCapaMultiple(id, val, FK_IDPregunta) {
    $(".in_" + FK_IDPregunta).prop("checked", false)
    $(".rad_" + FK_IDPregunta).removeClass("checked");
    document.getElementById(id).checked = true;
    $("#label-" + id).addClass("checked");
    if (val) {
        if (val == 1) {
            actualizaRespuestasMultiples(id, FK_IDPregunta);
        }
    }
}

function actualizaRespuestasMultiples(id, FK_IDPregunta) {
    var id_cedula = localStorage.getItem("IdCedula");
    var respuestas = id.split("-");
    var respuesta = respuestas[1]
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE CAP_RespuestasMultiple SET Respuesta = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta, id_cedula, FK_IDPregunta],
                function (tx, results) {

                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function actualizaRespuestaCiertoFalso(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes('1')) {
        var respuesta = 1;
        var id_pregunta = ids[0].replace('op', '');

    } else if (check.includes('0')) {
        var respuesta = 0;
        var id_pregunta = ids[0].replace('op', '');
    }
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE cursoCiertoFalso SET respuesta = ? WHERE id_cedula = ? AND IDPregunta = ?",
                [respuesta, id_cedula, id_pregunta],
                function (tx, results) {
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function generaEvaluacion(val) {
    console.log(val)
    if (val == 1) {
        app.sheet.close('#sheet-modal-1');
        localStorage.setItem("SaltoCurso", 1);
        app.views.main.router.back('/formCapacita1/', { force: true, ignoreCache: true, reload: true })
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

        var fechas = fecha_llegada.split(" ");
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
        var OpDiario = localStorage.getItem("OpDiario");
        var Prueba = 0

        productHandler.addCedula(id_usuario, nombre_usuario, fecha_llegada, id_course, id_cliente, nombre_cliente, horario_programado, estatus, tipo_cedula, nombre_evalua, geolocation);
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
                        if (IDTipoCurso == 1) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba, OpDiario);
                            var NomJson = 'CursoCiertoFalso' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasCiertoFalso(id_cedula, data[j].IDPregunta, data[j].Pregunta, data[j].texto1, data[j].texto2, data[j].OpCorrecta, id_course, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 2) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba, OpDiario);
                            var NomJson = 'CursoSiNoValor' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasSiNoValor(id_cedula, data[j].IDPregunta, data[j].Pregunta, id_course, data[j].OpCorrecta, data[j].Valor, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 3) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba, OpDiario);
                            var NomJson = 'PreguntasMultiple_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(id_cedula, data[j].IDPregunta, data[j].Pregunta, data[j].Justifica, id_course, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                            var NomJson2 = 'RespuestasMultiples_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(id_cedula, data[j].ID, data[j].FK_Pregunta, data[j].Opcion, data[j].Correcta, data[j].Image, id_course);
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 4) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba, OpDiario);
                            var NomJson = 'PreguntasMultiple_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(id_cedula, data[j].IDPregunta, data[j].Pregunta, data[j].Justifica, id_course, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                            var NomJson2 = 'RespuestasMultiples_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(id_cedula, data[j].ID, data[j].FK_Pregunta, data[j].Opcion, data[j].Correcta, data[j].Image, id_course);
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 5) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba, OpDiario);
                        }
                    },
                    function (tx, error) {
                        console.log("Error al guardar cedula: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    }
}

function guardarCursoCiertoFalsoPuntuacion(){
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1 : apto = 0;

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_RespuestasSiNoPuntuacion where id_cedula= ? AND Respuesta is null",
                [id_cedula],
                function(tx, results){
                    var item3 = results.rows.item(0);
                    if(item3.cuenta > 0){
                        swal("", "Aún faltan preguntas por contestar", "warning");
                        return false
                    } else {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                                    [apto, observaciones, firmaInstructor, id_cedula],
                                    function (tx, results) {
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
                                                    function (tx) {
                                                        tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                            [fecha_salida, estatus, id_cedula],
                                                            function (tx, results) {
                                                                window.location.href = "./menu.html";
                                                            },
                                                            function (tx, error) {
                                                                swal("Error al guardar", error.message, "error");
                                                            }
                                                        );
                                                    },
                                                    function (error) { },
                                                    function () { }
                                                );
                                            }
                                        });
                                    },
                                    function (tx, error) {
                                        console.error("Error al guardar cierre: " + error.message);
                                    }
                                );
                            },
                            function (error) { },
                            function () { }
                        );
                    }
                }
            );
        },
        function(error){},
        function(){}
    );
}

function guardarCursoCiertoFalso() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1 : apto = 0;

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from cursoCiertoFalso where id_cedula= ? AND Respuesta is null",
                [id_cedula],
                function(tx, results){
                    var item3 = results.rows.item(0);
                    if(item3.cuenta > 0){
                        swal("", "Aún faltan preguntas por contestar", "warning");
                        return false
                    } else {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                                    [apto, observaciones, firmaInstructor, id_cedula],
                                    function (tx, results) {
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
                                                    function (tx) {
                                                        tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                            [fecha_salida, estatus, id_cedula],
                                                            function (tx, results) {
                                                                window.location.href = "./menu.html";
                                                            },
                                                            function (tx, error) {
                                                                swal("Error al guardar", error.message, "error");
                                                            }
                                                        );
                                                    },
                                                    function (error) { },
                                                    function () { }
                                                );
                                            }
                                        });
                                    },
                                    function (tx, error) {
                                        console.error("Error al guardar cierre: " + error.message);
                                    }
                                );
                            },
                            function (error) { },
                            function () { }
                        );
                    }
                }
            );
        },
        function(error){},
        function(){}
    );
}

function gfirma(val) {
    var signaturePad = testFirma;
    var data = signaturePad.toDataURL('data:image/jpeg;base64,');
    screen.orientation.lock('portrait');
    // screen.orientation.unlock();
    $("#signate").val(data);
    $('#ImagenFirmaView').attr('src', data);
    $('#VolverFirmar').html("Evidencia");
    $("#VolverAFirmar").html("Volver a Firmar <i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;'>border_color</i>");
    if (val) {
        var element = document.querySelector(".page-content");
        element.scrollTop = element.scrollHeight;
    }
}

function getPromedio(respuesta, length) {
    var promedio = respuesta * 100;
    promedio = promedio / length;
    return promedio.toFixed(2);
}

function generarAsistencia() {
    var fechas = getDateWhitZeros();
    var fecha = fechas.split(" ");
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql("SELECT COUNT(id_cedula) as cuenta FROM asistenciaHeader WHERE fecha = ? ",
                [fecha[0]],
                function (tx5, results) {
                    var item2 = results.rows.item(0);
                    var count = item2.cuenta;
                    if (count == 0) {
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
                        productHandler.addCedula(id_usuario, nombre_usuario, fecha_llegada, id_course, id_cliente, nombre_cliente, horario_programado, estatus, tipo_cedula, nombre_evalua, geolocation);
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
                                        var NomJson = 'BecariosVsInstructor_' + empresa;
                                        app.request({
                                            url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                            method: 'GET',
                                            dataType: 'json',
                                            success: function (data) {
                                                var aux = 0;
                                                var aux2 = 0;
                                                for (var j = 0; j < data.length; j++) {
                                                    if (data[j].FKPersonalInstructor == id_instructor) {
                                                        aux++;
                                                    }
                                                }
                                                if (aux == 0) {
                                                    app.dialog.close();
                                                    swal("", "Algo salió mal. No tienes Becarios Asignados.", "error");
                                                } else {
                                                    dialog.setText('1 de ' + aux);
                                                    for (var j = 0; j < data.length; j++) {
                                                        if (data[j].FKPersonalInstructor == id_instructor) {
                                                            aux2++;
                                                            // asistenciaDetails(id_cedula integer, fecha text, id_becario int,claveBecario, nameBecario, asiste int, fechaCaptura text)
                                                            productHandler.asistenciaDetails(id_cedula, fecha[0], data[j].ID, data[j].claveBecario, data[j].nameBecario, 0, fecha_captura, aux, aux2);
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
                            function (error) { },
                            function () { }
                        );

                    } else {
                        swal("", "Ya existe una asistencia registrada", "warning")
                    }
                },
                function (tx5, error) { console.error("Error al consultar bandeja de salida: " + error.message); }
            );
        },
        function (error) { },
        function () { }
    );
}

function actualizaLista(id) {
    var id_asistenciaD = id.replace('cb3-', '');
    var assite = 0;
    $("#" + id).prop("checked") == true ? assite = 1 : assite = 0;
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE asistenciaDetails SET asiste = ? WHERE id_asistenciaD = ?",
                [assite, id_asistenciaD],
                function (tx, results) {
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function guardarAsistencia() {
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
                function (tx) {
                    tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                        [fecha_salida, estatus, id_cedula],
                        function (tx, results) {
                            window.location.href = "./menu.html";
                        },
                        function (tx, error) {
                            swal("Error al guardar", error.message, "error");
                        }
                    );
                },
                function (error) { },
                function () { }
            );
        }
    });
}

function verSeguimientoCapacitacion(ID, FKPersonalBecario, nameBecario) {
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
        swipeToClose: false,
        closeByOutsideClick: false,
        closeByBackdropClick: false,
        closeOnEscape: false,
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

function LLamarCursos(ID, FKPersonalBecario, nameBecario) {
    app.sheet.close('#sheet-modal');
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'BecariosCursos_' + empresa;
    var html = '';
    localStorage.setItem("nameBecario", nameBecario)
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].FK_Becario == FKPersonalBecario) {
                        if (data[j].Certificadora == 0) {
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
                    swipeToClose: false,
                    closeByOutsideClick: false,
                    closeByBackdropClick: false,
                    closeOnEscape: false,
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

function LLamarIMTES(ID, FKPersonalBecario, nameBecario) {
    app.sheet.close('#sheet-modal');
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'BecariosCursos_' + empresa;
    var html = '';
    localStorage.setItem("nameBecario", nameBecario)
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].FK_Becario == FKPersonalBecario) {
                        if (data[j].Certificadora == 1) {
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
                    swipeToClose: false,
                    closeByOutsideClick: false,
                    closeByBackdropClick: false,
                    closeOnEscape: false,
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

function GenerarCurso(IDMov, FK_Becario, IDCurso, IDTipoCurso, OpDiario, NombreCurso, Realizado, costo) {
    localStorage.setItem("IDMov", IDMov);
    localStorage.setItem("FK_Becario", FK_Becario);
    localStorage.setItem("IDCurso", IDCurso);
    localStorage.setItem("IDTipoCurso", IDTipoCurso);
    localStorage.setItem("OpDiario", OpDiario);
    localStorage.setItem("NombreCurso", NombreCurso);
    localStorage.setItem("Costo", costo);

    if (OpDiario == 1) {
        generaEvaluacion(IDCurso)
    } else {
        if (Realizado == 1) {
            app.sheet.close('#sheet-modal-1');
            app.sheet.close('#sheet-modal-2');
            var empresa = localStorage.getItem("empresa");
            var NomJson = 'DatosEvaluacionS_' + empresa;
            var html = `<div class="card-content">
                <div class="card" style="text-align: center;padding-left: 15px;padding-right: 15px;border: 1px solid #005D99;border-radius: 10px;">
                    <span class="span FWM-span-form">Evaluacion no disponible</span>
                </div></div>`;
            let encontro = false
            app.request({
                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    var length = data.length;
                    if (length == 0) {
                        segundaBusqueda22(IDCurso, FK_Becario)
                    } else {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario) {
                                encontro = true
                                var check = ''
                                data[j].apto == 1 ? check = 'checked' : check = '';
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
                        if(!encontro){
                            segundaBusqueda22(IDCurso, FK_Becario)
                        } else {
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
                                swipeToClose: false,
                                closeByOutsideClick: false,
                                closeByBackdropClick: false,
                                closeOnEscape: false,
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
                }
            });
        } else {
            generaEvaluacion(IDCurso);
        }

    }
}

function segundaBusqueda22(IDCurso, FK_Becario){
    console.log("ff")
    var empresa = localStorage.getItem("empresa");
    var html = ''
    var NomJson = 'DatosEvaluacionD_' + empresa;
    let encontro = false
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario) {
                        console.log(encontro)
                        encontro = true
                        var check = ''
                        data[j].apto == 1 ? check = 'checked' : check = '';
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
                if(!encontro){
                    console.log("No enconro", IDCurso, FK_Becario)
                } else {
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
                         swipeToClose: false,
                         closeByOutsideClick: false,
                         closeByBackdropClick: false,
                         closeOnEscape: false,
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
        }
    });
}

function actualizaRespuestaSiNoPuntuacion(id, valor, OpCorrecta) {
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes('1')) {
        var respuesta = 1;
        var id_pregunta = ids[0].replace('op', '');
        // if (OpCorrecta == 1) {
        //     var prePunto = 1 * valor;
        // } else {
        //     if(Number($("#calificacion_number").val()) == 0){
        //         var prePunto = 0
        //     } else {
        //         if($("#"+checK1).prop("checked") == true || $("#"+checK2).prop("checked") == true){
        //             var prePunto = -1 * valor;
        //         } else {
        //             var prePunto = 0
        //         }
        //     }
        // }

    } else if (check.includes('0')) {
        var respuesta = 0;
        var id_pregunta = ids[0].replace('op', '');
        // if (OpCorrecta == 0) {
        //     var prePunto = 1 * valor;
        // } else {
        //     if(Number($("#calificacion_number").val()) == 0){
        //         var prePunto = 0
        //     } else {
        //         if($("#"+checK1).prop("checked") == true || $("#"+checK2).prop("checked") == true){
        //             var prePunto = -1 * valor;
        //         } else {
        //             var prePunto = 0
        //         }
        //     }
        // }
    }

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE CAP_RespuestasSiNoPuntuacion SET Respuesta = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta, id_cedula, id_pregunta],
                function (tx, results) {
                    databaseHandler.db.transaction(
                        function(tx){
                            tx.executeSql(
                                "Select SUM(Valor) as cuenta from CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ? AND Respuesta = OpCorrecta AND Respuesta IS NOT NULL",
                                [id_cedula],
                                function(tx, results){
                                    var item3 = results.rows.item(0);
                                    $("#calificacion_number").val(item3.cuenta)
                                    getCalificacionCursoValor(item3.cuenta)
                                }
                            );
                        },
                        function(error){},
                        function(){}
                    );
                },
                function (tx, error) {
                    console.error("Error al guardar: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function sincronizaDatosCapacitacion() {
    let EmpresaID = 1
    let paso = 1;
    // let urlBase2 = "http://192.168.100.4/Desarrollo/CISAApp/HMOFiles/Exec";
    var urlBase2 = "http://172.16.0.143/Desarrollo/CISAApp/HMOFiles/Exec";
    // var urlBase2 = "http://mantto.ci-sa.com.mx/www.CISAAPP.com";
    let url = urlBase2 + "/capacitacion/datos.php?empresa=" + EmpresaID + "&paso=" + paso;

    fetch(url)
        .then((response) => {
            console.log("Sincroniza datos OK!")
            eliminaCache();
        });
}

function guardarCursoMultiple() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1 : apto = 0;

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_RespuestasMultiple where id_cedula= ? AND Respuesta is null",
                [id_cedula],
                function(tx, results){
                    var item3 = results.rows.item(0);
                    if(item3.cuenta > 0){
                        swal("", "Aún faltan preguntas por contestar", "warning");
                        return false
                    } else {
                        $("#PuntosCurso").val(0)
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "Select FK_IDPregunta, Respuesta from CAP_RespuestasMultiple where id_cedula= ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        var FK_IDPregunta = ''
                                        var Respuesta = ''
                                        for (var i = 0; i < length; i++) {
                                            var item2 = results.rows.item(i);
                                            FK_IDPregunta = item2.FK_IDPregunta
                                            Respuesta = item2.Respuesta
                                            getOpcionesMultiples(FK_IDPregunta, Respuesta, length)
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                                                    [apto, observaciones, firmaInstructor, id_cedula],
                                                    function (tx, results) {
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
                                                                    function (tx) {
                                                                        tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                                            [fecha_salida, estatus, id_cedula],
                                                                            function (tx, results) {
                                                                                window.location.href = "./menu.html";
                                                                            },
                                                                            function (tx, error) {
                                                                                swal("Error al guardar", error.message, "error");
                                                                            }
                                                                        );
                                                                    },
                                                                    function (error) { },
                                                                    function () { }
                                                                );
                                                            }
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.error("Error al guardar cierre: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) { },
                                            function () { }
                                        );
                                    }
                                );
                            },
                            function (error) { },
                            function () { }
                        );
                    }
                }
            );
        },
        function(error){},
        function(){}
    );
}
function getOpcionesMultiples(FK_IDPregunta, Respuesta, length2) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select * from CAP_OPMultipleOpts where id_cedula= ? AND FK_IDPregunta = ?",
                [id_cedula, FK_IDPregunta],
                function (tx, results) {
                    var length = results.rows.length;
                    var letter = 64
                    let puntos = Number($("#PuntosCurso").val())
                    for (var j = 0; j < length; j++) {
                        letter++
                        var item3 = results.rows.item(j);
                        Respuesta == letter && item3.Correcta == 1 ? puntos++ : null;
                    }
                    let promedio = (puntos * 100) / length2
                    $("#PuntosCurso").val(puntos)
                    actualizaPromedio2(promedio.toFixed(2))
                }
            );
        },
        function (error) { },
        function () { }
    );
}
function verDetalleCapacitacion(ID, FKPersonalBecario, nameBecario) {
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'BecariosCursos_' + empresa;
    var html = ''
    var coursesHTML = ''
    var imtesHTML = ''
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].FK_Becario == FKPersonalBecario) {
                    let check = ''
                    let apto = ''
                    data[j].aprobado == 1 ? apto = 'checked' : apto = ''
                    data[j].realizado == 1 ? check = 'checked' : check = ''
                    if (data[j].Certificadora == 0) {
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
                swipeToClose: false,
                closeByOutsideClick: false,
                closeByBackdropClick: false,
                closeOnEscape: false,
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

function GuardarPhoto() {
    //CAP_Evidencias( id_cedula integer, evidencia blob, fecha text
    var id_cedula = localStorage.getItem("IdCedula");
    var foto = $("#imagenC").val();
    if (foto) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("INSERT INTO CAP_Evidencias(id_cedula,evidencia,fecha) VALUES (?,?,?)",
                    [id_cedula, foto, getDateWhitZeros()],
                    function (tx, results) {
                        databaseHandler.db.transaction(
                            function (tx1) {
                                tx1.executeSql(
                                    "Select * from CAP_Evidencias where id_cedula= ? ORDER BY id_evidencia DESC LIMIT 1",
                                    [id_cedula],
                                    function (tx, results) {
                                        var item = results.rows.item(0);
                                        $("#evidencias_div").css("display", "none")
                                        $("#div_botones_camara").html(`<div style="min-width: 50px; border-style: none;">
                                            <span class="resize-handler"></span>
                                            <a href="#" onclick="ValidarCapturePhoto()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                                Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                                            </a>
                                        </div>`)
                                        $("#imagenC").val('');
                                        swal("", "Foto guardada correctamente", "success");
                                        $("#facturas").append("<tr id='fila" + item.id_evidencia + "'><td style='text-align: center;'><img src='" + item.evidencia + "' width='60px' style='margin-top: 4px;'/></td><td style='text-align: center;'><a href='#' onclick='eliminarFilaFoto(" + item.id_evidencia + ",1);' style='border: none; outline:none;'><i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;color:#FF0037;font-size: 40px;'>delete_forever</i></a></td></tr>");
                                        $("#message-nr").css("display", "none");
                                    }
                                );
                            },
                            function (error) { },
                            function () { }
                        );
                    },
                    function (tx, error) {
                    }
                );
            }, function (error) { }, function () {
            }
        );
    } else {
        swal("", "Debes tomar una fotografía de la factura(s):", "warning");
    }
}

function ValidarCapturePhoto() {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx1) {
            tx1.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_Evidencias where id_cedula= ?",
                [id_cedula],
                function (tx, results) {
                    var item = results.rows.item(0);
                    if (item.cuenta <= 2) {
                        capturePhoto()
                    } else {
                        swal("", "Solo puedes agregar máx. 3 fotos", "warning")
                    }
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function eliminarFilaFoto(index, val) {
    if (val == 1) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "DELETE FROM CAP_Evidencias WHERE id_evidencia = ?",
                    [index],
                    function (tx, results) {
                        swal("", "El registro se elimino satisfactoriamente", "success");
                        $("#fila" + index).remove();
                    },
                    function (tx, error) {
                        swal("Error al eliminar registro", error.message, "error");
                    }
                );
            },
            function (error) { },
            function () { }
        );
    }
}

function guardarCursoEvidencias() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? apto = 1 : apto = 0;

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_Evidencias where id_cedula= ?",
                [id_cedula],
                function(tx, results){
                    var item3 = results.rows.item(0);
                    if(item3.cuenta < 0){
                        swal("", "Aún no haz agregado evidencias", "warning");
                        return false
                    } else {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql("UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
                                    [apto, observaciones, firmaInstructor, id_cedula],
                                    function (tx, results) {
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
                                                    function (tx) {
                                                        tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                            [fecha_salida, estatus, id_cedula],
                                                            function (tx, results) {
                                                                window.location.href = "./menu.html";
                                                            },
                                                            function (tx, error) {
                                                                swal("Error al guardar", error.message, "error");
                                                            }
                                                        );
                                                    },
                                                    function (error) { },
                                                    function () { }
                                                );
                                            }
                                        });
                                    },
                                    function (tx, error) {
                                        console.error("Error al guardar cierre: " + error.message);
                                    }
                                );
                            },
                            function (error) { },
                            function () { }
                        );
                    }
                }
            );
        },
        function(error){},
        function(){}
    );
}

function generarCursoManejo() {
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
        var IDTipoCurso = $("#CursosTecnicos").find('option:selected').attr("name");
        var ID_AT = $("#ID_AT").val();
        var costo = 0
        var Prueba = 1

        productHandler.addCedula(id_usuario, nombre_usuario, fecha_llegada, id_course, id_cliente, nombre_cliente, horario_programado, estatus, tipo_cedula, nombre_evalua, geolocation);
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
                        if (IDTipoCurso == 1) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                            var NomJson = 'CursoCiertoFalso' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasCiertoFalso(id_cedula, data[j].IDPregunta, data[j].Pregunta, data[j].texto1, data[j].texto2, data[j].OpCorrecta, id_course, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 2) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                            var NomJson = 'CursoSiNoValor' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasSiNoValor(id_cedula, data[j].IDPregunta, data[j].Pregunta, id_course, data[j].OpCorrecta, data[j].Valor, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 3) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                            var NomJson = 'PreguntasMultiple_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(id_cedula, data[j].IDPregunta, data[j].Pregunta, data[j].Justifica, id_course, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                            var NomJson2 = 'RespuestasMultiples_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(id_cedula, data[j].ID, data[j].FK_Pregunta, data[j].Opcion, data[j].Correcta, data[j].Image, id_course);
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 4) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                            var NomJson = 'PreguntasMultiple_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    var aux = 0;
                                    var aux2 = 0;
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].IDNombreCurso == id_course) {
                                            aux++;
                                        }
                                    }
                                    if (aux == 0) {
                                        app.dialog.close();
                                        swal("", "Algo salió mal.", "error");
                                    } else {
                                        dialog.setText('1 de ' + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(id_cedula, data[j].IDPregunta, data[j].Pregunta, data[j].Justifica, id_course, aux, aux2);
                                            }
                                        }
                                    }
                                }
                            });
                            var NomJson2 = 'RespuestasMultiples_' + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(id_cedula, data[j].ID, data[j].FK_Pregunta, data[j].Opcion, data[j].Correcta, data[j].Image, id_course);
                                        }
                                    }
                                }
                            });
                        } else if (IDTipoCurso == 5) {
                            productHandler.addDatosPrueba1(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, IDTipoCurso, ID_AT, costo, Prueba);
                        }
                    },
                    function (tx, error) {
                        console.log("Error al guardar cedula: " + error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    } else {
        swal("", "Debes llenar estos campos para poder guardar: " + quita_coma, "warning");
        return false;
    }
}

function validaEventos(fecha) {
    var id_cedula = localStorage.getItem("IdCedula");

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select id_becario from asistenciaDetails where id_cedula= ?",
                [id_cedula],
                function (tx, results) {
                    var length = results.rows.length;
                    if (length == 0) {
                    } else {
                        for (var i = 0; i < length; i++) {
                            var item = results.rows.item(i);
                            validaEventosDetails(fecha, item.id_becario)
                        }
                    }
                }
            );
        },
        function (error) { },
        function () { }
    );

}

function validaEventosDetails(fecha, id_becario) {
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'ViewIncidencias_' + empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].fecha_e == fecha) {
                        if (data[j].FK_Becario == id_becario) {
                            $("#div_evento_" + id_becario).html(`
                                <span class="element_asis_evt">${data[j].flag_incidencia}</span>
                            `)
                            $("#toogle_" + id_becario).attr("data-tg-on", "Confirmado")
                        }
                    }
                }
            }
        }
    });
}

function getCalificacionCursoValor(puntos) {
    let IDCurso = localStorage.getItem("IDCurso");
    let empresa = localStorage.getItem("empresa");
    let NomJson = 'Calificaciones_' + empresa;
    let califf = 0
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let length = data.length;
            if (length == 0) {
            } else {
                data.forEach(function (dat, index) {
                    if (dat.FKCurso == IDCurso) {
                        let min = Number(dat.Calif7)
                        min--
                        if (puntos > min && puntos <= dat.Calif7) {
                            califf = 7
                        } else if (puntos >= dat.Calif7 && puntos <= dat.Calif8) {
                            califf = 8
                        } else if (puntos > dat.Calif8 && puntos <= dat.Calif9) {
                            califf = 9
                        } else if (puntos > dat.Calif9 && puntos <= dat.Calif10) {
                            califf = 10
                        } else {
                            califf = 0
                        }
                        $("#calificacion_text").html('Puntaje Obtenido: ' + puntos + ", Calificación: " + (califf))
                        actualizaPromedio2(califf)
                    }
                })
            }
        }
    });
}

function actualizaPromedio2(valor) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE datosGeneralesCurso SET promedio = ? WHERE id_cedula = ?",
                [valor, id_cedula],
                function (tx, results) {
                },
                function (tx, error) {
                    console.error("Error al guardar: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

function guardaJustificacion(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var respuestas = id.split("_");
    var FK_IDPregunta = respuestas[1]
    var respuesta = $("#"+id).val()
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("UPDATE CAP_RespuestasMultiple SET Justificacion = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta, id_cedula, FK_IDPregunta],
                function (tx, results) {
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) { },
        function () { }
    );
}

//fin Capacitacion

//Inicio tecnologiasHmo

function continuarCed2(id_cedula, tipo) {
    localStorage.setItem("IdCedula", id_cedula);

    if (tipo == 'tecnologiasHmo') {
        app.views.main.router.back('/yallegueTecnologiasHMO/', { force: true, ignoreCache: true, reload: true });
    } else if (tipo == 'Relevos') {
        app.views.main.router.back('/formRelevos1/', { force: true, ignoreCache: true, reload: true });
    } 
}

function preInicioTech(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer abrir un nuevo registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            iniciartecnologiasHmo();
        }
    });
}

function iniciartecnologiasHmo(){
    var id_usuario = localStorage.getItem("id_usuario");
    var nombre_usuario = localStorage.getItem("Usuario");
    var fecha_llegada =  getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = "Inspección tecnologías";
    var estatus = 0;
    var geolocation = '';
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = 'tecnologiasHmo';
    productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
            "Select MAX(id_cedula) as Id from cedulas_general",
            [],
            function (tx, results) {
                var item = results.rows.item(0);
                localStorage.setItem("IdCedula", item.Id);
                app.views.main.router.navigate({ name: 'yallegueTecnologiasHMO'});
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

function editarInspeccion(IdHeader){
    localStorage.setItem("IdHeader", IdHeader);
    app.views.main.router.navigate({ name: 'formtecnologiasHmo1' });
}

function inspeccionarUnidad(){
    if($("#id_unidad").val()){
        let id_cedula = localStorage.getItem("IdCedula")
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                "Select id_cedula from DesTechHeader WHERE id_cedula = ? AND id_unidad = ?",
                    [id_cedula, $("#id_unidad").val()],
                    function (tx, results) {
                        let length = results.rows.length;
                        if(length == 0){
                            let unidad = $("#autocomplete-dropdown-ajax").val()
                            let id_unidad = $("#id_unidad").val()
                            let id_operador = $("#id_operador").val()
                            let operador = $("#operador").val()
                            let credencial = $("#credencial").val()
                            let fecha_inicio = getDateWhitZeros();
                            let progress = 0;
                            let dialog = app.dialog.progress('Trabajando... ', progress, 'red');
                            let id_empresa = localStorage.getItem("empresa");
                            let NomJson = 'datos_check'+id_empresa;
                    
                            productHandler.addDesTechHmoHeader(id_cedula, unidad, id_unidad, id_operador, operador, credencial, fecha_inicio);
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                    "Select MAX(IdHeader) as IdHeader from DesTechHeader",
                                    [],
                                    function (tx, results) {
                                        var item = results.rows.item(0);
                                        localStorage.setItem("IdHeader", item.IdHeader);
                                        app.request({
                                            url: cordova.file.dataDirectory + "jsons_tecnologiasHmo/"+NomJson+".json",
                                            method: 'GET',
                                            dataType: 'json',
                                            success: function (data) {
                                                var aux = data.length;
                                                var aux2=0;
                                                if(aux == 0){
                                                    app.dialog.close();
                                                    swal("","Algo salió mal.","warning");
                                                }else{
                                                    dialog.setText('1 de ' + aux);
                                                    for (var j = 0; j < data.length; j++) {
                                                        aux2++;
                                                        productHandler.addDesTechHmoDetails(id_cedula,item.IdHeader, data[j].ID, data[j].Pregunta, data[j].Multiple, data[j].FK_formato, data[j].FK_equipo, aux, aux2);
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
                            swal("","Esta unidad ya la tienes registrada.","warning");
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
    }else{
        swal("","Selecciona una unidad para poder continuar.","warning");
    }
}

function TerminarCheckListHMO(){
    let id_cedula = localStorage.getItem("IdCedula");
    let IdHeader = localStorage.getItem("IdHeader")
    if($("#ID_personal").val()){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT id_cedula FROM DesTechDetails WHERE id_cedula = ? AND respuesta is null",
                    [id_cedula],
                    function(tx5, results){
                        let length = results.rows.length;
                        if(length == 0){
                            let firma = $("#signate").val()
                            let observaciones = $("#observaciones").val()
                            observaciones = observaciones.trim()
                            if (firma || observaciones){
                                if(firma){
                                    databaseHandler.db.transaction(
                                        function(tx){ tx.executeSql("UPDATE DesTecFirmas SET firma = ?, fecha = ? WHERE id_cedula = ? AND IdHeader = ?;", 
                                        [firma,getDateWhitZeros(), id_cedula, IdHeader],
                                        function(tx, results){ 
                                            databaseHandler.db.transaction(
                                                function(tx){ tx.executeSql("UPDATE DesTechHeader SET fecha_fin = ?, observaciones= ? WHERE id_cedula = ? AND IdHeader = ?;", 
                                                [getDateWhitZeros(), observaciones, id_cedula, IdHeader],
                                                function(tx, results){ regresaTechHmo() },
                                                function(tx, error){ swal("Error al guardar",error.message,"error"); } ); }, function(error){}, function(){}
                                            );
                                     },
                                        function(tx, error){ swal("Error al guardar",error.message,"error"); } ); }, function(error){}, function(){}
                                    );
                                } else {
                                    databaseHandler.db.transaction(
                                        function(tx){ tx.executeSql("UPDATE DesTechHeader SET fecha_fin = ?, observaciones= ? WHERE id_cedula = ? AND IdHeader = ?;", 
                                        [getDateWhitZeros(), observaciones, id_cedula, IdHeader],
                                        function(tx, results){ regresaTechHmo() },
                                        function(tx, error){ swal("Error al guardar",error.message,"error"); } ); }, function(error){}, function(){}
                                    );
                                }
                            } else {
                                swal("", "Los comentarios o la firma no puede estar vacío.", "warning");
                            }
                        } else {
                            swal("", "Debes responder a todos los conceptos para poder continuar.", "warning");
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
        swal({
            title: "Aviso",
            text: "Aún no haz elegido un conductor ¿Estas seguro de querer regresar?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                regresaTechHmo()
            }
        });
    }
}

function SeleccionarDanosControlTec(id, pregunta, multiple, FK_equipo){
    if(multiple == 1){
        var text = pregunta;
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
            CreaModalOptionCtlTec(id,opciones,1,titulo_modal, FK_equipo);
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
            CreaModalOptionCtlTec(id,opciones,2,titulo_modal, FK_equipo);
        }
        
    }else{
        var opciones = false;
        var titulo_modal = "";
        CreaModalOptionCtlTec(id,opciones,3,titulo_modal, FK_equipo);
    }
}

function actualizacheckControlTec(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var IdHeader = localStorage.getItem("IdHeader");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio','');
        $("#span-"+id_pregunta).html(comentarios);
        $("#spanComentarios-"+id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE DesTechDetails SET respuesta = ?,comentarios = ?, falla = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND IdHeader = ?",
                    [respuesta,comentarios,comentarios,id_cedula,id_pregunta,IdHeader],
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
    } else if(check.includes('2')){
        var respuesta = 2;
        var id_pregunta = ids[0].replace('radio','');
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE DesTechDetails SET respuesta = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND IdHeader = ?",
                    [respuesta,id_cedula,id_pregunta,IdHeader],
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

function agregaComentariosCtlTec(id_pregunta,mul){
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
    var FKs = ''
    
    campos = document.querySelectorAll('#div_cboxs .obligatorio');
    var valido = false;

    [].slice.call(campos).forEach(function(campo) {
        if (campo.checked == true) {
            valido = true;
            comentarios = comentarios+", "+campo.value;
            FKs = FKs+","+campo.id.replace("cbox", "");
        }
    });

    if (valido) {
        var str = comentarios;
        var name = str.slice(1);
        var name2 = FKs.slice(1)
        name = opts+""+name;
        name = name.trim();
        name = capitalizarPrimeraLetra(name);
        var id_cedula = localStorage.getItem("IdCedula");
        var IdHeader = localStorage.getItem("IdHeader");
        var obs_generales = $("#obs_generales").val();

        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE DesTechDetails SET falla = ?, comentarios = ?, FKsFallas = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND IdHeader = ?",
                    [name,obs_generales,name2,id_cedula,id_pregunta, IdHeader],
                    function(tx, results){
                        $("#span-"+id_pregunta).html(name);
                        $("#spanComentarios-"+id_pregunta).html(obs_generales ? `Comentarios:  ${obs_generales}` : ``);
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

function CreaModalOptionCtlTec(id, opciones, mul, titulo_modal, FK_equipo){
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

    var NomDescCli = "fallos";
    var html = '';

    app.request.get(cordova.file.dataDirectory + "jsons_tecnologiasHmo/"+NomDescCli+".json", function (data) {
        var content2 = JSON.parse(data);
        for(var x = 0; x < content2.length; x++) {
            if(FK_equipo == content2[x].id_tipo_equipo_recaudo){
                html = html + `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox${content2[x].id_tipo_falla}" value="${content2[x].nombre_tipo_falla}">${content2[x].nombre_tipo_falla}</label><br>`;
            }
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
                    <span id="titulo_modal" style="display:${display1};color: #FF0037;" class="span FWM-span-form">${titulo_modal}</span>
                    <div id="div_opt" style="display:${display}; padding-top: 10px;margin-bottom: 20px;">
                    ${opciones}
                    </div>
                    <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                        <input type="hidden" id="inputEvidencia" value=${id}>
                        <input type="hidden" id="pasa" value="0">
                            ${html}
                        <div>
                            <span style="color: #005D99;" class="span FWM-span-form">Comentarios adicionales</span>
                            <textarea class="FWM-input" style="font-family: 'ITC Avant Garde Gothic', sans-serif;" id="obs_generales" cols="30" rows="10" maxlength="255"></textarea>
                        </div>
                        <div class="block grid-resizable-demo" style="margin-bottom: 70px;padding-top: 35px;">
                            <div class="row align-items-stretch" style="text-align: center;">
                                <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                    <span class="resize-handler"></span>
                                    <a href="#" onclick="agregaComentariosCtlTec(${id},${mul});" style="background-color: #FF0037;padding-left: 50px;padding-right: 50px;" class="boton-equipo">Guardar</a>
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
                                        actualizacheckControlTec(Check);
                                        app.sheet.close('#sheet-modal');
                                    } 
                                });
                            }
                        });
                    },
                }
        });
        popEvidencia.open();
    });
}

function regresaTechHmo(){
    window.localStorage.removeItem("IdHeader")
    app.views.main.router.back('/yallegueTecnologiasHMO/', { force: true, ignoreCache: true, reload: true })
}

function actualizaOperadorTech(){
    let id_cedula = localStorage.getItem("IdCedula")
    let IdHeader = localStorage.getItem("IdHeader")
    let ID_personal = $("#ID_personal").val()
    let clave = $("#clave").val()
    let fullName = $("#fullName").val()

    databaseHandler.db.transaction(
        function(tx){ tx.executeSql("UPDATE DesTechHeader SET id_operador = ?, operador = ?, credencial = ? WHERE id_cedula = ? AND IdHeader = ?", 
        [ID_personal,fullName,clave, id_cedula, IdHeader],
        function(tx, results){  },
        function(tx, error){ swal("Error al guardar",error.message,"error"); } ); }, function(error){}, function(){}
    );
}

function FinalizarInspecciones(){
    let id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) { tx.executeSql( "Select COUNT(id_cedula) as cuenta from DesTechHeader WHERE id_cedula = ? AND (id_operador IS NULL OR id_operador = '')", [id_cedula],
        function (tx, results) { 
            var item = results.rows.item(0);
            if(item.cuenta > 0){
                swal("", "Tienes unidades sin operador, para poder continuar debes completar el registro", "warning")
            } else {
                swal({
                    title: "Aviso",
                    text: "¿Estas seguro de querer finalizar la revisión?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((RESP) => {
                    if (RESP == true) {
                        var fecha_salida = getDateWhitZeros();
                        var id_cedula = localStorage.getItem("IdCedula");
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
        },
        function (tx, error) { console.log("Error al guardar cedula: " + error.message); } ); }, function (error) {}, function () {}
    );
}

function eliminarInspeccion(IdHeader){
    let id_cedula = localStorage.getItem("IdCedula");
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer eliminar el registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM DesTechDetails WHERE id_cedula = ?", [id_cedula], function(tx, results){
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM DesTechHeader WHERE id_cedula = ? AND IdHeader = ?", [id_cedula, IdHeader], function(tx, results){
                    databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM DesTecFirmas WHERE id_cedula = ? AND IdHeader = ?", [id_cedula, IdHeader], function(tx, results){
                        $("#renglon_"+IdHeader).remove()
                        swal("", "Eliminado correctamente", "success")
                    }, function(tx, error){ } ); }, function(error){}, function(){} );
                }, function(tx, error){ } ); }, function(error){}, function(){} );
            }, function(tx, error){ } ); }, function(error){}, function(){} );
        }
    });
}
//Fin tecnologiasHmo
//Inicio Relevos
function scanRelevos(val){
    if(val){
        if(val == 1){
            // cordova.plugins.barcodeScanner.scan(
            //     function (result) {
            //         $("#operador").val(result.text)
            //     },
            //     function (error) {
            //         alert("Scanning failed: " + error);
            //     },
            //     {
            //         preferFrontCamera : false,
            //         showFlipCameraButton : true,
            //         showTorchButton : true,
            //         torchOn: false,
            //         saveHistory: false,
            //         prompt : "Coloca el código dentro de la zona marcada",
            //         resultDisplayDuration: 500,
            //         orientation : "portrait",
            //         disableAnimations : true,
            //         disableSuccessBeep: false
            //     }
            //  );
            buscadorRelevos(555)
        } else if(val == 2){
            // cordova.plugins.barcodeScanner.scan(
            //     function (result) {
            //         $("#operador").val(result.text)
            //     },
            //     function (error) {
            //         alert("Scanning failed: " + error);
            //     },
            //     {
            //         preferFrontCamera : false,
            //         showFlipCameraButton : true,
            //         showTorchButton : true,
            //         torchOn: false,
            //         saveHistory: false,
            //         prompt : "Coloca el código dentro de la zona marcada",
            //         resultDisplayDuration: 500,
            //         orientation : "portrait",
            //         disableAnimations : true,
            //         disableSuccessBeep: false
            //     }
            //  );
            revisaRelevos(555)
        }
    }
}

function buscadorRelevos(valor){ //* buscar de licencias y operadores
    app.dialog.progress('Buscando...','red');
    $("#divPersonaEntra").css("display", "none")
    $("#IDSale").val('')
    $("#claveEmpleado").val('')
    $("#fullName").val('')
    $("#ID_personal").val('')
    $("#Eco").val('')
    $("#FKUnidad").val('')
    $("#linea").val('')
    $("#jornada").val('')
    $("#IDEntra").val('')
    $("#claveEmpleadoE").val('')
    $("#fullNameE").val('')
    $("#ID_personalE").val('')
    $("#EcoE").val('')
    $("#FKUnidadE").val('')
    $("#lineaE").val('')
    $("#jornadaE").val('')

    empresa = localStorage.getItem("empresa")
    var NomJson = 'personal_'+empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let encontro = false
            for (var j = 0; j < data.length; j++) {
                if (data[j].QR == valor) {
                    encontro = true
                    console.log("personal1", data[j])
                    $("#claveEmpleado").val(data[j].claveEmpleado)
                    $("#fullName").val(data[j].fullName)
                    $("#ID_personal").val(data[j].ID_personal)

                    segundaBusqueda(data[j].ID_personal)
                    break
                }
            }

            if(!encontro){
                $("#IDSale").val('')
                $("#claveEmpleado").val('')
                $("#fullName").val('')
                $("#ID_personal").val('')
                $("#Eco").val('')
                $("#FKUnidad").val('')
                $("#linea").val('')
                $("#jornada").val('')
                swal("", "No se encontro al operador.", "warning")
                app.dialog.close()
            }
        }
    });
}

function segundaBusqueda(ID_personal){//* buscar turno 1
    empresa = localStorage.getItem("empresa")
    var NomJson = 'programa_'+empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let encontro = false
            for (var j = 0; j < data.length; j++) {
                if (data[j].FKPersonal == ID_personal && data[j].Turno == 1) {
                    encontro = true
                    console.log("programa 1", data[j])
                    tercaraBusqeuda(data[j].Linea, data[j].Jornada, ID_personal)
                    $("#IDSale").val(data[j].ID)
                    $("#Eco").val(data[j].Eco)
                    $("#linea").val(data[j].Linea)
                    $("#jornada").val(data[j].Jornada)
                    $("#FKUnidad").val(data[j].FKUnidad)
                    break
                }
            }

            if(!encontro){
                $("#IDSale").val('')
                $("#claveEmpleado").val('')
                $("#fullName").val('')
                $("#ID_personal").val('')
                $("#Eco").val('')
                $("#FKUnidad").val('')
                $("#linea").val('')
                $("#jornada").val('')
                swal("", "No se encontro programación en este operador, sincroniza datos e inténtalo nuevamente.", "warning")
                app.dialog.close()
            }
        }
    });
}
function tercaraBusqeuda(Linea, Jornada, ID_personal){ //* buscar turno 2
    empresa = localStorage.getItem("empresa")
    var NomJson = 'programa_'+empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let encontro = false
            for (var j = 0; j < data.length; j++) {
                if (data[j].Linea == Linea && data[j].Jornada == Jornada && data[j].Turno == 2) {
                    if(data[j].FKPersonal == 0 || data[j].FKPersonal == ''){
                        swal("", "No existe un relevo en la asignación. Comunicarse con operación.", "warning")
                    } else {
                        if(ID_personal == data[j].FKPersonal){
                            console.log("programa 2", data[j])
                            encontro = true
                            $("#IDSale").val('')
                            $("#claveEmpleado").val('')
                            $("#fullName").val('')
                            $("#ID_personal").val('')
                            $("#Eco").val('')
                            $("#FKUnidad").val('')
                            $("#linea").val('')
                            $("#jornada").val('')
                            swal("", "El relevo no es necesario.", "warning")
                            app.dialog.close()
                        } else {
                            encontro = true
                            console.log("programa 2", data[j])
                            $("#IDEntra").val(data[j].ID)
                            $("#EcoE").val(data[j].Eco)
                            $("#lineaE").val(data[j].Linea)
                            $("#jornadaE").val(data[j].Jornada)
                            $("#FKUnidadE").val(data[j].FKUnidad)
                            $("#ID_personalE").val(data[j].FKPersonal)
                            app.dialog.close()
                            guardaRelevo()
                        }
                    }
                    break
                }
            }

            if(!encontro){
                swal("", "No existe un relevo en la asignación. Comunicarse con operación.", "warning")
                app.dialog.close()
            }
        }
    });
}

function revisaRelevos(valor){
    app.dialog.progress('Buscando...','red');
    empresa = localStorage.getItem("empresa")
    var NomJson = 'personal_'+empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let encontro = false
            for (var j = 0; j < data.length; j++) {
                if (data[j].QR == valor) {
                    encontro = true
                    $("#claveEmpleadoE").val(data[j].claveEmpleado)
                    $("#fullNameE").val(data[j].fullName)
                    if(data[j].ID_personal == $("#ID_personalE").val()){
                        if(data[j].EstatusOperador == 'Suspendido'){
                            $("#claveEmpleadoE").val('')
                            $("#fullNameE").val('')
                            swal("Operador suspendido.", "Comunicate con operaciones para determinar su situcación.", "warning")
                            return false
                        } else {
                            if(data[j].dias <= 0){
                                $("#claveEmpleadoE").val('')
                                $("#fullNameE").val('')
                                swal("Licencia Vencida.", "Este operador tiene su licencia vencida y no se puede asignar.", "warning")
                            }
                            if(data[j].dias > 0 && data[j].dias <= 10){
                                swal("Puedes continuar pero...", "Licencia cuenta con solo "+data[j].dias+" días de vigencia.", "warning")
                            }
                        }
                    } else {
                        $("#claveEmpleadoE").val('')
                        $("#fullNameE").val('')
                        swal("", "Este operador no esta en la asignación. Sincroniza datos e intenta nuevamente si el problema persiste comunicate con operaciones.", "warning")
                    }
                    app.dialog.close()
                    break
                }
            }

            if(!encontro){
                swal("", "No se encontro al operador.", "warning")
                app.dialog.close()
            }
        }
    });
}

function guardaRelevo(){
    let IDSale =$("#IDSale").val()
    let claveEmpleado =$("#claveEmpleado").val()
    let fullName =$("#fullName").val()
    let ID_personal =$("#ID_personal").val()
    let Eco =$("#Eco").val()
    let FKUnidad =$("#FKUnidad").val()
    let linea =$("#linea").val()
    let jornada =$("#jornada").val()
    let fechaSalida = getDateWhitZeros()
    let UsuarioMov = localStorage.getItem("Usuario")
    let FkUsuarioMov = localStorage.getItem("id_usuario")
    let tipoCedula = localStorage.getItem("Modulos")
    
    let id_usuario = localStorage.getItem("id_usuario");
    let nombre_usuario = localStorage.getItem("Usuario");
    let fecha_llegada =  getDateWhitZeros();
    let horario_programado = fecha_llegada;
    let nombre_cliente = "Relevos";
    let estatus = 0;
    let geolocation = '';
    let id_cliente = localStorage.getItem("empresa");
    let tipo_cedula = localStorage.getItem("Modulos")

    let IDEntra = $("#IDEntra").val()
    let claveEmpleadoE = $("#claveEmpleadoE").val()
    let fullNameE = $("#fullNameE").val()
    let ID_personalE = $("#ID_personalE").val()
    let EcoE = $("#EcoE").val()
    let FKUnidadE = $("#FKUnidadE").val()
    let lineaE = $("#lineaE").val()
    let jornadaE = $("#jornadaE").val()
    let id_cedula = localStorage.getItem("IdCedula")

    $("#divPersonaEntra").css("display", "block")
    
    if(id_cedula){
        productHandler.addRelevos(id_cedula, IDSale, claveEmpleado, fullName, ID_personal, Eco, FKUnidad, linea, jornada, fechaSalida, UsuarioMov, FkUsuarioMov, tipoCedula, IDEntra, claveEmpleadoE, fullNameE, ID_personalE, EcoE, FKUnidadE, lineaE, jornadaE)
    } else {
        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    let id_cedula = item.Id;
                    productHandler.addRelevos(id_cedula, IDSale, claveEmpleado, fullName, ID_personal, Eco, FKUnidad, linea, jornada, fechaSalida, UsuarioMov, FkUsuarioMov, tipoCedula, IDEntra, claveEmpleadoE, fullNameE, ID_personalE, EcoE, FKUnidadE, lineaE, jornadaE)
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

function guardarRelevos(){
    // IDEntra int, claveEmpleadoE Text, fullNameE Text ID_personalE int, EcoE Text, FKUnidadE int, lineaE int, jornadaE int, fechaEntrada Text, UsuarioMovE Text, FkUsuarioMovE Text

    if($("#claveEmpleadoE").val() && $("#fullNameE").val()){
        let id_cedula = localStorage.getItem("IdCedula")
        let IDEntra = $("#IDEntra").val()
        let claveEmpleadoE = $("#claveEmpleadoE").val()
        let fullNameE = $("#fullNameE").val()
        let ID_personalE = $("#ID_personalE").val()
        let EcoE = $("#EcoE").val()
        let FKUnidadE = $("#FKUnidadE").val()
        let lineaE = $("#lineaE").val()
        let jornadaE = $("#jornadaE").val()
        let fechaEntrada = getDateWhitZeros()
        let UsuarioMovE = localStorage.getItem("Usuario")
        let FkUsuarioMovE = localStorage.getItem("id_usuario")
    
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE Relevos SET IDEntra = ? , claveEmpleadoE = ?, fullNameE = ?, ID_personalE = ?, EcoE = ?, FKUnidadE = ?, lineaE = ?, jornadaE = ?, fechaEntrada = ?, UsuarioMovE = ?, FkUsuarioMovE = ? WHERE id_cedula = ?",
                    [IDEntra, claveEmpleadoE, fullNameE, ID_personalE, EcoE, FKUnidadE, lineaE, jornadaE, fechaEntrada, UsuarioMovE, FkUsuarioMovE, id_cedula],
                    function(tx, results){
                        swal({
                            title: "Aviso",
                            text: "¿Estas seguro de querer finalizar el relevo?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((RESP) => {
                            if (RESP == true) {
                                var fecha_salida = getDateWhitZeros();
                                var id_cedula = localStorage.getItem("IdCedula");
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
                        swal("Error al guardar",error.message,"error");
                    }
                );
            },
            function(error){},
            function(){}
        ); 
    } else {
        swal("", "Debes escanear la licencia del relevo para poder continuar.", "warning")
    }
}

function busquedaEvaluacion2(IDCurso, FK_Becario){
    let empresa = localStorage.getItem("empresa")
    let NomJson = 'DatosEvaluacionS_'+empresa
    let html = ''
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/"+NomJson+".json",
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var length = data.length;
            if(length == 0){
            } else {
                let encontro = false
                for (var j = 0; j < data.length; j++) {
                    if(data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario){
                        encontro = true
                        var check = ''
                        data[j].apto == 1 ? check = 'checked': check = '';
                        html += `<div class="timeline-item">
                            <div class="timeline-item-date">${data[j].fecha}</div>
                            <div class="timeline-item-content">
                                <div class="timeline-item-time">Apto</div>
                                <div class="timeline-item-text">${data[j].apto == 1 ? 'Si' : 'No'}</div>
                                <div class="timeline-item-time">Promedio</div>
                                <div class="timeline-item-text">${data[j].promedio}</div>
                                <div class="timeline-item-time">Observaciones</div>
                                <div class="timeline-item-text">${data[j].observaciones}</div>
                            </div>
                        </div>`;
                    }
                }
            }
            $(".timeline-month").html(html);
        }
    });
    $("#div_calificaciones").css("display", "block")
}
//Fin Relevos
//fin HMO