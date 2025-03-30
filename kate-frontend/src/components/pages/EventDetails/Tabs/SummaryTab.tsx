import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ExpenseTable from './Summary/ExpenseTable';
import './TabStyles.css';
import MessageTemplateForm from "./Summary/MessageTemplateForm";
import { getEventCostResults } from "../../../../api/endpoints/costResultEndpoints";
import {getEventById, updateEvent} from "../../../../api/endpoints/eventEndpoints";
import { UUID } from "node:crypto";
import Participant from "../../../../model/Participant";
import EventEntity from "../../../../model/EventEntity";
import TelegramUser from "../../../../model/TelegramUser";

interface ParticipantItemProps {
  event: EventEntity;
}

const SummaryTab = (event: ParticipantItemProps) => {
  const { eventId } = useParams<{ eventId: UUID }>();
  const [paymentDetails, setPaymentDetails] = useState('');
  const [participantSummary, setParticipantSummary] = useState([]);
  const [calculationDone, setCalculationDone] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (eventId) {
      getEventCostResults(eventId)
          .then(data => {
            setParticipantSummary(data);
            setCalculationDone(true);
          })
          .catch(error => console.error("Ошибка загрузки расчетов:", error));
    }
  }, [eventId]);

  useEffect(() => {
    if (event.event?.organizerCardInfo) {
      setPaymentDetails(event.event.organizerCardInfo);
    }
  }, [event.event?.organizerCardInfo]);

  const handleUpdateEvent = async () => {
    if (paymentDetails !== event.event.organizerCardInfo) {
      setIsUpdating(true);
      try {
        const updatedEvent = { ...event.event, organizerCardInfo: paymentDetails };
        await updateEvent(event.event.id, updatedEvent);

        event.event.organizerCardInfo = paymentDetails;
        alert("Реквизиты успешно обновлены!");
      } catch (error) {
        alert("Ошибка при обновлении реквизитов!");
        console.error(error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // TODO: Должен обновляться статус участника мероприятия на сервере
  const handlePaymentStatusChange = (participantId: string, paid: boolean) => {
    setParticipantSummary(prevSummary =>
        prevSummary.map(p =>
            p.participantId === participantId ? { ...p, paid } : p
        )
    );
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Итоги мероприятия</h2>
      </div>

      <MessageTemplateForm
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
          handleUpdateEvent={handleUpdateEvent}
      />

      <div className="calculate-expenses">
        <div className="tab-header">
          <h3>Расчет расходов</h3>
        </div>

        {calculationDone && participantSummary.length > 0 && (
            <ExpenseTable
                participantSummary={participantSummary}
                onPaymentStatusChange={handlePaymentStatusChange}
            />
        )}

      </div>
      {isUpdating && <p>Обновление реквизитов...</p>}
    </div>
  );
};

export default SummaryTab; 