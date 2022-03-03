const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion')
let totalPaginas;
let iterador;
const registrosPorPagina = 40;
let paginaActual = 1;

//escucha el dom al cargar
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}



function validarFormulario(e){
    e.preventDefault();
    //console.log('dsde validar formulario')

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarAlerta('Agrega un termino de busqueda')
        return;
    }

    buscarImagenes()

}


function buscarImagenes(){
            //console.log(terminoBusqueda)

            const termino = document.querySelector('#termino').value;

            const key ='24991140-db4210e5fa6b25e28357a3cfb';

            //con template string inyectamos las cariables
            const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
            

            fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => {
                //console.log(resultado)
                totalPaginas = calcularPaginas(resultado.totalHits)
                console.log(totalPaginas)
                mostrarImagenes(resultado.hits)
                //
            })
}




//generador que va aregistrar la cantidad de elemetos de acuerdo a las paginas
function *crearPaginador(total){
    //console.log("desde crear paginador")
    for (let i = 1; i <=total ; i++ ){
        
        //console.log(i)
        yield i;
    }
}

function calcularPaginas(total){
   return parseInt(Math.ceil ( total / registrosPorPagina));
}



function mostrarImagenes(imagenes){
    //console.log(imagenes)
    limpiarHTML();
   
    //iterar sobre el arreglo de imagenes y construir el html
    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL} = imagen;
       //console.log(largeImagenURL)
       resultado.innerHTML += `

       <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class = "bg-white">
                <img class ="w-full" src ="${previewURL}">

                <div class="p-4">
                        <p class = "font-bold"> ${likes} <span class = "font-light" >Me Gusta</span></p>
                        <p class = "font-bold"> ${views} <span class = "font-light" >Veces vistas</span></p>
                        <a class = "block w-full bg-blue-800 hovver:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target ="_blank" rel= "noopener noreferrer">
                            Ver Imagen
                        </a>
                </div>
            </div>
        </div>        
`
    })


    //limpiamos el paginador previo
    //limpiarHTML();
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }



    //generamos el nuevo html
    imprimirIterador();
    //console.log(totalPaginas)
  

}

function imprimirIterador(){
    iterador = crearPaginador(totalPaginas);
    //console.log(iterador.next().done)

    //creamos un while con valor true para que se ejecute todo el tiempo
    while(true){
        const { value, done } = iterador.next(); 
        if(done) return;

        //caso contrario, genera un boton por cada elemnto en el generador
        //creamos un enlace

        const boton =  document.createElement('a');
        //creamos un boton con un comodin que no nos va allevar a ningun lado solo de una pagina aotra del iterador
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-4','rounded');

        //cuando el usuario presione el paginador
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
            console.log(paginaActual);
        }

        paginacionDiv.appendChild(boton);
    }
}
function mostrarAlerta(mensaje){
    //console.log(mensaje)

    const existeAlerta = document.querySelector('.bg-red-100')


    //if ,,, si no existe una alerta previa
    if(!existeAlerta){
    const alerta = document.createElement('p');
    alerta.innerHTML = `
            <strong class = "font-bold">ERROR!</strong>
            <span class ="block sm:inline">${mensaje}</span>
    `
    alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');
    formulario.appendChild(alerta)

    

    setTimeout(()=>{
        alerta.remove()
       
    },3000)
    }
}

function limpiarHTML(){
    //minetras ecista algo lo vamos a ir eliminando del dom

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}