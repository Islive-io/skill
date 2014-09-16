/**
 * Chat system client side manager
 */

$(function() {
    /**
     * Constructor.
     *
     * @param $usernameInput
     * @param $textInput
     * @param $submitInput
     * @param webSocket
     * @constructor
     */
    function ChatSystemClient($usernameInput, $textInput, $submitInput, webSocket) {
        this.MIN_NAME_LENGTH    = 3;
        this.MIN_MESSAGE_LENGTH = 1;

        this.$usernameInput     = $usernameInput;
        this.$textInput         = $textInput;
        this.$submitInput       = $submitInput;
        this.webSocket          = webSocket;
    }

    ChatSystemClient.prototype.addChatLine = function(nickname, message) {
        var $newLine = $("#base-chat-line").clone();
        var $nickname = $(".chat-line-name", $newLine);
        var $message = $(".chat-line-message", $newLine);

        $newLine.removeClass("hidden");
        $nickname.text(nickname);
        $message.text(message);

        $(".chat-content").append($newLine);
    };

    /**
     * Gets the given nickname.
     * @returns {string}
     */
    ChatSystemClient.prototype.getNickname = function() {
        return this.$usernameInput.val();
    };

    /**
     * Checks whether the nickname is valid.
     * @returns {boolean}
     */
    ChatSystemClient.prototype.isNicknameValid = function() {
        return this.getNickname().length > this.MIN_NAME_LENGTH;
    };

    /**
     * Sets the input message.
     * @param message
     */
    ChatSystemClient.prototype.setMessage = function(message) {
        this.$textInput.val(message);
    };

    /**
     * Gets the given message.
     * @returns {string}
     */
    ChatSystemClient.prototype.getMessage = function() {
        return this.$textInput.val();
    };

    /**
     * Checks whether the message is valid.
     * @returns {boolean}
     */
    ChatSystemClient.prototype.isMessageValid = function() {
        return this.getMessage().length > this.MIN_MESSAGE_LENGTH;
    };

    /**
     * Updates the interface.
     * Disables elements if messages cannot be send.
     */
    ChatSystemClient.prototype.updateInterface = function() {
        this.setMessageInputEnabled(this.isNicknameValid());
        this.$submitInput.prop("disabled", !this.isMessageValid());
    };

    /**
     * Disables or enables the message input.
     * @param enabled
     */
    ChatSystemClient.prototype.setMessageInputEnabled = function(enabled) {
        this.$textInput.prop("disabled", !enabled);
        this.$submitInput.prop("disabled", !enabled);
    };

    /**
     * Sends a message to the server.
     * @param nickname
     * @param message
     */
    ChatSystemClient.prototype.sendMessage = function(nickname, message) {
        var messageData = {
            nickname: nickname,
            message: message
        };

        console.log("Send message: [" + nickname + "]: " + message);
        this.webSocket.emit("onMessage", messageData);
    };

    /**
     * Sends a message from the user interface input.
     */
    ChatSystemClient.prototype.sendMessageFromInput = function() {
        if (this.isNicknameValid() && this.isMessageValid()) {
            this.sendMessage(
                this.getNickname(),
                this.getMessage()
            );

            // Message send, clear input.
            this.setMessage("");
        }

        // Update interface, probably want to disable send button now.
        this.updateInterface();
    };

    /**
     * Registers element events.
     */
    ChatSystemClient.prototype.registerEvents = function() {
        var self = this;

        // Enable the interface when a valid nickname is given
        this.$usernameInput.on("keypress", function() {
            self.updateInterface();
        });

        // Send messages when user presses enter by triggerin the submit button
        this.$textInput.on("keypress", function(event) {
            if (event.keyCode === 13) {
                self.$submitInput.trigger("click");
            } else {
                // Might seem a bit awkward to update the interface on every keypress..
                // This is so the submit button gets enabled after typing.
                self.updateInterface();
            }
        });

        // Submit messages
        this.$submitInput.on("click", function () {
            self.sendMessageFromInput();
        });

        // Socket callback
        this.webSocket.on("onMessage", function(messageData) {
            self.addChatLine(messageData.nickname, messageData.message);
        });
    };

    /**
     * Run the chat system.
     */
    ChatSystemClient.prototype.run = function() {
        this.updateInterface();
        this.registerEvents();
    };

    // ---------------------------------------------------------------------------

    var chat = new ChatSystemClient(
        $("#username-input"),
        $("#message-input"),
        $("#submit-input"),
        io()
    );

    chat.run();
});