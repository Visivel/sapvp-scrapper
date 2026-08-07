const fs = require('fs')
const path = require('path')
const Bottleneck = require('bottleneck')

const modalidades = [
    "CRYSTAL",
    "SWORD",
    "SMP",
    "MACE",
    "NETHERITE_POT",
    "AXE"
]

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1580
})

const wrapPage = limiter.wrap(async function getPage(pagina){
    const res = await fetch(
        `https://www.sapvp.com/api/players/filter/top?page=${pagina}&size=30`,
        {
            headers: {
                "accept": "*/*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "referer": "https://www.sapvp.com/ranking",
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0"
            }
        }
    )

    if(!res.ok){
        const texto = await res.text()
        throw new Error(`${res.status} ${res.statusText}\n${texto}`)
    }

    return res.json()
})

function csvbosta(valor){
    return `"${String(valor ?? "").replaceAll('"', '""')}"`
}

async function main() {
    const players = []

    for (let pagina = 0; pagina <= 99; pagina++) {
        console.log(`pagina ${pagina}`)

        const data = await wrapPage(pagina)

        if(!data.content?.length)
            break

        for(const player of data.content) {
            const row = {
                uuid: player.uuid,
                nickname: player.nickname,
                country: player.country,
                points: player.points,
                overall: player.overall
            }

            for(const ranking of player.rankings){
                row[`${ranking.tierList}_tier`] = ranking.tier
                row[`${ranking.tierList}_peak`] = ranking.peak
                row[`${ranking.tierList}_worst`] = ranking.worst
                row[`${ranking.tierList}_value`] = ranking.value
                row[`${ranking.tierList}_retired`] = ranking.retired
                row[`${ranking.tierList}_restricted`] = ranking.restricted
            }

            players.push(row)
        }
    }

    if(!players.length)
        return console.log("nenhum jogador encontrado")

    const colunas = [
        "uuid",
        "nickname",
        "country",
        "points",
        "overall",
        ...modalidades.flatMap(modalidade => [
            `${modalidade}_tier`,
            `${modalidade}_peak`,
            `${modalidade}_worst`,
            `${modalidade}_value`,
            `${modalidade}_retired`,
            `${modalidade}_restricted`
        ])
    ]

    const csv = [
        colunas.map(csvbosta).join(","),
        ...players.map(player =>
            colunas.map(coluna => csvbosta(player[coluna])).join(",")
        )
    ].join("\n")

    const dir = path.dirname(`./tiers/GLOBAL.csv`)
    fs.mkdirSync(dir, {recursive:true})
 
    fs.writeFileSync(`./tiers/GLOBAL.csv`, csv, 'utf8')

    console.log(`\npronto: ${players.length} jogadores salvos`)
}

main().catch(console.error)