const nodeHeight = 24;

function addNodeAt(x, y, w, id) {
    const svg = document.getElementById("tree-container");
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "node-" + id);
    const newNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    newNode.setAttribute("x", x);
    newNode.setAttribute("y", y);
    newNode.setAttribute("width", w);
    newNode.setAttribute("height", nodeHeight);
    newNode.style.stroke = "white";
    newNode.style.strokeWidth = "4";
    newNode.style.fill = "none";
    g.appendChild(newNode);
    const newLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newLabel.setAttribute("x", x + w / 2);
    newLabel.setAttribute("y", y + nodeHeight / 2);
    newLabel.setAttribute("text-anchor", "middle");
    newLabel.style.stroke = "white";
    newLabel.style.strokeWidth = "1px";
    newLabel.style.fill = "white";
    newLabel.setAttribute("dy", ".3em");
    newLabel.innerHTML = id;
    g.appendChild(newLabel);
    svg.appendChild(g);
}

function drawArrow(x_i, y_i, x_f, y_f) {
    const svg = document.getElementById("tree-container");
    const newArrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    newArrow.setAttribute("x1", x_i);
    newArrow.setAttribute("x2", x_f);
    newArrow.setAttribute("y1", y_i);
    newArrow.setAttribute("y2", y_f);
    newArrow.style.stroke = "white";
    newArrow.style.strokeWidth = "4px";
    newArrow.setAttribute("marker-end", "url(#pointer)");
    svg.appendChild(newArrow);
}