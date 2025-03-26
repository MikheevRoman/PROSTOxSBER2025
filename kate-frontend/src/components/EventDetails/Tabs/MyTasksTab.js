import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updatePurchase } from '../../../services/eventService';
import './TabStyles.css';

const MyTasksTab = ({ event }) => {
  const { eventId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (event && event.purchases) {
      // Фильтрация покупок, где текущий пользователь является ответственным
      const userTasks = event.purchases.filter(purchase => {
        return purchase.responsible === 'currentUser';
      });
      
      setTasks(userTasks);
    }
  }, [event]);

  const handleTaskStatusChange = (taskId, isCompleted) => {
    const status = isCompleted ? 'completed' : 'in_progress';
    updatePurchase(eventId, taskId, { status });
    
    // Обновление состояния в UI
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const handleCostChange = (taskId, newCost) => {
    if (newCost === '' || !isNaN(newCost)) {
      const costValue = newCost === '' ? null : parseFloat(newCost);
      updatePurchase(eventId, taskId, { cost: costValue });
      
      // Обновление состояния в UI
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, cost: costValue } : task
        )
      );
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Мои задачи</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-tab">
          <p>У вас пока нет задач</p>
        </div>
      ) : (
        <div className="table-container my-tasks-table">
          <table>
            <thead>
              <tr>
                <th>Задача</th>
                <th>Стоимость</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>
                    <div>{index + 1}. {task.title}</div>
                    {task.note && (
                      <div className="secondary-text">{task.note}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={task.cost || ''}
                      onChange={(e) => handleCostChange(task.id, e.target.value)}
                      placeholder="Укажите стоимость"
                      min="0"
                      className="cost-input"
                    />
                  </td>
                  <td>
                    <label className="task-status">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.checked)}
                        className="task-checkbox"
                      />
                      Выполнено
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTasksTab; 