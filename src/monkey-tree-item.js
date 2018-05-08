import { LitElement, html } from '@polymer/lit-element';

import * as R from 'ramda';

import {
  fileIcon,
  folderIcon,
  folderOpenIcon,
  minusIcon,
  plusIcon,
  spinnerIcon,
} from './monkey-tree-icons.js';

import { style } from './monkey-tree-css.js';

const isNotEmpty = R.complement(R.isEmpty);
const isNotNil = R.complement(R.isNil);
const isNotNilOrEmpty = R.both(isNotEmpty, isNotNil);

class MonkeyTreeItem extends LitElement {
  static get properties() {
    return {
      data: Object,
      _nodeOpened: Boolean,
      _nodeSelected: Boolean,
    };
  }

  get domChildren() {
    return this.shadowRoot.querySelectorAll('monkey-tree-item');
  }

  get children() {
    return isNotNil(this.data)
      ? R.and(isNotNilOrEmpty(this.data.children), R.is(Array))
        ? this.data.children
        : []
      : [];
  }

  get hasChildren() {
    return isNotEmpty(this.children);
  }

  get icon() {
    return this.hasChildren
      ? this.opened
        ? folderOpenIcon
        : folderIcon
      : fileIcon;
  }

  get opened() {
    return isNotNil(this.data)
      ? R.and(
          isNotNilOrEmpty(this.data.opened),
          R.equals(this.data.opened, true)
        )
        ? true
        : false
      : false;
  }

  set opened(newOpened) {
    this.data.opened = newOpened;
    this._nodeOpened = newOpened;
  }

  get name() {
    return isNotNil(this.data)
      ? isNotNilOrEmpty(this.data.name)
        ? this.data.name
        : ''
      : '';
  }

  get nodeId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  get selected() {
    return !!this.data.selected;
  }

  _selectNode() {
    this.dispatchEvent(
      new CustomEvent('selectNode', {
        bubbles: true,
        composed: true,
        detail: this,
      })
    );
  }

  _toggleNode() {
    this.dispatchEvent(
      new CustomEvent('toggleNode', {
        bubbles: true,
        composed: true,
        detail: this,
      })
    );
  }

  _renderStyle() {
    return style;
  }

  _renderButton() {
    if (this.hasChildren) {
      return html`
        <button class="btn" on-click="${() => this._toggleNode()}">
          <span class="btn__icon btn__icon--small">
            ${this.opened ? minusIcon : plusIcon}
          </span>
        </button>
      `;
    }
  }

  _renderList() {
    if (R.and(this.opened, this.hasChildren)) {
      return html`
        <ul role="group">
          ${this.data.children.map(
            (child, index, array) =>
              html`
                <li
                  role="treeitem"
                  aria-level="2"
                  aria-setsize="${array.length}"
                  aria-posinset="${index + 1}">
                  <monkey-tree-item data="${child}"></monkey-tree-item>
                </li>
              `
          )}
        </ul>
      `;
    }
  }

  _render({ _nodeOpened, _nodeSelected }) {
    return html`
      ${this._renderStyle()}
      <ul role="tree">
        <li
          role="treeitem"
          aria-level="1"
          aria-setsize="1"
          aria-posinset="1">
          <div class="row">
            <div class="btn__placeholder">
              ${this._renderButton()}
            </div>
            <button class="btn" on-click="${() => this._selectNode()}">
              <span
                class$="${
                  this.hasChildren
                    ? 'btn__icon btn__icon--type'
                    : 'btn__icon btn__icon--type btn__icon--smaller'
                }">
                ${this.icon}
              </span>
              <span>
                ${this.name}
              </span>
            </button>
          </div>
          ${this._renderList()}
        </li>
      </ul>
    `;
  }
}

// Register the element with the browser.
window.customElements.define('monkey-tree-item', MonkeyTreeItem);
