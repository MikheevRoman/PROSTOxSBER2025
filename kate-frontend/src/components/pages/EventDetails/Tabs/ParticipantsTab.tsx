import React, {useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { removeParticipant, assignNewOrganizer } from '../../../../services/eventService';
import './TabStyles.css';
import {UUID} from "node:crypto";
import { useTelegramAuth } from "../../../../context/TelegramAuthContext";
import Participant from "../../../../model/Participant";
import { getEventParticipants } from "../../../../api/endpoints/participantsEndpoints";
import ApiErrorResponse from "../../../../model/ApiErrorResponse";
import EventEntity from "../../../../model/EventEntity";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import {getEventInviteLink} from "../../../../api/endpoints/eventEndpoints";


interface ParticipantItemProps {
  event: EventEntity;
}

const ParticipantsTab = ({event}: ParticipantItemProps) => {
  const {eventId} = useParams<{ eventId: UUID }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const {user} = useTelegramAuth();
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const loadParticipants = useCallback(async () => {
    const participants = await getEventParticipants(eventId);
    if (!participants || participants instanceof ApiErrorResponse) {
      console.error('Ошибка при получении участников мероприятия');
      return;
    }
    setParticipants(participants);
    const link = await getEventInviteLink(user.id, eventId);
    setInviteLink(link);
  }, [eventId]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const isCurrentUserOrganizer = () => event.organizerTgUserId === user.id;

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

  const copyInviteLink = async () => {
    const link = await getEventInviteLink(user.id, eventId);
    navigator.clipboard.writeText(link)
        .then(() => {
          alert('Ссылка-приглашение скопирована в буфер обмена');
        })
        .catch(err => {
          console.error('Не удалось скопировать ссылку: ', err);
        });
  };

  return (
      <div>
        <h2>Участники</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Участник</TableCell>
                <TableCell>Роль</TableCell>
                {isCurrentUserOrganizer() && <TableCell>Действия</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell>{index + 1}. {participant.name}</TableCell>
                    <TableCell>{participant.tgUserId === event.organizerTgUserId ? 'Организатор' : 'Участник'}</TableCell>
                    {isCurrentUserOrganizer() && participant.tgUserId !== user.id && (
                        <TableCell>
                          {participant.tgUserId !== event.organizerTgUserId && (
                              <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => handleAssignOrganizer(participant.id)}
                              >
                                Назначить организатором
                              </Button>
                          )}
                          <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleRemoveParticipant(participant.id)}
                              style={{marginLeft: 10}}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                    )}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Пригласить участников</h3>
        <p>Поделитесь ссылкой, чтобы пригласить новых участников в мероприятие.</p>
        <div>
          <input className="invite-link-input" type="text" value={inviteLink} readOnly
                 style={{width: '80%', marginRight: 10}}/>
          <Button variant="contained" onClick={copyInviteLink}>Копировать</Button>
        </div>
      </div>
  );
};

export default ParticipantsTab; 