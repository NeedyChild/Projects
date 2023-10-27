from email import header
from email.policy import default
import json
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return app.send_static_file("index.html")

@app.route('/eventsSearch')
def eventsSearch():
    url_string = 'https://app.ticketmaster.com/discovery/v2/events.json?'
    url_string += 'apikey='
    url_string += request.args['apikey']
    url_string += '&keyword='
    url_string += request.args['keyword']
    url_string += '&segmentId='
    url_string += request.args['segmentId']
    url_string += '&radius='
    url_string += request.args['radius']
    url_string += '&unit='
    url_string += request.args['unit']
    url_string += '&geoPoint='
    url_string += request.args['geoPoint']

    r = requests.get(url_string)
    return r.json()


@app.route('/eventsDetail')
def eventsDetail():
    url_string = "https://app.ticketmaster.com/discovery/v2/events/"
    url_string += request.args['id']
    url_string += "?apikey="
    url_string += request.args['apikey']

    r = requests.get(url_string)
    return r.json()

@app.route('/venueDetail')
def venueDetail():
    url_string = "https://app.ticketmaster.com/discovery/v2/venues?apikey="
    url_string += request.args['apikey']
    url_string += '&keyword='
    url_string += request.args['keyword']

    r = requests.get(url_string)
    return r.json()


if __name__ == "__main__":
    app.run(debug=True)