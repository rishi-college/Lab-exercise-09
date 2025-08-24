
CREATE DATABASE IF NOT EXISTS student_freelancer_db;
USE student_freelancer_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    profile_picture VARCHAR(255),
    skills TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_skills (skills(100)),
    INDEX idx_created_at (created_at),
    INDEX idx_hourly_rate (hourly_rate)
);

INSERT INTO users (name, email, phone, skills, bio, hourly_rate, is_verified) VALUES
('Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0101', 'Web Development, React, Node.js, MongoDB', 'Passionate full-stack developer with 2 years of experience. Specialized in modern web technologies and responsive design. Love creating user-friendly applications that solve real problems.', 35.00, TRUE),
('Michael Chen', 'michael.chen@email.com', '+1-555-0102', 'Graphic Design, Adobe Creative Suite, Logo Design, Branding', 'Creative graphic designer with a keen eye for detail. Experienced in creating compelling visual identities and marketing materials. Always eager to bring ideas to life through design.', 28.50, TRUE),
('Emily Rodriguez', 'emily.rodriguez@email.com', '+1-555-0103', 'Content Writing, SEO, Blog Writing, Copywriting', 'Skilled content writer with expertise in SEO and digital marketing. Passionate about creating engaging, informative content that drives results. Experience in various industries and writing styles.', 25.00, TRUE),
('David Kim', 'david.kim@email.com', '+1-555-0104', 'Mobile App Development, Flutter, Firebase, UI/UX Design', 'Mobile app developer specializing in cross-platform development with Flutter. Focus on creating intuitive user experiences and robust backend solutions. Always learning new technologies.', 40.00, TRUE),
('Lisa Thompson', 'lisa.thompson@email.com', '+1-555-0105', 'Digital Marketing, Social Media, Google Ads, Analytics', 'Digital marketing specialist with proven track record in growing online presence. Expert in social media strategy, PPC campaigns, and data-driven marketing decisions.', 32.00, TRUE),
('James Wilson', 'james.wilson@email.com', '+1-555-0106', 'Video Editing, Adobe Premiere, Motion Graphics, YouTube', 'Creative video editor and motion graphics designer. Specialized in creating engaging content for social media and YouTube. Passionate about storytelling through visual media.', 30.00, TRUE),
('Maria Garcia', 'maria.garcia@email.com', '+1-555-0107', 'Data Analysis, Python, SQL, Excel, Tableau', 'Data analyst with strong analytical skills and technical expertise. Experience in transforming raw data into actionable insights. Passionate about helping businesses make data-driven decisions.', 38.00, TRUE),
('Alex Turner', 'alex.turner@email.com', '+1-555-0108', 'UI/UX Design, Figma, Prototyping, User Research', 'UI/UX designer focused on creating intuitive and beautiful user experiences. Expert in user research, wireframing, and prototyping. Always putting users first in design decisions.', 35.00, TRUE),
('Rachel Green', 'rachel.green@email.com', '+1-555-0109', 'Photography, Photo Editing, Lightroom, Portrait Photography', 'Professional photographer with expertise in portrait and commercial photography. Skilled in photo editing and post-processing. Passionate about capturing authentic moments and creating stunning visuals.', 45.00, TRUE),
('Kevin Patel', 'kevin.patel@email.com', '+1-555-0110', '3D Modeling, Blender, Unity, Game Development', '3D artist and game developer with experience in creating immersive 3D environments and characters. Skilled in Blender, Unity, and game development pipelines.', 42.00, TRUE);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    client_id INT,
    freelancer_id INT,
    status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
    budget DECIMAL(10,2),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_deadline (deadline),
    INDEX idx_freelancer_id (freelancer_id)
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO skills (name, category) VALUES
('Web Development', 'Development'),
('Mobile Development', 'Development'),
('Graphic Design', 'Design'),
('UI/UX Design', 'Design'),
('Content Writing', 'Writing'),
('Digital Marketing', 'Marketing'),
('Data Analysis', 'Analytics'),
('Video Editing', 'Media'),
('Photography', 'Media'),
('3D Modeling', '3D'),
('SEO', 'Marketing'),
('Social Media Management', 'Marketing'),
('Logo Design', 'Design'),
('Branding', 'Design'),
('Copywriting', 'Writing'),
('Blog Writing', 'Writing'),
('JavaScript', 'Programming'),
('Python', 'Programming'),
('React', 'Frontend'),
('Node.js', 'Backend'),
('MongoDB', 'Database'),
('MySQL', 'Database'),
('Adobe Creative Suite', 'Design Tools'),
('Figma', 'Design Tools'),
('Figma', 'Design Tools'),
('Blender', '3D Tools'),
('Unity', 'Game Development');

CREATE TABLE IF NOT EXISTS user_skills (
    user_id INT,
    skill_id INT,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    years_experience INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience) VALUES
(1, 1, 'advanced', 2), -- Sarah - Web Development
(1, 17, 'advanced', 2), -- Sarah - JavaScript
(1, 19, 'advanced', 2), -- Sarah - React
(1, 20, 'intermediate', 1), -- Sarah - Node.js
(2, 3, 'advanced', 3), -- Michael - Graphic Design
(2, 22, 'expert', 4), -- Michael - Adobe Creative Suite
(2, 13, 'advanced', 3), -- Michael - Logo Design
(3, 5, 'advanced', 2), -- Emily - Content Writing
(3, 11, 'intermediate', 1), -- Emily - SEO
(3, 15, 'advanced', 2), -- Emily - Copywriting
(4, 2, 'advanced', 2), -- David - Mobile Development
(4, 8, 'intermediate', 1), -- David - UI/UX Design
(5, 6, 'advanced', 3), -- Lisa - Digital Marketing
(5, 12, 'expert', 4), -- Lisa - Social Media Management
(6, 8, 'advanced', 2), -- James - Video Editing
(6, 22, 'advanced', 3), -- James - Adobe Creative Suite
(7, 7, 'advanced', 2), -- Maria - Data Analysis
(7, 18, 'intermediate', 1), -- Maria - Python
(8, 4, 'advanced', 3), -- Alex - UI/UX Design
(8, 23, 'expert', 4), -- Alex - Figma
(9, 9, 'advanced', 3), -- Rachel - Photography
(9, 22, 'intermediate', 2), -- Rachel - Adobe Creative Suite
(10, 10, 'advanced', 2), -- Kevin - 3D Modeling
(10, 25, 'intermediate', 1); -- Kevin - Blender

SELECT 'Database initialized successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_skills FROM skills;
SELECT COUNT(*) as total_user_skills FROM user_skills;
