import {getUser} from "../ServerClient/serverClient.mjs";

document.addEventListener("DOMContentLoaded", function() {
    localStorage.setItem("currentUser", "");

    const form = document.querySelector('form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Benutzerdaten
        const userData = {
            email: email,
            password: password
        };
        // Überprüfung des Benutzers
        checkUser(userData);

        let user = await getUser(userData.email);
        userData.name = user.name;

        localStorage.setItem('currentUser', JSON.stringify(userData));
    });
    
    function checkUser(data) {
        const serverUrl = 'http://localhost:3000/users';

        fetch(`${serverUrl}?email=${data.email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(users => {
                const user = users[0];
                if (!user) {
                    console.log('Benutzer existiert nicht');
                    alert("Benutzer existiert nicht");
                    return;
                }
                if (user.password !== data.password) {
                    console.log('Falsches Passwort');
                    alert("Falsches Passwort")
                    return;
                }
                window.location.href = 'mainpage.html';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});
