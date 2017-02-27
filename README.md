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
`diplomacy.standard` provides the objects for the standard map and rule.

```typescript
import diplomacy from "js-diplomacy"

const variant = diplomacy.standard.variant
const rule = variant.rule // This defines the default rule of Diplomacy
let board = variant.initalBoard // This represents the state of 1901, Spring.
```

### 2. Create orders using a helper instance
This library contains a helper class for the standard rule, which provides the simple and readable way to write orders.

```typescript
const Helper = diplomacy.standardRule.StandardRuleHelper
const $ = diplomacy.variant.standardMap.location // This defines locations (e.g., StP_SC, Swe)

let $$ = new Helper(board) // Create a helper instance

const orders = [
  $$.F($.Lon).move($.Nth), $$.F($.Edi).move($.Nrg), $$.A($.Lvp).move($.Yor), // This is a Yor OP.
  $$.U($.Con).move($.Bul) // We have not to specify Fleet or Army if we use `U` function
]
```

### 3. Resolve orders, and go to the next turn
```typescript
const result = rule.resolve(orders) // Resolve the orders using the default rule

if (result.result) {
  console.log(result.result.results) // Show results
  board = result.result.board // Go to the next turn (1901 Autumn, Movement phase)
  $$ = new Helper(board) // Update the helper instance
}
```

## Example
The example of the standard Diplomacy game (with visualizers) is [available](https://karmami.github.io/vizdip/example).

## Documentation
The documentation is [here](https://karmami.github.io/js-diplomacy/docs/).

## LICENSE
This software is released under the MIT License, see [LICESE.md](LICENSE.md)
