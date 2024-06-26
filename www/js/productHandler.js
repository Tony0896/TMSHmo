var productHandler = {
    addCedulayb: function (
        id_usuario,
        nombre_usuario,
        fecha_entrada,
        geolocalizacion_entrada,
        id_cliente,
        nombre_cliente,
        horario_programado,
        estatus,
        tipo_cedula
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into cedulas_general(id_usuario,nombre_usuario,fecha_entrada,geolocalizacion_entrada,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula) values(?,?,?,?,?,?,?,?,?)",
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
                    ],
                    function (tx, results) {
                        // console.log("Registro de cedula creado exitosamente");
                    },
                    function (tx, error) {
                        console.error(
                            "Error registrar cedula general:" + error.message
                        );
                    }
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDatosGenerales: function (
        id_cedula,
        Unidad,
        Chasis,
        Familia,
        marca,
        Empresa,
        FK_id_unidad,
        id_unidad_vs,
        FK_id_empresa,
        id_modelo_check,
        fecha_revision
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_checklist(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        Unidad,
                        Chasis,
                        Familia,
                        marca,
                        Empresa,
                        FK_id_unidad,
                        id_unidad_vs,
                        FK_id_empresa,
                        id_modelo_check,
                        fecha_revision,
                    ],
                    function (tx, results) {
                        //console.log("Frio correcto");
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
    },
    insertPreguntas: function (
        id_cedula,
        id_pregunta,
        revision,
        nombre_fase,
        nombre_seccion,
        fase,
        obligatorio,
        no_pregunta,
        respuesta,
        modelos,
        aux,
        aux2,
        multiple
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into checklist(id_cedula, id_pregunta, revision, nombre_fase, int_ext, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple) values(?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        id_pregunta,
                        revision,
                        nombre_fase,
                        nombre_seccion,
                        fase,
                        obligatorio,
                        no_pregunta,
                        respuesta,
                        modelos,
                        multiple,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formCheck1",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    addDatosGenerales_limp: function (
        id_cedula,
        Unidad,
        Chasis,
        Familia,
        marca,
        Empresa,
        FK_id_unidad,
        id_unidad_vs,
        FK_id_empresa,
        id_modelo_check,
        fecha_revision
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_revlimp(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        Unidad,
                        Chasis,
                        Familia,
                        marca,
                        Empresa,
                        FK_id_unidad,
                        id_unidad_vs,
                        FK_id_empresa,
                        id_modelo_check,
                        fecha_revision,
                    ],
                    function (tx, results) {
                        //console.log("Frio correcto");
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
    },
    insertPreguntas_limp: function (
        id_cedula,
        id_pregunta,
        revision,
        nombre_fase,
        nombre_seccion,
        fase,
        obligatorio,
        no_pregunta,
        respuesta,
        modelos,
        aux,
        aux2,
        multiple
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into checklist_revlimp(id_cedula, id_pregunta, revision, nombre_fase, int_ext, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple) values(?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        id_pregunta,
                        revision,
                        nombre_fase,
                        nombre_seccion,
                        fase,
                        obligatorio,
                        no_pregunta,
                        respuesta,
                        modelos,
                        multiple,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formLimp1",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    addCedula: function (
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
        geolocation
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
                        // console.log("Registro de cedula creado exitosamente");
                    },
                    function (tx, error) {
                        console.error(
                            "Error registrar cedula general:" + error.message
                        );
                    }
                );
            },
            function (error) {},
            function () {}
        );
    },
    insertPreguntasCiertoFalso: function (
        id_cedula,
        IDPregunta,
        Pregunta,
        texto1,
        texto2,
        OpCorrecta,
        id_curso,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into cursoCiertoFalso(id_cedula,IDPregunta,Pregunta,texto1,texto2,IDCurso,OpCorrecta,fecha) values(?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        IDPregunta,
                        Pregunta,
                        texto1,
                        texto2,
                        id_curso,
                        OpCorrecta,
                        getDateWhitZeros(),
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.sheet.close("#sheet-modal-1");
                            app.sheet.close("#sheet-modal-2");
                            app.views.main.router.back("/formCapacita2/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    addDatosPrueba1: function (
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
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datosGeneralesCurso(id_cedula, fecha, nombreInstructor, id_instructor, id_candidato, nombreCandidato, edad, telCelular, antecedentesManejo, name_course, fecha_captura, id_course, ID_AT, costo, Prueba, OpDiario) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
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
                        ID_AT,
                        costo,
                        Prueba,
                        OpDiario,
                    ],
                    function (tx, results) {
                        if (IDTipoCurso == 5) {
                            app.dialog.close();
                            app.sheet.close("#sheet-modal-1");
                            app.sheet.close("#sheet-modal-2");
                            app.views.main.router.back("/formCapacita7/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
                            });
                        }
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
    },
    asistenciaHeader: function (
        id_cedula,
        fecha,
        id_instructor,
        nombreInstructor,
        fecha_captura
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into asistenciaHeader(id_cedula, fecha, id_usuario, nameUsuario, fechaCaptura) values(?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        fecha,
                        id_instructor,
                        nombreInstructor,
                        fecha_captura,
                    ],
                    function (tx, results) {
                        //console.log("Frio correcto");
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
    },
    // asistenciaDetails(id_cedula integer, fecha text, id_becario int,claveBecario, nameBecario, asiste int, fechaCaptura text)
    asistenciaDetails: function (
        id_cedula,
        fecha,
        id_becario,
        claveBecario,
        nameBecario,
        asiste,
        fecha_captura,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into asistenciaDetails(id_cedula, fecha, id_becario, claveBecario, nameBecario, asiste, fechaCaptura) values(?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        fecha,
                        id_becario,
                        claveBecario,
                        nameBecario,
                        asiste,
                        getDateWhitZeros(),
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.sheet.close("#sheet-modal-1");
                            app.sheet.close("#sheet-modal-2");
                            app.views.main.router.back("/formCapacita3/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    insertPreguntasSiNoValor: function (
        id_cedula,
        IDPregunta,
        Pregunta,
        id_curso,
        OpCorrecta,
        Valor,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into CAP_RespuestasSiNoPuntuacion(id_cedula,FK_IDPregunta,Pregunta,FK_IDCurso, OpCorrecta,Valor, fecha) values(?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        IDPregunta,
                        Pregunta,
                        id_curso,
                        OpCorrecta,
                        Valor,
                        getDateWhitZeros(),
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.sheet.close("#sheet-modal-1");
                            app.sheet.close("#sheet-modal-2");
                            app.views.main.router.back("/formCapacita5/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    insertPreguntasMultiple: function (
        id_cedula,
        IDPregunta,
        Pregunta,
        Justifica,
        id_curso,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into CAP_RespuestasMultiple(id_cedula, FK_IDPregunta, Pregunta, Justifica, FK_IDCurso, fecha) values(?, ?, ? , ?, ?, ?)",
                    [
                        id_cedula,
                        IDPregunta,
                        Pregunta,
                        Justifica,
                        id_curso,
                        getDateWhitZeros(),
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.sheet.close("#sheet-modal-1");
                            app.sheet.close("#sheet-modal-2");
                            app.views.main.router.back("/formCapacita6/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    insertOptionsMultiple: function (
        id_cedula,
        ID,
        FK_Pregunta,
        Opcion,
        Correcta,
        Image,
        id_course
    ) {
        Image == "No Img" ? (Image = "") : "";
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into CAP_OPMultipleOpts(id_cedula, FK_IDPregunta,Opcion,Correcta,Image,FK_IDCurso) values(?,?,?,?,?,?)",
                    [
                        id_cedula,
                        FK_Pregunta,
                        Opcion,
                        Correcta,
                        Image,
                        id_course,
                    ],
                    function (tx, results) {},
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
    },
    //! Inicio Control Tecnologías
    addDesTechHmoHeader: function (
        id_cedula,
        unidad,
        id_unidad,
        id_operador,
        operador,
        credencial,
        fecha_inicio
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into DesTechHeader(id_cedula, unidad, id_unidad, id_operador, operador, credencial, fecha_inicio) values(?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        unidad,
                        id_unidad,
                        id_operador,
                        operador,
                        credencial,
                        fecha_inicio,
                    ],
                    function (tx, results) {},
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
    },
    addDesTechHmoDetails: function (
        id_cedula,
        IdHeader,
        Fk_pregunta,
        pregunta,
        multiple,
        Fk_id_formato,
        FK_equipo,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into DesTechDetails(id_cedula,IdHeader,Fk_pregunta,pregunta,multiple,id_formato,FK_equipo,respuesta) values(?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        IdHeader,
                        Fk_pregunta,
                        pregunta,
                        multiple,
                        Fk_id_formato,
                        FK_equipo,
                        1,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            // databaseHandler.db.transaction(
                            // 	function (tx) {
                            // 		tx.executeSql(
                            // 			"insert into DesTecFirmas(id_cedula, IdHeader) values(?, ?)",
                            // 			[id_cedula, IdHeader],
                            // 			function (tx, results) { },
                            // 			function (tx, error) { console.error("Error registrar:" + error.message); }
                            // 		);
                            // 	}, function (error) { console.log(error) }, function () { }
                            // );
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formtecnologiasHmo1",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    //! Fin Control Tecnologías
    //! inicio Relevos
    addRelevos: function (
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
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT id_cedula FROM Relevos WHERE id_cedula = ?",
                    [id_cedula],
                    function (tx, results) {
                        var item = results.rows.item(0);
                        console.log(item);
                        if (item) {
                            console.log("uodate");
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE Relevos SET IDSale = ?, claveEmpleado = ?, fullName = ?, ID_personal = ?, Eco = ?, FKUnidad = ?, linea = ?, jornada = ?, fechaSalida = ?, UsuarioMov = ?, FkUsuarioMov = ?, tipoCedula = ?, IDEntra = ?, ID_personalE = ?, EcoE = ?, FKUnidadE = ?, lineaE = ?, jornadaE = ? WHERE id_cedula = ?",
                                        [
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
                                            ID_personalE,
                                            EcoE,
                                            FKUnidadE,
                                            lineaE,
                                            jornadaE,
                                            id_cedula,
                                        ],
                                        function (tx, results) {},
                                        function (tx, error) {
                                            console.error(
                                                "Error registrar:" +
                                                    error.message
                                            );
                                        }
                                    );
                                },
                                function (error) {
                                    console.log(error);
                                },
                                function () {}
                            );
                        } else {
                            console.log("insert");
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "insert into Relevos(id_cedula, IDSale, claveEmpleado, fullName, ID_personal, Eco, FKUnidad, linea, jornada, fechaSalida, UsuarioMov, FkUsuarioMov, tipoCedula, IDEntra, ID_personalE, EcoE, FKUnidadE, lineaE, jornadaE) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                        [
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
                                            ID_personalE,
                                            EcoE,
                                            FKUnidadE,
                                            lineaE,
                                            jornadaE,
                                        ],
                                        function (tx, results) {},
                                        function (tx, error) {
                                            console.error(
                                                "Error registrar:" +
                                                    error.message
                                            );
                                        }
                                    );
                                },
                                function (error) {
                                    console.log(error);
                                },
                                function () {}
                            );
                        }
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
    },
    //! Fin Relevos
    //! inicio Relevos
    insertHeaderInsEncierro: function (
        id_cedula,
        FKCampaña,
        nombreCampania,
        FKFormato,
        fechaFin,
        fechaInicio,
        FK_Unidad,
        observaciones,
        unidad
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into IEN_Header(id_cedula, FKCampaña, nombreCampania, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        FKCampaña,
                        nombreCampania,
                        FKFormato,
                        fechaFin,
                        fechaInicio,
                        FK_Unidad,
                        observaciones,
                        unidad,
                    ],
                    function (tx, results) {},
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
    },
    insertPreguntasInsEncierro: function (
        id_cedula,
        FKHeader,
        Fk_pregunta,
        pregunta,
        multiple,
        FK_formato,
        Opcion1,
        Opcion2,
        Opcion3,
        Opcion4,
        Opcion5,
        Opcion6,
        respuesta,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    // FK_formato integer, Fk_pregunta integer, pregunta text, multiple integer, respuesta int, Opcion_1 text, Opcion_2 text
                    "insert into IEN_Details(id_cedula,FKHeader,Fk_pregunta,pregunta,multiple,FK_formato,Opcion_1,Opcion_2,Opcion_3,Opcion_4,Opcion_5,Opcion_6) values(?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        FKHeader,
                        Fk_pregunta,
                        pregunta,
                        multiple,
                        FK_formato,
                        Opcion1,
                        Opcion2,
                        Opcion3,
                        Opcion4,
                        Opcion5,
                        Opcion6,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formEncierro2",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    //id_cedula, item.IdHeader, data[j].ID, '¿Se lavó?', 0, 0, 'SI', 'NO', '', '', '', '', data[j].TypePrograma, data[j].FK_provedor, 1, 2
    insertPreguntasLavado: function (
        id_cedula,
        FK_header,
        IDServidor,
        pregunta,
        multiple,
        FK_formato,
        Opcion1,
        Opcion2,
        Opcion3,
        Opcion4,
        Opcion5,
        Opcion6,
        programa,
        respuesta,
        proveedor,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    // FK_formato integer, Fk_pregunta integer, pregunta text, multiple integer, respuesta int, Opcion_1 text, Opcion_2 text
                    "insert into IEN_ProgramacionLavado(id_cedula,FK_header,IDServidor, pregunta, multiple,FK_formato,Opcion1,Opcion2,Opcion3,Opcion4,Opcion5,Opcion6,programa,respuesta,proveedor,IDPregunta) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        FK_header,
                        IDServidor,
                        pregunta,
                        multiple,
                        FK_formato,
                        Opcion1,
                        Opcion2,
                        Opcion3,
                        Opcion4,
                        Opcion5,
                        Opcion6,
                        programa,
                        respuesta,
                        proveedor,
                        aux,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formLavado1",
                            });
                        }
                        // else {
                        // 	var dialog = app.dialog.get();
                        // 	dialog.setProgress((aux2 * 100) / aux);
                        // 	dialog.setText(aux2 + ' de ' + aux);
                        // }
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
    },
    //insertPreguntasLavado(id_cedula, item.IdHeader, data[j].ID, data[j].Pregunta, 0, data[j].FK_formato, data[j].Opcion_1, data[j].Opcion_2, data[j].Opcion_3, data[j].Opcion_4, data[j].Opcion_5, data[j].Opcion_6,1, aux, aux2)
    insertPreguntasResultadoLavado: function (
        id_cedula,
        FK_header,
        IDPregunta,
        pregunta,
        multiple,
        FK_formato,
        Opcion1,
        Opcion2,
        Opcion3,
        Opcion4,
        Opcion5,
        Opcion6,
        respuesta,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    // FK_formato integer, Fk_pregunta integer, pregunta text, multiple integer, respuesta int, Opcion_1 text, Opcion_2 text
                    "insert into IEN_ResultadoLavado(id_cedula,FK_header,IDPregunta, pregunta, multiple,FK_formato,Opcion1,Opcion2,Opcion3,Opcion4,Opcion5,Opcion6,respuesta) values(?,?,?, ?, ?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        FK_header,
                        IDPregunta,
                        pregunta,
                        multiple,
                        FK_formato,
                        Opcion1,
                        Opcion2,
                        Opcion3,
                        Opcion4,
                        Opcion5,
                        Opcion6,
                        respuesta,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formLavado3",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    insertPreguntasResultadoLavado2: function (
        id_cedula,
        FK_header,
        IDPregunta,
        pregunta,
        multiple,
        FK_formato,
        Opcion1,
        Opcion2,
        Opcion3,
        Opcion4,
        Opcion5,
        Opcion6,
        respuesta,
        aux,
        aux2
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    // FK_formato integer, Fk_pregunta integer, pregunta text, multiple integer, respuesta int, Opcion_1 text, Opcion_2 text
                    "insert into IEN_ResultadoLavado(id_cedula,FK_header,IDPregunta, pregunta, multiple,FK_formato,Opcion1,Opcion2,Opcion3,Opcion4,Opcion5,Opcion6,respuesta) values(?,?,?, ?, ?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        FK_header,
                        IDPregunta,
                        pregunta,
                        multiple,
                        FK_formato,
                        Opcion1,
                        Opcion2,
                        Opcion3,
                        Opcion4,
                        Opcion5,
                        Opcion6,
                        respuesta,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formLavado5",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
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
    },
    //! Fin Relevos
    //! Inicio Diesel
    addDatosGenerales_Diesel: function (
        id_cedula,
        fecha,
        id_usuario,
        id_empresa,
        estatus,
        origen,
        nombre_usuario,
        bomba_def,
        carga_def,
        ID_Personal,
        personal,
        bomba_def2,
        carga_def2,
        ID_Personal2,
        personal2,
        fecha_def
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_diesel(id_cedula, fecha, id_usuario, id_empresa,estatus, origen, nombre_usuario, bomba_def, carga_def, ID_Personal, personal, bomba_def2, carga_def2, ID_Personal2, personal2, fecha_corta) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        fecha,
                        id_usuario,
                        id_empresa,
                        estatus,
                        origen,
                        nombre_usuario,
                        bomba_def,
                        carga_def,
                        ID_Personal,
                        personal,
                        bomba_def2,
                        carga_def2,
                        ID_Personal2,
                        personal2,
                        fecha_def,
                    ],
                    function (tx, results) {
                        app.views.main.router.navigate({
                            name: "yallegueDiesel",
                        });
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
    },
    //! Fin Diesel
};
