require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Получение списка задач
app.get('/tasks', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// Создание задачи
app.post('/tasks', async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ error: 'Название задачи обязательно' });
        
        const result = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

// Изменение статуса
app.put('/tasks/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['new', 'in_progress', 'done'].includes(status)) {
            return res.status(400).json({ error: 'Некорректный статус задачи' });
        }

        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rowCount === 0) return res.status(404).json({ error: 'Задача не найдена' });
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

// Удаление задачи
app.delete('/tasks/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

        if (result.rowCount === 0) return res.status(404).json({ error: 'Задача не найдена' });
        res.json({ message: 'Задача успешно удалена' });
    } catch (err) {
        next(err);
    }
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});