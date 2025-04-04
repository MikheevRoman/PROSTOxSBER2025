import React from 'react';
import {
    sendNotificationToParticipant,
    sendNotificationToUser
} from "../../../../../api/endpoints/notificationEndpoints";

const ExpenseTable = ({ participantSummary, onPaymentStatusChange, currentParticipantId }) => {

    const copyMessageToClipboard = (participant) => {
        if (!participant || !participant.notificationMessage) return;
        navigator.clipboard.writeText(participant.notificationMessage)
            .then(() => alert('Сообщение скопировано в буфер обмена'))
            .catch(err => console.error('Ошибка копирования: ', err));
    };


    const sendMessageToTelegram = async (participant) => {
        if (!participant || !participant.notificationMessage || !participant.participantId) return;
        try {
            await sendNotificationToParticipant(participant.participantId, participant.notificationMessage);
            alert("Сообщение отправлено через бота!");
        } catch (error) {
            alert("Ошибка при отправке сообщения!");
            console.error(error);
        }
    };

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
                                    checked={!!participant.hasPayment}
                                    onChange={(e) => onPaymentStatusChange(participant.participantId, e.target.checked)}
                                />
                            </td>
                            <td>{participant.name || 'Неизвестный'}</td>
                            <td>{(participant.spentAmount || 0).toFixed(2)} руб.</td>
                            <td>{(participant.owedAmount || 0).toFixed(2)} руб.</td>
                            <td>{(participant.totalAmount || 0).toFixed(2)} руб.</td>
                            <td>
                                {participant.totalAmount > 0 && participant.participantId !== currentParticipantId && (
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
