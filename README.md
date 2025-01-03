# **Anonymous Chat App**

## **Introduction**
Welcome to the **Anonymous Chat App**, a project designed for **completely private and anonymous communication**. 

No personal information is required, and messages are **not stored anywhere**, ensuring your conversations remain private.

---

## **Features**
**🕵️‍♂️ Complete Anonymity**

- Users don’t need to provide any personal information.

- Unique four-digit user ID generated for each session.

**🔒 Privacy First**

- Messages are not stored anywhere—ensuring secure and transient communication.

**🔗 User Search and Connection**

- Connect with specific users by entering their unique four-digit user ID.

- Real-time connection requests and notifications.

**🎨 Light and Dark Modes**

- Toggle between light and dark themes for a personalized user experience.

**🚀 Planned Features (To-Do)**

- Random User Match: A feature to connect with a random user when selecting the "Search Random" option.

---

## **Installation & Usage**

### **Prerequisites**
Ensure you have the following installed:
- **Python 3.9+**
- **Node.js**
- **Django Channels**
- **Redis** (for WebSocket communication)

### **Setup Instructions**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/sumit-subedi/chatapp.git
   cd chatapp
   ```

2. **Backend Setup:**
   - Navigate to the `backend` folder.
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Start the Redis server:
     ```bash
     redis-server
     ```
   - Run Django migrations:
     ```bash
     python manage.py migrate
     ```
   - Start the Django development server:
     ```bash
     python manage.py runserver
     ```

3. **Frontend Setup:**
   - Navigate to the `frontend` folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **Access the App:**
   - Open your browser and go to `http://127.0.0.1:3000`.

---

## **How It Works**
1. **Logging In**

- Upon opening the app, you’re automatically assigned a four-digit unique user ID.

- Share this ID with others to connect.

2. **Connecting with a User**

- Enter the target user’s four-digit user ID in the input field.

- Click the "Connect" button to send a connection request.

- Wait for the target user to accept or reject the connection.

3. **Chatting**

- Once connected, exchange messages in real-time.

- Disconnect anytime to end the chat.

---

## **License**
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## **Contributions**
We welcome contributions! Feel free to submit issues or pull requests.

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Commit your changes and push to your fork.

4. Open a pull request.

---

## **Contact**
Feel free to reach out for any queries or suggestions:

- Email: vanje.sumit@gmail.com

- GitHub: sumit-subedi

Enjoy chatting anonymously! 😊
