import React, {ChangeEvent, FormEvent, useState} from "react";
import EventFormData from "../../model/EventFormData";

interface EventFormProps {
    initialData?: Partial<EventFormData>;
    onSubmit: (e: React.FormEvent, formData: EventFormData) => void;
}

/**
 * Компонент формы для создания/редактирования мероприятия
 * @param {Partial<EventFormData>} [initialData] - Начальные данные формы
 * @param {(formData: EventFormData) => void} onSubmit - Колбек при отправке формы
 */
export const EventForm: React.FC<EventFormProps> = (props: EventFormProps) => {
    const initialData = props.initialData;
    const onSubmit = props.onSubmit;

    const [formData, setFormData] = useState<EventFormData>({
        name: initialData?.name,
        date: initialData?.date,
        place: initialData?.place,
        budget: initialData?.budget,
        comment: initialData?.comment
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        onSubmit(e, formData);
    };

    return (
        <form className="create-event-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Название мероприятия</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    required
                    placeholder="Введите название мероприятия"
                />
            </div>

            <div className="form-group">
                <label htmlFor="date">Дата и время</label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData?.date}
                    required
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="place">Место</label>
                <input
                    type="text"
                    id="place"
                    name="place"
                    value={formData?.place}
                    onChange={handleChange}
                    placeholder="Укажите место проведения"
                />
            </div>

            <div className="form-group">
                <label htmlFor="budget">Бюджет (руб.)</label>
                <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData?.budget}
                    onChange={handleChange}
                    placeholder="Укажите бюджет мероприятия"
                    min="0"
                />
            </div>

            <div className="form-group">
                <label htmlFor="comment">Примечание</label>
                <textarea
                    id="comment"
                    name="comment"
                    value={formData?.comment}
                    onChange={handleChange}
                    placeholder="Дополнительная информация"
                    rows={3}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="button">
                    Сохранить
                </button>
            </div>
        </form>
    );
};