const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';
import "./styles.css"
// Fungsi untuk mengambil catatan non-archived
async function fetchNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    const data = await response.json();
    return data.data; // Mengembalikan array catatan
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

// Fungsi untuk mengambil catatan archived
async function fetchArchivedNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/archived`);
    const data = await response.json();
    return data.data; // Mengembalikan array catatan archived
  } catch (error) {
    console.error('Error fetching archived notes:', error);
    return [];
  }
}

// Fungsi untuk menambahkan catatan baru
async function addNote(title, body) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    const data = await response.json();
    return data.data; // Mengembalikan catatan yang baru dibuat
  } catch (error) {
    console.error('Error adding note:', error);
    return null;
  }
}

// Fungsi untuk mengarsipkan catatan
async function archiveNote(noteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/archive`, {
      method: 'POST',
    });
    const data = await response.json();
    return data; // Mengembalikan respons dari API
  } catch (error) {
    console.error('Error archiving note:', error);
    return null;
  }
}

// Fungsi untuk meng-unarchive catatan
async function unarchiveNote(noteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/unarchive`, {
      method: 'POST',
    });
    const data = await response.json();
    return data; // Mengembalikan respons dari API
  } catch (error) {
    console.error('Error unarchiving note:', error);
    return null;
  }
}

// Fungsi untuk menghapus catatan
async function deleteNote(noteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data; // Mengembalikan respons dari API
  } catch (error) {
    console.error('Error deleting note:', error);
    return null;
  }
}

// Fungsi untuk menampilkan indikator loading
function showLoadingIndicator() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoadingIndicator() {
  document.getElementById('loading').style.display = 'none';
}

// Fungsi untuk merender catatan
async function renderNotes() {
  showLoadingIndicator();
  const notesGrid = document.getElementById('notesGrid');
  const archivedNotesGrid = document.getElementById('archivedNotesGrid');
  notesGrid.innerHTML = '';
  archivedNotesGrid.innerHTML = '';

  // Ambil catatan non-archived
  const notes = await fetchNotes();
  notes.forEach(note => {
    const noteCard = document.createElement('note-card');
    noteCard.setAttribute('id', note.id);
    noteCard.setAttribute('title', note.title);
    noteCard.setAttribute('body', note.body);
    noteCard.setAttribute('archived', note.archived);
    notesGrid.appendChild(noteCard);
  });

  // Ambil catatan archived
  const archivedNotes = await fetchArchivedNotes();
  archivedNotes.forEach(note => {
    const noteCard = document.createElement('note-card');
    noteCard.setAttribute('id', note.id);
    noteCard.setAttribute('title', note.title);
    noteCard.setAttribute('body', note.body);
    noteCard.setAttribute('archived', note.archived);
    archivedNotesGrid.appendChild(noteCard);
  });
  hideLoadingIndicator();
}

// Event listener untuk form
document.getElementById('addNoteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('noteTitle').value;
  const body = document.getElementById('noteBody').value;

  if (title && body) {
    showLoadingIndicator();
    await addNote(title, body);
    hideLoadingIndicator();
    renderNotes();

    document.getElementById('noteTitle').value = '';
    document.getElementById('noteBody').value = '';
  }
});

// Web Component untuk NoteCard
class NoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const id = this.getAttribute('id');
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const archived = this.getAttribute('archived') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        .note-card {
          background-color: white;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .note-card h3 { margin-top: 0; }
        .note-card p { margin: 0.5rem 0; }
        .note-card .actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .note-card .actions button {
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .note-card .actions button.delete {
          background-color: #ff4d4d;
          color: white;
        }
        .note-card .actions button.archive {
          background-color: #4d79ff;
          color: white;
        }
      </style>
      <div class="note-card">
        <h3>${title}</h3>
        <p>${body}</p>
        <div class="actions">
          <button class="delete">Delete</button>
          <button class="archive">
            ${archived ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
      deleteNote(id).then(() => renderNotes());
    });

    this.shadowRoot.querySelector('.archive').addEventListener('click', () => {
      if (archived) {
        unarchiveNote(id).then(() => renderNotes());
      } else {
        archiveNote(id).then(() => renderNotes());
      }
    });
  }
}

customElements.define('note-card', NoteCard);

// Inisialisasi awal
renderNotes();