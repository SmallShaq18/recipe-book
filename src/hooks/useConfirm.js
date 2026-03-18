import { useState, useRef } from 'react';

// The original version stored callbacks in useState which causes a stale
// closure bug — React treats functions passed to setState as updater functions,
// so `setOnConfirm(() => callback)` calls callback immediately instead of
// storing it. Using useRef fixes this.

export function useConfirm() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [message,  setMessage]  = useState('');
  const onConfirmRef = useRef(() => {});
  const onCancelRef  = useRef(() => {});

  const confirm = (msg, onConfirmCallback, onCancelCallback = () => {}) => {
    setMessage(msg);
    onConfirmRef.current = onConfirmCallback;
    onCancelRef.current  = onCancelCallback;
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onConfirmRef.current();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancelRef.current();
    setIsOpen(false);
  };

  const close = () => setIsOpen(false);

  return { isOpen, message, confirm, handleConfirm, handleCancel, close };
}

