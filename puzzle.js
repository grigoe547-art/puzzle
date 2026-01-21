const size = 3; // 3x3
const board = document.getElementById("board");
const msg = document.getElementById("msg");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");

// правилният ред: 0..8
let order = [...Array(size * size).keys()];

// да не пускаме сърца 100 пъти
let heartsShown = false;

function render() {
    board.innerHTML = "";
    msg.hidden = true;

    board.classList.remove("solved");

    order.forEach((pieceIndex, slotIndex) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.draggable = true;

        const row = Math.floor(pieceIndex / size);
        const col = pieceIndex % size;

        tile.style.backgroundPosition = `${(col * 100) / (size - 1)}% ${(row * 100) / (size - 1)}%`;
        tile.dataset.slotIndex = slotIndex;

        tile.addEventListener("dragstart", onDragStart);
        tile.addEventListener("dragend", onDragEnd);
        tile.addEventListener("dragover", (e) => e.preventDefault());
        tile.addEventListener("drop", onDrop);

        board.appendChild(tile);
    });

    if (isSolved()) {
        msg.hidden = false;
        board.classList.add("solved");

        // спира местенето след решаване
        [...board.children].forEach(t => (t.draggable = false));

        if (!heartsShown) {
            heartsShown = true;
            spawnHearts();
        }
    }
}

let fromIndex = null;

function onDragStart(e) {
    fromIndex = Number(e.target.dataset.slotIndex);
    e.target.classList.add("dragging");
}

function onDragEnd(e) {
    e.target.classList.remove("dragging");
}

function onDrop(e) {
    const toIndex = Number(e.target.dataset.slotIndex);
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;

    [order[fromIndex], order[toIndex]] = [order[toIndex], order[fromIndex]];
    fromIndex = null;

    render();
}

function isSolved() {
    return order.every((v, i) => v === i);
}

function shuffle() {
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
}

shuffleBtn.addEventListener("click", () => {
    heartsShown = false;
    shuffle();
    render();
});

resetBtn.addEventListener("click", () => {
    heartsShown = false;
    order = [...Array(size * size).keys()];
    render();
});

// ❤️ сърца ефект
function spawnHearts() {
    const icons = ["❤️", "💖", "💘", "💝", "✨"];
    const count = 28;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement("div");
        heart.textContent = icons[Math.floor(Math.random() * icons.length)];
        heart.style.position = "fixed";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "105vh";
        heart.style.fontSize = (16 + Math.random() * 22).toFixed(0) + "px";
        heart.style.zIndex = 9999;
        heart.style.pointerEvents = "none";
        heart.style.opacity = 0.95;

        const dur = 2.2 + Math.random() * 1.8;

        heart.animate(
            [
                { transform: "translateY(0) scale(1)", opacity: 1 },
                {
                    transform: `translateY(-120vh) translateX(${(Math.random() * 120 - 60).toFixed(0)}px) scale(1.6)`,
                    opacity: 0
                }
            ],
            { duration: dur * 1000, easing: "ease-in", fill: "forwards" }
        );

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), dur * 1000);
    }
}

// старт
shuffle();
render();
