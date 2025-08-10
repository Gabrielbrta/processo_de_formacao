const craeteBtn = document.querySelector('#create');
const logoBtn = document.querySelector('a');
const API_URL = "http://localhost:3000";

// se existir o botão ele adiciona um evento de click
if(craeteBtn) {
    craeteBtn.addEventListener('click', async (e) => handleClick(e));
}

// verifica os dados do formulario e adiciona o filme no backend(localstorage)
async function handleClick(e) {
    e.preventDefault();
    const form = document.querySelector('form');
    let error = document.querySelector('.error');
    let title = form.titulo.value;
    let gender = form.genero.value;
    let image = form.imagem.value;

    
    // verifica se o usuário inseriu todos os campos obrigatórios
    if(title && gender && image) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries())
        await fetch(`${API_URL}/filmes`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        logoBtn.click();
    } else {
        alert("Ocorreu um erro")
        error.innerText = "Preencha todos os campos!";
    }
    
}