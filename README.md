# sapvp scrapper

scrapper em javascript para coletar dados do ranking do [sapvp](https://www.sapvp.com/), incluindo tiers por modalidade e ranking global. Ele automaticamente transforma em um csv de forma ""organizada"" (pelo menos para bancos de dados).

Este projeto pode ajudar outras tierlists a crescerem caso queiram migrar o banco de dados da SA Community para a deles. Caso o metodo ja tenha sido consertado, voce pode encontrar o banco de dados ja extraido [aqui](https://github.com/Visivel/sapvp-scrapper/tree/main/tiers  )

voce pode ler mais sobre a api aqui (apesar de estar faltando alguns endpoints): https://docs.sapvp.com/

### Rate limit

Recentemente foi implementado um sistema de rate limit, entao caso ocorre alguma falha esse provavelmente é o motivo, favor abrir uma [issue](https://github.com/Visivel/sapvp-scrapper/issues) caso ocorra algum problema, entretanto ja foi implementado e configurado propriamente no scrapper, os testes apontam nao ter erro. Caso queira configurar voce pode mudar no arquivo essa linha:

```js
const limiter = new Bottleneck({
    maxConcurrent: 1, // maximo de requisicoes durante o periodo
    minTime: 1580 // tempo ate a proxima requisicao (em milissegundos)
})
```

# Sumário
- [Como rodar](#como-rodar)
- [Requests de um ranking especifico](#request-do-ranking-de-um-modo-especifico)
- [Requests de todo o ranking global](#requests-do-ranking-global)
- [Para fazer...](#todo)

## Como rodar

Primeiramente é necessario NodeJS para rodar, segue o passo a passo:
```
npm install
node index.js (ira extrair o ranking de cada modo individualmente)
node global.js (ira extrair o ranking global)
```

## Request do ranking de um modo especifico

```
GET /api/players/distribution?modality={MODO}&page=0&limit=300
```

modos
```
*   CRYSTAL
*   SWORD
*   SMP
*   MACE
*   NETHERITE_POT
*   AXE
```

``CRYSTAL`` por exemplo:
```
[
  {
    "tierId": 10,
    "label": "HT1",
    "players": []
  },
  {
    "tierId": 9,
    "label": "LT1",
    "players": []
  },
  {
    "tierId": 8,
    "label": "HT2",
    "players": []
  },
  {
    "tierId": 7,
    "label": "LT2",
    "players": [
      {
        "uuid": "c195939b-f1d2-414b-957b-94b17208305c",
        "name": "kykywoah",
        "region": "BR"
      },
      {
        "uuid": "1f503f9f-8101-4a3c-b5f7-2e6be6dbbda8",
        "name": "OverKatheinated",
        "region": "CL"
      }
    ]
  },
  {
    "tierId": 6,
    "label": "HT3",
    "players": [
      {
        "uuid": "a8e16021-4598-4eb9-97ff-4e5e5536d81e",
        "name": "alfonso12342y",
        "region": "CL"
      },
      {
        "uuid": "0fcce85e-2023-4377-a2ab-cb864b450cb3",
        "name": "guxtinhoxd",
        "region": "BR"
      },
      {
        "uuid": "18b57fb1-eca7-457c-803c-a0cded387fa5",
        "name": "MestreJapm",
        "region": "BR"
      }
    ]
  },
    ...
```
## Requests do ranking global

```
GET /api/players/filter/top?page={pagina}&size=30
```

as paginas vao de ``0`` (primeira pagina) ate ``99`` desde o ultimo teste.

Exemplo de requisição do ranking:

```
{
  "content": [
    {
      "uuid": "d10649d3-b323-4b6a-9aad-38bf66cf81e8",
      "country": "BR",
      "nickname": "meteorinto",
      "rankings": [
        { "tier": 5, "peak": 6, "worst": 5, "value": 6, "tierList": "SWORD", "retired": false, "restricted": false },
        { "tier": 5, "peak": 7, "worst": 5, "value": 6, "tierList": "SMP", "retired": false, "restricted": false },
        { "tier": 7, "peak": 7, "worst": 7, "value": 20, "tierList": "AXE", "retired": false, "restricted": false },
        { "tier": 5, "peak": 5, "worst": 5, "value": 6, "tierList": "NETHERITE_POT", "retired": false, "restricted": false },
        { "tier": 3, "peak": 3, "worst": 3, "value": 3, "tierList": "MACE", "retired": false, "restricted": false }
      ],
      "points": 59,
      "overall": 1
    },
    {
      "uuid": "aec0c315-ca03-4193-beaf-68d377d8f353",
      "country": "AR",
      "nickname": "olfd",
      "rankings": [
        { "tier": 6, "peak": 6, "worst": 6, "value": 10, "tierList": "SWORD", "retired": false, "restricted": false },
        { "tier": 7, "peak": 7, "worst": 5, "value": 20, "tierList": "SMP", "retired": false, "restricted": false },
        { "tier": 5, "peak": 5, "worst": 5, "value": 6, "tierList": "MACE", "retired": false, "restricted": false },
        { "tier": 6, "peak": 6, "worst": 6, "value": 10, "tierList": "AXE", "retired": false, "restricted": false },
        { "tier": 6, "peak": 6, "worst": 5, "value": 10, "tierList": "NETHERITE_POT", "retired": false, "restricted": false }
      ],
      "points": 56,
      "overall": 2
    },
    {
      "uuid": "68c99c91-b4a3-474d-8116-81d4bbbd886f",
      "country": "AR",
      "nickname": "MilanesaMacro",
      "rankings": [
        { "tier": 7, "peak": 7, "worst": 0, "value": 20, "tierList": "SMP", "retired": false, "restricted": false },
        { "tier": 6, "peak": 6, "worst": 0, "value": 10, "tierList": "AXE", "retired": false, "restricted": false },
        { "tier": 5, "peak": 5, "worst": 0, "value": 6, "tierList": "NETHERITE_POT", "retired": false, "restricted": false },
        { "tier": 6, "peak": 6, "worst": 0, "value": 10, "tierList": "SWORD", "retired": false, "restricted": false },
        { "tier": 4, "peak": 4, "worst": 2, "value": 4, "tierList": "MACE", "retired": false, "restricted": false },
        { "tier": 2, "peak": 2, "worst": 2, "value": 2, "tierList": "CRYSTAL", "retired": false, "restricted": false }
      ],
      "points": 52,
      "overall": 3
    },
    {
      "uuid": "117fdb81-fc2d-4f9c-ad15-edd3d97af111",
      "country": "BR",
      "nickname": "Kniess",
      "rankings": [
        { "tier": 6, "peak": 6, "worst": 6, "value": 10, "tierList": "SWORD", "retired": false, "restricted": false },
        { "tier": 5, "peak": 6, "worst": 5, "value": 6, "tierList": "CRYSTAL", "retired": false, "restricted": false },
        { "tier": 5, "peak": 5, "worst": 5, "value": 6, "tierList": "SMP", "retired": false, "restricted": false },
        { "tier": 5, "peak": 5, "worst": 5, "value": 6, "tierList": "AXE", "retired": false, "restricted": false },
        { "tier": 6, "peak": 6, "worst": 6, "value": 10, "tierList": "NETHERITE_POT", "retired": false, "restricted": false },
        { "tier": 4, "peak": 4, "worst": 4, "value": 4, "tierList": "MACE", "retired": false, "restricted": false }
      ],
      "points": 46,
      "overall": 4
    },
    {
      "uuid": "3ce0d045-ce57-42aa-b3fc-785212b487ed",
      "country": "BR",
      "nickname": "Delicaty",
      "rankings": [
        { "tier": 3, "peak": 4, "worst": 2, "value": 3, "tierList": "CRYSTAL", "retired": false, "restricted": false },
        { "tier": 6, "peak": 6, "worst": 4, "value": 10, "tierList": "SWORD", "retired": false, "restricted": false }
      ]
    }
...
```

## Todo

* ~~Implementar um rate limit~~
* Implementar suporte a JSON
* (?) Remapear a api por endpoints não documentados
