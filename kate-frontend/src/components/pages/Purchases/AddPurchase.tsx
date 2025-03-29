import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../common/Header';
import { getEventById, addPurchase, updatePurchase } from '../../../services/eventService';
import './AddPurchase.css';
import {UUID} from "node:crypto";
import PurchaseFormData from "../../../model/PurchaseFormData";
import Purchase, {CompletionStatus, FundraisingStatus} from "../../../model/Purchase";
import {v4} from "uuid";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";

const AddPurchase = () => {
  const { eventIdString, purchaseIdString } = useParams();
  const eventId = eventIdString as UUID;
  const purchaseId = purchaseIdString as UUID;
  const { user } = useTelegramAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PurchaseFormData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const eventData = await getEventById(user.id, eventId);
      if (eventData) {
        setEvent(eventData);

        // Если это редактирование, загружаем данные покупки
        if (purchaseId) {
          const purchase = eventData.purchases.find(p => p.id === purchaseId);
          if (purchase) {
            setFormData({
              name: purchase.name,
              price: purchase.price, // int
              comment: purchase.comment,
              completionStatus: purchase.completionStatus,
              contributors: purchase.contributors, // List<Participant>
              fundraisingStatus: purchase.fundraisingStatus,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const purchaseData: Purchase = {
      id: v4() as UUID, // uuid
      name: formData.name,
      price: formData.price,// int
      comment: formData.comment,
      responsible: v4() as UUID, // uuid of responsible person
      completionStatus: formData.completionStatus,
      contributors: [], // List<Participant> // TODO: Implement
      fundraisingStatus: formData.fundraisingStatus
    };
    
    if (isEditing) {
      await updatePurchase(user.id, eventId, purchaseId, purchaseData);
    } else {
      await addPurchase(user.id, eventId, purchaseData);
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
          <label htmlFor="title">Название</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Название покупки"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cost">Стоимость (руб.)</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.price}
            onChange={handleChange}
            placeholder="Стоимость"
            min="0"
          />
        </div>

        {/*<div className="form-group">*/}
        {/*  <label htmlFor="responsible">Ответственный</label>*/}
        {/*  <select*/}
        {/*    id="responsible"*/}
        {/*    name="responsible"*/}
        {/*    value={formData.responsible}*/}
        {/*    onChange={handleChange}*/}
        {/*  >*/}
        {/*    <option value="currentUser">Вы</option>*/}
        {/*    {event.participants.filter(p => p !== 'currentUser').map(participant => (*/}
        {/*      <option key={participant} value={participant}>*/}
        {/*        {`Участник ${participant.substring(0, 5)}`}*/}
        {/*      </option>*/}
        {/*    ))}*/}
        {/*  </select>*/}
        {/*</div>*/}

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

        {/*<div className="form-group">*/}
        {/*  <label htmlFor="collection">Сбор средств</label>*/}
        {/*  <select*/}
        {/*    id="collection"*/}
        {/*    name="collection"*/}
        {/*    value={formData.collection}*/}
        {/*    onChange={handleChange}*/}
        {/*  >*/}
        {/*    <option value="">Не требуется</option>*/}
        {/*    <option value="planned">Планируется</option>*/}
        {/*  </select>*/}
        {/*</div>*/}

        <div className="form-group">
          <label htmlFor="status">Статус закупки</label>
          <select
            id="status"
            name="status"
            value={formData.completionStatus}
            onChange={handleChange}
          >
            <option value="NOT_STARTED">Не начато</option>
            <option value="IN_PROGRESS">В процессе</option>
            <option value="COMPLETED">Выполнено</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус сбора средств</label>
          <select
              id="status"
              name="status"
              value={formData.fundraisingStatus}
              onChange={handleChange}
          >
            <option value="NOT_STARTED">Не начато</option>
            <option value="IN_PROGRESS">В процессе</option>
            <option value="FUNDED">Собрано</option>
            <option value="FAILED">Не собрали</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="note">Примечание</label>
          <textarea
            id="note"
            name="note"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Дополнительная информация"
            rows={3}
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