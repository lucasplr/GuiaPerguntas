const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//Database
connection.authenticate().then(() => {
    console.log('Conexão feita com o banco de dados!')
}).catch((msgErro) => {
    console.log(msgErro)
})


//estou dizendo para o express usar o ejs como engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//rotas
app.get('/', (req,res) => {
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC']
    ]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        })
    })
    //Equivalent - SELECT * FROM perguntas
    
})

app.get('/perguntar', (req,res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req,res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    //create é equivalente à INSERT INTO pergunta ....
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req,res) => {
    var busca = req.params.id

    Pergunta.findOne({
        where: {id: busca}
    }).then(pergunta => {
        if(pergunta != undefined) { //finded
            
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
            }else{ //not finded
            res.redirect('/')
        }
        })
})

app.post('/responder', (req,res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`)
    })
})

app.listen(8080, () => {
    console.log('App rodando')
})