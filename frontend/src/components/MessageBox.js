const MessageBox = ({ connected, messages, handleKeyPress }) => {
    return (
      <div className="message-box mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md">
        <div className="message-box-header mb-4">
          {connected ? (
            <p className="text-green-500 text-center">Connected to user</p>
          ) : (
            <p className="text-gray-500 text-center">Not connected to another user</p>
          )}
        </div>
  
        <div className="messages space-y-4 max-h-96 overflow-y-scroll bg-white dark:bg-gray-700 p-4 rounded-md shadow-md">
    {messages.length > 0 ? (
        messages.map((msg, index) => (
            <div
                key={index}
                className={`p-3 rounded-lg max-w-xs break-words ${
                    msg.sender === 'me'
                        ? 'bg-blue-500 text-white self-end ml-auto'
                        : 'bg-gray-200 text-gray-800 self-start'
                }`}
                style={{
                    borderRadius: '15px',
                    margin: '5px',
                    padding: '10px',
                    maxWidth: '70%',
                    alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                }}
            >
                {msg.content}
            </div>
        ))
    ) : (
        <p className="text-center text-gray-500">No messages yet</p>
    )}
</div>


  
        {/* Input Section */}
        <div className="send-message mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
    );
  };

  export default MessageBox;
  