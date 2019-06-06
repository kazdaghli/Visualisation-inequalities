#!/usr/bin/python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template

app = Flask(__name__)

app.secret_key = "TODO: mettre une valeur secrète ici"
session_id_init = "hds62bbddsb0b35"

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', title="Inequalities in the world ")

if __name__ == '__main__':
    app.run(debug=True)

