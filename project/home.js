document.addEventListener('DOMContentLoaded', function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const organization_id = urlParams.get('id');
    localStorage.setItem('organization_id', organization_id);
    const token = localStorage.getItem('bearerToken');
    fetch('http://127.0.0.1:8000/organization/get-project', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            organization_id: organization_id
        })
    }).then(response => response.json())
        .then(project  => {
            const projectDetails = document.getElementById('project-details');
            projectDetails.innerHTML = `
                <h2>${project.project_name}</h2>
                <p>Durum: ${project.project_status ? 'Aktif' : 'Pasif'}</p>
                <p>Proje ID: ${project.project_id}</p>
                <!-- Daha fazla bilgi eklenebilir -->
            `;
            
        })
        .catch(error => {
            console.error('Kullanıcı bilgileri alınırken bir hata oluştu:', error);

        });

});

function checkMembership() {
    const username = document.getElementById('username').value;
    const projectId=localStorage.getItem('organization_id');
    if (!username) {
        document.getElementById('result').innerText = 'Lütfen bir kullanıcı adı giriniz!';
        return;
    }
    fetch(`http://127.0.0.1:8000/organization/check-member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ organization_id: projectId,username: username })
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.getElementById('result').innerText = `${username} bu projenin bir üyesidir.`;
        } else {
            document.getElementById('result').innerText = `${username} bu projede yer almamaktadır.`;
        }
    })
    .catch(error => {
        console.error('Kontrol yapılırken hata oluştu:', error);
        document.getElementById('result').innerText = 'Bir hata oluştu, lütfen tekrar deneyiniz.';
    });
}