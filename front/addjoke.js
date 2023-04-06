document.getElementById("joke-form").addEventListener("submit", function (event) {
    event.preventDefault();
    let content = event.target["content"].value;
    let token = event.target["token"].value;
    let joke = {
        "content": content
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:3000/jokes");
    xhr.setRequestHeader("api-token", token);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(joke));

    xhr.onload = function () {
        document.getElementById("token-text").innerText = null;
        if (xhr.status === 200) {
            window.open("index.html", "_self");
        } else {
            document.getElementById("token-text").innerText = xhr.response.error;
        }
    }
})