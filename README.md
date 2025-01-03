# **Anonymous Chat App**

## **Introduction**
Welcome to the **Anonymous Chat App**, a project designed for **completely private and anonymous communication**. 

No personal information is required, and messages are **not stored anywhere**, ensuring your conversations remain private.

---

## **Features**
- **🕵️‍♂️ Complete Anonymity**: No need for usernames or passwords.
- **Unique User IDs**: Each login generates a **random 4-digit user ID** for connecting with others.
- **No Message Storage**: Messages are not stored on the server, ensuring complete privacy.
- **Direct Connections**: Chat directly with another user by entering their unique ID.
- **Dark Mode Support**: Choose between light and dark themes for a comfortable user experience.

### **Upcoming Features (TODO)**
- **Random User Matching**: Connect with a random user by clicking "Search Random."

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
   git clone https://github.com/your-username/anonymous-chat-app.git
   cd anonymous-chat-app
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
   - Open your browser and go to `http://127.0.0.1:8000`.

---

## **How It Works**
1. **Get Your Unique ID**: Upon logging in, you'll receive a unique 4-digit ID.
2. **Connect with Others**: Enter another user's ID to start chatting.
3. **Private Messaging**: All messages are exchanged in real-time with no server storage.

---

## **License**
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## **Contributions**
We welcome contributions! Feel free to submit issues or pull requests.

---

## **Contact**
For any questions or suggestions, please contact the repository owner.
