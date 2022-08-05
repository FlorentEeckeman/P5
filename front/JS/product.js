const myProduct = document.getElementsByClassName("item")[0];
let url = new URL(window.location.href);
let id = url.searchParams.get("id");
let myStockage = localStorage;
let KanapName = ""
let indiceFind = false;
let itemsGroup = [];
disableSubmit(true);
// requête pour récupérer les infos du produits
fetch("http://127.0.0.1:3000/api/products/" + id)
.then((response) => {
    if (!response.ok) {
       
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.json();
  })
  // affiche dynamiquement les éléments du produit sur la page html
  .then((data) => 
     {  KanapName = data.name
        let imgElement = document.createElement("img");
        imgElement.setAttribute("src",data.imageUrl);
        imgElement.setAttribute("alt",data.altTxt);

        myProduct.getElementsByClassName("item__img")[0].appendChild(imgElement);

        const nameElement = document.createTextNode(data.name);
        const priceElement = document.createTextNode(data.price); 
        const descriptionElement = document.createTextNode(data.description); 
        
        document.getElementById("title").appendChild(nameElement);
        document.getElementById("price").appendChild(priceElement);
        document.getElementById("description").appendChild(descriptionElement);

        for (const colors in data.colors){
        let colorsChose = document.createElement("option");
        colorsChose.appendChild(document.createTextNode(data.colors[colors]));
        colorsChose.setAttribute("value",data.colors[colors]);
        document.getElementById("colors").appendChild(colorsChose);
        };
        
    }
  ).catch((error) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(`Error: ${error.message}`));

  });


 disableSubmit(false);

// parametre l'ajour du produit au localStorage
document.getElementById("addToCart").addEventListener("click", function() {

   if (document.getElementById("colors").value == "" && document.getElementById("quantity").value == 0 ){
          alert('Veuillez choisir une couleur et une quantitée svp' )
        }
        else if(document.getElementById("colors").value == ""){
          alert('Veuillez choisir une couleur svp')
        }
        else if(document.getElementById("quantity").value == 0){
          alert('Veuillez choisir une quantitée svp')
        }
        else {
    let quantityProduct = document.getElementById("quantity").value;
    var select = document.getElementById('colors');
    var colorTake = select.options[select.selectedIndex].value;
   
    let listAddToCard = { 
        "id": id,
        "quantité" : quantityProduct,
        "coleur" : colorTake,
    };
    alert(`Vous avez ajouté ${quantityProduct} ${KanapName} de couleur ${colorTake} à votre panier`)

    for(let obj= 0 ; obj< myStockage.length; obj++) {
      console.log(obj);
    let test = JSON.parse(myStockage.getItem(obj));
   if(test !== null && test.id == id ){

    if(test.coleur == colorTake){

      let valeu1 = parseInt(test.quantité);
      let valeu2 = parseInt(quantityProduct);
  
      var testval = valeu1 += valeu2;
      let listAddItemToCard = { 
        "id": id,
        "quantité" : testval,
        "coleur" : colorTake
    }
      indiceFind = true;
      myStockage.setItem(obj,JSON.stringify(listAddItemToCard))
      break;
    }
   }
  }
  if (indiceFind !== true){myStockage.setItem(myStockage.length,JSON.stringify(listAddToCard))};
  console.log(myStockage);
}});
// function permettant d'activé désactivé le bouton 'commander'
function disableSubmit(disabled) {
  if (disabled) {
    document
      .getElementById("addToCart")
      .setAttribute("disabled", true);
  } else {
    document
      .getElementById("addToCart")
      .removeAttribute("disabled");
  }
}


