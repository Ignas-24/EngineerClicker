import styles from "./AlertPopUp.module.css";

const AlertPopUp = ({ onClose, message }) => {
  if (!message) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
          <div>
            <div>
                <label>{message}</label>
            </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AlertPopUp;