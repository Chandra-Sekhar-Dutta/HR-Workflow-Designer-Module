// Workflow serialization utility functions

export const workflowSerializer = {
  serialize: (nodes, edges) => {
    // Convert React Flow nodes and edges to clean JSON format
    const serializedNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
    }))

    const serializedEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'default',
    }))

    return {
      nodes: serializedNodes,
      edges: serializedEdges,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
      },
    }
  },

  deserialize: (workflowData) => {
    // Convert JSON format back to React Flow format
    const nodes = workflowData.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
    }))

    const edges = workflowData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'default',
    }))

    return { nodes, edges }
  },

  exportToJSON: (nodes, edges) => {
    const data = workflowSerializer.serialize(nodes, edges)
    return JSON.stringify(data, null, 2)
  },

  importFromJSON: (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      return workflowSerializer.deserialize(data)
    } catch (error) {
      console.error('Error parsing workflow JSON:', error)
      return null
    }
  },
}
