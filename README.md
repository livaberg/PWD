# Personal Web Desktop (PWD)

Personal Web Desktop (PWD) is a single-page application (SPA) 
designed as a browser-based desktop environment. It allows users to launch and manage multiple simultaneous applications in a movable window — similar to an operating system interface. The client is built with modern JavaScript and communicates with a WebSocket server for real-time functionality.

Example: [Demo - Personal Web Desktop](https://youtu.be/gNcMvPCyHC0)

The PWD includes three sub-applications:  
A memory game  
A real-time messaging app  
A custom sub-application: "Today in History"  

## 1. The PWD (Main Application)

The PWD application is the main application in which the smaller applications live. This part has a "desktop-like" feeling (#1) with a dock (#3) in which the sub-applications (#2) icons will be presented to the user. This application is constructed as a SPA application (#6).

A user is able to open multiple instances of the same sub-application and multiple different sub-applications at once (#5). 


## 2. The Memory sub-app

This sub-application is a simple [memory game](https://en.wikipedia.org/wiki/Concentration_(card_game)).

Several pairs of tiles are placed face-down in a grid in a memory game. The point of the game is to flip over tiles and match the pairs together. If the images on the facing tiles match, the matching tiles are removed. The tiles are flipped back face down if the images do not match. The object of the game is to find all pairs. The game is over when all the tiles are gone.

As an additional custom feature (#8) a confetti is shown upon completion of the game.


## 3. The Messages sub-app

This sub-application is a course-wide message chat using Web Sockets. This application is a regular message client like WhatsApp, Signal, FB Messenger, or iMessage.

As an additional custom feature (#10) the application is equipped with an easy-to-use emoji-picker to seamlessly send emojis in the chat.


## 4. The Custom sub-app: Today in History

This third application is an application that presents historical events for this day in previous years. It displays a link to read more on the event on Wikipedia. It is also possible to choose a custom or random date (#21).


## Additional Information

For more technical and implementation-specific details, please refer to the individual README files located in each sub-application’s directory.