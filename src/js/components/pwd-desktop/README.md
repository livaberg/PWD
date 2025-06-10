# &lt;pwd-desktop&gt;

A custom web component that represents a full web desktop UI. It includes a taskbar with a start button and a real-time clock, a dock with app icons, and a desktop area where app windows can be opened and managed.


## Attributes

None


## Features

- Taskbar with a start button and live updating clock showing date and time in Swedish locale.  
- Dock with clickable app icons that open draggable app windows (`<app-window>`) for Memory, Messages, and Today in History apps.  
- Desktop area supporting multiple open app windows with cascading positioning to avoid exact overlap.  
- Windows dynamically receive increasing z-index to stay on top when clicked.  
- Encapsulated UI and styling using Shadow DOM.  


## Events

None


## Example

```html
<pwd-desktop></pwd-desktop>
```


## Dependencies

The component relies on:  

  - The **`<app-window>`** component for window frames.  

  - The app components **`<memory-app>`**, **`<message-app>`**, and **`<history-app>`** launched inside windows.  

  - External CSS styles imported from `/css/styles.css`.  