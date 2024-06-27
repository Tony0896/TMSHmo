//?Inicio Campanias

function continuarCedInsEncierro(id_cedula, tipo) {
    localStorage.setItem("IdCedula", id_cedula);
    if (tipo == 1) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("Select * from cedulas_general where id_cedula= ?", [id_cedula], function (tx, results) {
                    let item2 = results.rows.item(0);
                    localStorage.setItem("IDCampania", item2.geolocalizacion_entrada);
                    localStorage.setItem("nombreCampania", item2.nombre_evalua);
                    localStorage.setItem("FK_formato", item2.geolocalizacion_salida);

                    app.views.main.router.back("/formEncierro1/", {
                        force: true,
                        ignoreCache: true,
                        reload: true,
                    });
                });
            },
            function (error) {},
            function () {}
        );
    }
}

function preCreaCampania(IDCampania, nombreCampania, FK_formato) {
    swal({
        title: "Aviso",
        text: "¿Deseas crear una nueva campaña de: " + nombreCampania + "?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_usuario = localStorage.getItem("id_usuario");
            var nombre_usuario = localStorage.getItem("Usuario");
            var fecha_llegada = getDateWhitZeros();
            var id_cliente = localStorage.getItem("empresa");
            var horario_programado = fecha_llegada;
            var estatus = 0;
            var tipo_cedula = localStorage.getItem("Modulos");
            var nombre_evalua = "Campaña";
            localStorage.setItem("IDCampania", IDCampania);
            localStorage.setItem("nombreCampania", nombreCampania);
            localStorage.setItem("FK_formato", FK_formato);

            productHandler.addCedula(
                id_usuario,
                nombre_usuario,
                fecha_llegada,
                IDCampania,
                id_cliente,
                nombre_evalua,
                horario_programado,
                estatus,
                tipo_cedula,
                nombreCampania,
                FK_formato
            );
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "Select MAX(id_cedula) as Id from cedulas_general",
                        [],
                        function (tx, results) {
                            var item = results.rows.item(0);
                            localStorage.setItem("IdCedula", item.Id);
                            app.views.main.router.back("/formEncierro1/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
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
    });
}

function creaRevisiones() {
    let id_cedula = localStorage.getItem("IdCedula");
    let paso = 0;
    let NomJson = "revisones_1";
    let progress = 0;
    let dialog = app.dialog.progress("Generando Lista", progress, "red");
    let empresa = localStorage.getItem("empresa");
    app.request({
        url: cordova.file.dataDirectory + "jsons_InsEncierro/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let length = data.length;
            if (length == 0) {
            } else {
                var aux2 = 0;
                var fecha_captura = getDateWhitZeros();
                dialog.setText("1 de " + data.length);
                for (var j = 0; j < data.length; j++) {
                    aux2++;
                    if (data[j].FK_formato == FK_formato) {
                        if (paso == 0) {
                            // insertHeaderInsEncierro: function(id_cedula, FKCampaña, nombreCampania, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad)
                            productHandler.insertHeaderInsEncierro(
                                id_cedula,
                                IDCampania,
                                nombreCampania,
                                data[j].FK_formato,
                                data[j].NombreFormato,
                                fecha_captura,
                                FKunidad,
                                observaciones,
                                unidad
                            );
                            // insertPreguntasInsEncierro: function(id_cedula,Fk_pregunta,pregunta,multiple,FK_formato,Opcion1,Opcion2,respuesta, aux, aux2)
                            id_cedula = 1;
                            productHandler.insertPreguntasInsEncierro(
                                id_cedula,
                                data[j].ID,
                                data[j].Pregunta,
                                data[j].Multiple,
                                data[j].FK_formato,
                                data[j].Opcion_1,
                                data[j].Opcion_2,
                                0,
                                aux,
                                aux2
                            );
                            paso++;
                        } else {
                            id_cedula = localStorage.getItem("IdCedula");
                            productHandler.insertPreguntasInsEncierro(
                                id_cedula,
                                data[j].ID,
                                data[j].Pregunta,
                                data[j].Multiple,
                                data[j].FK_formato,
                                data[j].Opcion_1,
                                data[j].Opcion_2,
                                0,
                                aux,
                                aux2
                            );
                        }
                    }
                }
            }
        },
    });
}

function preInspeccionEncierro() {
    app.dialog.progress("Trabajando... ", "red");
    setTimeout(() => {
        inspeccionarUnidadEncierro();
        app.dialog.close();
    }, "250");
}

function inspeccionarUnidadEncierro() {
    if ($("#id_unidad").val()) {
        let id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select id_cedula from IEN_Header WHERE id_cedula = ? AND FK_Unidad = ?",
                    [id_cedula, $("#id_unidad").val()],
                    function (tx, results) {
                        let length = results.rows.length;
                        if (length == 0) {
                            let unidad = $("#autocomplete-dropdown-ajax").val();
                            let id_unidad = $("#id_unidad").val();
                            let fecha_captura = getDateWhitZeros();
                            let progress = 0;
                            let dialog = app.dialog.progress("Trabajando... ", progress, "red");
                            let id_empresa = localStorage.getItem("empresa");
                            let IDCampania = localStorage.getItem("IDCampania");
                            let nombreCampania = localStorage.getItem("nombreCampania");
                            let FK_formato = localStorage.getItem("FK_formato");
                            let NombreFormato = "";
                            let observaciones = "";
                            let NomJson = "revisones_1";

                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "insert into IEN_Header(id_cedula, FKCampaña, nombreCampania, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                        [
                                            id_cedula,
                                            IDCampania,
                                            nombreCampania,
                                            FK_formato,
                                            NombreFormato,
                                            fecha_captura,
                                            id_unidad,
                                            observaciones,
                                            unidad,
                                        ],
                                        function (tx, results) {
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "Select MAX(ID_Header) as IdHeader from IEN_Header",
                                                        [],
                                                        function (tx, results) {
                                                            var item = results.rows.item(0);
                                                            localStorage.setItem("IdHeader", item.IdHeader);
                                                            app.request({
                                                                url: cordova.file.dataDirectory + "jsons_InsEncierro/" + NomJson + ".json",
                                                                method: "GET",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    var aux = 0;
                                                                    for (var j = 0; j < data.length; j++) {
                                                                        if (data[j].FK_formato == FK_formato) {
                                                                            aux++;
                                                                        }
                                                                    }
                                                                    var aux2 = 0;
                                                                    if (aux == 0) {
                                                                        app.dialog.close();
                                                                        swal("", "Algo salió mal.", "warning");
                                                                    } else {
                                                                        dialog.setText("1 de " + aux);
                                                                        for (var j = 0; j < data.length; j++) {
                                                                            if (data[j].FK_formato == FK_formato) {
                                                                                aux2++;
                                                                                productHandler.insertPreguntasInsEncierro(
                                                                                    id_cedula,
                                                                                    item.IdHeader,
                                                                                    data[j].ID,
                                                                                    data[j].Pregunta,
                                                                                    data[j].Multiple,
                                                                                    data[j].FK_formato,
                                                                                    data[j].Opcion_1,
                                                                                    data[j].Opcion_2,
                                                                                    data[j].Opcion_3,
                                                                                    data[j].Opcion_4,
                                                                                    data[j].Opcion_5,
                                                                                    data[j].Opcion_6,
                                                                                    0,
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
                            $("#autocomplete-dropdown-ajax").val("");
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

function TerminarInspeccionHMO() {
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT COUNT(id_cedula) as cuenta FROM IEN_Details WHERE id_cedula = ? AND FKHeader = ? AND respuesta is null",
                [localStorage.getItem("IdCedula"), localStorage.getItem("IdHeader")],
                function (tx5, results) {
                    let item = results.rows.item(0);
                    if (item.cuenta > 0) {
                        swal({
                            title: "Aviso",
                            text: "Aún no haz terminado coon la revisión, ¿Estas seguro que deseas dejarla así?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: false,
                        }).then((willGoBack) => {
                            if (willGoBack) {
                                TerminarInspeccionHMOUnidad();
                            }
                        });
                    } else {
                        TerminarInspeccionHMOUnidad();
                    }
                },
                function (tx5, error) {}
            );
        },
        function (error) {},
        function () {}
    );
}

function TerminarInspeccionHMOUnidad() {
    let fechaFin = getDateWhitZeros();
    let observaciones = $("#observaciones").val();
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "UPDATE IEN_Header SET fechaFin = ?, observaciones = ? WHERE id_cedula = ? AND ID_Header = ?",
                [fechaFin, observaciones, localStorage.getItem("IdCedula"), localStorage.getItem("IdHeader")],
                function (tx5, results) {
                    app.views.main.router.back("/formEncierro1/", {
                        force: true,
                        ignoreCache: true,
                        reload: true,
                    });
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

function editarInspeccionEncierro(IdHeader) {
    localStorage.setItem("IdHeader", IdHeader);
    app.views.main.router.navigate({ name: "formEncierro2" });
}

function eliminarInspeccionEncierro(IdHeader) {
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
                        "DELETE FROM IEN_Header WHERE id_cedula = ? AND ID_Header = ?",
                        [id_cedula, IdHeader],
                        function (tx, results) {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM IEN_Details WHERE id_cedula = ? AND FKHeader = ?",
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

function CreaModalOptionInsEncierro(id, opciones, mul, titulo_modal) {
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
    texto = "Selecciona una o varias fallas";
    app.request.get(cordova.file.dataDirectory + "jsons_InsEncierro/" + NomDescCli + ".json", function (data) {
        var content2 = JSON.parse(data);
        for (var x = 0; x < content2.length; x++) {
            html += `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox${content2[x].id_danio}" value="${content2[x].tipo_danio}">${content2[x].tipo_danio}</label><br>`;
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
                        <div>
                            <input type="text" placeholder="¿Buscas una falla en específico?" id="buscadorFallas" class="FWM-input" style="padding-right: 5px;width: 98%;height: 40px;margin: 30px 0px;">
                        </div>
                            <input type="hidden" id="inputEvidencia" value=${id}>
                            <input type="hidden" id="pasa" value="0">
                        <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                            ${html}
                        </div>
                        <div>
                            <span style="color: #005D99;" class="span FWM-span-form">Comentarios</span>
                            <textarea class="FWM-input" style="font-family: 'ITC Avant Garde Gothic', sans-serif;width: 98%;padding-top: 10px;" id="obs_generales" cols="30" rows="10" maxlength="255"></textarea>
                        </div>
                        <div class="block grid-resizable-demo" style="margin-bottom: 70px;padding-top: 35px;">
                            <div class="row align-items-stretch" style="text-align: center;">
                                <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                    <span class="resize-handler"></span>
                                    <a href="#" onclick="agregaComentariosInsEncierro(${id},${mul});" style="background-color: #FF0037;padding-left: 50px;padding-right: 50px;" class="boton-equipo">Guardar</a>
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
                                    document.getElementById(Check).checked = false;
                                    var Checks = "radio" + id + "-0";
                                    document.getElementById(Checks).checked = true;
                                    var labels0 = Checks.replace("radio", "label");
                                    var labels1 = Check.replace("radio", "label");
                                    var labels2 = otherCheck.replace("radio", "label");
                                    $("#" + labels0).addClass("checked");
                                    $("#" + labels1).removeClass("checked");
                                    $("#" + labels2).removeClass("checked");
                                    actualizacheckInsEncierro(Checks);
                                    app.sheet.close("#sheet-modal");
                                }
                            });
                        }
                    });

                    // $("#buscadorFallas").on("keyup paste", function(){
                    //     let query = this.value
                    //     app.request.get(cordova.file.dataDirectory + "jsons_InsEncierro/"+NomDescCli+".json", function (data) {
                    //         var content2 = JSON.parse(data);
                    //         let html = ''
                    //         for(var x = 0; x < content2.length; x++) {
                    //             if(content2[x].tipo_danio.toLowerCase().indexOf(query.toLowerCase()) >= 0){
                    //                 html += `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox${content2[x].id_danio}" value="${content2[x].tipo_danio}">${content2[x].tipo_danio}</label><br>`;
                    //             }
                    //         }
                    //         $("#div_cboxs").html(html)
                    //     });
                    // })
                },
            },
        });
        popEvidencia.open();
    });
}

function SeleccionarDanosInsEncierro(id, pregunta, multiple) {
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
            CreaModalOptionInsEncierro(id, opciones, 1, titulo_modal);
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
            CreaModalOptionInsEncierro(id, opciones, 2, titulo_modal);
        }
    } else {
        var opciones = false;
        var titulo_modal = "";
        CreaModalOptionInsEncierro(id, opciones, 3, titulo_modal);
    }
}

function actualizacheckInsEncierro(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var IdHeader = localStorage.getItem("IdHeader");
    var ids = id.split("-");
    var id_pregunta = ids[1];
    var respuesta = ids[2];
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE IEN_Details SET respuesta = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND FKHeader = ?",
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

function agregaComentariosInsEncierro(id_pregunta, mul) {
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

    if (valido) {
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
                    "UPDATE IEN_Details SET falla = ?, comentarios = ?, FKsFallas = ? WHERE id_cedula = ? AND Fk_pregunta = ? AND FKHeader = ?",
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
        swal("", "Selecciona almenos un daño para poder guardar", "warning");
    }
}

function FinalizarInspeccionesEncierro() {
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT COUNT(id_cedula) as cuenta, FKHeader FROM IEN_Details WHERE id_cedula = ? AND respuesta is null",
                [localStorage.getItem("IdCedula")],
                function (tx5, results) {
                    let item = results.rows.item(0);
                    if (item.cuenta > 0) {
                        let ID_Header = item.FKHeader;
                        databaseHandler.db.transaction(
                            function (tx5) {
                                tx5.executeSql(
                                    "SELECT unidad FROM IEN_Header WHERE id_cedula = ? AND ID_Header = ?",
                                    [localStorage.getItem("IdCedula"), ID_Header],
                                    function (tx5, results) {
                                        let item2 = results.rows.item(0);
                                        swal(
                                            "",
                                            "La unidad: " + item2.unidad + ", no se termino de inspeccionar. Finalizala para poder continuar.",
                                            "warning"
                                        );
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

function generaInsLavadoUnidades(paso) {
    swal({
        title: "Aviso",
        text: "¿Deseas crear una nueva Inspección de Lavado?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_usuario = localStorage.getItem("id_usuario");
            var nombre_usuario = localStorage.getItem("Usuario");
            var fecha_llegada = getDateWhitZeros();
            var id_cliente = localStorage.getItem("empresa");
            var horario_programado = "";
            var estatus = 0;
            var tipo_cedula = localStorage.getItem("Modulos");
            var nombre_evalua = "Lavado de unidades";
            var IDCampania = 1;
            var nombreCampania = "Lavado";
            var FK_formato = "N/A";

            addCedulaind(
                id_usuario,
                nombre_usuario,
                fecha_llegada,
                IDCampania,
                id_cliente,
                nombre_evalua,
                horario_programado,
                estatus,
                tipo_cedula,
                nombreCampania,
                FK_formato,
                paso
            );
        }
    });
}

function addCedulaind(
    id_usuario,
    nombre_usuario,
    fecha_entrada,
    geolocalizacion_entrada,
    id_cliente,
    nombre_cliente,
    horario_programado,
    estatus,
    tipo_cedula,
    nombre_evalua,
    geolocation,
    paso
) {
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "insert into cedulas_general(id_usuario,nombre_usuario,fecha_entrada,geolocalizacion_entrada,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula,nombre_evalua,geolocalizacion_salida) values(?,?,?,?,?,?,?,?,?,?,?)",
                [
                    id_usuario,
                    nombre_usuario,
                    fecha_entrada,
                    geolocalizacion_entrada,
                    id_cliente,
                    nombre_cliente,
                    horario_programado,
                    estatus,
                    tipo_cedula,
                    nombre_evalua,
                    geolocation,
                ],
                function (tx, results) {
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    var item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    if (paso == 1) {
                                        creaFormLavado(item.Id);
                                    } else if (paso == 2) {
                                        creaFormResultLavado(item.Id);
                                    } else if (paso == 3) {
                                        creaFormEvaluacion(item.Id);
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
                },
                function (tx, error) {
                    console.error("Error registrar cedula general:" + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function preInspeccionLavdo2() {
    app.dialog.progress("Trabajando... ", "red");
    setTimeout(() => {
        inspeccionarUnidadLavdo2();
        app.dialog.close();
    }, "250");
}

function inspeccionarUnidadLavdo2() {
    if ($("#id_unidad").val()) {
        let id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select id_cedula from IEN_HeaderLavado WHERE id_cedula = ? AND FK_Unidad = ?",
                    [id_cedula, $("#id_unidad").val()],
                    function (tx, results) {
                        let length = results.rows.length;
                        if (length == 0) {
                            let unidad = $("#autocomplete-dropdown-ajax").val();
                            let id_unidad = $("#id_unidad").val();
                            let fecha_captura = getDateWhitZeros();
                            let progress = 0;
                            let dialog = app.dialog.progress("Trabajando... ", progress, "red");
                            let id_empresa = localStorage.getItem("empresa");
                            let FK_formato = 0;
                            let fechaFin = "";
                            let observaciones = "";
                            let NomJson = "Programacion";

                            // productHandler.insertHeaderInsEncierro(id_cedula, IDCampania, nombreCampania, FK_formato, NombreFormato, fecha_captura, id_unidad, observaciones, unidad)

                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "insert into IEN_HeaderLavado(id_cedula, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad) values(?, ?, ?, ?, ?, ?, ?)",
                                        [id_cedula, FK_formato, fechaFin, fecha_captura, id_unidad, observaciones, unidad],
                                        function (tx, results) {
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "Select MAX(ID_HeaderLavado) as IdHeader from IEN_HeaderLavado",
                                                        [],
                                                        function (tx, results) {
                                                            var item = results.rows.item(0);
                                                            localStorage.setItem("IdHeader", item.IdHeader);
                                                            app.request({
                                                                url: cordova.file.dataDirectory + "jsons_InsLavado/" + NomJson + ".json",
                                                                method: "GET",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    var aux = 3;
                                                                    let encontro = false;
                                                                    dialog.setText("1 de " + aux);
                                                                    for (var j = 0; j < data.length; j++) {
                                                                        if (data[j].FK_unidad == id_unidad) {
                                                                            encontro = true;
                                                                            if (data[j].TypePrograma == "EXHAUSTIVA") {
                                                                                productHandler.insertPreguntasLavado(
                                                                                    id_cedula,
                                                                                    item.IdHeader,
                                                                                    data[j].ID,
                                                                                    "¿Se lavó?",
                                                                                    0,
                                                                                    0,
                                                                                    "SI",
                                                                                    "NO",
                                                                                    "",
                                                                                    "",
                                                                                    "",
                                                                                    "",
                                                                                    data[j].TypePrograma,
                                                                                    1,
                                                                                    data[j].FK_provedor,
                                                                                    1,
                                                                                    3
                                                                                );
                                                                                productHandler.insertPreguntasLavado(
                                                                                    id_cedula,
                                                                                    item.IdHeader,
                                                                                    data[j].ID,
                                                                                    "¿La calificación del lavado es:?",
                                                                                    0,
                                                                                    0,
                                                                                    "BUENO",
                                                                                    "REGULAR",
                                                                                    "MALO",
                                                                                    "",
                                                                                    "",
                                                                                    "",
                                                                                    data[j].TypePrograma,
                                                                                    1,
                                                                                    data[j].FK_provedor,
                                                                                    2,
                                                                                    3
                                                                                );
                                                                                productHandler.insertPreguntasLavado(
                                                                                    id_cedula,
                                                                                    item.IdHeader,
                                                                                    data[j].ID,
                                                                                    "¿Hubo cambio de proveedor?",
                                                                                    0,
                                                                                    0,
                                                                                    "SI",
                                                                                    "NO",
                                                                                    "",
                                                                                    "",
                                                                                    "",
                                                                                    "",
                                                                                    data[j].TypePrograma,
                                                                                    2,
                                                                                    data[j].FK_provedor,
                                                                                    3,
                                                                                    3
                                                                                );
                                                                            } else {
                                                                                if (data[j].TypePrograma == "INTERIOR") {
                                                                                    productHandler.insertPreguntasLavado(
                                                                                        id_cedula,
                                                                                        item.IdHeader,
                                                                                        data[j].ID,
                                                                                        "¿Se lavó?",
                                                                                        0,
                                                                                        0,
                                                                                        "SI",
                                                                                        "NO",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        data[j].TypePrograma,
                                                                                        1,
                                                                                        data[j].FK_provedor,
                                                                                        1,
                                                                                        3
                                                                                    );
                                                                                    productHandler.insertPreguntasLavado(
                                                                                        id_cedula,
                                                                                        item.IdHeader,
                                                                                        data[j].ID,
                                                                                        "¿La calificación del lavado es:?",
                                                                                        0,
                                                                                        0,
                                                                                        "BUENO",
                                                                                        "REGULAR",
                                                                                        "MALO",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        data[j].TypePrograma,
                                                                                        1,
                                                                                        data[j].FK_provedor,
                                                                                        2,
                                                                                        3
                                                                                    );
                                                                                    productHandler.insertPreguntasLavado(
                                                                                        id_cedula,
                                                                                        item.IdHeader,
                                                                                        data[j].ID,
                                                                                        "¿Hubo cambio de proveedor?",
                                                                                        0,
                                                                                        0,
                                                                                        "SI",
                                                                                        "NO",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        data[j].TypePrograma,
                                                                                        2,
                                                                                        data[j].FK_provedor,
                                                                                        3,
                                                                                        3
                                                                                    );
                                                                                } else if (data[j].TypePrograma == "EXTERIOR") {
                                                                                    productHandler.insertPreguntasLavado(
                                                                                        id_cedula,
                                                                                        item.IdHeader,
                                                                                        data[j].ID,
                                                                                        "¿Se lavó?",
                                                                                        0,
                                                                                        0,
                                                                                        "SI",
                                                                                        "NO",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        data[j].TypePrograma,
                                                                                        1,
                                                                                        data[j].FK_provedor,
                                                                                        1,
                                                                                        3
                                                                                    );
                                                                                    productHandler.insertPreguntasLavado(
                                                                                        id_cedula,
                                                                                        item.IdHeader,
                                                                                        data[j].ID,
                                                                                        "¿La calificación del lavado es:?",
                                                                                        0,
                                                                                        0,
                                                                                        "BUENO",
                                                                                        "REGULAR",
                                                                                        "MALO",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        data[j].TypePrograma,
                                                                                        1,
                                                                                        data[j].FK_provedor,
                                                                                        2,
                                                                                        3
                                                                                    );
                                                                                    productHandler.insertPreguntasLavado(
                                                                                        id_cedula,
                                                                                        item.IdHeader,
                                                                                        data[j].ID,
                                                                                        "¿Hubo cambio de proveedor?",
                                                                                        0,
                                                                                        0,
                                                                                        "SI",
                                                                                        "NO",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        "",
                                                                                        data[j].TypePrograma,
                                                                                        2,
                                                                                        data[j].FK_provedor,
                                                                                        3,
                                                                                        3
                                                                                    );
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    if (!encontro) {
                                                                        let IdHeader = item.IdHeader;
                                                                        app.dialog.close();
                                                                        swal({
                                                                            title: "Aviso",
                                                                            text: "Esta unidad no tiene programación asignada. ¿Quieres agregar la con el lavado Interior?",
                                                                            icon: "warning",
                                                                            buttons: true,
                                                                            dangerMode: false,
                                                                        }).then((willGoBack) => {
                                                                            if (willGoBack) {
                                                                                var NomJson = "Proveedores";
                                                                                var html = "";
                                                                                app.request({
                                                                                    url:
                                                                                        cordova.file.dataDirectory +
                                                                                        "jsons_InsLavado/" +
                                                                                        NomJson +
                                                                                        ".json",
                                                                                    method: "GET",
                                                                                    dataType: "json",
                                                                                    success: function (data) {
                                                                                        for (var j = 0; j < data.length; j++) {
                                                                                            html += `<option value="${data[j].ID}">${data[j].NombreProveedor}</option>`;
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
                                                                                                    <h3 class="FWN-titulo-2">Selecciona un proveedor</h3><hr>
                                                                                                    
                                                                                                    <input type="hidden" id="pasa" value="0">
                                                                                                    <input type="hidden" id="id_unidad" value="0">
                                                                                                    
                                                                                                    <select class="FWM-input" style="padding-right: 5px;height: 40px;width: 100%;" id="proveedoresModal2">
                                                                                                        ${html}
                                                                                                    </select>
                                                                                                    
                                                                                                    <div class="block grid-resizable-demo" style="margin-bottom: 70px;margin-top: 62px;">
                                                                                                        <div class="row align-items-stretch" style="text-align: center;">
                                                                                                            <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                                                                                                <span class="resize-handler"></span>
                                                                                                                <a href="#" id="continuarSinPrograma" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
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
                                                                                                                text: "Aún no agregas un proveedor, ¿Quieres cancelar el registro de la unidad?",
                                                                                                                icon: "warning",
                                                                                                                buttons: true,
                                                                                                                dangerMode: false,
                                                                                                            }).then((willGoBack) => {
                                                                                                                if (willGoBack) {
                                                                                                                    deleteRegistroProgrmacionLavado(
                                                                                                                        IdHeader
                                                                                                                    );
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                    $("#continuarSinPrograma").click(function () {
                                                                                                        let dialog = app.dialog.progress(
                                                                                                            "Trabajando... ",
                                                                                                            progress,
                                                                                                            "red"
                                                                                                        );
                                                                                                        let aux = 3;
                                                                                                        let FK_provedor =
                                                                                                            $("#proveedoresModal2").val();
                                                                                                        dialog.setText("1 de " + aux);
                                                                                                        productHandler.insertPreguntasLavado(
                                                                                                            id_cedula,
                                                                                                            IdHeader,
                                                                                                            0,
                                                                                                            "¿Se lavó?",
                                                                                                            0,
                                                                                                            0,
                                                                                                            "SI",
                                                                                                            "NO",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "INTERIOR",
                                                                                                            1,
                                                                                                            FK_provedor,
                                                                                                            1,
                                                                                                            3
                                                                                                        );
                                                                                                        productHandler.insertPreguntasLavado(
                                                                                                            id_cedula,
                                                                                                            IdHeader,
                                                                                                            0,
                                                                                                            "¿La calificación del lavado es:?",
                                                                                                            0,
                                                                                                            0,
                                                                                                            "BUENO",
                                                                                                            "REGULAR",
                                                                                                            "MALO",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "INTERIOR",
                                                                                                            1,
                                                                                                            FK_provedor,
                                                                                                            2,
                                                                                                            3
                                                                                                        );
                                                                                                        productHandler.insertPreguntasLavado(
                                                                                                            id_cedula,
                                                                                                            IdHeader,
                                                                                                            0,
                                                                                                            "¿Hubo cambio de proveedor?",
                                                                                                            0,
                                                                                                            0,
                                                                                                            "SI",
                                                                                                            "NO",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "",
                                                                                                            "INTERIOR",
                                                                                                            2,
                                                                                                            FK_provedor,
                                                                                                            3,
                                                                                                            3
                                                                                                        );
                                                                                                        app.sheet.close("#sheet-modal");
                                                                                                    });
                                                                                                },
                                                                                            },
                                                                                        });
                                                                                        popEvidencia.open();
                                                                                    },
                                                                                });
                                                                            } else {
                                                                                deleteRegistroProgrmacionLavado(IdHeader);
                                                                            }
                                                                        });
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
                            $("#autocomplete-dropdown-ajax").val("");
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

function creaFormLavado(id_cedula) {
    app.views.main.router.navigate({ name: "formLavado6" });
    // let NomJson = 'Programacion'
    // let progress = 0;
    // let dialog = app.dialog.progress('Trabajando... ', progress, 'red');
    // app.request({
    //     url: cordova.file.dataDirectory + "jsons_InsLavado/"+NomJson+".json",
    //     method: 'GET',
    //     dataType: 'json',
    //     success: function (data) {
    //         var aux = 0;
    //         // for (var j = 0; j < data.length; j++) {
    //         //     if(data[j].FK_formato == FK_formato){
    //         //         aux++;
    //         //     }
    //         // }
    //         aux = data.length;
    //         var aux2=0;
    //         if(aux == 0){
    //             app.dialog.close()
    //             swal("","Algo salió mal.","warning");
    //         }else{
    //             dialog.setText('1 de ' + aux);
    //             for (var j = 0; j < data.length; j++) {
    //                 aux2++;
    //                 productHandler.insertUnidadesLavodo(id_cedula, data[j].ID, data[j].FK_unidad, data[j].Unidad, data[j].FK_provedor, data[j].FK_header, 0, aux, aux2)
    //             }
    //         }
    //     }
    // });
}

function agregaEvidencias(id) {
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
                    <h3 class="FWN-titulo-2">Agregar evidencias</h3><hr>
                    
                    <input type="hidden" id="inputEvidencia" value=${id}>
                    <input type="hidden" id="pasa" value="0">
                    <div id="evidencias_div" style="padding-left: 10px;padding-right: 10px;display: none;">
                        <div class="FWM-photo-container">
                            <div class="border-capture" style="text-align: center;">
                                <img class="FWM-photo" src="" id="photoIcon" width="45px"/>
                            </div>
                            <img class="FWM-photo-hide" id="smallImage" src=""/>
                            <input type="hidden" id="imagenC" name="imagenC"/>
                        </div>
                    </div>
                
                    <div class="row" style="text-align: center; margin: 65px 10px 65px 10px;justify-content: space-around;" id="div_botones_camara">
                        <div style="min-width: 50px; border-style: none;">
                            <span class="resize-handler"></span>
                            <a href="#" onclick="ValidarCapturePhoto()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                            </a>
                        </div>
                    </div>

                    <h2 style="text-align: center;">Evidencias</h2>

                    <div class="card data-table" style="margin-bottom: 50px;">
                        <div class="infinite-scroll-content">
                            <table id="facturas">
                                <thead>
                                    <tr>
                                        <th class="numeric-cell" style="text-align: center;background-color: #063E7F;color: white;">Evidencia</th>
                                        <th class="numeric-cell" style="text-align: center;background-color: #063E7F;color: white;">Borrar</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="sentencia preloader color-grey infinite-scroll-preloader"></div>
                            <div id="message-nr" class="message-nr" style="width: 100%;text-align: center;font-family: 'ITC Avant Garde Gothic', sans-serif;font-size: 16px;" style="display: none;">
                                <p>Sin registros</p>
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
                    // if($('#pasa').val()!=0){
                    //     app.sheet.close('#sheet-modal');
                    // }else{
                    //     swal({
                    //         title: "Aviso",
                    //         text: "Aún no agregar evidencias, ¿Estas seguro que deseas regresar?",
                    //         icon: "warning",
                    //         buttons: true,
                    //         dangerMode: false,
                    //     }).then((willGoBack) => {
                    //         if (willGoBack){
                    app.sheet.close("#sheet-modal");
                    //         }
                    //     });
                    // }
                });
            },
        },
    });
    popEvidencia.open();
}

function resultadoLimpieza(paso) {
    swal({
        title: "Aviso",
        text: "¿Deseas crear una nueva Inspección de Resultado Lavado?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_usuario = localStorage.getItem("id_usuario");
            var nombre_usuario = localStorage.getItem("Usuario");
            var fecha_llegada = getDateWhitZeros();
            var id_cliente = localStorage.getItem("empresa");
            var horario_programado = "";
            var estatus = 0;
            var tipo_cedula = localStorage.getItem("Modulos");
            var nombre_evalua = "Resultado limpieza";
            var IDCampania = 2;
            var nombreCampania = "Lavado";
            var FK_formato = "n/A";

            addCedulaind(
                id_usuario,
                nombre_usuario,
                fecha_llegada,
                IDCampania,
                id_cliente,
                nombre_evalua,
                horario_programado,
                estatus,
                tipo_cedula,
                nombreCampania,
                FK_formato,
                paso
            );
        }
    });
}

function creaFormResultLavado(id_cedula) {
    app.views.main.router.navigate({ name: "formLavado2" });
}

function regresaLavado() {
    app.views.main.router.navigate({ name: "formLavado2" });
}

function editarLavado(IdHeader, paso) {
    if (paso == 1) {
        localStorage.setItem("IdHeader", IdHeader);
        app.views.main.router.navigate({ name: "formLavado1" });
    } else if (paso == 2) {
        localStorage.setItem("IdHeader", IdHeader);
        app.views.main.router.navigate({ name: "formLavado3" });
    } else if (paso == 3) {
        localStorage.setItem("IdHeader", IdHeader);
        app.views.main.router.navigate({ name: "formLavado5" });
    }
}

function eliminarLavado(IdHeader, paso) {
    let id_cedula = localStorage.getItem("IdCedula");
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer eliminar el registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            if (paso == 1) {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_ProgramacionLavado WHERE id_cedula = ? AND FK_header = ?",
                            [id_cedula, IdHeader],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM IEN_HeaderLavado WHERE id_cedula = ? AND ID_HeaderLavado = ?",
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
            } else if (paso == 2) {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_ResultadoLavado WHERE id_cedula = ? AND FK_header = ?",
                            [id_cedula, IdHeader],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM IEN_HeaderResultadoLavado WHERE id_cedula = ? AND ID_HeaderLavado = ?",
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
            } else if (paso == 3) {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_ResultadoLavado WHERE id_cedula = ? AND FK_header = ?",
                            [id_cedula, IdHeader],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM IEN_HeaderResultadoLavado WHERE id_cedula = ? AND ID_HeaderLavado = ?",
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
        }
    });
}

function preInspeccionLavdo() {
    app.dialog.progress("Trabajando... ", "red");
    setTimeout(() => {
        inspeccionarUnidadLavdo();
        app.dialog.close();
    }, "250");
}

function inspeccionarUnidadLavdo() {
    // app.dialog.close();
    // app.views.main.router.navigate({ name: 'formLavado3' });
    if ($("#id_unidad").val()) {
        let id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select id_cedula from IEN_HeaderResultadoLavado WHERE id_cedula = ? AND FK_Unidad = ?",
                    [id_cedula, $("#id_unidad").val()],
                    function (tx, results) {
                        let length = results.rows.length;
                        if (length == 0) {
                            let unidad = $("#autocomplete-dropdown-ajax").val();
                            let id_unidad = $("#id_unidad").val();
                            let fecha_captura = getDateWhitZeros();
                            let progress = 0;
                            let dialog = app.dialog.progress("Trabajando... ", progress, "red");
                            let id_empresa = localStorage.getItem("empresa");
                            let FK_formato = 0;
                            let fechaFin = "";
                            let observaciones = "";
                            let NomJson = "revisones_1";

                            // productHandler.insertHeaderInsEncierro(id_cedula, IDCampania, nombreCampania, FK_formato, NombreFormato, fecha_captura, id_unidad, observaciones, unidad)

                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "insert into IEN_HeaderResultadoLavado(id_cedula, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad) values(?, ?, ?, ?, ?, ?, ?)",
                                        [id_cedula, FK_formato, fechaFin, fecha_captura, id_unidad, observaciones, unidad],
                                        function (tx, results) {
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "Select MAX(ID_HeaderLavado) as IdHeader from IEN_HeaderResultadoLavado",
                                                        [],
                                                        function (tx, results) {
                                                            var item = results.rows.item(0);
                                                            localStorage.setItem("IdHeader", item.IdHeader);
                                                            app.request({
                                                                url: cordova.file.dataDirectory + "jsons_InsLavado/" + NomJson + ".json",
                                                                method: "GET",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    var aux = 0;
                                                                    var aux2 = 0;
                                                                    for (var j = 0; j < data.length; j++) {
                                                                        if (data[j].formatoAplicable == 1) {
                                                                            aux++;
                                                                        }
                                                                    }
                                                                    if (aux == 0) {
                                                                        app.dialog.close();
                                                                        swal(
                                                                            "",
                                                                            "Algo salió mal. Al parecer no hay un formato para esta evaluación.",
                                                                            "warning"
                                                                        );
                                                                    } else {
                                                                        dialog.setText("1 de " + aux);
                                                                        for (var j = 0; j < data.length; j++) {
                                                                            if (data[j].formatoAplicable == 1) {
                                                                                aux2++;
                                                                                productHandler.insertPreguntasResultadoLavado(
                                                                                    id_cedula,
                                                                                    item.IdHeader,
                                                                                    data[j].ID,
                                                                                    data[j].Pregunta,
                                                                                    0,
                                                                                    data[j].FK_formato,
                                                                                    data[j].Opcion_1,
                                                                                    data[j].Opcion_2,
                                                                                    data[j].Opcion_3,
                                                                                    data[j].Opcion_4,
                                                                                    data[j].Opcion_5,
                                                                                    data[j].Opcion_6,
                                                                                    1,
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
                            $("#autocomplete-dropdown-ajax").val("");
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

function evaluacionProveedor(paso) {
    swal({
        title: "Aviso",
        text: "¿Deseas crear una nueva Inspección de Evaluación a Proveedor?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_usuario = localStorage.getItem("id_usuario");
            var nombre_usuario = localStorage.getItem("Usuario");
            var fecha_llegada = getDateWhitZeros();
            var id_cliente = localStorage.getItem("empresa");
            var horario_programado = "";
            var estatus = 0;
            var tipo_cedula = localStorage.getItem("Modulos");
            var nombre_evalua = "Evaluación proveedores";
            var IDCampania = 3;
            var nombreCampania = "Lavado";
            var FK_formato = "n/A";

            addCedulaind(
                id_usuario,
                nombre_usuario,
                fecha_llegada,
                IDCampania,
                id_cliente,
                nombre_evalua,
                horario_programado,
                estatus,
                tipo_cedula,
                nombreCampania,
                FK_formato,
                paso
            );
        }
    });
}

function creaFormEvaluacion(id_cedula) {
    app.views.main.router.navigate({ name: "formLavado4" });
}

function preEvualuacionLavdo() {
    app.dialog.progress("Trabajando... ", "red");
    setTimeout(() => {
        EvualuacionLavdo();
        app.dialog.close();
    }, "250");
}

function EvualuacionLavdo() {
    // app.dialog.close();
    // app.views.main.router.navigate({ name: 'formLavado5' })
    if ($("#id_unidad").val()) {
        let id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Select id_cedula from IEN_HeaderResultadoLavado WHERE id_cedula = ? AND FK_Unidad = ?",
                    [id_cedula, $("#id_unidad").val()],
                    function (tx, results) {
                        let length = results.rows.length;
                        if (length == 0) {
                            let unidad = $("#autocomplete-dropdown-ajax").val();
                            let id_unidad = $("#id_unidad").val();
                            let fecha_captura = getDateWhitZeros();
                            let progress = 0;
                            let dialog = app.dialog.progress("Trabajando... ", progress, "red");
                            let id_empresa = localStorage.getItem("empresa");
                            let FK_formato = 0;
                            let fechaFin = "";
                            let observaciones = "";
                            let NomJson = "revisones_1";

                            // productHandler.insertHeaderInsEncierro(id_cedula, IDCampania, nombreCampania, FK_formato, NombreFormato, fecha_captura, id_unidad, observaciones, unidad)

                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "insert into IEN_HeaderResultadoLavado(id_cedula, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad) values(?, ?, ?, ?, ?, ?, ?)",
                                        [id_cedula, FK_formato, fechaFin, fecha_captura, id_unidad, observaciones, unidad],
                                        function (tx, results) {
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "Select MAX(ID_HeaderLavado) as IdHeader from IEN_HeaderResultadoLavado",
                                                        [],
                                                        function (tx, results) {
                                                            var item = results.rows.item(0);
                                                            localStorage.setItem("IdHeader", item.IdHeader);
                                                            app.request({
                                                                url: cordova.file.dataDirectory + "jsons_InsLavado/" + NomJson + ".json",
                                                                method: "GET",
                                                                dataType: "json",
                                                                success: function (data) {
                                                                    var aux = 0;
                                                                    var aux2 = 0;
                                                                    for (var j = 0; j < data.length; j++) {
                                                                        if (data[j].formatoAplicable == 2) {
                                                                            aux++;
                                                                        }
                                                                    }
                                                                    if (aux == 0) {
                                                                        app.dialog.close();
                                                                        swal(
                                                                            "",
                                                                            "Algo salió mal. Al parecer no hay un formato para esta evaluación.",
                                                                            "warning"
                                                                        );
                                                                    } else {
                                                                        dialog.setText("1 de " + aux);
                                                                        for (var j = 0; j < data.length; j++) {
                                                                            if (data[j].formatoAplicable == 2) {
                                                                                aux2++;
                                                                                productHandler.insertPreguntasResultadoLavado2(
                                                                                    id_cedula,
                                                                                    item.IdHeader,
                                                                                    data[j].ID,
                                                                                    data[j].Pregunta,
                                                                                    0,
                                                                                    data[j].FK_formato,
                                                                                    data[j].Opcion_1,
                                                                                    data[j].Opcion_2,
                                                                                    data[j].Opcion_3,
                                                                                    data[j].Opcion_4,
                                                                                    data[j].Opcion_5,
                                                                                    data[j].Opcion_6,
                                                                                    1,
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
                            $("#autocomplete-dropdown-ajax").val("");
                            $("#id_unidad").val("");
                            $("#id_operador").val("");
                            $("#credencial").val("");
                            $("#operador").val("");
                            swal("", "Este proveedor ya lo tienes registrado.", "warning");
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

function regresaLavadoproveodor() {
    app.views.main.router.navigate({ name: "formLavado4" });
}

function TerminarInspeccionLavado() {
    app.views.main.router.navigate({ name: "formLavado6" });
}

function actualizaRespuestasLavado(id, multiple) {
    var id_cedula = localStorage.getItem("IdCedula");
    var IdHeader = localStorage.getItem("IdHeader");
    var ids = id.split("-");
    var id_pregunta = multiple;
    var respuesta = ids[2];
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE IEN_ProgramacionLavado SET respuesta = ? WHERE id_cedula = ? AND ID_Detail = ? AND FK_header = ?",
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
    // if(respuesta == 3){
    //     agregaEvidenciasLavado(id)
    // }
}

function actualizaObsLavado() {
    let observaciones = $("#observaciones").val();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE IEN_HeaderLavado SET observaciones = ? WHERE id_cedula = ? AND ID_HeaderLavado = ?",
                [observaciones, localStorage.getItem("IdCedula"), localStorage.getItem("IdHeader")],
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

function ValidarCapturePhotoLavado() {
    let typeLavado = $("#typeLavado").val();
    databaseHandler.db.transaction(
        function (tx1) {
            tx1.executeSql(
                "Select COUNT(id_cedula) as cuenta from IEN_EvidenciasLavado where id_cedula= ? AND FKHeader = ? AND typeLavado = ? AND proceso = 1",
                [localStorage.getItem("IdCedula"), localStorage.getItem("IdHeader"), typeLavado],
                function (tx, results) {
                    var item = results.rows.item(0);
                    if (item.cuenta <= 2) {
                        capturePhotoLavado();
                    } else {
                        swal("", "Solo puedes agregar máx. 3 fotos", "warning");
                    }
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function capturePhotoLavado() {
    var camera = localStorage.getItem("camera");
    if (camera == 0) {
        var camera = app.popup.create({
            content: `
                <div class="popup" id="camera" style="display: block;width: 100%;height: 100%;margin-top: 0px;margin-left: 0px;top: 0;left: 0;z-index: 12501;">
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
                                <div class="select" id="select" style="display: none;left: -2%;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                            </div>
                            <div class="right-action">
                                <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                            </div>
                        </div>
                        
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()" style="display: none;"><img id="flash" src="img/flash_off.svg" width="30px" style="display:none;"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        
                        // <audio id="audio" controls style="display: none;">
                        //     <source type="audio/mp3" src="img/camera.mp3">
                        // </audio>
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
                                cameraStart(onPhotoDataSuccess);
                            }
                            function cargarEmpresa(url, callback) {
                                var pie = document.getElementsByTagName("fwm")[0];
                                var script = document.createElement("script");
                                script.type = "text/javascript";
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        } else {
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close(".popup");
                                swal("Se Requiere los permisos", "Para poder tomar las evidencias fotograficas necesitamos el permiso.", "warning");
                            }
                            function success(status) {
                                if (!status.hasPermission) {
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada() {
                                        cameraStart(onPhotoDataSuccess);
                                    }
                                    function cargarEmpresa(url, callback) {
                                        var pie = document.getElementsByTagName("fwm")[0];
                                        var script = document.createElement("script");
                                        script.type = "text/javascript";
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
            },
        });
        camera.open();
    } else {
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
            quality: 100,
            destinationType: destinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            correctOrientation: true,
        });
    }
}

function eliminarFilaFotoLavado(index, val) {
    if (val == 1) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "DELETE FROM IEN_EvidenciasLavado WHERE id_evidencia = ?",
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

function agregaEvidenciasLavado(id, typeLavado) {
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
                    <h3 class="FWN-titulo-2">Agregar evidencias</h3><hr>
                    
                    <input type="hidden" id="inputEvidencia" value=${id}>
                    <input type="hidden" id="typeLavado" value=${typeLavado}>
                    <input type="hidden" id="pasa" value="0">
                    <div id="evidencias_div" style="padding-left: 10px;padding-right: 10px;display: none;">
                        <div class="FWM-photo-container">
                            <div class="border-capture" style="text-align: center;">
                                <img class="FWM-photo" src="" id="photoIcon" width="45px"/>
                            </div>
                            <img class="FWM-photo-hide" id="smallImage" src=""/>
                            <input type="hidden" id="imagenC" name="imagenC"/>
                        </div>
                    </div>
                
                    <div class="row" style="text-align: center; margin: 65px 10px 65px 10px;justify-content: space-around;display: grid;grid-template-columns: auto auto;justify-content: center;" id="div_botones_camara">
                        <div style="min-width: 50px; border-style: none;">
                            <span class="resize-handler"></span>
                            <a href="#" onclick="ValidarCapturePhotoLavado()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                            </a>
                        </div>
                    </div>

                    <h2 style="text-align: center;">Evidencias</h2>

                    <div class="card data-table" style="margin-bottom: 50px;">
                        <div class="infinite-scroll-content">
                            <table id="facturas">
                                <thead>
                                    <tr>
                                        <th class="numeric-cell" style="text-align: center;background-color: #063E7F;color: white;">Evidencia</th>
                                        <th class="numeric-cell" style="text-align: center;background-color: #063E7F;color: white;">Borrar</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="sentencia preloader color-grey infinite-scroll-preloader"></div>
                            <div id="message-nr" class="message-nr" style="width: 100%;text-align: center;font-family: 'ITC Avant Garde Gothic', sans-serif;font-size: 16px;" style="display: none;">
                                <p>Sin registros</p>
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
                    // if($('#pasa').val()!=0){
                    //     app.sheet.close('#sheet-modal');
                    // }else{
                    //     swal({
                    //         title: "Aviso",
                    //         text: "Aún no agregar evidencias, ¿Estas seguro que deseas regresar?",
                    //         icon: "warning",
                    //         buttons: true,
                    //         dangerMode: false,
                    //     }).then((willGoBack) => {
                    //         if (willGoBack){
                    app.sheet.close("#sheet-modal");
                    //         }
                    //     });
                    // }
                });
            },
        },
    });
    popEvidencia.open();
}

function FinalizarInspeccionesLavado() {
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer pasar la pantalla de firmas?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            localStorage.setItem("PantallaLavado", 1);
            app.views.main.router.navigate({ name: "formLavado7" });
        }
    });
}

function FinLavado() {
    let supervisorLavado = $("#supervisorLavado").val();
    let signate = $("#signate").val();
    let signate_2 = $("#signate_2").val();
    if (!String(supervisorLavado).trim()) {
        swal("", "Debes imgresar el nombre del supervisor de proveedor de lavado.", "warning");
        return false;
    }
    if (!signate) {
        swal("", "Debes firmar como supervisor interno.", "warning");
        return false;
    }
    if (!signate_2) {
        swal("", "Se debe agregar la firma del supervisor de proveedor de lavado.", "warning");
        return false;
    }
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar la inspección?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "SELECT id_cedula FROM IEN_EvidenciasLavado WHERE id_cedula = ? AND proceso = 2",
                        [localStorage.getItem("IdCedula")],
                        function (tx, results) {
                            let length = results.rows.length;
                            if (length > 0) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "UPDATE IEN_EvidenciasLavado SET evidencia = ?, fecha = ? WHERE id_cedula = ?",
                                            [signate, getDateWhitZeros(), localStorage.getItem("IdCedula")],
                                            function (tx, results) {
                                                console.log("update 2");
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
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "INSERT INTO IEN_EvidenciasLavado(id_cedula,FKHeader,evidencia,fecha,typeLavado,proceso) VALUES (?,?,?,?,?,2)",
                                            [localStorage.getItem("IdCedula"), 0, signate, getDateWhitZeros(), "N/A"],
                                            function (tx, results) {
                                                console.log("insert 2");
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
                        },
                        function (tx, error) {
                            console.error("Error al guardar cierre: " + error.message);
                        }
                    );
                },
                function (error) {},
                function () {}
            );

            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "SELECT id_cedula FROM IEN_EvidenciasLavado WHERE id_cedula = ? AND proceso = 3",
                        [localStorage.getItem("IdCedula")],
                        function (tx, results) {
                            let length = results.rows.length;
                            if (length > 0) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "UPDATE IEN_EvidenciasLavado SET evidencia = ?, fecha = ? WHERE id_cedula = ?",
                                            [signate, getDateWhitZeros(), localStorage.getItem("IdCedula")],
                                            function (tx, results) {
                                                console.log("update 3");
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
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "INSERT INTO IEN_EvidenciasLavado(id_cedula,FKHeader,evidencia,fecha,typeLavado,proceso) VALUES (?,?,?,?,?,3)",
                                            [localStorage.getItem("IdCedula"), 0, signate, getDateWhitZeros(), "N/A"],
                                            function (tx, results) {
                                                console.log("insert 3");
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
                        },
                        function (tx, error) {
                            console.error("Error al guardar cierre: " + error.message);
                        }
                    );
                },
                function (error) {},
                function () {}
            );

            var fecha_salida = getDateWhitZeros();
            var id_cedula = localStorage.getItem("IdCedula");
            var estatus = 1;
            var tipoLavado = localStorage.getItem("PantallaLavado");
            var table = "";
            if (tipoLavado == 1) {
                table = "IEN_HeaderLavado";
            } else if (tipoLavado == 2) {
                table = "IEN_HeaderResultadoLavado";
            } else if (tipoLavado == 3) {
                table = "IEN_HeaderResultadoLavado";
            }

            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "UPDATE " + table + " SET fechaFin = ? WHERE id_cedula = ?",
                        [fecha_salida, id_cedula],
                        function (tx, results) {
                            let nameSupervisorExt = $("#supervisorLavado").val();
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE cedulas_general SET fecha_salida  = ?,estatus = ?, horario_programado = ? WHERE id_cedula = ?",
                                        [fecha_salida, estatus, nameSupervisorExt, id_cedula],
                                        function (tx, results) {
                                            console.log("gg");
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
}

function continuarCedInsLavado(id_cedula, tipo) {
    localStorage.setItem("IdCedula", id_cedula);

    if (tipo == 1) {
        app.views.main.router.navigate({ name: "formLavado6" });
    } else if (tipo == 2) {
        app.views.main.router.navigate({ name: "formLavado2" });
    } else if (tipo == 3) {
        app.views.main.router.navigate({ name: "formLavado4" });
    }
}

function cambioProveedor(id) {
    var NomJson = "Proveedores";
    var html = "";
    app.request({
        url: cordova.file.dataDirectory + "jsons_InsLavado/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            for (var j = 0; j < data.length; j++) {
                html += `<option value="${data[j].ID}">${data[j].NombreProveedor}</option>`;
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
                            <h3 class="FWN-titulo-2">Selecciona al nuevo proveedor</h3><hr>
                            
                            <input type="hidden" id="pasa" value="0">
                            <input type="hidden" id="id_unidad" value="0">
                            
                            <select class="FWM-input" style="padding-right: 5px;height: 40px;width: 100%;" id="proveedoresModal">
                                ${html}
                            </select>
                            
                            <div class="block grid-resizable-demo" style="margin-bottom: 70px;margin-top: 62px;">
                                <div class="row align-items-stretch" style="text-align: center;">
                                    <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                        <span class="resize-handler"></span>
                                        <a href="#" onclick="guardanuevoProveedor('${id}');" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
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
                            // if($('#pasa').val()!=0){
                            //     app.sheet.close('#sheet-modal');
                            // }else{
                            //     swal({
                            //         title: "Aviso",
                            //         text: "Aún no agregar evidencias, ¿Estas seguro que deseas regresar?",
                            //         icon: "warning",
                            //         buttons: true,
                            //         dangerMode: false,
                            //     }).then((willGoBack) => {
                            //         if (willGoBack){
                            app.sheet.close("#sheet-modal");
                            //         }
                            //     });
                            // }
                        });
                    },
                },
            });
            popEvidencia.open();
        },
    });
}

function guardanuevoProveedor(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    var IdHeader = localStorage.getItem("IdHeader");
    let proveedoresModal = $("#proveedoresModal").val();
    var ids = id.split("-");
    var id_pregunta = ids[1];

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select programa from IEN_ProgramacionLavado WHERE id_cedula = ? AND FK_header = ? AND ID_Detail = ?",
                [id_cedula, IdHeader, id_pregunta],
                function (tx, results) {
                    let item = results.rows.item(0);
                    let programa = item.programa;
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "UPDATE IEN_ProgramacionLavado SET proveedor = ? WHERE id_cedula = ? AND FK_header = ? AND programa = ?",
                                [proveedoresModal, id_cedula, IdHeader, programa],
                                function (tx, results) {
                                    swal("", "Actualizado correctamente.", "success");
                                    app.sheet.close("#sheet-modal");
                                },
                                function (tx, error) {
                                    console.error("Error al guardar cierre: " + error.message);
                                }
                            );
                        },
                        function (error) {},
                        function () {}
                    );
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

function deleteRegistroProgrmacionLavado(IdHeader) {
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "DELETE FROM IEN_HeaderLavado WHERE ID_HeaderLavado = ?",
                [IdHeader],
                function (tx, results) {
                    $("#autocomplete-dropdown-ajax").val("");
                    $("#id_unidad").val("");
                    swal("", "Cancelado correctamente.", "success");
                    app.sheet.close("#sheet-modal");
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

function actualizaObsResultado() {
    let observaciones = $("#observaciones").val();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE IEN_HeaderResultadoLavado SET observaciones = ? WHERE id_cedula = ? AND ID_HeaderLavado = ?",
                [observaciones, localStorage.getItem("IdCedula"), localStorage.getItem("IdHeader")],
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

function actualizaRespuestasLavadoRes(id, multiple) {
    var id_cedula = localStorage.getItem("IdCedula");
    var IdHeader = localStorage.getItem("IdHeader");
    var ids = id.split("-");
    var id_pregunta = multiple;
    var respuesta = ids[2];
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE IEN_ResultadoLavado SET respuesta = ? WHERE id_cedula = ? AND ID_Detail = ? AND FK_header = ?",
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

function FinalizarResultadoLavado() {
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT COUNT(id_cedula) as cuenta FROM IEN_HeaderResultadoLavado WHERE id_cedula = ?",
                [localStorage.getItem("IdCedula")],
                function (tx5, results) {
                    let item = results.rows.item(0);
                    if (item.cuenta > 4) {
                        swal({
                            title: "Aviso",
                            text: "¿Estas seguro de querer pasar la pantalla de firmas?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((RESP) => {
                            if (RESP == true) {
                                localStorage.setItem("PantallaLavado", 2);
                                app.views.main.router.navigate({
                                    name: "formLavado7",
                                });
                            }
                        });
                    } else {
                        swal("", "Debes tener como minimo 5 unidades revisadas para poder continuar.", "warning");
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

function getNameProveedor(proveedor) {
    var NomJson = "Proveedores";
    let nameProveedor = "";
    app.request({
        url: cordova.file.dataDirectory + "jsons_InsLavado/" + NomJson + ".json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].ID == proveedor) {
                    nameProveedor = data[j].NombreProveedor;
                    $(".NameProveedor_" + proveedor).text(nameProveedor);
                }
            }
        },
    });
}

function FinalizarEvaluacionLavado() {
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer pasar la pantalla de firmas?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            localStorage.setItem("PantallaLavado", 3);
            app.views.main.router.navigate({ name: "formLavado7" });
        }
    });
}

function SortEncierro() {
    swal("Trabajando...", "", "");
    let id_cedula = localStorage.getItem("IdCedula");
    $("#tb_detalle").html("");
    let html = "";
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT * FROM IEN_Header WHERE id_cedula = ? ORDER BY unidad",
                [id_cedula],
                function (tx5, results) {
                    let length = results.rows.length;
                    if (length > 0) {
                        $("#message-nr").css("display", "none");
                        for (let i = 0; i < length; i++) {
                            let item = results.rows.item(i);
                            html += `
                            <tr id="renglon_${item.ID_Header}">
                                <td>${item.unidad}</td>
                                <td style="padding: 10px 0px;">
                                    <div style="display: flex;justify-content: space-evenly;">
                                        <span> <button class="col button button-small button-round button-outline" style="height: 100%;border-color: #FF0037;width: fit-content;margin: auto;" onclick="editarInspeccionEncierro(${item.ID_Header});"> <i class="material-icons md-light" style="color: #FF0037;vertical-align: middle;font-size: 25px;margin: 5px 10px;">edit</i> </button> </span>
                                        <span> <button class="col button button-small button-round button-outline" style="height: 100%;border-color: #FF0037;width: fit-content;margin: auto;" onclick="eliminarInspeccionEncierro(${item.ID_Header});"> <i class="material-icons md-light" style="color: #FF0037;vertical-align: middle;font-size: 25px;margin: 5px 10px;">delete_forever</i> </button> </span>
                                    </div>
                                </td>
                            </tr>
                        `;
                        }
                        $("#tb_detalle").html(html);
                        swal("", "Completado.", "success");
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
//?Fin Campanias
