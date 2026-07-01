var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 4000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function(req, res){
    res.status(200).send({
        message: 'Funciona'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */

app.get ('/saludo', async function (req,res) {
	res.send({respuesta: "Hola"});
});








// =============================================================================================================================================





app.get('/login', async function(req,res){
try {
    let respuesta;

    respuesta = await realizarQuery(`
        SELECT * 
        FROM Usuarios 
        ORDER BY id_user`)


        
    res.send(respuesta);  
} catch (error) {
    console.log(error.message);
}
    
})





app.post('/registrarse', async (req, res) => {
try {
        let aux={
            existe : false
        }
        let existe = await realizarQuery( 
            `SELECT * FROM Usuarios WHERE usuario = "${req.body.usuario}" or correo = "${req.body.correo}"`
        ); 
     
    
        if (existe.length > 0) { 
    
            aux={
                existe : true
            }
            return res.send(aux);
    
        }
    
        await realizarQuery(`
            INSERT INTO Usuarios (usuario, correo, contra)
            VALUES('${req.body.usuario}', '${req.body.correo}', '${req.body.contra}') 
        `);
        
    
    
        return res.send(aux);
} catch (error) {
    console.log(error.message);
}
});






app.post('/CargarPuntaje', async (req, res) => {
try {
        await realizarQuery(`
         INSERT INTO Partidas (cant_correctas, puntaje, id_user)
            VALUES(${req.body.cant_correctas},${req.body.puntaje},${req.body.id_user})
        
        `);
    
        res.send("puntaje actualizado");
} catch (error) {
    console.log(error.message);
}
});










app.get('/banderas', async function(req,res){
try {
        let respuesta;
    
        respuesta = await realizarQuery(`SELECT * FROM Paises`)
    
        console.log(respuesta.id_pais);
            
        res.send(respuesta);  
        
} catch (error) {
    console.log(error.message);
}
})


app.get('/partida', async function(req,res){
try {
        let respuesta;
    
        respuesta = await realizarQuery(`
            SELECT * FROM Partidas  
            WHERE id_user=${req.query.id_user}
            ORDER BY puntaje DESC
            LIMIT 5
            `
        )
    
    
            
        res.send(respuesta);  
        
} catch (error) {
    console.log(error.message);
}
})

app.get('/partidasVarias', async function(req,res){
try {
        let respuesta;
    
        respuesta = await realizarQuery(`
        SELECT Usuarios.usuario, MAX(Partidas.puntaje) AS puntajes
        FROM Usuarios 
        INNER JOIN Partidas ON Usuarios.id_user = Partidas.id_user
        GROUP BY Partidas.id_user, Usuarios.usuario
    
        
        `)
    
    
            
        res.send(respuesta);  
        
} catch (error) {
    console.log(error.message);
}
})

//                                  funciones de administrador
// ==========================================================================================================================


app.put('/actualizarUser', async (req, res) => {


try {
        switch (req.body.tipo) {
            case "usuario":
    
                await realizarQuery(`
                    UPDATE Usuarios 
                    SET usuario='${req.body.usuario}'         
                    WHERE id_user=${req.body.id_user}
                `); 
    
                break;
            case "correo":
    
                await realizarQuery(`
                    UPDATE Usuarios 
                    SET correo='${req.body.correo}'          
                    WHERE id_user=${req.body.id_user}
                `); 
    
                break;
            case "contra":
    
                await realizarQuery(`
                    UPDATE Usuarios 
                    SET contra='${req.body.contra}'             
                    WHERE id_user=${req.body.id_user}
                `);        
    
                break;
            default:
    
                await realizarQuery(`
                    UPDATE Usuarios 
                    SET usuario='${req.body.usuario}', 
                    correo='${req.body.correo}',
                    contra='${req.body.contra}'
                    WHERE id_user=${req.body.id_user}
                `);
    
                break;
        }
    
    
        res.send("usuario actualizado");
} catch (error) {
    console.log(error.message);
}
});

app.delete('/eliminarUser', async (req, res) => {
try {
          console.log(req.body)
        await realizarQuery(`
            DELETE FROM Partidas WHERE id_user=${req.body.id_user}
        `);
        
        await realizarQuery(`
        
            DELETE FROM Usuarios WHERE id_user=${req.body.id_user}
        `);  
    
        res.send("usuario eliminado");
} catch (error) {
    console.log(error.message);
}
});

app.post('/agregarPais', async (req, res) => {

try {
        let existe = await realizarQuery( 
            `SELECT * FROM Paises 
            WHERE nombre = "${req.body.nombre}" or nombre_archivo="${req.body.nombre_archivo}"`
        ); 
     
    
        if (existe.length > 0) { 
            return res.send("pais duplicado");
        }
    
        await realizarQuery(`
            INSERT INTO Paises (nombre, nombre_archivo)
            VALUES('${req.body.nombre}', '${req.body.nombre_archivo}') 
        `);
    
        res.send("pais agregado");
} catch (error) {
    console.log(error.message);
}
});


app.put('/updatePais', async (req, res) => {
try {
        await realizarQuery(`
            UPDATE Paises 
            SET nombre='${req.body.nombre}', 
            nombre_archivo='${req.body.nombre_archivo}'
            WHERE id_pais=${req.body.id_pais}
        `);
    
        res.send("Juego actualizado");
} catch (error) {
    console.log(error.message);
}
});

app.delete('/eliminarPais', async (req, res) => {
try {
          console.log(req.body)
        await realizarQuery(`
            DELETE FROM Paises WHERE id_pais=${req.body.id_pais}
        `);
    
        res.send("pais eliminado");
} catch (error) {
    console.log(error.message);
}
});