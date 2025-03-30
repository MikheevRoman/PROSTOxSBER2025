import React, {useEffect, useState} from 'react';

const MessageTemplateForm = ({ paymentDetails, setPaymentDetails, handleUpdateEvent }) => {
  const [localPaymentDetails, setLocalPaymentDetails] = useState(paymentDetails);

  useEffect(() => {
    setLocalPaymentDetails(paymentDetails);
  }, [paymentDetails]); // Обновляем локальное состояние при изменении paymentDetails


  return (
        <div className="template-form">
            <h3>Реквизиты для перевода средств</h3>
          <textarea
              value={localPaymentDetails}
              onChange={(e) => {
                setLocalPaymentDetails(e.target.value);
                setPaymentDetails(e.target.value);
              }}
              placeholder="Введите реквизиты для перевода средств"
          />
            <button className="button" onClick={handleUpdateEvent}>Сохранить реквизиты</button>
        </div>
    );
};

export default MessageTemplateForm;
