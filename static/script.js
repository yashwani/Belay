class SendMessage extends React.Component {

    render() {
        return(
            <div className="sendMessage border">
                <p> Some stuff here3 </p>
            </div>
        );

    }
}

class Messages extends React.Component {

    render() {
        const messages = this.props.messages.map((message, idx) => 
            <div key ={idx}>
                <p className = "author" > <b>{message[0]}</b> </p>
                <p className = "message" > {message[1]} </p>
            </div>
        );

        return(
            <div className="messages border">
                {messages}
            </div>
        );

    }
}

class Chat extends React.Component{

    render(){
        return(
            <div className = "chat border">
                <Messages messages={this.props.messages}/>
                <SendMessage/>
            </div>
        )

    }
}

class Channels extends React.Component{

    render(){
        const chats = this.props.channelNames.map((e,idx) =>
            <div className="chatName" key = {idx} >
            <p> {e}</p>
            </div>
        );

        return(
            <div className="chatList border">
                {chats}
            </div>
        )

    }
}

class Belay extends React.Component{
    constructor(props) {
        super(props);
        this.fetchChannels = this.fetchChannels.bind(this);
        this.state = {
            channelNames: [],
            channelIds: [],
            currentChat: 1,
            messages: [] //messages to be displayed on a certain page
        }

        this.fetchChannels();
        this.fetchMessages();
    }


    async fetchChannels(){
        const response = await fetch("http://127.0.0.1:5002/api/chats",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        const data = await response.json();
        const channelNames = []
        const channelIds = []
        for (const chatId in data) {
            channelIds.push(chatId)
            channelNames.push(data[chatId])

        }
        this.setState({ channelNames: channelNames });
        this.setState({ channelIds: channelIds });
        
    }

    async fetchMessages(){
        const response = await fetch("http://127.0.0.1:5002/api/messages",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'testauthkey',
                    'Channel': 1
                }
            }
        );
        const data = await response.json();
        this.setState({ messages: data });
    }


    



    render(){
        return(
            <div className = "outerContainer">
                <Channels channelNames={this.state.channelNames} channelIds = {this.state.channelIds} fetchChannels={this.fetchChannels}/>
                <Chat messages={this.state.messages}/>
            </div>
        )
    }
}



//====================================================================
  ReactDOM.render(
    React.createElement(Belay),
    document.getElementById('root')
  );