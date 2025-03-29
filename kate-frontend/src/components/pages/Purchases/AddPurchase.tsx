import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Header from '../../common/Header';
import './AddPurchase.css';
import {UUID} from "node:crypto";
import ProcurementFormData from "../../../model/ProcurementFormData";
import Procurement, {CompletionStatus, FundraisingStatus} from "../../../model/Procurement";
import {v4} from "uuid";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";
import {addProcurement, getProcurementById, updateProcurement} from "../../../api/endpoints/procurementEndpoints";
import {getEventParticipants} from "../../../api/endpoints/participantsEndpoints";
import Participant from "../../../model/Participant";

const AddPurchase = () => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const purchaseId: UUID = (useParams()).purchaseId as UUID;
  const { user } = useTelegramAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProcurementFormData>();
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<Participant>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const eventParticipants = (await getEventParticipants(eventId));
      const participant = (eventParticipants as Participant[]).find(e => e.tgUserId === user.id);
      setParticipant(participant);

      // Если это редактирование, загружаем данные покупки
      if (purchaseId) {
        const purchase = await getProcurementById(purchaseId);
        if (purchase) {
          setFormData({
            name: purchase.name,
            price: purchase.price,
            comment: purchase.comment,
            completionStatus: purchase.completionStatus,
            contributors: purchase.contributors,
            fundraisingStatus: purchase.fundraisingStatus,
          });
          setIsEditing(true);
        } else {
          // Если покупка не найдена, перенаправляем обратно
          navigate(`/event/${eventId}`);
        }
      }
      else {
        setFormData({
          name: '',
          price: 0,
          comment: '',
          completionStatus: CompletionStatus.IN_PROGRESS,
          contributors: [],
          fundraisingStatus: FundraisingStatus.NONE,
        });
      }
      setLoading(false);
    };

    loadData();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const purchaseData: Procurement = {
      id: v4() as UUID,
      name: formData.name,
      price: formData.price,
      comment: formData.comment,
      responsibleId: participant.id,
      completionStatus: formData.completionStatus,
      contributors: [], // List<Participant> // TODO: Implement
      fundraisingStatus: formData.fundraisingStatus
    };
    
    if (isEditing) {
      await updateProcurement(eventId, purchaseId, purchaseData);
    } else {
      await addProcurement(eventId, purchaseData);
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
      <div className="procurement-form-data">
        <h2>Procurement Details</h2>

        <div className="form-field">
          <label>Name:</label>
          <span>{formData?.name}</span>
        </div>

        <div className="form-field">
          <label>Price:</label>
          <span>${formData?.price.toString()}</span>
        </div>

        <div className="form-field">
          <label>Comment:</label>
          <p>{formData?.comment}</p>
        </div>

        <div className="form-field">
          <label>Completion Status:</label>
          <span className={`status-badge ${formData?.completionStatus.toLowerCase()}`}>
      {formData?.completionStatus}
    </span>
        </div>

        <div className="form-field">
          <label>Fundraising Status:</label>
          <span className={`status-badge ${formData?.fundraisingStatus.toLowerCase()}`}>
      {formData?.fundraisingStatus}
    </span>
        </div>

        <div className="form-field">
          <label>Contributors ({formData?.contributors.length}):</label>
          <ul className="contributors-list">
            {formData?.contributors.map(id => (
                <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      </div>
      <form className="purchase-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData?.name}
            onChange={handleChange}
            required
            placeholder="Название покупки"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Стоимость (руб.)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData?.price}
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
            value={formData?.contributors}
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
          <label htmlFor="completionStatus">Статус закупки</label>
          <select
            id="completionStatus"
            name="completionStatus"
            value={formData?.completionStatus}
            onChange={handleChange}
          >
            <option value="IN_PROGRESS">В процессе</option>
            <option value="DONE">Выполнено</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fundraisingStatus">Статус сбора средств</label>
          <select
              id="fundraisingStatus"
              name="fundraisingStatus"
              value={formData?.fundraisingStatus}
              onChange={handleChange}
          >
            <option value="NONE">Не планируется</option>
            <option value="PLANNING">Планируется</option>
            <option value="DONE">Собрано</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Примечание</label>
          <textarea
            id="comment"
            name="comment"
            value={formData?.comment}
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