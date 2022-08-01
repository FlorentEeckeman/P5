let url = new URL(window.location.href);
let idCommand = url.searchParams.get("id");
document.getElementById("orderId").innerHTML = idCommand;