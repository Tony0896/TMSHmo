//Inicio Capacitacion
function validarRadioCapa(id, val, valor, OpCorrecta) {
    var ids = id.split("-");
    var check = ids[1];
    var valCheck = document.getElementById(ids[0] + "-" + ids[1]).checked;
    if (check.includes("1")) {
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
    $(".in_" + FK_IDPregunta).prop("checked", false);
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
    var respuesta = respuestas[1];
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE CAP_RespuestasMultiple SET Respuesta = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta, id_cedula, FK_IDPregunta],
                function (tx, results) {},
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function actualizaRespuestaCiertoFalso(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes("1")) {
        var respuesta = 1;
        var id_pregunta = ids[0].replace("op", "");
    } else if (check.includes("0")) {
        var respuesta = 0;
        var id_pregunta = ids[0].replace("op", "");
    }
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE cursoCiertoFalso SET respuesta = ? WHERE id_cedula = ? AND IDPregunta = ?",
                [respuesta, id_cedula, id_pregunta],
                function (tx, results) {},
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function generaEvaluacion(val) {
    console.log(val);
    if (val == 1) {
        app.sheet.close("#sheet-modal-1");
        localStorage.setItem("SaltoCurso", 1);
        app.views.main.router.back("/formCapacita1/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else {
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha_llegada = getDateWhitZeros();
        var geolocation = localStorage.getItem("IDTipoCurso");
        var id_cliente = localStorage.getItem("empresa");
        var nombre_cliente = localStorage.getItem("nameBecario");
        var horario_programado = fecha_llegada;
        var estatus = 0;
        var tipo_cedula = "Capacitación";
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
        var Prueba = 0;

        productHandler.addCedula(
            id_usuario,
            nombre_usuario,
            fecha_llegada,
            id_course,
            id_cliente,
            nombre_cliente,
            horario_programado,
            estatus,
            tipo_cedula,
            nombre_evalua,
            geolocation
        );
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select MAX(id_cedula) as Id from cedulas_general",
                    [],
                    function (tx, results) {
                        //app.dialog.progress('Generando CheckList','red');
                        var progress = 0;
                        var dialog = app.dialog.progress("Generando Curso", progress, "red");
                        var empresa = localStorage.getItem("empresa");
                        var item = results.rows.item(0);
                        localStorage.setItem("IdCedula", item.Id);
                        var id_cedula = item.Id;
                        if (IDTipoCurso == 1) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba,
                                OpDiario
                            );
                            var NomJson = "CursoCiertoFalso" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasCiertoFalso(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    data[j].texto1,
                                                    data[j].texto2,
                                                    data[j].OpCorrecta,
                                                    id_course,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 2) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba,
                                OpDiario
                            );
                            var NomJson = "CursoSiNoValor" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasSiNoValor(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    id_course,
                                                    data[j].OpCorrecta,
                                                    data[j].Valor,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 3) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba,
                                OpDiario
                            );
                            var NomJson = "PreguntasMultiple_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    data[j].Justifica,
                                                    id_course,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                            var NomJson2 = "RespuestasMultiples_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: "GET",
                                dataType: "json",
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(
                                                id_cedula,
                                                data[j].ID,
                                                data[j].FK_Pregunta,
                                                data[j].Opcion,
                                                data[j].Correcta,
                                                data[j].Image,
                                                id_course
                                            );
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 4) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba,
                                OpDiario
                            );
                            var NomJson = "PreguntasMultiple_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    data[j].Justifica,
                                                    id_course,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                            var NomJson2 = "RespuestasMultiples_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: "GET",
                                dataType: "json",
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(
                                                id_cedula,
                                                data[j].ID,
                                                data[j].FK_Pregunta,
                                                data[j].Opcion,
                                                data[j].Correcta,
                                                data[j].Image,
                                                id_course
                                            );
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 5) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba,
                                OpDiario
                            );
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

function guardarCursoCiertoFalsoPuntuacion() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? (apto = 1) : (apto = 0);

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_RespuestasSiNoPuntuacion where id_cedula= ? AND Respuesta is null",
                [id_cedula],
                function (tx, results) {
                    var item3 = results.rows.item(0);
                    if (item3.cuenta > 0) {
                        swal("", "Aún faltan preguntas por contestar", "warning");
                        return false;
                    } else {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
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
                                        console.error("Error al guardar cierre: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function guardarCursoCiertoFalso() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? (apto = 1) : (apto = 0);

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from cursoCiertoFalso where id_cedula= ? AND Respuesta is null",
                [id_cedula],
                function (tx, results) {
                    var item3 = results.rows.item(0);
                    if (item3.cuenta > 0) {
                        swal("", "Aún faltan preguntas por contestar", "warning");
                        return false;
                    } else {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
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
                                        console.error("Error al guardar cierre: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function gfirma(val) {
    if (val) {
        if (val == 1) {
            var signaturePad = testFirma;
            var data = signaturePad.toDataURL("data:image/jpeg;base64,");
            screen.orientation.lock("portrait");
            // screen.orientation.unlock();
            $("#signate").val(data);
            $("#ImagenFirmaView").attr("src", data);
            $("#VolverFirmar").html("Evidencia");
            $("#VolverAFirmar").html(
                "Volver a Firmar <i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;'>border_color</i>"
            );
            var element = document.querySelector(".page-content");
            element.scrollTop = element.scrollHeight;
        } else {
            var signaturePad = testFirma;
            var data = signaturePad.toDataURL("data:image/jpeg;base64,");
            screen.orientation.lock("portrait");
            // screen.orientation.unlock();
            $("#signate_" + val).val(data);
            $("#ImagenFirmaView_" + val).attr("src", data);
            $("#VolverFirmar_" + val).html("Evidencia");
            $("#VolverAFirmar_" + val).html(
                "Volver a Firmar <i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;'>border_color</i>"
            );
        }
    } else {
        var signaturePad = testFirma;
        var data = signaturePad.toDataURL("data:image/jpeg;base64,");
        screen.orientation.lock("portrait");
        // screen.orientation.unlock();
        $("#signate").val(data);
        $("#ImagenFirmaView").attr("src", data);
        $("#VolverFirmar").html("Evidencia");
        $("#VolverAFirmar").html(
            "Volver a Firmar <i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;'>border_color</i>"
        );
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
            tx5.executeSql(
                "SELECT COUNT(id_cedula) as cuenta FROM asistenciaHeader WHERE fecha = ? ",
                [fecha[0]],
                function (tx5, results) {
                    var item2 = results.rows.item(0);
                    var count = item2.cuenta;
                    if (count == 0) {
                        var id_usuario = localStorage.getItem("Usuario");
                        var nombre_usuario = localStorage.getItem("nombre");
                        var fecha_llegada = getDateWhitZeros();
                        var geolocation = "0";
                        var id_cliente = localStorage.getItem("empresa");
                        var nombre_cliente = "Lista Asistencia";
                        var horario_programado = fecha_llegada;
                        var estatus = 0;
                        var tipo_cedula = "Capacitación";
                        var nombre_evalua = "Lista de Asistencia";
                        var nombreInstructor = localStorage.getItem("nombre");
                        var id_instructor = localStorage.getItem("id_usuario");
                        var fecha_captura = getDateWhitZeros();
                        var id_course = 0; //! dinamic
                        productHandler.addCedula(
                            id_usuario,
                            nombre_usuario,
                            fecha_llegada,
                            id_course,
                            id_cliente,
                            nombre_cliente,
                            horario_programado,
                            estatus,
                            tipo_cedula,
                            nombre_evalua,
                            geolocation
                        );
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "Select MAX(id_cedula) as Id from cedulas_general",
                                    [],
                                    function (tx, results) {
                                        var progress = 0;
                                        var dialog = app.dialog.progress("Generando Lista", progress, "red");
                                        var empresa = localStorage.getItem("empresa");
                                        var item = results.rows.item(0);
                                        localStorage.setItem("IdCedula", item.Id);
                                        var id_cedula = item.Id;
                                        productHandler.asistenciaHeader(id_cedula, fecha[0], id_instructor, nombreInstructor, fecha_captura);
                                        var NomJson = "BecariosVsInstructor_" + empresa;
                                        app.request({
                                            url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                            method: "GET",
                                            dataType: "json",
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
                                                    dialog.setText("1 de " + aux);
                                                    for (var j = 0; j < data.length; j++) {
                                                        if (data[j].FKPersonalInstructor == id_instructor) {
                                                            aux2++;
                                                            // asistenciaDetails(id_cedula integer, fecha text, id_becario int,claveBecario, nameBecario, asiste int, fechaCaptura text)
                                                            productHandler.asistenciaDetails(
                                                                id_cedula,
                                                                fecha[0],
                                                                data[j].ID,
                                                                data[j].claveBecario,
                                                                data[j].nameBecario,
                                                                0,
                                                                fecha_captura,
                                                                aux,
                                                                aux2
                                                            );
                                                        }
                                                    }
                                                }
                                            },
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
                        swal("", "Ya existe una asistencia registrada", "warning");
                    }
                },
                function (tx5, error) {
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function actualizaLista(id) {
    if ($("#" + id).prop("checked") == true) {
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer marcar la asistencia sin escanear la credencial?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                let id_asistenciaD = id.replace("cb3-", "");
                let assite = 0;
                $("#" + id).prop("checked") == true ? (assite = 1) : (assite = 0);
                let flagTipo = "Boton";
                let FKTipo = 1;
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "UPDATE asistenciaDetails SET asiste = ?, flagTipo = ?, FKTipo = ?, fechaCaptura = ? WHERE id_asistenciaD = ?",
                            [assite, flagTipo, FKTipo, getDateWhitZeros(), id_asistenciaD],
                            function (tx, results) {
                                swal("", "Asistencia guardada correctamente", "success");
                                $("#divAsistencia_" + id_asistenciaD).html(`<span class="element_asis_evt_green">ASISTENCIA</span>`);
                                $("#divAsistenciaToggle_" + id_asistenciaD).css("display", "none");
                            },
                            function (tx, error) {
                                console.error("Error al guardar cierre: " + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else {
                $("#" + id).prop("checked", false);
            }
        });
    }
}

function guardarAsistencia() {
    let id_cedula = localStorage.getItem("IdCedula");

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
                            <p class="texto_master" style="margin: 20px 0 20px 0;">TRÁMITES</p>
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
                $("#close_sheet").click(function () {
                    app.sheet.close("#sheet-modal");
                });
            },
        },
    });
    popEvidencia.open();
}

function LLamarCursos(ID, FKPersonalBecario, nameBecario) {
    app.sheet.close("#sheet-modal");
    var empresa = localStorage.getItem("empresa");
    var NomJson = "BecariosCursos_" + empresa;
    var html = "";
    localStorage.setItem("nameBecario", nameBecario);
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
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
                            $("#close_sheet-1").click(function () {
                                app.sheet.close("#sheet-modal-1");
                            });
                        },
                    },
                });
                popEvidencia.open();
            }
        },
    });
}

function LLamarIMTES(ID, FKPersonalBecario, nameBecario) {
    app.sheet.close("#sheet-modal");
    var empresa = localStorage.getItem("empresa");
    var NomJson = "BecariosCursos_" + empresa;
    var html = "";
    localStorage.setItem("nameBecario", nameBecario);
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
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
                            $("#close_sheet-2").click(function () {
                                app.sheet.close("#sheet-modal-2");
                            });
                        },
                    },
                });
                popEvidencia.open();
            }
        },
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
        generaEvaluacion(IDCurso);
    } else {
        if (Realizado == 1) {
            app.sheet.close("#sheet-modal-1");
            app.sheet.close("#sheet-modal-2");
            var empresa = localStorage.getItem("empresa");
            var NomJson = "DatosEvaluacionS_" + empresa;
            var html = `<div class="card-content">
                <div class="card" style="text-align: center;padding-left: 15px;padding-right: 15px;border: 1px solid #005D99;border-radius: 10px;">
                    <span class="span FWM-span-form">Evaluacion no disponible</span>
                </div></div>`;
            let encontro = false;
            app.request({
                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                method: "GET",
                dataType: "json",
                success: function (data) {
                    var length = data.length;
                    if (length == 0) {
                        segundaBusqueda22(IDCurso, FK_Becario);
                    } else {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario) {
                                encontro = true;
                                var check = "";
                                data[j].apto == 1 ? (check = "checked") : (check = "");
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
                                                <label class="item-content">
                                                    <div class="item-inner2">
                                                        <div class="item-after item-after2">
                                                            <div class="toggle toggle-init color-green">
                                                                <input id="cb3" type="checkbox" ${check} onclick="return false;">
                                                                <span class="toggle-icon toggle-icon2"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
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
                        if (!encontro) {
                            segundaBusqueda22(IDCurso, FK_Becario);
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
                                        $("#close_sheet-3").click(function () {
                                            app.sheet.close("#sheet-modal-3");
                                        });
                                    },
                                },
                            });
                            popEvidencia.open();
                        }
                    }
                },
            });
        } else {
            generaEvaluacion(IDCurso);
        }
    }
}

function segundaBusqueda22(IDCurso, FK_Becario) {
    console.log("ff");
    var empresa = localStorage.getItem("empresa");
    var html = "";
    var NomJson = "DatosEvaluacionD_" + empresa;
    let encontro = false;
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].FK_IDCurso == IDCurso && data[j].FK_Becario == FK_Becario) {
                        console.log(encontro);
                        encontro = true;
                        var check = "";
                        data[j].apto == 1 ? (check = "checked") : (check = "");
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
                                        <label class="item-content">
                                            <div class="item-inner2">
                                                <div class="item-after item-after2">
                                                    <div class="toggle toggle-init color-green">
                                                        <input id="cb3" type="checkbox" ${check}>
                                                        <span class="toggle-icon toggle-icon2"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
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
                if (!encontro) {
                    console.log("No enconro", IDCurso, FK_Becario);
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
                                $("#close_sheet-3").click(function () {
                                    app.sheet.close("#sheet-modal-3");
                                });
                            },
                        },
                    });
                    popEvidencia.open();
                }
            }
        },
    });
}

function actualizaRespuestaSiNoPuntuacion(id, valor, OpCorrecta) {
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes("1")) {
        var respuesta = 1;
        var id_pregunta = ids[0].replace("op", "");
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
    } else if (check.includes("0")) {
        var respuesta = 0;
        var id_pregunta = ids[0].replace("op", "");
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
            tx.executeSql(
                "UPDATE CAP_RespuestasSiNoPuntuacion SET Respuesta = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta, id_cedula, id_pregunta],
                function (tx, results) {
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "Select SUM(Valor) as cuenta from CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ? AND Respuesta = OpCorrecta AND Respuesta IS NOT NULL",
                                [id_cedula],
                                function (tx, results) {
                                    var item3 = results.rows.item(0);
                                    $("#calificacion_number").val(item3.cuenta);
                                    getCalificacionCursoValor(item3.cuenta);
                                }
                            );
                        },
                        function (error) {},
                        function () {}
                    );
                },
                function (tx, error) {
                    console.error("Error al guardar: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function sincronizaDatosCapacitacion() {
    let EmpresaID = 1;
    let paso = 1;
    let urlBase2 = "http://192.168.100.10/CISAApp/HMOFiles/Exec";
    // var urlBase2 = "http://172.16.0.143/CISAApp/HMOFiles/Exec";
    // let urlBase2 = "http://tmshmo.ci-sa.com.mx/www.CISAAPP.com/HMOFiles_dev/Exec";
    let url = urlBase2 + "/capacitacion/datos.php?empresa=" + EmpresaID + "&paso=" + paso;

    fetch(url).then((response) => {
        console.log("Sincroniza datos OK!");
        eliminaCache();
    });
}

function guardarCursoMultiple() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? (apto = 1) : (apto = 0);

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from CAP_RespuestasMultiple where id_cedula= ? AND Respuesta is null",
                [id_cedula],
                function (tx, results) {
                    var item3 = results.rows.item(0);
                    if (item3.cuenta > 0) {
                        swal("", "Aún faltan preguntas por contestar", "warning");
                        return false;
                    } else {
                        $("#PuntosCurso").val(0);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "Select FK_IDPregunta, Respuesta from CAP_RespuestasMultiple where id_cedula= ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        var FK_IDPregunta = "";
                                        var Respuesta = "";
                                        for (var i = 0; i < length; i++) {
                                            var item2 = results.rows.item(i);
                                            FK_IDPregunta = item2.FK_IDPregunta;
                                            Respuesta = item2.Respuesta;
                                            getOpcionesMultiples(FK_IDPregunta, Respuesta, length);
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
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
                                                        console.error("Error al guardar cierre: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                }
            );
        },
        function (error) {},
        function () {}
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
                    var letter = 64;
                    let puntos = Number($("#PuntosCurso").val());
                    for (var j = 0; j < length; j++) {
                        letter++;
                        var item3 = results.rows.item(j);
                        Respuesta == letter && item3.Correcta == 1 ? puntos++ : null;
                    }
                    let promedio = (puntos * 100) / length2;
                    $("#PuntosCurso").val(puntos);
                    actualizaPromedio2(promedio.toFixed(2));
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function verDetalleCapacitacion(ID, FKPersonalBecario, nameBecario) {
    var empresa = localStorage.getItem("empresa");
    var NomJson = "BecariosCursos_" + empresa;
    var html = "";
    var coursesHTML = "";
    var imtesHTML = "";
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].FK_Becario == FKPersonalBecario) {
                    let check = "";
                    let apto = "";
                    data[j].aprobado == 1 ? (apto = "checked") : (apto = "");
                    data[j].realizado == 1 ? (check = "checked") : (check = "");
                    if (data[j].Certificadora == 0) {
                        coursesHTML += `<div style="display: flex; justify-content: space-around; align-items: center;" class="card">
                            <input type="checkbox" id="" ${check} onclick="return false;">
                            <h2 style=" font-size: 18px;color: #000;">${data[j].NombreCurso}</h2>
                            <div class="container_options">
                                <span class="span FWM-span-form">El candidato es Apto?:</span>
                                <label class="item-content">
                                    <div class="item-inner2" style="display: flex; justify-content: center;">
                                        <div class="item-after item-after2">
                                            <div class="toggle toggle-init color-green">
                                                <input id="cb3" type="checkbox" ${apto} onclick="return false;">
                                                <span class="toggle-icon toggle-icon2"></span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>`;
                    } else {
                        imtesHTML += `<div style="display: flex; justify-content: space-around; align-items: center;" class="card">
                            <input type="checkbox" id="" ${check} onclick="return false;">
                            <h2 style=" font-size: 18px;color: #000;">${data[j].NombreCurso}</h2>
                            <div class="container_options">
                                <span class="span FWM-span-form">El candidato es Apto?:</span>
                                <label class="item-content">
                                    <div class="item-inner2" style="display: flex; justify-content: center;">
                                        <div class="item-after item-after2">
                                            <div class="toggle toggle-init color-green">
                                                <input id="cb3" type="checkbox" ${apto} onclick="return false;">
                                                <span class="toggle-icon toggle-icon2"></span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>`;
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
                                        <h2 style="width: fit-content;margin-left: auto;margin-right: auto;background-color: #cce7ff;padding: 10px 25px 8px 25px;border-radius: 10px;">TRÁMITES</h2>
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
                        $("#close_sheet").click(function () {
                            app.sheet.close("#sheet-modal-4");
                        });
                    },
                },
            });

            popEvidencia.open();
        },
    });
}

function GuardarPhoto() {
    //CAP_Evidencias( id_cedula integer, evidencia blob, fecha text
    var id_cedula = localStorage.getItem("IdCedula");
    var foto = $("#imagenC").val();
    let Modulos = localStorage.getItem("Modulos");
    if (foto) {
        if (Modulos == "InsLavado") {
            let typeLavado = "N/A";
            $("#typeLavado").val() && (typeLavado = $("#typeLavado").val());
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "INSERT INTO IEN_EvidenciasLavado(id_cedula,FKHeader,evidencia,fecha,typeLavado,proceso) VALUES (?,?,?,?,?,1)",
                        [id_cedula, localStorage.getItem("IdHeader"), foto, getDateWhitZeros(), typeLavado],
                        function (tx, results) {
                            databaseHandler.db.transaction(
                                function (tx1) {
                                    tx1.executeSql(
                                        "Select * from IEN_EvidenciasLavado where id_cedula= ? AND FKHeader = ? AND proceso = 1 ORDER BY id_evidencia DESC LIMIT 1",
                                        [id_cedula, localStorage.getItem("IdHeader")],
                                        function (tx, results) {
                                            var item = results.rows.item(0);
                                            $("#evidencias_div").css("display", "none");
                                            $("#div_botones_camara").html(`<div style="min-width: 50px; border-style: none;">
                                                <span class="resize-handler"></span>
                                                <a href="#" onclick="ValidarCapturePhotoLavado()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                                    Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                                                </a>
                                            </div>`);
                                            $("#imagenC").val("");
                                            swal("", "Foto guardada correctamente", "success");
                                            $("#facturas").append(
                                                "<tr id='fila" +
                                                    item.id_evidencia +
                                                    "'><td style='text-align: center;'><img src='" +
                                                    item.evidencia +
                                                    "' width='60px' style='margin-top: 4px;'/></td><td style='text-align: center;'><a href='#' onclick='eliminarFilaFotoLavado(" +
                                                    item.id_evidencia +
                                                    ",1);' style='border: none; outline:none;'><i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;color:#FF0037;font-size: 40px;'>delete_forever</i></a></td></tr>"
                                            );
                                            $("#facturas2").append(
                                                "<tr id='fila" +
                                                    item.id_evidencia +
                                                    "'><td style='text-align: center;'><img src='" +
                                                    item.evidencia +
                                                    "' width='60px' style='margin-top: 4px;'/></td><td style='text-align: center;'><a href='#' onclick='eliminarFilaFotoLavado(" +
                                                    item.id_evidencia +
                                                    ",1);' style='border: none; outline:none;'><i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;color:#FF0037;font-size: 40px;'>delete_forever</i></a></td></tr>"
                                            );
                                            $(".message-nr").css("display", "none");
                                        }
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
        } else {
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "INSERT INTO CAP_Evidencias(id_cedula,evidencia,fecha) VALUES (?,?,?)",
                        [id_cedula, foto, getDateWhitZeros()],
                        function (tx, results) {
                            databaseHandler.db.transaction(
                                function (tx1) {
                                    tx1.executeSql(
                                        "Select * from CAP_Evidencias where id_cedula= ? ORDER BY id_evidencia DESC LIMIT 1",
                                        [id_cedula],
                                        function (tx, results) {
                                            var item = results.rows.item(0);
                                            $("#evidencias_div").css("display", "none");
                                            $("#div_botones_camara").html(`<div style="min-width: 50px; border-style: none;">
                                                <span class="resize-handler"></span>
                                                <a href="#" onclick="ValidarCapturePhoto()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                                    Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                                                </a>
                                            </div>`);
                                            $("#imagenC").val("");
                                            swal("", "Foto guardada correctamente", "success");
                                            $("#facturas").append(
                                                "<tr id='fila" +
                                                    item.id_evidencia +
                                                    "'><td style='text-align: center;'><img src='" +
                                                    item.evidencia +
                                                    "' width='60px' style='margin-top: 4px;'/></td><td style='text-align: center;'><a href='#' onclick='eliminarFilaFoto(" +
                                                    item.id_evidencia +
                                                    ",1);' style='border: none; outline:none;'><i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;color:#FF0037;font-size: 40px;'>delete_forever</i></a></td></tr>"
                                            );
                                            $("#message-nr").css("display", "none");
                                        }
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
    } else {
        swal("", "Debes tomar una fotografía:", "warning");
    }
}

function ValidarCapturePhoto() {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx1) {
            tx1.executeSql("Select COUNT(id_cedula) as cuenta from CAP_Evidencias where id_cedula= ?", [id_cedula], function (tx, results) {
                var item = results.rows.item(0);
                if (item.cuenta <= 2) {
                    capturePhoto();
                } else {
                    swal("", "Solo puedes agregar máx. 3 fotos", "warning");
                }
            });
        },
        function (error) {},
        function () {}
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
            function (error) {},
            function () {}
        );
    }
}

function guardarCursoEvidencias() {
    var id_cedula = localStorage.getItem("IdCedula");
    var observaciones = $("#observaciones").val();
    var firmaInstructor = $("#signate").val();
    var apto = 0;
    $("#cb3").prop("checked") == true ? (apto = 1) : (apto = 0);

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("Select COUNT(id_cedula) as cuenta from CAP_Evidencias where id_cedula= ?", [id_cedula], function (tx, results) {
                var item3 = results.rows.item(0);
                if (item3.cuenta <= 0) {
                    swal("", "Aún no haz agregado evidencias", "warning");
                    return false;
                } else {
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "UPDATE datosGeneralesCurso SET apto = ?, observaciones = ?, firmaInstructor = ? WHERE id_cedula = ?",
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
                                    console.error("Error al guardar cierre: " + error.message);
                                }
                            );
                        },
                        function (error) {},
                        function () {}
                    );
                }
            });
        },
        function (error) {},
        function () {}
    );
}

function generarCursoManejo() {
    var values = get_datos_completos("datos_form");
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha_llegada = getDateWhitZeros();
        var geolocation = $("#CursosTecnicos").find("option:selected").attr("name");
        var id_cliente = localStorage.getItem("empresa");
        var nombre_cliente = $("#nombreCandidato").val();
        var horario_programado = fecha_llegada;
        var estatus = 0;
        var tipo_cedula = "Capacitación";
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
        var IDTipoCurso = $("#CursosTecnicos").find("option:selected").attr("name");
        var ID_AT = $("#ID_AT").val();
        var costo = 0;
        var Prueba = 1;

        productHandler.addCedula(
            id_usuario,
            nombre_usuario,
            fecha_llegada,
            id_course,
            id_cliente,
            nombre_cliente,
            horario_programado,
            estatus,
            tipo_cedula,
            nombre_evalua,
            geolocation
        );
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select MAX(id_cedula) as Id from cedulas_general",
                    [],
                    function (tx, results) {
                        //app.dialog.progress('Generando CheckList','red');
                        var progress = 0;
                        var dialog = app.dialog.progress("Generando Curso", progress, "red");
                        var empresa = localStorage.getItem("empresa");
                        var item = results.rows.item(0);
                        localStorage.setItem("IdCedula", item.Id);
                        var id_cedula = item.Id;
                        if (IDTipoCurso == 1) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba
                            );
                            var NomJson = "CursoCiertoFalso" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasCiertoFalso(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    data[j].texto1,
                                                    data[j].texto2,
                                                    data[j].OpCorrecta,
                                                    id_course,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 2) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba
                            );
                            var NomJson = "CursoSiNoValor" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasSiNoValor(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    id_course,
                                                    data[j].OpCorrecta,
                                                    data[j].Valor,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 3) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba
                            );
                            var NomJson = "PreguntasMultiple_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    data[j].Justifica,
                                                    id_course,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                            var NomJson2 = "RespuestasMultiples_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: "GET",
                                dataType: "json",
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(
                                                id_cedula,
                                                data[j].ID,
                                                data[j].FK_Pregunta,
                                                data[j].Opcion,
                                                data[j].Correcta,
                                                data[j].Image,
                                                id_course
                                            );
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 4) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba
                            );
                            var NomJson = "PreguntasMultiple_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
                                method: "GET",
                                dataType: "json",
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
                                        dialog.setText("1 de " + aux);
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j].IDNombreCurso == id_course) {
                                                aux2++;
                                                productHandler.insertPreguntasMultiple(
                                                    id_cedula,
                                                    data[j].IDPregunta,
                                                    data[j].Pregunta,
                                                    data[j].Justifica,
                                                    id_course,
                                                    aux,
                                                    aux2
                                                );
                                            }
                                        }
                                    }
                                },
                            });
                            var NomJson2 = "RespuestasMultiples_" + empresa;
                            app.request({
                                url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson2 + ".json",
                                method: "GET",
                                dataType: "json",
                                success: function (data) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].FK_IDCurso == id_course) {
                                            productHandler.insertOptionsMultiple(
                                                id_cedula,
                                                data[j].ID,
                                                data[j].FK_Pregunta,
                                                data[j].Opcion,
                                                data[j].Correcta,
                                                data[j].Image,
                                                id_course
                                            );
                                        }
                                    }
                                },
                            });
                        } else if (IDTipoCurso == 5) {
                            productHandler.addDatosPrueba1(
                                id_cedula,
                                fecha,
                                nombreInstructor,
                                id_instructor,
                                id_candidato,
                                nombreCandidato,
                                edad,
                                telCelular,
                                antecedentesManejo,
                                name_course,
                                fecha_captura,
                                id_course,
                                IDTipoCurso,
                                ID_AT,
                                costo,
                                Prueba
                            );
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
        swal("", "Debes llenar estos campos para poder guardar: " + quita_coma, "warning");
        return false;
    }
}

function validaEventos(fecha) {
    var id_cedula = localStorage.getItem("IdCedula");

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql("Select id_becario from asistenciaDetails where id_cedula= ?", [id_cedula], function (tx, results) {
                var length = results.rows.length;
                if (length == 0) {
                } else {
                    for (var i = 0; i < length; i++) {
                        var item = results.rows.item(i);
                        validaEventosDetails(fecha, item.id_becario);
                    }
                }
            });
        },
        function (error) {},
        function () {}
    );
}

function validaEventosDetails(fecha, id_becario) {
    var empresa = localStorage.getItem("empresa");
    var NomJson = "ViewIncidencias_" + empresa;
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            var length = data.length;
            if (length == 0) {
            } else {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].fecha_e == fecha) {
                        if (data[j].FK_Becario == id_becario) {
                            $("#div_evento_" + id_becario).html(`
                                <span class="element_asis_evt">${data[j].flag_incidencia}</span>
                            `);
                            // $(".toogle_" + id_becario).attr("data-tg-on", "Confirmado")
                        }
                    }
                }
            }
        },
    });
}

function getCalificacionCursoValor(puntos) {
    let IDCurso = localStorage.getItem("IDCurso");
    let empresa = localStorage.getItem("empresa");
    let NomJson = "Calificaciones_" + empresa;
    let califf = 0;
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let length = data.length;
            if (length == 0) {
            } else {
                data.forEach(function (dat, index) {
                    if (dat.FKCurso == IDCurso) {
                        let min = Number(dat.Calif7);
                        min--;
                        if (puntos > min && puntos <= dat.Calif7) {
                            califf = 7;
                        } else if (puntos >= dat.Calif7 && puntos <= dat.Calif8) {
                            califf = 8;
                        } else if (puntos > dat.Calif8 && puntos <= dat.Calif9) {
                            califf = 9;
                        } else if (puntos > dat.Calif9 && puntos <= dat.Calif10) {
                            califf = 10;
                        } else {
                            califf = 0;
                        }
                        $("#calificacion_text").html("Puntaje Obtenido: " + puntos + ", Calificación: " + califf);
                        actualizaPromedio2(califf);
                    }
                });
            }
        },
    });
}

function actualizaPromedio2(valor) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE datosGeneralesCurso SET promedio = ? WHERE id_cedula = ?",
                [valor, id_cedula],
                function (tx, results) {},
                function (tx, error) {
                    console.error("Error al guardar: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function guardaJustificacion(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var respuestas = id.split("_");
    var FK_IDPregunta = respuestas[1];
    var respuesta = $("#" + id).val();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE CAP_RespuestasMultiple SET Justificacion = ? WHERE id_cedula = ? AND FK_IDPregunta = ?",
                [respuesta, id_cedula, FK_IDPregunta],
                function (tx, results) {},
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function actualizaObsAsistencia(id_cedula, id_asistenciaD) {
    let observacionAsistencia = $("#observacionAsistencia").val();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE asistenciaDetails SET observacionAsistencia = ? WHERE id_cedula = ? AND id_asistenciaD = ?",
                [observacionAsistencia, id_cedula, id_asistenciaD],
                function (tx, results) {
                    swal("", "Observaciones guardadas correctamente", "success");
                    $("#divObs_" + id_asistenciaD).html(`<span>${observacionAsistencia}</span>`);
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function leerQrCrendencialBeceario(id_asistenciaD) {
    buscadorBecario("C1413/MIHSA", id_asistenciaD);
    // cordova.plugins.barcodeScanner.scan(
    //     function (result) {
    //         buscadorBecario(result.text, id_asistenciaD);
    //     },
    //     function (error) {
    //         alert("Scanning failed: " + error);
    //     },
    //     {
    //         preferFrontCamera: false,
    //         showFlipCameraButton: true,
    //         showTorchButton: true,
    //         torchOn: false,
    //         saveHistory: false,
    //         prompt: "Coloca el código dentro de la zona marcada",
    //         resultDisplayDuration: 500,
    //         orientation: "portrait",
    //         disableAnimations: true,
    //         disableSuccessBeep: false,
    //     }
    // );
}

function buscadorBecario(dataQR, id_asistenciaD) {
    let id_instructor = localStorage.getItem("id_usuario");
    let NomJson = "BecariosVsInstructor_1";
    app.request({
        url: cordova.file.dataDirectory + "jsons_capacitacion/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].FKPersonalInstructor == id_instructor) {
                    if (data[j].QRBecario == dataQR) {
                        let flagTipo = "Escaner";
                        let FKTipo = 2;
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "UPDATE asistenciaDetails SET asiste = ?, flagTipo = ?, FKTipo = ?, fechaCaptura = ? WHERE id_asistenciaD = ?",
                                    [1, flagTipo, FKTipo, getDateWhitZeros(), id_asistenciaD],
                                    function (tx, results) {
                                        swal("", "Asistencia guardada correctamente", "success");
                                        $("#divAsistencia_" + id_asistenciaD).html(`<span class="element_asis_evt_green">ASISTENCIA</span>`);
                                        $("#divAsistenciaToggle_" + id_asistenciaD).css("display", "none");
                                    },
                                    function (tx, error) {
                                        console.error("Error al guardar cierre: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                }
            }
        },
    });
}

function editarComentariosAsistencia(id_asistenciaD) {
    let id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "SELECT * FROM asistenciaDetails WHERE id_cedula = ? AND id_asistenciaD = ?",
                [id_cedula, id_asistenciaD],
                function (tx, results) {
                    let item = results.rows.item(0);
                    console.log(item);
                    let nameBecario = item.nameBecario;
                    let observacionAsistencia = item.observacionAsistencia;
                    console.log("observacionAsistencia =>", observacionAsistencia);
                    // let length = results.rows.length;
                    // if (length == 0) {
                    // } else {
                    //     for (let i = 0; i < length; i++) {
                    //         let item = results.rows.item(i);
                    //         console.log(item);
                    //     }
                    // }
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
                                    <h5 class="FWN-titulo-2" style="margin-bottom: 10px;"> Comentarios de asistencia </h5><hr>
                                    <span>Becario: ${nameBecario} <br><br> Comentarios: </span>
                                    <textarea class="FWM-input" style="font-family: 'ITC Avant Garde Gothic', sans-serif;width: 98%;padding-top: 10px;margin-top: 10px;" id="observacionAsistencia" cols="30" rows="10" maxlength="255" onchange="actualizaObsAsistencia(${id_cedula}, ${id_asistenciaD})"></textarea>
                                </div>
                            </div>
                        </div>`,
                        swipeToClose: false,
                        closeByOutsideClick: false,
                        closeByBackdropClick: false,
                        closeOnEscape: false,
                        on: {
                            open: function (popup) {
                                if (observacionAsistencia) {
                                    $("#observacionAsistencia").val(observacionAsistencia);
                                }

                                $("#close_sheet").click(function () {
                                    app.sheet.close("#sheet-modal");
                                });
                            },
                        },
                    });
                    popEvidencia.open();
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
//fin Capacitacion
