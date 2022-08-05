let url = location.origin
const myList = document.getElementById("items");

//requête pour récupéré les données produit

fetch("http://127.0.0.1:3000/api/products")
.then((response) => {
    if (!response.ok) {
       
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.json();
  })
//requête pour récupéré les données produit
  .then((data) => {
    for (const product of data) {
      const linkItem = document.createElement("a");
      linkItem.setAttribute("href", url+`/front/html/product.html?id=${product._id}`);
      const listItem = document.createElement("article");
     
      const nameElement = document.createElement("h3");
      nameElement.textContent = product.name;

      const priceElement = document.createElement("p");
      priceElement.textContent = `${product.price} €`;

      const imgElement = document.createElement("img");
      imgElement.setAttribute("src",product.imageUrl);
      imgElement.setAttribute("alt",product.altTxt);

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = product.description;


      listItem.append(
        imgElement,
        priceElement,
        nameElement,
        descriptionElement
      );
      linkItem.appendChild(listItem);
      myList.appendChild(linkItem);
    }
  }).catch((error) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(`Error: ${error.message}`));

  });
