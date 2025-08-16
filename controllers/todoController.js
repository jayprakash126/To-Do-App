import db from '../db.js';

export const getTodos = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM todos");
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

export const getToDoById = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM todos WHERE id = ?", [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

export const createTodo = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const [results] = await db.query(
            "INSERT INTO todos (title, description, status) VALUES (?, ?, ?)",
            [title, description, status || 'pending']
        );
        res.json({ message: 'Todo added successfully', id: results.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

export const updateTodo = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const [results] = await db.query(
            "UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?",
            [title, description, status, req.params.id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const [results] = await db.query("DELETE FROM todos WHERE id = ?", [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
};
