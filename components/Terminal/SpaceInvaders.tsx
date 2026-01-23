'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Crosshair } from 'lucide-react'

interface SpaceInvadersProps {
  onExit: () => void
}

export const SpaceInvaders = ({ onExit }: SpaceInvadersProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<'playing' | 'gameover' | 'win'>(
    'playing',
  )
  const [score, setScore] = useState(0)
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)

  // Initialize Audio
  useEffect(() => {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )()
    setAudioCtx(ctx)
    return () => {
      ctx.close()
    }
  }, [])

  const playLaser = () => {
    if (!audioCtx) return
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(880, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.1)
  }

  const playExplosion = () => {
    if (!audioCtx) return
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.2)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resizing
    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Game constants
    const PLAYER_WIDTH = 30
    const PLAYER_HEIGHT = 20
    const BULLET_SPEED = 7
    let enemySpeed = 1
    const ENEMY_ROWS = 4
    const ENEMY_COLS = 8

    // Game state
    let playerX = canvas.width / 2 - PLAYER_WIDTH / 2
    let bullets: { x: number; y: number }[] = []
    let enemies: {
      x: number
      y: number
      width: number
      height: number
      alive: boolean
      type: number
    }[] = []
    let rightPressed = false
    let leftPressed = false
    let spacePressed = false
    let animationId: number

    let enemyDirection = 1 // 1 right, -1 left
    let enemyStepDown = false

    // Initialize enemies
    const enemyWidth = 24
    const enemyHeight = 16
    const padding = 15
    const startX = (canvas.width - ENEMY_COLS * (enemyWidth + padding)) / 2

    for (let c = 0; c < ENEMY_COLS; c++) {
      for (let r = 0; r < ENEMY_ROWS; r++) {
        enemies.push({
          x: startX + c * (enemyWidth + padding),
          y: 30 + r * (enemyHeight + padding),
          width: enemyWidth,
          height: enemyHeight,
          alive: true,
          type: r % 2, // 0 or 1 for sprite variant
        })
      }
    }

    // Sprites (Procedurally drawn functions)
    const drawAlien = (
      x: number,
      y: number,
      w: number,
      h: number,
      type: number,
    ) => {
      ctx.fillStyle = '#ff0000'
      if (type === 0) {
        // Squid like
        ctx.fillRect(x + 4, y, w - 8, h)
        ctx.fillRect(x, y + 4, w, h - 8)
        ctx.clearRect(x + 6, y + 4, 4, 4) // Eyes
      } else {
        // Crab like
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4)
        ctx.fillRect(x, y + 4, 4, 4)
        ctx.fillRect(x + w - 4, y + 4, 4, 4)
        ctx.clearRect(x + 6, y + 4, 4, 4) // Eyes
      }
    }

    const drawPlayer = (x: number, y: number) => {
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(x + 10, y, 10, 4)
      ctx.fillRect(x + 2, y + 4, 26, 8)
      ctx.fillRect(x, y + 12, 30, 8)
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true
      if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (!spacePressed) {
          bullets.push({
            x: playerX + PLAYER_WIDTH / 2,
            y: canvas.height - PLAYER_HEIGHT,
          })
          spacePressed = true
          playLaser()
        }
      }
      if (e.key === 'Escape' || e.key === 'x') {
        onExit()
      }
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false
      if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false
      if (e.key === ' ' || e.key === 'Spacebar') spacePressed = false
    }

    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)

    // Touch controls simulation hooks
    // We attach these to global window for simplicity in this component scope,
    // but in reality we'd use state passed from React buttons.
    // Instead of messing with window events for touch, let's use a Mutable ref object accessible by react components.

    // ... Actually, better to just expose functions to call from the UI buttons later.
    // But since the loop is inside useEffect, we need a way to communicate.
    // We can use a ref to store input state.

    const inputRef = { right: false, left: false }

    // Attach to window for the "fake" touch buttons to work if we defined them outside
    // But we will define React buttons that update the `inputRef`.

    // Game Loop
    const draw = () => {
      if (gameState !== 'playing') return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Player
      drawPlayer(playerX, canvas.height - PLAYER_HEIGHT)

      // Input handling (Keyboard OR Touch)
      if (
        (rightPressed || inputRef.right) &&
        playerX < canvas.width - PLAYER_WIDTH
      )
        playerX += 5
      if ((leftPressed || inputRef.left) && playerX > 0) playerX -= 5

      // Bullets
      bullets.forEach((b, index) => {
        b.y -= BULLET_SPEED
        ctx.fillStyle = '#fff'
        ctx.fillRect(b.x - 2, b.y, 4, 10)
        if (b.y < 0) bullets.splice(index, 1)
      })

      // Enemy Logic
      let hitEdge = false
      let activeEnemies = 0
      let lowestEnemyY = 0

      enemies.forEach((enemy) => {
        if (enemy.alive) {
          activeEnemies++
          drawAlien(enemy.x, enemy.y, enemy.width, enemy.height, enemy.type)

          enemy.x += enemySpeed * enemyDirection

          if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            hitEdge = true
          }

          lowestEnemyY = Math.max(lowestEnemyY, enemy.y + enemy.height)

          // Collision
          bullets.forEach((b, bIndex) => {
            if (
              b.x > enemy.x &&
              b.x < enemy.x + enemy.width &&
              b.y > enemy.y &&
              b.y < enemy.y + enemy.height
            ) {
              enemy.alive = false
              bullets.splice(bIndex, 1)
              setScore((prev) => prev + 10)
              playExplosion()
            }
          })
        }
      })

      if (hitEdge) {
        enemyDirection *= -1
        enemies.forEach((e) => (e.y += 10))
      }

      if (activeEnemies === 0) {
        setGameState('win')
        cancelAnimationFrame(animationId)
        return
      }

      if (lowestEnemyY > canvas.height - PLAYER_HEIGHT) {
        setGameState('gameover')
        cancelAnimationFrame(animationId)
        return
      }

      animationId = requestAnimationFrame(draw)
    }

    // Expose input controls to component scope
    ;(window as any).setGameInput = (key: 'left' | 'right', val: boolean) => {
      if (key === 'left') leftPressed = val // inputRef.left = val
      if (key === 'right') rightPressed = val // inputRef.right = val
    }
    ;(window as any).fireGameLaser = () => {
      bullets.push({
        x: playerX + PLAYER_WIDTH / 2,
        y: canvas.height - PLAYER_HEIGHT,
      })
      playLaser()
    }

    draw()

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
      window.removeEventListener('keyup', keyUpHandler)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
      delete (window as any).setGameInput
      delete (window as any).fireGameLaser
    }
  }, []) // Remove dependencies to ensure only one loop starts

  // Touch Handlers
  const handleTouchStart = (dir: 'left' | 'right') =>
    (window as any).setGameInput?.(dir, true)
  const handleTouchEnd = (dir: 'left' | 'right') =>
    (window as any).setGameInput?.(dir, false)
  const handleFire = () => (window as any).fireGameLaser?.()

  return (
    <div
      ref={containerRef}
      className='relative w-full h-full bg-black flex flex-col items-center justify-center font-press-start overflow-hidden'
    >
      <div className='absolute top-4 left-4 text-green-500 z-10'>
        SCORE: {score}
      </div>
      <div className='absolute top-4 right-4 text-gray-500 text-xs hidden md:block z-10'>
        ESC or X to Exit
      </div>

      {gameState === 'playing' && <canvas ref={canvasRef} className='block' />}

      {/* Mobile Controls */}
      {gameState === 'playing' && (
        <div className='absolute bottom-8 w-full px-8 flex justify-between md:hidden z-20'>
          <div className='flex gap-4'>
            <Button
              variant='outline'
              className='h-16 w-16 rounded-full bg-white/10 border-white/20 active:bg-white/30'
              onTouchStart={() => handleTouchStart('left')}
              onTouchEnd={() => handleTouchEnd('left')}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
            >
              <ArrowLeft className='text-white' />
            </Button>
            <Button
              variant='outline'
              className='h-16 w-16 rounded-full bg-white/10 border-white/20 active:bg-white/30'
              onTouchStart={() => handleTouchStart('right')}
              onTouchEnd={() => handleTouchEnd('right')}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
            >
              <ArrowRight className='text-white' />
            </Button>
          </div>
          <Button
            variant='destructive'
            className='h-16 w-16 rounded-full bg-red-500/50 border-red-500/50 active:bg-red-500'
            onTouchStart={handleFire}
            onClick={handleFire}
          >
            <Crosshair className='text-white' />
          </Button>
        </div>
      )}

      {gameState !== 'playing' && (
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30'>
          <h2
            className={`text-4xl mb-8 ${gameState === 'win' ? 'text-green-500' : 'text-red-500'} animate-bounce`}
          >
            {gameState === 'win' ? 'MISSION ACCOMPLISHED' : 'GAME OVER'}
          </h2>
          <div className='text-white mb-8'>FINAL SCORE: {score}</div>
          <Button
            variant='outline'
            onClick={onExit}
            className='border-green-500 text-green-500 hover:bg-green-500 hover:text-black py-6 px-12 text-xl'
          >
            RETURN TO TERMINAL
          </Button>
        </div>
      )}
    </div>
  )
}
