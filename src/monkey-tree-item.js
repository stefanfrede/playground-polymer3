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
      _opened: Boolean,
      _marked: Boolean,
      _selected: Boolean,
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

  get id() {
    return isNotNilOrEmpty(this.data.id)
      ? this.data.id
      : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
        );
  }

  get name() {
    return isNotNil(this.data)
      ? isNotNilOrEmpty(this.data.name)
        ? this.data.name
        : 'Loading…'
      : 'Loading…';
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

  set opened(opened) {
    this.data.opened = opened;
    this._opened = opened;
  }

  get selected() {
    return isNotNil(this.data)
      ? R.and(
          isNotNilOrEmpty(this.data.selected),
          R.equals(this.data.selected, true)
        )
        ? true
        : false
      : false;
  }

  set selected(selected) {
    this.data.selected = selected;
    this._selected = selected;
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

  _renderList() {
    if (R.and(this.opened, isNotEmpty(this.children))) {
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

  _renderSelectionButton() {
    return html`
      <button class="btn" on-click="${() => this._selectNode()}">
        <span
          class$="btn__icon btn__icon--type ${
            R.isEmpty(this.children) ? 'btn__icon--smaller' : ''
          }">
          ${
            isNotEmpty(this.children)
              ? this.opened
                ? folderOpenIcon
                : folderIcon
              : fileIcon
          }
        </span>
        <span>
          ${this.name}
        </span>
      </button>
    `;
  }

  _renderToggleButton() {
    if (isNotEmpty(this.children)) {
      return html`
        <button class="btn" on-click="${() => this._toggleNode()}">
          <span class="btn__icon btn__icon--small">
            ${this.opened ? minusIcon : plusIcon}
          </span>
        </button>
      `;
    }
  }

  _render({ _marked, _opened, _selected }) {
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
              ${this._renderToggleButton()}
            </div>
            ${this._renderSelectionButton()}
          </div>
          ${this._renderList()}
        </li>
      </ul>
    `;
  }
}

// Register the element with the browser.
window.customElements.define('monkey-tree-item', MonkeyTreeItem);
