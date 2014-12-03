chatStream = new Meteor.Stream('chat');
chatCollection = new Meteor.Collection(null);

/*headers = {
    list: {},
    get: function(header, callback) {
        return header ? this.list[header] : this.list;
    }
}

Meteor.call('getReqHeaders', function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        headers.list = result;
    }
});

console.log(headers);*/

chatStream.on('chat', function (message) {
    chatCollection.insert({
        userId: this.userId,
        subscriptionId: this.subscriptionId,
        message: message
    });
});

Template.chatBox.helpers({
    "messages": function () {
        return chatCollection.find();
    }
});


var subscribedUsers = {};

Template.chatMessage.helpers({
    "user": function () {
        if (this.userId == 'me') {
            return "me";
        } else if (this.userId) {
            var username = Session.get('user-' + this.userId);
            if (username) {
                return username;
            } else {
                getUsername(this.userId);
            }
        } else {
            return this.subscriptionId;
        }
    }
});

Template.chatBox.events({
    "click #send": function () {
        sendMessage();
    },

    "keyup textarea": function (evt, template) {

        if (evt.which === 13) {
            if (evt.ctrlKey) {
                addEmptyLine();
            } else {
                sendMessage();
                return false;
            }
        }

        return true;
    }
});

function sendMessage() {
    var message = $('#chat-message').val();

    if(message) {
        chatCollection.insert({
            userId: 'me',
            message: message
        });
        chatStream.emit('chat', message);
    }

    $('#chat-message').val('');

    var wtf    = $('#messages');
    var height = wtf[0].scrollHeight;
    wtf.scrollTop(height);
}

function addEmptyLine() {
    $('#chat-message').val($('#chat-message').val() + "\n");
}

function getUsername(id) {
    Meteor.subscribe('user-info', id);
    Deps.autorun(function () {
        var user = Meteor.users.findOne(id);
        if (user) {
            Session.set('user-' + id, user.username);
        }
    });
}
