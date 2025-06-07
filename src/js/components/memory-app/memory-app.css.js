/**
 * @file The CSS template for the memory-app web component.
 * @module memory-app.css
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

import '../flipping-tile'

/*
 * Get image URLs.
 */
const NUMBER_OF_IMAGES = 9

const imgUrls = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  imgUrls[i] = new URL(`./images/${i}.png`, import.meta.url).href
}

export const IMG_URLS = Object.freeze(imgUrls)

/*
 * Define the CSS template.
 */
export const cssTemplate = document.createElement('template')
cssTemplate.innerHTML = `
  <style>
    :host {
      --tile-size: 108px;
    }
    #game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
    }
    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }
    flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff,rgb(238, 153, 228));
    }
  
    #size-selector-wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      pointer-events: none;
    }

    #size-selector {
      background: #fff;
      border: 1px solid #ddd;
      padding: 24px 28px;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      gap: 16px;
      pointer-events: auto;
      width: 250px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      user-select: none;
      margin: 0 auto;
    }

    #size-selector p {
      font-size: 1.1rem;
      font-weight: 600;
      color: #222;
      margin: 0 0 8px 0;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    #size-selector button {
      cursor: pointer;
      padding: 12px 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #444;
      border: 1.5px solid #bbb;
      background-color: #fafafa;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      transition: background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      user-select: none;
      width: 70%;
      margin: 0 auto;
    }

    #size-selector button:hover {
      background-color: #e1f0ff;
      border-color: #0078d7;
      box-shadow: 0 4px 14px rgba(0, 120, 215, 0.4);
      color: #005a9e;
    }

    #size-selector button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 120, 215, 0.6);
    }

    #attempt-counter {
      font-weight: 600;
      font-size: 1.1rem;
      text-align: center;
      display: inline-block;
      color: #333;
      float: left;
      padding-left: 30px;
    }

    #result-alert {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(230, 230, 230, 0.9);
      color: black;
      padding: 1.5rem 2rem;
      border-radius: 0.5rem;
      z-index: 1000;
      display: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 80vw;
      text-align: center;
      font-size: 1.2rem;
    }

    #result-alert.visible {
      display: block;
      animation: fadeInOut 5s ease forwards;
    }

    @keyframes fadeInOut {
      0%   { opacity: 0; transform: translateY(-10px); }
      10%  { opacity: 1; transform: translateY(0); }
      90%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
  </style>
`
