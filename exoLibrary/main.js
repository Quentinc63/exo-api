let books = [];
let currentEditId = null;

async function fetchBookData(isbn) {
    try {
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        const data = await response.json();
        const bookKey = `ISBN:${isbn}`;

        if (data[bookKey]) {
            const book = data[bookKey];
            return {
                id: Date.now(),
                isbn: isbn,
                title: book.title || 'Titre inconnu',
                author: book.authors ? book.authors[0].name : 'Auteur inconnu',
                year: book.publish_date || 'Année inconnue',
                cover: book.cover ? book.cover.medium : null
            };
        } else {
            throw new Error('Livre non trouvé');
        }
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données');
    }
}

async function addBook() {
    const isbn = document.getElementById('isbn-input').value.trim();
    if (!isbn) {
        alert('Veuillez entrer un ISBN');
        return;
    }

    if (books.find(book => book.isbn === isbn)) {
        alert('Ce livre est déjà dans votre bibliothèque');
        return;
    }

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const bookData = await fetchBookData(isbn);
        books.push(bookData);
        document.getElementById('isbn-input').value = '';
        displayBooks();
        alert('Livre ajouté avec succès !');
    } catch (error) {
        alert(error.message);
    } finally {
        loading.style.display = 'none';
    }
}


function displayBooks() {
    const booksContainer = document.getElementById('books');
    if (books.length === 0) {
        booksContainer.innerHTML = '<p>Aucun livre dans votre bibliothèque</p>';
        return;
    }

    booksContainer.innerHTML = books.map(book => `
        <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px; display: flex; align-items: center;">
            ${book.cover ? `<img src="${book.cover}" alt="Couverture" style="width: 60px; height: 80px; margin-right: 15px;">` : ''}
            <div style="flex: 1;">
                <h3>${book.title}</h3>
                <p><strong>Auteur:</strong> ${book.author}</p>
                <p><strong>Année:</strong> ${book.year}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
            </div>
            <div>
                <button onclick="editBook(${book.id})">Modifier</button>
                <button onclick="deleteBook(${book.id})" style="background: red; color: white;">Supprimer</button>
            </div>
        </div>
    `).join('');
}

function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    currentEditId = id;
    document.getElementById('edit-title').value = book.title;
    document.getElementById('edit-author').value = book.author;
    document.getElementById('edit-year').value = book.year;
    document.getElementById('edit-cover').value = book.cover || '';

    document.getElementById('edit-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function saveEdit() {
    if (!currentEditId) return;

    const bookIndex = books.findIndex(b => b.id === currentEditId);
    if (bookIndex === -1) return;

    books[bookIndex].title = document.getElementById('edit-title').value;
    books[bookIndex].author = document.getElementById('edit-author').value;
    books[bookIndex].year = document.getElementById('edit-year').value;
    books[bookIndex].cover = document.getElementById('edit-cover').value;

    cancelEdit();
    displayBooks();
    alert('Livre modifié avec succès !');
}


function cancelEdit() {
    currentEditId = null;
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


function deleteBook(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
        books = books.filter(book => book.id !== id);
        displayBooks();
        alert('Livre supprimé avec succès !');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('isbn-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addBook();
        }
    });


    displayBooks();
});