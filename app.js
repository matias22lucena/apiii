import express, { json } from 'express'; // Aqui lo que hacemos es importar la dependncia express lo importamos desde el modulo que instalamos

import fs from "fs"; //esta es para poder leer manipular la base de datos esto seria como la conexion a la base de datos, esto nos permite trabajar con archivos que tenemos en nuestra carpeta del proyecto.

import bodyParser from "body-parser";// esto es un middleware para que podamos usar el metodo post sin problemas

const app = express(); // aqui esta constante la hacemos igual a la funcion express que acabamos de importar con esto creamos el objeto de nueestra aplicacion de servidor

app.use(bodyParser.json());

const readData =() => { //aqui leeemos el archivo json
    try{ //ponemos este try para que nuestra aplicacion no se rompa, aqui le decimos que intente mostrar nuestro json y si no puede nos tirara un console.log que dice error
    const data = fs.readFileSync("./db.json"); // aqui declaramos una const data= fs(fs es sistema de archivos) para leer de forma síncrona (bloqueante) el contenido del archivo db.json y luego lo asigna a la variable data. La función readFileSync espera a que se complete la lectura del archivo antes de que el programa continúe su ejecución,
    return JSON.parse(data);//lo que hace esto La función JSON.parse() en JavaScript analiza una cadena de texto JSON y la convierte en un objeto JavaScript. En otras palabras, toma una cadena JSON y la transforma en un objeto que se puede manipular y utilizar dentro del código JavaScript.
    }catch(error){
        console.log(error);
    }
};//Aqui creamos unas funciones para leer los datos que vienen de ahi de nuestro json 


const writedata = (data) => { // aqui creamos una funcion writedata lo que hace escribir los datos

    try{ // hace practicamente lo mismo que arriba 
        fs.writeFileSync("./db.json", JSON.stringify(data));//Esta línea de código escribe el contenido de un objeto JavaScript en formato JSON en un archivo llamado db.json utilizando el módulo fs (sistema de archivos) en Node.js., JSON.stringify(data): Convierte el objeto JavaScript data en una cadena de texto en formato JSON.
        //fs.writeFileSync("./db,json", JSON.stringify(data)): Escribe la cadena de texto JSON en el archivo db.json.
        }catch(error){
            console.log(error);
        }
}


app.get("/", (req, res) => {
    res.send("Bienvenidos a mi API RESTt")
})// aqui lo que hacemos es crear un endpoint, tambien agregamos la funcion callback que recibe dos parametros de la redquisicion o de la llamada y tambien de la respuesta, abajo usamos el objeto de la respuesta y de ese objeto send de enviar algo 



//Aqui creamos el primer Endpoint el que estamos creando es el de obtener todos los datos de la db
// ESTE ES EL METODO GET QUE NOS DEVUELVE TODO LO QUE TENEMOS EN NUESTRA DB 
app.get("/Peliculas", (req, res)=> { // aqui creamos una funcion callback que recibe los parametros de requerir y respuesta 
const data = readData();// aqui usamos nuestra funcion read data de leer los datos esto los retorna la estructura de nuestra db.
res.json(data.Peliculas); //aqui lo que hacemos es es responder a la peticion le enviamos con una estructura json  le decimos que solo envie las peliculas
})

//AQUI CREAMOS EL SEGUNDO ENDPOINT QUE ES EL METODO GET PERO POR ID
app.get("/Peliculas/:id", (req, res) => {//estos reciben los parametros de la peticion que estamos haciendo y de la respuesta 
    const data = readData();  //Llama a una función readData() para obtener los datos de alguna fuente (probablemente una base de datos o un archivo).
    const id = parseInt(req.params.id); //Extrae el parámetro id de la URL de la solicitud y lo convierte en un número entero utilizando la función parseInt(). req.params.id contiene el valor del marcador de posición :id en la URL de la solicitud.
    const Peliculas = data.Peliculas.find((Peliculas) =>Peliculas.id === id);//Busca la película en los datos obtenidos que coincida con el ID proporcionado en la solicitud. Utiliza el método Array.find() para encontrar el primer elemento en el array que coincida data.Peliculas que cumpla con la condición especificada en la función de callback. En este caso, busca un objeto de película cuyo id coincida con el id proporcionado en la solicitud.
    res.json(Peliculas); //Envía la película encontrada como respuesta al cliente en formato JSON utilizando el método res.json(). Si no se encuentra ninguna película con el ID proporcionado, se devolverá null como respuesta.
});


//Aqui creamos un nuevo endpoint de tipo POST lo que es crear un nuevo elemento y agregarlo 
app.post("/Peliculas", (req, res)=> {
    const data = readData(); // leemos los datos 
    const body = req.body; // extraer el body que va venir en el objeto de la peticion en body es donde vamos a enviar las peliculas nuevas 
    const newPeliculas = { //aqui creamos una nueva constante que va ser un objeto 
        id: data.Peliculas.length + 1, // aqui lo que hacemos que se cree el id automaticamente 
        ...body, // aqui le decimos que todo lo que viene en body lo agrege en esa nueva  Peliculas 
    };
    data.Peliculas.push(newPeliculas); // aqui le decimos a esa data le quiero agregar un nueva pelicula lo que hace ese push es mandarla al final.lo que hace es agregar una pelicula a las peliculas que ya teniamos
    writedata(data); //aqui usamos esta funcion para escribir en este archivo la nueva pelicula que estamos creando 
    res.json(newPeliculas);//aqui devolvemos el json con el nuevo libro que acabamos de crear 
});


//AQUI CREAMOS OTRO ENDPOINT CREAMOS EL PUT LO QUE HACE ES DE MODIFICAR UN PRODUCTO CON EL ID 

app.put("/Peliculas/:id", (req, res) => {
    const data = readData(); //leemos los datos 
    const body = req.body;//Extrae los datos enviados en el cuerpo de la solicitud HTTP utilizando req.body. Esto se basa en el uso previo de body-parser middleware, que permite el análisis del cuerpo de la solicitud en Express.js.
    const id = parseInt(req.params.id);//Extrae el identificador (id) de la película de la URL de la solicitud y lo convierte en un número entero utilizando la función parseInt(). req.params.id contiene el valor del marcador de posición :id en la URL de la solicitud.
    const PeliculasIndex = data.Peliculas.findIndex((Peliculas) => Peliculas.id === id);//Busca el índice de la película en los datos obtenidos que coincida con el ID proporcionado en la solicitud. Utiliza el método Array.findIndex() para encontrar el índice del primer elemento en el array data.Peliculas que cumpla con la condición especificada en la función de callback. En este caso, busca un objeto de película cuyo id coincida con el id proporcionado en la solicitud.
    data.Peliculas[PeliculasIndex]={
        ...data.Peliculas[PeliculasIndex],
        ...body,
    }; //Actualiza los detalles de la película en la posición encontrada en el array de películas. Combina los detalles existentes de la película con los nuevos detalles proporcionados en el cuerpo de la solicitud utilizando la propagación de objetos (...). Esto sobrescribe los campos existentes de la película con los nuevos valores proporcionados en la solicitud.
    writedata(data);//Escribe los datos actualizados de vuelta a la fuente de datos (posiblemente un archivo) utilizando la función writedata().
    res.json({Message:"La pelicula fue Actualizada"})

});

//Aqui creamos el endpoint para eliminar un elemento que es el endpoint

app.delete("/Peliculas/:id", (req, res) => {
    const data = readData(); 
    const id = parseInt(req.params.id);
    const PeliculasIndex = data.Peliculas.findIndex((Peliculas) => Peliculas.id === id);//Busca el índice de la película en los datos obtenidos que coincida con el ID proporcionado en la solicitud. Utiliza el método Array.findIndex() para encontrar el índice del primer elemento en el array data.Peliculas que cumpla con la condición especificada en la función de callback. En este caso, busca un objeto de película cuyo id coincida con el id proporcionado en la solicitud.
    data.Peliculas.splice(PeliculasIndex, 1); //Elimina la película en la posición encontrada en el array de películas utilizando el método splice(). PeliculasIndex es el índice de la película a eliminar, y 1 indica cuántos elementos deben eliminarse a partir de esa posición.
    writedata(data);
    res.json({Message: "La pelicula Fue eliminada"});
});

app.listen(3000, () => {
    console.log('Servidor escuchando peticiones en el puerto 3000');
}); // de este objeto usamos la funcion listen para escuchar le pasamos el puerto 3000 y tambien le pasamos una funcion callback que lo que hace es imprimir un mensaje que el servidor esta escuchando en el puerto 3000
//HASTA AQUI LEVANTAMOS EL SERVIDOR 
//PARA FORMATAR SHIFT ALT F 