/**
 * @file The HTML template for the memory-app web component.
 * @module memory-app.html
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

import '../my-flipping-tile-extra'

/*
 * Define the HTML template.
 */
export const htmlTemplate = document.createElement('template')
htmlTemplate.innerHTML = `
  <template id="tile-template">
    <my-flipping-tile-extra>
      <img />
    </my-flipping-tile-extra>
  </template>
  <div id="game-board">
  </div>
`
