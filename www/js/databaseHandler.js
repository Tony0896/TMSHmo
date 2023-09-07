var databaseHandler = {
    db: null,
    createDatabase: function(){
        this.db = window.sqlitePlugin.openDatabase({name: 'cisa.db', location: 'default', androidDatabaseProvider: 'system'});
        this.db.transaction(
            function(tx){
                // General
                tx.executeSql(
                    "create table if not exists Actualizaciones (idActualizacion integer primary key,IdUsuario integer, Fecha text)",
                    [],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de cedulas_general: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists cedulas_general(id_cedula integer primary key,tipo_cedula text,id_usuario text,nombre_usuario text,fecha_entrada text,geolocalizacion_entrada text,id_cliente text,nombre_cliente text,horario_programado text,calificacion text,fecha_salida text,geolocalizacion_salida text,estatus integer,comentario_cliente text,nombre_evalua text)",
                    [],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de cedulas_general: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists datosGeneralesCurso(id_dato integer primary key, id_cedula integer, fecha text, nombreInstructor text, id_instructor integer, id_candidato integer, nombreCandidato text, edad float, telCelular int, antecedentesManejo text, name_course text, fecha_captura text, id_course integer, apto integer, observaciones text, firmaInstructor blob, promedio float, costo float, ID_AT int, Prueba int, OpDiario int)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists cursoCiertoFalso(id_curso integer primary key, id_cedula integer, IDPregunta integer, Pregunta text, IDCurso integer, Respuesta integer, OpCorrecta integer, fecha text, texto1 text, texto2 text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists asistenciaHeader(id_asistencia integer primary key, id_cedula integer, fecha text, id_usuario int, nameUsuario text, fechaCaptura text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists asistenciaDetails(id_asistenciaD integer primary key, id_cedula integer, fecha text, id_becario int, claveBecario text, nameBecario text, asiste int, fechaCaptura text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists CAP_RespuestasSiNoPuntuacion(id_curso integer primary key, id_cedula integer, FK_IDPregunta integer, Pregunta text, FK_IDCurso integer, Respuesta integer, OpCorrecta integer,Valor int, fecha text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists CAP_RespuestasMultiple(id_curso integer primary key, id_cedula integer, FK_IDPregunta integer, Pregunta text, FK_IDCurso integer, Respuesta integer, fecha text, Justifica int, Justificacion text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists CAP_OPMultipleOpts(id_Opts integer primary key, id_cedula integer, FK_IDPregunta integer, Opcion text, Correcta integer, Image blob, FK_IDCurso integer)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists CAP_Evidencias(id_evidencia integer primary key, id_cedula integer, evidencia blob, fecha text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists DesTechDetails(id_detalle integer primary key, id_cedula integer, IdHeader integer, Fk_pregunta integer, respuesta integer, falla text, comentarios text, pregunta text, multiple bit, id_formato int, FK_equipo int, FKsFallas text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists DesTechHeader(IdHeader integer primary key, id_cedula integer, fecha_inicio text, fecha_fin text, observaciones text, unidad text, id_unidad int, id_operador int, operador text, credencial text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists DesTecFirmas(id_firma integer primary key, id_cedula integer, IdHeader integer, firma text, fecha text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists LicenciasDetails(ID integer primary key, id_cedula integer, FK_operador integer, operador text, credencial text, qrData text, estatus bit, IDServidor int, tipo text, vigencia text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
            },
            function(error){
                console.error("Error al crear la base de datos: " + error.message);
            },
            function(){
                // console.log("Base de datos creada exitosamente");
            }
        );
    }
}