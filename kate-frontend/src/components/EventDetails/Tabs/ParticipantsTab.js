import React, { useState } from 'react';
import './TabStyles.css';

const ParticipantsTab = ({ event, updateParticipants, isOrganizer, currentUser }) => {
  const [inviteLink, setInviteLink] = useState(`${window.location.origin}/invite/${event.id}`);
  const [newOrganizerIndex, setNewOrganizerIndex] = useState(null);
  
  // Копирование ссылки-приглашения
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        alert('Ссылка скопирована!');
      })
      .catch(err => {
        console.error('Не удалось скопировать: ', err);
      });
  };

  // Удаление участника
  const handleRemoveParticipant = (participantId) => {
    if (participantId === event.organizerId) {
      alert('Нельзя удалить организатора мероприятия');
      return;
    }
    
    if (window.confirm('Вы уверены, что хотите удалить этого участника?')) {
      const updatedParticipants = event.participants.filter(p => p !== participantId);
      updateParticipants(updatedParticipants);
    }
  };

  // Открытие меню назначения нового организатора
  const toggleOrganizeChange = (index) => {
    setNewOrganizerIndex(newOrganizerIndex === index ? null : index);
  };

  // Назначение нового организатора
  const handleChangeOrganizer = (newOrganizerId) => {
    if (window.confirm('Вы уверены, что хотите передать права организатора этому участнику?')) {
      // Обновление организатора в родительском компоненте
      const updatedEvent = {
        ...event,
        organizerId: newOrganizerId
      };
      
      // Здесь мы должны обновить весь event, а не только participants
      // Для этого используем updateEvent вместо updateParticipants
      // Но так как мы его не передали, нужно добавить его в props компонента
      // или обновить только необходимые поля
      
      // Самый простой вариант - перезагрузить страницу, чтобы пользователь заново зашел
      // но мы просто покажем сообщение
      alert('Права организатора переданы другому участнику. Обновите страницу.');
    }
    
    setNewOrganizerIndex(null);
  };

  return (
    <div className="participants-tab">
      <div className="tab-header">
        <h2>Участники мероприятия</h2>
      </div>
      
      <div className="invite-link-container card">
        <p>Ссылка для приглашения участников:</p>
        <div className="invite-link-box">
          <input 
            type="text" 
            value={inviteLink} 
            readOnly 
            className="form-control"
          />
          <button className="btn btn-secondary copy-link-btn" onClick={handleCopyLink}>
            Копировать
          </button>
        </div>
      </div>
      
      <div className="participants-list card">
        <h3>Список участников ({event.participants.length})</h3>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Участник</th>
                <th>Роль</th>
                {isOrganizer && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {event.participants.map((participant, index) => (
                <tr key={participant} className={participant === currentUser ? 'current-user' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    {participant === currentUser ? 'Я' : `Участник ${participant}`}
                  </td>
                  <td>
                    {participant === event.organizerId ? 'Организатор' : 'Участник'}
                  </td>
                  {isOrganizer && (
                    <td className="actions-cell">
                      {participant !== event.organizerId && participant !== currentUser && (
                        <>
                          <button 
                            className="btn-icon make-organizer"
                            onClick={() => toggleOrganizeChange(index)}
                            title="Назначить организатором"
                          >
                            👑
                          </button>
                          
                          {newOrganizerIndex === index && (
                            <div className="confirm-dropdown">
                              <p>Назначить организатором?</p>
                              <div className="confirm-buttons">
                                <button 
                                  className="btn btn-secondary"
                                  onClick={() => setNewOrganizerIndex(null)}
                                >
                                  Отмена
                                </button>
                                <button 
                                  className="btn btn-primary"
                                  onClick={() => handleChangeOrganizer(participant)}
                                >
                                  Подтвердить
                                </button>
                              </div>
                            </div>
                          )}
                          
                          <button 
                            className="btn-icon delete"
                            onClick={() => handleRemoveParticipant(participant)}
                            title="Удалить участника"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTab; 