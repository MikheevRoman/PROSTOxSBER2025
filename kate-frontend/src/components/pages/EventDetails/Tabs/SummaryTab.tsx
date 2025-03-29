import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TabStyles.css';

const SummaryTab = ({ event }) => {
  const { eventId } = useParams();
  const [template, setTemplate] = useState('');
  const [savedTemplate, setSavedTemplate] = useState('');
  const [participantSummary, setParticipantSummary] = useState([]);
  const [calculationDone, setCalculationDone] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь можно было бы загрузить сохраненный шаблон
    const savedTemplateFromStorage = localStorage.getItem(`template_${eventId}`);
    if (savedTemplateFromStorage) {
      setSavedTemplate(savedTemplateFromStorage);
      setTemplate(savedTemplateFromStorage);
    } else {
      // Предустановленный шаблон
      const defaultTemplate = 'Привет! Прошу перевести {amount} руб. за мероприятие "{eventTitle}". Реквизиты: Сбербанк 1234 5678 9012 3456.';
      setTemplate(defaultTemplate);
    }
  }, [eventId]);

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const saveTemplate = () => {
    localStorage.setItem(`template_${eventId}`, template);
    setSavedTemplate(template);
    alert('Шаблон сохранен!');
  };

  // Расчет итогов мероприятия
  const calculateExpenses = () => {
    if (!event || !event.purchases) return;

    // Получаем всех участников
    const allParticipants = [...event.participants];
    
    // Расчет общих затрат
    const totalExpenses = event.purchases.reduce((sum: number, purchase) => {
      return sum + (purchase.cost ? parseFloat(purchase.cost) : 0);
    }, 0);
    
    // Расчет затрат по каждому участнику
    const participantExpenses = {};
    
    // Инициализация затрат для каждого участника
    allParticipants.forEach(participant => {
      participantExpenses[participant] = {
        spent: 0,
        share: 0,
        diff: 0,
        paid: false
      };
    });
    
    // Расчет затрат каждого участника
    event.purchases.forEach(purchase => {
      if (!purchase.cost) return;
      
      const cost = parseFloat(purchase.cost);
      
      // Если известен ответственный, учитываем его затраты
      if (purchase.responsible && purchase.responsible in participantExpenses) {
        participantExpenses[purchase.responsible].spent += cost;
      }
      
      // Расчет доли каждого участника в затратах
      let contributors = [];
      if (purchase.contributors === 'all') {
        contributors = [...allParticipants];
      } else if (purchase.contributors && Array.isArray(purchase.contributors)) {
        contributors = purchase.contributors;
      }
      
      if (contributors.length > 0) {
        const sharePerPerson = cost / contributors.length;
        contributors.forEach(contributor => {
          if (contributor in participantExpenses) {
            participantExpenses[contributor].share += sharePerPerson;
          }
        });
      }
    });
    
    // Расчет разницы между потраченным и долей
    Object.keys(participantExpenses).forEach(participant => {
      const spent = participantExpenses[participant].spent;
      const share = participantExpenses[participant].share;
      participantExpenses[participant].diff = spent - share;
    });
    
    // Формирование итогового массива для отображения
    const summary = Object.keys(participantExpenses).map(participant => ({
      id: participant,
      name: participant === 'currentUser' ? 'Вы (организатор)' : `Участник ${participant.substring(0, 5)}`,
      spent: participantExpenses[participant].spent,
      share: participantExpenses[participant].share,
      diff: participantExpenses[participant].diff,
      paid: participantExpenses[participant].paid
    }));
    
    setParticipantSummary(summary);
    setCalculationDone(true);
  };

  const handlePaymentStatusChange = (participantId, isPaid) => {
    setParticipantSummary(prevSummary => 
      prevSummary.map(p => 
        p.id === participantId ? { ...p, paid: isPaid } : p
      )
    );
  };

  const copyMessageToClipboard = (participant) => {
    if (!participant || !savedTemplate) return;
    
    const amount = Math.abs(participant.diff).toFixed(2);
    const message = savedTemplate
      .replace('{amount}', amount)
      .replace('{eventTitle}', event.title);
    
    navigator.clipboard.writeText(message)
      .then(() => {
        alert('Сообщение скопировано в буфер обмена');
      })
      .catch(err => {
        console.error('Не удалось скопировать сообщение: ', err);
      });
  };

  const sendMessageToTelegram = (participant) => {
    if (!participant || !savedTemplate) return;
    
    const amount = Math.abs(participant.diff).toFixed(2);
    const message = encodeURIComponent(
      savedTemplate
        .replace('{amount}', amount)
        .replace('{eventTitle}', event.title)
    );
    
    const telegramUrl = `https://t.me/share/url?url=${message}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Итоги мероприятия</h2>
      </div>

      <div className="template-form">
        <h3>Шаблон сообщения для перевода средств</h3>
        <p>Используйте {'{amount}'} для суммы и {'{eventTitle}'} для названия мероприятия</p>
        <textarea
          value={template}
          onChange={handleTemplateChange}
          placeholder="Введите шаблон сообщения для перевода средств"
        />
        <button className="button" onClick={saveTemplate}>
          Сохранить шаблон
        </button>
        
        {savedTemplate && (
          <div className="saved-template">
            <h4>Текущий шаблон:</h4>
            <p>{savedTemplate}</p>
          </div>
        )}
      </div>

      <div className="calculate-expenses">
        <div className="tab-header">
          <h3>Расчет расходов</h3>
          <button className="button" onClick={calculateExpenses}>
            Рассчитать
          </button>
        </div>

        {calculationDone && participantSummary.length > 0 && (
          <div className="table-container summary-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Участник</th>
                  <th>Потрачено</th>
                  <th>Доля</th>
                  <th>Сумма перевода</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {participantSummary.map((participant) => (
                  <tr key={participant.id} className="participant-row">
                    <td>
                      {participant.diff < 0 && (
                        <input
                          type="checkbox"
                          checked={participant.paid}
                          onChange={(e) => handlePaymentStatusChange(participant.id, e.target.checked)}
                        />
                      )}
                    </td>
                    <td>{participant.name}</td>
                    <td>{participant.spent.toFixed(2)} руб.</td>
                    <td>{participant.share.toFixed(2)} руб.</td>
                    <td>
                      {participant.diff === 0 ? (
                        'Не требуется'
                      ) : participant.diff > 0 ? (
                        <span className="positive">+{participant.diff.toFixed(2)} руб.</span>
                      ) : (
                        <span className="negative">{participant.diff.toFixed(2)} руб.</span>
                      )}
                    </td>
                    <td>
                      {participant.diff < 0 && participant.id !== 'currentUser' && (
                        <div className="transfer-actions">
                          <button 
                            className="button secondary"
                            onClick={() => copyMessageToClipboard(participant)}
                            title="Копировать сообщение"
                          >
                            Копировать
                          </button>
                          <button 
                            className="button secondary"
                            onClick={() => sendMessageToTelegram(participant)}
                            title="Отправить в Telegram"
                          >
                            Telegram
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryTab; 