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

const wrapPage = limiter.wrap(async function getPage(modalidade, pagina){
    const res = await fetch(
        `https://www.sapvp.com/api/players/distribution?modality=${modalidade}&page=${pagina}&limit=300`,
        {
            headers: {
                "accept": "application/json",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "referer": "https://www.sapvp.com/ranking",
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0"
            }
        }
    )

    if (!res.ok) {
        const texto = await res.text()
        throw new Error(`${res.status} ${res.statusText}\n${texto}`)
    }

    return res.json()
    })

function csvEscape(valor) {
    return `"${String(valor ?? "").replaceAll('"', '""')}"`
}

async function main() {
    for (const modalidade of modalidades) {
        console.log(`\n${modalidade}`)

        const rows = []

        for (let pagina = 0; pagina < 100; pagina++) {
            console.log(`pagina ${pagina}`)

            const data = await wrapPage(modalidade, pagina)

            if (!Array.isArray(data) || !data.length)
                break

            for (const tier of data) {
                for (const player of tier.players || []) {
                    rows.push({
                        modalidade,
                        tierId: tier.tierId,
                        label: tier.label,
                        ...player
                    })
                }
            }
        }

        if (!rows.length) {
            console.log("nenhum dado encontrado")
            continue
        }

        const colunas = [
            ...new Set(rows.flatMap(row => Object.keys(row)))
        ]

        const csv = [
            colunas.map(csvEscape).join(","),
            ...rows.map(row =>
                colunas.map(coluna => csvEscape(row[coluna])).join(",")
            )
        ].join("\n")

        const dir = path.dirname(`./tiers/${modalidade}.csv`)
        fs.mkdirSync(dir, {recursive:true})

        fs.writeFileSync(`./tiers/${modalidade}.csv`, csv, 'utf8')

        console.log(`pronto: ${rows.length} players salvos`)
    }
}

main().catch(console.error)