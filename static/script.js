class SendReply extends React.Component {

    render() {
        return(
            <div className="sendMessage border">
                <form>
                <label >What do you have to say?</label>
                <textarea name="comment"></textarea>
                <button onClick={this.props.postReply} type="button" value="Post">Post</button>
                </form>
            </div>
        );
    }
}

class SendMessage extends React.Component {

    render() {
        return(
            <div className="sendMessage border">
                <form>
                <label >What do you have to say?</label>
                <textarea name="comment"></textarea>
                <button onClick={this.props.postMessage} type="button" value="Post">Post</button>
                </form>
            </div>
        );

    }
}


class Replies extends React.Component {
    render(){
        const replies = this.props.currentMessageReplies.map((reply, idx) => 
            <div key ={idx} >
                <p className = "author" > <b>{reply[1]}</b> </p>
                <p className = "message" > {reply[2]} </p>
            </div>
        )

        if(this.props.currentMessageReplies.length != 0){
            const original_author = this.props.messages[this.props.currentMessageReplies[0][0]-1][0]
            const original_message = this.props.messages[this.props.currentMessageReplies[0][0]-1][1]
            return(
                <div className="messages border">
                    <p><b>{original_author}</b></p>
                    <p>{original_message}</p>
                    <hr/>
                    {replies}
                </div>
            );

        } else{
            return (
                <div className="messages border">
                    {replies}
                </div>

            )
        }
    }
}

class Messages extends React.Component {

    componentDidMount(){
        this.props.fetchMessages();
        this.props.fetchReplies();
        
    }

    countRepliesPerMessage(replies){
        const mr = {}
        for (const a of replies) {mr[a[0]-1] = mr[a[0]-1]==null ? 1 : mr[a[0]-1] + 1}
        return mr
    }

    render() {
        const message_replies = this.countRepliesPerMessage(this.props.replies)
        const messages = this.props.messages.map((message, idx) => 
            {if (message_replies[idx] == null){
                return (
                    <div key ={idx} >
                        <p className = "author" > <b>{message[0]}</b> </p>
                        <p className = "message" > {message[1]} </p>
                    </div>
                )
            } else{
                return (
                    <div key ={idx} >
                        <p className = "author" > <b>{message[0]}</b> </p>
                        <p className = "message" > {message[1]} </p>
                        <button value={idx} onClick={e => this.props.setMessageThread(e.target.value)}> {message_replies[idx] + " Replies"}</button>
                    </div>
                )
            }}
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
        {if (this.props.replyMode){
            return (
                <div className = "chat border">
                    <Replies 
                        currentMessageReplies = {this.props.currentMessageReplies}
                        messages = {this.props.messages}
                    />
                    <SendMessage postMessage={this.props.postMessage}/>
                </div>
            )
        } else
            return(
                <div className = "chat border">
                    <Messages 
                        messages={this.props.messages}
                        fetchMessages={this.props.fetchMessages}
                        fetchReplies={this.props.fetchReplies}
                        currentChannel={this.props.currentChannel}
                        replies={this.props.replies}
                        setMessageThread = {this.props.setMessageThread}
                    />
                    <SendMessage postMessage={this.props.postMessage}/>
                </div>
                )
        }

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


class LoginPage extends React.Component{

    render(){
        return(
            <div>
                <div className="createAccount">
                <h2>Create an account!</h2>
                <p>Enter a username</p>
                <input id="createAccountUsername"></input>

                <p>Enter a password</p>
                <input id="createAccountPassword"></input>

                <button onClick={this.props.createAccount}>Create Account</button>
                {/* <p id="acctCreated"> Account created</p> */}

                </div>

                
                <div className="login">
                <h2>Log in to Watch Party!</h2>
                <p>Enter your username</p>
                <input id="loginUsername"></input>

                <p>Enter your password</p>
                <input id="loginPassword"></input>
                <button onClick={this.props.attemptLogin}>Log in</button>
                {this.props.isInvalidCredential 
                    ? <p> Invalid Credentials. </p>
                    : <p></p>
                }
                </div>
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
        this.postMessage = this.postMessage.bind(this);
        this.attemptLogin = this.attemptLogin.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.fetchReplies = this.fetchReplies.bind(this);
        this.setMessageThread = this.setMessageThread.bind(this);

        this.state = {
            channelNames: [],
            channelIds: [],
            currentChannel: 0,
            messages: [], //messages to be displayed on a certain page
            replies: [],

            isLoggedOut: false,
            isInvalidCredential: false,

            replyMode: false,
            currentMessage: 0,
            currentMessageReplies: []

        };

    

    }

    componentDidMount(){
        this.fetchChannels();
        

        this.isInvalid = false
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
    

    fetchMessages(){
        console.log('fetching messages')
        fetch("http://127.0.0.1:5002/api/messages",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key,
                    'Channel': this.state.currentChannel
                }
            }
        ).then(response => response.json())
        .then(data => this.setState({messages: data}))
        .then(setTimeout(() => {this.fetchMessages()}, 1000))
    }

    fetchReplies(){
        console.log('fetching replies')
        fetch("http://127.0.0.1:5002/api/replies",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key,
                    'Channel': this.state.currentChannel
                }
            }
        ).then(response => response.json())
        .then(data => this.setState({replies: data}))
        .then(() => {
            const currentMessageReplies = []
            this.state.replies.map((reply, idx) =>        
            {
                if(this.state.messageThread == reply[0]){
                    currentMessageReplies.push(reply)      
                } 
            }
            )
            this.setState({currentMessageReplies: currentMessageReplies})
        })
        .then(setTimeout(() => {this.fetchReplies()}, 1000))
    }


    switchChannel(channel){
        this.setState({currentChannel: channel}, 
            () => { history.pushState("","", window.location.origin + "/chat" + '/' +  this.state.currentChannel); } //because setting state is async
        )       
    }

    postMessage(){
        fetch("http://127.0.0.1:5002/api/postMessage",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'channel': this.state.currentChannel,
                    'authkey': window.localStorage.yashwani_auth_key,
                    'content': document.querySelector("textarea").value
                })
            }
        );
        document.querySelector("textarea").value = ''
    }

    attemptLogin(){
        const username = document.querySelector('#loginUsername').value;
        const password = document.querySelector('#loginPassword').value;
        document.querySelector('#loginUsername').value = ''
        document.querySelector('#loginPassword').value = ''
        

        fetch("http://127.0.0.1:5002/api/attemptLogin",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Username': username,
                    'Password': password
                }
            }
        ).then(response => {
                if (response.status == 403){
                    this.setState({isInvalidCredential: true})
                } else{
                    response.json()
                    .then(data => {
                        window.localStorage.setItem('yashwani_auth_key',data);
                        this.setState({isLoggedOut: false});
                    })
                }}
        )
    }

    createAccount(){
        console.log('creating new account')
        const username = document.querySelector('#createAccountUsername').value;
        const password = document.querySelector('#createAccountPassword').value;

        fetch("http://127.0.0.1:5002/api/createAccount",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            }
        )

    }


    setMessageThread(message_idx){
        // this.setState({messageThread: parseInt(message_idx)+1})
        // this.setState({replyMode: true})

        this.setState({messageThread: parseInt(message_idx)+1}, 
            () => { this.setState({replyMode: true}); } //because setting state is async
        ) 

        // console.log(this.state.messages)
        // console.log(this.state.messageThread)
    }

    // logReplies(message_idx){
    //     this.setState({replyMode: true})

    //     message_idx = parseInt(message_idx)

    //     const currentMessageReplies = []
    //     this.state.replies.map((reply, idx) =>        
    //         {
    //             if(message_idx+1 == reply[0]){
    //                 currentMessageReplies.push(reply)      
    //             }      
    //         }
    //     )

    //     console.log(replies)
    //     this.setState({replies: replies})
    // }




    render(){

        if (this.state.isLoggedOut){
            return (
                <LoginPage 
                    attemptLogin={this.attemptLogin}
                    isInvalidCredential={this.state.isInvalidCredential}
                    createAccount={this.createAccount}
                />
            )
        } else{
            history.pushState("","", window.location.origin + "/chat" + '/' +  this.state.currentChannel); 
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
                        replies={this.state.replies}
                        fetchReplies={this.fetchReplies}
                        currentChannel={this.state.currentChannel}
                        postMessage = {this.postMessage}
                        setMessageThread = {this.setMessageThread}
                        replyMode = {this.state.replyMode}
                        currentMessageReplies = {this.state.currentMessageReplies}
                    />
                </div>
            )
        }
    }
}



//====================================================================
  ReactDOM.render(
    React.createElement(Belay),
    document.getElementById('root')
  );