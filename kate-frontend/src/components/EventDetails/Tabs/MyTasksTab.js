import React, { useState, useEffect, useRef } from 'react';
import './TabStyles.css';

const MyTasksTab = ({ event, updatePurchases, currentUser }) => {
  const [myTasks, setMyTasks] = useState([]);
  const tableRef = useRef(null);
  const [hasHiddenColumns, setHasHiddenColumns] = useState(false);
  
  // Фильтруем закупки, где текущий пользователь является ответственным
  useEffect(() => {
    if (event && event.purchases) {
      const filteredTasks = event.purchases.filter(purchase => 
        purchase.responsible === currentUser
      );
      
      setMyTasks(filteredTasks);
      
      // Запускаем проверку скрытых столбцов после рендера
      setTimeout(checkForHiddenColumns, 0);
    }
  }, [event, currentUser]);
  
  // Обработка изменения размера окна для адаптивности
  useEffect(() => {
    const handleResize = () => {
      checkForHiddenColumns();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Проверяем, есть ли скрытые столбцы
  const checkForHiddenColumns = () => {
    if (tableRef.current) {
      const tableWidth = tableRef.current.scrollWidth;
      const containerWidth = tableRef.current.parentElement.clientWidth;
      setHasHiddenColumns(tableWidth > containerWidth);
    }
  };

  // Изменение статуса задачи (выполнено/в процессе)
  const handleTaskStatusChange = (purchase, isCompleted) => {
    const updatedPurchase = {
      ...purchase,
      status: isCompleted ? 'completed' : 'in-progress'
    };
    
    const updatedPurchases = event.purchases.map(p => 
      p.id === purchase.id ? updatedPurchase : p
    );
    
    updatePurchases(updatedPurchases);
  };

  // Изменение стоимости задачи
  const handleCostChange = (purchase, newCost) => {
    const updatedPurchase = {
      ...purchase,
      cost: newCost ? Number(newCost) : null
    };
    
    const updatedPurchases = event.purchases.map(p => 
      p.id === purchase.id ? updatedPurchase : p
    );
    
    updatePurchases(updatedPurchases);
  };

  // Рассчитываем общую сумму задач
  const totalCost = myTasks.reduce((sum, item) => {
    return sum + (item.cost || 0);
  }, 0);

  return (
    <div className="my-tasks-tab">
      <div className="tab-header">
        <h2>Мои задачи</h2>
      </div>
      
      {myTasks.length > 0 ? (
        <div className={`table-container ${hasHiddenColumns ? 'table-has-more' : ''}`}>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Статус</th>
                <th>№</th>
                <th>Название</th>
                <th>Примечание</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map((task, index) => (
                <tr key={task.id}>
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={(e) => handleTaskStatusChange(task, e.target.checked)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{task.name}</td>
                  <td>{task.notes || '-'}</td>
                  <td className="cost-cell">
                    <input
                      type="number"
                      value={task.cost || ''}
                      onChange={(e) => handleCostChange(task, e.target.value)}
                      className="form-control cost-input"
                      placeholder="Не указана"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4"><strong>Итого:</strong></td>
                <td>{totalCost} ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>У вас пока нет задач</p>
          <p>Задачи появятся, когда вас назначат ответственным за какую-либо позицию</p>
        </div>
      )}
      
      {hasHiddenColumns && (
        <div className="hidden-columns-hint">
          <p>Прокрутите таблицу вправо, чтобы увидеть все столбцы</p>
        </div>
      )}
    </div>
  );
};

export default MyTasksTab; 