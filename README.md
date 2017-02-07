js-diplomacy
===

JavaScript library for [Diplomacy](https://en.wikipedia.org/wiki/Diplomacy_(game))

## Description
This package provides functions to play Diplomacy games. It supports the default rule and map, and also can define custom variants of Diplomacy.

## Install
```bash
$ npm install js-diplomacy
```

## Usage
The following code snippets describe the basic usage of this library.

### 1. Get the vaiant, which defines a rule and an initial board
`diplomacy.variant.standard` provides the objects for the standard map and rule.

```javascript
const diplomacy = require('js-diplomacy')

const variant = diplomacy.variant.standard.variant
const rule = variant.rule // This defines the default rule of Diplomacy
let board = variant.initalBoard // This represents the state of 1901, Spring.
```

### 2. Create orders using a helper instance
This library contains a helper class for the standard rule, which provides the simple and readable way to write orders.

```javascript
const Helper = diplomacy.variant.standard.rule.StandardRuleHelper
const $ = diplomacy.variant.standard.map.location // This defines locations (e.g., StP_SC, Swe)

let $$ = new Helper(board) // Create a helper instance

const orders = [
  $$.F($.Lon).move($.Nth), $$.F($.Edi).move($.Nrg), $$.A($.Lvp).move($.Yor), // This is a Yor OP.
  $$.U($.Con).move($.Bul) // We have not to specify Fleet or Army if we use `U` function
]
```

### 3. Resolve orders, and go to the next turn
```javascript
const { result } = rule.resolve(orders) // Resolve the orders using the default rule
console.log(result.results) // Show results
board = result.board // Go to the next turn (1901 Autumn, Movement phase)
helper = new Helper(board) // Update the helper instance
```

## LICENSE
This software is released under the MIT License, see [LICESE.md](LICENSE.md)
