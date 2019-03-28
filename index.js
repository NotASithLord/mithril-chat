'use strict';

/////////////////Utilities
function toggleMenu() {
  const hamburger = document.getElementById("hamb");
    if (hamburger.style.display === "none") {
    hamburger.style.display = "block";
  } else {
    hamburger.style.display = "none";
  }
}

function updateScroll(chat){
    chat.scrollTop = chat.scrollHeight;
}

function getTime(){
  const date = new Date();
  return date.getHours() + ":" + date.getMinutes();
}

//Useful log wrapper?
// const p = (...args) => (console.log(...args), args[0])


/////////////////Mock backend input
let incomingMessages = [
  {content: "Hey, what's up", sender: "Alberto", img: "assets/ferrari.jpg"},{content: "hellooooo", sender: "Ariel", img: "assets/random.jpeg"},{content: "Hey there", sender: "john", img: "assets/random2.jpeg"}, {content: "Hey trrrrhere", sender: "john", img: "assets/random2.jpeg"}, {content: "Hey jhvjuoyf there", sender: "john", img: "assets/random2.jpeg"}, {content: "Hey bbg there", sender: "john", img: "assets/random2.jpeg"}, {content: "Whassupbhv dude", sender: "kelly", img: "assets/random3.jpeg"}, {content: "chill buyvitvf dudet", sender: "john", img: "assets/random2.jpeg"}, {content: "das great", sender: "kelly", img: "assets/random3.jpeg"}, {content: "wasabi bvjfti", sender: "jacktheknife", img: "assets/random4.jpeg"}, {content: "chill dudet", sender: "john", img: "assets/random2.jpeg"}, {content: "das great", sender: "kelly", img: "assets/random3.jpeg"}, {content: "wasabi", sender: "jacktheknife", img: "assets/random4.jpeg"},{content: "Hey, what's up", sender: "Alberto", img: "assets/random5.jpeg"},{content: "Hey there", sender: "john", img: "assets/random3.jpeg"}, {content: "Hey there", sender: "john", img: "assets/random3.jpeg"}, {content: "Hey there", sender: "john", img: "assets/random3.jpeg"}, {content: "Hey there", sender: "john", img: "assets/random3.jpeg"}, {content: "Whassup dude", sender: "kelly", img: "assets/random3.jpeg"}, {content: "chill dudet", sender: "john", img: "assets/random3.jpeg"}, {content: "das great", sender: "kelly", img: "assets/random3.jpeg"}, {content: "wasabi", sender: "jacktheknife", img: "assets/random4.jpeg"}, {content: "chill dudet", sender: "john", img: "assets/random3.jpeg"}, {content: "das great", sender: "kelly", img: "assets/random3.jpeg"}, {content: "wasabi", sender: "jacktheknife", img: "assets/random4.jpeg"}
]
const conversations = [];
// {
//   'sender': string,
//   'messageQueue': []
// }

setInterval(function(){
  if (incomingMessages[0] != undefined){
    const time = getTime();
    const sender = incomingMessages[0].sender;
    const content = incomingMessages[0].content;
    const messageData = {"sender": sender, "content": content, "time": time, "read": false, "img": incomingMessages[0].img};
    // console.log(messageData);
    //check if there's already a chat for sender, if not add to conversations array (then queue)
    if (!conversations[0] || !conversations.find((convo) => {return convo.sender === sender})) {

      const newConvo = {"sender": sender, "img": incomingMessages[0].img, "messageQueue": [messageData]}
      conversations.push(newConvo);
      // console.log(newConvo);
    } else {
      conversations.find(convo => {return convo.sender === sender}).messageQueue.push(messageData);
    }
    //remove latest, already processed message from incoming
    incomingMessages = incomingMessages.slice(1, incomingMessages.length);

    m.redraw();
    const scrollElement = document.getElementById("chatbox");
    const scrollElementOne = document.getElementById("chatsPane");
    updateScroll(scrollElement);
    // updateScroll(scrollElementOne);
  }
},  3000);
/////////////////End mock backend

function submitInput(){
  const userInput = document.getElementById('userInput').value;
  if (userInput != 0){
        const currentConvo = conversations.find((convo) => {
        return convo.sender === m.route.param('conversation')
       });
        //make sender name and img dynamic
        const messageData = {"sender": "you", "content": userInput, "time": getTime(), "read": true, "img": "assets/ferrari.jpg"};
        // console.log(messageData);
        currentConvo.messageQueue.push(messageData);
        // console.log(currentConvo.messageQueue);
        document.getElementById('userInput').value = "";
        m.redraw();
        const scrollElement = document.getElementById("chatbox");
        updateScroll(scrollElement);
  }
}

function messagesVnodeArray(convo){
  const vnodes = [];
  convo.messageQueue.forEach((message) => {
    // console.log(message);
    vnodes.push(
     m('div.msgWrapper', [m('div.msg',{class:message.sender},[
       m('div.msgHeader', [
         m('img', {src: message.img}),
         m('p', message.sender),
         m('p.time', message.time)]),
       m('div.msgContent', [
         m('p', message.content)]),
       ])
     ])
    );
    message.read = true;
  })
  //Because we're updating the state of 'read', we need to redraw to update UI
  return vnodes;
}

function chatsPaneVnodeArray(conversations){
  const vnodes = [];
  conversations.forEach((convo) => {
    const msgPreview = convo.messageQueue[convo.messageQueue.length - 1].content;
    //ForEach is blocking
    let unread = 0;
    convo.messageQueue.forEach((message) => {
      if (message.read === false) {
        unread++;
      }
    });

    vnodes.push(
      m('div.convoWrapper', [
        m('div.previousSenders',{onclick:"function hi(){console.log('hi')}"},[
          m('a',{href: `#!/${convo.sender}`}, [
            m('img',{src:`${convo.img}`}),
            m('h2', convo.sender),
            m('span.previewWrap',[
              m('p', msgPreview)]),
            m('span.unread', unread)
          ])
        ])
      ])
    )
  })
  return vnodes;
}

const HomeComp = {
  view: () => {
    return m('h3.welcomeMsg', "Please select a conversation to get started");
  }
}

const ChatboxComp = {
  view: () => { return messagesVnodeArray(conversations.find(convo => convo.sender === m.route.param('conversation'))) },
  onupdate: () => {
    const scrollElement = document.getElementById("chatbox");
    updateScroll(scrollElement);
    console.log("chatbox update");
  }
}

const ConvosComp = {
  view: () => {
    return chatsPaneVnodeArray(conversations);
  },
  onupdate: () => {
    //This seems bad, perhaps like an infinite loop basically
    console.log("updating conversations");
    // m.redraw();
  }
}

const SenderNavComp = {
  view: () => {
    return m('h2', m.route.param('conversation'));
  }
}

//NOTE:Not as fast as jquery onload, since it waits for external assets not just DOM. Find suitable vanilla replacement
//Only include UI interactivity within here, all other logic can start loading before DOM is ready
window.onload = () => {
// console.log("hello");
  const chatbox = document.getElementById('chatbox');
  m.route(chatbox, "/", {
    "/": HomeComp,
    "/:conversation": {render: () => m(ChatboxComp)}
  })

  const chatsPane = document.getElementById('chatsPane');
  m.mount(chatsPane, ConvosComp);

  const senderNav = document.getElementById('senderNav');
  m.mount(senderNav, SenderNavComp);

};

// NOTE: Example helper function for returning multiple dynamic classes as one var
// const classesForItem = item => {
//   const classes = []
//   if (item === mySelectedItem) classes.push('selected')
//   if (item.foo) classes.push('with-foo')
//   return classes.join(' ')
// }