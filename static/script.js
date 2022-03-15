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
    constructor(props){
        super(props);
        this.props.fetchMessages();
        this.state = {
            currChannel: this.props.currChannel
        }
    }
    

    render() {
        const currChannel = this.props.currChannel;
        const messages = this.props.messages.map((message, idx) => 
            <div key ={idx} smething={currChannel}>
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
                <Messages 
                    messages={this.props.messages}
                    fetchMessages={this.props.fetchMessages}
                    currentChannel={this.props.currentChannel}
                />
                <SendMessage/>
            </div>
        )

    }
}

class Channels extends React.Component{

    render(){
        const chats = this.props.channelNames.map((e,idx) => 
            {
                if (idx == this.props.currentChannel)
                    return (
                        <div className="chatName" key = {idx} >
                                <p> <b>{e}</b></p>
                        </div>
                    ) 
                else return (
                    <div className="chatName" key = {idx} >
                        <button onClick={() => this.props.switchChannel(idx)}>
                            <p> {e}</p>
                        </button>
                    </div>
                )          
            }
 
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
        this.switchChannel = this.switchChannel.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.state = {
            channelNames: [],
            channelIds: [],
            currentChannel: 0,
            messages: [] //messages to be displayed on a certain page
        }

        this.fetchChannels();
        // this.fetchMessages();
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
        console.log('fetching messages')
        const response = await fetch("http://127.0.0.1:5002/api/messages",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'testauthkey',
                    'Channel': this.state.currentChannel
                }
            }
        );
        const data = await response.json();
        this.setState({ messages: data });
    }

    switchChannel(channel){

        this.setState({currentChannel: channel}, 
            () => {this.fetchMessages();} //because setting state is async
        )
        
        
    }


    



    render(){
        return(
            <div className = "outerContainer">
                <Channels 
                    channelNames={this.state.channelNames} 
                    channelIds = {this.state.channelIds} 
                    fetchChannels={this.fetchChannels}
                    currentChannel={this.state.currentChannel}
                    switchChannel={this.switchChannel}
                />
                <Chat 
                    messages={this.state.messages}
                    fetchMessages={this.fetchMessages}
                    currentChannel={this.state.currentChannel}
                />
            </div>
        )
    }
}



//====================================================================
  ReactDOM.render(
    React.createElement(Belay),
    document.getElementById('root')
  );