let nodeWidth;
let arrowLength;

function drawGraph() {
    const n = document.getElementById("node-number").value;
    const graphObject = computeGraph(n);
    const svg = document.getElementById("svg-container");
    nodeWidth = Math.log10(graphObject["maxNodeLabel"]) * 16; // 8 is a custom constant!
    if (nodeWidth < nodeHeight) {
        nodeWidth = nodeHeight;
    }
    arrowLength = nodeWidth;
    const xStep = arrowLength + nodeWidth;
    const svgWidth = (xStep + 8) * graphObject["maxRowCount"];
    const svgHeight = (arrowLength + nodeHeight + 8) * graphObject["forks"];
    // const svgHeight = futureForksCheck(1, graphObject["maxNodeLabel"], ???, 0, graphObject["edges"]);
    let yStep = svgHeight / 1.41; // FIXME SVG size issues.
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
        // console.log(edge);
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
    // yStep /= 1.41;
    // console.log(currentNode);
    const maxRowCount = Math.ceil(Math.log2(maxNodeLabel));
    maxNodeLabel = currentNode * Math.pow(2, maxRowCount - layerCounter);
    // for (let i=layerCounter; i<maxRowCount; i++) {
    //     maxNodeLabel *= 2;
    // }
    // console.log(maxNodeLabel);
    currentNode = 4 * currentNode;
    // const frontier = [currentNode];
    // let maxForks = 0;
    let forksCount = 0;
    console.log(maxNodeLabel);
    while (currentNode < maxNodeLabel) {
        if ((currentNode - 1) % 3 !== 0) {
            currentNode = 2 * currentNode;
        } else if (deepEdgeSearch(edges, {"start": currentNode, "end": (currentNode - 1) / 3, "isFork": true})) {
            currentNode = (currentNode - 1) / 3;
            maxNodeLabel /= 2;
            forksCount += 1;
            console.log(currentNode);
            // const newMaxForks = maxConsecutiveForks(currentNode, edges);
            // if (newMaxForks > maxForks) {
            //     maxForks = newMaxForks;
            // }
            // currentNode = frontier.pop();
        } else {
            break;
        }
    }
    console.log("forks:");
    console.log(forksCount);
    let depth = 0;
    for (let i=0; i<forksCount; i++) {
        depth += yStep;
        yStep /= 1.41;
    }
    return depth;
}

function maxConsecutiveForks(node, edges) { // FIXME This does not suffice! You need to check for actual maximum depth --- i.e. apply recursively to next nodes or something like this.
    let maxForks = 0;
    while ((node - 1) % 3 === 0 && deepEdgeSearch(edges, {"start": node, "end": (node - 1) / 3, "isFork": true})) {
        node = (node - 1) / 3;
        maxForks++;
    }
    return maxForks;
}

function deepEdgeSearch(edges, edge) {
    for (const item of edges) {
        if (item["start"] === edge["start"] && item["end"] === edge["end"] && item["isFork"] === edge["isFork"]) {
            return true;
        }
    }
    return false;
}
