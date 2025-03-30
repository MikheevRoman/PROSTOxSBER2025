import React, {useState, useEffect, MouseEventHandler} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TabStyles.css';
import {UUID} from "node:crypto";
import {useTelegramAuth} from "../../../../context/TelegramAuthContext";
import Procurement, {CompletionStatus, FundraisingStatus} from "../../../../model/Procurement";
import EventEntity from "../../../../model/EventEntity";
import {
  deleteProcurement,
  getEventProcurements,
  getProcurementById,
  updateProcurement
} from "../../../../api/endpoints/procurementEndpoints";
import Participant from "../../../../model/Participant";
import {getEventParticipants} from "../../../../api/endpoints/participantsEndpoints";
import {Box, Chip} from "@mui/material";

interface PurchasesProps {
  event: EventEntity;
  onAddPurchase: MouseEventHandler<HTMLButtonElement>;
}

const PurchasesTab = (props: PurchasesProps) => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const event: EventEntity = props.event;
  const onAddPurchase = props.onAddPurchase;

  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Procurement[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [budgetDifference, setBudgetDifference] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { user } = useTelegramAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);

  async function loadProcurements() {
    if (event && event) {
      const procurements = await getEventProcurements(event.id);
      setPurchases(procurements);

      const participantsData = await getEventParticipants(event.id) as Participant[];
      setParticipants(participantsData);

      // Расчет общей суммы
      const total = procurements.reduce((sum, purchase) =>
          sum + (purchase.price ? purchase.price : 0), 0);
      setTotalAmount(total);

      // Расчет разницы с бюджетом, если бюджет указан
      if (event.budget) {
        setBudgetDifference(event.budget - total);
      }
    }
  }

  useEffect(() => {
    loadProcurements();
  }, [event]);

  const handleEditPurchase = (purchaseId, e) => {
    e.stopPropagation();
    navigate(`/event/${eventId}/edit-purchase/${purchaseId}`);
  };

  const handleAddToContributors = async (purchaseId, e) => {
    e.stopPropagation();
    const purchase = await getProcurementById(purchaseId);
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

    await updateProcurement(eventId, purchaseId, purchase);
    
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

  const getStatusText = (status: CompletionStatus): string => {
    switch (status) {
      case CompletionStatus.DONE:
        return 'Выполнено';
      case CompletionStatus.IN_PROGRESS:
        return 'В процессе';
      default:
        return 'Не начато';
    }
  };

  const getCollectionText = (collection: FundraisingStatus): string => {
    switch (collection) {
      case FundraisingStatus.NONE:
        return 'Не собирается';
      case FundraisingStatus.IN_PROGRESS:
        return 'Собирается';
      case FundraisingStatus.DONE:
        return 'Собрано';
      default:
        return 'Неизвестно';
    }
  };

  const getParticipantNameById = (id: UUID): string => {
    const foundParticipant = participants.find(p => p.id === id);
    return foundParticipant?.name;
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

  const getContributorsText = (contributors: UUID[]): string => {
    if (!contributors || contributors.length === 0) {
      return 'Нет ответственных';
    }

    return contributors.map(id => getParticipantNameById(id)).join(', ');
  };

  // Выбор режима отображения в зависимости от ширины экрана (для мобильного вида)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  async function handleDeletePurchase(purchaseId: UUID) {
    await deleteProcurement(eventId, purchaseId);
    loadProcurements();
  }

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
                      <div className="primary-text">{index + 1}. {purchase.name}</div>
                      <div className="secondary-text">{getStatusText(purchase.completionStatus)}</div>
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
                      <button
                          className="action-button"
                          onClick={(e) => handleDeletePurchase(purchase.id)}
                          title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="purchase-details">
                    <div className="purchase-info">
                      <span className="info-label">Стоимость:</span>
                      <span className="info-value">{purchase.price ? `${purchase.price} руб.` : '—'}</span>
                      {getCollectionText(purchase.fundraisingStatus) && (
                        <span className="secondary-text">{getCollectionText(purchase.fundraisingStatus)}</span>
                      )}
                    </div>
                    <div className="purchase-info">
                      <span className="info-label">Ответственный:</span>
                      <span className="info-value">
                         {getParticipantNameById(purchase.responsibleId)}
                      </span>
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
                        <div className="primary-text">{index + 1}. {purchase.name}</div>
                        <div className="secondary-text">{getStatusText(purchase.completionStatus)}</div>
                      </td>
                      <td className="combined-cost">
                        <div className="primary-text">{purchase.price ? `${purchase.price} руб.` : '—'}</div>
                        {getCollectionText(purchase.fundraisingStatus) && (
                          <div className="secondary-text">{getCollectionText(purchase.fundraisingStatus)}</div>
                        )}
                      </td>
                      <td>
                        {getParticipantNameById(purchase.responsibleId)}
                      </td>
                      <td>
                        {purchase.contributors && purchase.contributors.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {purchase.contributors.map((value) => (
                              <Chip
                                  key={value}
                                  label={getParticipantNameById(value)}
                              />
                          ))}
                        </Box>) : 'Нет ответственных'}
                      </td>
                      <td>{getStatusText(purchase.completionStatus)}</td>
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
                        <button
                            className="action-button"
                            onClick={(e) => handleDeletePurchase(purchase.id)}
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