import React from 'react';

const Contact: React.FC = () => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#000', 
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        <h1>Contactez-nous</h1>
        <form>
          <div>
            <label htmlFor="name">Nom :</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="message">Message :</label>
            <textarea id="message" name="message" required />
          </div>
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
