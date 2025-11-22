async function register() {
    const body = {
        username: reg_username.value,
        email: reg_email.value,
        password: reg_password.value
    };

    const data = await request("POST", "/auth/register", body, false);
    reg_result.textContent = JSON.stringify(data, null, 2);
}

async function login() {
    const body = {
        username: login_username.value,
        password: login_password.value
    };

    const data = await request("POST", "/auth/login", body, false);
    login_result.textContent = JSON.stringify(data, null, 2);

    if (data.token) {
        localStorage.setItem("token", data.token);
        TOKEN = data.token;
        window.location.href = "filmes.html";
    }
}
