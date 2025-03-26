import React, { useState, useEffect } from 'react';
import './TabStyles.css';

const MyContributionsTab = ({ event }) => {
  const [contributions, setContributions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (event && event.purchases) {
      // Фильтрация покупок, где текущий пользователь является участником
      const userContributions = event.purchases.filter(purchase => {
        return purchase.contributors === 'all' || 
               (purchase.contributors && purchase.contributors.includes('currentUser'));
      });
      
      setContributions(userContributions);
      
      // Расчет общей суммы
      const total = userContributions.reduce((sum, purchase) => 
        sum + (purchase.cost ? parseFloat(purchase.cost) : 0), 0);
      setTotalAmount(total);
    }
  }, [event]);

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Мои взносы</h2>
      </div>

      {contributions.length === 0 ? (
        <div className="empty-tab">
          <p>У вас пока нет взносов</p>
        </div>
      ) : (
        <div className="table-container my-contributions-table">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contribution, index) => (
                <tr key={contribution.id}>
                  <td className="contribution-name">
                    <div>{index + 1}. {contribution.title}</div>
                    {contribution.note && (
                      <div className="secondary-text">{contribution.note}</div>
                    )}
                  </td>
                  <td>{contribution.cost ? `${contribution.cost} руб.` : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="total-row" colSpan="2">
                  <strong>Итого:</strong> {totalAmount} руб.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyContributionsTab; 