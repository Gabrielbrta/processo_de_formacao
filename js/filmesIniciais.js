import { createFilme, getFilmes } from "./form.js";

// Faz a requisição dos dados do arquivo json com os 5 primeiros filmes
async function fetchData() { 
    try {
        const data = await fetch('./filmes.json');
        const json = await data.json();
        return json;
    } catch(error) {
        alert('houve um problema na requisição');
    }
    
}

// Cria os 5 primeiros filmes com os dados da resposta da requisição
export async function setFirtsFiveItems() {
    const filmes = getFilmes()
    const dados = await fetchData().then(item => item);
    dados.forEach((filme) => {
        if(filmes.find(f => f.titulo.toLowerCase() == filme.titulo.toLowerCase())) {
            return;
        } else {
            createFilme(filme.id ,filme.titulo, filme.genero, filme.descricao, filme.imagem);
        }
    });
}