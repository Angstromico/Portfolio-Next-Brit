'use client'

import React, { useState, useRef, useEffect } from 'react'
import { initialFileSystem, FileSystemItem } from './VirtualFileSystem'
import { useGamer } from '@/context/GamerContext'
import { X, Minus, Square } from 'lucide-react'
import { SpaceInvaders } from './SpaceInvaders'

type HistoryItem = {
  command: string
  output: string
}

export const Terminal = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [input, setInput] = useState('')
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [fileSystem, setFileSystem] =
    useState<FileSystemItem>(initialFileSystem)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toggleTerminal, toggleTerminalMinimize, toggleTerminalMaximize } =
    useGamer()

  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Intro message
    setHistory([
      { command: '', output: 'Welcome to MemzOS v1.0.0' },
      { command: '', output: 'Type "help" for a list of available commands.' },
      { command: '', output: '----------------------------------------' },
    ])
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const getCurrentDir = (): FileSystemItem => {
    let current = fileSystem
    for (const dir of currentPath) {
      if (current.children && current.children[dir]) {
        current = current.children[dir]
      }
    }
    return current
  }

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    setCommandHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    const parts = trimmedCmd.split(' ')
    const command = parts[0]
    const args = parts.slice(1)

    let output = ''

    switch (command) {
      case 'help':
        output =
          'Available commands: ls, cd, cat, clear, pwd, whoami, exit, help, play'
        break
      case 'play':
        setIsPlaying(true)
        setHistory((prev) => [
          ...prev,
          { command: trimmedCmd, output: 'Starting Space Invaders...' },
        ])
        setInput('')
        return
      case 'ls':
        const dir = getCurrentDir()
        if (dir.type === 'dir' && dir.children) {
          const files = Object.keys(dir.children)
            .map((name) => {
              const item = dir.children![name]
              return item.type === 'dir'
                ? `<span class="text-blue-400 font-bold">${name}/</span>`
                : name
            })
            .join('  ')
          output = files
        } else {
          output = 'Error: Not a directory'
        }
        break
      case 'cd':
        if (args.length === 0) {
          setCurrentPath([])
        } else if (args[0] === '..') {
          setCurrentPath((prev) => prev.slice(0, -1))
        } else {
          const target = args[0]
          const currentDir = getCurrentDir()
          if (
            currentDir.children &&
            currentDir.children[target] &&
            currentDir.children[target].type === 'dir'
          ) {
            setCurrentPath((prev) => [...prev, target])
          } else {
            output = `cd: no such file or directory: ${target}`
          }
        }
        break
      case 'cat':
        if (args.length === 0) {
          output = 'cat: missing filename'
        } else {
          const filename = args[0]
          const currentDir = getCurrentDir()
          if (
            currentDir.children &&
            currentDir.children[filename] &&
            currentDir.children[filename].type === 'file'
          ) {
            output = currentDir.children[filename].content || ''
          } else {
            output = `cat: ${filename}: No such file or directory`
          }
        }
        break
      case 'pwd':
        output = '/' + currentPath.join('/')
        break
      case 'clear':
        setHistory([])
        setInput('')
        return
      case 'whoami':
        output = 'guest'
        break
      case 'exit':
        toggleTerminal()
        return
      default:
        output = `command not found: ${command}`
    }

    setHistory((prev) => [...prev, { command: trimmedCmd, output }])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  return (
    <div className='flex flex-col h-full bg-black font-press-start text-xs md:text-sm text-green-500 p-2 shadow-2xl border-2 border-green-700/50 relative overflow-hidden'>
      {/* Title Bar */}
      <div className='flex items-center justify-between bg-green-900/20 px-2 py-1 mb-2 border-b border-green-800'>
        <span>root@memz-portfolio:~</span>
        <div className='flex gap-2'>
          <Minus
            size={14}
            className='hover:text-white cursor-pointer'
            onClick={toggleTerminalMinimize}
          />
          <Square
            size={12}
            className='hover:text-white cursor-pointer'
            onClick={toggleTerminalMaximize}
          />
          <X
            size={14}
            className='hover:text-red-500 cursor-pointer'
            onClick={toggleTerminal}
          />
        </div>
      </div>

      {isPlaying ? (
        <SpaceInvaders onExit={() => setIsPlaying(false)} />
      ) : (
        <div
          className='flex-1 overflow-y-auto p-2 scrollbar-hide'
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, i) => (
            <div key={i} className='mb-2'>
              {item.command && (
                <div className='flex gap-2'>
                  <span className='text-blue-400'>➜</span>
                  <span className='text-pink-400'>
                    ~{currentPath.length > 0 ? '/' + currentPath.join('/') : ''}
                  </span>
                  <span>{item.command}</span>
                </div>
              )}
              <div
                className='whitespace-pre-wrap ml-4 opacity-80'
                dangerouslySetInnerHTML={{ __html: item.output }}
              />
            </div>
          ))}

          <div className='flex gap-2'>
            <span className='text-blue-400'>➜</span>
            <span className='text-pink-400'>
              ~{currentPath.length > 0 ? '/' + currentPath.join('/') : ''}
            </span>
            <input
              ref={inputRef}
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className='flex-1 bg-transparent outline-none border-none text-green-500 font-inherit caret-green-500'
              autoFocus
              autoComplete='off'
            />
          </div>
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}

export default Terminal
