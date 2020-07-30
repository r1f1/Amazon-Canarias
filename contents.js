

// Aquí se trata de buscar en la página solo los anuncios que tengan true y añadirles el mensaje. Para ello se 
// localiza dicho texto viendo que etiquetas llegan hasta la clase que define la letra, una vez ahí concatenamos
// el mensaje y listo.

function final(respuesta25){
	for (var a = 0; a < respuesta25.length; a++){
		if (respuesta25[a]){
			var buscar, texto1, texto2, texto3, alerta; 
			buscar = document.getElementById("search");
			texto1 = buscar.getElementsByClassName("s-result-list s-search-results sg-row")[1];
			texto2 = texto1.querySelectorAll("[data-index]")[a];
			texto3 = texto2.getElementsByClassName("a-section a-spacing-none a-spacing-top-small")[0];
			texto3.insertAdjacentHTML('afterend', "<div class='mydiv'><span style='color: red; font-size: 11pt'> *No hay envíos a Canarias* </span></div>");
		}
		console.log(respuesta25[a]);
	};
}

// Una vez obtenido el texto se analiza para saber si realiza envíos a Canarias o no, esto se hace buscando las
// frases que te lo indican. Si alguna de las frases existe se almacena un true en un array y si no un false. 
// Por último se envía este último array a la función que mostrará el mensaje en la página.

function detecting(response2){

	var respuesta, respuesta3, respuesta4;
	var respuesta2 = [];
	for (var i = 0; i < response2.length; i++){
		respuesta = response2[i].text.indexOf('El vendedor que has elegido para este producto no realiza envíos a');
		respuesta3 = response2[i].text.indexOf('Este producto no puede ser enviado a ');
		respuesta4 = response2[i].text.indexOf('En estos momentos, no hay vendedores que realicen envíos a');
		if (respuesta != -1 || respuesta3 != -1 || respuesta4 != -1){
			respuesta2.push(true); // Verdadero es que NO realiza envíos
		}else {
			respuesta2.push(false);
		}
	}
	final(respuesta2);
}

// Esta función es la que obtiene el texto de las urls dadas, esto lo hace mediante fetch.

async function processUrl(url) {
  try {
    const text = await (await fetch(url)).text();
    return {url, text};
  } catch (error) {
    return {url, error};
  }
}

// Aquí vamos guardando las etiquetas hasta dar con el atributo "data-index" el cual enumera todos los productos
// que salen en el página. Hacemos lo mismo para obtener la url de los productos iterando todos los objetos del 
// data-index. 
// La obtención del texto de las urls dadas no lo entiendo muy bien, a grandes rasgos Promise.all es una especie 
// bucle que envía las urls a la función processUrl, esta devuelve una espece de array con los parámetros url y 
// text. El array result se envía a la siguiente función para analizar el texto.

function searching(){
	var buscar, texto15, objetos;
	var urls = [];
	buscar = document.getElementById("search");
	texto15 = buscar.getElementsByClassName("s-result-list s-search-results sg-row")[1];
	objetos = texto15.querySelectorAll("[data-index]").length;
	for (var i = 0; i < objetos; i++){
		pr1 = texto15.querySelectorAll("[data-index]")[i].getElementsByClassName("a-link-normal")[0];
		if (typeof pr1 === "undefined"){
			urls.push("https://www.amazon.es/");
		}else {
			urls.push(pr1.href);
		}
		
	};
	(async () => {
  		const results = await Promise.all(urls.map(processUrl));
  		detecting(results);
  	})();
}

// Buscamos search en el HTML obtenido, lo que nos indica que estamos en la página de búsqueda, es decir, 
// que en la página inicial o cualquier otra (perfil, pedidos, direcciones, etc) no se va a ejecutar. 
// Si se encuentra search pasamos a la siguiente función.
function analyze(texto){
	var index;
	index = texto.indexOf('id="search"');
	if (index != -1){
		searching();
	}
}

// Obtenemos el HTML de la página actual, solo se activa si está en amazon.es
var texto = document.body.outerHTML;

analyze(texto);