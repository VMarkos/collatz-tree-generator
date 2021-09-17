function computeGraph(n) { // n is the total number of nodes.
    const visited = [];
    const frontier = [];
    const edges = [];
    let forksCount = 0;
    let maxNodeLabel = 1
    let currentNode = 1;
    let i = 1;
    while (i < n) {
        if (!visited.includes(currentNode)) {
            visited.push(currentNode);
            const newNodeA = 2 * currentNode;
            if (newNodeA > maxNodeLabel) {
                maxNodeLabel = newNodeA;
            }
            frontier.push(newNodeA);
            if (!visited.includes(newNodeA)) {
                edges.push({
                    "start": currentNode,
                    "end": newNodeA,
                    "isFork": false,
                });
                i++;
            }
            if ((currentNode - 1) % 3 === 0 && currentNode > 1) {
                const newNodeB = (currentNode - 1) / 3;
                frontier.push(newNodeB);
                if (!visited.includes(newNodeB) && i + 1 < n) {
                    edges.push({
                        "start": currentNode,
                        "end": newNodeB,
                        "isFork": true,
                    });
                    i++;
                }
                forksCount += 1;
            }
        }
        currentNode = frontier.shift();
    }
    const maxRowCount = Math.ceil(Math.log2(maxNodeLabel));
    return {
        "edges": edges,
        "forks": forksCount,
        "maxRowCount": maxRowCount,
        "maxNodeLabel": maxNodeLabel,
        "visited": visited,
    };
}