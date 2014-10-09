
(function(exports){

    var socket = io();

    if(typeof exports == 'undefined'){
        var exports = this['chat'] = {};
    }

    exports.chat = function(){
        $('chat').submit(function(){
            socket.emit('chat message', $('#m1').val());
            $('#m1').val('');
            return false;
        });
    };

    exports.setName = function(){
        $('username').submit(function(){
            socket.emit('set username', $('#m2').val());
            $('#m2').val('');
            return false;
        });
    };

    // TODO: set username temporary solution $( "body" ).data( "foo", 52 );

    exports.chatMessage = function(){
        socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg));
        });
    };

    exports.userMessage = function(){
        socket.on('new user', function(msg){
            $('#messages').append($('<li class="user">').text(msg));
            $('.user').prepend('<span class="fa-stack fa-lg">' +
                '<i class="fa fa-square fa-stack-2x"></i>' +
                '<i class="fa fa-terminal fa-stack-1x fa-inverse"></i>' +
                '</span>'
            );
        });
    };

})(typeof exports === 'undefined'? this['chat']={}: exports);

