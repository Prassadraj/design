// pages/contact.js
"use client"; // If you're using client-side features

import React from 'react';
import { useState } from 'react';
import "./style.css";

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false); // Track form submission

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation (you can enhance this)
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/contact', { // Your API route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                setSubmitted(true); // Update state on successful submission
                // Clear the form fields (optional)
                setName('');
                setEmail('');
                setMessage('');
            } else {
                const errorData = await response.json(); // Get error details from server
                console.error('Error submitting form:', errorData);
                alert('An error occurred. Please try again later.'); // User-friendly error message
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('A network error occurred. Please try again later.'); // Network error message
        }
    };

    if (submitted) {
        return (
            <div className="contact-page">
                <br />
                <h1>Thank you for your message!</h1>
                <p>We will get back to you shortly.</p>
            </div>
        );
    }

    return (
        <div className="contact-page">
            <h1>Contact Us</h1>
            <p>Have any questions or inquiries?  Send us a message!</p>

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default ContactPage;