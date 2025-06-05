/**
 * @file The HTML template for the memory-app web component.
 * @module memory-app.html
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

import '../flipping-tile'

/*
 * Define the HTML template.
 */
export const htmlTemplate = document.createElement('template')
htmlTemplate.innerHTML = `
  <template id="tile-template">
    <flipping-tile>
      <img />
  </flipping-tile>
  </template>

  <div id="size-selector-wrapper">
  <div id="size-selector">
    <p>Choose number of tiles:</p>
    <button data-size="large">4 x 4</button>
    <button data-size="medium">4 x 2</button>
    <button data-size="small">2 x 2</button>
  </div>
  </div>

  <div id="game-board" hidden></div>
`
