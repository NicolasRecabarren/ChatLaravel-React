import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlParser from 'react-html-parser';
import Axios from 'axios';

// Función que valida el formulario antes de intentar publicar el mensaje en el chat.
const validateForm = (componentFormInState) => {
    const errors = {};
    if(componentFormInState.message.trim() == "" ){
        errors.message = true;
    }
    if(componentFormInState.author.trim() == "" ){
        errors.author = true;
    }
    return errors;
};

class ChatForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            form: { // Aquí guardaremos los valores de que se vayan ingresando en los campos de nickname y mensaje.
                author: '',
                message: ''
            },
            formErrors: { // Aquí guardaremos los mensajes de error correspondientes en caso de que no pasen la validación del formulario.
                author: false,
                message: false
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    // Guardamos en el estado los valores que se vayan ingresando en los campos del formulario de chat.
    handleChange(e){
        this.setState({
            form: {
                ...this.state.form, // Esto es para no reemplazar los valores anteriores de los otros elementos en el estado.
                [e.target.name]: e.target.value
            }
        });
    }

    // Enviamos el mensaje al servidor para que Laravel dispare el evento que refrescará nuestra información en el socket.
    async handleSubmit(e){
        e.preventDefault();

        const validationResult = validateForm(this.state.form);
        if( Object.keys(validationResult).length > 0){
            return this.setState({formErrors: validationResult});
        } else {
            this.setState({formErrors: {author: false,message: false}});
        }

        const response = await axios.post('/api/messages', JSON.stringify(this.state.form),{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => { })
            .then(() => {
                this.setState({
                    form: {
                        ...this.state.form, // Esto es para no reemplazar los valores anteriores de los otros elementos en el estado.
                        message: ''
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render(){
        return (
            <form id="ChatMessageForm" noValidate>
                <div className="form-inline">
                    <label className="control-label">Chatear como: </label>
                    <input name="author" type="text" className="form-control" placeholder="Ingrese su nickname..." onChange={this.handleChange}></input>
                    {this.state.formErrors.author ? ReactHtmlParser('<br /><div class="text-danger text-left">Debe ingresar su nickname antes de publicar un mensaje.</div>') : ''}
                </div>
                <div className="form-row mt-2">
                    <div className="col-md-12">
                        <textarea name="message" id="" cols="30" rows="2" className="form-control" placeholder="Ingrese aquí su mensaje..." onChange={this.handleChange} value={this.state.form.message}></textarea>
                        {this.state.formErrors.message ? ReactHtmlParser('<div class="text-danger text-left">Debe ingresar su mensaje.</div>') : ''}
                    </div>
                </div>
                <button type="button" className="btn btn-success btn-block mt-1" onClick={this.handleSubmit}>Enviar</button>
            </form>
        );
    }
}

export default ChatForm;

if (document.getElementById('chat-form')) {
    ReactDOM.render(<ChatForm />, document.getElementById('chat-form'));
}