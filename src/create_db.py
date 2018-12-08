from orm import *
import datetime
import random
from sqlalchemy.orm import sessionmaker

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
dbsession = DBSession()

dbsession.query(Game).delete()
dbsession.query(Yefes).delete()
dbsession.query(YefesGameStatistics).delete()

yafasim_names = ["Jona", "Hermon", "Shira", "Boaz", "Ido", "Symon", "Odelya", "Omer"]
yafasim = []

for yefes_name in yafasim_names:
    yefes = Yefes(name=yefes_name)
    yafasim.append(yefes)
    dbsession.add(yefes)
    dbsession.commit()

games = [
    (Game(date=datetime.datetime.now() - datetime.timedelta(days=7),
          # players=yafasim[:5],
          location="Shira"), yafasim[:5]),
    (Game(date=datetime.datetime.now() - datetime.timedelta(days=3),
          # players=yafasim[2:],
          location="Boaz"), yafasim[2:])
]

all_stats = []

for game_t in games:
    game = game_t[0]
    players = game_t[1]
    dbsession.add(game)
    longest_road = random.choice(players)
    max_roads = random.randint(5, 14)
    longest_army = random.choice(players)
    max_knights = random.randint(3, 6)
    game_stats = []
    for player in players:
        total_roads = max_roads if player is longest_road else random.randint(2, max_roads)
        knights = max_knights if player is longest_army else random.randint(0, max_knights)
        stats = YefesGameStatistics(game=game,
                                    yefes=player,
                                    knights=knights,
                                    longest_army=player is longest_army,
                                    victory_points=random.randint(0, 1),
                                    total_roads=total_roads,
                                    roads_in_a_row=max_roads if player is longest_road else random.randint(2,
                                                                                                           total_roads),
                                    longest_road=player is longest_road,
                                    cities=random.randint(0, 4),
                                    settlements=random.randint(2, 5)
                                    )
        all_stats.append(stats)
        game_stats.append(stats)
        dbsession.add(stats)

    game_stats.sort(key=lambda s: s.points)
    for i in xrange(len(game_stats)):
        game_stats[-(i + 1)].place = i + 1

dbsession.commit()
