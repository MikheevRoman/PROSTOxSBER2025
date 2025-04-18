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
import {Box, Chip, MenuItem, OutlinedInput, Select} from "@mui/material";

const AddPurchase = () => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const purchaseId: UUID = (useParams()).purchaseId as UUID;
  const { user } = useTelegramAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProcurementFormData>({
    name: '',
    price: 0,
    comment: '',
    completionStatus: CompletionStatus.IN_PROGRESS,
    contributors: [], // явно инициализируем пустым массивом
    fundraisingStatus: FundraisingStatus.NONE,
    responsibleId: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [currentUserAsParticipant, setCurrentUserAsParticipant] = useState<Participant>();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const eventParticipants = (await getEventParticipants(eventId));
      setParticipants(eventParticipants as Participant[]);
      const participant = (eventParticipants as Participant[]).find(e => e.tgUserId === user.id);
      setCurrentUserAsParticipant(participant);

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
            responsibleId: purchase.responsibleId || currentUserAsParticipant?.id,
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

  const getParticipantNameById = (id: UUID): string => {
    const participant = participants.find(p => p.id === id);
    return participant?.name;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /**
     * Проверка того, что ответственный введён
     */
    if (!formData?.responsibleId) {
      alert("Выберите ответственного!");
      return;
    }

    const purchaseData: Procurement = {
      id: v4() as UUID,
      name: formData.name,
      price: formData.price,
      comment: formData.comment,
      responsibleId: formData.responsibleId,
      completionStatus: formData.completionStatus,
      contributors: formData.contributors,
      fundraisingStatus: formData.fundraisingStatus
    };

    if (isEditing) {
      const eventParticipants = (await getEventParticipants(eventId));
      const participant = (eventParticipants as Participant[]).find(e => e.tgUserId === user.id);
      await updateProcurement(eventId, purchaseId, purchaseData, participant.id);
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

        <div className="form-group">
          <label htmlFor="responsibleId">Ответственный</label>
          <Select
              id="responsibleId"
              name="responsibleId"
              value={formData?.responsibleId}
              onChange={handleChange}
              input={<OutlinedInput label="Ответственный" />}
          >
            {participants.map(participant => (
                <MenuItem key={participant.id} value={participant.id}>
                  {participant.name}
                </MenuItem>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <label htmlFor="contributors">Кто скидывается</label>
          <Select
              id="contributors"
              name="contributors"
              value={formData?.contributors || []}
              onChange={handleChange}
              input={<OutlinedInput label="Кто скидывается" />}
              multiple
              renderValue={(selected) => {
                if (!selected || selected.length === 0) {
                  return <span>Все</span>; // Возвращаем React-элемент вместо строки
                }
                return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                          <Chip
                              key={value}
                              label={getParticipantNameById(value)}
                          />
                      ))}
                    </Box>
                );
              }}
          >
            {currentUserAsParticipant &&
              <MenuItem key={currentUserAsParticipant.id} value={currentUserAsParticipant.id}> {currentUserAsParticipant.name} </MenuItem>
            }

            {
              participants.filter(p => p.id !== currentUserAsParticipant.id).map(participant => (
              <MenuItem key={participant.id} value={participant.id}>
                {`${participant.name}`}
              </MenuItem >
              ))
            }
          </Select>
        </div>

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
          <label htmlFor="comment">Примечание ({formData?.comment?.length || 0}/200)</label>
          <textarea
            id="comment"
            name="comment"
            value={formData?.comment}
            onChange={handleChange}
            maxLength={200}
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