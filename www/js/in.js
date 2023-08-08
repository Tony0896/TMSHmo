document.addEventListener("deviceready", function(){
    databaseHandler.createDatabase();
});

function addCedula(){
    var IdUsuario = localStorage.getItem("IdUsuario");
    var icedula = localStorage.getItem("IdCedula"); 
	var imagenC = $("#imagenC").val();
	var cte = $("#cte").val();
	var ncomercial = $("#ncomercial").val();
	var ncontacto = $("#ncontacto").val();
	var telefono = $("#telefono").val();
	var correo = $("#correo").val();
	var estatusc = $("#estatusc").val();
    var geolocation = $("#geolocation").val();
    var Nomcte = $("#Nomcte").val();
    var fecha = new Date();
    var fFinal = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds(); 
    if(cte == ""){
        app.dialog.alert('El campo: Cliente. Es requerido.', 'Aviso');
    }else if(ncomercial == ""){   
        app.dialog.alert('El campo: Nombre comercial. Es requerido.', 'Aviso');
    }else if(imagenC == ""){
        app.dialog.alert('El campo: Fotograf\u00eda. Es requerido.', 'Aviso');
    }else{     
        if(icedula > 0){ 
             databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql(
                        "UPDATE Clientes SET NomComercial = ?, NomContacto = ?, Telefono = ?, Email = ?, Estatus = ?, Cliente = ? WHERE IdCte = ?",
                        [ncomercial, ncontacto, telefono, correo, estatusc, Nomcte ,cte, ],
                        function(tx, results){
                            app.views.main.router.navigate({name: 'recorrido'});
                        },
                        function(tx, error){
                            console.log("Error al guardar cedula: " + error.message);
                        }
                    );  
                },
                function(error){},
                function(){}
            ); 
            
        }else{
            productHandler.addCedula(IdUsuario,cte,fFinal,imagenC,geolocation);
            app.dialog.alert('El registro se guardo correctamente.', 'Aviso');
            
            //--------------------------
            databaseHandler.db.transaction(
            function(tx){

                tx.executeSql(
                    "Select MAX(IdCedula) as Id from Cedula",
                    [],
                    function(tx, results){
                        var length = results.rows.length;
                        var item = results.rows.item(0);
                        localStorage.setItem("IdCedula", item.Id);
                        localStorage.setItem("IdCte", cte);
                    },
                    function(tx, error){
                        console.log("Error al guardar cedula: " + error.message);
                    }
                );  
            },
            function(error){},
            function(){}
        );
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql(
                        "SELECT  IdCte FROM Clientes WHERE IdCte = ?",
                        [cte],
                        function(tx, results){
                            var length = results.rows.length;
                            if(length > 0){ 
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql(
                                            "UPDATE Clientes SET NomComercial = ?, NomContacto = ?, Telefono = ?, Email = ?, Estatus = ? WHERE IdCte = ?",
                                            [ncomercial, ncontacto, telefono, correo, estatusc ,cte, ],
                                            function(tx, results){
                                                app.views.main.router.navigate({name: 'recorrido'});
                                            },
                                            function(tx, error){
                                                console.log("Error al guardar cedula: " + error.message);
                                            }
                                        );  
                                    },
                                    function(error){},
                                    function(){}
                                );        
                            } else { 
                               databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql(
                                            "INSERT INTO Clientes (NomComercial, NomContacto, Telefono, Email, IdCte, Estatus, Cliente) VALUES (?,?,?,?,?,?,?)",
                                            [ncomercial, ncontacto, telefono, correo, cte, estatusc, Nomcte ],
                                            function(tx, results){
                                                app.views.main.router.navigate({name: 'recorrido'});
                                            },
                                            function(tx, error){
                                                console.log("Error al guardar cedula: " + error.message);
                                            }
                                        );  
                                    },
                                    function(error){},
                                    function(){}
                                ); 
                            }    
                        },
                        function(tx, error){
                            console.log("Error al guardar cedula: " + error.message);
                        }
                    );  
                },
                function(error){},
                function(){}
            );
        }
    }
}
//Mostrar Equipos agregados
function mostrarEquipos(){
    var icedula = localStorage.getItem("IdCedula"); 
}

function mostrarCliente(){
    databaseHandler.db.transaction(
            function(tx){

                tx.executeSql(
                    "Select * from Cliente",
                    [],
                    function(tx, results){
                        var length = results.rows.length;
                        for(var i = 0; i< length; i++){
                            var item = results.rows.item(i);
                            $("#clien #cli").append("<tr><td><img src='"+item.imagenC+"'width='100px' height='100px'/></td><td>"+item.cte+"</td><td>"+item.ncomercial+"</td><td>"+item.ncontacto+"</td><td>"+item.telefono+"</td><td>"+item.correo+"</td><td>"+item.estatusc+"</td></tr>"); 

                        }
                    },
                    function(tx, error){
                        console.log("Error al consultar: " + error.message);
                    }
                );
                console.log("Consulta correcta");
            },
            function(error){},
            function(){}
        );
}
