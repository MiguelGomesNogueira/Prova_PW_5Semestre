document.addEventListener('DOMContentLoaded', () => {
    const caixaNoticias = document.getElementById('caixa-noticias');
    let currentPage = 1;
    const pageSize = 10; 

        
    async function buscarNoticias(pageNumber) {
        try {
            const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v3/noticias/?page=${pageNumber}&qtd=${pageSize}`);
            const dados = await resposta.json();
            exibirNoticias(dados.items);
            updatePaginationButtons(pageNumber, dados.totalPages);
        } catch (erro) {
            console.error('Erro ao buscar notícias:', erro);
        }
    }

    
    function tempoDesdePublicacao(dataString) {
        const agora = new Date();
        const dataPublicacao = new Date(Date.parse(dataString));

        const diffTime = agora.getTime() - dataPublicacao.getTime();
        const diffDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDias === 0) {
            return 'Publicado hoje';
        } else if (diffDias === 1) {
            return 'Publicado ontem';
        } else {
            return `Publicado há ${diffDias} dias`;
        }
    }

    
    function exibirNoticias(noticias) {
        caixaNoticias.innerHTML = '';

        const listaNoticias = document.createElement('ul');
        listaNoticias.className = 'lista-noticias';

        noticias.forEach(item => {
            const itemNoticia = document.createElement('li');
            itemNoticia.className = 'item-noticia';

            const imagem = document.createElement('img');
            const retornoImagem = JSON.parse(item.imagens);
            imagem.src = 'https://agenciadenoticias.ibge.gov.br/' + retornoImagem.image_intro;
            imagem.className = 'noticia-imagem';

            const conteudo = document.createElement('div');
            conteudo.className = 'noticia-conteudo';

            const titulo = document.createElement('h2');
            titulo.textContent = item.titulo;

            const descricao = document.createElement('p');
            descricao.textContent = item.introducao;

            const editorialTempoDiv = document.createElement('div');
            editorialTempoDiv.className = 'editorial-tempo';

            const editorial = document.createElement('p');
            const editoriaisComHash = item.editorias.split(';').map(e => `#${e.trim()}`).join(' ');
            editorial.textContent = editoriaisComHash;

            const tempoPublicacao = document.createElement('p');
            tempoPublicacao.textContent = tempoDesdePublicacao(item.data_publicacao);

            editorialTempoDiv.appendChild(editorial);
            editorialTempoDiv.appendChild(tempoPublicacao);

            const botaoLeiaMais = document.createElement('button');
            botaoLeiaMais.textContent = 'Leia Mais';
            botaoLeiaMais.onclick = () => {
                window.open(item.link, '_blank');
            };

            conteudo.appendChild(titulo);
            conteudo.appendChild(descricao);
            conteudo.appendChild(editorialTempoDiv);
            conteudo.appendChild(botaoLeiaMais);

            itemNoticia.appendChild(imagem);
            itemNoticia.appendChild(conteudo);
            listaNoticias.appendChild(itemNoticia);

            const linha = document.createElement('hr');
            listaNoticias.appendChild(linha);
        });

        caixaNoticias.appendChild(listaNoticias);
    }

    function updatePaginationButtons(currentPage, totalPages) {
        const paginationList = document.getElementById('pagination-list');
        paginationList.innerHTML = ''; 

        const maxVisibleButtons = 10; 
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('inactive');
            if (i === currentPage) {
                button.classList.remove('inactive');
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                buscarNoticias(currentPage);
            });
            const listItem = document.createElement('li');
            listItem.appendChild(button);
            paginationList.appendChild(listItem);
        }
    }

    buscarNoticias(currentPage);
});


const modal = document.getElementById('modal');

function openModal() {
    modal.showModal();
}

function closeModal() {
    modal.close();
}

function applyChanges() {
    closeModal();
}
