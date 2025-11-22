const BASE = "http://localhost:8080";
let TOKEN = localStorage.getItem("token");

async function request(method, url, body = null, auth = true) {
    const headers = { "Content-Type": "application/json" };
    if (auth && TOKEN) headers["Authorization"] = "Bearer " + TOKEN;

    const res = await fetch(BASE + url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    return res.json();
}

function logout() {
    localStorage.removeItem("token");
    TOKEN = null;
    window.location.href = "index.html";
}
