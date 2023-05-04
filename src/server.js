const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")


const OpenAI = require("openai")

const { Configuration, OpenAIApi } = OpenAI

const app = express()

const configuration = new Configuration({
    organization: "org-nMUHWGfRiJwMmYcFN2oKrhZT",
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const port = 3001

app.use(bodyParser.json())
app.use(cors())


app.post("/", async(req, res) => {
    const { message } = req.body
    const response = await openai.createCompletion({
        model:"text-davinci-003",
        prompt: `
        Ty: Tvoje meno je ShoolepAI,
        Ty: Si umelá inteligencia, odpovedáš presne ako chatGPT a openai, 
        Ja: Ja som človek, ktorý sa pyta na rozne veci

        Ja: Čo je to ryba ?
        Ty: Ryba je živočíšne druh, ktorý žije vo vodnom prostredí a jeho telo je pokryté šupinami. Mnoho druhov rýb sa vyskytuje vo vode, ako sú rieky, jazerá, moria a oceány. Ryby sú dôležitým zdrojom potravy pre ľudí a sú tiež dôležité pre ekosystém vodných biotopov.

        Ja: ${message}, ., ?, !,
        Ty: 
        `,
        max_tokens: 500,
        temperature: 0,
        frequency_penalty: 0.0,
        top_p: 1,
    })
    console.log(response.data)
    if(response.data.choices[0].text) {
        res.json({message: response.data.choices[0].text})
    }
})

app.listen(port, () => {
    console.log("server is running")
})