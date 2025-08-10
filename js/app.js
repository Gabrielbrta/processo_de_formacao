
const cardContainer = document.querySelector('.cards');
const API_URL = "http://localhost:3000";

// Busca todos os filmes do servidos
async function getServerFilmes() {
    try {
        const data = await fetch(`${API_URL}/filmes`)
        const json = await data.json();
        return json;

    } catch (error) {
        console.log("Houve um erro na requisição");
    }
}

// Função que cria os cards dos filmes/series
async function createCard() {
    const dataCard = await getServerFilmes();

    dataCard.forEach((filme) => {
        let htmlCard =`
            <div class="card" id="id${filme.id}">
                <div class="title">
                <h2>${filme.titulo}</h2>
                </div>
                <div class="gender">
                    <p><strong>Gênero:</strong> ${filme.genero}</p>
                </div>
                <div class="img">
                    <img src="${filme.imagem}" onerror="this.onerror=null; this.src='https://picsum.photos/800/600';" alt="${filme.titulo}">
                </div>
                <div class="descricao">
                    <p><strong>Descrição:</strong></p>
                    <p class="description"> ${filme.descricao != '' ? filme.descricao : 'Sem descrição'}</p>
                </div>
                <ul class="feedback-list">
                    <li class="gostei${filme.id}"> <strong>Gostaram: </strong>${filme.gostei}</li>
                    <li class="naoGostei${filme.id}"> <strong>Não gostaram: </strong>${filme.naoGostei}</li>
                    <li class="total${filme.id}"> <strong>Total de votos: </strong>${filme.gostei + filme.naoGostei}</li>
                </ul>
                <div class="buttons">
                    <button type="button" class="like" data-feedback='${filme.id}'>Gostei</button>
                    <button type="button" class="dislike" data-feedback='${filme.id}'>Não Gostei</button>
                </div>
            </div>
        `

        if(cardContainer) {
            cardContainer.insertAdjacentHTML('afterbegin',htmlCard); 
            votar(document.querySelectorAll(`[data-feedback="${filme.id}"]`))
        } else {
            console.log("Erro ao inserir os cards");
        }
    });
}

// adiciona o evento de clique no botão dos cards
function votar(buttons) {
    buttons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const value = btn.classList.contains("like") ? "like" : "dislike";

            let btnId = btn.dataset.feedback;

            // elementos do dom
            const totalItem = document.querySelector(`.total${btnId}`);
            const gosteiItem = document.querySelector(`.gostei${btnId}`);
            const naoGosteiItem = document.querySelector(`.naoGostei${btnId}`);
            

            //incrementa os valores de gostei e não gostei
            if(e.target.classList == "like") {
                //atualiza o paragrafo gostei ao clicar no botão
                const atual = parseInt(gosteiItem.innerHTML.replace(/\D/g, "")) + 1;
                gosteiItem.innerHTML = `<strong>Gostaram: </strong>${atual}`;
                
            };
            if(e.target.classList == "dislike") {
                //atualiza o paragrafo não gostei ao clicar no botão
                const atual = parseInt(naoGosteiItem.innerHTML.replace(/\D/g, "")) + 1;
                naoGosteiItem.innerHTML = `<strong>Não gostaram: </strong>${atual}`;
            };
            
            const atualTotal = parseInt(totalItem.innerHTML.replace(/\D/g, "")) + 1;
            totalItem.innerHTML = `<strong>Total de votos: </strong>${atualTotal}`

            // registra os votos
            try {
                fetch(`${API_URL}/voto/${btnId}`,{
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({value}),
                });
            } catch(error) {
                console.log("erro ao registrar voto: ", error);
            }
            
            // registra os votos totais
            setTotalFeedbacks();
        })
    })
    
}

// pega os valores totais de likes;
async function setTotalFeedbacks() {
    //busca os votos totais pela api
    try{
        let positivos = await fetch(`${API_URL}/contador/positivos`).then((total) => total.json());
        let negativos = await fetch(`${API_URL}/contador/negativos`).then((total) => total.json());
        let totalVotos = positivos.totalPositivos + negativos.totalNegativos;

        document.querySelector('.totalFeedback').innerHTML = `
        <li>Total de votos em gostei: <span class='stats'>${positivos.totalPositivos}</span></li>
        <li>Total de votos em não gostei: <span class='stats'>${negativos.totalNegativos}</span></li>
        <li>Total de votos: <span class='stats'>${totalVotos}</span></li>
        `
    }catch(error) {
        console.log("Erro na requisição dos totais: " + error);
    }
    
}

// Cria os cards e insere no html assim que ele é carregado
document.addEventListener('DOMContentLoaded', async () => {
    await createCard();
    await setTotalFeedbacks();
})