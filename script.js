let concepts = [];

function addConcept() {
  const name = document.getElementById("conceptInput").value.trim();
  const notes = document.getElementById("conceptNotes").value.trim();

  if (!name) {
    alert("Please type an idea.");
    return;
  }

  const concept = {
    id: Date.now(),
    name,
    notes,
    x: 420 + Math.random() * 250,
    y: 180 + Math.random() * 250,
    main: false
  };

  concepts.push(concept);
  renderConcepts();

  document.getElementById("conceptInput").value = "";
  document.getElementById("conceptNotes").value = "";
}

function generateFramework() {
  const title = document.getElementById("researchTitle").value.trim();

  if (!title) {
    alert("Please type your research title first.");
    return;
  }

  concepts = [
    {
      id: Date.now(),
      name: title,
      notes: "Main research idea",
      x: 430,
      y: 300,
      main: true
    }
  ];

  renderConcepts();
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
      <p>${concept.notes || "Brainstorming note"}</p>
      <button onclick="deleteConcept(${concept.id})">Delete</button>
    `;

    makeDraggable(node, concept.id);
    mindmap.appendChild(node);
  });
}

function makeDraggable(element, id) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    const concept = concepts.find((item) => item.id === id);
    concept.x = e.clientX - offsetX;
    concept.y = e.clientY - offsetY;

    element.style.left = concept.x + "px";
    element.style.top = concept.y + "px";
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });
}

function deleteConcept(id) {
  concepts = concepts.filter((concept) => concept.id !== id);
  renderConcepts();
}

function saveProject() {
  const project = {
    title: document.getElementById("researchTitle").value,
    problem: document.getElementById("mainProblem").value,
    concepts
  };

  localStorage.setItem("simpleResearchMindmap", JSON.stringify(project));
  alert("Saved.");
}

function loadProject() {
  const saved = localStorage.getItem("simpleResearchMindmap");

  if (!saved) {
    alert("No saved mind map yet.");
    return;
  }

  const project = JSON.parse(saved);

  document.getElementById("researchTitle").value = project.title || "";
  document.getElementById("mainProblem").value = project.problem || "";
  concepts = project.concepts || [];

  renderConcepts();
}

function exportPNG() {
  html2canvas(document.getElementById("mindmap")).then((canvas) => {
    const link = document.createElement("a");
    link.download = "research-mindmap.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
