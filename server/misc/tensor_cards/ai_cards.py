import tensorflow
import keras
import numpy
import sys
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM
from keras.utils import np_utils
from keras.callbacks import ModelCheckpoint

flags = open("..\\flags.txt").read()

def tokenize_words(text):
    text = text.lower()
    tokenizer = RegexpTokenizer(r'\w+')
    tokens = tokenizer.tokenize(text)
    filtered = filter(lambda token: token not in stopwords.words("english"), tokens)
    return " ".join(filtered)

processed_flags = tokenize_words(flags)

chars = sorted(list(set(processed_flags)))
char_to_num = dict((c,i) for i,c in enumerate(chars))


flags_len = len(processed_flags)
vocab_len = len(chars)
print("total number of characters", flags_len)
print("total vocab", vocab_len)

seq_length = 100
x_data = []
y_data = []

for i in range(0, flags_len-seq_length, 1):
    in_seq = processed_flags[i:i+seq_length]
    out_seq = processed_flags[i+seq_length]
    x_data.append([char_to_num[char] for char in in_seq])
    y_data.append(char_to_num[out_seq])

n_patterns = len(x_data)
print("total patterns: ", n_patterns)

X = numpy.reshape(x_data, (n_patterns, seq_length, 1))
X = X/float(vocab_len)

Y = np_utils.to_categorical(y_data)

model = Sequential()
model.add(LSTM(256,input_shape=(X.shape[1],X.shape[2]), return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(256, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(128))
model.add(Dropout(0.2))
model.add(Dense(Y.shape[1], activation="softmax"))

model.compile(loss="categorical_crossentropy", optimizer="adam")

filepath = "model_weights_saved.hdf5"
checkpoint = ModelCheckpoint(filepath, monitor='loss', verbose=1, save_best_only=True, mode='min')
desired_callbacks = [checkpoint]

model.fit(X,Y, epochs=20,batch_size=256, callbacks=desired_callbacks)

model.load_weights(filepath)
model.compile(loss='categorical_crossentropy', optimizer='adam')

num_to_char = dict((i,c) for i,c in enumerate(chars))

start = numpy.random.randint(0,len(x_data)-1)
pattern = x_data[start]
print("random seed:")
print(f'{"".join([num_to_char[value] for value in pattern])}')

for i in range(1000):
    x= numpy.reshape(pattern, (1,len(pattern),1))
    x = x/float(vocab_len)
    prediction = model.predict(x, verbose=0)
    index = numpy.argmax(prediction)
    result = num_to_char[index]

    sys.stdout.write(result)

    pattern.append(index)
    pattern = pattern[1:len(pattern)]

