import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../common/Header';
import { getEventById, addPurchase, updatePurchase } from '../../../services/eventService';
import './AddPurchase.css';

const AddPurchase = () => {
  const { eventId, purchaseId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'product',
    cost: '',
    note: '',
    responsible: 'currentUser',
    contributors: 'all',
    collection: '',
    status: 'not_started'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const eventData = getEventById(eventId);
      if (eventData) {
        setEvent(eventData);

        // Если это редактирование, загружаем данные покупки
        if (purchaseId) {
          const purchase = eventData.purchases.find(p => p.id === purchaseId);
          if (purchase) {
            setFormData({
              title: purchase.title || '',
              type: purchase.type || 'product',
              cost: purchase.cost || '',
              note: purchase.note || '',
              responsible: purchase.responsible || 'currentUser',
              contributors: purchase.contributors || 'all',
              collection: purchase.collection || '',
              status: purchase.status || 'not_started'
            });
            setIsEditing(true);
          } else {
            // Если покупка не найдена, перенаправляем обратно
            navigate(`/event/${eventId}`);
          }
        }
      } else {
        // Если мероприятие не найдено, перенаправляем на главную
        navigate('/');
      }
      setLoading(false);
    };

    loadData();
  }, [eventId, purchaseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const purchaseData = {
      title: formData.title,
      type: formData.type,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      note: formData.note || null,
      responsible: formData.responsible,
      contributors: formData.contributors,
      collection: formData.collection || null,
      status: formData.status
    };
    
    if (isEditing) {
      updatePurchase(eventId, purchaseId, purchaseData);
    } else {
      addPurchase(eventId, purchaseData);
    }
    
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="add-purchase-container">
      <Header 
        title={isEditing ? "Редактирование закупки" : "Добавление закупки"} 
        showBackButton={true} 
      />

      <form className="purchase-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Название*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Название покупки"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Тип</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="product">Продукт</option>
            <option value="service">Услуга</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cost">Стоимость (руб.)</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="Стоимость"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsible">Ответственный</label>
          <select
            id="responsible"
            name="responsible"
            value={formData.responsible}
            onChange={handleChange}
          >
            <option value="currentUser">Вы</option>
            {event.participants.filter(p => p !== 'currentUser').map(participant => (
              <option key={participant} value={participant}>
                {`Участник ${participant.substring(0, 5)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contributors">Кто скидывается</label>
          <select
            id="contributors"
            name="contributors"
            value={formData.contributors}
            onChange={handleChange}
          >
            <option value="all">Все участники</option>
            <option value="currentUser">Только вы</option>
            {/* В реальном приложении здесь можно было бы добавить возможность выбора конкретных участников */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="collection">Сбор средств</label>
          <select
            id="collection"
            name="collection"
            value={formData.collection}
            onChange={handleChange}
          >
            <option value="">Не требуется</option>
            <option value="planned">Планируется</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="not_started">Не начато</option>
            <option value="in_progress">В процессе</option>
            <option value="completed">Выполнено</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="note">Примечание</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Дополнительная информация"
            rows="3"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="button">
            {isEditing ? "Сохранить изменения" : "Добавить закупку"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase; 