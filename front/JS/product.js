const myProduct = document.getElementsByClassName("item")[0];
let url = new URL(window.location.href);
let id = url.searchParams.get("id");
let myStockage = localStorage;
let KanapName = ""
let indiceFind = false;
let itemsGroup = [];
disableSubmit(true);

fetch("http://127.0.0.1:3000/api/products/" + id)
.then((response) => {
    if (!response.ok) {
       
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.json();
  })
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
let myInput;
      document.getElementById("colors").addEventListener("change", function(){
        if (document.getElementById("colors").value !== "" ){
          disableSubmit(false);
        }
        else {
          console.log(document.getElementById("colors").value + "hola");
          disableSubmit(true);
        }});

document.getElementById("addToCart").addEventListener("click", function() {
   
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
});

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


