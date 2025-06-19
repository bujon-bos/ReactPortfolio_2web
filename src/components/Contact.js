import React, { useState, useRef } from 'react';
import { Box, TextField, Button, CircularProgress } from "@mui/material";

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [focus, setFocus] = useState({ name: false, email: false, message: false });
    const formRef = useRef();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFocus = (e) => {
        setFocus({ ...focus, [e.target.name]: true });
    };

    const handleBlur = (e) => {
        setFocus({ ...focus, [e.target.name]: false });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200); // simulate async send
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt="3rem">
            <h1 style={{
                transition: 'color 0.5s',
                color: submitted ? '#27C93F' : '#8D53FF'
            }}>
                {submitted ? "Message Sent!" : "Contact Me"}
            </h1>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    transition: 'all 0.6s cubic-bezier(.68,-0.55,.27,1.55)',
                    opacity: submitted ? 0 : 1,
                    transform: submitted ? 'translateY(-30px) scale(0.95)' : 'translateY(0) scale(1)',
                    pointerEvents: submitted ? 'none' : 'auto',
                    animation: shake ? 'shake 0.5s' : 'none'
                }}
                component="form"
                ref={formRef}
                onSubmit={handleSubmit}
            >
                <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        transition: 'box-shadow 0.3s',
                        boxShadow: focus.name ? '0 0 0 2px #8D53FF44' : 'none'
                    }}
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        transition: 'box-shadow 0.3s',
                        boxShadow: focus.email ? '0 0 0 2px #8D53FF44' : 'none'
                    }}
                />
                <TextField
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    fullWidth
                    margin="normal"
                    required
                    multiline
                    rows={4}
                    sx={{
                        transition: 'box-shadow 0.3s',
                        boxShadow: focus.message ? '0 0 0 2px #8D53FF44' : 'none'
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        mt: 2,
                        width: '100%',
                        background: 'linear-gradient(90deg, #8D53FF 60%, #CA6BE6 100%)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 2px 8px #8D53FF22',
                        '&:hover': {
                            transform: 'scale(1.04) translateY(-2px)',
                            boxShadow: '0 4px 16px #8D53FF44'
                        }
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Send"}
                </Button>
            </Box>
            <Box
                sx={{
                    mt: 3,
                    opacity: submitted ? 1 : 0,
                    transform: submitted ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
                }}
            >
                {submitted && (
                    <Box
                        sx={{
                            background: 'linear-gradient(90deg, #8D53FF 60%, #CA6BE6 100%)',
                            color: 'white',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: '0 2px 16px #8D53FF33',
                            textAlign: 'center',
                            fontSize: '1.2rem'
                        }}
                    >
                        <span role="img" aria-label="success" style={{ fontSize: '2rem' }}>🎉</span>
                        <div>Thank you for your message!<br />I will get back to you soon.</div>
                        <Button
                            sx={{ mt: 2, color: '#fff', borderColor: '#fff' }}
                            variant="outlined"
                            onClick={() => {
                                setForm({ name: '', email: '', message: '' });
                                setSubmitted(false);
                            }}
                        >
                            Send Another
                        </Button>
                    </Box>
                )}
            </Box>
            <style>
                {`
                @keyframes shake {
                    0% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-8px); }
                    80% { transform: translateX(8px); }
                    100% { transform: translateX(0); }
                }
                `}
            </style>
        </Box>
    );
}
