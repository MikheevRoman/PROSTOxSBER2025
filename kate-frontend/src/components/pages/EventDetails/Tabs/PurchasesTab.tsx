import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePurchase } from '../../../../services/eventService';
import './TabStyles.css';
import {UUID} from "node:crypto";

const PurchasesTab = ({ event, onAddPurchase }) => {
  const eventId = useParams() as unknown as UUID;
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [budgetDifference, setBudgetDifference] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    if (event && event.purchases) {
      setPurchases(event.purchases);
      
      // Расчет общей суммы
      const total = event.purchases.reduce((sum, purchase) => 
        sum + (purchase.cost ? parseFloat(purchase.cost) : 0), 0);
      setTotalAmount(total);
      
      // Расчет разницы с бюджетом, если бюджет указан
      if (event.budget) {
        setBudgetDifference(event.budget - total);
      }
    }
  }, [event]);

  const handleEditPurchase = (purchaseId, e) => {
    e.stopPropagation();
    navigate(`/event/${eventId}/edit-purchase/${purchaseId}`);
  };

  const handleAddToContributors = async (purchaseId, e) => {
    e.stopPropagation();
    const purchase = purchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    let newContributors = [];

    // Если contributors - массив, добавляем текущего пользователя
    if (Array.isArray(purchase.contributors)) {
      newContributors = [...purchase.contributors, 'currentUser'];
    } 
    // Если contributors - строка 'all', оставляем как есть
    else if (purchase.contributors === 'all') {
      return;
    } 
    // Иначе создаем массив с текущим пользователем
    else {
      newContributors = ['currentUser'];
    }

    await updatePurchase(eventId, purchaseId, { contributors: newContributors });
    
    // Обновление состояния в UI
    setPurchases(prevPurchases => 
      prevPurchases.map(p => 
        p.id === purchaseId ? { ...p, contributors: newContributors } : p
      )
    );
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Выполнено';
      case 'in_progress':
        return 'В процессе';
      default:
        return 'Не начато';
    }
  };

  const getCollectionText = (collection) => {
    if (!collection) return null;
    return collection === 'planned' ? 'Планируется' : null;
  };

  const isUserContributor = (purchase) => {
    if (purchase.contributors === 'all') return true;
    if (Array.isArray(purchase.contributors)) {
      return purchase.contributors.includes('currentUser');
    }
    return false;
  };

  const sortedPurchases = [...purchases].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Специальная сортировка для поля "Кто скидывается"
    if (sortConfig.key === 'contributors') {
      const aIsAll = aValue === 'all';
      const bIsAll = bValue === 'all';
      const aHasCurrentUser = aValue && (aValue === 'all' || (Array.isArray(aValue) && aValue.includes('currentUser')));
      const bHasCurrentUser = bValue && (bValue === 'all' || (Array.isArray(bValue) && bValue.includes('currentUser')));
      
      // Сначала "Все участники"
      if (aIsAll && !bIsAll) return -1;
      if (!aIsAll && bIsAll) return 1;
      
      // Затем записи с текущим пользователем
      if (aHasCurrentUser && !bHasCurrentUser) return -1;
      if (!aHasCurrentUser && bHasCurrentUser) return 1;
      
      return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const renderSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return null;
  };

  const getContributorsText = (contributors) => {
    if (contributors === 'all') return 'Все участники';
    if (Array.isArray(contributors) && contributors.includes('currentUser')) {
      if (contributors.length === 1) return 'Только вы';
      return 'Вы и другие';
    }
    if (Array.isArray(contributors)) return 'Выбранные участники';
    return '—';
  };

  // Выбор режима отображения в зависимости от ширины экрана (для мобильного вида)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Список закупок</h2>
        <button className="button" onClick={onAddPurchase}>
          Добавить
        </button>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-tab">
          <p>Список закупок пуст</p>
          <button className="button" onClick={onAddPurchase}>
            Добавить закупку
          </button>
        </div>
      ) : (
        <>
          {/* Мобильный вид: карточки вместо таблицы */}
          {isMobileView ? (
            <div className="purchases-mobile-view">
              {sortedPurchases.map((purchase, index) => (
                <div key={purchase.id} className="purchase-card">
                  <div className="purchase-header">
                    <div className="purchase-title">
                      <div className="primary-text">{index + 1}. {purchase.title}</div>
                      <div className="secondary-text">{getStatusText(purchase.status)}</div>
                    </div>
                    <div className="purchase-actions">
                      <button 
                        className="action-button edit"
                        onClick={(e) => handleEditPurchase(purchase.id, e)}
                        title="Редактировать"
                      >
                        ✎
                      </button>
                      {!isUserContributor(purchase) && (
                        <button 
                          className="action-button join"
                          onClick={(e) => handleAddToContributors(purchase.id, e)}
                          title="Добавить себя в список скидывающихся"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="purchase-details">
                    <div className="purchase-info">
                      <span className="info-label">Стоимость:</span>
                      <span className="info-value">{purchase.cost ? `${purchase.cost} руб.` : '—'}</span>
                      {getCollectionText(purchase.collection) && (
                        <span className="secondary-text">{getCollectionText(purchase.collection)}</span>
                      )}
                    </div>
                    <div className="purchase-info">
                      <span className="info-label">Ответственный:</span>
                      <span className="info-value">
                        {purchase.responsible === 'currentUser' ? 'Вы' : (purchase.responsible || '—')}
                      </span>
                    </div>
                    <div className="purchase-info">
                      <span className="info-label">Тип:</span>
                      <span className="info-value">{purchase.type === 'product' ? 'Продукт' : 'Услуга'}</span>
                    </div>
                    <div className="purchase-info">
                      <span className="info-label">Кто скидывается:</span>
                      <span className="info-value">{getContributorsText(purchase.contributors)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="purchase-summary">
                <div className="total-amount">
                  <strong>Итого:</strong> {totalAmount} руб.
                </div>
                {event.budget && (
                  <div className="budget-difference">
                    <strong>Разница с бюджетом:</strong> 
                    <span className={budgetDifference >= 0 ? 'positive' : 'negative'}>
                      {budgetDifference >= 0 ? '+' : ''}{budgetDifference} руб.
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Десктопный вид: обычная таблица */
            <div className="table-container purchases-table">
              <table>
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSort('title')} 
                      className="sortable column-title"
                    >
                      Название{renderSortIndicator('title')}
                    </th>
                    <th 
                      onClick={() => handleSort('cost')} 
                      className="sortable column-cost"
                    >
                      Стоимость{renderSortIndicator('cost')}
                    </th>
                    <th 
                      onClick={() => handleSort('responsible')} 
                      className="sortable"
                    >
                      Ответственный{renderSortIndicator('responsible')}
                    </th>
                    <th 
                      onClick={() => handleSort('type')} 
                      className="sortable"
                    >
                      Тип{renderSortIndicator('type')}
                    </th>
                    <th 
                      onClick={() => handleSort('contributors')} 
                      className="sortable"
                    >
                      Кто скидывается{renderSortIndicator('contributors')}
                    </th>
                    <th 
                      onClick={() => handleSort('status')} 
                      className="sortable"
                    >
                      Статус{renderSortIndicator('status')}
                    </th>
                    <th className="actions-column">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPurchases.map((purchase, index) => (
                    <tr key={purchase.id}>
                      <td className="combined-title">
                        <div className="primary-text">{index + 1}. {purchase.title}</div>
                        <div className="secondary-text">{getStatusText(purchase.status)}</div>
                      </td>
                      <td className="combined-cost">
                        <div className="primary-text">{purchase.cost ? `${purchase.cost} руб.` : '—'}</div>
                        {getCollectionText(purchase.collection) && (
                          <div className="secondary-text">{getCollectionText(purchase.collection)}</div>
                        )}
                      </td>
                      <td>
                        {purchase.responsible === 'currentUser' ? 'Вы' : (purchase.responsible || '—')}
                      </td>
                      <td>{purchase.type === 'product' ? 'Продукт' : 'Услуга'}</td>
                      <td>
                        {getContributorsText(purchase.contributors)}
                      </td>
                      <td>{getStatusText(purchase.status)}</td>
                      <td className="actions-cell">
                        <button 
                          className="action-button edit"
                          onClick={(e) => handleEditPurchase(purchase.id, e)}
                          title="Редактировать"
                        >
                          ✎
                        </button>
                        {!isUserContributor(purchase) && (
                          <button 
                            className="action-button join"
                            onClick={(e) => handleAddToContributors(purchase.id, e)}
                            title="Добавить себя в список скидывающихся"
                          >
                            +
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="total-row">
                      <strong>Итого:</strong> {totalAmount} руб.
                    </td>
                    <td colSpan={5}>
                      {event.budget && (
                        <div className="budget-difference">
                          <strong>Разница с бюджетом:</strong> 
                          <span className={budgetDifference >= 0 ? 'positive' : 'negative'}>
                            {budgetDifference >= 0 ? '+' : ''}{budgetDifference} руб.
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PurchasesTab; 