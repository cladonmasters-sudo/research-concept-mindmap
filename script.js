let concepts = [];

function addConcept() {
  const name = document.getElementById("conceptInput").value.trim();
  const type = document.getElementById("conceptType").value;
  const notes = document.getElementById("conceptNotes").value.trim();

  if (!name) {
    alert("Please type a concept name.");
    return;
  }

  const concept = {
    id: Date.now(),
    name,
    type,
    notes,
    x: 80 + concepts.length * 40,
    y: 80 + concepts.length * 40
  };

  concepts.push(concept);
  renderConcepts();

  document.getElementById("conceptInput").value = "";
  document.getElementById("conceptNotes").value = "";
}

function renderConcepts() {
  const mindmap = document.getElementById("mindmap");
  mindmap.innerHTML = "";

  concepts.forEach((concept) => {
    const node = document.createElement("div");
    node.className = `node ${concept.type}`;
    node.style.left = concept.x + "px";
    node.style.top = concept.y + "px";
    node.setAttribute("data-id", concept.id);

    node.innerHTML = `
      <h3>${concept.name}</h3>
      <p>${concept.notes || "No notes added yet."}</p>
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

function generateFramework() {
  concepts = [
    {
      id: 1,
      name: "Multi-Age ESL Classroom",
      type: "variable",
      notes: "Context of the study",
      x: 450,
      y: 70
    },
    {
      id: 2,
      name: "Learners with Diverse Abilities",
      type: "sped",
      notes: "SPED connection and learner needs",
      x: 450,
      y: 210
    },
    {
      id: 3,
      name: "Teaching Challenges",
      type: "question",
      notes: "Main focus of the research",
      x: 450,
      y: 350
    },
    {
      id: 4,
      name: "Teacher Strategies",
      type: "methodology",
      notes: "Inclusive and differentiated practices",
      x: 450,
      y: 490
    },
    {
      id: 5,
      name: "Improved Learner Support",
      type: "theory",
      notes: "Expected educational implication",
      x: 450,
      y: 630
    }
  ];

  renderConcepts();
}

function saveProject() {
  const project = {
    title: document.getElementById("researchTitle").value,
    problem: document.getElementById("mainProblem").value,
    concepts: concepts
  };

  localStorage.setItem("researchMindmapProject", JSON.stringify(project));
  alert("Project saved successfully.");
}

function loadProject() {
  const saved = localStorage.getItem("researchMindmapProject");

  if (!saved) {
    alert("No saved project found.");
    return;
  }

  const project = JSON.parse(saved);

  document.getElementById("researchTitle").value = project.title || "";
  document.getElementById("mainProblem").value = project.problem || "";
  concepts = project.concepts || [];

  renderConcepts();
  alert("Project loaded successfully.");
}

function exportPNG() {
  const mindmap = document.getElementById("mindmap");

  html2canvas(mindmap).then((canvas) => {
    const link = document.createElement("a");
    link.download = "research-concept-mindmap.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
