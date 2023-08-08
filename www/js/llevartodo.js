function AlmacenarError(respuesta, tipo){
    $(".send-ced").css("pointer-events", "all")
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    var versionapp = localStorage.getItem("version");
    var fechaApp = getDateWhitZeros();
    
    fechaApp = fechaApp.replace(" ", "T");
    datos[0] = {'id_usario':id_usuario,'id_empresa':id_empresa,'respuesta':respuesta,'versionapp':versionapp, 'fechaApp':fechaApp, 'tipo':tipo};
    $.ajax({
        type: "POST",
        async : true,
        url: url+"/guardarErrorRespuesta.php",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta == 1){
                //swal("","No se pudo completar el registro","warning");
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
        }
    });
}
function llevarTodo(id_cedula,tipo_cedula){
    localStorage.setItem("sendFlag", 1);
    $(".send-ced").css("pointer-events", "none");
    var url = localStorage.getItem("url");
    console.log(id_cedula, tipo_cedula)
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
        function(tx){
            tx.executeSql("SELECT * FROM cedulas_general WHERE id_cedula = ?",
                [id_cedula],
                function(tx, results){
                    var length = results.rows.length;
                    for(var i = 0; i< length; i++){
                        var item = results.rows.item(i);
                        tipo = item.tipo_cedula;
                        fecha_envio =  fecha_envio.replace(" ", "T");
                        var fecha_entrada = item.fecha_entrada;
                        fecha_entrada = fecha_entrada.replace(" ", "T");
                        var fecha_salida = item.fecha_salida;
                        fecha_salida = fecha_salida.replace(" ", "T");
                        datosCedulaGeneral[i] = {'Valor':i,'id_cedula':item.id_cedula,'tipo_cedula':item.tipo_cedula,'id_usuario':item.id_usuario,'nombre_usuario':item.nombre_usuario,'fecha_entrada':fecha_entrada,'geolocalizacion_entrada': item.geolocalizacion_entrada,'id_cliente': item.id_cliente,'nombre_cliente': item.nombre_cliente,'horario_programado': item.horario_programado,'calificacion': 0,'fecha_salida':fecha_salida,'geolocalizacion_salida':item.geolocalizacion_salida,'nombre_evalua':item.nombre_evalua,'comentario_cliente':item.comentario_cliente,'fecha_envio':fecha_envio};
                    }
                    if(tipo == "checklist"){
                        databaseHandler.db.transaction(
                            function(tx){
                                tx.executeSql("SELECT * FROM checklist WHERE id_cedula = ?",
                                    [id_cedula],
                                    function(tx, results){
                                        var length = results.rows.length;
                                        for(var i = 0; i< length; i++){
                                            var item1 = results.rows.item(i);
                                            checklist[i] = {'Valor':i,'id_pregunta':item1.id_pregunta, 'revision':item1.revision, 'nombre_fase':item1.nombre_fase, 'int_ext':item1.int_ext, 'id_fase':item1.id_fase, 'obligatorio':item1.obligatorio, 'no_pregunta':item1.no_pregunta, 'respuesta':item1.respuesta, 'modelo':item1.modelo, 'comentarios':item1.comentarios, 'multiple':item1.multiple};
                                        }
                                        databaseHandler.db.transaction(
                                            function(tx){
                                                tx.executeSql("SELECT * FROM datos_generales_checklist WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function(tx, results){
                                                        var length = results.rows.length;
                                                        for(var i = 0; i< length; i++){
                                                            var item2 = results.rows.item(i);
                                                            datos_generales_checklist[i] = {'Valor':i, 'Unidad':item2.Unidad, 'Chasis':item2.Chasis, 'Familia':item2.Familia, 'marca':item2.marca, 'Empresa':item2.Empresa, 'FK_id_unidad':item2.FK_id_unidad, 'id_unidad_vs':item2.id_unidad_vs, 'FK_id_empresa':item2.FK_id_empresa, 'id_modelo_check':item2.id_modelo_check, 'comentarios_generales':item2.comentarios_generales, 'fecha_revision':item2.fecha_revision};
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async : true,
                                                            url: url+"/guardarRevImgCheklist.php",
                                                            dataType: 'html',
                                                            data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                            'checklist': JSON.stringify(checklist),
                                                            'datos_generales_checklist': JSON.stringify(datos_generales_checklist)},
                                                            success: function(respuesta){
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if(dat1 == "CEDULA"){
                                                                    if(dat2 > 0){
                                                                        databaseHandler.db.transaction(
                                                                            function(tx7){
                                                                                tx7.executeSql(
                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                    [id_cedula],
                                                                                    function(tx7, results){
                                                                                        $(".send-ced").css("pointer-events", "all");
                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                        $("#li-"+item.id_cedula).remove();
                                                                                        swal("Enviado!", "", "success");
                                                                                    }
                                                                                );
                                                                            }
                                                                        );
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function(){
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all")
                                                            }
                                                        });
                                                    },
                                                    function(tx, error){
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    } else if (tipo == "Capacitación"){
                        var datosGeneralesCurso = new Array();
                        var cursoCiertoFalso = new Array();
                        if(item.nombre_evalua == 'Prueba Manejo'){
                            databaseHandler.db.transaction(
                                function(tx){
                                    tx.executeSql("SELECT * FROM cursoCiertoFalso WHERE id_cedula = ?",
                                        [id_cedula],
                                        function(tx, results){
                                            var length2 = results.rows.length;
                                            var correctas = 0;
                                            for(var i = 0; i< length2; i++){
                                                var item2 = results.rows.item(i);
                                                var fechag = item2.fecha;
                                                item2.OpCorrecta == item2.Respuesta ? correctas = correctas + 1: null;
                                                fechag = fechag.replace(" ", "T");
                                                cursoCiertoFalso[i] = {'Valor':i, 'IDCurso': item2.IDCurso, 'IDPregunta': item2.IDPregunta, 'OpCorrecta': item2.OpCorrecta, 'Pregunta': item2.Pregunta, 'Respuesta': item2.Respuesta, 'fecha': fechag};
                                            }
                                            var promedio = getPromedio(correctas,length2);
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function(tx, results){
                                                            var length = results.rows.length;
                                                            for(var i = 0; i< length; i++){
                                                                var item1 = results.rows.item(i);
                                                                var fecha_captura = item1.fecha_captura;
                                                                fecha_captura = fecha_captura.replace(" ", "T");
                                                                datosGeneralesCurso[i] = {'Valor':i,'ID_AT':item1.ID_AT, 'Prueba': item1.Prueba, 'antecedentesManejo': item1.antecedentesManejo, 'costo':item1.costo, 'apto': item1.apto, 'edad': item1.edad, 'fecha': item1.fecha, 'fecha_captura': fecha_captura, 'firmaInstructor': item1.firmaInstructor, 'id_candidato': item1.id_candidato, 'id_course': item1.id_course, 'id_instructor': item1.id_instructor, 'name_course': item1.name_course, 'nombreCandidato': item1.nombreCandidato, 'nombreInstructor': item1.nombreInstructor, 'observaciones': item1.observaciones, 'telCelular': item1.telCelular, 'promedio':promedio};
                                                            }
                                                            $.ajax({
                                                                type: "POST",
                                                                async : true,
                                                                url: url+"/capacitacion/guardarCursoManejo.php",
                                                                dataType: 'html',
                                                                data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                'datosGeneralesCurso': JSON.stringify(datosGeneralesCurso),
                                                                'cursoCiertoFalso': JSON.stringify(cursoCiertoFalso)},
                                                                success: function(respuesta){
                                                                    var respu1 = respuesta.split("._.");
                                                                    var dat1 = respu1[0];
                                                                    var dat2 = respu1[1];
                                                                    if(dat1 == "CEDULA"){
                                                                        if(dat2 > 0){
                                                                            databaseHandler.db.transaction(
                                                                                function(tx7){
                                                                                    tx7.executeSql(
                                                                                        "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                        [id_cedula],
                                                                                        function(tx7, results){
                                                                                            $(".send-ced").css("pointer-events", "all");
                                                                                            localStorage.setItem("sendFlag", 0);
                                                                                            $("#li-"+item.id_cedula).remove();
                                                                                            swal("Enviado!", "", "success");
                                                                                            sincronizaDatosCapacitacion();
                                                                                        }
                                                                                    );
                                                                                }
                                                                            );
                                                                        }
                                                                    } else {
                                                                        AlmacenarError(respuesta);
                                                                    }
                                                                },
                                                                error: function(){
                                                                    console.log("Error en la comunicacion");
                                                                    swal("Fallo el envío, por conexión!", "", "error");
                                                                    $(".send-ced").css("pointer-events", "all")
                                                                }
                                                            });
                                                        },
                                                        function(tx, error){
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function(error){},
                                                function(){}
                                            );
                                        },
                                        function(tx, error){
                                            console.log("Error al consultar: " + error.message);
                                        }
                                    );
                                },
                                function(error){},
                                function(){}
                            );
                        } else {
                            if(item.geolocalizacion_salida == 0){
                                var asistenciaHeader = new Array();
                                var asistenciaDetails = new Array();
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("SELECT * FROM asistenciaHeader WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                var length2 = results.rows.length;
                                                for(var i = 0; i< length2; i++){
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fechaCaptura;
                                                    fechag = fechag.replace(" ", "T");
                                                    asistenciaHeader[i] = {'Valor':i, 'fecha': item2.fecha, 'fechaCaptura': fechag, 'IDusuario': item2.id_usuario, 'nameUsuario': item2.nameUsuario};
                                                }
                                                databaseHandler.db.transaction(
                                                    function(tx){
                                                        tx.executeSql("SELECT * FROM asistenciaDetails WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function(tx, results){
                                                                var length = results.rows.length;
                                                                for(var i = 0; i< length; i++){
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fechaCaptura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    asistenciaDetails[i] = {'Valor':i,'asiste':item1.asiste,'claveBecario': item1.claveBecario, 'fecha': item1.fecha, 'fechaCaptura': fecha_captura, 'id_becario': item1.id_becario, 'nameBecario': item1.nameBecario};
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async : true,
                                                                    url: url+"/capacitacion/guardarListaAsistencia.php",
                                                                    dataType: 'html',
                                                                    data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                    'asistenciaHeader': JSON.stringify(asistenciaHeader),
                                                                    'asistenciaDetails': JSON.stringify(asistenciaDetails)},
                                                                    success: function(respuesta){
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if(dat1 == "CEDULA"){
                                                                            if(dat2 > 0){
                                                                                databaseHandler.db.transaction(
                                                                                    function(tx7){
                                                                                        tx7.executeSql(
                                                                                            "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                            [id_cedula],
                                                                                            function(tx7, results){
                                                                                                $(".send-ced").css("pointer-events", "all");
                                                                                                localStorage.setItem("sendFlag", 0);
                                                                                                $("#li-"+item.id_cedula).remove();
                                                                                                swal("Enviado!", "", "success");
                                                                                                sincronizaDatosCapacitacion();
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function(){
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all")
                                                                    }
                                                                });
                                                            },
                                                            function(tx, error){
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function(error){},
                                                    function(){}
                                                );
                                            },
                                            function(tx, error){
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function(error){},
                                    function(){}
                                );
                            } else if(item.geolocalizacion_salida == 1){
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("SELECT * FROM cursoCiertoFalso WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                var length2 = results.rows.length;
                                                var correctas = 0;
                                                for(var i = 0; i< length2; i++){
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    item2.OpCorrecta == item2.Respuesta ? correctas = correctas + 1: null;
                                                    fechag = fechag.replace(" ", "T");
                                                    cursoCiertoFalso[i] = {'Valor':i, 'IDCurso': item2.IDCurso, 'IDPregunta': item2.IDPregunta, 'OpCorrecta': item2.OpCorrecta, 'Pregunta': item2.Pregunta, 'Respuesta': item2.Respuesta, 'fecha': fechag};
                                                }
                                                var promedio = getPromedio(correctas,length2);
                                                databaseHandler.db.transaction(
                                                    function(tx){
                                                        tx.executeSql("SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function(tx, results){
                                                                var length = results.rows.length;
                                                                for(var i = 0; i< length; i++){
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    datosGeneralesCurso[i] = {'Valor':i,'ID_AT':item1.ID_AT,'Prueba': item1.Prueba,'antecedentesManejo': item1.antecedentesManejo, 'costo':item1.costo, 'apto': item1.apto, 'edad': item1.edad, 'fecha': item1.fecha, 'fecha_captura': fecha_captura, 'firmaInstructor': item1.firmaInstructor, 'id_candidato': item1.id_candidato, 'id_course': item1.id_course, 'id_instructor': item1.id_instructor, 'name_course': item1.name_course, 'nombreCandidato': item1.nombreCandidato, 'nombreInstructor': item1.nombreInstructor, 'observaciones': item1.observaciones, 'telCelular': item1.telCelular, 'promedio':promedio};
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async : true,
                                                                    url: url+"/capacitacion/guardarCiertoFalso.php",
                                                                    dataType: 'html',
                                                                    data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                    'datosGeneralesCurso': JSON.stringify(datosGeneralesCurso),
                                                                    'cursoCiertoFalso': JSON.stringify(cursoCiertoFalso)},
                                                                    success: function(respuesta){
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if(dat1 == "CEDULA"){
                                                                            if(dat2 > 0){
                                                                                databaseHandler.db.transaction(
                                                                                    function(tx7){
                                                                                        tx7.executeSql(
                                                                                            "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                            [id_cedula],
                                                                                            function(tx7, results){
                                                                                                $(".send-ced").css("pointer-events", "all");
                                                                                                localStorage.setItem("sendFlag", 0);
                                                                                                $("#li-"+item.id_cedula).remove();
                                                                                                swal("Enviado!", "", "success");
                                                                                                sincronizaDatosCapacitacion();
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function(){
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all")
                                                                    }
                                                                });
                                                            },
                                                            function(tx, error){
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function(error){},
                                                    function(){}
                                                );
                                            },
                                            function(tx, error){
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function(error){},
                                    function(){}
                                );
                            } else if(item.geolocalizacion_salida == 2){
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("SELECT * FROM CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                var length2 = results.rows.length;
                                                var correctas = 0;
                                                for(var i = 0; i< length2; i++){
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    item2.OpCorrecta == item2.Respuesta ? correctas = correctas + 1: null;
                                                    fechag = fechag.replace(" ", "T");
                                                    cursoCiertoFalso[i] = {'Valor':i, 'FK_IDCurso': item2.FK_IDCurso, 'FK_IDPregunta': item2.FK_IDPregunta, 'OpCorrecta': item2.OpCorrecta, 'Pregunta': item2.Pregunta, 'Respuesta': item2.Respuesta, 'fecha': fechag};
                                                }
                                                databaseHandler.db.transaction(
                                                    function(tx){
                                                        tx.executeSql("SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function(tx, results){
                                                                var length = results.rows.length;
                                                                for(var i = 0; i< length; i++){
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    var promedio = item1.promedio
                                                                    datosGeneralesCurso[i] = {'Valor':i,'ID_AT':item1.ID_AT,'Prueba': item1.Prueba,'antecedentesManejo': item1.antecedentesManejo,'costo':item1.costo, 'apto': item1.apto, 'edad': item1.edad, 'fecha': item1.fecha, 'fecha_captura': fecha_captura, 'firmaInstructor': item1.firmaInstructor, 'id_candidato': item1.id_candidato, 'id_course': item1.id_course, 'id_instructor': item1.id_instructor, 'name_course': item1.name_course, 'nombreCandidato': item1.nombreCandidato, 'nombreInstructor': item1.nombreInstructor, 'observaciones': item1.observaciones, 'telCelular': item1.telCelular, 'promedio':promedio};
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async : true,
                                                                    url: url+"/capacitacion/guardarSiNoPuntuacion.php",
                                                                    dataType: 'html',
                                                                    data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                    'datosGeneralesCurso': JSON.stringify(datosGeneralesCurso),
                                                                    'CAP_RespuestasSiNoPuntuacion': JSON.stringify(cursoCiertoFalso)},
                                                                    success: function(respuesta){
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if(dat1 == "CEDULA"){
                                                                            if(dat2 > 0){
                                                                                databaseHandler.db.transaction(
                                                                                    function(tx7){
                                                                                        tx7.executeSql(
                                                                                            "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                            [id_cedula],
                                                                                            function(tx7, results){
                                                                                                $(".send-ced").css("pointer-events", "all");
                                                                                                localStorage.setItem("sendFlag", 0);
                                                                                                $("#li-"+item.id_cedula).remove();
                                                                                                swal("Enviado!", "", "success");
                                                                                                sincronizaDatosCapacitacion();
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function(){
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all")
                                                                    }
                                                                });
                                                            },
                                                            function(tx, error){
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function(error){},
                                                    function(){}
                                                );
                                            },
                                            function(tx, error){
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function(error){},
                                    function(){}
                                );
                            } else if(item.geolocalizacion_salida == 3 || item.geolocalizacion_salida == 4){
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("SELECT * FROM CAP_RespuestasMultiple WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                var length2 = results.rows.length;
                                                var correctas = 0;
                                                for(var i = 0; i< length2; i++){
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    item2.OpCorrecta == item2.Respuesta ? correctas = correctas + 1: null;
                                                    fechag = fechag.replace(" ", "T");
                                                    cursoCiertoFalso[i] = {'Valor':i, 'FK_IDCurso': item2.FK_IDCurso, 'FK_IDPregunta': item2.FK_IDPregunta, 'Pregunta': item2.Pregunta, 'Respuesta': item2.Respuesta, 'fecha': fechag};
                                                }
                                                
                                                databaseHandler.db.transaction(
                                                    function(tx){
                                                        tx.executeSql("SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function(tx, results){
                                                                var length = results.rows.length;
                                                                for(var i = 0; i< length; i++){
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    var promedio = item1.promedio
                                                                    datosGeneralesCurso[i] = {'Valor':i,'ID_AT':item1.ID_AT,'Prueba': item1.Prueba,'antecedentesManejo': item1.antecedentesManejo,'costo':item1.costo, 'apto': item1.apto, 'edad': item1.edad, 'fecha': item1.fecha, 'fecha_captura': fecha_captura, 'firmaInstructor': item1.firmaInstructor, 'id_candidato': item1.id_candidato, 'id_course': item1.id_course, 'id_instructor': item1.id_instructor, 'name_course': item1.name_course, 'nombreCandidato': item1.nombreCandidato, 'nombreInstructor': item1.nombreInstructor, 'observaciones': item1.observaciones, 'telCelular': item1.telCelular, 'promedio':promedio};
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async : true,
                                                                    url: url+"/capacitacion/guardarOptsMultiples.php",
                                                                    dataType: 'html',
                                                                    data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                    'datosGeneralesCurso': JSON.stringify(datosGeneralesCurso),
                                                                    'CAP_RespuestasMultiple': JSON.stringify(cursoCiertoFalso)},
                                                                    success: function(respuesta){
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if(dat1 == "CEDULA"){
                                                                            if(dat2 > 0){
                                                                                databaseHandler.db.transaction(
                                                                                    function(tx7){
                                                                                        tx7.executeSql(
                                                                                            "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                            [id_cedula],
                                                                                            function(tx7, results){
                                                                                                $(".send-ced").css("pointer-events", "all");
                                                                                                localStorage.setItem("sendFlag", 0);
                                                                                                $("#li-"+item.id_cedula).remove();
                                                                                                swal("Enviado!", "", "success");
                                                                                                sincronizaDatosCapacitacion();
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function(){
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all")
                                                                    }
                                                                });
                                                            },
                                                            function(tx, error){
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function(error){},
                                                    function(){}
                                                );
                                            },
                                            function(tx, error){
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function(error){},
                                    function(){}
                                );
                            } else if(item.geolocalizacion_salida == 5){
                                var evidencias = new Array();
                                databaseHandler.db.transaction(
                                    function(tx){// id_evidencia integer primary key, id_cedula integer, evidencia blob, fecha
                                        tx.executeSql("SELECT * FROM CAP_Evidencias WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                var length2 = results.rows.length;
                                                for(var i = 0; i< length2; i++){
                                                    var item2 = results.rows.item(i);
                                                    var fechag = item2.fecha;
                                                    fechag = fechag.replace(" ", "T");
                                                    evidencias[i] = {'Valor':i, 'fecha': fechag, 'evidencia': item2.evidencia};
                                                }
                                                databaseHandler.db.transaction(
                                                    function(tx){
                                                        tx.executeSql("SELECT * FROM datosGeneralesCurso WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function(tx, results){
                                                                var length = results.rows.length;
                                                                for(var i = 0; i< length; i++){
                                                                    var item1 = results.rows.item(i);
                                                                    var fecha_captura = item1.fecha_captura;
                                                                    var promedio = 0
                                                                    item1.apto == 1 ? promedio = 100 : promedio = 0
                                                                    fecha_captura = fecha_captura.replace(" ", "T");
                                                                    datosGeneralesCurso[i] = {'Valor':i,'ID_AT':item1.ID_AT,'Prueba': item1.Prueba,'antecedentesManejo': item1.antecedentesManejo, 'costo':item1.costo, 'apto': item1.apto, 'edad': item1.edad, 'fecha': item1.fecha, 'fecha_captura': fecha_captura, 'firmaInstructor': item1.firmaInstructor, 'id_candidato': item1.id_candidato, 'id_course': item1.id_course, 'id_instructor': item1.id_instructor, 'name_course': item1.name_course, 'nombreCandidato': item1.nombreCandidato, 'nombreInstructor': item1.nombreInstructor, 'observaciones': item1.observaciones, 'telCelular': item1.telCelular, 'promedio':promedio};
                                                                }
                                                                $.ajax({
                                                                    type: "POST",
                                                                    async : true,
                                                                    url: url+"/capacitacion/guardarCursoEvidencias.php",
                                                                    dataType: 'html',
                                                                    data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                    'datosGeneralesCurso': JSON.stringify(datosGeneralesCurso),
                                                                    'evidencias': JSON.stringify(evidencias)},
                                                                    success: function(respuesta){
                                                                        var respu1 = respuesta.split("._.");
                                                                        var dat1 = respu1[0];
                                                                        var dat2 = respu1[1];
                                                                        if(dat1 == "CEDULA"){
                                                                            if(dat2 > 0){
                                                                                databaseHandler.db.transaction(
                                                                                    function(tx7){
                                                                                        tx7.executeSql(
                                                                                            "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                            [id_cedula],
                                                                                            function(tx7, results){
                                                                                                $(".send-ced").css("pointer-events", "all");
                                                                                                localStorage.setItem("sendFlag", 0);
                                                                                                $("#li-"+item.id_cedula).remove();
                                                                                                swal("Enviado!", "", "success");
                                                                                                sincronizaDatosCapacitacion();
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        } else {
                                                                            AlmacenarError(respuesta);
                                                                        }
                                                                    },
                                                                    error: function(){
                                                                        console.log("Error en la comunicacion");
                                                                        swal("Fallo el envío, por conexión!", "", "error");
                                                                        $(".send-ced").css("pointer-events", "all")
                                                                    }
                                                                });
                                                            },
                                                            function(tx, error){
                                                                console.log("Error al consultar: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function(error){},
                                                    function(){}
                                                );
                                            },
                                            function(tx, error){
                                                console.log("Error al consultar: " + error.message);
                                            }
                                        );
                                    },
                                    function(error){},
                                    function(){}
                                );
                            }
                        }
                    }
                },
                function(tx, error){
                    console.log("Error al consultar datos generales: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}
function EliminarRegistrosAntiguos(){
    var fecha = new Date();
    var fecha_ingreso = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate();
    fecha_eliminar = editar_fecha(fecha_ingreso, "-11", "d","-");
    //console.log(fecha_eliminar);
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM cedulas_general WHERE fecha_entrada > ?",
                [fecha_eliminar],
                function(tx5, results){
                    var length = results.rows.length;
                    for(var i = 0; i< length; i++){
                        var item2 = results.rows.item(i);
                        var id_eliminar = item2.id_cedula;
                        var tipo_cedula = item2.tipo_cedula;
                        databaseHandler.db.transaction( function(tx4){ tx4.executeSql("DELETE FROM cedulas_general WHERE id_cedula = ?", [id_eliminar], function(tx4, results){ }, function(tx4, error){ console.error("Error al eliminar cedula_general: " + error.message); } ); }, function(error){}, function(){} );
                        if(tipo_cedula == "Capacitación") {
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM datosGeneralesCurso WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM cursoCiertoFalso WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM asistenciaHeader WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM asistenciaDetails WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_RespuestasMultiple WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_OPMultipleOpts WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                            databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_Evidencias WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                        }
                    }
                },
                function(tx5, error){
                    console.log("Error al depurar registros: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}
function EliminarReg(id_cedula,tipo_cedula){
    swal({
        title: "Aviso",
        text: "Estas apunto de eliminar todos los datos de este registro, ¿Estas seguro continuar con la acción?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willGoBack) => {
        if (willGoBack){
            var empresa = localStorage.getItem("nombre_empresa");               
            // console.log(empresa,id_cedula,tipo_cedula);
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("DELETE FROM cedulas_general WHERE id_cedula = ?",
                        [id_cedula],
                        function(tx, results){},
                        function(tx, error){}
                    );
                },function(error){},function(){}
            );
            if(tipo_cedula == "checklist"){
                databaseHandler.db.transaction(
                    function(tx){
                        tx.executeSql("DELETE FROM checklist WHERE id_cedula = ?",
                            [id_cedula],
                            function(tx, results){
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("DELETE FROM datos_generales_checklist WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                $("#conc" + id_cedula).remove();
                                                swal("","Eliminado correctamente","success");
                                            },
                                            function(tx, error){
                                                // swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },function(error){},function(){}
                                );
                            },
                            function(tx, error){console.log("Error al eliminar" +error.message);}
                        );
                    },function(error){},function(){}
                );
            } else if(tipo_cedula == "Capacitación"){
                $("#conc" + id_cedula).remove();
                swal("","Eliminado correctamente","success");
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM datosGeneralesCurso WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM cursoCiertoFalso WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM asistenciaHeader WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM asistenciaDetails WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_RespuestasSiNoPuntuacion WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_RespuestasMultiple WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_OPMultipleOpts WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
                databaseHandler.db.transaction( function(tx){ tx.executeSql("DELETE FROM CAP_Evidencias WHERE id_cedula = ?", [id_cedula], function(tx, results){ }, function(tx, error){ } ); },function(error){},function(){} );
            }
        } 
    });
}

