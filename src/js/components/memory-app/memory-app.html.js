/**
 * @file The HTML template for the my-memory-game web component.
 * @module my-memory-game.html
 * @author Mats Loock <mats.loock@lnu.se>
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
