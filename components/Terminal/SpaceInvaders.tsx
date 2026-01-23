'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ArrowRight,
  Crosshair,
  RefreshCcw,
  Megaphone,
  VolumeX,
} from 'lucide-react'

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
  const [gameKey, setGameKey] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundEnabledRef = useRef(soundEnabled)

  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  // Initialize Audio
  useEffect(() => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      const ctx = new AudioContextClass()
      setAudioCtx(ctx)
      return () => {
        ctx.close()
      }
    }
  }, [])

  // Helper to resume audio context if suspended (browser autoplay policy)
  const ensureAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
  }

  const playLaser = () => {
    if (!audioCtx || !soundEnabledRef.current) return
    if (audioCtx.state === 'suspended') audioCtx.resume()

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
    if (!audioCtx || !soundEnabledRef.current) return
    if (audioCtx.state === 'suspended') audioCtx.resume()

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

    // Dynamic Scaling Factors
    // Base width reference: 800px. Scale up or down from there.
    // Clamp scale to not be too tiny on mobile (min 0.5) or too huge on massive screens (max 2.0)
    const getScale = () => {
      const ratio = canvas.width / 800
      return Math.min(Math.max(ratio, 0.5), 2.5) // Allow scaling up to 2.5x for big screens
    }

    // Initial Constants calculated immediately
    let scale = getScale()
    let PLAYER_WIDTH = 40 * scale
    let PLAYER_HEIGHT = 20 * scale
    const BULLET_SPEED = canvas.height / 60 // Relative speed
    let enemySpeed = canvas.width / 600

    const ENEMY_ROWS = 4
    // Determine columns based on available width to fit them properly
    const ENEMY_COLS = Math.floor(canvas.width / (60 * scale))
    const enemyWidth = 30 * scale
    const enemyHeight = 20 * scale
    const padding = 20 * scale

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
    let enemyDirection = 1

    const startX = (canvas.width - ENEMY_COLS * (enemyWidth + padding)) / 2

    for (let c = 0; c < ENEMY_COLS; c++) {
      for (let r = 0; r < ENEMY_ROWS; r++) {
        enemies.push({
          x: startX + c * (enemyWidth + padding),
          y: 40 * scale + r * (enemyHeight + padding),
          width: enemyWidth,
          height: enemyHeight,
          alive: true,
          type: r % 2,
        })
      }
    }

    // Sprites
    const drawAlien = (
      x: number,
      y: number,
      w: number,
      h: number,
      type: number,
    ) => {
      ctx.fillStyle = '#ff0000'
      if (type === 0) {
        ctx.fillRect(x + w * 0.2, y, w * 0.6, h)
        ctx.fillRect(x, y + h * 0.2, w, h * 0.6)
        ctx.clearRect(x + w * 0.3, y + h * 0.3, w * 0.15, h * 0.2)
        ctx.clearRect(x + w * 0.55, y + h * 0.3, w * 0.15, h * 0.2)
      } else {
        ctx.fillRect(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.8)
        ctx.fillRect(x, y + h * 0.2, w * 0.2, h * 0.2)
        ctx.fillRect(x + w * 0.8, y + h * 0.2, w * 0.2, h * 0.2)
        ctx.clearRect(x + w * 0.3, y + h * 0.3, w * 0.15, h * 0.2)
        ctx.clearRect(x + w * 0.55, y + h * 0.3, w * 0.15, h * 0.2)
      }
    }

    const drawPlayer = (x: number, y: number) => {
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(
        x + PLAYER_WIDTH * 0.4,
        y,
        PLAYER_WIDTH * 0.2,
        PLAYER_HEIGHT * 0.2,
      )
      ctx.fillRect(
        x + PLAYER_WIDTH * 0.1,
        y + PLAYER_HEIGHT * 0.2,
        PLAYER_WIDTH * 0.8,
        PLAYER_HEIGHT * 0.4,
      )
      ctx.fillRect(
        x,
        y + PLAYER_HEIGHT * 0.6,
        PLAYER_WIDTH,
        PLAYER_HEIGHT * 0.4,
      )
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      // Resume audio on interaction
      if (audioCtx?.state === 'suspended') {
        audioCtx.resume()
      }

      if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'D'
      )
        rightPressed = true
      if (
        e.key === 'Left' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'A'
      )
        leftPressed = true
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
      if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'D'
      )
        rightPressed = false
      if (
        e.key === 'Left' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'A'
      )
        leftPressed = false
      if (e.key === ' ' || e.key === 'Spacebar') spacePressed = false
    }

    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)

    const inputRef = { right: false, left: false }

    const draw = () => {
      if (gameState !== 'playing') return

      // Recalculate scale if resized (simplistic approach: just update vars, positions might drift but keeps it playable)
      // For a perfect resize, we'd need to re-map positions relative to new width.
      // For now, let's just stick to the initial calculated scale for the session or re-init on resize?
      // Re-init on resize would reset game. Let's just update the drawing variables and boundaries.

      // Actually, responding to resize continuously is complex for game state.
      // Let's rely on the initial layout OR update canvas size and keep logic relative.
      // Canvas is cleared every frame.

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Player
      drawPlayer(playerX, canvas.height - PLAYER_HEIGHT)

      if (
        (rightPressed || inputRef.right) &&
        playerX < canvas.width - PLAYER_WIDTH
      )
        playerX += 5 * scale
      if ((leftPressed || inputRef.left) && playerX > 0) playerX -= 5 * scale

      // Bullets
      bullets.forEach((b, index) => {
        b.y -= BULLET_SPEED
        ctx.fillStyle = '#fff'
        ctx.fillRect(b.x - 2 * scale, b.y, 4 * scale, 10 * scale)
        if (b.y < 0) bullets.splice(index, 1)
      })

      // Enemies
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
        enemies.forEach((e) => (e.y += 10 * scale))
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

    ;(window as any).setGameInput = (key: 'left' | 'right', val: boolean) => {
      ensureAudio()
      if (key === 'left') leftPressed = val
      if (key === 'right') rightPressed = val
    }
    ;(window as any).fireGameLaser = () => {
      ensureAudio()
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
  }, [gameKey])

  const handleTouchStart = (dir: 'left' | 'right') =>
    (window as any).setGameInput?.(dir, true)
  const handleTouchEnd = (dir: 'left' | 'right') =>
    (window as any).setGameInput?.(dir, false)
  const handleFire = () => (window as any).fireGameLaser?.()

  const handleRestart = () => {
    setScore(0)
    setGameState('playing')
    setGameKey((prev) => prev + 1)
    ensureAudio()
  }

  const toggleSound = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    ensureAudio()
    setSoundEnabled((prev) => !prev)
  }

  return (
    <div
      ref={containerRef}
      className='relative w-full h-full bg-black flex flex-col items-center justify-center font-press-start overflow-hidden'
    >
      <div className='absolute top-4 left-4 text-green-500 z-10 text-xs md:text-base'>
        SCORE: {score}
      </div>

      <div className='absolute top-4 right-4 z-10 flex items-center gap-4'>
        <Button
          size='icon'
          variant={soundEnabled ? 'default' : 'destructive'}
          className={`h-8 w-8 rounded-full ${soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          tabIndex={-1}
        >
          {soundEnabled ? (
            <Megaphone className='h-4 w-4 text-white' />
          ) : (
            <VolumeX className='h-4 w-4 text-white' />
          )}
        </Button>
        <div className='text-gray-500 text-xs hidden md:block'>ESC to Exit</div>
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
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 gap-4'>
          <h2
            className={`text-2xl md:text-4xl mb-4 ${gameState === 'win' ? 'text-green-500' : 'text-red-500'} animate-bounce text-center`}
          >
            {gameState === 'win' ? 'MISSION COMPLETE' : 'GAME OVER'}
          </h2>
          <div className='text-white mb-4 text-xl'>SCORE: {score}</div>

          <div className='flex flex-col gap-4'>
            <Button
              onClick={handleRestart}
              className='bg-blue-600 hover:bg-blue-700 text-white py-4 md:py-6 px-8 md:px-12 text-lg md:text-xl gap-2'
            >
              <RefreshCcw size={20} /> PLAY AGAIN
            </Button>
            <Button
              variant='outline'
              onClick={onExit}
              className='border-green-500 text-green-500 hover:bg-green-500 hover:text-black py-4 md:py-6 px-8 md:px-12 text-lg md:text-xl'
            >
              RETURN TO TERMINAL
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
