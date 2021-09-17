let nodeWidth;
let arrowLength;

const input = document.getElementById("node-number");

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        drawGraph();
        console.log("er");
    }
});

function drawGraph() {
    const n = input.value;
    const validationRE = /\d+/;
    if (!n.match(validationRE) || n < 3) {
        window.alert("Please enter a positive integer greater than 3.");
        return;
    }
    const graphObject = computeGraph(n);
    const svg = document.getElementById("svg-container");
    let g = document.getElementById("tree-container");
    svg.removeChild(g);
    g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "tree-container");
    svg.appendChild(g);
    nodeWidth = Math.log10(graphObject["maxNodeLabel"]) * 16; // 16 is a custom constant!
    if (nodeWidth < nodeHeight) {
        nodeWidth = nodeHeight;
    }
    arrowLength = nodeWidth;
    if (arrowLength < 50) {
        arrowLength = 50;
    }
    const xStep = arrowLength + nodeWidth;
    const svgWidth = (xStep + 8) * graphObject["maxRowCount"] + 32;
    const svgHeight = (arrowLength + nodeHeight + 8) * graphObject["forks"];
    let yStep = svgHeight * 1.41;
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight * 2);
    let currentX = 10;
    let currentY = 10;
    const nodePositions = {};
    addNodeAt(currentX, currentY, nodeWidth, 1);
    nodePositions["1"] = {
        x: 10,
        y: 10,
    };
    let layerCounter = 0;
    const edges = graphObject["edges"];
    for (const edge of edges) {
        const startX = nodePositions[edge["start"]]["x"];
        const startY = nodePositions[edge["start"]]["y"];
        currentX = startX + xStep;
        currentY = startY;
        if (Math.log2(edge["start"]) > layerCounter) {
            layerCounter++;
            if (layerCounter > 3) {
                yStep /= 1.41;
            }
        }
        if (edge["isFork"]) {
            const maxFutureDepth = futureForksCheck(edge["start"], graphObject["maxNodeLabel"], yStep ,layerCounter, edges);
            console.log(maxFutureDepth);
            console.log(yStep);
            if (maxFutureDepth > yStep) {
                currentY += maxFutureDepth;
            } else {
                currentY += yStep;
            }
        }
        addNodeAt(currentX, currentY, nodeWidth, edge["end"]);
        if (!edge["isFork"]) {
            drawArrow(startX + nodeWidth, startY + nodeHeight / 2, currentX - 16, currentY + nodeHeight / 2);
        } else {
            const dx = Math.cos(Math.atan(yStep / (arrowLength + nodeWidth /2)));
            const dy = Math.sin(Math.atan(yStep / (arrowLength + nodeWidth / 2)));
            drawArrow(startX + nodeWidth, startY + nodeHeight / 2, currentX + nodeWidth / 2 - 12 * dx, currentY - 18 * dy);
        }
        nodePositions[edge["end"]] = {
            x: currentX,
            y: currentY,
        }
    }
}

function futureForksCheck(currentNode, maxNodeLabel, yStep, layerCounter, edges) {
    yStep *= 2;
    const maxRowCount = Math.ceil(Math.log2(maxNodeLabel));
    maxNodeLabel = currentNode * Math.pow(2, maxRowCount - layerCounter);
    currentNode = 4 * currentNode;
    let depth = 0;
    console.log(maxNodeLabel);
    while (currentNode < maxNodeLabel) {
        if ((currentNode - 1) % 3 !== 0) {
            currentNode = 2 * currentNode;
            yStep /= 2;
        } else if (deepEdgeSearch(edges, {"start": currentNode, "end": (currentNode - 1) / 3, "isFork": true})) {
            currentNode = (currentNode - 1) / 3;
            maxNodeLabel /= 2;
            yStep /= 2;
            depth += yStep;
        } else {
            break;
        }
    }
    return depth;
}

function deepEdgeSearch(edges, edge) {
    for (const item of edges) {
        if (item["start"] === edge["start"] && item["end"] === edge["end"] && item["isFork"] === edge["isFork"]) {
            return true;
        }
    }
    return false;
}
