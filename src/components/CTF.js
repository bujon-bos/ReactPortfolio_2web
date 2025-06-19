import React, { useState, useRef, useEffect } from 'react';
import Style from "./about/Terminal.module.scss";
import classNames from "classnames";
import { Box } from "@mui/material";

const iconClass = "fa fa-circle";

// Virtual file system for the game
function createFS() {
    return {
        '/': {
            type: 'dir',
            children: {
                home: {
                    type: 'dir',
                    children: {
                        user: {
                            type: 'dir',
                            children: {
                                'readme.txt': {
                                    type: 'file',
                                    content: 'Welcome to the CTF! Try to find the real flag. Use `man` for help.'
                                },
                                'fake_flag.txt': {
                                    type: 'file',
                                    content: 'Nope! This is a fake flag. Keep looking!'
                                },
                                notes: {
                                    type: 'dir',
                                    children: {
                                        'hint.txt': {
                                            type: 'file',
                                            content: 'Try looking in /var/logs for something interesting.'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                etc: {
                    type: 'dir',
                    children: {
                        'passwd': {
                            type: 'file',
                            content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User,,,:/home/user:/bin/bash'
                        }
                    }
                },
                var: {
                    type: 'dir',
                    children: {
                        logs: {
                            type: 'dir',
                            children: {
                                'system.log': {
                                    type: 'file',
                                    content: 'System running smoothly. Nothing to see here.'
                                },
                                'flag.log': {
                                    type: 'file',
                                    content: 'Congrats! The real flag is: CTF{terminal_master_2024}'
                                }
                            }
                        }
                    }
                },
                tmp: {
                    type: 'dir',
                    children: {}
                }
            }
        }
    };
}

function getDir(pathArr, fs = createFS()['/']) {
    let curr = fs;
    for (let part of pathArr) {
        if (curr.children && curr.children[part]) {
            curr = curr.children[part];
        } else {
            return null;
        }
    }
    return curr;
}

function setDir(pathArr, fs, value) {
    if (pathArr.length === 0) return;
    let curr = fs;
    for (let i = 0; i < pathArr.length - 1; i++) {
        curr = curr.children[pathArr[i]];
    }
    curr.children[pathArr[pathArr.length - 1]] = value;
}

function removeDir(pathArr, fs) {
    if (pathArr.length === 0) return;
    let curr = fs;
    for (let i = 0; i < pathArr.length - 1; i++) {
        curr = curr.children[pathArr[i]];
    }
    delete curr.children[pathArr[pathArr.length - 1]];
}

const MAN_PAGES = {
    ls: "ls: List files and directories in the current directory.",
    cd: "cd <dir>: Change directory. Use '..' to go up, '/' for root.",
    cat: "cat <file>: Show file content.",
    pwd: "pwd: Print working directory.",
    clear: "clear: Clear the terminal.",
    help: "help: Show available commands.",
    echo: "echo <text>: Print text to the terminal.",
    whoami: "whoami: Show your username.",
    history: "history: Show command history.",
    touch: "touch <file>: Create an empty file.",
    mkdir: "mkdir <dir>: Create a new directory.",
    rm: "rm <file>: Remove a file.",
    rmdir: "rmdir <dir>: Remove an empty directory.",
    tree: "tree: Show directory tree.",
    man: "man <command>: Show help for a command.",
    date: "date: Show the current date and time."
};

function treePrint(dir, prefix = '') {
    let out = '';
    for (const [name, node] of Object.entries(dir.children)) {
        out += prefix + '|-- ' + name + (node.type === 'dir' ? '/' : '') + '\n';
        if (node.type === 'dir') {
            out += treePrint(node, prefix + '    ');
        }
    }
    return out;
}

export default function CTF() {
    const [fs, setFs] = useState(createFS());
    const [history, setHistory] = useState([
        { type: 'output', value: 'Welcome to Capture the Flag Terminal! Type "help" for commands.' }
    ]);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState(['home', 'user']);
    const [cmdHistory, setCmdHistory] = useState([]);
    const [cmdIndex, setCmdIndex] = useState(-1);
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current && inputRef.current.focus();
    }, [history]);

    const prompt = () => (
        <span>
            <span style={{ color: '#27C93F' }}>ctf@react</span>:
            <span style={{ color: '#8D53FF' }}>/{
                cwd.length ? cwd.join('/') : ''
            }</span>
            <span style={{ color: '#CA6BE6' }}>$</span>
        </span>
    );

    const handleCommand = (cmd) => {
        let trimmed = cmd.trim();
        if (!trimmed) return;
        let args = trimmed.split(' ');
        let command = args[0];
        let output = '';
        let currDir = getDir(cwd, fs['/']);

        switch (command) {
            case 'help':
                output = [
                    'Available commands:',
                    Object.keys(MAN_PAGES).join(', ')
                ].join('\n');
                break;
            case 'ls':
                if (currDir && currDir.children) {
                    output = Object.keys(currDir.children).join('  ') || '';
                } else {
                    output = 'No such directory';
                }
                break;
            case 'cd':
                if (args.length < 2) {
                    output = 'Usage: cd <directory>';
                } else if (args[1] === '..') {
                    if (cwd.length > 0) setCwd(cwd.slice(0, -1));
                } else if (args[1] === '/' || args[1] === '~') {
                    setCwd([]);
                } else {
                    let target = getDir([...cwd, args[1]], fs['/']);
                    if (target && target.type === 'dir') {
                        setCwd([...cwd, args[1]]);
                    } else {
                        output = `cd: no such file or directory: ${args[1]}`;
                    }
                }
                break;
            case 'cat':
                if (args.length < 2) {
                    output = 'Usage: cat <file>';
                } else {
                    let file = getDir([...cwd, args[1]], fs['/']);
                    if (file && file.type === 'file') {
                        output = file.content;
                    } else {
                        output = `cat: ${args[1]}: No such file`;
                    }
                }
                break;
            case 'pwd':
                output = '/' + cwd.join('/');
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'echo':
                output = args.slice(1).join(' ');
                break;
            case 'whoami':
                output = 'user';
                break;
            case 'history':
                output = cmdHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');
                break;
            case 'touch':
                if (args.length < 2) {
                    output = 'Usage: touch <file>';
                } else if (currDir.children[args[1]]) {
                    output = `touch: cannot create file '${args[1]}': File exists`;
                } else {
                    currDir.children[args[1]] = { type: 'file', content: '' };
                    setFs({ ...fs });
                }
                break;
            case 'mkdir':
                if (args.length < 2) {
                    output = 'Usage: mkdir <dir>';
                } else if (currDir.children[args[1]]) {
                    output = `mkdir: cannot create directory '${args[1]}': File exists`;
                } else {
                    currDir.children[args[1]] = { type: 'dir', children: {} };
                    setFs({ ...fs });
                }
                break;
            case 'rm':
                if (args.length < 2) {
                    output = 'Usage: rm <file>';
                } else if (!currDir.children[args[1]]) {
                    output = `rm: cannot remove '${args[1]}': No such file`;
                } else if (currDir.children[args[1]].type !== 'file') {
                    output = `rm: cannot remove '${args[1]}': Is a directory`;
                } else {
                    delete currDir.children[args[1]];
                    setFs({ ...fs });
                }
                break;
            case 'rmdir':
                if (args.length < 2) {
                    output = 'Usage: rmdir <dir>';
                } else if (!currDir.children[args[1]]) {
                    output = `rmdir: failed to remove '${args[1]}': No such directory`;
                } else if (currDir.children[args[1]].type !== 'dir') {
                    output = `rmdir: failed to remove '${args[1]}': Not a directory`;
                } else if (Object.keys(currDir.children[args[1]].children).length > 0) {
                    output = `rmdir: failed to remove '${args[1]}': Directory not empty`;
                } else {
                    delete currDir.children[args[1]];
                    setFs({ ...fs });
                }
                break;
            case 'tree':
                output = treePrint(currDir);
                break;
            case 'man':
                if (args.length < 2) {
                    output = 'Usage: man <command>';
                } else if (MAN_PAGES[args[1]]) {
                    output = MAN_PAGES[args[1]];
                } else {
                    output = `No manual entry for ${args[1]}`;
                }
                break;
            case 'date':
                output = new Date().toString();
                break;
            default:
                output = `Command not found: ${command}`;
        }
        setHistory(h => [
            ...h,
            { type: 'input', value: cmd, cwd: [...cwd] },
            { type: 'output', value: output }
        ]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        handleCommand(input);
        setCmdHistory([...cmdHistory, input]);
        setCmdIndex(-1);
        setInput('');
    };

    // Command history navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            if (cmdHistory.length === 0) return;
            const newIndex = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
            setCmdIndex(newIndex);
            setInput(cmdHistory[newIndex] || '');
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (cmdHistory.length === 0) return;
            if (cmdIndex === -1) return;
            const newIndex = cmdIndex + 1;
            if (newIndex >= cmdHistory.length) {
                setCmdIndex(-1);
                setInput('');
            } else {
                setCmdIndex(newIndex);
                setInput(cmdHistory[newIndex] || '');
            }
            e.preventDefault();
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="80vh"
            width="100vw"
            sx={{
                background: 'linear-gradient(135deg, #8D53FF22 0%, #CA6BE622 100%)',
            }}
        >
            <Box
                component={'section'}
                className={classNames(Style.terminal, Style.shadowed)}
                sx={{
                    width: { xs: '95vw', sm: '80vw', md: '50vw', lg: '40vw' },
                    maxWidth: 700,
                    borderRadius: '1rem',
                    mb: '2rem',
                    boxShadow: '0 8px 32px 0 #8D53FF44',
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(39,36,47,0.85)',
                    border: '1px solid #8D53FF33',
                    animation: 'fadeInTerminal 1s cubic-bezier(.68,-0.55,.27,1.55)'
                }}
            >
                <Box sx={{
                    backgroundColor: '#8c8c8c',
                    p: '0.5rem',
                    borderRadius: '1rem 1rem 0 0',
                    fontSize: '1rem',
                    display: 'flex',
                    gap: '0.5rem'
                }}>
                    <i className={classNames(iconClass, Style.red)} />
                    <i className={classNames(iconClass, Style.amber)} />
                    <i className={classNames(iconClass, Style.green)} />
                </Box>
                <Box
                    py={{ xs: '1rem', md: '2rem' }}
                    px={{ xs: '2rem', md: '3rem' }}
                    borderRadius={'0 0 1rem 1rem'}
                    sx={{
                        background: 'rgba(39,36,47,0.95)',
                        minHeight: '320px',
                        fontSize: '1.1rem',
                        fontFamily: 'Courier New, Courier, monospace',
                        color: '#fff',
                        overflowX: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        height: '400px',
                        maxHeight: '60vh',
                        overflowY: 'auto'
                    }}
                >
                    <div>
                        {history.map((item, idx) =>
                            item.type === 'input' ? (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                    {prompt()}&nbsp;{item.value}
                                </div>
                            ) : (
                                <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>{item.value}</div>
                            )
                        )}
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: 8,
                                width: '100%'
                            }}
                            autoComplete="off"
                        >
                            {prompt()}&nbsp;
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex: 1,
                                minWidth: 0,
                                position: 'relative'
                            }}>
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    style={{
                                        color: '#fff',
                                        background: 'none',
                                        fontFamily: 'inherit',
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        outline: 'none',
                                        width: '100%',
                                        minWidth: 40,
                                        flex: 1,
                                        padding: 0,
                                        margin: 0,
                                        caretColor: '#fff'
                                    }}
                                    autoFocus
                                    spellCheck={false}
                                />
                            </div>
                        </form>
                    </div>
                </Box>
                <style>
                    {`
                    @keyframes fadeInTerminal {
                        0% { opacity: 0; transform: translateY(30px) scale(0.97);}
                        100% { opacity: 1; transform: translateY(0) scale(1);}
                    }
                    @keyframes fadeInText {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    `}
                </style>
            </Box>
        </Box>
    );
}
