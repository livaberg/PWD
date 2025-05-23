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
  <div id="game-board">
  </div>
`
