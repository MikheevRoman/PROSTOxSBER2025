import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventInviteLink, removeParticipant, assignNewOrganizer } from '../../../../services/eventService';
import './TabStyles.css';
import {UUID} from "node:crypto";
import {useTelegramAuth} from "../../../../context/TelegramAuthContext";

const ParticipantsTab = ({ event }) => {
  const eventId = useParams() as unknown as UUID;
  const [participants, setParticipants] = useState(event.participants || []);
  const { user } = useTelegramAuth();

  const handleRemoveParticipant = async (participantId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого участника?')) {
      const success = await removeParticipant(user.id, eventId, participantId);
      if (success) {
        setParticipants(prevParticipants => 
          prevParticipants.filter(p => p !== participantId)
        );
      }
    }
  };

  const handleAssignOrganizer = async (participantId) => {
    if (window.confirm('Назначить этого участника организатором? Вы останетесь участником, но потеряете права организатора.')) {
      const success = await assignNewOrganizer(user.id, eventId, participantId);
      if (success) {
        // Обновление состояния на клиенте
        // В реальном приложении здесь будет перезагрузка данных мероприятия
        window.location.reload();
      }
    }
  };

  const copyInviteLink = () => {
    const link = getEventInviteLink(eventId);
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Ссылка-приглашение скопирована в буфер обмена');
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку: ', err);
      });
  };

  // В реальном приложении здесь было бы отображение имен участников
  // Для демо используем идентификаторы
  const getParticipantName = (participantId) => {
    if (participantId === 'currentUser') {
      return 'Вы';
    }
    return `Участник ${participantId.substring(0, 5)}`;
  };

  const isOrganizer = event.organizer === 'currentUser';

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Участники</h2>
      </div>

      <div className="table-container participants-table">
        <table>
          <thead>
            <tr>
              <th>Участник</th>
              <th>Роль</th>
              {isOrganizer && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {participants.map((participantId, index) => {
              const isCurrentOrganizer = participantId === event.organizer;
              return (
                <tr key={participantId}>
                  <td className="participant-name">
                    <div>{index + 1}. {getParticipantName(participantId)}</div>
                  </td>
                  <td>{isCurrentOrganizer ? 'Организатор' : 'Участник'}</td>
                  {isOrganizer && (
                    <td className="actions-cell">
                      {participantId !== 'currentUser' && (
                        <>
                          {!isCurrentOrganizer && (
                            <button 
                              className="action-button"
                              onClick={() => handleAssignOrganizer(participantId)}
                              title="Назначить организатором"
                            >
                              👑
                            </button>
                          )}
                          <button 
                            className="action-button delete"
                            onClick={() => handleRemoveParticipant(participantId)}
                            title="Удалить участника"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="invite-section">
        <h3>Пригласить участников</h3>
        <p>Поделитесь ссылкой, чтобы пригласить новых участников в мероприятие.</p>
        
        <div className="invite-link-container">
          <input 
            type="text" 
            className="invite-link-input" 
            value={getEventInviteLink(eventId)} 
            readOnly 
          />
          <button className="button" onClick={copyInviteLink}>
            Копировать
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTab; 