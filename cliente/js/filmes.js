async function listarFilmes() {
    const params = new URLSearchParams();

    if (filtro_pais.value) params.append("pais", filtro_pais.value);
    if (filtro_ano.value) params.append("anoMinimo", filtro_ano.value);
    if (filtro_nota.value) params.append("notaMinima", filtro_nota.value);

    const data = await request("GET", "/movies?" + params.toString());
    listar_result.textContent = JSON.stringify(data, null, 2);
}

async function criarFilme() {
    const body = {
        titulo: new_titulo.value,
        ano: new_ano.value,
        pais: new_pais.value,
        genero: new_genero.value,
        review: new_review.value,
        nota: new_nota.value
    };
    new_result.textContent = JSON.stringify(await request("POST", "/movies", body), null, 2);
}

async function buscarFilme() {
    let data = await request("GET", "/movies/" + filme_id.value);

    edit_titulo.value = data.titulo;
    edit_ano.value = data.ano;
    edit_pais.value = data.pais;
    edit_genero.value = data.genero;
    edit_review.value = data.review;
    edit_nota.value = data.nota;

    edit_result.textContent = JSON.stringify(data, null, 2);
}

async function editarFilme() {
    const body = {
        titulo: edit_titulo.value,
        ano: edit_ano.value,
        pais: edit_pais.value,
        genero: edit_genero.value,
        review: edit_review.value,
        nota: edit_nota.value
    };

    edit_result.textContent = JSON.stringify(
        await request("PUT", "/movies/" + filme_id.value, body),
        null, 2
    );
}

async function excluirFilme() {
    edit_result.textContent =
        JSON.stringify(await request("DELETE", "/movies/" + filme_id.value), null, 2);
}

async function estatisticas() {
    estat_result.textContent =
        JSON.stringify(await request("GET", "/movies/estatisticas"), null, 2);
}
