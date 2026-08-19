import { motion } from 'framer-motion';

// Utility to generate a layered neural network layout
function generateNetwork(cols, nodesPerCol, width, height) {
  const nodes = [];
  const connections = [];
  let id = 0;

  const colSpacing = width / (cols + 1);
  const nodesByCol = [];

  for (let c = 0; c < cols; c++) {
    const colNodes = [];
    const count = nodesPerCol[c] || 4;
    const rowSpacing = height / (count + 1);
    for (let r = 0; r < count; r++) {
      const node = {
        id: id++,
        x: colSpacing * (c + 1),
        y: rowSpacing * (r + 1),
        col: c,
      };
      nodes.push(node);
      colNodes.push(node);
    }
    nodesByCol.push(colNodes);
  }

  // Connect adjacent columns
  for (let c = 0; c < cols - 1; c++) {
    const fromCol = nodesByCol[c];
    const toCol = nodesByCol[c + 1];
    fromCol.forEach((from) => {
      toCol.forEach((to) => {
        connections.push({
          id: `${from.id}-${to.id}`,
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          fromId: from.id,
          toId: to.id,
        });
      });
    });
  }

  return { nodes, connections, nodesByCol };
}

export default function NeuralNetwork({
  cols = 3,
  nodesPerCol = [3, 4, 3],
  width = 300,
  height = 220,
  nodeStates = {}, // { [nodeId]: 'inactive' | 'active' | 'highlighted' | 'error' }
  connectionStates = {}, // { [connId]: { opacity, strokeWidth, color } }
  className = '',
}) {
  const { nodes, connections } = generateNetwork(cols, nodesPerCol, width, height);

  const getNodeColor = (nodeId) => {
    const state = nodeStates[nodeId] || 'inactive';
    if (state === 'active') return '#2563EB';
    if (state === 'highlighted') return '#10B981';
    if (state === 'error') return '#EF4444';
    return '#E5E7EB';
  };

  const getNodeStroke = (nodeId) => {
    const state = nodeStates[nodeId] || 'inactive';
    if (state === 'active') return '#1D4ED8';
    if (state === 'highlighted') return '#059669';
    if (state === 'error') return '#DC2626';
    return '#D1D5DB';
  };

  const getConnOpacity = (connId) => {
    return connectionStates[connId]?.opacity ?? 0.2;
  };

  const getConnStroke = (connId) => {
    return connectionStates[connId]?.color ?? '#9CA3AF';
  };

  const getConnWidth = (connId) => {
    return connectionStates[connId]?.strokeWidth ?? 1;
  };

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      {/* Connections */}
      {connections.map((conn) => (
        <motion.line
          key={conn.id}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke={getConnStroke(conn.id)}
          strokeWidth={getConnWidth(conn.id)}
          initial={false}
          animate={{
            opacity: getConnOpacity(conn.id),
            stroke: getConnStroke(conn.id),
            strokeWidth: getConnWidth(conn.id),
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={10}
          fill={getNodeColor(node.id)}
          stroke={getNodeStroke(node.id)}
          strokeWidth={1.5}
          initial={false}
          animate={{
            fill: getNodeColor(node.id),
            stroke: getNodeStroke(node.id),
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}
