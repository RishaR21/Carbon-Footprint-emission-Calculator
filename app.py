from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import json
import numpy as np
import tensorflow as tf
import nltk
from nltk.stem import WordNetLemmatizer
import pickle

app = Flask(__name__)
CORS(app)
lemmatizer = WordNetLemmatizer()

# Load model and resources
model = tf.keras.models.load_model('chatbot_model.h5')
intents = json.loads(open('intents_more.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))

# Function to clean up and lemmatize sentence
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

# Function to convert sentence to bag of words
def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

# Function to predict the class of a sentence
def predict_class(sentence):
    p = bow(sentence, words)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return [{"intent": classes[r[0]], "probability": str(r[1])} for r in results]

# Function to get a response based on predicted intent
def get_response(ints, intents_json):
    if not ints:
        return "Sorry, I didn't quite catch that. Could you please rephrase?"

    tag = ints[0]['intent']
    for intent in intents_json['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])
    return "Sorry, I couldn't find an appropriate response."

# Route to handle chatbot responses
@app.route('/predict', methods=['POST'])
def chatbot_response():
    data = request.get_json()
    message = data.get('message')
    if not message:
        return jsonify({'response': "Sorry, the message field is required."}), 400

    intents_list = predict_class(message)
    response = get_response(intents_list, intents)
    return jsonify({'response': response})

# Route to handle chat requests
@app.route('/chat', methods=['POST'])
def chat():
    if 'message' not in request.json:
        return jsonify({'response': "Sorry, the message field is required."}), 400

    user_message = request.json['message']
    intents_list = predict_class(user_message)
    response = get_response(intents_list, intents)
    return jsonify({'response': response})

# Run the Flask application on port 5001
if __name__ == '__main__':
    app.run(debug=True, port=5001)
