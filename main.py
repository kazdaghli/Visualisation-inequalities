#!/usr/bin/python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, session

app = Flask(__name__)

app.secret_key = "TODO: mettre une valeur secrète ici"
session_id_init = "hds62bbddsb0b35"

# Initialisation function
def init():
	session['map_attributes'] = ['Gini', 'Income', 'PIB']
	session['graph_attributes'] = ['Gini', 'Wealth', 'Test']

@app.route('/', methods=['GET'])
def index():
	init()
	return render_template('index.html', title="Inequalities in the world ")
	
@app.route('/canvas', methods=['GET'])
def canvas():
	init()
	return render_template('canvasV0.2.html', map_attributes = session['map_attributes'], graph_attributes = session['graph_attributes'])

if __name__ == '__main__':
    app.run(debug=True)

