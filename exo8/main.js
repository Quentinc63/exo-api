let db;

const request = indexedDB.open("ContactsDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    setup();
    loadContacts();
};

request.onerror = function (event) {
    console.error("Erreur ouverture DB:", event.target.error);
};

function setup() {
    document.getElementById("contact-form").onsubmit = function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        if (!name || !email) return;

        const tx = db.transaction("contacts", "readwrite");
        const store = tx.objectStore("contacts");
        const req = store.add({ name, email });

        req.onsuccess = function () {
            e.target.reset();
            loadContacts();
        };
        req.onerror = function (e) {
            console.error("Erreur ajout contact:", e.target.error);
        };
    };

    document.getElementById("search").oninput = loadContacts;
    document.getElementById("sort").onclick = loadContacts;
}

function loadContacts() {
    const tx = db.transaction("contacts", "readonly");
    const store = tx.objectStore("contacts");
    const req = store.getAll();

    req.onsuccess = function () {
        let contacts = req.result;
        const searchValue = document.getElementById("search").value.toLowerCase();
        if (searchValue) {
            contacts = contacts.filter(c => c.name.toLowerCase().includes(searchValue));
        }
        contacts.sort((a, b) => a.name.localeCompare(b.name));

        const ul = document.getElementById("contacts");
        ul.innerHTML = "";

        contacts.forEach(contact => {
            const li = document.createElement("li");
            li.textContent = `${contact.name} - ${contact.email} `;

            const btn = document.createElement("button");
            btn.textContent = "Supprimer";
            btn.onclick = function () {
                deleteContact(contact.id);
            };

            li.appendChild(btn);
            ul.appendChild(li);
        });
    };

    req.onerror = function (e) {
        console.error("Erreur lecture contacts:", e.target.error);
    };
}

function deleteContact(id) {
    const tx = db.transaction("contacts", "readwrite");
    const store = tx.objectStore("contacts");
    const req = store.delete(id);

    req.onsuccess = function () {
        loadContacts();
    };

    req.onerror = function (e) {
        console.error("Erreur suppression contact:", e.target.error);
    };
}
