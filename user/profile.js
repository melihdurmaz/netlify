
document.getElementById('change-password-button').addEventListener('click', function () {
    if (confirm('şifrenizi değiştirmek istediğinizden emin misiniz?')) {
        const token = localStorage.getItem('bearerToken');
        fetch('http://127.0.0.1:8000/auth/chance-password', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('mail adresinize şifre değiştirme bağlantısı gönderildi.');
                } else {
                    alert('mail adresinize şifre değiştirme bağlantısı gönderilemedi.');
                }
            })
            .catch(error => {
                console.error('Hesap silinirken bir hata oluştu:', error);
                alert('Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin.');
            });
    }
});


document.getElementById('delete-account-button').addEventListener('click', function () {
    if (confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
        const token = localStorage.getItem('bearerToken');
        fetch('http://127.0.0.1:8000/auth/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Hesabınız başarıyla silindi.');
                    localStorage.removeItem('bearerToken');
                    window.location.href = '/index.html'; // Login sayfasına yönlendir
                } else {
                    alert('Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin.');
                }
            })
            .catch(error => {
                console.error('Hesap silinirken bir hata oluştu:', error);
                alert('Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin.');
            });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('bearerToken');
    if (!token) {
        alert('Lütfen giriş yapın.');
        window.location.href = '/index.html'; // Login sayfasına yönlendir
    } else {
        fetchProfileData(token);
    }

    function fetchProfileData(token) {
        fetch('http://127.0.0.1:8000/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const twitterSpan = document.getElementById('twitter');
                const disconnectButton = document.getElementById('disconnect-twitter');
                const connectButton = document.getElementById('connect-twitter');
                if (data.twitter && data.twitter.username) {
                    twitterSpan.textContent = data.twitter.username;
                    disconnectButton.classList.remove('hidden'); // Butonu göster
                    connectButton.classList.add('hidden'); // "Bağla" butonunu gizle
                } else {
                    twitterSpan.textContent = 'Bağlı twitter hesabı yok';
                    connectButton.classList.remove('hidden'); // "Bağla" butonunu göster

                }
                document.getElementById('username').textContent = data.telegram.username;
                document.getElementById('email').textContent = data.email;
                document.getElementById('organization_name').textContent = data.organization_name ? data.organization_name : 'Bağlı organizasyon yok';
                // document.getElementById('twitter').textContent = data.twitter ? data.twitter.username : 'Bağlı twitter hesabı yok';
                document.getElementById('created_at').textContent = new Date(data.created_at).toLocaleDateString();

            })
            .catch(error => {
                console.error('Kullanıcı bilgileri alınırken bir hata oluştu:', error);
                alert('Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.');
                window.location.href = '/index.html'; // Login sayfasına yönlendir
            });
    }

    document.getElementById('logout-button').addEventListener('click', function () {
        localStorage.removeItem('bearerToken');
        window.location.href = '/index.html'; // Login sayfasına yönlendir
    });
});


document.getElementById('disconnect-twitter').addEventListener('click', function () {
    const token = localStorage.getItem('bearerToken');
    fetch('http://127.0.0.1:8000/twitter/disconnect-twitter', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                alert('Twitter bağlantısı başarıyla koparıldı');
                document.getElementById('twitter').textContent = 'Bağlı değil';
                document.getElementById('disconnect-twitter').classList.add('hidden'); // Butonu gizle
            } else {
                alert('Bağlantıyı koparırken bir hata oluştu');
            }
        })
        .catch(error => {
            console.error('Bağlantıyı koparırken bir hata oluştu:', error);
        });
});


document.getElementById('connect-twitter').addEventListener('click', function () {
    const token = localStorage.getItem('bearerToken');
    const authUrl = `http://127.0.0.1:8000/twitter/authorize-url`;
    try {
        fetch(authUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = data;
            })
            .catch(error => {
                console.error('Bağlantıyı koparırken bir hata oluştu:', error);
            });
    } catch (error) {
        document.getElementById('twitter-error-message').innerText = 'An error occurred: ' + error.message;
    }
});
