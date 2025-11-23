async function carregarWSDL() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:8080/wsdl", {
            method: "GET",
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        if (!response.ok) {
            document.getElementById("wsdl_content").textContent =
                `Erro ao carregar WSDL: ${response.status}`;
            return;
        }

        const data = await response.json();

        // O WSDL vem dentro de data.content ou data.wsdl dependendo do assembler
        const wsdl = data.wsdl || data.content || JSON.stringify(data, null, 2);

        document.getElementById("wsdl_content").textContent = wsdl;

    } catch (err) {
        document.getElementById("wsdl_content").textContent =
            "Erro: " + err.message;
    }
}
