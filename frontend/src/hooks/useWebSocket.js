import { useEffect, useState } from 'react'
import { getSocket } from '../api/socket'

export const useWebSocket = (projectId) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = getSocket()
    setSocket(ws)

    ws.on('connect', () => {
      setConnected(true)
      if (projectId) {
        ws.emit('join-project', projectId)
      }
    })

    ws.on('disconnect', () => {
      setConnected(false)
    })

    return () => {
      if (projectId) {
        ws.emit('leave-project', projectId)
      }
    }
  }, [projectId])

  return { socket, connected }
}