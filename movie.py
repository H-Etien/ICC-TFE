from dataclasses import dataclass
from pathlib import Path
import json
import logging

logging.basicConfig(level=logging.INFO)

CUR_DIR = Path.cwd()
movies_db_path = CUR_DIR / "data" / "movies.json"

def get_movies():
    """get all movies in DB

    Returns:
        list: list of class Movie("Title")
    """
    with open(movies_db_path, "r") as f:
        movies_title = json.load(f)
        
    if movies_title == None:
        return None
    
    movies = [Movie(movie_title) for movie_title in movies_title]
    return movies
    
@dataclass
class Movie:
    """attribut:
        title: str, title of movie
    """

    title: str

    def __post_init__(self):
        self.title = self.title.title()
    
    def __str__(self) -> str:
        return self.title
    
    def _get_movies(self):
        with open(movies_db_path, "r") as f:
            list_movie = json.load(f)
            if list_movie is None:
                return []
            return list_movie
    
    def _write_movies(self, movies):
        with open(movies_db_path, "w") as f:
            json.dump(movies, f, indent=4)
            
    def add_to_movies(self):
        for movie in self._get_movies():
            if self.title == movie:
                logging.warning(f"{self.title} est déjà dans la liste")
                return False
        
        list_movies = self._get_movies()
        list_movies.append((self.title))
        print(list_movies)
        self._write_movies(list_movies)
        return True
        
    def remove_from_movies(self):
        movies = self._get_movies()

        if self.title not in movies:
            logging.warning(f"{self.title} n'est pas dans la liste")
            return False
        
        movies.remove(self.title)
        self._write_movies(movies)
        return True
