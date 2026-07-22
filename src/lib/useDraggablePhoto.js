import { useEffect, useRef, useState } from 'react'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// Drag för att flytta hunden i scenen, tvåfingers-nyp för att skala den.
// Committar (onChange) bara när sista fingret lyfts, inte varje pointermove -
// annars skulle varje liten rörelse trigga en disk-skrivning via onFieldChange.
export function useDraggablePhoto({ x: initX = 0, y: initY = 0, scale: initScale = 1, onChange }) {
  const [pos, setPos] = useState({ x: initX, y: initY, scale: initScale })
  const pointers = useRef(new Map())
  const dragStart = useRef(null)
  const pinchStart = useRef(null)
  const posRef = useRef(pos)
  posRef.current = pos

  useEffect(() => {
    setPos({ x: initX, y: initY, scale: initScale })
  }, [initX, initY, initScale])

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, posX: posRef.current.x, posY: posRef.current.y }
      pinchStart.current = null
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      pinchStart.current = { dist, scale: posRef.current.scale }
      dragStart.current = null
    }
  }

  function handlePointerMove(e) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const nextScale = clamp((dist / pinchStart.current.dist) * pinchStart.current.scale, 0.5, 2.5)
      setPos((prev) => ({ ...prev, scale: nextScale }))
      return
    }

    const drag = dragStart.current
    if (pointers.current.size === 1 && drag) {
      const nextX = drag.posX + (e.clientX - drag.x)
      const nextY = drag.posY + (e.clientY - drag.y)
      setPos((prev) => ({ ...prev, x: nextX, y: nextY }))
    }
  }

  function handlePointerUp(e) {
    pointers.current.delete(e.pointerId)

    if (pointers.current.size === 1) {
      const [[, p]] = pointers.current
      dragStart.current = { x: p.x, y: p.y, posX: posRef.current.x, posY: posRef.current.y }
      pinchStart.current = null
    } else if (pointers.current.size === 0) {
      dragStart.current = null
      pinchStart.current = null
      onChange?.(posRef.current)
    }
  }

  return {
    ...pos,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    style: {
      transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
    },
  }
}
