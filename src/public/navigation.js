// ===== TOKEN HANDLING ======================================================

function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ===== AUTH GUARD ===========================================================

function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
    }
}

// ===== API WRAPPER ==========================================================

async function api(url, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    let data;
    try {
        data = await response.json();
    } catch (err) {
        data = { error: "Invalid JSON response from server" };
    }

    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}

// ===== SHORTCUT METHODS =====================================================

function apiGet(url) {
    return api(url, { method: "GET" });
}

function apiPost(url, body) {
    return api(url, {
        method: "POST",
        body: JSON.stringify(body)
    });
}

function apiPut(url, body) {
    return api(url, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

function apiDelete(url) {
    return api(url, { method: "DELETE" });
}
