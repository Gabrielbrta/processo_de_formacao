const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const database = path.join(__dirname, "filmes.json");

function lerFilmes() {
    return JSON.parse(fs.readFileSync(database, "utf-8"));
}

function salvarFilmes(data) {
    fs.writeFileSync(database, JSON.stringify(data, null, 2));
}

// GETS
//buscar filmes
app.get("/filmes", (req, res) => res.json(lerFilmes()));

// busca todos os votos positivos da pagina
app.get("/contador/positivos", (req, res) => {
    const filmes = lerFilmes();
     const total = filmes.reduce((acc, filme) => {  return acc + filme.gostei}, 0);
     res.json({totalPositivos: total});
});

//busca todos os votos negativos da pagina
app.get("/contador/negativos", (req, res) => {
    const filmes = lerFilmes();
     const total = filmes.reduce((acc, filme) => {  return acc + filme.naoGostei}, 0);
     res.json({totalNegativos: total});
});


// POST
// cadastrar filmes
app.post("/filmes" , (req, res) => {
    const  { titulo, genero, descricao, imagem } = req.body;

    if(!titulo || !genero || !imagem) {
        return res.status(400).send("Os arquivos, título, gênero e imagem são obrigatórios");
    }

    let filmes = lerFilmes();
    const novoFilme = {
        id: Date.now(),
        titulo,
        genero,
        descricao: descricao || "",
        imagem,
        gostei: 0,
        naoGostei: 0,
    };

    filmes.push(novoFilme)
    salvarFilmes(filmes);

    res.status(201).json(novoFilme);
});

// cadastrar votos
app.post("/voto/:id", (req, res) => {
    const {value} = req.body; // gostei ou naoGostei
    const filmes = lerFilmes();
    const filme = filmes.find(f => f.id == req.params.id);
    if(!filme) return res.status(404).json({error: "Filme não encontrado"});

    if(value !== "like" && value !=="dislike") {
        return res.status(400).json({error: "tipo inválido"});
    }

    if(value == "like") {
        filme.gostei++;
        res.json(filme);
    }
    if(value == "dislike") {
        filme.naoGostei++
        res.json(filme);
    }
    salvarFilmes(filmes);

});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))