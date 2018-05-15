import { LitElement, html } from '@polymer/lit-element';

import './monkey-tree-item';

import * as R from 'ramda';
import { isNotEmpty, isNotNil, isNotNilOrEmpty } from './monkey-tree-utils';

class MonkeyTree extends LitElement {
  static get properties() {
    return {
      data: Object,
      mode: String,
      _model: Array,
    };
  }

  constructor() {
    super();

    this.data = {};
    this.mode = 'single';
    this._model = [];
  }

  ready() {
    super.ready();

    this.addEventListener('selectNode', this._onSelect);
    this.addEventListener('toggleNode', this._onToggle);
  }

  _onSelect(e) {
    e.stopPropagation();

    const isTreeItem = node => node.tagName === 'MONKEY-TREE-ITEM';

    const target = e.detail;
    const isNotTarget = R.compose(R.not, R.equals(target));
    const isValidTarget = R.both(isNotNil, isTreeItem);

    const path = e.composedPath();
    const ancestors = R.filter(isNotTarget, R.filter(isTreeItem, path));

    if (isValidTarget(target)) {
      if (this.mode !== 'multi') {
        if (isNotEmpty(this._model)) {
          const selected = this._model[0].key;
          const isNotEqualTarget = R.compose(R.not, R.equals(target));

          if (isNotEqualTarget(selected)) {
            this._removeSelected(selected, this._model);
          }
        }
      }

      if (target.data.selected) {
        this._removeSelected(target, this._model);
      } else {
        if (target.data.marked) {
          this._deselectChildren(target.children.dom, this._model);
        }

        const [selectedAncestor] = R.filter(
          ancestor => ancestor.selected,
          ancestors,
        );

        if (isNotNil(selectedAncestor)) {
          this._removeSelected(selectedAncestor, this._model);
          this._deselectChild(
            Array.from(selectedAncestor.children.dom),
            selectedAncestor,
            ancestors,
            target,
          );
        } else {
          this._addSelected(target, ancestors);
        }
      }

      if (isNotEmpty(this._model)) {
        R.forEach(
          node => (node.marked = true),
          R.uniq(
            R.reduce((acc, node) => [...acc, ...node.value], [], this._model),
          ),
        );
      }
    }
  }

  _onToggle(e) {
    e.stopPropagation();

    const target = e.detail;
    target.opened = !target.opened;
  }

  _deselectChild(children, parent, ancestors, target) {
    children.forEach(child => {
      const findChildIn = R.findIndex(R.equals(child));
      const index = findChildIn(ancestors);
      const hasSelected = !!~index;

      if (hasSelected) {
        this._deselectChild(child.children.dom, child, ancestors, target);
      } else {
        if (R.not(R.equals(child, target))) {
          const findParentIn = R.findIndex(R.equals(parent));
          const index = findParentIn(ancestors);

          this._addSelected(child, ancestors.slice(index));
        }
      }
    });
  }

  _deselectChildren(children, selected) {
    children.forEach(child => {
      if (child.selected) {
        this._removeSelected(child, selected);
      }

      if (isNotNilOrEmpty(child.data.children)) {
        this._deselectChildren(child.children.dom, selected);
      }
    });
  }

  _addSelected(target, ancestors) {
    const object = {
      key: target,
      value: ancestors,
    };

    target.selected = true;
    this._model.push(object);
  }

  _removeSelected(target, selected) {
    const findTargetIn = R.findIndex(R.propEq('key', target));
    const index = findTargetIn(selected);

    const isSelected = !!~index;

    if (isSelected) {
      const ancestors = selected[index].value;

      if (isNotEmpty(ancestors)) {
        ancestors.forEach(ancestor => (ancestor.marked = false));
      }

      target.selected = false;
      this._model.splice(index, 1);
    }
  }

  _render({ data }) {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <monkey-tree-item data="${data}"></monkey-tree-item>
    `;
  }
}

// Register the element with the browser.
window.customElements.define('monkey-tree', MonkeyTree);
