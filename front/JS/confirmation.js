let url = new URL(window.location.href);
let idCommand = url.searchParams.get("id");
// recupère l'ID dans l'Url
document.getElementById("orderId").innerHTML = idCommand;