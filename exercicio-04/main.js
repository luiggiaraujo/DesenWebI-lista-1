document.addEventListener('DOMContentLoaded', function () {
    const photoForm = document.getElementById('photoForm');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const uploadPhoto = document.getElementById('uploadPhoto');
    const getLocationButton = document.getElementById('getLocationButton');
    const manualLocation = document.getElementById('manualLocation');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const photoPreview = document.getElementById('photoPreview');
    const mapPreview = document.getElementById('mapPreview');
    const previewSection = document.getElementById('preview');
    const recordsTableBody = document.querySelector('#recordsTable tbody');

    let photoData = null;
    let locationData = null;
    let map = null;
    let marker = null;

    // Verifica se o dispositivo tem câmera
    let hasCamera = false;

    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind === 'videoinput') {
                    hasCamera = true;
                }
            });
            if (!hasCamera) {
                takePhotoButton.textContent = 'Upload de Foto';
            }
        });

    // Evento para tirar foto ou fazer upload
    takePhotoButton.addEventListener('click', function () {
        if (hasCamera) {
            capturePhoto();
        } else {
            uploadPhoto.click();
        }
    });

    uploadPhoto.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                photoData = e.target.result;
                displayPhoto();
            };
            reader.readAsDataURL(file);
        }
    });

    function capturePhoto() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // Criar um elemento canvas para capturar a foto
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                const captureButton = document.createElement('button');
                captureButton.textContent = 'Capturar Foto';
                captureButton.addEventListener('click', function () {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0);
                    photoData = canvas.toDataURL('image/png');
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    video.remove();
                    captureButton.remove();
                    displayPhoto();
                });

                document.body.appendChild(video);
                document.body.appendChild(captureButton);
            })
            .catch(function (err) {
                alert('Erro ao acessar a câmera: ' + err.message);
            });
    }

    function displayPhoto() {
        photoPreview.src = photoData;
        previewSection.style.display = 'block';
    }

    // Evento para obter localização
    getLocationButton.addEventListener('click', function () {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                locationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                displayMap(locationData.latitude, locationData.longitude);
            }, function (error) {
                alert('Erro ao obter localização: ' + error.message);
                manualLocation.style.display = 'block';
            });
        } else {
            manualLocation.style.display = 'block';
        }
    });

    // Função para exibir o mapa
    function displayMap(lat, lng) {
        if (map) {
            map.remove();
        }
        map = L.map('mapPreview').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        marker = L.marker([lat, lng]).addTo(map);
        previewSection.style.display = 'block';
    }

    // Evento de submit do formulário
    photoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!photoData) {
            alert('Por favor, tire ou faça upload de uma foto.');
            return;
        }

        if (!locationData) {
            if (latitudeInput.value && longitudeInput.value) {
                locationData = {
                    latitude: parseFloat(latitudeInput.value),
                    longitude: parseFloat(longitudeInput.value)
                };
            } else {
                alert('Por favor, obtenha a localização ou informe manualmente.');
                return;
            }
        }

        const records = JSON.parse(localStorage.getItem('photoRecords')) || [];

        const newRecord = {
            id: Date.now(),
            title: title,
            description: description,
            photo: photoData,
            location: locationData,
            date: new Date().toLocaleString()
        };

        records.push(newRecord);
        localStorage.setItem('photoRecords', JSON.stringify(records));

        displayRecords();
        photoForm.reset();
        previewSection.style.display = 'none';
        photoData = null;
        locationData = null;
    });

    function displayRecords() {
        const records = JSON.parse(localStorage.getItem('photoRecords')) || [];
        recordsTableBody.innerHTML = '';

        records.forEach(function (record, index) {
            const row = recordsTableBody.insertRow();

            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = record.title;
            row.insertCell(2).textContent = record.description;
            row.insertCell(3).textContent = `Lat: ${record.location.latitude.toFixed(2)}, Lng: ${record.location.longitude.toFixed(2)}`;
            row.insertCell(4).textContent = record.date;

            const actionsCell = row.insertCell(5);

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Visualizar';
            viewButton.addEventListener('click', function () {
                openDetailsModal(record);
            });
            actionsCell.appendChild(viewButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', function () {
                openEditModal(record);
            });
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', function () {
                openConfirmDeleteModal(record.id);
            });
            actionsCell.appendChild(deleteButton);
        });
    }

    // Modal de detalhes
    const detailsModal = document.getElementById('detailsModal');
    const closeDetailsModalButton = document.getElementById('closeDetailsModal');
    const detailsPhoto = document.getElementById('detailsPhoto');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsDescription = document.getElementById('detailsDescription');
    const detailsMap = document.getElementById('detailsMap');

    function openDetailsModal(record) {
        detailsPhoto.src = record.photo;
        detailsTitle.textContent = record.title;
        detailsDescription.textContent = record.description;

        if (map) {
            map.remove();
        }
        map = L.map('detailsMap').setView([record.location.latitude, record.location.longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([record.location.latitude, record.location.longitude]).addTo(map);

        detailsModal.style.display = 'block';
    }

    closeDetailsModalButton.addEventListener('click', function () {
        detailsModal.style.display = 'none';
    });

    // Modal de confirmação de exclusão
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    let recordIdToDelete = null;

    function openConfirmDeleteModal(id) {
        confirmDeleteModal.style.display = 'block';
        recordIdToDelete = id;
    }

    confirmDeleteButton.addEventListener('click', function () {
        let records = JSON.parse(localStorage.getItem('photoRecords')) || [];
        records = records.filter(record => record.id !== recordIdToDelete);
        localStorage.setItem('photoRecords', JSON.stringify(records));
        displayRecords();
        confirmDeleteModal.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', function () {
        confirmDeleteModal.style.display = 'none';
    });

    // Modal de edição
    const editModal = document.getElementById('editModal');
    const closeEditModalButton = document.getElementById('closeEditModal');
    const editForm = document.getElementById('editForm');
    const editIdInput = document.getElementById('editId');
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionInput = document.getElementById('editDescription');

    function openEditModal(record) {
        editIdInput.value = record.id;
        editTitleInput.value = record.title;
        editDescriptionInput.value = record.description;

        editModal.style.display = 'block';
    }

    closeEditModalButton.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const id = parseInt(editIdInput.value);
        const title = editTitleInput.value.trim();
        const description = editDescriptionInput.value.trim();

        let records = JSON.parse(localStorage.getItem('photoRecords')) || [];
        const index = records.findIndex(record => record.id === id);

        if (index !== -1) {
            records[index].title = title;
            records[index].description = description;
            localStorage.setItem('photoRecords', JSON.stringify(records));
            displayRecords();
            editModal.style.display = 'none';
        }
    });

    // Inicializa a exibição dos registros
    displayRecords();
});