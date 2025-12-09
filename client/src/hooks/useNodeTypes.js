import { useMemo } from 'react'
import StartNode from '../components/Nodes/StartNode'
import TaskNode from '../components/Nodes/TaskNode'
import ApprovalNode from '../components/Nodes/ApprovalNode'
import AutomatedNode from '../components/Nodes/AutomatedNode'
import EndNode from '../components/Nodes/EndNode'

export const useNodeTypes = () => {
  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      task: TaskNode,
      approval: ApprovalNode,
      automated: AutomatedNode,
      end: EndNode,
    }),
    []
  )

  return nodeTypes
}
