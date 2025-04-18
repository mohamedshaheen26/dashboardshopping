import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../config";

const Support = () => {
  const [supportData, setSupportData] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  //Fetch support data
  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Support/all`);
      if (!response.ok) throw new Error("Failed to fetch support data");

      const data = await response.json();
      setSupportData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const time = new Intl.DateTimeFormat("default", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

    return isToday ? `Today ${time}` : `${date.toLocaleDateString()} ${time}`;
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Support/respond/${supportData[0].id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            response: messageInput,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      fetchSupportData();

      toast.success(`Message sent successfully!`, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        closeButton: false,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setMessageInput("");
    }
  };

  return (
    <div className='main-container profile'>
      <div className='main-title'>
        <h3>Customer Support</h3>
      </div>
      <div className='p-4 shadow-lg rounded call-center'>
        <div className='row'>
          <div className='col-5 d-flex justify-content-center align-items-center'>
            <img src='message.png' alt='' />
          </div>
          <div className='col-7'>
            <section className='card border-0'>
              <div className='card-body'>
                <div className='overflow-auto' style={{ maxHeight: "700px" }}>
                  {
                    /* Support Data Display */
                    [...supportData].reverse().map((item, index) => (
                      <React.Fragment key={index}>
                        <div className='d-flex flex-column align-items-end mb-3 mx-3'>
                          <div className='message'>{item.message}</div>
                          <span className='time'>
                            {formatTime(item.createdAt)}
                          </span>
                        </div>
                        {item.response && (
                          <div className='d-flex flex-column align-items-start mb-3 mx-3'>
                            <div className='response'>{item.response}</div>
                            <span className='time'>
                              {formatTime(item.respondedAt)}
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  }
                </div>
                <div className='msg-box'>
                  <div className='d-flex justify-content-between align-items-center gap-2'>
                    <input
                      type='text'
                      className='form-control submit-input'
                      placeholder='Type your message...'
                      id='messageInput'
                      onChange={(e) => setMessageInput(e.target.value)}
                      value={messageInput || ""}
                    />
                    <button
                      className='btn btn-primary submit-msg'
                      type='button'
                      onClick={handleSendMessage}
                    >
                      <i className='fas fa-paper-plane'></i>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
