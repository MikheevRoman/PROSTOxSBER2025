import React from 'react';

const ExpenseTable = ({ participantSummary, onPaymentStatusChange }) => {

    // TODO: Сообщение берётся из участника мероприятия
    const copyMessageToClipboard = (participant) => {
        // if (!participant || !savedTemplate) return;
        // const amount = Math.abs(participant.totalAmount || 0).toFixed(2);
        // const message = savedTemplate.replace('{amount}', amount).replace('{eventTitle}', event.title);
        // navigator.clipboard.writeText(message)
        //     .then(() => alert('Сообщение скопировано в буфер обмена'))
        //     .catch(err => console.error('Ошибка копирования: ', err));
    };

    // TODO: Сообщение берётся из участника мероприятия
    const sendMessageToTelegram = (participant) => {
        // if (!participant || !savedTemplate) return;
        // const amount = Math.abs(participant.diff).toFixed(2);
        // const message = encodeURIComponent(savedTemplate.replace('{amount}', amount).replace('{eventTitle}', event.title));
        // window.open(`https://t.me/share/url?url=${message}`, '_blank');
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
                {participantSummary.map((participant) => {
                    const diff = participant.totalAmount || 0;

                    return (
                        <tr key={participant.participantId} className="participant-row">
                            <td>
                                <input
                                    type="checkbox"
                                    checked={!!participant.paid}
                                    onChange={(e) => onPaymentStatusChange(participant.participantId, e.target.checked)}
                                />
                            </td>
                            <td>{participant.name || 'Неизвестный'}</td>
                            <td>{(participant.spentAmount || 0).toFixed(2)} руб.</td>
                            <td>{(participant.owedAmount || 0).toFixed(2)} руб.</td>
                            <td>{(participant.totalAmount || 0).toFixed(2)} руб.</td>
                            <td>
                                {participant.totalAmount <= 0 && participant.participantId !== 'currentUser' && (
                                    <div className="transfer-actions">
                                        <button className="button secondary" onClick={() => copyMessageToClipboard(participant)}>Копировать</button>
                                        <button className="button secondary" onClick={() => sendMessageToTelegram(participant)}>Telegram</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseTable;
