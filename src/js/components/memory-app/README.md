# &lt;memory-app&gt;

A custom web component that implements a classic memory matching game. The player flips tiles to find matching pairs within a grid of varying sizes.

## Attributes

### `boardsize`

The `boardsize` attribute specifies the size of the game board. Values are `large` (4x4), `medium` (4x2) or `small` (2x2).

Changing the attribute dynamically updates the game board.

## Events

| Event Name      | Fired When                        |
| --------------- | --------------------------------- |
| `memory-app:tiles-match`    | The tiles facing up match.        |
| `memory-app:tiles-mismatch` | The tiles facing up do not match. |
| `memory-app:game-over`      | The game is over.                 |

## Features

- Selectable board size with three different sizes.
- Tiles are shuffled and randomly assigned images at the start of each game.
- Flip interaction on tiles with matching logic.
- Attempts counter displayed during gameplay.
- Game-over notification with total number of attempts and a confetti animation.
- Responsive UI with a size selector before starting the game.

## Example

```html
<memory-app></memory-app>
```

## Dependencies

The component relies on:

   - **`flipping-tile`** custom element for rendering the individual tiles.  
   <flipping-tile>  

   - **Images** used as tile faces to be matched in pairs.  

   - **Canvas-confetti** for a congratulating animation upon game completion.  
   https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js  
      

