import React from "react";

function Modal({ isVisible, onClose, children }) {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h1>Match Results</h1>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
