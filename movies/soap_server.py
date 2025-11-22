from flask import Flask, request, Response
import xml.etree.ElementTree as ET
import os

app = Flask(__name__)

# ------------------------------
# Carregar filmes dos arquivos
# ------------------------------
FILMES_DIR = "filmes_xml"

def carregar_filmes():
    filmes = {}
    for filename in os.listdir(FILMES_DIR):
        if filename.endswith(".xml"):
            caminho = os.path.join(FILMES_DIR, filename)
            tree = ET.parse(caminho)
            root = tree.getroot()

            id_filme = int(root.find("id").text)

            def safe(tag, default=""):
                elem = root.find(tag)
                return elem.text if elem is not None else default

            filmes[id_filme] = {
                "titulo": safe("titulo"),
                "ano": safe("ano"),
                "pais": safe("pais"),
                "genero": safe("genero"),
                "review": safe("review"),
                "nota": safe("nota"),
                "id_usuario": safe("id_usuario"),
            }
    return filmes


filmes = carregar_filmes()

# SOAP Namespace
NS = {"soap": "http://schemas.xmlsoap.org/soap/envelope/"}


def criar_resposta_soap(corpo_xml):
    envelope = f"""<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        {corpo_xml}
    </soap:Body>
</soap:Envelope>"""
    return envelope


@app.route("/", methods=["POST"])
def receber_soap():
    try:
        xml_raw = request.data.decode("utf-8")
    except UnicodeDecodeError:
        xml_raw = request.data.decode("latin-1")

    print("XML recebido:")
    print(xml_raw)
    
    root = ET.fromstring(xml_raw)

    # BODY COM NAMESPACE
    body = root.find("soap:Body", NS)
    operacao = body.find("*")     # primeira tag interna
    nome_op = operacao.tag

    # ---------------------------
    #   OPERAÇÃO: CRIAR FILME
    # ---------------------------
    if "inserirFilme" in nome_op:

        # extrair campos
        try:
            filme_tag = operacao.find("filme")

            titulo = filme_tag.find("titulo").text
            ano = filme_tag.find("ano").text
            pais = filme_tag.find("pais").text
            genero = filme_tag.find("genero").text
            review = filme_tag.find("review").text
            nota = filme_tag.find("nota").text
            usuario = filme_tag.find("id_usuario").text
        except:
            return Response(
                criar_resposta_soap("<erro>Parâmetros inválidos</erro>"),
                mimetype="text/xml"
            )

        # gerar novo ID automaticamente
        novo_id = max(filmes.keys(), default=-1) + 1
        id_filme = novo_id

        # salvar arquivo XML
        xml_content = f"""
    <filme>
        <id>{id_filme}</id>
        <titulo>{titulo}</titulo>
        <ano>{ano}</ano>
        <pais>{pais}</pais>
        <genero>{genero}</genero>
        <review>{review}</review>
        <nota>{nota}</nota>
        <id_usuario>{usuario}</id_usuario>
    </filme>
    """
        filepath = os.path.join(FILMES_DIR, f"{id_filme}.xml")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(xml_content)

        filmes[id_filme] = {
            "titulo": titulo,
            "ano": ano,
            "pais": pais,
            "genero": genero,
            "review": review,
            "nota": nota,
            "id_usuario": usuario
        }

        # RETORNO MODIFICADO → devolve o filme completo
        corpo = f"""
    <criarFilmeResponse>
        {xml_content}
    </criarFilmeResponse>
    """
        print(corpo)
        return Response(criar_resposta_soap(corpo), mimetype="text/xml")



    # ---------------------------
    #   OPERAÇÃO: GET FILME
    # ---------------------------
    if "getFilme" in nome_op:
        id_filme = int(operacao.find("id").text)

        if id_filme not in filmes:
            return Response(
                criar_resposta_soap("<erro>Filme não encontrado</erro>"),
                mimetype="text/xml"
            )

        f = filmes[id_filme]

        corpo = f"""
        <getFilmeResponse>
            <filme>
                <id>{id_filme}</id>
                <titulo>{f['titulo']}</titulo>
                <ano>{f['ano']}</ano>
                <pais>{f['pais']}</pais>
                <genero>{f['genero']}</genero>
                <review>{f['review']}</review>
                <nota>{f['nota']}</nota>
                <id_usuario>{f['id_usuario']}</id_usuario>
            </filme>
        </getFilmeResponse>
        """

        return Response(criar_resposta_soap(corpo), mimetype="text/xml")


    # ---------------------------------------------------------
    #   OPERAÇÃO: LISTAR FILMES FILTRADOS
    # ---------------------------------------------------------
    if "listarFilmesFiltrados" in nome_op:
        
        def get_int(tag_name):
            tag = operacao.find(tag_name)
            if tag is None or tag.text is None:
                return None

            val = tag.text.strip()
            if val == "" or val.lower() == "null":
                return None

            try:
                return int(val)
            except:
                return None
            
        def get_float(tag_name):
            tag = operacao.find(tag_name)
            if tag is None or tag.text is None:
                return None

            val = tag.text.strip()
            if val == "" or val.lower() == "null":
                return None

            try:
                return float(val)
            except:
                return None
            
        def get_str(tag_name):
            tag = operacao.find(tag_name)
            if tag is None or tag.text is None:
                return None

            val = tag.text.strip()
            return val if val != "" and val.lower() != "null" else None


        pais = get_str("pais")
        anoMin = get_int("anoMinimo")
        notaMin = get_float("notaMinima")
        usuario = get_str("usuarioId")

        print("Filtro recebido:", pais)

        resultados = []
        
        for fid, f in filmes.items():
            ok = True

            if pais:
                ok = ok and f["pais"].lower() == pais.lower()

            if anoMin is not None:
                ok = ok and int(f["ano"]) >= anoMin

            if notaMin is not None:
                ok = ok and float(f["nota"]) >= notaMin

            if usuario:
                ok = ok and f["id_usuario"] == usuario

            if ok:
                resultados.append((fid, f))

        itens = ""
        for fid, f in resultados:
            itens += f"""
                <filme>
                    <id>{fid}</id>
                    <titulo>{f['titulo']}</titulo>
                    <ano>{f['ano']}</ano>
                    <pais>{f['pais']}</pais>
                    <genero>{f['genero']}</genero>
                    <review>{f['review']}</review>
                    <nota>{f['nota']}</nota>
                    <id_usuario>{f['id_usuario']}</id_usuario>
                </filme>
            """

        corpo = f"<listarFilmesFiltradosResponse>{itens}</listarFilmesFiltradosResponse>"
        return Response(criar_resposta_soap(corpo), mimetype="text/xml")

    # ---------------------------
    #   OPERAÇÃO: LISTAR FILMES
    # ---------------------------
    if "listarFilmes" in nome_op:
        itens = ""
        for fid, f in filmes.items():
            itens += f"""
                <filme>
                    <id>{fid}</id>
                    <titulo>{f['titulo']}</titulo>
                    <ano>{f['ano']}</ano>
                    <pais>{f['pais']}</pais>
                    <genero>{f['genero']}</genero>
                    <review>{f['review']}</review>
                    <nota>{f['nota']}</nota>
                    <id_usuario>{f['id_usuario']}</id_usuario>
                </filme>
            """

        corpo = f"<listarFilmesResponse>{itens}</listarFilmesResponse>"
        print(corpo)
        return Response(criar_resposta_soap(corpo), mimetype="text/xml")

    # ---------------------------
    #   OPERAÇÃO: ESTATÍSTICAS POR PAÍS
    # ---------------------------
    if "estatisticasPorPais" in nome_op:

        usuarioId = operacao.find("usuarioId")

        # se não mandar usuário → erro
        if usuarioId is None or not usuarioId.text.strip():
            return Response(
                criar_resposta_soap("<erro>usuarioId é obrigatório</erro>"),
                mimetype="text/xml"
            )

        usuarioId = usuarioId.text.strip()

        contagem = {}

        print("=== Debug Estatísticas ===")
        print("usuarioId:", repr(usuarioId))
        print("Filmes cadastrados:")
        for fid, f in filmes.items():
            print(fid, f["id_usuario"], f["pais"])

        # contabiliza SOMENTE filmes deste usuário
        for f in filmes.values():
            if f["id_usuario"] == usuarioId:
                p = f["pais"]
                contagem[p] = contagem.get(p, 0) + 1

        itens = ""
        for pais, total in contagem.items():
            itens += f"""
                <paisEstatistica>
                    <pais>{pais}</pais>
                    <total>{total}</total>
                </paisEstatistica>
            """

        corpo = f"<estatisticasPorPaisResponse>{itens}</estatisticasPorPaisResponse>"

        print("=== XML ESTATISTICAS ===")
        print(corpo)
        return Response(criar_resposta_soap(corpo), mimetype="text/xml")
    
    # ---------------------------
    #   OPERAÇÃO: ATUALIZAR FILME
    # ---------------------------
    if "atualizarFilme" in nome_op:

        try:
            id_node = operacao.find("id")

            if id_node is not None:
                id_filme = int(id_node.text)
            else:
                filme_tag = operacao.find("filme")
                if filme_tag is None or filme_tag.find("id") is None:
                    return Response(
                        criar_resposta_soap("<erro>ID inválido</erro>"),
                        mimetype="text/xml"
                    )
                id_filme = int(filme_tag.find("id").text)
        except:
            return Response(
                criar_resposta_soap("<erro>ID inválido</erro>"),
                mimetype="text/xml"
            )

        if id_filme not in filmes:
            return Response(
                criar_resposta_soap("<erro>Filme não encontrado</erro>"),
                mimetype="text/xml"
            )

        # pega valor antigo + substitui apenas se enviado
        f = filmes[id_filme]

        def update(tag, default):
            elem = filme_tag.find(tag)
            return elem.text if elem is not None and elem.text.strip() != "" else default

        f["titulo"] = update("titulo", f["titulo"])
        f["ano"] = update("ano", f["ano"])
        f["pais"] = update("pais", f["pais"])
        f["genero"] = update("genero", f["genero"])
        f["review"] = update("review", f["review"])
        f["nota"] = update("nota", f["nota"])
        f["id_usuario"] = update("id_usuario", f["id_usuario"])

        # reescrever o XML
        filepath = os.path.join(FILMES_DIR, f"{id_filme}.xml")
        xml_content = f"""
    <filme>
        <id>{id_filme}</id>
        <titulo>{f['titulo']}</titulo>
        <ano>{f['ano']}</ano>
        <pais>{f['pais']}</pais>
        <genero>{f['genero']}</genero>
        <review>{f['review']}</review>
        <nota>{f['nota']}</nota>
        <id_usuario>{f['id_usuario']}</id_usuario>
    </filme>
    """
        with open(filepath, "w", encoding="utf-8") as arq:
            arq.write(xml_content)

        # retorna o filme completo
        corpo = f"""
        <atualizarFilmeResponse>
            <filme>
                <id>{id_filme}</id>
                <titulo>{f['titulo']}</titulo>
                <ano>{f['ano']}</ano>
                <pais>{f['pais']}</pais>
                <genero>{f['genero']}</genero>
                <review>{f['review']}</review>
                <nota>{f['nota']}</nota>
                <id_usuario>{f['id_usuario']}</id_usuario>
            </filme>
        </atualizarFilmeResponse>
        """

        return Response(criar_resposta_soap(corpo), mimetype="text/xml")


    # ---------------------------
    #   OPERAÇÃO: DELETAR FILME
    # ---------------------------
    if "deletarFilme" in nome_op:

        try:
            id_filme = int(operacao.find("id").text)
        except:
            return Response(
                criar_resposta_soap("<erro>ID inválido</erro>"),
                mimetype="text/xml"
            )

        if id_filme not in filmes:
            return Response(
                criar_resposta_soap("<erro>Filme não encontrado</erro>"),
                mimetype="text/xml"
            )

        # remover arquivo físico
        filepath = os.path.join(FILMES_DIR, f"{id_filme}.xml")
        if os.path.exists(filepath):
            os.remove(filepath)

        # remover da memória
        filmes.pop(id_filme)

        corpo = """
            <deletarFilmeResponse>
                <status>OK</status>
                <mensagem>Filme deletado com sucesso</mensagem>
            </deletarFilmeResponse>
        """

        return Response(criar_resposta_soap(corpo), mimetype="text/xml")



@app.route("/wsdl", methods=["GET"])
def wsdl():
    with open("filmes.wsdl", "r", encoding="utf-8") as f:
        xml = f.read()
    return Response(xml, mimetype="text/xml")


if __name__ == "__main__":
    print("Servidor SOAP rodando em http://localhost:5000")
    app.run(host="0.0.0.0", port=5000)
