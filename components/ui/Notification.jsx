import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

const Notification = () => {
  return <ToastContainer />;
};

export default Notification;