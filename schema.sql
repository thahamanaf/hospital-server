CREATE TABLE IF NOT EXISTS user_account (
    id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    is_active INT DEFAULT 2,
    role_id INT NOT NULL,
is_activation_link_sended INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS api_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

ALTER TABLE user_account
ADD CONSTRAINT fk_role_id
FOREIGN KEY (role_id) REFERENCES user_role(id);


INSERT INTO api_token (token) VALUES ('4911ea6f-f82a-401c-87c8-39ebd9dab145')
INSERT INTO user_role (role_name) VALUES ('Admin'), ('Doctor'), ('Nurse')

CREATE TABLE IF NOT EXISTS patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(25) NOT NULL,
    place VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS medical_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    reason VARBINARY(500) NOT NULL,
    docter_id VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prescription BLOB,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (docter_id) REFERENCES user_account(id)
);