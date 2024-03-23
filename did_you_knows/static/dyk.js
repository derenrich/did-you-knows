import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import miniStyles from 'https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-nord.css' assert { type: 'css' };


import miniStyles2 from 'https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-nord.css' with { type: 'css' };

const getRandomHooks = async (num) => {
    const response = await fetch(`/api/random_hooks/${num}`);
    return await response.json();
};

class DYKsHolder extends LitElement {
    constructor() {
        super();
        this.randomHooks = getRandomHooks(10);
    }

    static styles = [miniStyles];

    render() {
        return html`
            <dyk-card name="Stenka Razin" class="col-sm-3"
                dyk="... that the first Russian feature film, Stenka Razin (poster pictured), depicts the historical Cossack leader throwing a princess into the Volga?"
                imgUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Razin_film.jpg/402px-Razin_film.jpg"></dyk-card>
        `
    }
}

class DYK extends LitElement {
    static properties = {
        name: { type: String },
        dyk: { type: String },
        imgUrl: { type: String },
    };



    constructor() {
        super();
        this.randomHooks = getRandomHooks(10);
    }

    static styles = [css`
    .dyk-thumb {
        float: right;
    }
    .card :first-child {
        background-color: #CEE0F2 ;
    }
    `, miniStyles];

    render() {
        return html`
            <div class="card large dyk-card">
                <div class="section">
                    <h1>${this.name}</h1>
                </div>
                <div class="section">
                    <img class="dyk-thumb" width="100px" src="${this.imgUrl}" alt="random image" />
                    <p>${this.dyk}</p>
                </div>
            </div>
    `;
    }
}
customElements.define('dyks-holder', DYKsHolder);
customElements.define('dyk-card', DYK);