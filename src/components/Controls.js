// vi: ft=html
import { clsj, updateDom } from '../lib/dom.js';
import { proxify } from '../lib/proxy.js';

// <style>
const getStyles = () => (`
    :host {
        display: flex;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);

        transform: rotate3d(0, 0, 1, -45deg);

        width: fit-content;
        flex: 0 1 auto;
        margin: 0 auto;
    }

    .button {
        min-width: 64px;
        aspect-ratio: 1;
        margin: 0 auto;
        background: var(--fg-col);
        color: var(--bg-col);
        border: 4px solid var(--fg-col);
        overflow: hidden;
        font-size: 32px;
        appearance: none;
        line-height: 100%;
        padding: 0;

        &.active {
            background: var(--bg-col);
            color: var(--fg-col);
        }

        &:nth-of-type(1) {
            border-top-left-radius: 100%;
        }
        &:nth-of-type(2) {
            border-top-right-radius: 100%;
        }
        &:nth-of-type(3) {
            border-bottom-left-radius: 100%;
        }
        &:nth-of-type(4) {
            border-bottom-right-radius: 100%;
        }

        & > .button-label {
            transform: rotate3d(0, 0, 1, 45deg);
            display: inline-block;
        }
    }

    .container, .button {
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
    }


    @container (aspect-ratio < 5) {
        .button {
            width: 100%;
            margin: auto 0;
        }
    }
`);
// </style>

const getTemplate = (values) => (`
    <section class="container">
        ${['⇦ ', '⇧ ', '⇩ ', '⇨ '].map((label, index) =>(`
            <button
                 class="button ${clsj({ active: values.pressed === index })}"
                 onMouseDown="this.getRootNode().host.onDown(${index})"
                 onMouseUp="this.getRootNode().host.onUp(${index})"
             ><span class="button-label">${label}</span></button>
        `)).join('')}
    </section>
`);

// <script>
const stylesSheet = new CSSStyleSheet();
stylesSheet.replaceSync(getStyles());

export class Controls extends HTMLElement {
    static observedAttributes = ['onpress'];
    #values = { pressed: -1 }
    #keydown = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#values = proxify(this, this.#values);
        this.#keydown = ({ code, shiftKey }) => {
            let pressed = -1;

            if (code === 'ArrowLeft' || code === 'h') {
                pressed = 0;
            } else if (code === 'ArrowUp' || code === 'k') {
                pressed = 1;
            } else if (code === 'ArrowDown' || code === 'j') {
                pressed = 2;
            } else if (code === 'ArrowRight' || code === 'l') {
                pressed = 3;
            }

            if (pressed < 0) {
                return;
            }
            this.dispatchEvent(new CustomEvent('press', {
                detail: { pressed }
            }));
        };
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesSheet];
        this.render();
        window.addEventListener('keydown', this.#keydown);
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this.#keydown);
    }

    attributeChangedCallback(prop, oldValue, newValue) {
        this.#values[prop] = newValue;
    }

    render() {
        updateDom(this.shadowRoot, getTemplate(this.#values));
    }

    onDown(pressed) {
        this.#values.pressed = pressed;
        this.dispatchEvent(new CustomEvent('press', {
            detail: { pressed }
        }));
    }

    onUp(released) {
        if (released === this.#values.pressed) {
            this.#values.pressed = -1;
        }
    }
}
// </script>
