import { LitElement, html } from '@polymer/lit-element';

import './monkey-tree-item';

import * as R from 'ramda';

const isNotEmpty = R.complement(R.isEmpty);
const isNotNil = R.complement(R.isNil);

const containsClass = R.curry((node, className) =>
  node.classList.contains(className)
);

const containsClassMarked = containsClass(R.__, 'marked');
const containsClassSelected = containsClass(R.__, 'selected');
const isNotNilOrEmpty = R.both(isNotEmpty, isNotNil);

class MonkeyTree extends LitElement {
  static get properties() {
    return {
      data: Object,
      model: Array,
    };
  }

  constructor() {
    super();

    this.data = {};
    this.model = [];
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
      if (target.data.selected) {
        this._removeSelected(target, this.model);
      } else {
        if (target.data.marked) {
          this._deselectChildren(target.children.dom, this.model);
        }

        const [selectedAncestor] = R.filter(R.prop('selected'), ancestors);

        if (isNotNil(selectedAncestor)) {
          this._removeSelected(selectedAncestor, this.model);
          this._deselectChild(
            Array.from(selectedAncestor.children.dom),
            selectedAncestor,
            ancestors,
            target
          );
        } else {
          this._addSelected(target, ancestors);
        }
      }

      if (isNotEmpty(this.model)) {
        R.forEach(
          node => (node.marked = true),
          R.uniq(
            R.reduce((acc, node) => [...acc, ...node.value], [], this.model)
          )
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
    this.model.push(object);
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
      this.model.splice(index, 1);
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
