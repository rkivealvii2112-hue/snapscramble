document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const puzzleGrid = document.getElementById('puzzleGrid');
    const timerDisplay = document.getElementById('timerDisplay');
    const winOverlay = document.getElementById('winOverlay');
    const finalTime = document.getElementById('finalTime');
    const playAgainBtn = document.getElementById('playAgainBtn');

    // Grid Dimensions constraints
    const COLS = 4;
    const ROWS = 2;
    const TOTAL_PIECES = COLS * ROWS;

    let timerInterval;
    let secondsElapsed = 0;
    let draggedPiece = null;

    // Listen for image upload
    imageUpload.addEventListener('change', handleImageUpload);
    playAgainBtn.addEventListener('click', resetGame);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => processImage(img);
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function processImage(img) {
        puzzleGrid.innerHTML = ''; // Clear existing
        resetTimer();

        // CANVAS MATH:
        // We create an off-screen canvas to standardize the image dimensions.
        // We force a 2:1 aspect ratio to perfectly fit our 4x2 grid.
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Base resolution for our processing.
        canvas.width = 800; 
        canvas.height = 400;

        // Draw the uploaded image covering the entire 800x400 canvas (cropping edges if necessary)
        // using an object-fit: cover equivalent algorithm.
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / scale - img.width) / 2;
        const y = (canvas.height / scale - img.height) / 2;
        ctx.drawImage(img, x, y, img.width, img.height, 0, 0, canvas.width, canvas.height);

        // Slice the canvas
        const pieceWidth = canvas.width / COLS;
        const pieceHeight = canvas.height / ROWS;
        const pieces = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                // Extracting pixel data of the slice
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = pieceWidth;
                sliceCanvas.height = pieceHeight;
                const sliceCtx = sliceCanvas.getContext('2d');
                
                sliceCtx.drawImage(
                    canvas, 
                    c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, // Source coords
                    0, 0, pieceWidth, pieceHeight // Dest coords
                );

                pieces.push({
                    id: r * COLS + c, // Correct, original position (0 to 7)
                    dataUrl: sliceCanvas.toDataURL() // Image slice as Base64 string
                });
            }
        }

        initializeGame(pieces);
    }

    function initializeGame(pieces) {
        // SORTING LOGIC:
        // Use Fisher-Yates algorithm to randomly shuffle the puzzle pieces array.
        // We iterate backward, swapping the current element with a random element before it.
        let shuffledPieces = [...pieces];
        for (let i = shuffledPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]];
        }

        // Render shuffled pieces
        shuffledPieces.forEach((piece) => {
            const div = document.createElement('div');
            div.classList.add('puzzle-piece');
            div.style.backgroundImage = `url(${piece.dataUrl})`;
            div.dataset.id = piece.id; // Store original ID to check win state
            div.setAttribute('draggable', true);

            // Attach Drag & Drop Events
            div.addEventListener('dragstart', dragStart);
            div.addEventListener('dragover', dragOver);
            div.addEventListener('dragenter', dragEnter);
            div.addEventListener('dragleave', dragLeave);
            div.addEventListener('drop', dragDrop);
            div.addEventListener('dragend', dragEnd);

            puzzleGrid.appendChild(div);
        });

        startTimer();
    }

    // --- Drag and Drop Logic ---
    function dragStart() {
        draggedPiece = this;
        // setTimeout prevents the element from visually disappearing from cursor immediately
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function dragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
    }

    function dragEnter(e) {
        e.preventDefault();
        if (this !== draggedPiece) {
            this.classList.add('drag-over'); // Visual cue for the drop zone
        }
    }

    function dragLeave() {
        this.classList.remove('drag-over');
    }

    function dragDrop() {
        this.classList.remove('drag-over');
        
        // Swap logic: Rather than complex DOM node swapping, we swap the background 
        // images and data-ids between the source and target slots.
        if (this !== draggedPiece) {
            const tempBg = this.style.backgroundImage;
            const tempId = this.dataset.id;

            this.style.backgroundImage = draggedPiece.style.backgroundImage;
            this.dataset.id = draggedPiece.dataset.id;

            draggedPiece.style.backgroundImage = tempBg;
            draggedPiece.dataset.id = tempId;

            checkWinCondition();
        }
    }

    function dragEnd() {
        this.classList.remove('dragging');
        draggedPiece = null;
    }

    // --- Game State Logic ---
    function checkWinCondition() {
        const currentPieces = document.querySelectorAll('.puzzle-piece');
        let isWin = true;

        // Iterate through grid slots. If every slot's index matches the piece's data-id, they win.
        currentPieces.forEach((piece, index) => {
            if (parseInt(piece.dataset.id) !== index) {
                isWin = false;
            }
        });

        if (isWin) {
            clearInterval(timerInterval);
            triggerWin();
        }
    }

    function triggerWin() {
        const formattedTime = formatTime(secondsElapsed);
        finalTime.innerText = formattedTime;
        winOverlay.classList.remove('hidden');
        fireConfetti();
    }

    function resetGame() {
        winOverlay.classList.add('hidden');
        imageUpload.value = ''; // Clear file input
        puzzleGrid.innerHTML = ''; // Clear grid
        resetTimer();
    }

    // --- Timer Logic ---
    function startTimer() {
        resetTimer();
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.innerText = formatTime(secondsElapsed);
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        secondsElapsed = 0;
        timerDisplay.innerText = "00:00";
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    // --- Confetti VFX ---
    function fireConfetti() {
        const colors = ['#00ffcc', '#b026ff', '#ffffff'];
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.opacity = Math.random();
            
            document.body.appendChild(confetti);

            // Clean up DOM after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});