import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import './rumo-tree-item';

class RumoTree extends PolymerElement {
  static get properties () {
    return {
      data: {
        type: Object,
        value() {
          return {};
        },
        observer: '_dataChanged'
      },
      selected: {
        type: Object,
        notify: true,
        value() {
          return null;
        }
      }
    };
  }

  ready() {
    super.ready();

    console.log(this.tagName);

    this.addEventListener('select', this._selectNode);
  }

  _dataChanged() {
    this.$.root.data = this.data;
  }

  _selectNode(e) {
    if (this.selected) {
      this.selected.classList.toggle('selected');
    }

    if (e.detail && e.detail.tagName === 'RUMO-TREE-ITEM') {
      this.selected = e.detail;
      this.selected.classList.toggle('selected');
    }
  }

  static get template () {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <rumo-tree-item id="root" data="[[data]]"></rumo-tree-item>
    `;
  }
}

// Register the element with the browser.
customElements.define('rumo-tree', RumoTree);
