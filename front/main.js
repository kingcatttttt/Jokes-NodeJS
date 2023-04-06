function render() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:3000/jokes");
    xhr.responseType = "json";
    xhr.send();

    xhr.onload = function () {
        let jokesElement = document.getElementById("jokes");
        jokesElement.innerHTML = null;

        for (const joke of xhr.response) {
            jokesElement.innerHTML += `
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">${joke.id}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${joke.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-primary" id="like-${joke.id}">
                            <i class="fa-solid fa-heart"></i> 
                            <span class="badge text-bg-danger ms-2">${joke.likes}</span>
                        </button>
                        <button type="button" class="btn btn-primary" id="dislike-${joke.id}">
                            <i class="fa-solid fa-heart-crack"></i> 
                            <span class="badge text-bg-secondary ms-2">${joke.dislikes}</span>
                        </button>
                    </div>
                </div>
            </div>
            `
        }

        let buttons = document.getElementsByClassName("btn");
        Array.from(buttons).forEach(function (button) {
            button.addEventListener("click", likeDislike);
        })
    }
}

render()

function likeDislike() {
    let title = this.id.split("-")[0];
    let jokeId = this.id.split("-")[1];

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://127.0.0.1:3000/${title}?id=${jokeId}`);
    xhr.send();
    render();
}