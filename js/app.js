import { setFirtsFiveItems } from "./filmesIniciais.js";
import { saveFilmes, getFilmes } from "./form.js";

const cardContainer = document.querySelector('.cards');


// Cria o objeto dos itens
function createFilme() {
    const filmes = getFilmes();

// após salvar ele cria o card do filme
    filmes.forEach((filme) => {
        createCard(filme.id,
            filme.titulo,
            filme.genero,
            filme.descricao,
            filme.imagem,
            filme.gostei,
            filme.naoGostei,
    
        );
    })
}

// Função que cria os cards dos filmes/series
function createCard(id, titulo, genero, descricao, imagem, gostei, naoGostei) {
    let htmlCard =`
        <div class="card" id="id${id}">
            <div class="title">
            <h2>${titulo}</h2>
            </div>
            <div class="gender">
                <p><strong>Gênero:</strong> ${genero}</p>
            </div>
            <div class="img">
                <img src="${imagem}" onerror="this.onerror=null; this.src='https://picsum.photos/800/600';" alt="${titulo}">
            </div>
            <div class="descricao">
                <p><strong>Descrição:</strong></p>
                <p class="description"> ${descricao != '' ? descricao : 'Sem descrição'}</p>
            </div>
            <ul class="feedback-list">
                <li class="gostei${id}"> <strong>Gostaram: </strong>${gostei}</li>
                <li class="naoGostei${id}"> <strong>Não gostaram: </strong>${naoGostei}</li>
                <li class="total${id}"> <strong>Total de votos: </strong>${gostei + naoGostei}</li>
            </ul>
            <div class="buttons">
                <button class="like" data-feedback='${id}'>Gostei</button>
                <button class="dislike" data-feedback='${id}'>Não Gostei</button>
            </div>
        </div>
    `
    if(cardContainer) {
        cardContainer.insertAdjacentHTML('afterbegin',htmlCard); 
        votar(document.querySelectorAll(`[data-feedback="${id}"]`))
    } else {
        console.log("Erro ao inserir os cards");
    }
}

// adiciona o evento de clique no botão dos cards
function votar(buttons) {
    buttons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const filmes = getFilmes();
            let btnId = btn.dataset.feedback;
            const totalItem = document.querySelector(`.total${btnId}`);
            const gosteiItem = document.querySelector(`.gostei${btnId}`);
            const naoGosteiItem = document.querySelector(`.naoGostei${btnId}`);
            
            const filme = filmes.find(f => f.id == btnId);
    
        //incrementa os valores de gostei e não gostei
            if(e.target.classList == "like") {
                filme.gostei++
                saveFilmes(filmes);
                //atualiza o paragrafo gostei ao clicar no botão
                gosteiItem.innerHTML= `<strong>Gostaram: </strong>${filme.gostei}`;

                //atualiza o total de votos por item ao clicar
                totalItem.innerHTML = `<strong>Total de votos: </strong>${filme.gostei + filme.naoGostei}`
            };
            if(e.target.classList == "dislike") {
                filme.naoGostei++
                saveFilmes(filmes);
                //atualiza o paragrafo gostei ao clicar no botão
                naoGosteiItem.innerHTML= `<strong>Não gostaram: </strong>${filme.naoGostei}`;
                
                //atualiza o total de votos por item ao clicar
                totalItem.innerHTML = `<strong>Total de votos: </strong>${filme.gostei + filme.naoGostei}`
            };
            
            setTotalFeedbacks();
        })
    })
    
}
// pega os valores totais de likes;
function setTotalFeedbacks() {
    const filmes = getFilmes();
    const totalGostei = filmes.reduce((acc, filme) => {  return acc + filme.gostei;}, 0);
    const totalNaoGostei = filmes.reduce((acc, filme) => {  return acc + filme.naoGostei;}, 0);
    const totalVotos = totalGostei + totalNaoGostei;
    
    document.querySelector('.totalFeedback').innerHTML = `
    <li>Total de votos em gostei: <span class='stats'>${totalGostei}</span></li>
    <li>Total de votos em não gostei: <span class='stats'>${totalNaoGostei}</span></li>
    <li>Total de votos: <span class='stats'>${totalVotos}</span></li>
`
    
}
// adiciona os 5 primeiros itens

// Cria os cards e insere no html assim que ele é carregado
document.addEventListener('DOMContentLoaded', async () => {
    await setFirtsFiveItems();
    createFilme();
    setTotalFeedbacks();
})