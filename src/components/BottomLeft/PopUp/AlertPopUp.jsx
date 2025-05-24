import styles from "./AlertPopUp.module.css";

const AlertPopUp = ({ onClose, message }) => {
  if (!message) return null;
  return (
    <div className={styles.overlay}>
      <div className={`nes-container is-rounded ${styles.modal}`}>
        <div>
          <div>
            <label>{message}</label>
          </div>
        </div>
        <button className="nes-btn is-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertPopUp;
