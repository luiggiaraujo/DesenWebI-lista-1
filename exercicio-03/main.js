document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('imageForm');
    const imageGrid = document.getElementById('imageGrid');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errorMessage.textContent = '';
        imageGrid.innerHTML = '';

        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);
        const quantity = parseInt(document.getElementById('quantity').value);

        // Validação de formulário
        if (isNaN(width) || width <= 0) {
            errorMessage.textContent = 'Por favor, informe uma largura válida.';
            return;
        }

        if (isNaN(height) || height <= 0) {
            errorMessage.textContent = 'Por favor, informe uma altura válida.';
            return;
        }

        if (![3, 5, 10, 20].includes(quantity)) {
            errorMessage.textContent = 'Por favor, selecione uma quantidade válida de imagens.';
            return;
        }

        for (let i = 0; i < quantity; i++) {
            // Gerar uma seed única para cada imagem
            const seed = Date.now().toString() + Math.random().toString();

            const img = document.createElement('img');
            img.src = `https://picsum.photos/seed/${seed}/${width}/${height}.webp`;
            img.alt = 'Imagem aleatória';

            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.appendChild(img);

            // Ações da imagem
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('image-actions');

            // Botão de download
            const downloadLink = document.createElement('a');
            downloadLink.href = `https://picsum.photos/seed/${seed}/1920/1080.webp`;
            downloadLink.download = `imagem-${i + 1}.webp`;
            downloadLink.textContent = 'Baixar Full HD';
            downloadLink.target = '_blank';
            downloadLink.setAttribute('aria-label', 'Baixar imagem em Full HD');

            // Botão de copiar link
            const copyButton = document.createElement('button');
            copyButton.type = 'button';
            copyButton.textContent = 'Copiar Link';
            copyButton.setAttribute('aria-label', 'Copiar link da imagem');
            copyButton.addEventListener('click', function () {
                navigator.clipboard.writeText(img.src)
                    .then(() => alert('Link copiado!'))
                    .catch(err => alert('Erro ao copiar o link.'));
            });

            // Botão de compartilhar
            const shareButton = document.createElement('button');
            shareButton.type = 'button';
            shareButton.textContent = 'Compartilhar';
            shareButton.setAttribute('aria-label', 'Compartilhar imagem');
            shareButton.addEventListener('click', function () {
                const shareData = {
                    title: 'Imagem Aleatória',
                    text: 'Confira esta incrivel imagem aleatória gerada automaticamente!',
                    url: img.src
                };

                if (navigator.share) {
                    navigator.share(shareData)
                        .catch(err => alert('Erro ao compartilhar.'));
                } else {
                    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
                    window.open(whatsappUrl, '_blank');
                }
            });

            actionsDiv.appendChild(downloadLink);
            actionsDiv.appendChild(copyButton);
            actionsDiv.appendChild(shareButton);

            gridItem.appendChild(actionsDiv);
            imageGrid.appendChild(gridItem);
        }
    });
});