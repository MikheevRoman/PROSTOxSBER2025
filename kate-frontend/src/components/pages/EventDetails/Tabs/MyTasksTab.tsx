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
import {MenuItem, Select} from "@mui/material";

const MyTasksTab = ({ event }) => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const [tasks, setTasks] = useState<Procurement[]>([]);
  const { user } = useTelegramAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<UUID | null>(null);

  useEffect(() => {
    async function fetchParticipants() {
      const eventParticipants = await getEventParticipants(eventId);
      if (Array.isArray(eventParticipants)) {
        setParticipants(eventParticipants);
        const currentUser = eventParticipants.find(p => p.tgUserId === user.id);
        if (currentUser) {
          setSelectedParticipantId(currentUser.id);
          loadTasks(currentUser.id);
        }
      }
    }
    fetchParticipants();
  }, [eventId]);


  async function loadTasks(participantId: UUID | null) {
    if (!participantId) return;
    const userTasks = await getAssignedProcurementsForParticipant(participantId);
    setTasks(userTasks || []);
  }

  useEffect(() => {
    if (selectedParticipantId) {
      loadTasks(selectedParticipantId);
    }
  }, [selectedParticipantId]);

  const handleParticipantChange = (event) => {
    const newParticipantId = event.target.value;
    setSelectedParticipantId(newParticipantId);
    loadTasks(newParticipantId); // Загружаем задачи для нового участника сразу
  };

  const handleTaskStatusChange = async (taskId: UUID, newStatus: CompletionStatus) => {
    let procurementToUpdate = await getProcurementById(taskId);
    procurementToUpdate.completionStatus = newStatus;
    await updateProcurement(eventId, taskId, procurementToUpdate);
    loadTasks(selectedParticipantId);
  };

  const handleCostChange = async (taskId: UUID, newCostString: string) => {
    if (newCostString) {
      let procurementToUpdate = await getProcurementById(taskId);
      procurementToUpdate.price = parseFloat(newCostString);
      await updateProcurement(eventId, taskId, procurementToUpdate);
      loadTasks(selectedParticipantId);
    }
  };

  return (
      <div className="tab-container">
        <div className="tab-header">
          <h2>Задачи</h2>
          <Select value={selectedParticipantId || ''} onChange={handleParticipantChange}>
            {participants.map(participant => (
                <MenuItem key={participant.id} value={participant.id}>
                  {participant.name || 'Без имени'}
                </MenuItem>
            ))}
          </Select>
        </div>

        {!tasks || tasks.length === 0 ? (
            <div className="empty-tab">
              <p>Задач нет</p>
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
                {tasks.map((task, index) => (
                    <tr key={task.id}>
                      <td>
                        <div>{index + 1}. {task.name}</div>
                        {task.comment && <div className="secondary-text">{task.comment}</div>}
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
                        <Select
                            value={task.completionStatus}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value as CompletionStatus)}
                            label="Status"
                        >
                          <MenuItem value={CompletionStatus.IN_PROGRESS}>В процессе</MenuItem>
                          <MenuItem value={CompletionStatus.DONE}>Выполнено</MenuItem>
                        </Select>
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