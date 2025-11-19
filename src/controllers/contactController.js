const { ContactService } = require('../services');

const ContactController = {
    submit(req, res) {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const formData = {name, email, message};
      ContactService.submitContactForm(formData);
      res.json({ message: 'Email enviado com sucesso!' });
    }
  };
  
  module.exports = ContactController;
  