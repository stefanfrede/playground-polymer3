import { html } from '@polymer/lit-element';

export const style = html`
  <style>
    button {
      border: none;
      margin: 0;
      padding: 0;
      width: auto;
      overflow: visible;

      background: transparent;

      /* inherit font & color from ancestor */
      color: inherit;
      font: inherit;

      /* Normalize line-height. Cannot be changed from normal in Firefox 4+. */
      line-height: normal;

      /* Corrects font smoothing for webkit */
      -webkit-font-smoothing: inherit;
      -moz-osx-font-smoothing: inherit;

      /* Corrects inability to style clickable input types in iOS */
      -webkit-appearance: none;
    }

    /* Remove excess padding and border in Firefox 4+ */
    button::-moz-focus-inner {
        border: 0;
        padding: 0;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    :host {
      --primary: #424242;
      --primary-lighter: #6d6d6d;
      --primary-darker: #1b1b1b;
      --secondary: #ff4081;
      --secondary-lighter: #ff79b0;
      --secondary-darker: #c60055;

      display: inline-block;
    }

    :host .btn {
      color: var(--primary-darker);
    }

    :host .btn__placeholder .btn__icon > svg,
    :host .btn__icon--type > svg {
      fill: var(--primary);
    }

    :host .btn:hover,
    :host(.selected) .btn {
      color: var(--secondary-darker);
    }

    :host .btn__placeholder .btn:hover .btn__icon > svg,
    :host .btn:hover .btn__icon--type > svg ,
    :host(.selected) .btn__icon--type > svg {
      fill: var(--secondary) !important;
    }

    :host(.marked) > [role="tree"] > [role="treeitem"] > .row {
      color: var(--primary-lighter);
    }

    :host(.marked) > [role="tree"] > [role="treeitem"] > .row .btn__icon--type > svg {
      fill: var(--primary-lighter);
    }

    [role="tree"],
    [role="group"] {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    [role="group"] {
      margin-left: 1.5rem;
    }

    [role="treeitem"] {
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
    }

    .btn {
      align-items: center;
      cursor: pointer;
      display: flex;
      transition: color 0.25s ease-out;
    }

    .btn__icon,
    .btn__icon > svg,
    .btn__placeholder {
      height: 1.5rem;
      width: 1.5rem;
    }

    .btn__icon {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .btn__icon + span {
      margin-left: 0.25rem;
    }

    .btn__icon > svg {
      transition: fill 0.25s ease-out;
    }

    .btn__icon--smaller > svg {
      height: 1.4rem;
      width: 1.4rem;
    }

    .btn__icon--small > svg {
      height: 1rem;
      width: 1rem;
    }
  </style>
`;
