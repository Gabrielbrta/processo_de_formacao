const craeteBtn = document.querySelector('#create');
const logoBtn = document.querySelector('.logo a');

// se existir o botão ele adiciona um evento de click
if(craeteBtn) {
    craeteBtn.addEventListener('click', (e) => handleClick(e));
}

// verifica os dados do formulario e adiciona o filme no backend(localstorage)
function handleClick(e) {
    e.preventDefault();
    const form = document.querySelector('form');
    let error = document.querySelector('.error');
    let title = form.title.value;
    let gender = form.gender.value;
    let image = form.image.value;
    let description = form.description.value;
    
    // verifica se o usuário inseriu todos os campos obrigatórios
    if(title && gender && image) {
        error.innerText = "";
        createFilme('',title, gender, description, image);
        feedback('criado');
        if(logoBtn) logoBtn.click();
    } else {
        feedback(false);
        error.innerText = "Preencha todos os campos!";
    }
    
}

function feedback(state) {
    state == 'criado' ? alert('filme adicionado com sucesso!') : alert("Ocorreu um erro");
}

// Funções do localstorage ---------------------------

// seleciona todos os filmes que existirem no backend, caso não tenha ele retorna um array vazio
export function getFilmes() {
    return JSON.parse(localStorage.getItem('filmes')) || [];
}

// salva os filmes no backend como um dado json
export function saveFilmes(filmes) {
    localStorage.setItem('filmes', JSON.stringify(filmes));
}

// adiciona os filmes no localstorage
export function createFilme(id, titulo, genero, descricao = '', imagem,) {
    const filmes = getFilmes();
    filmes.push({
        id: id == '' ? Date.now(): id,
        titulo,
        genero,
        descricao,
        imagem,
        gostei: 0,
        naoGostei: 0,
    }); 

// salva os filmes no localStorage("backend")
    saveFilmes(filmes);
}


