let bubbles = [];
let connections = [];
let selectedForConnection = [];
let isConnectMode = false;

const canvas = document.getElementById("canvas");
const lines = document.getElementById("lines");

canvas.addEventListener("dblclick", function (event) {
  const title = prompt("Type your idea:");

  if (!title) return;

  createBubble(title, "", event.offsetX, event.offsetY, false);
});

function addMainIdea() {
  const title = document.getElementById("mainIdea").value.trim();

  if (!title) {
    alert("Please type your main research idea first.");
    return;
  }

  createBubble(title, "Main research idea", 900, 500, true);
}

function addQuickIdea() {
  const title = document.getElementById("quickIdea").value.trim();
  const note = document.getElementById("quickNote").value.trim();

  if (!title) {
    alert("Please type a quick idea.");
    return;
  }

  createBubble(title, note, 650 + Math.random() * 400, 350 + Math.random() * 300, false);

  document.getElementById("quickIdea").value = "";
  document.getElementById("quickNote").value = "";
}

function createBubble(title, note, x, y, main) {
  const bubble = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title,
    note,
    x,
    y,
    main
  };

  bubbles.push(bubble);
  renderMap();
}

function renderMap() {
  canvas.innerHTML = "";

  bubbles.forEach((bubble) => {
    const div = document.createElement("div");
    div.className = bubble.main ? "bubble main" : "bubble";
    div.style.left = bubble.x + "px";
    div.style.top = bubble.y + "px";
    div.dataset.id = bubble.id;

    div.innerHTML = `
      <div class="bubble-title">${bubble.title}</div>
      <div class="bubble-note">${bubble.note || ""}</div>
      <button onclick="editBubble(${bubble.id})">Edit</button>
      <button onclick="deleteBubble(${bubble.id})">Delete</button>
    `;

    div.addEventListener("click", function (event) {
      event.stopPropagation();

      if (isConnectMode) {
        selectBubbleForConnection(bubble.id);
      }
    });

    makeDraggable(div, bubble.id);
    canvas.appendChild(div);
  });

  drawConnections();
}

function makeDraggable(element, id) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("mousedown", function (event) {
    if (event.target.tagName === "BUTTON") return;

    dragging = true;
    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;
  });

  document.addEventListener("mousemove", function (event) {
    if (!dragging) return;

    const bubble = bubbles.find((item) => item.id === id);
    if (!bubble) return;

    bubble.x = event.clientX - offsetX;
    bubble.y = event.clientY - offsetY;

    element.style.left = bubble.x + "px";
    element.style.top = bubble.y + "px";

    drawConnections();
  });

  document.addEventListener("mouseup", function () {
    dragging = false;
  });
}

function connectMode() {
  isConnectMode = !isConnectMode;
  selectedForConnection = [];

  alert(isConnectMode ? "Connect mode ON. Click two bubbles to connect them." : "Connect mode OFF.");
}

function selectBubbleForConnection(id) {
  selectedForConnection.push(id);

  const bubbleDiv = document.querySelector(`[data-id="${id}"]`);
  bubbleDiv.classList.add("selected");

  if (selectedForConnection.length === 2) {
    const from = selectedForConnection[0];
    const to = selectedForConnection[1];

    if (from !== to) {
      connections.push({ from, to });
    }

    selectedForConnection = [];
    document.querySelectorAll(".bubble").forEach((b) => b.classList.remove("selected"));
    drawConnections();
  }
}

function drawConnections() {
  lines.innerHTML = "";

  connections.forEach((connection) => {
    const from = bubbles.find((b) => b.id === connection.from);
    const to = bubbles.find((b) => b.id === connection.to);

    if (!from || !to) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", from.x + 110);
    line.setAttribute("y1", from.y + 40);
    line.setAttribute("x2", to.x + 110);
    line.setAttribute("y2", to.y + 40);
    line.setAttribute("stroke", "#9c8d78");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");

    lines.appendChild(line);
  });
}

function editBubble(id) {
  const bubble = bubbles.find((item) => item.id === id);
  if (!bubble) return;

  const newTitle = prompt("Edit idea:", bubble.title);
  if (newTitle === null) return;

  const newNote = prompt("Edit note:", bubble.note);

  bubble.title = newTitle.trim() || bubble.title;
  bubble.note = newNote === null ? bubble.note : newNote.trim();

  renderMap();
}

function deleteBubble(id) {
  bubbles = bubbles.filter((bubble) => bubble.id !== id);
  connections = connections.filter((connection) => connection.from !== id && connection.to !== id);
  renderMap();
}

function saveMap() {
  const data = {
    mainIdea: document.getElementById("mainIdea").value,
    bubbles,
    connections
  };

  localStorage.setItem("researchBrainstormMindMap", JSON.stringify(data));
  alert("Mind map saved.");
}

function loadMap() {
  const saved = localStorage.getItem("researchBrainstormMindMap");

  if (!saved) {
    alert("No saved mind map found.");
    return;
  }

  const data = JSON.parse(saved);

  document.getElementById("mainIdea").value = data.mainIdea || "";
  bubbles = data.bubbles || [];
  connections = data.connections || [];

  renderMap();
}

function clearMap() {
  if (!confirm("Clear the whole mind map?")) return;

  bubbles = [];
  connections = [];
  selectedForConnection = [];
  renderMap();
}

function exportPNG() {
  html2canvas(document.getElementById("canvasWrap")).then((canvasImage) => {
    const link = document.createElement("a");
    link.download = "research-brainstorm-mindmap.png";
    link.href = canvasImage.toDataURL();
    link.click();
  });
}
