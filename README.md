[![Build Status](https://travis-ci.org/stefanfrede/monkey-tree.svg?branch=master)](https://travis-ci.org/stefanfrede/monkey-tree)

<h1>
  <img
    src="https://raw.githubusercontent.com/stefanfrede/monkey-tree/master/monkey.png"
    width="32"
    height="32"
    alt="monkey"
    align="center" />
  &lt;monkey-tree&gt;
</h1>

`<monkey-tree>` is a __Polymer 3__ element displaying a browsable tree of
selectable nodes (`<monkey-tree-item>`).

```html
<monkey-tree
  data="{
    name: 'foobar',
    children: [
      { name: 'foo', icon: 'public' },
      { name: 'bar' },
      { name: 'baz', children: [ { name: 'qux'] }
    ]"></monkey-tree>
```

![Screenshot of monkey-tree](https://raw.githubusercontent.com/stefanfrede/monkey-tree/master/screenshot.png)

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `npm start` to serve your element locally.

## Viewing Element

```
$ npm start
```

## Linting Element

```
$ npm run lint
```

## Running Tests

```
$ npm test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `npm test` to run your application's test suite locally.
