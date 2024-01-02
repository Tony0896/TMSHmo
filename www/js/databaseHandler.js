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
                //inicio Capacitacion
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
                //Fin cacpacitacion
                //inicio Tecnologias
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
                // tx.executeSql(
                //     "create table if not exists DesTecFirmas(id_firma integer primary key, id_cedula integer, IdHeader integer, firma text, fecha text)",
                //     [],
                //     function(tx, results){
                //         // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                //     },
                //     function(tx, error){
                //         console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                //     }
                // );
                // fin tecnologías
                // inicio relevos
                tx.executeSql(
                    "create table if not exists Relevos(id_relevo integer primary key, id_cedula integer, IDSale int, claveEmpleado Text, fullName Text, ID_personal int, Eco Text, FKUnidad int, linea int, jornada int, fechaSalida Text, UsuarioMov Text, FkUsuarioMov Text, tipoCedula Text, IDEntra int, claveEmpleadoE Text, fullNameE Text, ID_personalE int, EcoE Text, FKUnidadE int, lineaE int, jornadaE int, fechaEntrada Text, UsuarioMovE Text, FkUsuarioMovE Text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                    }
                );
                //fin relevos
                //? Inicio Campanias
                    // IEN_Header(id_cedula, FKCampaña, nombreCampania, FKFormato, FK_registro, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad
                    tx.executeSql(
                        "create table if not exists IEN_Header(ID_Header integer primary key, id_cedula integer, FKCampaña integer, nombreCampania text, FKFormato integer, FK_registro integer, fechaFin text, fechaInicio text, FK_Unidad integer, observaciones text, unidad text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists IEN_Details(ID_Detail integer primary key, id_cedula integer, FKHeader integer, FK_formato integer, Fk_pregunta integer, pregunta text, multiple integer, respuesta int, Opcion_1 text, Opcion_2 text, Opcion_3 text, Opcion_4 text, Opcion_5 text, Opcion_6 text, falla text, FKsFallas text, comentarios text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                //? Fin Campanias
                //? Inicio Lavado
                    // IEN_Header(id_cedula, FKCampaña, nombreCampania, FKFormato, FK_registro, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad
                    tx.executeSql(
                        "create table if not exists IEN_HeaderLavado(ID_HeaderLavado integer primary key, id_cedula integer, FKFormato integer, FK_registro integer, fechaFin text, fechaInicio text, FK_Unidad integer, observaciones text, unidad text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists IEN_ProgramacionLavado(ID_Detail integer primary key, id_cedula integer, FK_header integer, IDServidor integer, pregunta text, multiple int ,FK_formato int, Opcion1 text, Opcion2 text, Opcion3 text, Opcion4 text, Opcion5 text, Opcion6 text, programa text, proveedor text, respuesta int, IDPregunta int)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists IEN_EvidenciasLavado(id_evidencia integer primary key, id_cedula integer,FKHeader int, evidencia blob, fecha text, typeLavado text, proceso int)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    ); //IEN_HeaderResultadoLavado(id_cedula, FKFormato, fechaFin, fechaInicio, FK_Unidad, observaciones, unidad
                    tx.executeSql(
                        "create table if not exists IEN_HeaderResultadoLavado(ID_HeaderLavado integer primary key, id_cedula integer, FKFormato integer, fechaFin text, fechaInicio text, FK_Unidad integer, observaciones text, unidad text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );// IEN_ResultadoLavado(id_cedula,FK_header,IDPregunta, pregunta, multiple,FK_formato,Opcion1,Opcion2,Opcion3,Opcion4,Opcion5,Opcion6,respuesta
                    tx.executeSql(
                        "create table if not exists IEN_ResultadoLavado(ID_Detail integer primary key, id_cedula integer, FK_header integer, IDPregunta integer, pregunta text, multiple int ,FK_formato int, Opcion1 text, Opcion2 text, Opcion3 text, Opcion4 text, Opcion5 text, Opcion6 text, respuesta int)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                //? Fin Lavado
                //? Inicio Diesel
                    tx.executeSql(
                        "create table if not exists datos_generales_diesel(id_dato integer primary key, id_cedula integer, fecha text, id_usuario text, id_empresa integer, observaciones text, carga_total float, total_unidades integer, unidades_cargadas integer, promedio float, origen int, estatus int, id_servidor integer, fecha_fin text, nombre_usuario text, bomba_def integer, carga_def float)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de datos_generales_recaudo: " + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists detalle_diesel(id_detalle integer primary key, id_cedula integer, id_unidad integer, eco text, carga_total float, odometro float, fecha_carga text, no_bomba int, almacen text, id_operador int, operador text, operador2 text, jornada text, vueltas int, h_inicio text, h_fin text, tipo_carga text, VIN text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                //? Fin Diesel
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