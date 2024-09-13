
document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('register_email').value;
    const name = document.getElementById('register_name').value;
    const password = document.getElementById('register_password').value;

    fetch('http://127.0.0.1:8000/organization/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, name: name, password: password })
    })
        .then(response => response.json())
        .then(data => {
            if (typeof data === 'string') {
                localStorage.setItem('bearerToken', data);
                // window.location.href = '/managerHome.html';
            } else {
                document.getElementById('login-error-message').innerText = 'Login failed: ' + (data.error || 'Unknown error');
            }
        })
        .catch(error => {
            document.getElementById('login-error-message').innerText = 'Login failed: ' + error.message;
        });
});

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/organization/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => response.json())
        .then(data => {
            if (typeof data === 'string') {
                localStorage.setItem('bearerToken', data);
                window.location = '../home/managerHome.html';
            } else {
                document.getElementById('login-error-message').innerText = 'Login failed: ' + (data.error || 'Unknown error');
            }
        })
        .catch(error => {
            document.getElementById('login-error-message').innerText = 'Login failed: ' + error.message;
        });
});
