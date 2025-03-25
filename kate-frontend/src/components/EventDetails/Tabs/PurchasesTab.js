import React, { useState, useEffect, useRef } from 'react';
import './TabStyles.css';

const PurchasesTab = ({ event, updatePurchases, isOrganizer, currentUser }) => {
  const [purchases, setPurchases] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const tableRef = useRef(null);
  const [hasHiddenColumns, setHasHiddenColumns] = useState(false);

  // Начальные данные формы
  const initialFormData = {
    id: '',
    name: '',
    cost: '',
    fundRaising: 'no',
    notes: '',
    responsible: currentUser,
    contributors: 'all',
    status: 'in-progress'
  };

  const [formData, setFormData] = useState(initialFormData);

  // Обработка изменения размера окна для адаптивности
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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

  // Инициализация закупок из события и проверка скрытых столбцов
  useEffect(() => {
    if (event && event.purchases) {
      setPurchases(event.purchases);
    }
    
    // Запускаем проверку скрытых столбцов после рендера
    setTimeout(checkForHiddenColumns, 0);
  }, [event, windowWidth]);

  // Определяем, какие колонки показывать в зависимости от ширины экрана
  const getVisibleColumns = () => {
    if (windowWidth >= 1200) {
      return ['name', 'cost', 'fundRaising', 'notes', 'responsible', 'contributors', 'status', 'actions'];
    } else if (windowWidth >= 992) {
      return ['name', 'cost', 'notes', 'responsible', 'status', 'contributors', 'actions'];
    } else if (windowWidth >= 768) {
      return ['name', 'cost', 'responsible', 'status', 'actions'];
    } else {
      return ['name', 'cost', 'status', 'actions'];
    }
  };

  const visibleColumns = getVisibleColumns();

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Добавление новой закупки
  const handleAddPurchase = (e) => {
    e.preventDefault();
    
    const newPurchase = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      contributors: formData.contributors === 'all' ? 'all' : [formData.contributors],
      cost: formData.cost.trim() ? Number(formData.cost) : null
    };
    
    let updatedPurchases;
    
    if (editingItem) {
      // Обновление существующей закупки
      updatedPurchases = purchases.map(p => 
        p.id === editingItem.id ? newPurchase : p
      );
    } else {
      // Добавление новой закупки
      updatedPurchases = [...purchases, newPurchase];
    }
    
    setPurchases(updatedPurchases);
    updatePurchases(updatedPurchases);
    setFormData(initialFormData);
    setShowAddForm(false);
    setEditingItem(null);
    
    // После обновления таблицы проверяем скрытые столбцы
    setTimeout(checkForHiddenColumns, 0);
  };

  // Редактирование закупки
  const handleEditPurchase = (purchase) => {
    const formattedPurchase = {
      ...purchase,
      contributors: typeof purchase.contributors === 'string' ? purchase.contributors : purchase.contributors[0]
    };
    
    setFormData(formattedPurchase);
    setEditingItem(purchase);
    setShowAddForm(true);
  };

  // Удаление закупки
  const handleDeletePurchase = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту позицию?')) {
      const updatedPurchases = purchases.filter(p => p.id !== id);
      setPurchases(updatedPurchases);
      updatePurchases(updatedPurchases);
      
      // После обновления таблицы проверяем скрытые столбцы
      setTimeout(checkForHiddenColumns, 0);
    }
  };

  // Добавление текущего пользователя в список скидывающихся
  const handleAddToContributors = (purchase) => {
    const updatedPurchase = { ...purchase };
    
    if (updatedPurchase.contributors === 'all') {
      return; // Пользователь уже в списке
    }
    
    if (Array.isArray(updatedPurchase.contributors)) {
      if (!updatedPurchase.contributors.includes(currentUser)) {
        updatedPurchase.contributors = [...updatedPurchase.contributors, currentUser];
      }
    } else {
      updatedPurchase.contributors = [updatedPurchase.contributors, currentUser];
    }
    
    const updatedPurchases = purchases.map(p => 
      p.id === purchase.id ? updatedPurchase : p
    );
    
    setPurchases(updatedPurchases);
    updatePurchases(updatedPurchases);
  };

  // Проверка, участвует ли пользователь в оплате закупки
  const isUserContributor = (purchase) => {
    if (purchase.contributors === 'all') return true;
    return Array.isArray(purchase.contributors) && purchase.contributors.includes(currentUser);
  };

  // Получение отображаемого имени для списка скидывающихся
  const getContributorsDisplay = (contributors) => {
    if (contributors === 'all') return 'Все участники';
    if (Array.isArray(contributors)) {
      if (contributors.length > 2) {
        return `${contributors.length} участников`;
      }
      return contributors.join(', ');
    }
    return contributors;
  };

  // Функция для сортировки закупок
  const sortedPurchases = React.useMemo(() => {
    let sortablePurchases = [...purchases];
    if (sortConfig.key) {
      sortablePurchases.sort((a, b) => {
        // Специальная логика для поля contributors
        if (sortConfig.key === 'contributors') {
          const aValue = a.contributors === 'all' ? 0 : (Array.isArray(a.contributors) && a.contributors.includes(currentUser) ? 1 : 2);
          const bValue = b.contributors === 'all' ? 0 : (Array.isArray(b.contributors) && b.contributors.includes(currentUser) ? 1 : 2);
          
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        
        // Стандартная сортировка для других полей
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePurchases;
  }, [purchases, sortConfig, currentUser]);

  // Обработчик запроса сортировки
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Получение класса для заголовка сортировки
  const getSortDirectionClass = (name) => {
    if (!sortConfig.key) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };

  // Рассчитываем общую сумму закупок
  const totalCost = purchases.reduce((sum, item) => {
    return sum + (item.cost || 0);
  }, 0);

  // Рассчитываем разницу с бюджетом
  const budgetDifference = event.budget ? event.budget - totalCost : null;

  return (
    <div className="purchases-tab">
      <div className="tab-header">
        <h2>Список закупок и трат</h2>
        <button 
          className="btn btn-accent add-btn" 
          onClick={() => {
            setFormData(initialFormData);
            setEditingItem(null);
            setShowAddForm(!showAddForm);
          }}
        >
          Добавить новый пункт
        </button>
      </div>

      {showAddForm && (
        <div className="form-container card">
          <h3>{editingItem ? 'Редактировать позицию' : 'Добавить новую позицию'}</h3>
          <form onSubmit={handleAddPurchase}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Название*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cost">Стоимость</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  className="form-control"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="Оставьте пустым, если неизвестно"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fundRaising">Сбор средств</label>
                <select
                  id="fundRaising"
                  name="fundRaising"
                  className="form-control"
                  value={formData.fundRaising}
                  onChange={handleInputChange}
                >
                  <option value="no">Нет</option>
                  <option value="planned">Планируется</option>
                  <option value="completed">Проведен</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Примечание</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="responsible">Ответственный*</label>
                <select
                  id="responsible"
                  name="responsible"
                  className="form-control"
                  value={formData.responsible}
                  onChange={handleInputChange}
                  disabled={!isOrganizer && formData.responsible !== currentUser}
                >
                  <option value={currentUser}>Я</option>
                  {isOrganizer && event.participants.filter(p => p !== currentUser).map(participant => (
                    <option key={participant} value={participant}>
                      Участник {participant}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="contributors">Кто скидывается</label>
                <select
                  id="contributors"
                  name="contributors"
                  className="form-control"
                  value={formData.contributors}
                  onChange={handleInputChange}
                >
                  <option value="all">Все участники</option>
                  {event.participants.map(participant => (
                    <option key={participant} value={participant}>
                      {participant === currentUser ? 'Я' : `Участник ${participant}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Отмена
              </button>
              <button type="submit" className="btn btn-accent">
                {editingItem ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`table-container ${hasHiddenColumns ? 'table-has-more' : ''}`}>
        <table ref={tableRef}>
          <thead>
            <tr>
              <th>№</th>
              {visibleColumns.includes('name') && (
                <th 
                  onClick={() => requestSort('name')}
                  className={getSortDirectionClass('name')}
                >
                  Название
                </th>
              )}
              {visibleColumns.includes('cost') && (
                <th 
                  onClick={() => requestSort('cost')}
                  className={getSortDirectionClass('cost')}
                >
                  Стоимость
                </th>
              )}
              {visibleColumns.includes('fundRaising') && (
                <th 
                  onClick={() => requestSort('fundRaising')}
                  className={getSortDirectionClass('fundRaising')}
                >
                  Сбор средств
                </th>
              )}
              {visibleColumns.includes('notes') && (
                <th>Примечание</th>
              )}
              {visibleColumns.includes('responsible') && (
                <th 
                  onClick={() => requestSort('responsible')}
                  className={getSortDirectionClass('responsible')}
                >
                  Ответственный
                </th>
              )}
              {visibleColumns.includes('contributors') && (
                <th 
                  onClick={() => requestSort('contributors')}
                  className={getSortDirectionClass('contributors')}
                >
                  Кто скидывается
                </th>
              )}
              {visibleColumns.includes('status') && (
                <th 
                  onClick={() => requestSort('status')}
                  className={getSortDirectionClass('status')}
                >
                  Статус
                </th>
              )}
              {visibleColumns.includes('actions') && (
                <th>Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedPurchases.map((purchase, index) => (
              <tr key={purchase.id}>
                <td>{index + 1}</td>
                {visibleColumns.includes('name') && (
                  <td>{purchase.name}</td>
                )}
                {visibleColumns.includes('cost') && (
                  <td>{purchase.cost !== null ? `${purchase.cost} ₽` : 'Не указана'}</td>
                )}
                {visibleColumns.includes('fundRaising') && (
                  <td>
                    {purchase.fundRaising === 'completed' ? 'Проведен' : 
                     purchase.fundRaising === 'planned' ? 'Планируется' : '-'}
                  </td>
                )}
                {visibleColumns.includes('notes') && (
                  <td>{purchase.notes || '-'}</td>
                )}
                {visibleColumns.includes('responsible') && (
                  <td>{purchase.responsible === currentUser ? 'Я' : `Участник ${purchase.responsible}`}</td>
                )}
                {visibleColumns.includes('contributors') && (
                  <td>
                    {getContributorsDisplay(purchase.contributors)}
                    {!isUserContributor(purchase) && (
                      <button 
                        className="btn-link"
                        onClick={() => handleAddToContributors(purchase)}
                      >
                        + Добавить меня
                      </button>
                    )}
                  </td>
                )}
                {visibleColumns.includes('status') && (
                  <td>
                    <span className={`status-badge ${purchase.status}`}>
                      {purchase.status === 'completed' ? 'Выполнено' : 'В процессе'}
                    </span>
                  </td>
                )}
                {visibleColumns.includes('actions') && (
                  <td className="actions-cell">
                    <button 
                      className="btn-icon edit"
                      onClick={() => handleEditPurchase(purchase)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDeletePurchase(purchase.id)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2"><strong>Итого:</strong></td>
              <td colSpan={visibleColumns.length - 1}>{totalCost} ₽</td>
            </tr>
            {budgetDifference !== null && (
              <tr>
                <td colSpan="2"><strong>Разница с бюджетом:</strong></td>
                <td 
                  colSpan={visibleColumns.length - 1}
                  className={budgetDifference >= 0 ? 'positive' : 'negative'}
                >
                  {budgetDifference} ₽
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
      
      {hasHiddenColumns && (
        <div className="hidden-columns-hint">
          <p>Прокрутите таблицу вправо, чтобы увидеть все столбцы</p>
        </div>
      )}
    </div>
  );
};

export default PurchasesTab; 