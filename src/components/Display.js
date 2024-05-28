// vi: ft=html
import { updateDom } from '../lib/dom.js';
import { proxify } from '../lib/proxy.js';

// <style>
const getStyles = () => (`
    :host { display: block; }
    .container {
        aspect-ratio: 3/4;

        border: 2px solid var(--fg-col);
        height: calc(56.25svw - 8px);
        width: calc(100vw - 8px);
        margin: 0 auto;

        display:  grid;
        grid-template-columns: 4fr 1fr;
    }

    @media (aspect-ratio < 0.57) {
        .container {
            width: 100%;
        }
    }
`);
// </style>

const getTemplate = (values) => (`
    <section class="container">
        <block-heap class="block-heap" board:="${values.board}"></block-heap>
        <status-component
            class="status"
            score="${values.score}"
            level="${values.level}"
        >
        </status-component>
    </section>
`);

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(getStyles());

// <script>
export class Display extends HTMLElement {
    static observedAttributes = ['board', 'score', 'level'];
    #values = {
        board: '[[]]',
        score: 312,
        level: 0,
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#values = proxify(this, this.#values);
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
        this.render();
    }

    attributeChangedCallback(prop, oldValue, newValue) {
        this.#values[prop] = newValue;
    }

    render() {
        updateDom(this.shadowRoot, getTemplate(this.#values));
    }
}
// </script>
