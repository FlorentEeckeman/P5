
let monStockage = localStorage;
let itemIterator = 0;
let itemsGroup = [];
let products = [];
let contact = {
  firstName: "dsq",
  lastName: "dsqzd",
  address: "dzqd",
  city: "dqd",
  email: "dzqdzq",
};

for(const obj in monStockage) {
let articles = JSON.parse(monStockage.getItem(obj));
if (articles !== null){
itemsGroup.push(articles)
itemsGroup.sort(function(a, b){
  if(a.id < b.id) { return -1; }
  if(a.id > b.id) { return 1; }
  return 0;
})}}
console.log(itemsGroup);
for (let i=0; i<monStockage.length; i++){
  requetteItem(itemsGroup[i].id, itemsGroup[i].quantité, itemsGroup[i].coleur);

}
setTimeout(function() {
    let elementChange = document.getElementsByName("itemQuantity");
    let deleteItemCheck = document.querySelectorAll("p.deleteItem");
    console.log(monStockage);
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
        deleteItem(articleIdDelete, articleColorDelete)
        selectArticleDelete.remove();
      }); 
    });
    
   
    totalPrice();
}, 500);

document.getElementById("order").addEventListener("click", function(event) { 
  verifRegEx();
});


function requetteItem(enter, quantité, couleur){ 
    fetch("http://127.0.0.1:3000/api/products/"+enter)
    .then((response) => {  
        if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
                const linkItem = document.getElementById("cart__items");
                linkItem.insertAdjacentHTML('afterbegin',`
                <article class="cart__item" data-id="${data._id}" data-color="${couleur}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}" d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${couleur}</p>
                    <p>${data.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantité}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`); 
    }).catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
    });
}
function reductNumberItem(id, color, quantity){
  for(const obj in monStockage) {
    let test = JSON.parse(monStockage.getItem(obj));
   if(test !== null && test.id == id ){
    if(test.coleur == color){
      let listAddItemToCard = { 
        "id": id,
        "quantité" : quantity,
        "coleur" : color
    }
      monStockage.setItem(obj,JSON.stringify(listAddItemToCard))
      break;
    }
   }
  }totalPrice()
}
function deleteItem(id, color){
for(const obj in monStockage) {
  let test = JSON.parse(monStockage.getItem(obj));
 if(test.id == id){
  if(test.coleur == color){
    monStockage.removeItem(obj)
    break;
  }}}
  totalPrice()
}
  function totalPrice(){
    let priceAdd;
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
    for(const obj in monStockage) {
      
      let test = JSON.parse(monStockage.getItem(obj));
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
  }
  ).catch((error) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(`Error: ${error.message}`));
  });
  }

function verifRegEx(){
  var firstName1 = document.getElementById('firstName').value;
  var lastName1 = document.getElementById('lastName').value;
  var address1 = document.getElementById('address').value;
  var city1 = document.getElementById('city').value;
  var email1 = document.getElementById('email').value;
  let letter = /^[a-zA-Z]+$/
  let letterAndNumber = /^[a-zA-Zéè0-9\s,'-]*$/;
  let emailverif = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 
  if(!firstName1.match(letter)){
    alert('regex first');
alert("Prénom Non valide, Veuillez le ressaisir");
    return false;
  }
  else {contact.firstName = firstName1;

  }
  if(!lastName1.match(letter)){
alert("Nom Non valide, Veuillez le ressaisir");
    return false;
  }
  else {contact.lastName = lastName1;

  }
  if(!address1.match(letterAndNumber)){
alert("Addresse Non valide, Veuillez le ressaisir");
    return false;
  }
  else {contact.address = address1;

  }
  if(!city1.match(letter)){
alert("Ville Non valide, Veuillez le ressaisir");
    return false;
  }
  else {contact.city = city1;

  }
  if(!email1.match(emailverif)){
alert("email Non valide, Veuillez le ressaisir");
    return false;
  }
  else {contact.email = email1;
    collectDatas();

  }
  
}  
function sendOrder(){
  console.log(contact);
alert("c'est parti let's gooo " + contact.firstName + "  " + contact.lastName + "  "  + contact.address + "  " + contact.city + "  " + contact.email + "  "+products );

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({contact,products}) 
    
  })
  .then(function(res) {
    if (res.ok) {
      console.log(res);
      alert(res);

      return res.json();
    }}).then(function(value) {
    alert("pam");
    let text = "Confirmez vous le bon de commande?\ncliquez sur OK pour valider ou Annuler.";
  if (confirm(text) == true) {
    monStockage.clear();
    window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?id=${value.orderId}`;
  } else {
    text = "You canceled!";
  }
  }).catch((error) => {
    alert(error);
  });;
}
function collectDatas() {
  let test = null;
  for(const obj in monStockage) {
    let articles = JSON.parse(monStockage.getItem(obj));
    if (articles !== null){
      products.push(articles.id);
      test = true;
    }
  }
  if (test === true){
    sendOrder();
  }
  else alert ("remplissez le caddy d'abord ^^");
  }

  