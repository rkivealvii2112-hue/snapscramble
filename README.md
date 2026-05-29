# SnapScramble 🧩✨

**SnapScramble** is a dynamic, interactive drag-and-drop image puzzle game built entirely with Vanilla HTML, CSS, and JavaScript. 

I built this as a mini-project for a web design course. While most projects focused on static landing pages, I wanted to push my frontend logic and DOM manipulation skills under a tight deadline to create something genuinely playable. 

🔗 **[Play the Live Demo Here!](https://rkivealvii2112-hue.github.io/snapscramble/)** *(Note: Ensure GitHub Pages is active)*

---

### 🚀 Features

* **Dynamic Image Slicing:** Users can upload *any* image. The game processes it, forces a 2:1 aspect ratio, and dynamically slices it into a 4x2 playable grid.
* **Native Drag & Drop:** Smooth, snappy puzzle piece swapping using the browser's native Drag and Drop API.
* **Algorithmic Shuffling:** Implements the Fisher-Yates algorithm to ensure the board is completely randomized on every new upload.
* **Glassmorphism UI:** A sleek, modern user interface featuring frosted glass (`backdrop-filter: blur`), neon accents, and a built-in timer.
* **Rewarding Win-State:** Custom confetti visual effects trigger when the puzzle is successfully solved! 🎉

---

### 🛠️ Tech Stack

* **HTML5:** Utilizes the `<canvas>` API for off-screen image processing and cropping.
* **CSS3:** Flexbox/Grid layouts, CSS variables, and modern glassmorphism styling.
* **Vanilla JavaScript:** Core game logic, event listeners, array manipulation, and DOM rendering. No external libraries or frameworks were used.

---

### 🧠 How It Works (Under the Hood)

1. **Image Processing:** When an image is uploaded, it is drawn onto an off-screen HTML canvas to standardize the dimensions. 
2. **Slicing:** The canvas is mathematically divided into 8 equal pieces (4 columns, 2 rows). Each piece is extracted as a unique Data URL.
3. **Shuffling:** The pieces are stored in an array and shuffled using the Fisher-Yates algorithm before being injected into the DOM as draggable `<div>` elements.
4. **Validation:** On every drag-and-drop event, the script checks the current order of the DOM elements against the original array sequence to determine if the puzzle is solved.

---

### 💻 Run Locally

If you want to run this project on your local machine:

1. Clone the repository:
   ```bash
   git clone [https://github.com/rkivealvii2112-hue/snapscramble.git](https://github.com/rkivealvii2112-hue/snapscramble.git)
   git clone [https://github.com/rkivealvii2112-hue/snapscramble.git](https://github.com/rkivealvii2112-hue/snapscramble.git)

