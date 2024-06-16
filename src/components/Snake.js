// vi: ft=html
import { updateDom } from '../lib/dom.js';
import { proxify } from '../lib/proxy.js';
import { MAX_LEVEL, startGame } from '../game/game.js';

 //   <style>
const getStyles = () => (`
    :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding-top: 64px;
    }

`);
//    </style>

const getTemplate = (values) => (`
    <section class="game-container">
        <display-component
            board="${values.board}"
            score="${values.score}"
            level="${values.level}"
        ></display-component>
    </section>
`);

// <script>
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(getStyles());

export class Snake extends HTMLElement {
    static observedAttributes = ['level:'];

    #values = {
        play: null,
        board: "[[]]",
        level: 0,
        score: 0,
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#values = proxify(this, this.#values);
        window.addEventListener("message", (event) => {
            if (event.data?.type === 'controls:onclick') {
                this.onPress(event.data);
            }
        });
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
        this.render();
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this.#values[attr] = newValue;
    }

    render() {
        updateDom(this.shadowRoot, getTemplate(this.#values));
    }

    onPress(event) {
        const { pressed } = event.detail;

        if (this.#values.play) {
            const event = this.#values.play(pressed);
            this.play(event.value, this.#values.level);
        } else if (pressed === 0 || pressed === 3) {
            this.startGame();
        } else if (pressed === 1) {
            this.setAttribute('level:', this.#values.level > MAX_LEVEL - 1 ? 0 : this.#values.level + 1)
        } else if (pressed === 2) {
            this.setAttribute('level:', this.#values.level < 1 ? MAX_LEVEL : this.#values.level - 1)
        }
    }

    play(event, level) {
        if (!event) {
            return;
        }
        const { board, score, gameOver } = event;
        this.#values.board = JSON.stringify(board);
        this.#values.score = score;

        if (gameOver) {
            this.#values.play = null;
        }
    }

    startGame() {
        const { level } = this.#values;
        const { play } = startGame(level, (value) => this.play(value));
        this.#values.play = play;
    }
}
// </script>
