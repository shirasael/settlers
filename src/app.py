from flask import Flask, render_template, render_template_string, request, redirect, url_for, session
from sqlalchemy.orm import sessionmaker, scoped_session
from orm import *


Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
dbsession = scoped_session(DBSession)

app = Flask(__name__)
app.secret_key = 'i love potatoes'  # Please replace this with an actual hash


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/games')
def games():
    games = get_all_games(dbsession)
    return json.dumps([g.to_map() for g in games])


@app.route('/existing')
def existing():
    games = get_all_games(dbsession)
    yafasim = get_all_yafasim(dbsession)
    return json.dumps({
        "games": [game.to_map() for game in games],
        "yafasim": [yefes.to_map() for yefes in yafasim]
    })


@app.route('/existing/yafasim')
def existing_yafasim():
    yafasim = get_all_yafasim(dbsession)
    return json.dumps([yefes.to_map() for yefes in yafasim])


@app.route('/new_game_stat', methods=['GET', 'POST'])
def new_game_stat():
    stats_data = json.loads(request.data)
    add_stat(dbsession, **stats_data)
    return redirect(url_for('main'))


@app.route('/new_yefes', methods=['GET', 'POST'])
def new_yefes():
    stats_data = json.loads(request.data)
    add_yefes(dbsession, **stats_data)
    return redirect(url_for('main'))


@app.route('/new_game', methods=['GET', 'POST'])
def new_game():
    stats_data = json.loads(request.data)
    add_game(dbsession, **stats_data)
    return redirect(url_for('main'))


@app.route('/yefes', methods=['GET', 'POST'])
def yefes():
    yafasim = get_all_yafasim(dbsession)
    return json.dumps([y.statistics_map() for y in yafasim])


@app.route('/stats', methods=['GET', 'POST'])
def stats():
    yafasim = get_all_yafasim(dbsession)
    stats = dbsession.query(YefesGameStatistics)
    games_query = dbsession.query(Game)
    total_games = games_query.count()
    total_cards = total(stats, "dev_cards")
    total_cities = total(stats, "cities")
    total_settlements = total(stats, "settlements")
    avg_knights_per_game = float(total(stats, "knights")) / total_games
    return json.dumps({
        'yafasim': [y.statistics_map() for y in yafasim],
        'stats': {
            'total_games': total_games,
            'total_cards': total_cards,
            "avg_knights": avg_knights_per_game,
            'total_cities': total_cities,
            'total_settlements': total_settlements,
        }
    })


if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True, threaded=True)
