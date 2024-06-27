//Inicio Relevos
function scanRelevos(val) {
    if (val) {
        if (val == 1) {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    //$("#operador").val(result.text)
                    buscadorRelevos(result.text);
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
                    prompt: "Coloca el código dentro de la zona marcada",
                    resultDisplayDuration: 500,
                    orientation: "portrait",
                    disableAnimations: true,
                    disableSuccessBeep: false,
                }
            );
        } else if (val == 2) {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    //$("#operador").val(result.text)
                    revisaRelevos(result.text);
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
                    prompt: "Coloca el código dentro de la zona marcada",
                    resultDisplayDuration: 500,
                    orientation: "portrait",
                    disableAnimations: true,
                    disableSuccessBeep: false,
                }
            );
        }
    }
}

function buscadorRelevos(valor) {
    //* buscar de licencias y operadores
    if (valor) {
        app.dialog.progress("Buscando...", "red");
        $("#divPersonaEntra").css("display", "none");
        $("#IDSale").val("");
        $("#claveEmpleado").val("");
        $("#fullName").val("");
        $("#ID_personal").val("");
        $("#Eco").val("");
        $("#FKUnidad").val("");
        $("#linea").val("");
        $("#jornada").val("");
        $("#IDEntra").val("");
        $("#claveEmpleadoE").val("");
        $("#fullNameE").val("");
        $("#ID_personalE").val("");
        $("#EcoE").val("");
        $("#FKUnidadE").val("");
        $("#lineaE").val("");
        $("#jornadaE").val("");

        empresa = localStorage.getItem("empresa");
        var NomJson = "personal_" + empresa;
        app.request({
            url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
            method: "GET",
            dataType: "json",
            success: function (data) {
                let encontro = false;
                for (var j = 0; j < data.length; j++) {
                    if (data[j].QR == valor || data[j].QR2 == valor) {
                        encontro = true;
                        console.log("personal1", data[j]);
                        $("#claveEmpleado").val(data[j].claveEmpleado);
                        $("#fullName").val(data[j].fullName);
                        $("#ID_personal").val(data[j].ID_personal);

                        segundaBusqueda(data[j].ID_personal);
                        break;
                    }
                }

                if (!encontro) {
                    $("#IDSale").val("");
                    $("#claveEmpleado").val("");
                    $("#fullName").val("");
                    $("#ID_personal").val("");
                    $("#Eco").val("");
                    $("#FKUnidad").val("");
                    $("#linea").val("");
                    $("#jornada").val("");
                    swal("", "Código escaneado no existe", "warning");
                    app.dialog.close();
                }
            },
        });
    } else {
        swal("", "No se ha escaneado nada, intenta de nuevo por favor.", "warning");
    }
}

function segundaBusqueda(ID_personal) {
    //* buscar turno 1
    empresa = localStorage.getItem("empresa");
    var NomJson = "programa_" + empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let encontro = false;
            for (var j = 0; j < data.length; j++) {
                if (data[j].FKPersonal == ID_personal && data[j].Turno == 1) {
                    encontro = true;
                    console.log("programa 1", data[j]);
                    tercaraBusqeuda(data[j].Linea, data[j].Jornada, ID_personal);
                    $("#IDSale").val(data[j].ID);
                    $("#Eco").val(data[j].Eco);
                    $("#linea").val(data[j].Linea);
                    $("#jornada").val(data[j].Jornada);
                    $("#FKUnidad").val(data[j].FKUnidad);
                    break;
                }
            }

            if (!encontro) {
                $("#IDSale").val("");
                $("#claveEmpleado").val("");
                $("#fullName").val("");
                $("#ID_personal").val("");
                $("#Eco").val("");
                $("#FKUnidad").val("");
                $("#linea").val("");
                $("#jornada").val("");
                swal("", "El operador no tiene nada asignado para este día.", "warning");
                app.dialog.close();
            }
        },
    });
}
function tercaraBusqeuda(Linea, Jornada, ID_personal) {
    //* buscar turno 2
    empresa = localStorage.getItem("empresa");
    var NomJson = "programa_" + empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let encontro = false;
            for (var j = 0; j < data.length; j++) {
                if (data[j].Linea == Linea && data[j].Jornada == Jornada && data[j].Turno == 2) {
                    if (ID_personal == data[j].FKPersonal) {
                        console.log("programa 2 completo", data[j]);
                        encontro = true;
                        // $("#IDSale").val('')
                        // $("#claveEmpleado").val('')
                        // $("#fullName").val('')
                        // $("#ID_personal").val('')
                        // $("#Eco").val('')
                        // $("#FKUnidad").val('')
                        // $("#linea").val('')
                        // $("#jornada").val('')
                        // swal("", "El relevo no es necesario.", "warning")
                        // app.dialog.close()
                        $("#IDEntra").val(data[j].ID);
                        $("#EcoE").val(data[j].Eco);
                        $("#lineaE").val(data[j].Linea);
                        $("#jornadaE").val(data[j].Jornada);
                        $("#FKUnidadE").val(data[j].FKUnidad);
                        $("#ID_personalE").val(data[j].FKPersonal);
                        app.dialog.close();
                        guardaRelevo();
                    } else {
                        encontro = true;
                        console.log("programa 2", data[j]);
                        $("#IDEntra").val(data[j].ID);
                        $("#EcoE").val(data[j].Eco);
                        $("#lineaE").val(data[j].Linea);
                        $("#jornadaE").val(data[j].Jornada);
                        $("#FKUnidadE").val(data[j].FKUnidad);
                        $("#ID_personalE").val(data[j].FKPersonal);
                        app.dialog.close();
                        guardaRelevo();
                    }
                    break;
                }
            }

            if (!encontro) {
                swal("", "No existe un relevo en la asignación.", "warning");
                app.dialog.close();
            }
        },
    });
}

function revisaRelevos(valor) {
    if (valor) {
        app.dialog.progress("Buscando...", "red");
        empresa = localStorage.getItem("empresa");
        var NomJson = "personal_" + empresa;
        app.request({
            url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
            method: "GET",
            dataType: "json",
            success: function (data) {
                let encontro = false;
                for (var j = 0; j < data.length; j++) {
                    if (data[j].QR == valor || data[j].QR2 == valor) {
                        encontro = true;
                        $("#claveEmpleadoE").val(data[j].claveEmpleado);
                        $("#fullNameE").val(data[j].fullName);
                        if (data[j].ID_personal == $("#ID_personalE").val()) {
                            if (data[j].EstatusOperador == "Suspendido") {
                                app.dialog.close();
                                $("#claveEmpleadoE").val("");
                                $("#fullNameE").val("");
                                swal("", "Operador suspendido.", "warning");
                                return false;
                            } else {
                                if (data[j].dias < 0) {
                                    $("#claveEmpleadoE").val("");
                                    $("#fullNameE").val("");
                                    swal("", "Licencia Vencida.", "warning");
                                }
                                if (data[j].dias > 0 && data[j].dias <= 10) {
                                    swal("", "Licencia esta a " + data[j].dias + " días de vencer.", "warning");
                                }
                            }
                        } else {
                            app.dialog.close();
                            swal({
                                title: "Aviso",
                                text: "El relevo no es el esperado o programado. ¿Deseas continuar?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            }).then((RESP) => {
                                if (RESP == true) {
                                    if (data[j].EstatusOperador == "Suspendido") {
                                        $("#claveEmpleadoE").val("");
                                        $("#fullNameE").val("");
                                        swal("", "Operador suspendido.", "warning");
                                        return false;
                                    } else {
                                        if (data[j].dias < 0) {
                                            $("#claveEmpleadoE").val("");
                                            $("#fullNameE").val("");
                                            swal("", "Licencia Vencida.", "warning");
                                        }
                                        if (data[j].dias > 0 && data[j].dias <= 10) {
                                            swal("", "Licencia esta a " + data[j].dias + " días de vencer.", "warning");
                                        }
                                        $("#ID_personalE").val(data[j].ID_personal);
                                    }
                                    // swal("", "Licencia esta a "+data[j].dias+" días de vencer.", "warning")
                                } else {
                                    $("#claveEmpleadoE").val("");
                                    $("#fullNameE").val("");
                                    swal("", "Cancelado.", "success");
                                }
                            });
                        }
                        app.dialog.close();
                        break;
                    }
                }

                if (!encontro) {
                    swal("", "No se encontro al operador.", "warning");
                    app.dialog.close();
                }
            },
        });
    } else {
        swal("", "No se ha escaneado nada, intenta de nuevo por favor.", "warning");
    }
}

function guardaRelevo() {
    let IDSale = $("#IDSale").val();
    let claveEmpleado = $("#claveEmpleado").val();
    let fullName = $("#fullName").val();
    let ID_personal = $("#ID_personal").val();
    let Eco = $("#Eco").val();
    let FKUnidad = $("#FKUnidad").val();
    let linea = $("#linea").val();
    let jornada = $("#jornada").val();
    let fechaSalida = getDateWhitZeros();
    let UsuarioMov = localStorage.getItem("Usuario");
    let FkUsuarioMov = localStorage.getItem("id_usuario");
    let tipoCedula = localStorage.getItem("Modulos");

    let id_usuario = localStorage.getItem("id_usuario");
    let nombre_usuario = localStorage.getItem("Usuario");
    let fecha_llegada = getDateWhitZeros();
    let horario_programado = fecha_llegada;
    let nombre_cliente = "Relevos";
    let estatus = 0;
    let geolocation = "";
    let id_cliente = localStorage.getItem("empresa");
    let tipo_cedula = localStorage.getItem("Modulos");

    let IDEntra = $("#IDEntra").val();
    let claveEmpleadoE = $("#claveEmpleadoE").val();
    let fullNameE = $("#fullNameE").val();
    let ID_personalE = $("#ID_personalE").val();
    let EcoE = $("#EcoE").val();
    let FKUnidadE = $("#FKUnidadE").val();
    let lineaE = $("#lineaE").val();
    let jornadaE = $("#jornadaE").val();
    let id_cedula = localStorage.getItem("IdCedula");

    $("#divPersonaEntra").css("display", "block");

    if (id_cedula) {
        productHandler.addRelevos(
            id_cedula,
            IDSale,
            claveEmpleado,
            fullName,
            ID_personal,
            Eco,
            FKUnidad,
            linea,
            jornada,
            fechaSalida,
            UsuarioMov,
            FkUsuarioMov,
            tipoCedula,
            IDEntra,
            claveEmpleadoE,
            fullNameE,
            ID_personalE,
            EcoE,
            FKUnidadE,
            lineaE,
            jornadaE
        );
    } else {
        productHandler.addCedulayb(
            id_usuario,
            nombre_usuario,
            fecha_llegada,
            geolocation,
            id_cliente,
            nombre_cliente,
            horario_programado,
            estatus,
            tipo_cedula
        );
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select MAX(id_cedula) as Id from cedulas_general",
                    [],
                    function (tx, results) {
                        var item = results.rows.item(0);
                        localStorage.setItem("IdCedula", item.Id);
                        let id_cedula = item.Id;
                        productHandler.addRelevos(
                            id_cedula,
                            IDSale,
                            claveEmpleado,
                            fullName,
                            ID_personal,
                            Eco,
                            FKUnidad,
                            linea,
                            jornada,
                            fechaSalida,
                            UsuarioMov,
                            FkUsuarioMov,
                            tipoCedula,
                            IDEntra,
                            claveEmpleadoE,
                            fullNameE,
                            ID_personalE,
                            EcoE,
                            FKUnidadE,
                            lineaE,
                            jornadaE
                        );
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

function guardarRelevos() {
    // IDEntra int, claveEmpleadoE Text, fullNameE Text ID_personalE int, EcoE Text, FKUnidadE int, lineaE int, jornadaE int, fechaEntrada Text, UsuarioMovE Text, FkUsuarioMovE Text
    setTimeout(() => {
        if ($("#claveEmpleadoE").val() && $("#fullNameE").val()) {
            if ($("#FKUnidadE").val() && $("#FKUnidadE").val() != 0) {
                let id_cedula = localStorage.getItem("IdCedula");
                let IDEntra = $("#IDEntra").val();
                let claveEmpleadoE = $("#claveEmpleadoE").val();
                let fullNameE = $("#fullNameE").val();
                let ID_personalE = $("#ID_personalE").val();
                let EcoE = $("#EcoE").val();
                let FKUnidadE = $("#FKUnidadE").val();
                let lineaE = $("#lineaE").val();
                let jornadaE = $("#jornadaE").val();
                let fechaEntrada = getDateWhitZeros();
                let UsuarioMovE = localStorage.getItem("Usuario");
                let FkUsuarioMovE = localStorage.getItem("id_usuario");

                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "UPDATE Relevos SET IDEntra = ? , claveEmpleadoE = ?, fullNameE = ?, ID_personalE = ?, EcoE = ?, FKUnidadE = ?, lineaE = ?, jornadaE = ?, fechaEntrada = ?, UsuarioMovE = ?, FkUsuarioMovE = ? WHERE id_cedula = ?",
                            [
                                IDEntra,
                                claveEmpleadoE,
                                fullNameE,
                                ID_personalE,
                                EcoE,
                                FKUnidadE,
                                lineaE,
                                jornadaE,
                                fechaEntrada,
                                UsuarioMovE,
                                FkUsuarioMovE,
                                id_cedula,
                            ],
                            function (tx, results) {
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
                                            function (tx) {
                                                tx.executeSql(
                                                    "UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                    [fecha_salida, estatus, id_cedula],
                                                    function (tx, results) {
                                                        window.location.href = "./menu.html";
                                                    },
                                                    function (tx, error) {
                                                        swal("Error al guardar", error.message, "error");
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    }
                                });
                            },
                            function (tx, error) {
                                swal("Error al guardar", error.message, "error");
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else {
                swal("", "Debes seleccionar una unidad.", "warning");
            }
        } else {
            swal("", "Debes escanear la credencial del relevo para poder continuar.", "warning");
        }
    }, 800);
}

function busquedaEvaluacion2(IDCurso, FK_Becario) {
    let empresa = localStorage.getItem("empresa");
    let NomJson = "DatosEvaluacionS_" + empresa;
    let html = "";
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                let encontro = false;
                for (var j = 0; j < data.length; j++) {
                    if (data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario) {
                        encontro = true;
                        var check = "";
                        data[j].apto == 1 ? (check = "checked") : (check = "");
                        html += `<div class="timeline-item">
                            <div class="timeline-item-date">${data[j].fecha}</div>
                            <div class="timeline-item-content">
                                <div class="timeline-item-time">Apto</div>
                                <div class="timeline-item-text">${data[j].apto == 1 ? "Si" : "No"}</div>
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
        },
    });
    $("#div_calificaciones").css("display", "block");
}

function sincronizaDatosRelevos() {
    let EmpresaID = 1;
    let paso = 1;
    // let urlBase2 = "http://192.168.100.8/CISAApp/HMOFiles/Exec";
    // var urlBase2 = "http://172.16.0.143/CISAApp/HMOFiles/Exec";
    let urlBase2 = "http://tmshmo.ci-sa.com.mx/www.CISAAPP.com/HMOFiles/Exec";
    let url = urlBase2 + "/Relevos/datos.php?empresa=" + EmpresaID + "&paso=" + paso;

    fetch(url).then((response) => {
        console.log("Sincroniza datos OK!");
        eliminaCache();
    });
}

function revisaDataRelevos() {
    let fecha = getDateWhitZeros().split(" ")[0];
    // console.log(fecha);
    empresa = localStorage.getItem("empresa");
    let NomJson = "programa_" + empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_Relevos/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let encontro = false;
            for (var j = 0; j < 2; j++) {
                if (data[j].Fecha == fecha) {
                    encontro = true;
                }
            }

            if (!encontro) {
                swal("", "Favor de Sincronizar los datos antes de empezar.", "warning");
            } else {
                app.views.main.router.navigate({ name: "formRelevos1" });
            }
        },
    });
}
//Fin Relevos
