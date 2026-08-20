// Para executar a API no terminal: node index.js
// Link para testar a API: http://localhost:3000/rota
const express = require("express")
const app = express()
const port = 3000
app.use(express.json()) // configura API para usar JSON.
const fs = require('fs') // importa leitura e escrita de arquivos.

const arquivoID = JSON.parse(fs.readFileSync("id.json", "utf8"))
let id = arquivoID.id

function atualizarID() {
    id = id + 1
    fs.writeFileSync("id.json", JSON.stringify({id: id}), "utf8")
}

app.post("/aulas", (req, res) => {
    const aula= req.body
    try {
        const aulas = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        atualizarID()
        aula.id = id
       
         aulas.push(aula)
        fs.writeFileSync("aulas.json", JSON.stringify(aulas), "utf8")
        res.status(201).json({resposta: "Aula cadastrada com sucesso!"})
    } catch (erro) {
        
        res.status(500).json({erro: erro.message})
    }
})

// Execução da API:
app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})
app.get("/aulas", (req, res) => {
    try {
        const bd = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        res.status(200).json({resposta: bd})
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})


app.get("/aulas/:id", (req, res) => {
    const id = req.params.cpf
    try {
        const bd = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        const aula = bd.find((aula) => aula.id == id)
        if(!aula) {
            return res.status(404).json({erro: "Aula não existe no BD!"})
        }
        res.status(200).json({resposta: aula})
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

app.delete("/aulas/:id", (req, res) => {
    // pegar o cpf da rota
    const id = req.params.id
    try {
        // abrir o banco de dados
        const bd = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        // encontrar o índice do cliente a ser excluido
        const indiceAula = bd.findIndex((aula) => aula.id == id)
        // remover o indice da lista
        if (indiceAula == -1) {
            return res.status(404).json({erro: "A aula não existe"})
        }
        bd.splice(indiceAula, 1)
        // atualizar o arquivo
        fs.writeFileSync("aulas.json", JSON.stringify(bd), "utf8")
        // dar uma resposta para o cliente
        res.status(200).json({resposta: "Aula excluído com sucesso!"})
    } catch (error){
        res.status(500).json({erro: erro.message})
    }
})