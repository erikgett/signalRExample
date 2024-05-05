// Chat.tsx
import { useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

interface Message {
    user: string;
    message: string;
}

export default function App() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState({ user: '', message: '' });

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("https://localhost:7207/chatHub") // Обновите порт под ваши настройки
            .withAutomaticReconnect()
            .build();

        setConnection(connect);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.on('ReceiveMessage', (user: string, message: string) => {
                        setMessages(messages => [...messages, { user, message }]);
                    });
                })
                .catch((err: any) => console.error('Connection failed: ', err));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection && connection.state === "Connected") {
            try {
                await connection.send('SendMessage', input.user, input.message);
            } catch (e) {
                console.error('Sending message failed.', e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    return (
        <div>
            <input
                value={input.user}
                onChange={e => setInput({ ...input, user: e.target.value })}
                type="text"
                placeholder="User"
            />
            <input
                value={input.message}
                onChange={e => setInput({ ...input, message: e.target.value })}
                type="text"
                placeholder="Message"
            />
            <button onClick={sendMessage}>Send</button>

            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.user}: {msg.message}</li>
                ))}
            </ul>
        </div>
    );
}
