import { LitElement, html } from '@polymer/lit-element';

import './rumo-tree-item';

import * as R from 'ramda';

const isNotEmpty = R.complement(R.isEmpty);
const isNotNil = R.complement(R.isNil);

const containsClass = R.curry((node, className) =>
  node.classList.contains(className)
);

const containsClassMarked = containsClass(R.__, 'marked');
const containsClassSelected = containsClass(R.__, 'selected');

class RumoTree extends LitElement {
  static get properties() {
    return {
      data: Object,
      selected: Array,
    };
  }

  constructor() {
    super();

    this.data = {
      icon: 'folder',
      name: 'Loading…',
      root: true,
    };

    this.selected = [];
  }

  ready() {
    super.ready();

    this.addEventListener('select', this._onSelect);
    this.addEventListener('toggle', this._onToggle);
  }

  _onSelect(e) {
    const isTreeItem = node => node.tagName === 'RUMO-TREE-ITEM';

    const target = e.detail;
    const isNotTarget = R.compose(R.not, R.equals(target));
    const isValidTarget = R.both(isNotNil, isTreeItem);

    const path = e.composedPath();
    const ancestors = R.filter(isNotTarget, R.filter(isTreeItem, path));

    if (isValidTarget(target)) {
      if (containsClassSelected(target)) {
        this._removeSelected(target, this.selected);
      } else {
        if (containsClassMarked(target)) {
          this._deselectChildren(target.getChildren(), this.selected);
        }

        const [selectedAncestor] = R.filter(containsClassSelected, ancestors);

        if (isNotNil(selectedAncestor)) {
          this._removeSelected(selectedAncestor, this.selected);
          this._deselectChild(
            Array.from(selectedAncestor.getChildren()),
            selectedAncestor,
            ancestors,
            target
          );
        } else {
          this._addSelected(target, ancestors);
        }
      }

      if (isNotEmpty(this.selected)) {
        R.forEach(this._addSelection, this.selected);
      }
    }
  }

  _onToggle(e) {
    const target = e.detail;
    const data = target.data;

    target.setOpen(data.open, data.children);
  }

  _deselectChild(children, parent, ancestors, target) {
    children.forEach(child => {
      const findChildIn = R.findIndex(R.equals(child));
      const index = findChildIn(ancestors);
      const hasSelected = !!~index;

      if (hasSelected) {
        this._deselectChild(child.getChildren(), child, ancestors, target);
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
    const hasChildren = R.compose(
      R.both(isNotNil, isNotEmpty),
      R.prop('children')
    );

    children.forEach(child => {
      if (containsClassSelected(child)) {
        this._removeSelected(child, selected);
      }

      if (hasChildren(child.data)) {
        this._deselectChildren(child.getChildren(), selected);
      }
    });
  }

  _addSelected(key, value) {
    const object = {
      key,
      value,
    };

    this.selected.push(object);
  }

  _removeSelected(target, selected) {
    const findTargetIn = R.findIndex(R.propEq('key', target));
    const index = findTargetIn(selected);

    const isSelected = !!~index;

    if (isSelected) {
      this._removeSelection(selected[index]);
      this.selected.splice(index, 1);
    }
  }

  _addSelection(target) {
    const addClass = R.curry((node, className) =>
      node.classList.add(className)
    );
    const addClassMarked = addClass(R.__, 'marked');
    const addClassSelected = addClass(R.__, 'selected');

    addClassSelected(target.key);
    R.forEach(addClassMarked, target.value);
  }

  _removeSelection(target) {
    const removeClass = R.curry((node, className) =>
      node.classList.remove(className)
    );

    const removeClassMarked = removeClass(R.__, 'marked');
    const removeClassSelected = removeClass(R.__, 'selected');

    // Remove the selected class from target
    removeClassSelected(target.key);
    // Remove the marked class from target ancestors
    R.forEach(removeClassMarked, target.value);
  }

  _render({ data }) {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <rumo-tree-item id="root" data="${data}"></rumo-tree-item>
    `;
  }
}

// Register the element with the browser.
window.customElements.define('rumo-tree', RumoTree);
