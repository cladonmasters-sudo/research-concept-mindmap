let concepts = [];

function startMindMap() {
  const title = document.getElementById("researchTitle").value.trim();

  if (!title) {
    alert("Please type your research title or main idea first.");
    return;
  }

  concepts = [
    {
      id: Date.now(),
      name: title,
      notes: "Main idea",
      x: 430,
      y: 300,
      main: true
    }
  ];

  renderConcepts();
}

function addConcept() {
  const name = document.getElementById("conceptInput").value.trim();
  const notes = document.getElementById("conceptNotes").value.trim();

  if (!name) {
    alert("Please type a new idea.");
    return;
  }

  concepts.push({
    id: Date.now(),
    name: name,
    notes: notes || "Brainstorming note",
    x: 150 + Math.random() * 650,
    y: 120 + Math.random() * 430,
    main: false
  });

  renderConcepts();
  clearInputs();
}

function renderConcepts() {
  const mindmap = document.getElementById("mindmap");
  mindmap.innerHTML = "";

  concepts.forEach((concept) => {
    const node = document.createElement("div");
    node.className = concept.main ? "node main" : "node";
    node.style.left = concept.x + "px";
    node.style.top = concept.y + "px";

    node.innerHTML = `
      <h3>${concept.name}</h3>
      <p>${concept.notes}</p>
      <button onclick="deleteConcept(${concept.id})">Delete</button>
    `;

    makeDraggable(node, concept.id);
    mindmap.appendChild(node);
  });
}

function makeDraggable(element, id) {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  element.addEventListener("mousedown", function (e) {
    dragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener("mousemove", function (e) {
    if (!dragging) return;

    const concept = concepts.find((item) => item.id === id);
    if (!concept) return;

    concept.x = e.clientX - offsetX;
    concept.y = e.clientY - offsetY;

    element.style.left = concept.x + "px";
    element.style.top = concept.y + "px";
  });

  document.addEventListener("mouseup", function () {
    dragging = false;
  });
}

function deleteConcept(id) {
  concepts = concepts.filter((concept) => concept.id !== id);
  renderConcepts();
}

function clearInputs() {
  document.getElementById("conceptInput").value = "";
  document.getElementById("conceptNotes").value = "";
}

function saveProject() {
  const project = {
    title: document.getElementById("researchTitle").value,
    concepts: concepts
  };

  localStorage.setItem("researchMindMap", JSON.stringify(project));
  alert("Mind map saved.");
}

function loadProject() {
  const saved = localStorage.getItem("researchMindMap");

  if (!saved) {
    alert("No saved mind map found.");
    return;
  }

  const project = JSON.parse(saved);

  document.getElementById("researchTitle").value = project.title || "";
  concepts = project.concepts || [];

  renderConcepts();
}

function exportPNG() {
  const mindmap = document.getElementById("mindmap");

  html2canvas(mindmap).then((canvas) => {
    const link = document.createElement("a");
    link.download = "research-mindmap.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
