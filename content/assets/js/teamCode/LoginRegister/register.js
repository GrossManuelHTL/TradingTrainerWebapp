const serverUrl = 'http://localhost:3000/users';

function checkIfUserExists(email) {
    return fetch(`${serverUrl}?email=${email}`)
        .then(response => response.json())
        .then(data => {
            return data.length > 0;
        })
        .catch(error => {
            console.error('Error:', error);
            return false; // Fehler bei der Anfrage
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        // Überprüfen, ob das Passwort mit der Bestätigung übereinstimmt
        if (password1 !== password2) {
            alert("Passwörter stimmen nicht überein");
            return;
        }

        // Überprüfen, ob der Benutzer bereits existiert
        checkIfUserExists(email)
            .then(userExists => {
                if (userExists) {
                    alert("Benutzer mit dieser E-Mail-Adresse existiert bereits");
                } else {
                    const userData = {
                        name: name,
                        email: email,
                        password: password1, // Hier verwenden wir nur das erste Passwortfeld
                        money: 50000,
                        stocks: []
                    };

                    // Daten an den JSON-Server senden
                    sendDataToServer(userData);
                }
            });
    });

    function sendDataToServer(data) {
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = 'http://localhost:63342/ProjektSS/content/loginpage.html';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});
