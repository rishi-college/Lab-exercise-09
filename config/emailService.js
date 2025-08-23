const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter for Gmail
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send registration confirmation email
const sendRegistrationEmail = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: '🎉 Welcome to Student Freelancer Workplace!',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registration Successful</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            max-width: 600px; 
                            margin: 0 auto; 
                            padding: 20px;
                            background-color: #f8f9fa;
                        }
                        .container { 
                            background: white; 
                            padding: 30px; 
                            border-radius: 10px; 
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            padding-bottom: 20px; 
                            border-bottom: 2px solid #e9ecef;
                        }
                        .logo { 
                            font-size: 28px; 
                            font-weight: bold; 
                            color: #007bff; 
                            margin-bottom: 10px;
                        }
                        .welcome-text { 
                            font-size: 18px; 
                            color: #28a745; 
                            margin-bottom: 20px;
                        }
                        .content { 
                            margin-bottom: 30px; 
                        }
                        .feature { 
                            background: #f8f9fa; 
                            padding: 15px; 
                            margin: 10px 0; 
                            border-radius: 5px; 
                            border-left: 4px solid #007bff;
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            padding-top: 20px; 
                            border-top: 1px solid #e9ecef; 
                            color: #6c757d;
                        }
                        .btn { 
                            display: inline-block; 
                            padding: 12px 24px; 
                            background: #007bff; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🎓 Student Freelancer Workplace</div>
                            <div class="welcome-text">Welcome aboard, ${userName}! 🚀</div>
                        </div>
                        
                        <div class="content">
                            <p>Congratulations! Your registration has been completed successfully. You're now part of our growing community of student freelancers.</p>
                            
                            <div class="feature">
                                <strong>✨ What you can do now:</strong>
                                <ul>
                                    <li>Complete your profile with skills and portfolio</li>
                                    <li>Browse available projects and opportunities</li>
                                    <li>Connect with potential clients</li>
                                    <li>Showcase your work and expertise</li>
                                </ul>
                            </div>
                            
                            <div class="feature">
                                <strong>🎯 Next steps:</strong>
                                <ol>
                                    <li>Log in to your account</li>
                                    <li>Upload your portfolio items</li>
                                    <li>Set your hourly rates</li>
                                    <li>Start applying for projects</li>
                                </ol>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="btn">Get Started Now</a>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>If you have any questions, feel free to contact our support team.</p>
                            <p>Best regards,<br>The Student Freelancer Workplace Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Welcome to Student Freelancer Workplace!
                
                Hi ${userName},
                
                Your registration has been completed successfully! You're now part of our growing community of student freelancers.
                
                What you can do now:
                - Complete your profile with skills and portfolio
                - Browse available projects and opportunities
                - Connect with potential clients
                - Showcase your work and expertise
                
                Next steps:
                1. Log in to your account
                2. Upload your portfolio items
                3. Set your hourly rates
                4. Start applying for projects
                
                Get started at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
                
                Best regards,
                The Student Freelancer Workplace Team
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Registration email sent successfully to ${userEmail}`);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Failed to send registration email:', error.message);
        throw new Error('Failed to send registration email');
    }
};

// Send verification email
const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: '🔐 Verify Your Email - Student Freelancer Workplace',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            max-width: 600px; 
                            margin: 0 auto; 
                            padding: 20px;
                            background-color: #f8f9fa;
                        }
                        .container { 
                            background: white; 
                            padding: 30px; 
                            border-radius: 10px; 
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            padding-bottom: 20px; 
                            border-bottom: 2px solid #e9ecef;
                        }
                        .logo { 
                            font-size: 28px; 
                            font-weight: bold; 
                            color: #007bff; 
                            margin-bottom: 10px;
                        }
                        .verify-btn { 
                            display: inline-block; 
                            padding: 15px 30px; 
                            background: #28a745; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            font-size: 16px; 
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            padding-top: 20px; 
                            border-top: 1px solid #e9ecef; 
                            color: #6c757d;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🎓 Student Freelancer Workplace</div>
                            <h2>Verify Your Email Address</h2>
                        </div>
                        
                        <p>Hi ${userName},</p>
                        
                        <p>Thank you for registering with Student Freelancer Workplace! To complete your registration, please verify your email address by clicking the button below:</p>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${verificationToken}" class="verify-btn">Verify Email Address</a>
                        </div>
                        
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                            ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${verificationToken}
                        </p>
                        
                        <p>This link will expire in 24 hours for security reasons.</p>
                        
                        <div class="footer">
                            <p>If you didn't create an account, you can safely ignore this email.</p>
                            <p>Best regards,<br>The Student Freelancer Workplace Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent successfully to ${userEmail}`);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Failed to send verification email:', error.message);
        throw new Error('Failed to send verification email');
    }
};

module.exports = {
    sendRegistrationEmail,
    sendVerificationEmail
};
