import React from 'react';

const ExpenseTable = ({ participantSummary, savedTemplate, event, onPaymentStatusChange, calculateExpenses }) => {
    const copyMessageToClipboard = (participant) => {
        if (!participant || !savedTemplate) return;

        const amount = Math.abs(participant.diff).toFixed(2);
        const message = savedTemplate.replace('{amount}', amount).replace('{eventTitle}', event.title);

        navigator.clipboard.writeText(message)
            .then(() => alert('Сообщение скопировано в буфер обмена'))
            .catch(err => console.error('Ошибка копирования: ', err));
    };

    const sendMessageToTelegram = (participant) => {
        if (!participant || !savedTemplate) return;

        const amount = Math.abs(participant.diff).toFixed(2);
        const message = encodeURIComponent(savedTemplate.replace('{amount}', amount).replace('{eventTitle}', event.title));

        window.open(`https://t.me/share/url?url=${message}`, '_blank');
    };

    // TODO: Должны меняться статусы, если участник уже оплатил перевод, при нажатии на чекбокс.
    // const handlePaymentStatusChange = (participantId, isPaid) => {
    //   setParticipantSummary(prevSummary =>
    //     prevSummary.map(p =>
    //       p.id === participantId ? { ...p, paid: isPaid } : p
    //     )
    //   );
    // };

    return (
        <div className="table-container summary-table">
            <button className="button" onClick={calculateExpenses}>
                Рассчитать расходы
            </button>
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
                                    onChange={(e) => onPaymentStatusChange(participant.id, e.target.checked)}
                                />
                            )}
                        </td>
                        <td>{participant.name}</td>
                        <td>{participant.spent.toFixed(2)} руб.</td>
                        <td>{participant.share.toFixed(2)} руб.</td>
                        <td>
                            {participant.diff === 0 ? 'Не требуется' :
                                participant.diff > 0 ? <span className="positive">+{participant.diff.toFixed(2)} руб.</span> :
                                    <span className="negative">{participant.diff.toFixed(2)} руб.</span>}
                        </td>
                        <td>
                            {participant.diff < 0 && participant.id !== 'currentUser' && (
                                <div className="transfer-actions">
                                    <button className="button secondary" onClick={() => copyMessageToClipboard(participant)}>Копировать</button>
                                    <button className="button secondary" onClick={() => sendMessageToTelegram(participant)}>Telegram</button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseTable;
