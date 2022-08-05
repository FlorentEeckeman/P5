
let myStockage = localStorage;
let itemIterator = 0;
let urlPost = "http://localhost:3000/api/products/order"
let urlBase = location.origin
let urlIdOrder = urlBase+"/front/html/confirmation.html?id="
let itemCart = []
let itemsGroup = [];
let itemsGroupe = [];
let products = [];
let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};

sortData()

// ajoute un élément article avec un id pour chaque élément dans le loclstorage

for(let u =0 ; u < itemsGroupe.length; u++) {
  const linkItemi = document.getElementById("cart__items");
  linkItemi.insertAdjacentHTML('beforeend', `<article class="cart__item" id="${u}"></article>`);
}

//déclaration de la fonction qui va gérer l'ajout des nouveaux éléments 

let getPost = async function (element, i) {
  let response = await fistStep(element, i)
  return response 
}

// appel de la fonction selon le nombre d'élément dans le localStorage

for (let i=0; i<myStockage.length; i++){
  getPost(itemsGroupe, i)
}

// fonction qui ajout un élément sur la page HTML

function fistStep(item, i){
  return new Promise(function (resolve, reject) {

  fetch("http://127.0.0.1:3000/api/products/"+ item[i].id)
  .then((response) => {  
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.json();
  })
// ajoute un élément canapé sur la page HTML
  .then((data) => {
              const linkItem = document.getElementById(i);
                linkItem.setAttribute("data-id",data._id);
                linkItem.setAttribute("data-color",item[i].coleur);
                linkItem.insertAdjacentHTML('afterbegin',`
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}" d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${item[i].coleur}</p>
                    <p>${data.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item[i].quantité}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
                  `); 
  })
  .catch((error) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(`Error: ${error.message}`));
  })
  // ajout des listerners permetttant d'appeler les fonction de recalcul du nombre d'article ou de suppression d'article
  .then( () => {
    let elementChange = document.getElementsByName("itemQuantity");
    let deleteItemCheck = document.querySelectorAll("p.deleteItem");
    elementChange.forEach(element => {
      element.addEventListener('change', function() {
        if (element.value > 100){element.value = 100 };
        let selectArticleChange = element.closest('.cart__item');
        let articleIdChange = selectArticleChange.getAttribute("data-id");
        let articleColorChange =selectArticleChange.getAttribute("data-color");
        reductNumberItem(articleIdChange, articleColorChange, element.value,);
      }); 
    });
    deleteItemCheck.forEach(element => {
      let selectArticleDelete = element.closest('.cart__item');
      let articleIdDelete = selectArticleDelete.getAttribute("data-id");
      let articleColorDelete =selectArticleDelete.getAttribute("data-color");
      element.addEventListener('click', function() {
        deleteItem(articleIdDelete, articleColorDelete);
        selectArticleDelete.remove();
      }); 
    });
    totalPrice();
    resolve('ok')
  }).catch((error) => { reject(error)})
})
}

// ajout du listener  permettant de lancer la commande 

document.getElementById("order").addEventListener("click", function(event) { 
  event.preventDefault()
  verifRegEx();
});

// fonction reduisant le nombre de canapé

function reductNumberItem(id, color, quantity){
  for(let i = 0; i< myStockage.length; i++) {
    let test = JSON.parse(myStockage.getItem(i));
   if(test !== null && test.id == id ){
    if(test.coleur == color){
      let listAddItemToCard = { 
        "id": id,
        "quantité" : quantity,
        "coleur" : color
      }
      myStockage.setItem(i,JSON.stringify(listAddItemToCard))
      break;
    }
   }
  }totalPrice()
}

// fonction pour supprimer des canapé sur le localStorage

function deleteItem(id, color){
for(const obj in myStockage) {
  let test = JSON.parse(myStockage.getItem(obj));
  if(test != null){
    if(test.id == id){
      if(test.coleur == color){
        myStockage.removeItem(obj)
        break;
  }}}}
  totalPrice()
  sortData()
}

// fonction calculant le pric total

function totalPrice(){
  let priceCalc = 0;
  let quantityCalc = 0;
    fetch("http://127.0.0.1:3000/api/products/")
    .then((response) => {
      if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
      }
    return response.json();
  })
  .then((data) => {
    for(const obj in myStockage) {  
      let test = JSON.parse(myStockage.getItem(obj));
      if(test !== null){
        let priceId = test.id
          for(const i in data){
            if (test.id === data[i]._id){
            priceId = data[i].price;
            }
          }
        priceCalc += test.quantité * priceId;
        quantityCalc += Number.parseInt(test.quantité);
      }
    }
    document.getElementById("totalPrice").innerHTML = priceCalc;
    document.getElementById("totalQuantity").innerHTML = quantityCalc;
  })
  .catch((error) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(`Error: ${error.message}`));
  });
}

// fonction permettant le trie des canapé en fonction de leur type

function sortData(){
  itemsGroupe = []
  // ajout des éléments du localStorage dans l'array itemsGroupe
  for(const obj in myStockage) {
    let articles = JSON.parse(myStockage.getItem(obj));
    if (articles !== null){
      itemsGroupe.push(articles);
    }}
    // trie les éléments d'itemGroupe
  for(const obj in myStockage) {
    itemsGroupe.sort(function(a, b){
      if(a.id < b.id) { return -1; }
      if(a.id > b.id) { return 1; }
        return 0;
      })}
  myStockage.clear()
    for( let i = 0; i < itemsGroupe.length; i++){
        myStockage.setItem(i,JSON.stringify(itemsGroupe[i]))
      }
}

// fonction qui vérifie les champs du formulaire

function verifRegEx(){
  var firstName1 = document.getElementById('firstName').value;
  var lastName1 = document.getElementById('lastName').value;
  var address1 = document.getElementById('address').value;
  var city1 = document.getElementById('city').value;
  var email1 = document.getElementById('email').value;
  let letter = /^[a-zA-Z]+$/
  let letterAndNumber = /^[a-zA-Z0-9\s\,\''\-]*$/;
  let emailverif = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  if(!firstName1.match(letter)){
    firstNameErrorMsg.innerHTML = 'Prénom Non valide, Veuillez le ressaisir'
    return false;
  }
  else {contact.firstName = firstName1;
    firstNameErrorMsg.innerHTML = ''
  }
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  if(!lastName1.match(letter)){
    lastNameErrorMsg.innerHTML ="Nom Non valide, Veuillez le ressaisir"
    return false;
  }
  else {contact.lastName = lastName1;
    lastNameErrorMsg.innerHTML =""
  }
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  if(!address1.match(letterAndNumber) || address1 == ""  ){
    addressErrorMsg.innerHTML = "Addresse Non valide, Veuillez le ressaisir"
    return false;
  }
  else {contact.address = address1;
    console.log(document.getElementById('address').value)
    addressErrorMsg.innerHTML = ''
  }
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  if(!city1.match(letter)){
  
    cityErrorMsg.innerHTML = "Ville Non valide, Veuillez le ressaisir"
    return false;
  }
  else {contact.city = city1;
    cityErrorMsg.innerHTML = ""
  }
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  if(!email1.match(emailverif)){
    emailErrorMsg.innerHTML = "email Non valide, Veuillez le ressaisir"
    return false;
  }
  else {contact.email = email1;
    emailErrorMsg.innerHTML = ""
    collectDatas();
  }
}  
 
// fonction qui envoie la requête Post pour passer la commande

async function sendOrder(){
  try {
    const response = await fetch(urlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({contact,products})
  })
  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

const result = await response.json();
  return result;
  } catch (err) {
    console.log(err);
  }
}

// fonction qui collecte les id des produit du panier

function collectDatas() {
  let test = false;
  for(var x = 0 ; x < myStockage.length; x++) {
    let articles = JSON.parse(myStockage.getItem(x));
    if (articles !== null){
      products.push(articles.id);
      test = true;
    }
  }

// appel la fonction d'envoie de la requête

  if (test == true){
    sendOrder().then((data) => {
      let text = "Confirmez vous le bon de commande?\ncliquez sur OK pour valider ou Annuler.";
      if (confirm(text) == true) {
      window.location.href = urlIdOrder + data.orderId;
     /*  //myStockage.clear();*/
      } else {
        text = "You canceled!";
      }
    });
  }
  else alert ("remplissez le caddy d'abord ^^");
  }

  