import { LitElement, html } from '@polymer/lit-element';

import { style } from './monkey-tree-css.js';
import { Icon } from '@material/mwc-icon';

import * as R from 'ramda';

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

  get children() {
    const defaultValue = [];

    return isNotNil(this.data)
      ? R.and(isNotNilOrEmpty(this.data.children), R.is(Array))
        ? {
            data: this.data.children,
            dom: this.shadowRoot.querySelectorAll('monkey-tree-item'),
          }
        : defaultValue
      : defaultValue;
  }

  get icon() {
    const defaultValue = 'description';

    return isNotNil(this.data)
      ? isNotNilOrEmpty(this.data.icon)
        ? this.data.icon
        : isNotNilOrEmpty(this.data.children)
          ? this.data.opened
            ? 'folder_open'
            : 'folder'
          : defaultValue
      : defaultValue;
  }

  get id() {
    const defaultValue = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
      /[018]/g,
      c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );

    return isNotNilOrEmpty(this.data)
      ? isNotNilOrEmpty(this.data.id)
        ? this.data.id
        : defaultValue
      : defaultValue;
  }

  get marked() {
    const defaultValue = false;

    return isNotNil(this.data)
      ? R.and(
          isNotNilOrEmpty(this.data.marked),
          R.equals(this.data.marked, true)
        )
        ? true
        : defaultValue
      : defaultValue;
  }

  set marked(marked) {
    this.data.marked = marked;
    this._marked = marked;
  }

  get name() {
    const defaultValue = 'Loading…';

    return isNotNil(this.data)
      ? isNotNilOrEmpty(this.data.name)
        ? this.data.name
        : defaultValue
      : defaultValue;
  }

  get opened() {
    const defaultValue = false;

    return isNotNil(this.data)
      ? R.and(
          isNotNilOrEmpty(this.data.opened),
          R.equals(this.data.opened, true)
        )
        ? true
        : defaultValue
      : defaultValue;
  }

  set opened(opened) {
    this.data.opened = opened;
    this._opened = opened;
  }

  get selected() {
    const defaultValue = false;

    return isNotNil(this.data)
      ? R.and(
          isNotNilOrEmpty(this.data.selected),
          R.equals(this.data.selected, true)
        )
        ? true
        : defaultValue
      : defaultValue;
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
          ${this.children.data.map(
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
        <span class="btn__icon">
          <mwc-icon>${this.icon}</mwc-icon>
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
          <span class="btn__icon">
            ${
              this.opened
                ? html`<mwc-icon>remove</mwc-icon>`
                : html`<mwc-icon>add</mwc-icon>`
            }
          </span>
        </button>
      `;
    }
  }

  _render({ _marked, _opened, _selected }) {
    return html`
      ${this._renderStyle()}
      <ul role="tree" class$="${
        this.selected ? 'selected' : this.marked ? 'marked' : ''
      }">
        <li
          role="treeitem"
          aria-level="1"
          aria-setsize="1"
          aria-posinset="1">
          <div class="row">
            ${this._renderToggleButton()}
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
