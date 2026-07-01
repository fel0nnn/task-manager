import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  // Функция для красивого цвета статусов
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'badge-new';
      case 'in_progress': return 'badge-progress';
      case 'done': return 'badge-done';
      default: return '';
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✨ TaskFlow</h1>
        <p>Управляй своими задачами легко и красиво</p>
      </header>
      
      <main className="content-grid">
        {/* Левая колонка: Форма */}
        <section className="form-section">
          <div className="card">
            <h2>Новая задача</h2>
            <form onSubmit={createTask}>
              <div className="input-group">
                <label>Название</label>
                <input 
                  type="text" 
                  placeholder="Например, Подготовить отчет" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Описание</label>
                <textarea 
                  placeholder="Детали задачи..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  required 
                />
              </div>
              <button type="submit" className="btn-primary">
                ➕ Добавить задачу
              </button>
            </form>
          </div>
        </section>

        {/* Правая колонка: Список задач */}
        <section className="tasks-section">
          <div className="card">
            <div className="card-header">
              <h2>Список задач</h2>
              <span className="task-count">Всего: {tasks.length}</span>
            </div>
            
            {tasks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">☕</span>
                <p>Пока нет активных задач. Время отдыхать!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Задача</th>
                      <th>Статус</th>
                      <th>Дата</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="task-info">
                          <span className="task-title">{task.title}</span>
                          <span className="task-desc">{task.description}</span>
                        </td>
                        <td>
                          <div className={`status-wrapper ${getStatusBadgeClass(task.status)}`}>
                            <select 
                              value={task.status} 
                              onChange={(e) => updateStatus(task.id, e.target.value)}
                            >
                              <option value="new">К выполнению</option>
                              <option value="in_progress">В процессе</option>
                              <option value="done">Готово</option>
                            </select>
                          </div>
                        </td>
                        <td className="date-cell">
                          {new Date(task.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td>
                          <button 
                            className="btn-icon" 
                            onClick={() => deleteTask(task.id)}
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;