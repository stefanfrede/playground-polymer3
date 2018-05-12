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

    [role="tree"].marked > [role="treeitem"] > .row > .btn:last-child > span {
      color: var(--primary-lighter);
    }

    [role="tree"].marked > [role="treeitem"] > .row > .btn:last-child > .btn__icon {
      color: var(--primary-lighter);
    }

    .row {
      display: flex;
    }

    .btn {
      align-items: center;
      color: var(--primary-darker);
      cursor: pointer;
      display: flex;
      transition: color 0.25s ease-out;
    }

    .btn:only-child {
      margin-left: 1.5rem;
    }

    .btn:hover > span,
    [role="tree"].selected .btn:last-child > span  {
      color: var(--secondary-darker) !important;
    }

    .btn:hover > span.btn__icon,
    [role="tree"].selected .btn:last-child > .btn__icon {
      color: var(--secondary) !important;
    }

    .btn__icon {
      color: var(--primary);
      height: 1.5rem;
      transition: color 0.25s ease-out;
      width: 1.5rem;
    }

    .btn__icon + span {
      margin-left: 0.25rem;
    }
  </style>
`;
