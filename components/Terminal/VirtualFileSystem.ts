export type FileSystemItem = {
  type: 'file' | 'dir'
  content?: string
  children?: { [key: string]: FileSystemItem }
}

export const initialFileSystem: FileSystemItem = {
  type: 'dir',
  children: {
    'README.md': {
      type: 'file',
      content:
        '# Manuel Morales Portfolio\n\nWelcome to my interactive portfolio! Feel free to sniff around.\n\nType "help" for a list of commands.',
    },
    about: {
      type: 'dir',
      children: {
        'bio.txt': {
          type: 'file',
          content:
            'Full Stack Developer with a passion for AI and UX. Based in the digital realm.',
        },
        'skills.txt': {
          type: 'file',
          content:
            '- React\n- Next.js\n- Node.js\n- TypeScript\n- TailwindCSS\n- AI/LLM Integration',
        },
      },
    },
    projects: {
      type: 'dir',
      children: {
        'portfolio.json': {
          type: 'file',
          content:
            '{\n  "name": "My Website",\n  "stack": ["Next.js", "React", "Tailwind"]\n}',
        },
        'secret_project.txt': {
          type: 'file',
          content:
            'TOP SECRET. ACCESS DENIED. ... Just kidding. Use the Konami code to unlock more secrets!',
        },
      },
    },
    components: {
      type: 'dir',
      children: {
        'Button.tsx': {
          type: 'file',
          content: 'export const Button = () => <button>Click me</button>',
        },
        'Terminal.tsx': { type: 'file', content: '// You are here.' },
      },
    },
  },
}
