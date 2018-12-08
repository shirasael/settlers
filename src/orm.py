import datetime
from sqlalchemy import Table, Column, Integer, ForeignKey, Enum, Date, String, Boolean
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.ext.hybrid import hybrid_property
import enum
import arrow
import json

date_parser = arrow.parser.DateTimeParser()
DATE_FORMAT = 'YYYY-MM-DD'

Base = declarative_base()


def lazy(f):
    def wrapper(self):
        lazy_name = "_lazy_" + f.__name__
        if not lazy_name in self.__dict__:
            self.__setattr__(lazy_name, f(self))
        return self.__getattribute__(lazy_name)

    return wrapper


class PortsEnum(enum.Enum):
    SHEEP = 1
    WHEAT = 2
    IRON = 3
    BRICKS = 4
    WOOD = 5
    THREE_TO_ONE = 6


class YefesGameStatistics(Base):
    __tablename__ = 'player_game'
    game_id = Column('game_id', Integer, ForeignKey('game.id'), primary_key=True)
    game = relationship("Game", backref=backref("player_game", cascade="all, delete-orphan"))
    yefes_id = Column('yefes_id', Integer, ForeignKey('yefes.id'), primary_key=True)
    yefes = relationship("Yefes", backref=backref("player_game", cascade="all, delete-orphan"))
    place = Column('place', Integer)
    knights = Column('num_of_knights', Integer, default=0)
    yops = Column('num_of_yops', Integer, default=0)
    road_builds = Column('num_of_road_builds', Integer, default=0)
    monopolies = Column('num_of_monomplies', Integer, default=0)
    victory_points = Column('num_of_victory_points', Integer, default=0)
    total_roads = Column('total_roads', Integer, default=0)
    roads_in_a_row = Column('roads_in_a_row', Integer, default=0)
    longest_road = Column('longest_road', Boolean, default=False)
    longest_army = Column('longest_army', Boolean, default=False)
    cities = Column('cities', Integer, default=0)
    settlements = Column('settlements', Integer, default=2)

    @hybrid_property
    def points(self):
        settlements = int(self.settlements) if self.settlements else 0
        cities = 2 * int(self.cities) if self.cities else 0
        longest_road = 2 if self.longest_road else 0
        longest_army = 2 if self.longest_army else 0
        victory_points = int(self.victory_points) if self.victory_points else 0
        return settlements + cities + longest_road + longest_army + victory_points

    @hybrid_property
    @lazy
    def dev_cards(self):
        def prop_num(prop):
            return int(prop) if prop else 0

        return sum([prop_num(self.victory_points),
                    prop_num(self.yops),
                    prop_num(self.knights),
                    prop_num(self.monopolies),
                    prop_num(self.road_builds),
                   ])

    def __repr__(self):
        return "Stats for {} the yefes, game #{}:\n\tKnights: {}\n\tLongest army:{}\n\tVictory points: {}\n\t" \
               "Roads in a row: {}\n\tLongest road:{}\n\tSettlements: {}\n\tCities: {}\n\tTotal points: {}\n\tPlace: {}".format(
            self.yefes.name, self.game.id, self.knights, self.longest_army, self.victory_points,
            self.roads_in_a_row, self.longest_road, self.settlements, self.cities, self.points, self.place
        )

    def to_map(self):
        return {
            'game_id': self.game_id,
            'yefes_id': self.yefes_id,
            'yefes_info': self.yefes.to_map(),
            'place': self.place,
            'knights': self.knights,
            'yops': self.yops,
            'road_builds': self.road_builds,
            'monopolies': self.monopolies,
            'victory_points': self.victory_points,
            'total_roads': self.total_roads,
            'roads_in_a_row': self.roads_in_a_row,
            'longest_road': self.longest_road,
            'longest_army': self.longest_army,
            'cities': self.cities,
            'settlements': self.settlements,
            'points': self.points
        }

EMPTY_PLAYER = {'id': -1, 'name': 'N/A'}

class Game(Base):
    __tablename__ = 'game'
    id = Column(Integer, primary_key=True)
    players = relationship("Yefes", secondary='player_game', back_populates="games")
    date = Column('date', Date)
    location = Column('location', String)
    players_stats = relationship("YefesGameStatistics")

    @hybrid_property
    def winner(self):
        return min(self.players_stats, key=lambda s: s.place).yefes if self.players else None

    def __repr__(self):
        return "ID: {}\nDate: {}\nLocation: {}\nPlayers: {}".format(
            self.id, self.date, self.location, self.players)

    def to_map(self):
        return {
            'id': self.id,
            'players': [p.to_map() for p in self.players_stats],
            'date': str(self.date),
            'location': self.location,
            'winner': self.winner.to_map() if self.winner else EMPTY_PLAYER
        }

class Yefes(Base):
    __tablename__ = 'yefes'
    id = Column(Integer, primary_key=True)
    games = relationship("Game", secondary='player_game', back_populates="players")
    name = Column('name', String)
    games_stats = relationship("YefesGameStatistics")

    @hybrid_property
    def wins(self):
        return sum([1 if self == game.winner else 0 for game in self.games])

    def avg(self, stat_property):
        if len(self.games) == 0:
            return 0
        all_values_for_property = [game.__getattribute__(stat_property) or -1 for game in self.games_stats]
        s = 0
        count = 0
        for n in all_values_for_property:
            if n > -1:
                s += n
                count += 1
        return s / count if count > 0 else 'N/A'

    def __repr__(self):
        return "ID: {}; Name: {}; Game IDs: {}".format(self.id, self.name, [g.id for g in self.games])

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def statistics_map(self):
        base_map = self.to_map()
        base_map.update({
            'wins': self.wins,
            'avg_knights': self.avg('knights'),
            'avg_roads': self.avg('total_roads'),
            'avg_dev_cards': self.avg('dev_cards'),
            'games_played': len(self.games)
        })
        return base_map


def get_all_games(session):
    return session.query(Game)


def get_all_yafasim(session):
    return session.query(Yefes)


def add_game(session, date, location):
    if type(date) != datetime.datetime:
        date = date_parser.parse(date, DATE_FORMAT)
    session.add(Game(date=date, location=location))
    session.commit()


def add_yefes(session, name):
    session.add(Yefes(name=name))
    session.commit()


def add_stat(session, game_id, yefes_id, **kwargs):
    game = session.query(Game).filter(Game.id == game_id).one()
    yefes = session.query(Yefes).filter(Yefes.id == yefes_id).one()
    new_yefes = YefesGameStatistics(game=game, yefes=yefes, **kwargs)
    session.add(new_yefes)
    session.commit()


def total(stats, stat_property):
    all_values_for_property = [s.__getattribute__(stat_property) or 0 for s in stats]
    return sum(all_values_for_property)

# database_connection_string = os.environ["DATABASE_URL"]
database_connection_string = r"sqlite:///test.db"

engine = create_engine(database_connection_string, poolclass=NullPool)
Base.metadata.create_all(engine)
