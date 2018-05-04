import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';

import '@polymer/paper-styles/color.js';
import '@polymer/paper-styles/typography.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';

import * as R from 'ramda';

class MonkeyTreeItem extends PolymerElement {
  static get properties() {
    return {
      data: {
        type: Object,
        value() {
          return {};
        },
      },
      icon: {
        type: String,
        computed: '_computeIcon(data.icon, data.children)',
      },
      open: {
        type: Boolean,
        computed: '_computeOpen(data.open, data.children, data.root)',
      },
    };
  }

  _computeOpen(open = false, children, root = false) {
    const status = this._hasChildren(children)
      ? open
        ? 'node__status--expanded'
        : 'node__status--collapsed'
      : root
        ? 'node__status--loading'
        : '';

    return `node__status ${status}`;
  }

  _computeIcon(icon = '', children) {
    return this._isNotEmpty(icon)
      ? icon
      : this._hasChildren(children)
        ? 'folder'
        : 'description';
  }

  _selectNode() {
    this.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        composed: true,
        detail: this,
      })
    );
  }

  _toggleChildren() {
    this.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        composed: true,
        detail: this,
      })
    );
  }

  _isNotEmpty(item) {
    return R.compose(R.not, R.isEmpty)(item);
  }

  _hasChildren(children) {
    return R.both(R.is(Array), this._isNotEmpty)(children);
  }

  setOpen(open, children) {
    this.set('data.open', R.and(R.not(open), this._hasChildren(children)));
  }

  getChildren() {
    return this.shadowRoot.querySelectorAll('monkey-tree-item');
  }

  static get template() {
    return html`
      <style>
        :host {
          /**
           * Typography settings
           */
          @apply --paper-font-body1;

          /**
           * Generic variables for easy theming
           */
          --primary-text-color: var(--light-theme-text-color);
          --primary-background-color: var(--light-theme-background-color);
          --secondary-text-color: var(--light-theme-secondary-color);
          --disabled-text-color: var(--light-theme-disabled-color);
          --divider-color: var(--light-theme-divider-color);
          --error-color: var(--paper-deep-orange-a700);

          /**
           * Primary and accent colors
           */
          --primary-color: var(--paper-blue-500);
          --light-primary-color: var(--paper-blue-100);
          --dark-primary-color: var(--paper-blue-700);

          --accent-color: var(--paper-blue-a200);
          --light-accent-color: var(--paper-blue-a100);
          --dark-accent-color: var(--paper-blue-a400);

          /**
           * Light background theme
           */
          --light-theme-background-color: #ffffff;
          --light-theme-base-color: #000000;
          --light-theme-text-color: var(--paper-grey-900);
          --light-theme-secondary-color: var(--paper-grey-600);
          --light-theme-disabled-color: var(--paper-grey-500);
          --light-theme-divider-color: #dbdbdb;

          /**
           * Color transition for hover effects
           */
          --color-transition: color 0.25s ease-out;

          background-color: var(--primary-background-color);
          color: var(--primary-text-color);
          display: inline-block;
        }

        :host(.selected) .node__label .node__icon,
        :host(.selected) .node__label .node__name {
          color: var(--primary-color);
        }

        :host(.marked) .node__label .node__icon {
          color: var(--light-accent-color);
        }

        .node__data-container {
          align-items: center;
          display: flex;
        }

        .node__children-container {
          display: flex;
          flex-direction: column;
          padding-left: 24px;
        }

        .node__status {
          align-items: center;
          display: flex;
          height: 24px;
          justify-content: center;
          width: 24px;
        }

        .node__status--collapsed,
        .node__status--expanded {
          cursor: pointer;
        }

        .node__status > .node__icon {
          color: var(--primary-text-color);
          display: none;
          transition: var(--color-transition);
        }

        .node__status:hover > .node__icon {
          color: var(--dark-accent-color);
        }

        .node__status--collapsed .node__icon--open,
        .node__status--expanded .node__icon--close,
        .node__status--loading .node__icon--load {
          display: inline-block;
        }

        .node__icon {
          color: var(--secondary-text-color);
          height: 24px;
          width: 24px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .node__icon--load {
          animation: spin 1s linear infinite;
        }

        .node__icon--small {
          height: 16px;
          width: 16px;
        }

        .node__label {
          align-items: center;
          cursor: pointer;
          display: flex;
          transition: var(--color-transition);
        }

        .node__name {
          margin-left: 0.45em;
        }

        .node__label:hover .node__icon,
        .node__label:hover .node__name {
          color: var(--dark-accent-color) !important;
        }
      </style>

      <div class="node__data-container">
        <div class$="{{open}}" on-click="_toggleChildren">
          <iron-icon
            class="node__icon node__icon--small node__icon--load"
            icon="autorenew"></iron-icon>
          <iron-icon
            class="node__icon node__icon--small node__icon--open"
            icon="add"></iron-icon>
          <iron-icon
            class="node__icon node__icon--small node__icon--close"
            icon="remove"></iron-icon>
        </div>
        <div class="node__label" on-click="_selectNode">
          <iron-icon class="node__icon" icon$="{{icon}}"></iron-icon>
          <span class="node__name">
            {{data.name}}
          </span>
        </div>
      </div>
      <template is="dom-if" if="{{data.open}}">
        <div class="node__children-container">
          <template is="dom-repeat" items="{{data.children}}">
            <monkey-tree-item data="{{item}}"></monkey-tree-item>
          </template>
        </div>
      </template>
    `;
  }
}

// Register the element with the browser.
window.customElements.define('monkey-tree-item', MonkeyTreeItem);
