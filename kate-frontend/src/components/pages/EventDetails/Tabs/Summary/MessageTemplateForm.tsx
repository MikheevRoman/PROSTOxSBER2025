import React from 'react';

const MessageTemplateForm = ({ template, setTemplate, saveTemplate, savedTemplate }) => {
    return (
        <div className="template-form">
            <h3>Шаблон сообщения для перевода средств</h3>
            <p>Используйте {'{amount}'} для суммы и {'{eventTitle}'} для названия мероприятия</p>
            <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Введите шаблон сообщения для перевода средств"
            />
            <button className="button" onClick={saveTemplate}>Сохранить шаблон</button>

            {savedTemplate && (
                <div className="saved-template">
                    <h4>Текущий шаблон:</h4>
                    <p>{savedTemplate}</p>
                </div>
            )}
        </div>
    );
};

export default MessageTemplateForm;
