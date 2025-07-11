import {
    Html,
    Head,
    Preview,
    Section,
    Text,
    Container,
} from '@react-email/components';
import React from 'react';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {
    return (
        <Html dir="ltr" lang="en">
            <Head>
                <title>Email Verification</title>
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Andika:wght@400;700&display=swap');`}
                </style>
            </Head>

            <Preview>Your verification code is ready!</Preview>

            <Section style={{ backgroundColor: '#f4f4f5', padding: '40px 0' }}>
                <Container
                    style={{
                        backgroundColor: '#ffffff',
                        padding: '32px',
                        borderRadius: '8px',
                        fontFamily: "'Andika', sans-serif",
                        maxWidth: '480px',
                        margin: '0 auto',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                >
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Hello {username},
                    </Text>

                    <Text style={{ fontSize: '16px', marginBottom: '12px' }}>
                        Thank you for signing up! To complete your registration, please use the verification code below:
                    </Text>

                    <Text
                        style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#3b82f6',
                            backgroundColor: '#f0f9ff',
                            padding: '16px',
                            borderRadius: '6px',
                            letterSpacing: '6px',
                            margin: '24px 0',
                        }}
                    >
                        {otp}
                    </Text>

                    <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                        This code will expire in 1 hour. If you didn’t request this, you can safely ignore this email.
                    </Text>

                    <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
                        — The Note4Me Team
                    </Text>
                </Container>
            </Section>
        </Html>
    );
};

export default VerificationEmail;
