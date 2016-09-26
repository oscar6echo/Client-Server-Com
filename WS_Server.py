
import os
import numpy as np
import json

from flask import Flask, jsonify, request, abort
from flask.ext.cors import CORS, cross_origin

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    sep = '<br/>'
    text = 'Two functions availables from this server :'+sep
    text += 'url=/func_one'+sep+'func_one(M, V, eps, bool) = M*V+eps*bool'+sep
    text += 'url=/func_two'+sep+'func_two(a, b) = a*b'
    return text

@app.route('/func_one', methods=['POST'])
@cross_origin(origin='localhost')
def func_one():
    if not (request.json and 'M' in request.json and 'V' in request.json and \
            'eps' in request.json and 'bool' in request.json):
        abort(400)

    print('Server received payload =\n{}'.format(request.json))
    
    M = request.json.get('M')
    try:
        M = json.loads(M)
    except:
        pass
    
    V = request.json.get('V')
    try:
        V = json.loads(V)
    except:
        pass
    
    eps = request.json.get('eps')
    b = request.json.get('bool')

    M = np.array(M)
    V = np.array(V)

    res = np.dot(M, V)+b*eps
    res = res.tolist()

    res_serialised = json.dumps(res)
    print('Server sending payload =\n{}'.format(res_serialised))

    response = jsonify({'output': res_serialised})
    return response, 201

@app.route('/func_two', methods=['POST'])
@cross_origin(origin='localhost')
def func_two():
    if not (request.json and 'a' in request.json and 'b' in request.json):
        abort(400)

    print('Server received payload =\n{}'.format(request.json))

    a = request.json.get('a')
    b = request.json.get('b')

    res = a*b
    print('Server sending payload =\n{}'.format(res))

    response = jsonify({'output': res})
    return response, 201


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error"""
    return 'Sorry, Nothing here', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error"""
    return 'Sorry, unexpected error: {}'.format(e), 500


if __name__ == '__main__':
    port = 3000
    app.run(host='0.0.0.0', debug=True, port=port)