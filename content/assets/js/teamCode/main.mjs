import {getUser} from "./ServerClient/serverClient.mjs";

let user = await getUser(JSON.parse(localStorage.getItem('currentUser')).email);

let x = document.getElementById("Account");
x.innerHTML = user.name;
