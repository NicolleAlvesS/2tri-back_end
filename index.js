
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
        aulas.id = id
       
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