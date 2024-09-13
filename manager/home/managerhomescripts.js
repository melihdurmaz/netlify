
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}
function loadEmploye() {
    const token = localStorage.getItem('bearerToken');
    if (token) {
        fetch('http://localhost:8000/organization/get-members', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const employeContainer = document.getElementById('employee-container');

                // Tabloyu oluşturma
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                        <th>Username</th>
                        <th>Verified</th>
                    </tr>
                `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');

                // Her çalışan için tablo satırı oluşturma
                data.forEach(employe => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employe.username}</td>
                        <p></p>
                        <td>${employe.is_verified ? 'Yes' : 'No'}</td>
                    `;
                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
                employeContainer.appendChild(table);
            })

    } else {
        console.log('token yok');
        document.getElementById('username').textContent = 'Giriş Yapılmadı';
    }
}
function addUserToList(username) {
    const employeContainer = document.getElementById('employee-container');

    const row = document.createElement('tr');
    row.innerHTML = `
                        <td>${username}</td>
                    `;
    const tbody = document.createElement('tbody');
    tbody.appendChild(row);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    employeContainer.appendChild(table);

}
function addUserToBackend(username) {
    const token = localStorage.getItem('bearerToken'); // Bearer token varsa al
    fetch('http://localhost:8000/organization/add-member', {  // Backend URL'si
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Bearer token gerekiyorsa
        },
        body: JSON.stringify({ telegram_username: username })  // Gönderilen veri
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                addUserToList(username); // Kullanıcı başarılı eklenirse listeye ekle
            } else {
                alert('Kullanıcı eklenirken bir hata oluştu: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            alert('Kullanıcı eklenirken bir hata oluştu.');
        });
}
function logout() {
    localStorage.removeItem('bearerToken');
    window.location.href = '/index.html';
}
document.getElementById('logout-button').addEventListener('click', function (event) {
    event.preventDefault(); // Varsayılan tıklama davranışını engelle
    logout(); // Çıkış yapma fonksiyonunu çağır
});
document.getElementById('add-user-button').addEventListener('click', function () {
    const usernameInput = document.getElementById('username').value;

    if (usernameInput) {
        // Kullanıcı adı boş değilse backend'e gönder
        addUserToBackend(usernameInput);
        document.getElementById('username').value = ''; // Girdi alanını temizle
    } else {
        alert('Lütfen bir kullanıcı adı girin');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // localStorage'dan token'ı al
    const token = localStorage.getItem('bearerToken');
    if (token) {
        // Token'ı çözümle
        const decodedToken = parseJwt(token);
        // şirket adınını sayfada göster
        document.getElementById('name').textContent = decodedToken.name;
    } else {
        alert('Lütfen giriş yapın.');
        window.location.href = '/index.html';
    }
    loadEmploye();
});
