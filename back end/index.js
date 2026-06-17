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
    let respuesta;

    respuesta = await realizarQuery(`SELECT * FROM Usuarios`)


        
    res.send(respuesta);  
    
})





app.post('/registrarse', async (req, res) => {

    let existe = await realizarQuery( 
        `SELECT * FROM Usuarios WHERE usuario = "${req.body.usuario}" or correo = "${req.body.correo}"`
    ); 
 

    if (existe.length > 0) { 
        return res.send("usuario duplicado");
    }

    await realizarQuery(`
        INSERT INTO Usuarios (usuario, correo, contra)
        VALUES('${req.body.usuario}', '${req.body.correo}', '${req.body.contra}') 
    `);
    


    res.send("usuario agregado");
});






app.put('/CargarPuntaje', async (req, res) => {
    await realizarQuery(`
        UPDATE Partidas 
        SET cant_correctas=${req.body.cant_correctas},
        puntaje=${req.body.puntaje},
        id_user=${req.body.id_user}
        WHERE id_user=${req.body.id_user}
    `);

    res.send("puntaje actualizado");
});










app.get('/banderas', async function(req,res){
    let respuesta;

    respuesta = await realizarQuery(`SELECT * FROM Paises`)

    console.log(respuesta.id_pais);
        
    res.send(respuesta);  
    
})


app.get('/partida', async function(req,res){
    let respuesta;

    respuesta = await realizarQuery(`
        SELECT * FROM Partidas  
        WHERE id_user="${req.query.id_user}" 
        ORDER BY puntaje`)


        
    res.send(respuesta);  
    
})