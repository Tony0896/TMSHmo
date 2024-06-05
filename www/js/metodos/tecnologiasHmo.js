//Inicio tecnologiasHmo

function continuarCed2(id_cedula, tipo) {
    localStorage.setItem("IdCedula", id_cedula);

    if (tipo == "tecnologiasHmo") {
        app.views.main.router.back("/yallegueTecnologiasHMO/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else if (tipo == "Relevos") {
        app.views.main.router.back("/formRelevos1/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else if (tipo == "Diesel") {
        app.views.main.router.back("/yallegueDiesel/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    }
}

function preInicioTech() {
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

function iniciartecnologiasHmo() {
    var id_usuario = localStorage.getItem("id_usuario");
    var nombre_usuario = localStorage.getItem("Usuario");
    var fecha_llegada = getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = "Inspección tecnologías";
    var estatus = 0;
    var geolocation = "";
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = "tecnologiasHmo";
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
                    app.views.main.router.navigate({
                        name: "yallegueTecnologiasHMO",
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
}

function editarInspeccion(IdHeader) {
    localStorage.setItem("IdHeader", IdHeader);
    app.views.main.router.navigate({ name: "formtecnologiasHmo1" });
}

function preInspeccionarUnidad() {
    app.dialog.progress("Trabajando... ", "red");
    setTimeout(() => {
        inspeccionarUnidad();
        app.dialog.close();
    }, "250");
}

function inspeccionarUnidad() {
    if ($("#id_unidad").val()) {
        let id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select id_cedula from DesTechHeader WHERE id_cedula = ? AND id_unidad = ?",
                    [id_cedula, $("#id_unidad").val()],
                    function (tx, results) {
                        let length = results.rows.length;
                        if (length == 0) {
                            let unidad = $("#autocomplete-dropdown-ajax").val();
                            let id_unidad = $("#id_unidad").val();
                            let id_operador = $("#id_operador").val();
                            let operador = $("#operador").val();
                            let credencial = $("#credencial").val();
                            let fecha_inicio = getDateWhitZeros();
                            let progress = 0;
                            let dialog = app.dialog.progress("Trabajando... ", progress, "red");
                            let id_empresa = localStorage.getItem("empresa");
                            let NomJson = "datos_check" + id_empresa;

                            // productHandler.addDesTechHmoHeader(id_cedula, unidad, id_unidad, id_operador, operador, credencial, fecha_inicio);
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "insert into DesTechHeader(id_cedula, unidad, id_unidad, id_operador, operador, credencial, fecha_inicio) values(?, ?, ?, ?, ?, ?, ?)",
                                        [id_cedula, unidad, id_unidad, id_operador, operador, credencial, fecha_inicio],
                                        function (tx, results) {
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "Select MAX(IdHeader) as IdHeader from DesTechHeader",
                                                        [],
                                                        function (tx, results) {
                                                            var item = results.rows.item(0);
                                                            localStorage.setItem("IdHeader", item.IdHeader);
                                                            app.request({
                                                                url: cordova.file.dataDirectory + "jsons_tecnologiasHmo/" + NomJson + ".json",
                                                                method: "GET",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    var aux = data.length;
                                                                    var aux2 = 0;
                                                                    if (aux == 0) {
                                                                        app.dialog.close();
                                                                        swal("", "Algo salió mal.", "warning");
                                                                    } else {
                                                                        dialog.setText("1 de " + aux);
                                                                        for (var j = 0; j < data.length; j++) {
                                                                            aux2++;
                                                                            productHandler.addDesTechHmoDetails(
                                                                                id_cedula,
                                                                                item.IdHeader,
                                                                                data[j].ID,
                                                                                data[j].Pregunta,
                                                                                data[j].Multiple,
                                                                                data[j].FK_formato,
                                                                                data[j].FK_equipo,
                                                                                aux,
                                                                                aux2
                                                                            );
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
                                        },
                                        function (tx, error) {
                                            console.error("Error registrar:" + error.message);
                                        }
                                    );
                                },
                                function (error) {
                                    console.log(error);
                                },
                                function () {}
                            );
                        } else {
                            $("#id_unidad").val("");
                            $("#id_operador").val("");
                            $("#credencial").val("");
                            $("#operador").val("");
                            swal("", "Esta unidad ya la tienes registrada.", "warning");
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
        swal("", "Selecciona una unidad para poder continuar.", "warning");
    }
}

function TerminarCheckListHMO() {
    let id_cedula = localStorage.getItem("IdCedula");
    let IdHeader = localStorage.getItem("IdHeader");
    if ($("#ID_personal").val()) {
        databaseHandler.db.transaction(
            function (tx5) {
                tx5.executeSql(
                    "SELECT id_cedula FROM DesTechDetails WHERE id_cedula = ? AND respuesta is null",
                    [id_cedula],
                    function (tx5, results) {
                        let length = results.rows.length;
                        if (length == 0) {
                            let observaciones = $("#observaciones").val();
                            observaciones = observaciones.trim();
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE DesTechHeader SET fecha_fin = ?, observaciones= ? WHERE id_cedula = ? AND IdHeader = ?;",
                                        [getDateWhitZeros(), observaciones, id_cedula, IdHeader],
                                        function (tx, results) {
                                            regresaTechHmo();
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
                            swal("", "Debes responder a todos los conceptos para poder continuar.", "warning");
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
    } else {
        swal({
            title: "Aviso",
            text: "Aún no haz elegido un conductor ¿Estas seguro de querer regresar?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                regresaTechHmo();
            }
        });
    }
}

function SeleccionarDanosControlTec(id, pregunta, multiple, FK_equipo) {
    if (multiple == 1) {
        var text = pregunta;
        let result = text.includes("(");
        if (result) {
            var resultados = text.split("(");
            var titulo_modal = resultados[0].trim();
            var divididos = resultados[1].split(",");
            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
            var quitapar = "";
            for (i = 0; i < divididos.length; i++) {
                quitapar = divididos[i].replace("(", "");
                quitapar = quitapar.replace(")", "");
                quitapar = capitalizarPrimeraLetra(quitapar);
                opciones = opciones + `<option value=` + quitapar.trim() + `>` + quitapar.trim() + `</option>`;
            }
            opciones = opciones + "</select>";
            CreaModalOptionCtlTec(id, opciones, 1, titulo_modal, FK_equipo);
        } else {
            var titulo_modal = "";
            var divididos = text.split(",");
            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
            var quitapar = "";
            for (i = 0; i < divididos.length; i++) {
                quitapar = divididos[i].replace("(", "");
                quitapar = quitapar.replace(")", "");
                quitapar = capitalizarPrimeraLetra(quitapar);
                opciones = opciones + `<option value=` + quitapar.trim() + `>` + quitapar.trim() + `</option>`;
            }
            opciones = opciones + "</select>";
            var titulo_modal = "";
            CreaModalOptionCtlTec(id, opciones, 2, titulo_modal, FK_equipo);
        }
    } else {
        var opciones = false;
        var titulo_modal = "";
        CreaModalOptionCtlTec(id, opciones, 3, titulo_modal, FK_equipo);
    }
}

function actualizacheckControlTec(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var IdHeader = localStorage.getItem("IdHeader");
    var ids = id.split("-");
    var check = ids[1];
    if (check.includes("1")) {
        var respuesta = 1;
        var comentarios = "";
        var id_pregunta = ids[0].replace("radio", "");
        $("#span-" + id_pregunta).html(comentarios);
        $("#spanComentarios-" + id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "UPDATE DesTechDetails SET respuesta = ?,comentarios = ?, falla = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND IdHeader = ?",
                    [respuesta, comentarios, comentarios, id_cedula, id_pregunta, IdHeader],
                    function (tx, results) {},
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    } else if (check.includes("2")) {
        var respuesta = 2;
        var id_pregunta = ids[0].replace("radio", "");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "UPDATE DesTechDetails SET respuesta = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND IdHeader = ?",
                    [respuesta, id_cedula, id_pregunta, IdHeader],
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
}

function agregaComentariosCtlTec(id_pregunta, mul, FK_equipo) {
    if (mul == 1 || mul == 2) {
        var seleccionados = $("#opts_modal").val();
        if (seleccionados.length == 0) {
            swal("", "Selecciona al menos una opción del desplegable.", "warning");
            return false;
        } else {
            var opts = "";
            $("#opts_modal option").each(function () {
                if (this.selected) {
                    opts = opts + ", " + capitalizarPrimeraLetra($(this).text());
                }
            });
            opts = opts.slice(1);
            opts = opts + ":";
        }
    } else {
        var opts = "";
    }
    var campos;
    var comentarios = "";
    var FKs = "";

    campos = document.querySelectorAll("#div_cboxs .obligatorio");
    var valido = false,
        valido2 = false;

    [].slice.call(campos).forEach(function (campo) {
        if (campo.checked == true) {
            valido = true;
            valido2 = true;
            comentarios = comentarios + ", " + campo.value;
            FKs = FKs + "," + campo.id.replace("cbox", "");
        }
    });

    if (FK_equipo == 0) {
        let obs_generales = $("#obs_generales").val();
        if (obs_generales.trim()) {
            valido2 = true;
        }
        valido = true;
    }

    if (valido) {
        if (valido2) {
            var str = comentarios;
            var name = str.slice(1);
            var name2 = FKs.slice(1);
            name = opts + "" + name;
            name = name.trim();
            name = capitalizarPrimeraLetra(name);
            var id_cedula = localStorage.getItem("IdCedula");
            var IdHeader = localStorage.getItem("IdHeader");
            var obs_generales = $("#obs_generales").val();

            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "UPDATE DesTechDetails SET falla = ?, comentarios = ?, FKsFallas = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND IdHeader = ?",
                        [name, obs_generales, name2, id_cedula, id_pregunta, IdHeader],
                        function (tx, results) {
                            $("#span-" + id_pregunta).html(name);
                            $("#spanComentarios-" + id_pregunta).html(obs_generales ? `Comentarios:  ${obs_generales}` : ``);
                            app.sheet.close("#sheet-modal");
                            swal("", "Comentario guardado correctamente", "success");
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
            swal("", "Debes indicar tus comentarios sobre la falla", "warning");
        }
    } else {
        swal("", "Selecciona almenos un daño para poder guardar", "warning");
    }
}

function CreaModalOptionCtlTec(id, opciones, mul, titulo_modal, FK_equipo) {
    if (mul == 3) {
        var display = "none"; //div_opt
        var display1 = "none"; //titulo_modal
    } else if (mul == 2) {
        var display = "block"; //div_opt
        var display1 = "none"; //titulo_modal
    } else if (mul == 1) {
        var display = "block"; //div_opt
        var display1 = "block"; //titulo_modal
    }

    var NomDescCli = "fallos";
    var html = "";
    let texto;
    FK_equipo == 0 ? (texto = "Describe la falla que tiene") : (texto = "Selecciona una o varias fallas");
    app.request.get(cordova.file.dataDirectory + "jsons_tecnologiasHmo/" + NomDescCli + ".json", function (data) {
        var content2 = JSON.parse(data);
        for (var x = 0; x < content2.length; x++) {
            if (FK_equipo == content2[x].id_tipo_equipo_recaudo) {
                html =
                    html +
                    `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox${content2[x].id_tipo_falla}" value="${content2[x].nombre_tipo_falla}">${content2[x].nombre_tipo_falla}</label><br>`;
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
                    <h3 class="FWN-titulo-2">${texto}</h3><hr>
                    <span id="titulo_modal" style="display:${display1};color: #FF0037;" class="span FWM-span-form">${titulo_modal}</span>
                    <div id="div_opt" style="display:${display}; padding-top: 10px;margin-bottom: 20px;">
                    ${opciones}
                    </div>
                    <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                        <input type="hidden" id="inputEvidencia" value=${id}>
                        <input type="hidden" id="pasa" value="0">
                            ${html}
                        <div>
                            <span style="color: #005D99;" class="span FWM-span-form">Comentarios</span>
                            <textarea class="FWM-input" style="font-family: 'ITC Avant Garde Gothic', sans-serif;" id="obs_generales" cols="30" rows="10" maxlength="255"></textarea>
                        </div>
                        <div class="block grid-resizable-demo" style="margin-bottom: 70px;padding-top: 35px;">
                            <div class="row align-items-stretch" style="text-align: center;">
                                <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                    <span class="resize-handler"></span>
                                    <a href="#" onclick="agregaComentariosCtlTec(${id},${mul},${FK_equipo});" style="background-color: #FF0037;padding-left: 50px;padding-right: 50px;" class="boton-equipo">Guardar</a>
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
                    $("#close_sheet").click(function () {
                        if ($("#pasa").val() != 0) {
                            app.sheet.close("#sheet-modal");
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
                                    var labels1 = Check.replace("radio", "label");
                                    var labels2 = otherCheck.replace("radio", "label");
                                    $("#" + labels1).addClass("checked");
                                    $("#" + labels2).removeClass("checked");
                                    actualizacheckControlTec(Check);
                                    app.sheet.close("#sheet-modal");
                                }
                            });
                        }
                    });
                },
            },
        });
        popEvidencia.open();
    });
}

function regresaTechHmo() {
    window.localStorage.removeItem("IdHeader");
    app.views.main.router.back("/yallegueTecnologiasHMO/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}

function actualizaOperadorTech() {
    let id_cedula = localStorage.getItem("IdCedula");
    let IdHeader = localStorage.getItem("IdHeader");
    let ID_personal = $("#ID_personal").val();
    let clave = $("#clave").val();
    let fullName = $("#fullName").val();

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE DesTechHeader SET id_operador = ?, operador = ?, credencial = ? WHERE id_cedula = ? AND IdHeader = ?",
                [ID_personal, fullName, clave, id_cedula, IdHeader],
                function (tx, results) {},
                function (tx, error) {
                    swal("Error al guardar", error.message, "error");
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function FinalizarInspecciones() {
    let id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select COUNT(id_cedula) as cuenta from DesTechHeader WHERE id_cedula = ? AND (id_operador IS NULL OR id_operador = '')",
                [id_cedula],
                function (tx, results) {
                    // var item = results.rows.item(0);
                    // if(item.cuenta > 0){
                    //     swal("", "Tienes unidades sin operador, para poder continuar debes completar el registro", "warning")
                    // } else {
                    // }
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
                    console.log("Error al guardar cedula: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function eliminarInspeccion(IdHeader) {
    let id_cedula = localStorage.getItem("IdCedula");
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer eliminar el registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "DELETE FROM DesTechDetails WHERE id_cedula = ?",
                        [id_cedula],
                        function (tx, results) {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM DesTechHeader WHERE id_cedula = ? AND IdHeader = ?",
                                        [id_cedula, IdHeader],
                                        function (tx, results) {
                                            $("#renglon_" + IdHeader).remove();
                                            swal("", "Eliminado correctamente", "success");
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
}
//Fin tecnologiasHmo
