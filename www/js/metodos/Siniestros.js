function IniciaSiniestros() {
    if ($("#id_unidad").val()) {
        if ($("#modelo_check").val()) {
            app.views.main.router.navigate({
                name: "formSiniestros1",
            });
            localStorage.setItem("IDUnidad", $("#id_unidad").val());
            localStorage.setItem("FKFormato", $("#modelo_check").val());
            localStorage.setItem("ChasisUnidad", $("#Chasis").val());

            // let Unidad = $("#unidad").val();
            // let Chasis = $("#Chasis").val();
            // let id_unidad = $("#id_unidad").val();
            // let FK_id_empresa = $("#FK_unidad_danos_empresa").val();
            // let id_modelo_check = $("#modelo_check").val();
            // let nameFormato = $("#formato").val();
            // let fecha_revision = $("#fecha_revision").val();
            // let id_usuario = localStorage.getItem("Usuario");
            // let nombre_usuario = localStorage.getItem("nombre");
            // let fecha_llegada = getDateWhitZeros();
            // let geolocation = "";
            // let id_cliente = localStorage.getItem("empresa");
            // let nombre_cliente = Unidad;
            // let horario_programado = fecha_llegada;
            // let estatus = 0;
            // let tipo_cedula = "Siniestros";
            // productHandler.addCedulayb(
            //     id_usuario,
            //     nombre_usuario,
            //     fecha_llegada,
            //     geolocation,
            //     id_cliente,
            //     nombre_cliente,
            //     horario_programado,
            //     estatus,
            //     tipo_cedula
            // );
            // databaseHandler.db.transaction(
            //     function (tx) {
            //         tx.executeSql(
            //             "Select MAX(id_cedula) as Id from cedulas_general",
            //             [],
            //             function (tx, results) {
            //                 //app.dialog.progress('Generando CheckList','red');
            //                 var progress = 0;
            //                 var dialog = app.dialog.progress("Procesando", progress, "red");
            //                 var empresa = localStorage.getItem("empresa");
            //                 var item = results.rows.item(0);
            //                 localStorage.setItem("IdCedula", item.Id);
            //                 var id_cedula = item.Id;
            //                 productHandler.addDatosGenerales(
            //                     id_cedula,
            //                     Unidad,
            //                     Chasis,
            //                     Familia,
            //                     marca,
            //                     Empresa,
            //                     FK_id_unidad,
            //                     id_unidad,
            //                     FK_id_empresa,
            //                     id_modelo_check,
            //                     fecha_revision
            //                 );
            //                 var NomJson = "datos_check_desc" + empresa;
            //                 app.request({
            //                     url: cordova.file.dataDirectory + "jsons_RevImagen/" + NomJson + ".json",
            //                     method: "GET",
            //                     dataType: "json",
            //                     success: function (data) {
            //                         var aux = 0;
            //                         var aux2 = 0;
            //                         for (var j = 0; j < data.length; j++) {
            //                             if (data[j].modelos == id_modelo_check) {
            //                                 aux++;
            //                             }
            //                         }
            //                         if (aux == 0) {
            //                             app.dialog.close();
            //                             swal("", "Algo salió mal.", "warning");
            //                         } else {
            //                             dialog.setText("1 de " + aux);
            //                             for (var j = 0; j < data.length; j++) {
            //                                 if (data[j].modelos == id_modelo_check) {
            //                                     aux2++;
            //                                     productHandler.insertPreguntas(
            //                                         id_cedula,
            //                                         data[j].id_pregunta,
            //                                         data[j].revision,
            //                                         data[j].nombre_fase,
            //                                         data[j].nombre_seccion,
            //                                         data[j].fase,
            //                                         data[j].obligatorio,
            //                                         data[j].no_pregunta,
            //                                         1,
            //                                         data[j].modelos,
            //                                         aux,
            //                                         aux2,
            //                                         data[j].multiple
            //                                     );
            //                                 }
            //                             }
            //                         }
            //                     },
            //                 });
            //             },
            //             function (tx, error) {
            //                 console.log("Error al guardar cedula: " + error.message);
            //             }
            //         );
            //     },
            //     function (error) {},
            //     function () {}
            // );
        } else {
            swal("", "La unidad aún no tiene una asignación.", "warning");
        }
    } else {
        swal("", "Debes seleccionar una unidad para poder continuar.", "warning");
    }
}

function changeColor(value) {
    document.documentElement.style.setProperty("--color", value);
}

function changeColor2(value) {
    document.documentElement.style.setProperty("--color", value);
}

function verConceptoSiniestro(FK_RelacionAsignacion, FK_Vista, FK_Concepto) {
    console.log(FK_RelacionAsignacion, FK_Vista, FK_Concepto);
    let empresa = localStorage.getItem("empresa");
    let encontro = false;

    let display = "",
        opciones = "",
        id = "",
        html = "",
        multiple = "",
        revision = "";

    app.request.get(cordova.file.dataDirectory + "jsons_Siniestros/DetallesFormatos_" + empresa + ".json", function (data) {
        let content2 = JSON.parse(data);
        opciones = "";
        for (let x = 0; x < content2.length; x++) {
            if (content2[x].ID == FK_Concepto) {
                revision = `${content2[x].No_PARTE}.${content2[x].No_PREGUNTA} ${content2[x].REVISION}`;
                console.log(content2[x]);
                encontro = true;
                titulo_modal = content2[x].REVISION;
                opciones = "<option>Selecciona una opción</option>";
                id = 1;
                html = `<div
                    class="list FWM-fixing-form"
                    id="div_cboxs"
                    style="
                        margin-top: 25px;
                        max-height: 350px;
                        overflow-y: scroll;
                        padding-top: 20px;
                        border: 1px solid #b1b1b1 !important;
                        border-radius: 10px;
                        padding-left: 20px;
                        margin-left: 15px;
                        margin-right: 15px;
                        width: 92%;
                    "
                >
                    <input type="hidden" id="inputEvidencia" value="" />
                    <input type="hidden" id="pasa" value="0" />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox1" value="Ausente" />Ausente </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox2" value="Deformado" />Deformado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox3" value="Degradado" />Degradado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox4" value="Desajustado" />Desajustado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox5" value="Desprendido" />Desprendido </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox6" value="Estrellado" />Estrellado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox7" value="Filtración" />Filtración </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox8" value="Flojo" />Flojo </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox9" value="Fundido" />Fundido </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox10" value="Grafiteado" />Grafiteado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox11" value="Hundido" />Hundido </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox12" value="Incompleto" />Incompleto </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox13" value="Manchado" />Manchado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox14" value="Rayón" />Rayón </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox15" value="Roto" />Roto </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox16" value="Suelto" />Suelto </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox17" value="Tallón" />Tallón </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox18" value="Opaco" />Opaco </label><br />
                    <label class="label_modal">
                        <input class="cbox_modal obligatorio" type="checkbox" id="cbox19" value="Con residuos de pegamento" />Con residuos de pegamento </label
                    ><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox20" value="Flameado" />Flameado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox21" value="Descarapelado" />Descarapelado </label
                    ><br />
                    <label class="label_modal">
                        <input class="cbox_modal obligatorio" type="checkbox" id="cbox22" value="Desconectado(s)" />Desconectado(s) </label
                    ><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox23" value="No alumbra" />No alumbra </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox24" value="Mal pintado" />Mal pintado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox26" value="Pintura" />Pintura </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox28" value="Sin  cincho" />Sin cincho </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox30" value="Sin recarga" />Sin recarga </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox31" value="Desgastado" />Desgastado </label><br />
                    <label class="label_modal">
                        <input class="cbox_modal obligatorio" type="checkbox" id="cbox32" value="No estandarizado" />No estandarizado </label
                    ><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox33" value="Fuga" />Fuga </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox25" value="Código activo" />Código activo </label
                    ><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox27" value="Despintado" />Despintado </label><br />
                    <label class="label_modal"> <input class="cbox_modal obligatorio" type="checkbox" id="cbox29" value="Caducado" />Caducado </label><br />
                </div>`;
                multiple = content2[x].COMBO;
                // app.sheet.open("#sheet-modal_general");
            }
        }

        if (encontro) {
            if (multiple == 1) {
                let text = revision;
                let result = text.includes("(");
                if (result) {
                    let resultados = text.split("(");
                    let divididos = resultados[1].split(",");
                    let quitapar = "";
                    for (i = 0; i < divididos.length; i++) {
                        quitapar = divididos[i].replace("(", "");
                        quitapar = quitapar.replace(")", "");
                        quitapar = capitalizarPrimeraLetra(String(quitapar).trim());
                        opciones += `<option value=${quitapar.trim()}}>${quitapar.trim()}</option>`;
                    }
                    display = "block";
                }
            } else {
                display = "none";
            }

            popEvidencia_modal_general.open();
            $("#bodyModal_general").html(`
                <h3 class="FWN-titulo-2"><strong>${revision}</strong><br><br>¿Que tipo de daño es?</h3><hr>
                <span id="titulo_modal" style="display:${display};color: #FF0037;" class="span FWM-span-form">Selecciona donde se encuetra el daño</span>
                <div style="display:${display}; padding-top: 10px;margin-bottom: 20px;">
                    <select class="FWM-input" id="opts_modal" multiple>
                        ${opciones}
                    </select>
                </div>
                <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                    <input type="hidden" id="inputEvidencia" value=${id}>
                    <input type="hidden" id="pasa" value="0">${html}
                    <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                        <div class="row align-items-stretch" style="text-align: center;">
                            <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                <span class="resize-handler"></span>
                                <a href="#" onclick="agregaComentarios(${id},${multiple});" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    });
}
