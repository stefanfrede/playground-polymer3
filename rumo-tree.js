import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import './rumo-tree-item';

import * as R from 'ramda';

class RumoTree extends PolymerElement {
  static get properties() {
    return {
      data: {
        type: Object,
        value() {
          return {
            icon: 'folder',
            name: 'Loading…',
            root: true,
          };
        },
        observer: '_onDataChange',
      },
      marked: {
        type: Array,
        notify: true,
        value() {
          return [];
        },
      },
      selected: {
        type: Object,
        notify: true,
        value() {
          return {};
        },
      },
    };
  }

  ready() {
    super.ready();

    this.addEventListener('select', this._onSelect);
    this.addEventListener('toggle', this._onToggle);
  }

  _onDataChange() {
    this.$.root.data = this.data;
  }

  _onSelect(e) {
    const path = e.composedPath();
    const target = e.detail;

    const isNotTarget = R.compose(R.not, R.equals(target));

    const isTreeItem = node => node.tagName === 'RUMO-TREE-ITEM';
    const treeItems = R.filter(isTreeItem, path);

    const addClass = R.curry((node, className) =>
      node.classList.add(className)
    );

    const removeClass = R.curry((node, className) =>
      node.classList.remove(className)
    );

    const addClassMarked = addClass(R.__, 'marked');
    const addClassSelected = addClass(R.__, 'selected');
    const removeClassMarked = removeClass(R.__, 'marked');
    const removeClassSelected = removeClass(R.__, 'selected');

    const isNotEmpty = R.compose(R.not, R.isEmpty);
    const isNotNil = R.compose(R.not, R.isNil);

    const addMarked = node => {
      addClassMarked(node);
      this.push('marked', node);
    };

    const addSelected = node => {
      addClassSelected(node);
      this.set('selected', node);
    };

    if (isNotEmpty(this.marked)) {
      R.forEach(removeClassMarked, this.marked);
      this.set('marked', []);
    }

    if (isNotEmpty(this.selected)) {
      removeClassSelected(this.selected);
    }

    if (R.and(isNotNil(target), isTreeItem(target))) {
      addSelected(target);
      R.forEach(R.when(isNotTarget, addMarked), treeItems);
    }
  }

  _onToggle(e) {
    const target = e.detail;
    const data = target.data;

    target.setOpen(data.open, data.children);
  }

  static get template() {
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
window.customElements.define('rumo-tree', RumoTree);
