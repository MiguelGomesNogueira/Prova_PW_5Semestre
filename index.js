document.addEventListener('DOMContentLoaded', () => {
    const caixaNoticias = document.getElementById('caixa-noticias');

    async function buscarNoticias() {
        try {
            const resposta = await fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?page=1');
            const dados = await resposta.json();
            exibirNoticias(dados.items.slice(0, 10)); 
        } catch (erro) {
            console.error('Erro ao buscar notícias:', erro);
        }
    }

    function tempoDesdePublicacao(dataString) {
        const agora = new Date()
        const dataPublicacao = new Date(dataString);
        const diffTime = Math.abs(agora - dataPublicacao);
        console.log(dataPublicacao)
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
        const listaNoticias = document.createElement('ul');
        noticias.forEach(item => {
            const itemNoticia = document.createElement('li');
            itemNoticia.className = 'item-noticia';

            const titulo = document.createElement('h2');
            titulo.textContent = item.titulo;

            const descricao = document.createElement('p');
            descricao.textContent = item.introducao;

            const editorial = document.createElement('p');
            editorial.textContent = `#${item.editorial}`;

            const tempoPublicacao = document.createElement('p');
            tempoPublicacao.textContent = tempoDesdePublicacao(item.data_publicacao);

            const botaoLeiaMais = document.createElement('button');
            botaoLeiaMais.textContent = 'Leia Mais';
            botaoLeiaMais.onclick = () => {
                window.open(item.link, '_blank');X
            };

            let retornoImagem = JSON.parse(item.imagens);

            const imagem = document.createElement('img');
            imagem.src = 'https://agenciadenoticias.ibge.gov.br/' + retornoImagem.image_intro;

            itemNoticia.appendChild(titulo);
            itemNoticia.appendChild(descricao);
            itemNoticia.appendChild(editorial);
            itemNoticia.appendChild(tempoPublicacao);
            itemNoticia.appendChild(botaoLeiaMais);
            itemNoticia.appendChild(imagem);
            listaNoticias.appendChild(itemNoticia);
        });
        caixaNoticias.appendChild(listaNoticias);
    }

    buscarNoticias();
});

function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }
  
  // Função para fechar o modal
  function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

