
# Ripple3js

![Ripple3JS](https://img.shields.io/badge/Ripple3JS-1.1.1-FFD700?style=for-the-badge&logo=three.js&logoColor=black)
![NPM](https://img.shields.io/badge/NPM-4C4C4C?style=for-the-badge&logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ECDB00?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-FFEB3B?style=for-the-badge&logo=open-source-initiative&logoColor=303030)




https://github.com/user-attachments/assets/39ac2098-896f-4086-a137-f2bf51a16f35







## Overview
Ripple3js is a JavaScript-based ripple effect library powered by [Three.js](https://threejs.org/). It allows you to easily integrate dynamic ripple effects into your webpage, adding an interactive visual effect that responds to mouse or touch movements.

## Features
- Dynamic ripple effect that follows mouse/touch movement.
- Customizable texture for the ripple.
- Supports mobile and desktop devices.
- Seamless integration with any webpage.

## Model Details
The effect is built using Three.js, utilizing shaders and custom WebGL rendering for real-time interactions.

## How It Works
1. **Scene & Camera Setup**: Creates a Three.js scene and orthographic camera for rendering.
2. **Ripple Effect**: Handles mouse or touch movement to generate ripples with a customizable texture.
3. **Shaders**: Custom vertex and fragment shaders are used to create the visual effect.
4. **Image Handling**: Textures of images on the page are manipulated to interact with the ripple effect.

## Usage
1. Install the module via npm:
   ```bash
   npm install ripple3js
   ```

2. Add the following script to your HTML:
   ```html
   <script type="module">
      import { Ripple3js } from './node_modules/ripple3js/index.js';

      // Initialize when the page loads
      window.addEventListener('load', () => {
          Ripple3js();
      });
   </script>
   ```

3. The ripple effect will automatically be applied to any page when the script is added.

## Deployment
- Install the `ripple3js` package via npm.
- Add the provided script to your HTML to enable the ripple effect.
- The effect will be initialized when the page loads.

## License
This project is licensed under the MIT License.
