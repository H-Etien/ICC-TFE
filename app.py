from PySide6 import QtWidgets as QW, QtCore
from movie import get_movies, Movie

class App(QW.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Ciné Club")
        self.setup_ui()
        self.populate_movies()
        self.setup_connections()

    def setup_ui(self):
        self.layout = QW.QVBoxLayout(self)
        
        self.le_movieTitle = QW.QLineEdit()
        self.btn_add_movie = QW.QPushButton("Ajouter un film")
        self.lw_liste_film = QW.QListWidget()
        self.lw_liste_film.setSelectionMode(QW.QListWidget.ExtendedSelection)
        self.btn_delete_movie = QW.QPushButton("Supprimer le(s) film(s)")
        
        self.layout.addWidget(self.le_movieTitle)
        self.layout.addWidget(self.btn_add_movie)
        self.layout.addWidget(self.lw_liste_film)
        self.layout.addWidget(self.btn_delete_movie)
        
    def populate_movies(self):
        list_movies = get_movies()
        
        if list_movies is None:
            return None
        
        self.lw_liste_film.clear()
        for movie in list_movies:
            lw_item = QW.QListWidgetItem(movie.title)
            lw_item.setData(QtCore.Qt.UserRole, movie)
            self.lw_liste_film.addItem(lw_item)
    
    def setup_connections(self):
        self.le_movieTitle.returnPressed.connect(self.add_movie)
        self.btn_add_movie.clicked.connect(self.add_movie)
        self.btn_delete_movie.clicked.connect(self.remove_movie)
    
    def add_movie(self):
        movie_title = self.le_movieTitle.text()
        
        if not movie_title:
            return False
        
        m = Movie(movie_title)
        resultat = m.add_to_movies()
        if resultat:
            self.populate_movies()
    
    def remove_movie(self):
        for selected_item in self.lw_liste_film.selectedItems():
            movie = selected_item.data(QtCore.Qt.UserRole)
            movie.remove_from_movies()
            self.lw_liste_film.takeItem(self.lw_liste_film.row(selected_item))


app = QW.QApplication([])
window = App()
window.show()
app.exec()