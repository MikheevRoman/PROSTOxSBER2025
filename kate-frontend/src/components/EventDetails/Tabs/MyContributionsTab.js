import React, { useState, useEffect } from 'react';
import './TabStyles.css';

const MyContributionsTab = ({ event, updatePurchases, currentUser }) => {
  const [myContributions, setMyContributions] = useState([]);
  
  // Фильтруем закупки, в которых участвует текущий пользователь
  useEffect(() => {
    if (event && event.purchases) {
      const filteredPurchases = event.purchases.filter(purchase => {
        return purchase.contributors === 'all' || 
               (Array.isArray(purchase.contributors) && 
                purchase.contributors.includes(currentUser));
      });
      
      setMyContributions(filteredPurchases);
    }
  }, [event, currentUser]);

  // Рассчитываем общую сумму взносов
  const totalContributions = myContributions.reduce((sum, item) => {
    return sum + (item.cost || 0);
  }, 0);

  // Удаление пользователя из списка скидывающихся
  const handleRemoveContribution = (purchase) => {
    if (purchase.contributors === 'all') {
      // Сначала копируем всех участников кроме текущего
      const newContributors = event.participants.filter(p => p !== currentUser);
      
      // Обновляем закупку
      const updatedPurchase = {
        ...purchase,
        contributors: newContributors.length > 0 ? newContributors : purchase.contributors
      };
      
      const updatedPurchases = event.purchases.map(p => 
        p.id === purchase.id ? updatedPurchase : p
      );
      
      updatePurchases(updatedPurchases);
    } else if (Array.isArray(purchase.contributors)) {
      // Удаляем текущего пользователя из списка
      const updatedContributors = purchase.contributors.filter(c => c !== currentUser);
      
      const updatedPurchase = {
        ...purchase,
        contributors: updatedContributors.length > 0 ? updatedContributors : purchase.contributors
      };
      
      const updatedPurchases = event.purchases.map(p => 
        p.id === purchase.id ? updatedPurchase : p
      );
      
      updatePurchases(updatedPurchases);
    }
  };

  return (
    <div className="my-contributions-tab">
      <div className="tab-header">
        <h2>Мои взносы</h2>
      </div>
      
      {myContributions.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Название</th>
                <th>Примечание</th>
                <th>Стоимость</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {myContributions.map((purchase, index) => (
                <tr key={purchase.id}>
                  <td>{index + 1}</td>
                  <td>{purchase.name}</td>
                  <td>{purchase.notes || '-'}</td>
                  <td>{purchase.cost !== null ? `${purchase.cost} ₽` : 'Не указана'}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleRemoveContribution(purchase)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Итого:</strong></td>
                <td colSpan="2">{totalContributions} ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>У вас пока нет взносов</p>
          <p>Перейдите на вкладку "Закупки", чтобы добавить себя в список скидывающихся</p>
        </div>
      )}
    </div>
  );
};

export default MyContributionsTab; 