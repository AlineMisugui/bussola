const fs = require('fs/promises');

async function buscarPokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        const data = await response.json()
        return data.results
    } catch (error) {
        
    }
}

async function consultPokemons() {
    const pokemons = await buscarPokemons()
    const pokemonsUrls = pokemons.map(pokemon => pokemon.url)
    
    const responses = await Promise.all(pokemonsUrls.map(url =>
        fetch(url).then(resp => resp.json())
    )).then(results => {
        const dataFiltered = filterData(results)
        return dataFiltered
    })
    await escreverArquivoPromise("arquivo.json", JSON.stringify(responses))
}

async function escreverArquivoPromise(nomeArquivo, dados) {
    try {
        await fs.writeFile(nomeArquivo, dados)
        console.log(`Dados escritos no arquivo ${nomeArquivo} com sucesso.`);
    } catch (error) {
        console.error(`Erro ao escrever dados no arquivo ${nomeArquivo}:`, error)
    }
}

function filterData(results) {
    const dataFiltered = results.map(result => {
        return {
            nome: result.name,
            tipos: result.types.map(type => type.type.name),
            peso: result.weight,
            altura: result.height,
            numeroDex: result.id,
            sprite: result.sprites["back_default"]
        }
    })
    return dataFiltered
}

consultPokemons();
