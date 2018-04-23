import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/**
 * `rumo-tree`
 * Simple Polymer 3 tree component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RumoTree extends PolymerElement {
  static get properties () {
    return {
      message: {
        type: String,
        value: ''
      },
    };
  }

  constructor() {
    super();

    this.message = 'Hello World! I\'m a Polymer element :)';
  }

  ready() {
    super.ready();

    console.log(this.tagName);
  }

  static get template () {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <h1>
        rumo-tree
      </h1>
      <p>
        [[message]]
      </p>
    `;
  }
}

// Register the element with the browser.
customElements.define('rumo-tree', RumoTree);
