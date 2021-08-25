"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const filePath = _path.default.resolve(__dirname, '../files/messagesLog.txt');

class Message {
  contructor() {
    this.messages = [];
  }

  async getMessages() {
    try {
      const txtFile = JSON.parse(await _promises.default.readFile(filePath, 'utf-8'));
      this.messages = txtFile;
      return this.messages;
    } catch (error) {
      console.log(error);
    }
  }

  async newMessage(email, date, time, message) {
    this.messages.push({
      email,
      date,
      time,
      message
    });
    await _promises.default.writeFile(filePath, JSON.stringify(this.messages, null, 2));
    return this.messages;
  }

}

exports.default = Message;