import json
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.preprocessing import LabelEncoder
import pickle
import random

nltk.download('punkt')
nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()

# Load intents file
with open('intents_more.json') as file:
    data = json.load(file)

words = []
classes = []
documents = []

for intent in data['intents']:
    for pattern in intent['patterns']:
        tokens = nltk.word_tokenize(pattern)
        words.extend(tokens)
        documents.append((tokens, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [lemmatizer.lemmatize(w.lower()) for w in words if w.isalnum()]
words = sorted(set(words))
classes = sorted(set(classes))

pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

training_data = []
output_empty = [0] * len(classes)

for doc in documents:
    bag = []
    pattern_words = [lemmatizer.lemmatize(w.lower()) for w in doc[0]]
    bag = [1 if w in pattern_words else 0 for w in words]
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training_data.append([bag, output_row])

random.shuffle(training_data)
training_data = np.array(training_data, dtype=object)

X = np.array(list(training_data[:, 0]))
y = np.array(list(training_data[:, 1]))

model = Sequential()
model.add(Dense(128, input_shape=(len(X[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(y[0]), activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
model.fit(X, y, epochs=200, batch_size=8, verbose=1)
model.save('chatbot_model.h5')

print("Model trained and saved.")
