let loggedId;
let banderaId;
let banderaIndex
let arrayBanderas
let cantCorrectas = 0
let puntaje = 0
let intento = true
async function login() {


    let res = await fetch("http://localhost:4000/login")
    let response = await res.json()
  
    const correoAux = ingresoCorreo()
    const contraAux = ingresoContra()
    for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if(correoAux == element.correo && contraAux == element.contra) {
            loggedId= element.id_user
            console.log(loggedId);       
            

        }
    }

}



function tomarDatosLogin() {


    let datos = {
        usuario: ingresoUsuario(),
        correo: ingresoCorreo(),
        contra: ingresoContra()
    

    }


    registrarse(datos)
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



function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




async function cambiarBandera(){
    banderaId = enteroAleatorio(1, 28)
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
        
        let random = enteroAleatorio(0,27)

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
        <button id="opc${i}" class="opciones" onclick="validarOpciones(${array[arrayIndice[i]]}, ${i})">${element[array[arrayIndice[i]]].nombre}</button>

        `;        
    }


    document.getElementById("secRta").innerHTML += elementosLista


    

}

function validarRta(){
    const rta = ingresoRta()
    if(intento){
        intento= false
        if (rta == arrayBanderas[banderaIndex].nombre ) {
            console.log("gooooood");
            
        } else{
            console.log("no gooood")
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
            console.log("gooood")
            document.getElementById(`opc${i}`).style.backgroundColor="rgba(0, 128, 0, 0.226)"
        }else{
            console.log(" no gooood")
            document.getElementById(`opc${i}`).style.backgroundColor="rgba(128, 0, 0, 0.226)"

        }
    }else{
        console.log("wewewewewe")
    }

}

async function llamadoAlPut(datos) {
    const response = await fetch('http://localhost:4000/CargarPuntaje',{
        method:"PUT",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos) 
    })



}

function tomarDatosPut(){

    let datos = {
        cant_correctas: cantCorrectas,
        puntaje : puntaje,
        id_user : loggedId
    }
    llamadoAlPut(datos)
}


async function mostrarTabla() {
    
    let res = await fetch(`http://localhost:4000/partida?id_user=${loggedId}`)
    let response = await res.json()
    let elementosLista = ""
    document.getElementById("tabla").innerHTML=`
    <tr>
        <th>    </th>
        <th>Cantidad de correctas</th>
        <th>Puntaje</th>
    </tr>`
    for (let i = 0; i < 5; i++) {
        const element = response[i];
        elementosLista += `
        <tr>
            <td>${i+1}</td>
            <td>${element.cant_correctas}</td>
            <td>${element.puntaje}</td>
        </tr>
        `;        
    }

    document.getElementById("tabla").innerHTML += elementosLista
}