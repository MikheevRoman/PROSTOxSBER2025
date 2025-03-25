import React, { useState, useEffect } from 'react';
import './TabStyles.css';

const SummaryTab = ({ event, updateEvent }) => {
  const [transferTemplate, setTransferTemplate] = useState('');
  const [savedTemplate, setSavedTemplate] = useState(event.transferTemplate || '');
  const [expenseCalculation, setExpenseCalculation] = useState([]);
  const [showCalculation, setShowCalculation] = useState(false);
  
  // Сохранение шаблона перевода
  const handleSaveTemplate = () => {
    if (transferTemplate.trim()) {
      setSavedTemplate(transferTemplate);
      
      // Обновление шаблона в объекте события
      const updatedEvent = {
        ...event,
        transferTemplate: transferTemplate
      };
      
      updateEvent(updatedEvent);
    }
  };

  // Расчет расходов и взносов
  const calculateExpenses = () => {
    const participants = event.participants;
    const purchases = event.purchases || [];
    
    // Считаем общую сумму затрат
    const totalExpenses = purchases.reduce((sum, item) => {
      return sum + (item.cost || 0);
    }, 0);
    
    // Вычисляем долю каждого участника
    const perPersonShare = totalExpenses / participants.length;
    
    // Подсчитываем, сколько потратил каждый участник
    const participantExpenses = participants.map(participantId => {
      // Находим все закупки, где человек является ответственным
      const personalExpenses = purchases
        .filter(p => p.responsible === participantId)
        .reduce((sum, purchase) => sum + (purchase.cost || 0), 0);
      
      // Вычисляем разницу между долей и затратами
      const difference = perPersonShare - personalExpenses;
      
      return {
        id: participantId,
        totalSpent: personalExpenses,
        share: perPersonShare,
        difference: difference,
        settled: false
      };
    });
    
    setExpenseCalculation(participantExpenses);
    setShowCalculation(true);
  };

  // Переключение статуса расчета с участником
  const toggleSettled = (participantId) => {
    setExpenseCalculation(prevCalculation => {
      return prevCalculation.map(p => {
        if (p.id === participantId) {
          return { ...p, settled: !p.settled };
        }
        return p;
      });
    });
  };

  // Генерация текста сообщения для пользователя
  const generateMessageText = (participant) => {
    if (!savedTemplate) {
      return `Привет! Твоя доля затрат на мероприятие "${event.title}" составляет ${participant.share.toFixed(2)} ₽. Пожалуйста, переведи ${Math.abs(participant.difference).toFixed(2)} ₽ организатору.`;
    }
    
    let message = savedTemplate;
    message = message.replace(/{eventTitle}/g, event.title);
    message = message.replace(/{share}/g, participant.share.toFixed(2));
    message = message.replace(/{amount}/g, Math.abs(participant.difference).toFixed(2));
    
    return message;
  };

  // Копирование сообщения с шаблоном
  const copyMessage = (participant) => {
    const message = generateMessageText(participant);
    
    navigator.clipboard.writeText(message)
      .then(() => {
        alert('Сообщение скопировано в буфер обмена!');
      })
      .catch(err => {
        console.error('Не удалось скопировать сообщение: ', err);
      });
  };

  // Отправка сообщения в Телеграм
  const sendTelegramMessage = (participant) => {
    const message = generateMessageText(participant);
    const encodedMessage = encodeURIComponent(message);
    
    // Открываем Telegram в новой вкладке с подготовленным сообщением
    window.open(`https://t.me/share/url?url=${encodedMessage}`, '_blank');
  };

  return (
    <div className="summary-tab">
      <div className="tab-header">
        <h2>Итоги мероприятия</h2>
      </div>
      
      <div className="template-section card">
        <h3>Шаблон для переводов</h3>
        <p className="hint">
          Вы можете создать шаблон с данными для перевода. Доступные переменные: {'{eventTitle}'}, {'{share}'}, {'{amount}'}
        </p>
        
        <div className="template-input">
          <textarea
            className="form-control"
            rows="4"
            value={transferTemplate}
            onChange={(e) => setTransferTemplate(e.target.value)}
            placeholder="Пример: Привет! Твоя доля затрат на мероприятие &quot;{eventTitle}&quot; составляет {share} ₽. Пожалуйста, переведи {amount} ₽ на карту 1234 5678 9012 3456."
          ></textarea>
          
          <button className="btn btn-primary" onClick={handleSaveTemplate}>
            Сохранить шаблон
          </button>
        </div>
        
        {savedTemplate && (
          <div className="saved-template">
            <h4>Сохраненный шаблон:</h4>
            <div className="template-preview card">
              {savedTemplate}
            </div>
          </div>
        )}
      </div>
      
      <div className="expense-calculation card">
        <div className="expense-header">
          <h3>Расчет расходов и взносов</h3>
          <button 
            className="btn btn-primary" 
            onClick={calculateExpenses}
          >
            Рассчитать расходы
          </button>
        </div>
        
        {showCalculation && expenseCalculation.length > 0 && (
          <div className="calculation-results">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Участник</th>
                    <th>Потрачено</th>
                    <th>Доля</th>
                    <th>Перевод</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseCalculation.map(participant => (
                    <tr key={participant.id} className={participant.settled ? 'settled' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={participant.settled}
                          onChange={() => toggleSettled(participant.id)}
                        />
                      </td>
                      <td>{participant.id === 'currentUser' ? 'Я (организатор)' : `Участник ${participant.id}`}</td>
                      <td>{participant.totalSpent.toFixed(2)} ₽</td>
                      <td>{participant.share.toFixed(2)} ₽</td>
                      <td className={participant.difference > 0 ? 'positive' : (participant.difference < 0 ? 'negative' : '')}>
                        {participant.difference === 0 ? 'Нет' : (
                          participant.difference > 0 
                            ? `Получить ${participant.difference.toFixed(2)} ₽` 
                            : `Отправить ${Math.abs(participant.difference).toFixed(2)} ₽`
                        )}
                      </td>
                      <td className="actions-cell">
                        {participant.difference < 0 && (
                          <>
                            <button 
                              className="btn-icon copy"
                              onClick={() => copyMessage(participant)}
                              title="Копировать сообщение"
                            >
                              📋
                            </button>
                            <button 
                              className="btn-icon telegram"
                              onClick={() => sendTelegramMessage(participant)}
                              title="Отправить в Telegram"
                            >
                              ✈️
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryTab; 