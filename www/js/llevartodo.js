function AlmacenarError(respuesta, tipo) {
    $(".send-ced").css("pointer-events", "all");
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    var versionapp = localStorage.getItem("version");
    var fechaApp = getDateWhitZeros();

    fechaApp = fechaApp.replace(" ", "T");
    datos[0] = {
        id_usario: id_usuario,
        id_empresa: id_empresa,
        respuesta: respuesta,
        versionapp: versionapp,
        fechaApp: fechaApp,
        tipo: tipo,
    };
    $.ajax({
        type: "POST",
        async: true,
        url: url + "/guardarErrorRespuesta.php",
        dataType: "html",
        data: { datos: JSON.stringify(datos) },
        success: function (respuesta) {
            if (respuesta == 1) {
                //swal("","No se pudo completar el registro","warning");
            }
        },
        error: function () {
            console.log("Error en la comunicacion con el servidor");
        },
    });
}
function llevarTodo(id_cedula, tipo_cedula) {
    localStorage.setItem("sendFlag", 1);
    $(".send-ced").css("pointer-events", "none");
    var url = localStorage.getItem("url");
    console.log(id_cedula, tipo_cedula);
    // var datos = new Array();
    // var id_usuario = localStorage.getItem("Usuario");
    // var id_empresa = localStorage.getItem("empresa");
    // var versionapp = localStorage.getItem("version");
    // var fechaApp = getDateWhitZeros();
    // fechaApp = fechaApp.replace(" ", "T");
    // datos[0] = {'id_usuario':id_usuario,'id_empresa':id_empresa,'tipo_cedula':tipo_cedula,'versionapp':versionapp, 'fechaApp':fechaApp};
    // $.ajax({
    //     type: "POST",
    //     async : true,
    //     url: url+"/guardarEnvioCedula.php",
    //     dataType: 'html',
    //     data: {'datos': JSON.stringify(datos)},
    //     success: function(respuesta){
    //     },
    //     error: function(){
    //         console.log("Error en la comunicacion con el servidor");
    //     }
    // });
    swal("Enviando", "....", "success");
    var empresa = localStorage.getItem("nombre_empresa");
    var datosCedulaGeneral = new Array();
    var checklist = new Array();
    var datos_generales_checklist = new Array();

    var fecha_envio = getDateWhitZeros();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "SELECT * FROM cedulas_general WHERE id_cedula = ?",
                [id_cedula],
                function (tx, results) {
                    var length = results.rows.length;
                    for (var i = 0; i < length; i++) {
                        var item = results.rows.item(i);
                        tipo = item.tipo_cedula;
                        fecha_envio = fecha_envio.replace(" ", "T");
                        var fecha_entrada = item.fecha_entrada;
                        fecha_entrada = fecha_entrada.replace(" ", "T");
                        var fecha_salida = item.fecha_salida;
                        fecha_salida = fecha_salida.replace(" ", "T");
                        datosCedulaGeneral[i] = {
                            Valor: i,
                            id_cedula: item.id_cedula,
                            tipo_cedula: item.tipo_cedula,
                            id_usuario: item.id_usuario,
                            nombre_usuario: item.nombre_usuario,
                            fecha_entrada: fecha_entrada,
                            geolocalizacion_entrada: item.geolocalizacion_entrada,
                            id_cliente: item.id_cliente,
                            nombre_cliente: item.nombre_cliente,
                            horario_programado: item.horario_programado,
                            calificacion: 0,
                            fecha_salida: fecha_salida,
                            geolocalizacion_salida: item.geolocalizacion_salida,
                            nombre_evalua: item.nombre_evalua,
                            comentario_cliente: item.comentario_cliente,
                            fecha_envio: fecha_envio,
                        };
                    }
                    if (tipo == "checklist") {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM checklist WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            checklist[i] = {
                                                Valor: i,
                                                id_pregunta: item1.id_pregunta,
                                                revision: item1.revision,
                                                nombre_fase: item1.nombre_fase,
                                                int_ext: item1.int_ext,
                                                id_fase: item1.id_fase,
                                                obligatorio: item1.obligatorio,
                                                no_pregunta: item1.no_pregunta,
                                                respuesta: item1.respuesta,
                                                modelo: item1.modelo,
                                                comentarios: item1.comentarios,
                                                multiple: item1.multiple,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM datos_generales_checklist WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            datos_generales_checklist[i] = {
                                                                Valor: i,
                                                                Unidad: item2.Unidad,
                                                                Chasis: item2.Chasis,
                                                                Familia: item2.Familia,
                                                                marca: item2.marca,
                                                                Empresa: item2.Empresa,
                                                                FK_id_unidad: item2.FK_id_unidad,
                                                                id_unidad_vs: item2.id_unidad_vs,
                                                                FK_id_empresa: item2.FK_id_empresa,
                                                                id_modelo_check: item2.id_modelo_check,
                                                                comentarios_generales: item2.comentarios_generales,
                                                                fecha_revision: item2.fecha_revision,
                                                            };
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/Imagen/guardarRevImgCheklist.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                checklist: JSON.stringify(checklist),
                                                                datos_generales_checklist: JSON.stringify(datos_generales_checklist),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "Capacitación") {
                        var datosGeneralesCurso = new Array();
                        var cursoCiertoFalso = new Array();
                        if (item.nombre_evalua == "Prueba Manejo") {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "SELECT * FROM cursoCiertoFalso WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var length2 = results.rows.length;
                                            var correctas = 0;
                                            for (var i = 0; i < length2; i++) {
                                                var item2 = results.rows.item(i);
                                                var fechag = item2.fecha;
                                                item2.OpCorrecta == item2.Respuesta ? (correctas = correctas + 1) : null;
                                                fechag = fechag.replace(" ", "T");
                                                cursoCiertoFalso[i] = {
                                                    Valor: i,
                                                    IDCurso: item2.IDCurso,
                                                    IDPregunta: item2.IDPregunta,
                                                    OpCorrecta: item2.OpCorrecta,
                                                    Pregunta: item2.Pregunta,
                                                    Respuesta: item2.Respuesta,
                                                    fecha: fechag,
                                                };
                                            }
                                            var promedio = getPromedio(correctas, length2);
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var length = results.rows.length;
                                                            for (var i = 0; i < length; i++) {
                                                                var item1 = results.rows.item(i);
                                                                var fecha_captura = item1.fecha_captura;
                                                                fecha_captura = fecha_captura.replace(" ", "T");
                                                                datosGeneralesCurso[i] = {
                                                                    Valor: i,
                                                                    ID_AT: item1.ID_AT,
                                                                    Prueba: item1.Prueba,
                                                                    antecedentesManejo: item1.antecedentesManejo,
                                                                    costo: item1.costo,
                                                                    apto: item1.apto,
                                                                    edad: item1.edad,
                                                                    fecha: item1.fecha,
                                                                    fecha_captura: fecha_captura,
                                                                    firmaInstructor: item1.firmaInstructor,
                                                                    id_candidato: item1.id_candidato,
                                                                    id_course: item1.id_course,
                                                                    id_instructor: item1.id_instructor,
                                                                    name_course: item1.name_course,
                                                                    nombreCandidato: item1.nombreCandidato,
                                                                    nombreInstructor: item1.nombreInstructor,
                                                                    observaciones: item1.observaciones,
                                                                    telCelular: item1.telCelular,
                                                                    promedio: promedio,
                                                                };
                                                            }
                                                            $.ajax({
                                                                type: "POST",
                                                                async: true,
                                                                url: url + "/capacitacion/guardarCursoManejo.php",
                                                                dataType: "html",
                                                                data: {
                                                                    datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                    datosGeneralesCurso: JSON.stringify(datosGeneralesCurso),
                                                                    cursoCiertoFalso: JSON.stringify(cursoCiertoFalso),
                                                                },
                                                                success: function (respuesta) {
                                                                    var respu1 = respuesta.split("._.");
                                                                    var dat1 = respu1[0];
                                                                    var dat2 = respu1[1];
                                                                    if (dat1 == "CEDULA") {
                                                                        if (dat2 > 0) {
                                                                            databaseHandler.db.transaction(function (tx7) {
                                                                                tx7.executeSql(
                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                    [id_cedula],
                                                                                    function (tx7, results) {
                                                                                        $(".send-ced").css("pointer-events", "all");
                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                        $("#li-" + item.id_cedula).remove();
                                                                                        swal("Enviado!", "", "success");
                                                                                        sincronizaDatosCapacitacion();
                                                                                    }
                                                                                );
                                                                            });
                                                                        }
                                                                    } else {
                                                                        AlmacenarError(respuesta);
                                                                    }
                                                                },
                                                                error: function () {
                                                                    console.log("Error en la comunicacion");
                                                                    swal("Fallo el envío, por conexión!", "", "error");
                                                                    $(".send-ced").css("pointer-events", "all");
                                                                },
                                                            });
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        },
                                        function (tx, error) {
                                            console.log("Error al consultar: " + error.message);
                                        }
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        } else {
                            if (item.geolocalizacion_salida == 0) {
                                var asistenciaHeader = new Array();
                                var asistenciaDetails = new Array();
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "SELECT * FROM asistenciaHeader WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                var length2 = results.rows.length;
                                                for (var i = 0; i < length2; i++) {
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fechaCaptura;
                                                    fechag = fechag.replace(" ", "T");
                                                    asistenciaHeader[i] = {
                                                        Valor: i,
                                                        fecha: item2.fecha,
                                                        fechaCaptura: fechag,
                                                        IDusuario: item2.id_usuario,
                                                        nameUsuario: item2.nameUsuario,
                                                    };
                                                }
                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "SELECT * FROM asistenciaDetails WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function (tx, results) {
                                                                var length = results.rows.length;
                                                                for (var i = 0; i < length; i++) {
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fechaCaptura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    asistenciaDetails[i] = {
                                                                        Valor: i,
                                                                        asiste: item1.asiste,
                                                                        claveBecario: item1.claveBecario,
                                                                        fecha: item1.fecha,
                                                                        fechaCaptura: fecha_captura,
                                                                        id_becario: item1.id_becario,
                                                                        nameBecario: item1.nameBecario,
                                                                        observacionAsistencia: item1.observacionAsistencia,
                                                                        flagTipo: item1.flagTipo,
                                                                        FKTipo: item1.FKTipo,
                                                                    };
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async: true,
                                                                    url: url + "/capacitacion/guardarListaAsistencia.php",
                                                                    dataType: "html",
                                                                    data: {
                                                                        datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                        asistenciaHeader: JSON.stringify(asistenciaHeader),
                                                                        asistenciaDetails: JSON.stringify(asistenciaDetails),
                                                                    },
                                                                    success: function (respuesta) {
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if (dat1 == "CEDULA") {
                                                                            if (dat2 > 0) {
                                                                                databaseHandler.db.transaction(function (tx7) {
                                                                                    tx7.executeSql(
                                                                                        "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                        [id_cedula],
                                                                                        function (tx7, results) {
                                                                                            $(".send-ced").css("pointer-events", "all");
                                                                                            localStorage.setItem("sendFlag", 0);
                                                                                            $("#li-" + item.id_cedula).remove();
                                                                                            swal("Enviado!", "", "success");
                                                                                            sincronizaDatosCapacitacion();
                                                                                        }
                                                                                    );
                                                                                });
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function () {
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all");
                                                                    },
                                                                });
                                                            },
                                                            function (tx, error) {
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function (error) {},
                                                    function () {}
                                                );
                                            },
                                            function (tx, error) {
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            } else if (item.geolocalizacion_salida == 1) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "SELECT * FROM cursoCiertoFalso WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                var length2 = results.rows.length;
                                                var correctas = 0;
                                                for (var i = 0; i < length2; i++) {
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    item2.OpCorrecta == item2.Respuesta ? (correctas = correctas + 1) : null;
                                                    fechag = fechag.replace(" ", "T");
                                                    cursoCiertoFalso[i] = {
                                                        Valor: i,
                                                        IDCurso: item2.IDCurso,
                                                        IDPregunta: item2.IDPregunta,
                                                        OpCorrecta: item2.OpCorrecta,
                                                        Pregunta: item2.Pregunta,
                                                        Respuesta: item2.Respuesta,
                                                        fecha: fechag,
                                                    };
                                                }
                                                var promedio = getPromedio(correctas, length2);
                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function (tx, results) {
                                                                var length = results.rows.length;
                                                                for (var i = 0; i < length; i++) {
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    datosGeneralesCurso[i] = {
                                                                        Valor: i,
                                                                        ID_AT: item1.ID_AT,
                                                                        Prueba: item1.Prueba,
                                                                        antecedentesManejo: item1.antecedentesManejo,
                                                                        costo: item1.costo,
                                                                        apto: item1.apto,
                                                                        edad: item1.edad,
                                                                        fecha: item1.fecha,
                                                                        fecha_captura: fecha_captura,
                                                                        firmaInstructor: item1.firmaInstructor,
                                                                        id_candidato: item1.id_candidato,
                                                                        id_course: item1.id_course,
                                                                        id_instructor: item1.id_instructor,
                                                                        name_course: item1.name_course,
                                                                        nombreCandidato: item1.nombreCandidato,
                                                                        nombreInstructor: item1.nombreInstructor,
                                                                        observaciones: item1.observaciones,
                                                                        telCelular: item1.telCelular,
                                                                        promedio: promedio,
                                                                    };
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async: true,
                                                                    url: url + "/capacitacion/guardarCiertoFalso.php",
                                                                    dataType: "html",
                                                                    data: {
                                                                        datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                        datosGeneralesCurso: JSON.stringify(datosGeneralesCurso),
                                                                        cursoCiertoFalso: JSON.stringify(cursoCiertoFalso),
                                                                    },
                                                                    success: function (respuesta) {
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if (dat1 == "CEDULA") {
                                                                            if (dat2 > 0) {
                                                                                databaseHandler.db.transaction(function (tx7) {
                                                                                    tx7.executeSql(
                                                                                        "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                        [id_cedula],
                                                                                        function (tx7, results) {
                                                                                            $(".send-ced").css("pointer-events", "all");
                                                                                            localStorage.setItem("sendFlag", 0);
                                                                                            $("#li-" + item.id_cedula).remove();
                                                                                            swal("Enviado!", "", "success");
                                                                                            sincronizaDatosCapacitacion();
                                                                                        }
                                                                                    );
                                                                                });
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function () {
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all");
                                                                    },
                                                                });
                                                            },
                                                            function (tx, error) {
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function (error) {},
                                                    function () {}
                                                );
                                            },
                                            function (tx, error) {
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            } else if (item.geolocalizacion_salida == 2) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "SELECT * FROM CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                var length2 = results.rows.length;
                                                var correctas = 0;
                                                for (var i = 0; i < length2; i++) {
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    item2.OpCorrecta == item2.Respuesta ? (correctas = correctas + 1) : null;
                                                    fechag = fechag.replace(" ", "T");
                                                    cursoCiertoFalso[i] = {
                                                        Valor: i,
                                                        FK_IDCurso: item2.FK_IDCurso,
                                                        FK_IDPregunta: item2.FK_IDPregunta,
                                                        OpCorrecta: item2.OpCorrecta,
                                                        Pregunta: item2.Pregunta,
                                                        Respuesta: item2.Respuesta,
                                                        fecha: fechag,
                                                    };
                                                }
                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function (tx, results) {
                                                                var length = results.rows.length;
                                                                for (var i = 0; i < length; i++) {
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    var promedio = item1.promedio;
                                                                    datosGeneralesCurso[i] = {
                                                                        Valor: i,
                                                                        ID_AT: item1.ID_AT,
                                                                        Prueba: item1.Prueba,
                                                                        antecedentesManejo: item1.antecedentesManejo,
                                                                        costo: item1.costo,
                                                                        apto: item1.apto,
                                                                        edad: item1.edad,
                                                                        fecha: item1.fecha,
                                                                        fecha_captura: fecha_captura,
                                                                        firmaInstructor: item1.firmaInstructor,
                                                                        id_candidato: item1.id_candidato,
                                                                        id_course: item1.id_course,
                                                                        id_instructor: item1.id_instructor,
                                                                        name_course: item1.name_course,
                                                                        nombreCandidato: item1.nombreCandidato,
                                                                        nombreInstructor: item1.nombreInstructor,
                                                                        observaciones: item1.observaciones,
                                                                        telCelular: item1.telCelular,
                                                                        promedio: promedio,
                                                                    };
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async: true,
                                                                    url: url + "/capacitacion/guardarSiNoPuntuacion.php",
                                                                    dataType: "html",
                                                                    data: {
                                                                        datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                        datosGeneralesCurso: JSON.stringify(datosGeneralesCurso),
                                                                        CAP_RespuestasSiNoPuntuacion: JSON.stringify(cursoCiertoFalso),
                                                                    },
                                                                    success: function (respuesta) {
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if (dat1 == "CEDULA") {
                                                                            if (dat2 > 0) {
                                                                                databaseHandler.db.transaction(function (tx7) {
                                                                                    tx7.executeSql(
                                                                                        "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                        [id_cedula],
                                                                                        function (tx7, results) {
                                                                                            $(".send-ced").css("pointer-events", "all");
                                                                                            localStorage.setItem("sendFlag", 0);
                                                                                            $("#li-" + item.id_cedula).remove();
                                                                                            swal("Enviado!", "", "success");
                                                                                            sincronizaDatosCapacitacion();
                                                                                        }
                                                                                    );
                                                                                });
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function () {
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all");
                                                                    },
                                                                });
                                                            },
                                                            function (tx, error) {
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function (error) {},
                                                    function () {}
                                                );
                                            },
                                            function (tx, error) {
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            } else if (item.geolocalizacion_salida == 3 || item.geolocalizacion_salida == 4) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "SELECT * FROM CAP_RespuestasMultiple WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                var length2 = results.rows.length;
                                                var correctas = 0;
                                                for (var i = 0; i < length2; i++) {
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    item2.OpCorrecta == item2.Respuesta ? (correctas = correctas + 1) : null;
                                                    fechag = fechag.replace(" ", "T");
                                                    cursoCiertoFalso[i] = {
                                                        Valor: i,
                                                        FK_IDCurso: item2.FK_IDCurso,
                                                        FK_IDPregunta: item2.FK_IDPregunta,
                                                        Pregunta: item2.Pregunta,
                                                        Respuesta: item2.Respuesta,
                                                        Justificacion: item2.Justificacion,
                                                        fecha: fechag,
                                                    };
                                                }

                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function (tx, results) {
                                                                var length = results.rows.length;
                                                                for (var i = 0; i < length; i++) {
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    var promedio = item1.promedio;
                                                                    datosGeneralesCurso[i] = {
                                                                        Valor: i,
                                                                        ID_AT: item1.ID_AT,
                                                                        Prueba: item1.Prueba,
                                                                        antecedentesManejo: item1.antecedentesManejo,
                                                                        costo: item1.costo,
                                                                        apto: item1.apto,
                                                                        edad: item1.edad,
                                                                        fecha: item1.fecha,
                                                                        fecha_captura: fecha_captura,
                                                                        firmaInstructor: item1.firmaInstructor,
                                                                        id_candidato: item1.id_candidato,
                                                                        id_course: item1.id_course,
                                                                        id_instructor: item1.id_instructor,
                                                                        name_course: item1.name_course,
                                                                        nombreCandidato: item1.nombreCandidato,
                                                                        nombreInstructor: item1.nombreInstructor,
                                                                        observaciones: item1.observaciones,
                                                                        telCelular: item1.telCelular,
                                                                        promedio: promedio,
                                                                    };
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async: true,
                                                                    url: url + "/capacitacion/guardarOptsMultiples.php",
                                                                    dataType: "html",
                                                                    data: {
                                                                        datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                        datosGeneralesCurso: JSON.stringify(datosGeneralesCurso),
                                                                        CAP_RespuestasMultiple: JSON.stringify(cursoCiertoFalso),
                                                                    },
                                                                    success: function (respuesta) {
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if (dat1 == "CEDULA") {
                                                                            if (dat2 > 0) {
                                                                                databaseHandler.db.transaction(function (tx7) {
                                                                                    tx7.executeSql(
                                                                                        "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                        [id_cedula],
                                                                                        function (tx7, results) {
                                                                                            $(".send-ced").css("pointer-events", "all");
                                                                                            localStorage.setItem("sendFlag", 0);
                                                                                            $("#li-" + item.id_cedula).remove();
                                                                                            swal("Enviado!", "", "success");
                                                                                            sincronizaDatosCapacitacion();
                                                                                        }
                                                                                    );
                                                                                });
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function () {
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all");
                                                                    },
                                                                });
                                                            },
                                                            function (tx, error) {
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function (error) {},
                                                    function () {}
                                                );
                                            },
                                            function (tx, error) {
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            } else if (item.geolocalizacion_salida == 5) {
                                var evidencias = new Array();
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        // id_evidencia integer primary key, id_cedula integer, evidencia blob, fecha
                                        tx.executeSql(
                                            "SELECT * FROM CAP_Evidencias WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                var length2 = results.rows.length;
                                                for (var i = 0; i < length2; i++) {
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    fechag = fechag.replace(" ", "T");
                                                    evidencias[i] = {
                                                        Valor: i,
                                                        fecha: fechag,
                                                        evidencia: item2.evidencia,
                                                    };
                                                }
                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function (tx, results) {
                                                                var length = results.rows.length;
                                                                for (var i = 0; i < length; i++) {
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    var promedio = 0;
                                                                    item1.apto == 1 ? (promedio = 100) : (promedio = 0);
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    datosGeneralesCurso[i] = {
                                                                        Valor: i,
                                                                        ID_AT: item1.ID_AT,
                                                                        Prueba: item1.Prueba,
                                                                        antecedentesManejo: item1.antecedentesManejo,
                                                                        costo: item1.costo,
                                                                        apto: item1.apto,
                                                                        edad: item1.edad,
                                                                        fecha: item1.fecha,
                                                                        fecha_captura: fecha_captura,
                                                                        firmaInstructor: item1.firmaInstructor,
                                                                        id_candidato: item1.id_candidato,
                                                                        id_course: item1.id_course,
                                                                        id_instructor: item1.id_instructor,
                                                                        name_course: item1.name_course,
                                                                        nombreCandidato: item1.nombreCandidato,
                                                                        nombreInstructor: item1.nombreInstructor,
                                                                        observaciones: item1.observaciones,
                                                                        telCelular: item1.telCelular,
                                                                        promedio: promedio,
                                                                    };
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async: true,
                                                                    url: url + "/capacitacion/guardarCursoEvidencias.php",
                                                                    dataType: "html",
                                                                    data: {
                                                                        datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                        datosGeneralesCurso: JSON.stringify(datosGeneralesCurso),
                                                                        evidencias: JSON.stringify(evidencias),
                                                                    },
                                                                    success: function (respuesta) {
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if (dat1 == "CEDULA") {
                                                                            if (dat2 > 0) {
                                                                                databaseHandler.db.transaction(function (tx7) {
                                                                                    tx7.executeSql(
                                                                                        "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                        [id_cedula],
                                                                                        function (tx7, results) {
                                                                                            $(".send-ced").css("pointer-events", "all");
                                                                                            localStorage.setItem("sendFlag", 0);
                                                                                            $("#li-" + item.id_cedula).remove();
                                                                                            swal("Enviado!", "", "success");
                                                                                            sincronizaDatosCapacitacion();
                                                                                        }
                                                                                    );
                                                                                });
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function () {
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all");
                                                                    },
                                                                });
                                                            },
                                                            function (tx, error) {
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function (error) {},
                                                    function () {}
                                                );
                                            },
                                            function (tx, error) {
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            }
                        }
                    } else if (tipo == "tecnologiasHmo") {
                        var DesTechHeader = new Array();
                        var DesTechDetails = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT IdHeader, credencial, REPLACE(fecha_fin, ' ', 'T') as fecha_fin, REPLACE(fecha_inicio, ' ', 'T') as fecha_inicio, id_cedula, id_operador, id_unidad, observaciones, operador, unidad FROM DesTechHeader WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item3 = results.rows.item(i);
                                            DesTechHeader[i] = item3;
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM DesTechDetails WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            DesTechDetails[i] = item2;
                                                        }
                                                        console.log(datosCedulaGeneral);
                                                        console.log(DesTechHeader);
                                                        console.log(DesTechDetails);
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/tecnologiasHmo/guardarTecHmo.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                DesTechHeader: JSON.stringify(DesTechHeader),
                                                                DesTechDetails: JSON.stringify(DesTechDetails),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "Relevos") {
                        var Relevos = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT Eco, EcoE, FKUnidad, FKUnidadE, FkUsuarioMov, FkUsuarioMovE, IDEntra, IDSale, ID_personal, ID_personalE, UsuarioMov, UsuarioMovE, claveEmpleado, claveEmpleadoE, REPLACE(fechaEntrada, ' ', 'T') as fechaEntrada, REPLACE(fechaSalida, ' ', 'T') as fechaSalida, fullName, fullNameE, id_cedula, id_relevo, jornada, jornadaE, linea, lineaE, tipoCedula FROM Relevos WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            Relevos[i] = item1;
                                        }
                                        console.log(datosCedulaGeneral);
                                        console.log(Relevos);
                                        $.ajax({
                                            type: "POST",
                                            async: true,
                                            url: url + "/Relevos/guardarRelevos.php",
                                            dataType: "html",
                                            data: {
                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                Relevos: JSON.stringify(Relevos),
                                            },
                                            success: function (respuesta) {
                                                var respu1 = respuesta.split("._.");
                                                var dat1 = respu1[0];
                                                var dat2 = respu1[1];
                                                if (dat1 == "CEDULA") {
                                                    if (dat2 > 0) {
                                                        databaseHandler.db.transaction(function (tx7) {
                                                            tx7.executeSql(
                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                [id_cedula],
                                                                function (tx7, results) {
                                                                    sincronizaDatosRelevos();
                                                                    $(".send-ced").css("pointer-events", "all");
                                                                    localStorage.setItem("sendFlag", 0);
                                                                    $("#li-" + item.id_cedula).remove();
                                                                    swal("Enviado!", "", "success");
                                                                }
                                                            );
                                                        });
                                                    }
                                                } else {
                                                    AlmacenarError(respuesta);
                                                }
                                            },
                                            error: function () {
                                                console.log("Error en la comunicacion");
                                                swal("Fallo el envío, por conexión!", "", "error");
                                                $(".send-ced").css("pointer-events", "all");
                                            },
                                        });
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "InsEncierro") {
                        if (item.nombre_cliente == "Campaña") {
                            let IEN_Header = new Array();
                            let IEN_Details = new Array();
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "SELECT *, REPLACE(fechaFin, ' ', 'T') as fechaFin2, REPLACE(fechaInicio, ' ', 'T') as fechaInicio2 FROM IEN_Header WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var length = results.rows.length;
                                            for (var i = 0; i < length; i++) {
                                                var item3 = results.rows.item(i);
                                                IEN_Header[i] = item3;
                                            }
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT * FROM IEN_Details WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var length = results.rows.length;
                                                            for (var i = 0; i < length; i++) {
                                                                var item2 = results.rows.item(i);
                                                                IEN_Details[i] = item2;
                                                            }
                                                            console.log(datosCedulaGeneral);
                                                            console.log(IEN_Header);
                                                            console.log(IEN_Details);
                                                            $.ajax({
                                                                type: "POST",
                                                                async: true,
                                                                url: url + "/InsEncierro/guardarInsEncierro.php",
                                                                dataType: "html",
                                                                data: {
                                                                    datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                    IEN_Header: JSON.stringify(IEN_Header),
                                                                    IEN_Details: JSON.stringify(IEN_Details),
                                                                },
                                                                success: function (respuesta) {
                                                                    var respu1 = respuesta.split("._.");
                                                                    var dat1 = respu1[0];
                                                                    var dat2 = respu1[1];
                                                                    if (dat1 == "CEDULA") {
                                                                        if (dat2 > 0) {
                                                                            databaseHandler.db.transaction(function (tx7) {
                                                                                tx7.executeSql(
                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                    [id_cedula],
                                                                                    function (tx7, results) {
                                                                                        $(".send-ced").css("pointer-events", "all");
                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                        $("#li-" + item.id_cedula).remove();
                                                                                        swal("Enviado!", "", "success");
                                                                                    }
                                                                                );
                                                                            });
                                                                        }
                                                                    } else {
                                                                        AlmacenarError(respuesta);
                                                                    }
                                                                },
                                                                error: function () {
                                                                    console.log("Error en la comunicacion");
                                                                    swal("Fallo el envío, por conexión!", "", "error");
                                                                    $(".send-ced").css("pointer-events", "all");
                                                                },
                                                            });
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        },
                                        function (tx, error) {
                                            console.log("Error al consultar: " + error.message);
                                        }
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        }
                    } else if (tipo == "InsLavado") {
                        if (item.geolocalizacion_entrada == "1") {
                            let IEN_HeaderLavado = new Array();
                            let IEN_ProgramacionLavado = new Array();
                            let IEN_EvidenciasLavado = new Array();
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "SELECT *, REPLACE(fechaFin, ' ', 'T') as fechaFin2, REPLACE(fechaInicio, ' ', 'T') as fechaInicio2 FROM IEN_HeaderLavado WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var length = results.rows.length;
                                            for (var i = 0; i < length; i++) {
                                                var item3 = results.rows.item(i);
                                                IEN_HeaderLavado[i] = item3;
                                            }
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT * FROM IEN_ProgramacionLavado WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var length = results.rows.length;
                                                            for (var i = 0; i < length; i++) {
                                                                var item2 = results.rows.item(i);
                                                                IEN_ProgramacionLavado[i] = item2;
                                                            }
                                                            databaseHandler.db.transaction(
                                                                function (tx) {
                                                                    tx.executeSql(
                                                                        "SELECT *, REPLACE(fecha, ' ', 'T') as fecha2 FROM IEN_EvidenciasLavado WHERE id_cedula = ?",
                                                                        [id_cedula],
                                                                        function (tx, results) {
                                                                            var length = results.rows.length;
                                                                            for (var i = 0; i < length; i++) {
                                                                                var item4 = results.rows.item(i);
                                                                                IEN_EvidenciasLavado[i] = item4;
                                                                            }
                                                                            console.log(datosCedulaGeneral);
                                                                            console.log(IEN_HeaderLavado);
                                                                            console.log(IEN_ProgramacionLavado);
                                                                            console.log(IEN_EvidenciasLavado);

                                                                            $.ajax({
                                                                                type: "POST",
                                                                                async: true,
                                                                                url: url + "/InsLavado/guardarInsLavado.php",
                                                                                dataType: "html",
                                                                                data: {
                                                                                    datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                                    IEN_HeaderLavado: JSON.stringify(IEN_HeaderLavado),
                                                                                    IEN_ProgramacionLavado: JSON.stringify(IEN_ProgramacionLavado),
                                                                                    IEN_EvidenciasLavado: JSON.stringify(IEN_EvidenciasLavado),
                                                                                },
                                                                                success: function (respuesta) {
                                                                                    var respu1 = respuesta.split("._.");
                                                                                    var dat1 = respu1[0];
                                                                                    var dat2 = respu1[1];
                                                                                    if (dat1 == "CEDULA") {
                                                                                        if (dat2 > 0) {
                                                                                            databaseHandler.db.transaction(function (tx7) {
                                                                                                tx7.executeSql(
                                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                                    [id_cedula],
                                                                                                    function (tx7, results) {
                                                                                                        $(".send-ced").css("pointer-events", "all");
                                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                                        $("#li-" + item.id_cedula).remove();
                                                                                                        swal("Enviado!", "", "success");
                                                                                                    }
                                                                                                );
                                                                                            });
                                                                                        }
                                                                                    } else {
                                                                                        AlmacenarError(respuesta);
                                                                                    }
                                                                                },
                                                                                error: function () {
                                                                                    console.log("Error en la comunicacion");
                                                                                    swal("Fallo el envío, por conexión!", "", "error");
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                },
                                                                            });
                                                                        },
                                                                        function (tx, error) {
                                                                            console.log("Error al consultar: " + error.message);
                                                                        }
                                                                    );
                                                                },
                                                                function (error) {},
                                                                function () {}
                                                            );
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        },
                                        function (tx, error) {
                                            console.log("Error al consultar: " + error.message);
                                        }
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        } else if (item.geolocalizacion_entrada == "2") {
                            let IEN_HeaderResultadoLavado = new Array();
                            let IEN_ResultadoLavado = new Array();
                            let IEN_EvidenciasLavado = new Array();
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "SELECT *, REPLACE(fechaFin, ' ', 'T') as fechaFin2, REPLACE(fechaInicio, ' ', 'T') as fechaInicio2 FROM IEN_HeaderResultadoLavado WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var length = results.rows.length;
                                            for (var i = 0; i < length; i++) {
                                                var item3 = results.rows.item(i);
                                                IEN_HeaderResultadoLavado[i] = item3;
                                            }
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT * FROM IEN_ResultadoLavado WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var length = results.rows.length;
                                                            for (var i = 0; i < length; i++) {
                                                                var item2 = results.rows.item(i);
                                                                IEN_ResultadoLavado[i] = item2;
                                                            }
                                                            databaseHandler.db.transaction(
                                                                function (tx) {
                                                                    tx.executeSql(
                                                                        "SELECT *, REPLACE(fecha, ' ', 'T') as fecha2 FROM IEN_EvidenciasLavado WHERE id_cedula = ?",
                                                                        [id_cedula],
                                                                        function (tx, results) {
                                                                            var length = results.rows.length;
                                                                            for (var i = 0; i < length; i++) {
                                                                                var item4 = results.rows.item(i);
                                                                                IEN_EvidenciasLavado[i] = item4;
                                                                            }
                                                                            console.log(datosCedulaGeneral);
                                                                            console.log(IEN_HeaderResultadoLavado);
                                                                            console.log(IEN_ResultadoLavado);
                                                                            console.log(IEN_EvidenciasLavado);

                                                                            $.ajax({
                                                                                type: "POST",
                                                                                async: true,
                                                                                url: url + "/InsLavado/guardarResultadoLavado.php",
                                                                                dataType: "html",
                                                                                data: {
                                                                                    datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                                    IEN_HeaderResultadoLavado:
                                                                                        JSON.stringify(IEN_HeaderResultadoLavado),
                                                                                    IEN_ResultadoLavado: JSON.stringify(IEN_ResultadoLavado),
                                                                                    IEN_EvidenciasLavado: JSON.stringify(IEN_EvidenciasLavado),
                                                                                },
                                                                                success: function (respuesta) {
                                                                                    var respu1 = respuesta.split("._.");
                                                                                    var dat1 = respu1[0];
                                                                                    var dat2 = respu1[1];
                                                                                    if (dat1 == "CEDULA") {
                                                                                        if (dat2 > 0) {
                                                                                            databaseHandler.db.transaction(function (tx7) {
                                                                                                tx7.executeSql(
                                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                                    [id_cedula],
                                                                                                    function (tx7, results) {
                                                                                                        $(".send-ced").css("pointer-events", "all");
                                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                                        $("#li-" + item.id_cedula).remove();
                                                                                                        swal("Enviado!", "", "success");
                                                                                                    }
                                                                                                );
                                                                                            });
                                                                                        }
                                                                                    } else {
                                                                                        AlmacenarError(respuesta);
                                                                                    }
                                                                                },
                                                                                error: function () {
                                                                                    console.log("Error en la comunicacion");
                                                                                    swal("Fallo el envío, por conexión!", "", "error");
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                },
                                                                            });
                                                                        },
                                                                        function (tx, error) {
                                                                            console.log("Error al consultar: " + error.message);
                                                                        }
                                                                    );
                                                                },
                                                                function (error) {},
                                                                function () {}
                                                            );
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        },
                                        function (tx, error) {
                                            console.log("Error al consultar: " + error.message);
                                        }
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        } else if (item.geolocalizacion_entrada == "3") {
                            let IEN_HeaderResultadoLavado = new Array();
                            let IEN_ResultadoLavado = new Array();
                            let IEN_EvidenciasLavado = new Array();
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "SELECT *, REPLACE(fechaFin, ' ', 'T') as fechaFin2, REPLACE(fechaInicio, ' ', 'T') as fechaInicio2 FROM IEN_HeaderResultadoLavado WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var length = results.rows.length;
                                            for (var i = 0; i < length; i++) {
                                                var item3 = results.rows.item(i);
                                                IEN_HeaderResultadoLavado[i] = item3;
                                            }
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT * FROM IEN_ResultadoLavado WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var length = results.rows.length;
                                                            for (var i = 0; i < length; i++) {
                                                                var item2 = results.rows.item(i);
                                                                IEN_ResultadoLavado[i] = item2;
                                                            }
                                                            databaseHandler.db.transaction(
                                                                function (tx) {
                                                                    tx.executeSql(
                                                                        "SELECT *, REPLACE(fecha, ' ', 'T') as fecha2 FROM IEN_EvidenciasLavado WHERE id_cedula = ?",
                                                                        [id_cedula],
                                                                        function (tx, results) {
                                                                            var length = results.rows.length;
                                                                            for (var i = 0; i < length; i++) {
                                                                                var item4 = results.rows.item(i);
                                                                                IEN_EvidenciasLavado[i] = item4;
                                                                            }
                                                                            console.log(datosCedulaGeneral);
                                                                            console.log(IEN_HeaderResultadoLavado);
                                                                            console.log(IEN_ResultadoLavado);
                                                                            console.log(IEN_EvidenciasLavado);

                                                                            $.ajax({
                                                                                type: "POST",
                                                                                async: true,
                                                                                url: url + "/InsLavado/guardarEvaluacionLavado.php",
                                                                                dataType: "html",
                                                                                data: {
                                                                                    datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                                    IEN_HeaderResultadoLavado:
                                                                                        JSON.stringify(IEN_HeaderResultadoLavado),
                                                                                    IEN_ResultadoLavado: JSON.stringify(IEN_ResultadoLavado),
                                                                                    IEN_EvidenciasLavado: JSON.stringify(IEN_EvidenciasLavado),
                                                                                },
                                                                                success: function (respuesta) {
                                                                                    var respu1 = respuesta.split("._.");
                                                                                    var dat1 = respu1[0];
                                                                                    var dat2 = respu1[1];
                                                                                    if (dat1 == "CEDULA") {
                                                                                        if (dat2 > 0) {
                                                                                            databaseHandler.db.transaction(function (tx7) {
                                                                                                tx7.executeSql(
                                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                                    [id_cedula],
                                                                                                    function (tx7, results) {
                                                                                                        $(".send-ced").css("pointer-events", "all");
                                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                                        $("#li-" + item.id_cedula).remove();
                                                                                                        swal("Enviado!", "", "success");
                                                                                                    }
                                                                                                );
                                                                                            });
                                                                                        }
                                                                                    } else {
                                                                                        AlmacenarError(respuesta);
                                                                                    }
                                                                                },
                                                                                error: function () {
                                                                                    console.log("Error en la comunicacion");
                                                                                    swal("Fallo el envío, por conexión!", "", "error");
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                },
                                                                            });
                                                                        },
                                                                        function (tx, error) {
                                                                            console.log("Error al consultar: " + error.message);
                                                                        }
                                                                    );
                                                                },
                                                                function (error) {},
                                                                function () {}
                                                            );
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        },
                                        function (tx, error) {
                                            console.log("Error al consultar: " + error.message);
                                        }
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        }
                    } else if (tipo == "Diesel") {
                        var detalle_diesel = new Array();
                        var datos_generales_diesel = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM datos_generales_diesel WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            let fecha_corta = item1.fecha_corta;
                                            let fecha = item1.fecha.replace(" ", "T");
                                            let fecha_fin = item1.fecha_fin.replace(" ", "T");
                                            let fecha_envio = getDateWhitZeros();
                                            fecha_envio = fecha_envio.replace(" ", "T");
                                            datos_generales_diesel[i] = {
                                                Valor: i,
                                                fecha: fecha,
                                                fecha_corta: fecha_corta,
                                                id_usuario: item1.id_usuario,
                                                nombre_usuario: item1.nombre_usuario,
                                                id_empresa: item1.id_empresa,
                                                carga_total: item1.carga_total,
                                                total_unidades: item1.total_unidades,
                                                unidades_cargadas: item1.unidades_cargadas,
                                                promedio: item1.promedio,
                                                origen: item1.origen,
                                                fecha_fin: fecha_fin,
                                                nombre_empresa: NombreEmpresa(item1.id_empresa),
                                                fecha_envio: fecha_envio,
                                                personal: item1.personal,
                                                ID_Personal: item1.ID_Personal,
                                                personal2: item1.personal2,
                                                ID_Personal2: item1.ID_Personal2,
                                                carga_def: item1.carga_def,
                                                carga_def2: item1.carga_def2,
                                                bomba_def: item1.bomba_def,
                                                bomba_def2: item1.bomba_def2,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM detalle_diesel WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            let fecha_carga = item2.fecha_carga.replace(" ", "T");
                                                            detalle_diesel[i] = {
                                                                Valor: i,
                                                                id_unidad: item2.id_unidad,
                                                                totalizador: item2.totalizador,
                                                                eco: item2.eco,
                                                                eco: item2.eco,
                                                                carga_total: item2.carga_total,
                                                                odometro: item2.odometro,
                                                                fecha_carga: fecha_carga,
                                                                no_bomba: item2.no_bomba,
                                                                almacen: item2.almacen,
                                                                id_operador: item2.id_operador,
                                                                operador: item2.operador,
                                                                jornada: item2.jornada,
                                                                vueltas: item2.vueltas,
                                                                h_inicio: item2.h_inicio,
                                                                h_fin: item2.h_fin,
                                                                tipo_carga: item2.tipo_carga,
                                                                operador2: item2.operador2,
                                                                VIN: item2.VIN,
                                                                comentarios: item2.comentarios,
                                                                Id_Empresa: item2.Id_Empresa,
                                                                id_operador1: item2.id_operador1,
                                                                operador1: item2.operador1,
                                                                operador11: item2.operador11,
                                                            };
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/guardarDiesel.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                detalle_diesel: JSON.stringify(detalle_diesel),
                                                                datos_generales_diesel: JSON.stringify(datos_generales_diesel),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                },
                function (tx, error) {
                    console.log("Error al consultar datos generales: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function EliminarRegistrosAntiguos() {
    var fecha = new Date();
    var fecha_ingreso = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    fecha_eliminar = editar_fecha(fecha_ingreso, "-11", "d", "-");
    //console.log(fecha_eliminar);
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT * FROM cedulas_general WHERE fecha_entrada > ?",
                [fecha_eliminar],
                function (tx5, results) {
                    var length = results.rows.length;
                    for (var i = 0; i < length; i++) {
                        var item2 = results.rows.item(i);
                        var id_eliminar = item2.id_cedula;
                        var tipo_cedula = item2.tipo_cedula;
                        databaseHandler.db.transaction(
                            function (tx4) {
                                tx4.executeSql(
                                    "DELETE FROM cedulas_general WHERE id_cedula = ?",
                                    [id_eliminar],
                                    function (tx4, results) {},
                                    function (tx4, error) {
                                        console.error("Error al eliminar cedula_general: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                        if (tipo_cedula == "Capacitación") {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM datosGeneralesCurso WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM cursoCiertoFalso WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM asistenciaHeader WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM asistenciaDetails WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM CAP_RespuestasMultiple WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM CAP_OPMultipleOpts WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM CAP_Evidencias WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        } else if (tipo_cedula == "tecnologiasHmo") {
                            $("#conc" + id_cedula).remove();
                            swal("", "Eliminado correctamente", "success");
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM DesTechDetails WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM DesTechHeader WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            // databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM DesTecFirmas WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                        } else if (tipo_cedula == "InsEncierro") {
                            $("#conc" + id_cedula).remove();
                            swal("", "Eliminado correctamente", "success");
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM IEN_Header WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "DELETE FROM IEN_Details WHERE id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {},
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                            // databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM DesTecFirmas WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                        }
                    }
                },
                function (tx5, error) {
                    console.log("Error al depurar registros: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function EliminarReg(id_cedula, tipo_cedula) {
    console.log(id_cedula, tipo_cedula);
    swal({
        title: "Aviso",
        text: "Estas apunto de eliminar todos los datos de este registro, ¿Estas seguro continuar con la acción?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willGoBack) => {
        if (willGoBack) {
            var empresa = localStorage.getItem("nombre_empresa");
            // console.log(empresa,id_cedula,tipo_cedula);
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "DELETE FROM cedulas_general WHERE id_cedula = ?",
                        [id_cedula],
                        function (tx, results) {},
                        function (tx, error) {}
                    );
                },
                function (error) {},
                function () {}
            );
            if (tipo_cedula == "checklist") {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM checklist WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM datos_generales_checklist WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                $("#conc" + id_cedula).remove();
                                                swal("", "Eliminado correctamente", "success");
                                            },
                                            function (tx, error) {
                                                // swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            },
                            function (tx, error) {
                                console.log("Error al eliminar" + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "Capacitación") {
                $("#conc" + id_cedula).remove();
                swal("", "Eliminado correctamente", "success");
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM datosGeneralesCurso WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM cursoCiertoFalso WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM asistenciaHeader WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM asistenciaDetails WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM CAP_RespuestasMultiple WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM CAP_OPMultipleOpts WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM CAP_Evidencias WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "tecnologiasHmo") {
                $("#conc" + id_cedula).remove();
                swal("", "Eliminado correctamente", "success");
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM DesTechDetails WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM DesTechHeader WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                // databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM DesTecFirmas WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
            } else if (tipo_cedula == "InsEncierro") {
                $("#conc" + id_cedula).remove();
                swal("", "Eliminado correctamente", "success");
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_Header WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_Details WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "InsLavado") {
                $("#conc" + id_cedula).remove();
                swal("", "Eliminado correctamente", "success");
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_ProgramacionLavado WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_HeaderLavado WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_ResultadoLavado WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM IEN_HeaderResultadoLavado WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "Diesel") {
                $("#conc" + id_cedula).remove();
                swal("", "Eliminado correctamente", "success");
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM datos_generales_diesel WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
                            function (tx, error) {}
                        );
                    },
                    function (error) {},
                    function () {}
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM detalle_diesel WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {},
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
