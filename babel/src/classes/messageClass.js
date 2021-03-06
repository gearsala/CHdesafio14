import 'regenerator-runtime/runtime';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve(__dirname, '../files/messagesLog.txt');

export default class Message {
	contructor() {
		this.messages = [];
	}

	async getMessages() {
		try {
			const txtFile = JSON.parse( await fs.readFile(filePath, 'utf-8'));
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
			message,
		});
		await fs.writeFile(filePath, JSON.stringify(this.messages, null, 2));
		return this.messages;
	}
}