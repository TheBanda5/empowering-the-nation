const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mailchimpClient = require('@mailchimp/mailchimp_transactional')('481653dde3657ea4e65d41d717b18002-us22');
const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

app.post('/send-email', async (req, res) => {
    const { name, email, selectedCourses, totalCost } = req.body;

    const messageContent = `
        <p>Dear ${name},</p>
        <p>Your selected courses are: <strong>${selectedCourses.join(', ')}</strong>.</p>
        <p>Total cost is: <strong>${totalCost}</strong>.</p>
        <p>Thank you for getting a quote and choosing Empowering the Nation!</p>
        <p>Best regards,<br>Empowering the Nation</p>
    `;

    try {
        const response = await mailchimpClient.messages.send({
            message: {
                from_email: 'bumbafsbesos@gmail.com',
                to: [{ email: email, type: 'to' }],
                subject: 'Your New Quote',
                html: messageContent
            }
        });
        res.json(response);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
