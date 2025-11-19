const ContactService = require('../services/contactService');
const { sendContactEmail } = require("../utils/mailer");


class ContactServiceImpl extends ContactService {
    async submitContactForm(contactData) {
        await sendContactEmail(contactData);
    }
}

module.exports = new ContactServiceImpl();