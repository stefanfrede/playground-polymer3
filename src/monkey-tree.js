import { LitElement, html } from '@polymer/lit-element';

import './monkey-tree-item';

import * as R from 'ramda';
import { isNotEmpty, isNotNil, isNotNilOrEmpty } from './monkey-tree-utils';

/**
 * `<monkey-tree>` is a __Polymer 3__ element displaying a browsable tree of
 * selectable nodes (`<monkey-tree-item>`).
 *
 * Just add `<monkey-tree>` at the top of your `<body>` and provide
 * a `data-object` via the `data-attribute`.
 *
 * ```html
 * <monkey-tree
 *   data="{
 *     name: 'foobar',
 *     children: [
 *       { name: 'foo', icon: 'public' },
 *       { name: 'bar' },
 *       { name: 'baz', children: [ { name: 'qux'] }
 *     ]"></monkey-tree>
 * ```
 *
 * Per default, you are only able to select one node at a time. To be able to
 * select multiple nodes provide a `mode-attribute` with the value of `multi`.
 *
 * ```html
 * <monkey-tree
 *   mode="multi"
 *   data="{
 *     name: 'foobar',
 *     children: [
 *       { name: 'foo', icon: 'public' },
 *       { name: 'bar' },
 *       { name: 'baz', children: [ { name: 'qux'] }
 *     ]"></monkey-tree>
 * ```
 *
 * You can restrict which type of nodes are selectable. To do so provide
 * a `type-attribute` with the value of either `branch` or `node`.
 *
 * ```html
 * <monkey-tree
 *   type="branch|node"
 *   data="{
 *     name: 'foobar',
 *     children: [
 *       { name: 'foo', icon: 'public' },
 *       { name: 'bar' },
 *       { name: 'baz', children: [ { name: 'qux'] }
 *     ]"></monkey-tree>
 * ```
 * The properties of the `data-object` which affect the `tree` are: `name`,
 * `icon` and `children`. `name` and `icon` are `Strings`, and `children` is an
 * `Array` of `Objects`.
 *
 * [Here](https://material.io/tools/icons/?style=baseline) is a list of
 * selectable icons.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MonkeyTree extends LitElement {
  static get properties() {
    return {
      /**
       * Metadata describing the root node.
       *
       * @type {{name: string, icon: string, children: Array<Object>}}
       */
      data: Object,

      /**
       * Selection mode.
       * Possible values are:
       * single: Single selection.
       * multi: Multi selection.
       */
      mode: String,

      /**
       * Selection type.
       * Possible values are:
       * all: All nodes are selectable.
       * branch: Only branch nodes are selectable.
       * node: Only nodes without children are selectable.
       */
      type: String,

      /**
       * Selected nodes.
       *
       * @type {Array<Object>}
       */
      _model: Array,
    };
  }

  constructor() {
    super();

    this.data = {};
    this.mode = 'single';
    this.type = 'all';
    this._model = [];
  }

  ready() {
    super.ready();

    this.addEventListener('selectNode', this._onSelect);
    this.addEventListener('toggleNode', this._onToggle);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * Fired when node gets selected.
   *
   * @event on-select
   */
  _onSelect(e) {
    e.stopPropagation();

    const isTreeItem = node => node.tagName === 'MONKEY-TREE-ITEM';

    const target = e.detail;
    const isNotTarget = R.compose(
      R.not,
      R.equals(target),
    );
    const isValidTarget = R.both(isNotNil, isTreeItem);

    const path = e.composedPath();
    const ancestors = R.filter(isNotTarget, R.filter(isTreeItem, path));

    // Check if the current target node is a tree-item
    if (isValidTarget(target)) {
      // Check if single selection is active
      if (this.mode !== 'multi') {
        // Check if there is already a selected node
        if (isNotEmpty(this._model)) {
          const selected = this._model[0].key;
          const isNotEqualTarget = R.compose(
            R.not,
            R.equals(target),
          );

          // Check if the already selected node is the current target node and
          // if not deselect it
          if (isNotEqualTarget(selected)) {
            this._removeSelected(selected, this._model);
          }
        }
      }

      // Check if the target node is already selected and if it is deselct it
      if (target.data.selected) {
        this._removeSelected(target, this._model);
      } else {
        // Check if the target node is marked and if it is deselect all children
        if (target.data.marked) {
          this._deselectChildren(target.children.dom, this._model);
        }

        const [selectedAncestor] = R.filter(
          ancestor => ancestor.selected,
          ancestors,
        );

        // Check if there is a selected ancestor and if it is deselect it and
        // select all children except for the target node. Otherwise select the
        // target node.
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

      // Check if there are selected nodes and if there are gather all there
      // ancestor nodes, unify them and mark them.
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

  /**
   * Fired when node children gets toggled.
   *
   * @event on-toggle
   */
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

  _render({ data, type }) {
    return html`
      <style>
        :host {
          display: inline-flex;
          outline: none;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <monkey-tree-item data="${data}" type="${type}"></monkey-tree-item>
    `;
  }
}

// Register the element with the browser.
window.customElements.define('monkey-tree', MonkeyTree);
