# -*- coding: utf-8 -*-
import os

from flask import Flask, request, Response, flash, url_for, redirect, \
    render_template, abort, send_from_directory, send_file, jsonify
from flask_cors import CORS
import traceback
import scipy.io.wavfile as wavf
import numpy as np

from configs import server_config_path

app = Flask(__name__, template_folder='static/templates')

app.config.from_pyfile(server_config_path())

app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

thread_pool = {}
session_info = {}


def check_request(request):
    data = {}
    try:
        data = eval(request.get_data())
    except:
        pass

    return data


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/api/get_music", methods=['POST'])
def calc_model_status():
    try:
        if request.method == 'POST':
            data = check_request(request)
            save_command(data)
            return jsonify({'url': './songs/dramatic.mp3'})
    
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': 0, 'message': 'An error occurred'})


@app.route('/<path:resource>')
def serve_static_resource(resource):
    return send_from_directory('static/', resource)


@app.route('/api/<path:resource>')
def serve_static_resource_api(resource):
    return send_from_directory('static/', resource)


def save_command(data):
    samples = np.array(data['array'])
    max_s = np.max([np.abs([np.min(samples), np.max(samples)])])
    amplitude = np.iinfo(np.int16).max
    samples = samples/max_s * amplitude
    fs = 16000
    out_f = 'output/command.wav'
    wavf.write(out_f, fs, samples.astype(np.int16))

if __name__ == '__main__':
    app.run(app.config['IP'], app.config['PORT'], threaded=True)
