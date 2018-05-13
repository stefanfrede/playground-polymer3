import { html } from '@polymer/lit-element';

export const buttonReset = html`
  <style>
    button {
      background-color: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      font: inherit;
      padding: 0;
    }

    button::-moz-focus-inner {
      border: none;
    }
  </style>
`;
