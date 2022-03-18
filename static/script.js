class SendReply extends React.Component {

    render() {
        return(
            <div className="sendMessage border">
                <form>
                <label >Send a reply:</label>
                <textarea id='reply' name="comment"></textarea>
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
                <button onClick={this.props.postMessage} type="button" value="Post">Reply</button>
                </form>
            </div>
        );

    }
}


class Replies extends React.Component {

    checkIfImage(content){
        const re = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/;
        return re.test(content)
    }

    returnImageLink(content){
        const re = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/;
        return re.exec(content)[0]
    }


    render(){
        const replies = this.props.currentMessageReplies.map((reply, idx) => 
                <div key ={idx} >
                    <p className = "author" > <b>{reply[1]}</b> </p>
                    <p className = "message" > {reply[2]} </p>
                    {(this.checkIfImage(reply[2]) &&  (<img className='messageImage' src={this.returnImageLink(reply[2])}/>))}
                </div>

        )

        const original_author = this.props.messages[this.props.messageThread-1][0]
        const original_message = this.props.messages[this.props.messageThread-1][1]

        return(
            <div className="messages border">
                <button onClick={() => this.props.switchChannel(-1, true)}>back to channel</button>
                <p><b>{original_author}</b></p>
                <p>{original_message}</p>
                <hr/>
                {replies}
            </div>
        );

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

    checkIfImage(content){
        const re = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/;
        return re.test(content)
    }

    returnImageLink(content){
        const re = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/;
        return re.exec(content)[0]
    }

    render() {
        const message_replies = this.countRepliesPerMessage(this.props.replies)
        const messages = this.props.messages.map((message, idx) => 

                    <div key ={idx} >
                        <p className = "author" > <b>{message[0]}</b> </p>
                        <p className = "message" > {message[1]} </p>
                        <button value={idx} onClick={e => this.props.setMessageThread(e.target.value, true)}> {(message_replies[idx] == null ? "Reply" : message_replies[idx] + " Replies")}</button>
                        {(this.checkIfImage(message[1]) &&  (<img className='messageImage' src={this.returnImageLink(message[1])}/>))}
                    </div>
        );

        return(
            <div className="messages border">
                {this.props.smallScreen && (<button onClick={this.props.smallScreenBackToChannels}>back to channels</button>)}
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
                        messageThread = {this.props.messageThread}
                        switchChannel={this.props.switchChannel}
                    />
                    <SendReply postReply={this.props.postReply}/>
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
                        smallScreen = {this.props.smallScreen}
                        smallScreenBackToChannels = {this.props.smallScreenBackToChannels}
                    />
                    <SendMessage postMessage={this.props.postMessage}/>
                </div>
                )
        }

    }
}

class Channels extends React.Component{
    componentDidMount(){
        this.props.fetchUnread();
        this.props.fetchChannels();
    }

    render(){
        const chats = this.props.channelNames.map((e,idx) => 
            {
                if (idx == this.props.currentChannel)
                    return (
                        <div className="chatName" key = {idx} >
                                <p> <b>{e}</b></p>
                        </div>
                    ) 
                else {
                    let num_unread = 0;
                    for (const e of this.props.unreadChannels){
                        if(idx == e[0]){
                            num_unread = e[1];
                        }
                    }
                
                    return (
                        <div className="chatName" key = {idx} >
                            <button onClick={() => this.props.switchChannel(idx, true)}>
                                <p> {e}</p>
                                <p> {num_unread} </p>
                            </button>
                        </div>
                    )   
                }       
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
        this.postReply = this.postReply.bind(this);
        this.fetchUnread = this.fetchUnread.bind(this);
        this.smallScreenBackToChannels = this.smallScreenBackToChannels.bind(this);

        this.state = {
            channelNames: [],
            channelIds: [],
            currentChannel: (isNaN(window.localStorage.yashwani_channel)? 0 : window.localStorage.yashwani_channel),
            messages: [], //messages to be displayed on a certain page
            replies: [],

            isLoggedOut: true,
            isInvalidCredential: false,

            replyMode: false,
            messageThread: 0,
            currentMessageReplies: [],

            unreadChannels: [],

            //small screen state
            smallScreen: false,
            showChannels: false


        };

    

    }

    componentDidMount(){
        this.validateAuthKey()

        // this.fetchChannels();

        this.checkWidth = () => {
            const match = window.matchMedia(`(max-width: 768px)`);
            const isSmall = match.matches;
            if (this.state.smallScreen != isSmall){
                this.setState({smallScreen: isSmall});
            }
          };

        this.checkWidth();
        window.addEventListener("resize", this.checkWidth);

        this.isInvalid = false

        window.addEventListener("popstate", (newState) => {
            const inChannel = window.location.pathname.length < 7;

            if (inChannel){
                this.switchChannel(parseInt(window.location.pathname.slice(5)),false)
            } else{
                const chatNum = parseInt(window.location.pathname.slice(5,window.location.pathname.indexOf('m')))
                const messageNum = parseInt(window.location.pathname.slice(window.location.pathname.lastIndexOf('e')+1))
                this.setMessageThread(messageNum-1, false, chatNum)
            }
            
        })

        
        window.history.pushState({"page": "channel"},"", "/chat" +  this.state.currentChannel);

    }






    async fetchChannels(){
        const response = await fetch("http://127.0.0.1:5002/api/chats",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key,
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
        // console.log('fetching messages')
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
        // console.log('fetching replies')
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


    switchChannel(channel, pushHistory){
        if (channel == -1){
            channel = this.state.currentChannel;
        }

        if (this.state.smallScreen){
            this.setState({showChannels: false})
        }

        this.setState({currentChannel: channel}, 
            () => { 
                if (pushHistory){
                    window.history.pushState({"page": "channel"},"", "/chat" +  this.state.currentChannel); 
                }
            } //because setting state is async
        ) 
        
        this.setState({replyMode: false})      
    }

    postMessage(){
        fetch("http://127.0.0.1:5002/api/postMessage",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key
                },
                body: JSON.stringify({
                    'channel': this.state.currentChannel,
                    'content': document.querySelector("textarea").value
                })
            }
        );
        document.querySelector("textarea").value = ''
    }

    postReply(){
        fetch("http://127.0.0.1:5002/api/postReply",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key
                },
                body: JSON.stringify({
                    'message': this.state.messageThread,
                    'channel': this.state.currentChannel,
                    'content': document.querySelector("#reply").value
                })
            }
        );
        document.querySelector("#reply").value = ''
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
                        
                        
                    })
                    .then(() => this.setState({isLoggedOut: false}))

                }}
        )
    }

    validateAuthKey(){
        fetch("/api/validateAuthKey",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key
                }
            }
        ).then(response => {
                if (response.status == 200){
                    this.setState({isLoggedOut: false})
                }}
        )
    }

    createAccount(){
        // console.log('creating new account')
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


    setMessageThread(message_idx, pushHistory, chat = this.state.currentChannel){
        this.setState({currentChannel: chat})
        this.setState({messageThread: parseInt(message_idx)+1}, 
            () => { 

                if (pushHistory){
                    window.history.pushState({"page": "messageThread"},"", "/chat" +  chat + 'message' + this.state.messageThread); 
                }

                this.setState({replyMode: true}); 
            } //because setting state is async
        ) 

        

    }

    fetchUnread(){
        // console.log('fetching unread')
        fetch("http://127.0.0.1:5002/api/unreadMessages",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.yashwani_auth_key
                }
            }
        ).then(response => response.json())
        .then(data => this.setState({unreadChannels: data}))
        .then(setTimeout(() => {this.fetchUnread()}, 5000))
    }

    smallScreenBackToChannels(){
        this.setState({showChannels: true})
    }



    render(){

        if (this.state.isLoggedOut){
            window.history.pushState("","", "/login"); 
            return (
                <LoginPage 
                    attemptLogin={this.attemptLogin}
                    isInvalidCredential={this.state.isInvalidCredential}
                    createAccount={this.createAccount}
                />
            )
        } else{
            return(
                <div className = "outerContainer">
                    {(!this.state.smallScreen || this.state.showChannels) && 
                    (<Channels 
                        channelNames={this.state.channelNames} 
                        channelIds = {this.state.channelIds} 
                        fetchChannels={this.fetchChannels}
                        currentChannel={this.state.currentChannel}
                        switchChannel={this.switchChannel}
                        unreadChannels={this.state.unreadChannels}
                        fetchUnread = {this.fetchUnread}
                        
                    />)}
                    {(!this.state.smallScreen || !this.state.showChannels) && 
                    (<Chat 
                        messages={this.state.messages}
                        fetchMessages={this.fetchMessages}
                        replies={this.state.replies}
                        fetchReplies={this.fetchReplies}
                        currentChannel={this.state.currentChannel}
                        switchChannel={this.switchChannel}
                        postMessage = {this.postMessage}
                        setMessageThread = {this.setMessageThread}
                        messageThread = {this.state.messageThread}
                        replyMode = {this.state.replyMode}
                        currentMessageReplies = {this.state.currentMessageReplies}
                        postReply = {this.postReply}
                        smallScreen = {this.state.smallScreen}
                        smallScreenBackToChannels = {this.smallScreenBackToChannels}
                    />)}
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