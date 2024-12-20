from flask import Flask, render_template, request, jsonify, session
from flask_mail import Mail, Message
import random
import time

app = Flask(__name__)
app.secret_key = '515zayaythtm515'

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'zayathaythem@gmail.com'
app.config['MAIL_PASSWORD'] = '515zayaythtm515'

mail = Mail(app)

def generate_otp():
    return str(random.randint(100000, 999999))

@app.route('/')
def home():
    return render_template('form.html')

@app.route('/send_otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required.'}), 400

    otp = generate_otp()
    session['otp'] = otp
    session['otp_timestamp'] = time.time()

    try:
        msg = Message('Your OTP Code', sender='zayathaythem@gmail.com', recipients=[email])
        msg.body = f'Your OTP is: {otp}. It is valid for 5 minutes.'
        mail.send(msg)
        return jsonify({'status': 'success', 'message': 'OTP sent successfully!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json
    user_otp = data.get('otp')

    if not user_otp:
        return jsonify({'status': 'error', 'message': 'OTP is required.'}), 400

    generated_otp = session.get('otp')
    otp_timestamp = session.get('otp_timestamp')

    if not generated_otp or not otp_timestamp:
        return jsonify({'status': 'error', 'message': 'No OTP found. Please request a new one.'}), 400

    current_time = time.time()
    if user_otp == generated_otp and (current_time - otp_timestamp) <= 300:
        return jsonify({'status': 'success', 'message': 'OTP verified successfully!'})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid or expired OTP. Please try again.'}), 400

if __name__ == '__main__':
    app.run(debug=True)
