import React, { useState, useEffect, useRef } from 'react';
import MessageBox from './MessageBox';

const Chat = ({ currentUserId }) => {
  const [targetUserId, setTargetUserId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState('');
  const [pendingRequest, setPendingRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectedUser, setConnectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const wsRef = useRef(null);
  const isWebSocketInitialized = useRef(false);

  useEffect(() => {
    let retryTimeout;

    const initializeWebSocket = () => {
      if (isWebSocketInitialized.current) {
        console.log('WebSocket already initialized.');
        return;
      }
      const ws = new WebSocket(`ws://localhost:8000/ws/connection/?user_id=${currentUserId}`);
      wsRef.current = ws;
      isWebSocketInitialized.current = true;


      ws.onopen = () => {
        console.log('WebSocket Connected',);
        setError('');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.onclose = () => {
        console.error('WebSocket Disconnected');
        setError('WebSocket Disconnected. Retrying...');
        setConnectionStatus('disconnected');
        setConnectedUser(null);
        isWebSocketInitialized.current = false;
        retryTimeout = setTimeout(initializeWebSocket, 3000); // Retry after 3 seconds
      };
    };

    initializeWebSocket();

    return () => {
      clearTimeout(retryTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentUserId]);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'connection_request':
        setPendingRequest({
          userId: data.user_id,
          username: data.username,
        });
        break;

      case 'connection_established':
        setConnectionStatus('connected');
        setConnectedUser(data.user_id); // Set the connected user's ID
        setError('');
        break;

      case 'connection_failed':
        setConnectionStatus('disconnected');
        setError('Connection failed: ' + data.message);
        break;

      case 'connection_rejected':
        setConnectionStatus('disconnected');
        setError('Connection was rejected by the other user.');
        break;

      case 'message':
          console.log('Received message:', data);

          // Check if the message is from the current user
          const isFromSelf = data.message.startsWith(`${currentUserId}:`);
          if (!isFromSelf) {
              setMessages((prevMessages) => [
                  ...prevMessages,
                  { content: data.message, sender: 'other' }
              ]);
          }
          console.log(messages);
          break;

      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const requestConnection = () => {
    if (!targetUserId) {
      setError('Please enter a user ID');
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        type: 'connection_request',
        target_user_id: targetUserId,
      })
    );
    setConnectionStatus('pending');
  };

  const handleConnectionResponse = (accepted) => {
    if (!pendingRequest) return;

    wsRef.current.send(
      JSON.stringify({
        type: 'connection_response',
        requesting_user_id: pendingRequest.userId,
        accepted,
      })
    );

    setPendingRequest(null);
  };

  const handleInputChange = (e) => {
    setTargetUserId(e.target.value);
  };

  const handleSendMessage = (message) => {
    if (!message.trim()) return; // Ignore empty messages

    // Add the sent message to the state
    setMessages((prevMessages) => [
        ...prevMessages,
        { content: `Me:    ${message}`, sender: 'me' }
    ]);

    // Send the message over WebSocket
    wsRef.current.send(
        JSON.stringify({
            type: 'message',
            message: `${message}`,
        })
    );

};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      handleSendMessage(e.target.value);
      e.target.value = ''; // Clear the input field after sending
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <div className="container mx-auto p-4">
        <div className="header">
          <h3 className="text-center font-bold text-lg">Your User ID: {currentUserId}</h3>
        </div>

        <div className="content mt-6">
          {connectionStatus === 'disconnected' && (
            <div className="form-container mb-6">
              <input
                type="text"
                value={targetUserId}
                onChange={handleInputChange}
                placeholder="Enter User ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200"
              />
              <button
                onClick={requestConnection}
                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Connect
              </button>
            </div>
          )}

          {connectionStatus === 'pending' && (
            <div className="status-message text-center">
              <p>Waiting for response...</p>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="success-message mb-4 text-center">
              <p className="text-green-500">Connected to user: {connectedUser}</p>
            </div>
          )}

          {error && (
            <div className="error-message bg-red-100 text-red-600 p-4 rounded-md mb-4">
              <p>{error}</p>
            </div>
          )}

          {pendingRequest && (
            <div className="pending-request bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md mb-4">
              <p className="text-sm">
                Connection request from <span className="font-semibold">{pendingRequest.username}</span>
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleConnectionResponse(true)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleConnectionResponse(false)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          <MessageBox
            connected={connectionStatus === 'connected'}
            onSendMessage={handleSendMessage}
            messages={messages}
            handleKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
