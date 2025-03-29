import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ExpenseTable from './Summary/ExpenseTable';
import './TabStyles.css';
import MessageTemplateForm from "./Summary/MessageTemplateForm";


const SummaryTab = ({ event }) => {
  const { eventId } = useParams();
  const [template, setTemplate] = useState('');
  const [savedTemplate, setSavedTemplate] = useState('');
  const [participantSummary, setParticipantSummary] = useState([]);
  const [calculationDone, setCalculationDone] = useState(false);

  useEffect(() => {
    // TODO: Вынести загрузку шаблона в отдельный сервис
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

    // TODO: Расчеты должны приходить от сервера
    const allParticipants = [...event.participants];
    
    // Расчет общих затрат
    const totalExpenses = event.purchases.reduce((sum, purchase) => sum + (purchase.cost ? parseFloat(purchase.cost) : 0), 0);

    // Расчет затрат по каждому участнику
    const participantExpenses = {};
    allParticipants.forEach(participant => {
      participantExpenses[participant] = { spent: 0, share: 0, diff: 0, paid: false };
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
      participantExpenses[participant].diff = participantExpenses[participant].spent - participantExpenses[participant].share;
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

  const handlePaymentStatusChange = (participantId: string, paid: boolean) => {
    setParticipantSummary(prevSummary =>
        prevSummary.map(p =>
            p.id === participantId ? { ...p, paid } : p
        )
    );
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Итоги мероприятия</h2>
      </div>

      <MessageTemplateForm
          template={template}
          setTemplate={setTemplate}
          saveTemplate={saveTemplate}
          savedTemplate={savedTemplate}
      />

      <div className="calculate-expenses">
        <div className="tab-header">
          <h3>Расчет расходов</h3>
          <button className="button" onClick={calculateExpenses}>
            Рассчитать
          </button>
        </div>

        {calculationDone && participantSummary.length > 0 && (
            <ExpenseTable
                participantSummary={participantSummary}
                savedTemplate={savedTemplate}
                event={event}
                onPaymentStatusChange={handlePaymentStatusChange}
                calculateExpenses={calculateExpenses}
            />
        )}

      </div>
    </div>
  );
};

export default SummaryTab; 