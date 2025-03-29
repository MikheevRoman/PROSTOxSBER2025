import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TabStyles.css';
import {UUID} from "node:crypto";
import {useTelegramAuth} from "../../../../context/TelegramAuthContext";
import {
  getAssignedProcurementsForParticipant,
  getProcurementById,
  updateProcurement
} from "../../../../api/endpoints/procurementEndpoints";
import Procurement, {CompletionStatus} from "../../../../model/Procurement";
import {getEventParticipants} from "../../../../api/endpoints/participantsEndpoints";
import Participant from "../../../../model/Participant";

const MyTasksTab = ({ event }) => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const [tasks, setTasks] = useState<Procurement[]>([]);
  const { user } = useTelegramAuth();

  async function loadTasks() {
    // Фильтрация покупок, где текущий пользователь является ответственным
    const eventParticipants = (await getEventParticipants(eventId));
    const participant = (eventParticipants as Participant[]).find(e => e.tgUserId === user.id);
    const userTasks = await getAssignedProcurementsForParticipant(participant.id);
    setTasks(userTasks);
  }

  useEffect(() => {
    if (eventId) {
      loadTasks();
    }
  }, [eventId]);

  const handleTaskStatusChange = async (taskId: UUID, newStatus: CompletionStatus) => {
    let procurementToUpdate = await getProcurementById(taskId);
    procurementToUpdate.completionStatus = newStatus;
    await updateProcurement(eventId, taskId, procurementToUpdate);
    
    loadTasks();
  };

  const handleCostChange = async(taskId: UUID, newCostString: string) => {
    if (newCostString) {
      let procurementToUpdate = await getProcurementById(taskId);
      procurementToUpdate.price = parseFloat(newCostString);
      await updateProcurement(eventId, taskId, procurementToUpdate);

      loadTasks();
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h2>Задачи</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-tab">
          <p>У вас пока нет задач</p>
        </div>
      ) : (
        <div className="table-container my-tasks-table">
          <table>
            <thead>
              <tr>
                <th>Задача</th>
                <th>Стоимость</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>
                    <div>{index + 1}. {task.name}</div>
                    {task.comment && (
                      <div className="secondary-text">{task.comment}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={task.price || ''}
                      onChange={(e) => handleCostChange(task.id, e.target.value)}
                      placeholder="Укажите стоимость"
                      min="0"
                      className="cost-input"
                    />
                  </td>
                  <td>
                    <label className="task-status">
                      <select
                          value={task.completionStatus}
                          onChange={(e) => handleTaskStatusChange(task.id, e.target.value as CompletionStatus)}
                          className="task-status-select"
                      >
                        <option value={CompletionStatus.IN_PROGRESS}>В процессе</option>
                        <option value={CompletionStatus.DONE}>Выполнено</option>
                      </select>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTasksTab; 