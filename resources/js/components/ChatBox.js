import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

class ChatBox extends Component{

    componentDidMount() {

        // Utilizamos la librería pusher para realizar la conexión con el websocket de laravel.
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: 'A4VU48A8',
            wsHost: window.location.hostname,
            wsPort: 6001,
            disableStats: true,
            forceTLS: false
        });

        // Estaremos escuchando el evento "NewChatMessage" en el canal llamado "chat" (ambos definidos en laravel).
        window.Echo.channel('chat').listen('NewChatMessage', (e) => {

            // Creamos la línea del mensaje del chat cuando se encuentre algún cambio.
            if (document.getElementById('chat')) {
                var author    = document.createElement('span');
                var message   = document.createElement('span');
                var paragraph = document.createElement('p');
                var dateSpan  = document.createElement('span');
                var sendedDate = new Date();

                var sendedDateFormatted = 'Enviado a las ' + sendedDate.getHours() + ':';
                if(sendedDate.getMinutes() < 10){
                    sendedDateFormatted += '0' + sendedDate.getMinutes();
                } else {
                    sendedDateFormatted += sendedDate.getMinutes();
                }

                author.appendChild(document.createTextNode(e.author+': '))
                message.appendChild(document.createTextNode(e.message));
                dateSpan.appendChild(document.createTextNode(sendedDateFormatted));

                paragraph.appendChild(author)
                paragraph.appendChild(message);
                paragraph.appendChild(dateSpan);

                author.setAttribute('class', 'font-weight-bold');
                paragraph.setAttribute('class', 'text-left');
                dateSpan.setAttribute('class','sended-date');

                document.getElementById('chat').appendChild(paragraph);

                // Cuando se llena el div de los mensajes moveremos el scroll hasta el último mensaje automáticamente.
                const chat = document.getElementById('chat');
                var shouldScroll = chat.scrollTop + chat.clientHeight === chat.scrollHeight;
                if (!shouldScroll) {
                    chat.scrollTop = chat.scrollHeight;
                }
            }
        });
    }

    render(){
        return (
            <p className="text-left text-secondary">Bienvenido a la sala de chat.</p>
        );
    }
}

export default ChatBox;

if (document.getElementById('chat')) {
    ReactDOM.render(<ChatBox />, document.getElementById('chat'));
}
