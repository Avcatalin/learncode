// ==== todo-vibe/frontend (Next.js + TailwindCSS) ====

// /pages/index.tsx
'use client'

import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
    const [todos, setTodos] = useState<{ id: number; text: string; userId: string }[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

    useEffect(() => {
        fetch('http://todo-vibe.local:4000/todos?user=demo')
            .then(res => res.json())
            .then(data => setTodos(data))
    }, []);

    const addTodo = async () => {
        const res = await fetch('http://todo-vibe.local:4000/todos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId: 'demo', text: newTodo})
        });
        const todo = await res.json();
        setTodos([...todos, todo]);
        setNewTodo('');
    }

    return (
        <>
            <Head><title>Vibe ToDo</title></Head>
            <main className="p-6 max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-4">Vibe ToDo</h1>
                <input
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                placeholder="Add a vibe..."
                className="border p-2 w-full mb-2"
                />
                <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 mb-4">Add</button>
                <ul>
                {todos.map((todo, i) => (
                    <li key={i} className="border-b py-2">{todo.text}</li>
                ))}
                </ul>
            </main>
        </>
    );
}