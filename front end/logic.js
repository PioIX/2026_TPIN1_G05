
let loggedId = JSON.parse(localStorage.getItem("usuario"));
let banderaId;
let banderaIndex
let arrayBanderas
let cantCorrectas = 0
let puntaje = 0
let intento = true
let contadorIntento = 0






//                            gestion de usuarios
// ==============================================================================================
async function login() {


    let res = await fetch("http://localhost:4000/login")
    let response = await res.json()
  
    const correoAux = ingresoCorreo()
    const contraAux = ingresoContra()
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if(correoAux == element.correo && contraAux == element.contra) {
            localStorage.setItem("usuario", JSON.stringify(element));

            console.log(loggedId); 
            if (correoAux == "admin" && contraAux == "admin") {
                window.location.href = "admin.html";
                
            }else{
      
                window.location.href = "juego.html";
            }


        }
    }

}
async function registrarse(datos) {
    const response = await fetch('http://localhost:4000/registrarse',{
        method:"POST", //GET, POST, PUT o DELETE
        headers: { //Esto va siempre, solo aclaro que va en tipo JSON
            "Content-Type": "application/json",
          },
        body: JSON.stringify(datos) //JSON.stringify convierte de objeto a JSON
    })
    
    
    
}
function tomarDatosLogin() {


    let datos = {
        usuario: ingresoUsuario(),
        correo: ingresoCorreo(),
        contra: ingresoContra()
    

    }


    registrarse(datos)
    login()
}


//                            logica del juego
// ==============================================================================================

function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function cambiarBandera(){
    banderaId = enteroAleatorio(1, 50 )
    let res = await fetch("http://localhost:4000/banderas")
    let response = await res.json()
    arrayBanderas = response
    console.log(arrayBanderas)
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if(element.id_pais == banderaId){
            banderaIndex = i
        }
        
    }

    document.getElementById("secFlag").innerHTML= `<img src="imagenes/${response[banderaIndex].nombre_archivo}.png" alt="">`
}
function generarOpciones(){
    
    let array =[]
    let arrayIndice =[]


    while (array.length < 3 ) {
        
        let random = enteroAleatorio(0,49)

        if (array.includes(random) == false && random != banderaIndex) {
            array.push(random)

        }

    }

    array.push(banderaIndex)

    while (arrayIndice.length < 4) {

        let random = enteroAleatorio(0,3)

        if (arrayIndice.includes(random) == false) {
            arrayIndice.push(random)

        }
    }

    let elementosLista = ""
    document.getElementById("secRta").innerHTML = elementosLista
    
    for (let i = 0; i < arrayIndice.length; i++) {
        const element = arrayBanderas;
        elementosLista += `
        <button value="${array[arrayIndice[i]]}" id="opc${i}" class="opciones" onclick="validarOpciones(${array[arrayIndice[i]]}, ${i})">${element[array[arrayIndice[i]]].nombre}</button>

        `;        

    }

    document.getElementById("secRta").style.display = "grid";
    document.getElementById("secRta").innerHTML += elementosLista


    

}
function siguiente(){
    intento = true
    cambiarBandera()
    document.getElementById("secRta").innerHTML=`
    <input style="margin-bottom: 1.5rem; margin-top: 0;" id="inputRta" type="text" placeholder="¿De qué país es esta bandera?" >
    <button onclick="validarRta()" >fhbuyerfg</button>`
    document.getElementById("secRta").style.display="block"

    
}




//                            Validacion
// ==============================================================================================

function validarRta(){
    const rta = ingresoRta()
    if(intento){
        intento= false
        if (rta.toLowerCase() == arrayBanderas[banderaIndex].nombre.toLowerCase() ) {
            console.log("gooooood");
            document.getElementById("inputRta").style.backgroundColor="rgba(0, 128, 0, 0.226)"
            puntaje+=10
            cantCorrectas+=1
            
        } else{
            console.log("no gooood")
            document.getElementById("inputRta").value=`${arrayBanderas[banderaIndex].nombre}`
            document.getElementById("inputRta").style.backgroundColor="rgba(128, 0, 0, 0.226)"


        }

        contadorIntento+=1
        if (contadorIntento==5) {
            console.log("henekejlhethkjhfeoerhreo")
            
            document.getElementById("siguienteBtn").remove()
            document.getElementById("ashudaBtn").remove()

            document.getElementById("juego").innerHTML += `
            <img onclick= "irATablas()" id="tablasBtn" src="cuadro.png" alt="">`
                        
            document.getElementById("juego").innerHTML += `
            <img onclick= "window.location.reload()" id="voverAJugarBtn" src="flecha de recarga.png" alt="">`

            tomarDatosPost()
        }
    }else{
        console.log("weweeee")
    }


}

function validarOpciones(aux, i){
    if(intento){
        intento=false
        if (aux == banderaIndex) {
            puntaje+=5
            cantCorrectas+=1
            console.log("       ;-)")


            document.getElementById(`opc${i}`).style.backgroundColor="rgba(0, 128, 0, 0.226)"

        }else{
            console.log("       ಥ_ಥ")
            document.getElementById(`opc${i}`).style.backgroundColor="rgba(128, 0, 0, 0.226)"


            for (let a = 0;a < 4; a++) {
                const element= document.getElementById(`opc${a}`).value
                if(element==banderaIndex){
                    document.getElementById(`opc${a}`).style.backgroundColor="rgba(0, 128, 0, 0.226)"   
                }
            }

        }
        contadorIntento+=1
        if (contadorIntento==5) {
            document.getElementById("siguienteBtn").remove()
            document.getElementById("ashudaBtn").remove()

            document.getElementById("juego").innerHTML += `
            <img onclick= "irATablas()" id="tablasBtn" src="cuadro.png" alt="">`
                        
            document.getElementById("juego").innerHTML += `
            <img onclick= "window.location.reload()" id="voverAJugarBtn" src="flecha de recarga.png" alt="">`

            tomarDatosPost()
        }
    }else{
        console.log("wewewewewe")
    }

}






//                            cargar resltados
// ==============================================================================================

async function llamadoAlPost(datos) {
    const response = await fetch('http://localhost:4000/CargarPuntaje',{
        method:"POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos) 
    })

}

function tomarDatosPost(){

    let datos = {
        cant_correctas: cantCorrectas,
        puntaje : puntaje,
        id_user : loggedId.id_user
    }
    llamadoAlPost(datos)

}
function irATablas(){
    window.location.href = "tabla.html";
}

async function mostrarTabla() {
    
    let res = await fetch(`http://localhost:4000/partida?id_user=${loggedId.id_user}`)
    let response = await res.json()
    let elementosLista = ""
    document.getElementById("tabla").innerHTML=`
    <tr>
        <th></th>
        <th>Cantidad de correctas</th>
        <th>Puntaje</th>
    </tr>`
    for (let i = 0; i < 5; i++) {
        const element = response[i];
        elementosLista += `
        <tr>
            <td>${i+1}.</td>
            <td>${element.cant_correctas}</td>
            <td>${element.puntaje}</td>
        </tr>
        `;        
    }

    document.getElementById("tabla").innerHTML += elementosLista
}

async function mostrarTablaVarias() {
    
    let res = await fetch(`http://localhost:4000/partidasVarias`)
    let response = await res.json()
    let elementosLista = ""
    document.getElementById("tabla").innerHTML=`
    <tr>
        <th></th>
        <th>Usuario</th>
        <th>Puntaje</th>
    </tr>`
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        elementosLista += `
        <tr>
            <td>${i+1}.</td>
            <td>${element.usuario}</td>
            <td>${element.puntajes}</td>
        </tr>
        `;        
    }

    document.getElementById("tabla").innerHTML += elementosLista
}

async function getUsuario(){
    let res = await fetch("http://localhost:4000/login")
    let response = await res.json()
    let elementosLista = ""
    document.getElementById("tablaUsuarios").innerHTML=`
    <tr>
        <th>ID</th>
        <th>Correo</th>
        <th>Usuario</th>
        <th>Contraseña</th>

    </tr>`
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        elementosLista += `
        <tr>
            <td>${element.id_user}</td>
            <td>${element.correo}</td>
            <td>${element.contra}</td>
        </tr>
        `;        
    }

    document.getElementById("tablaUsuarios").innerHTML += elementosLista
}