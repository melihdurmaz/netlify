window.onload = function () {
    fetch('http://127.0.0.1:8000/organization/projects', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects-container');
        data.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project');
            projectDiv.innerHTML = `
            <a href="/project/home.html?id=${project.project_id}"><h3>${project.project_name}</h3></a>
            <p>Durum: ${project.project_status ? 'Aktif' : 'Pasif'}</p>
        `;
            container.appendChild(projectDiv);
        });
    })
    .catch(error => {
        console.error('Projeler alınırken hata oluştu:', error);
    });
};
// localstrogade ki tokeni çözmek için
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}
function load() {
    const token = localStorage.getItem('bearerToken');
    if (token) {
        // fetch(`http://127.0.0.1:8000/user/check-verified`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //     }
        // })
            // .then(response => response.json())
            // .then(data => {
                // const container = document.getElementById('verification-container');
                // if (data == false) {
                //     alert('Hesabınız onaylanmamıştır. Lütfen onaylayınız.');
                    const verifyButton = document.createElement('button');
                    verifyButton.textContent = 'Verifiy Et';
                    verifyButton.className = 'verification-button'; // CSS sınıfı eklenir
                    // Buton 'verification-container' div'ine eklenir
                    const verificationContainer = document.getElementById('verification-container');
                    verificationContainer.appendChild(verifyButton);
                    verifyButton.onclick = () => {
                        fetch(`http://localhost:8000/telegram-task/send-message`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                window.location.href = data;
                            })
                            .catch(error => {
                                console.error('Davet kabul edilirken bir hata oluştu:', error);
                            });
                    }
                    // Daha önce eklenmiş olabilecek butonları temizle
                    container.innerHTML = '';
                    container.appendChild(verifyButton);
            //     }
            //     else {
            //         alert('Hesabınız onaylanmıştır.');
            //     }
            // // })
            // .catch(error => {
            //     console.error('Davet kabul edilirken bir hata oluştu:', error);
            // });

        fetch('http://127.0.0.1:8000/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                const button = document.getElementById('twitter-button');
                if (data.twitter) {

                    button.classList.add('hidden');
                }
                else {
                    button.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Kullanıcı bilgileri alınırken bir hata oluştu:', error);

            });

    }
}
//sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function () {
    // localStorage'dan token'ı al
    const token = localStorage.getItem('bearerToken');

    if (token) {
        // Token'ı çözümle
        const decodedToken = parseJwt(token);
        // Kullanıcı adını sayfada göster
        document.getElementById('username').textContent = decodedToken.username;

    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('bearerToken', token);
        } else {
            alert('Lütfen giriş yapın.');
            window.location.href = '/index.html';
        }
    }
    load();
    // loadInvites();


});
async function startTwitterConnect() {
    const token = localStorage.getItem('bearerToken');
    const authUrl = `http://127.0.0.1:8000/twitter/authorize-url`;
    try {
        const response = await fetch(authUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = data; // Assuming the server responds with the authorization URL
        } else {
            document.getElementById('twitter-error-message').innerText = 'Twitter connection failed: ' + response.statusText;
        }
    } catch (error) {
        document.getElementById('twitter-error-message').innerText = 'An error occurred: ' + error.message;
    }
}
function createurl() {
    const token = localStorage.getItem('bearerToken');
    const decodedToken = parseJwt(token);
    const url = `http://127.0.0.1:8000/telegram/register?ref=${decodedToken.id}`;
    navigator.clipboard.writeText(url);
}
function logout() {
    localStorage.removeItem('bearerToken');
    window.location.href = '/index.html';
}
document.getElementById('logout-button').addEventListener('click', function (event) {
    event.preventDefault(); // Varsayılan tıklama davranışını engelle
    logout(); // Çıkış yapma fonksiyonunu çağır
});
