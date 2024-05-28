import { Snake } from './components/Snake.js'
import { Controls } from './components/Controls.js'
import { Display } from './components/Display.js'
import { BlockHeap } from './components/BlockHeap.js'
import { StatusComponent } from './components/Status.js'

// Try the same with <link
document.getElementById('global-styles').content.querySelectorAll('style').forEach((node) => {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(node.innerText);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
});

customElements.define('display-component', Display);
customElements.define('snake-component', Snake);
customElements.define('controls-component', Controls);
customElements.define('block-heap', BlockHeap);
customElements.define('status-component', StatusComponent);
