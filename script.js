// Global variables 
let apiKey = '';
const rootPath = 'https://mysite.itvarsity.org/api/ContactBook/';

// Check if API key exists when page loads
function checkApiKey()  {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
        apiKey = storedApiKey;
        // Show contacts page (Show page)
        showContacts();
        // Get contacts (API call)
        getContacts()
    }
}

// Setup the API Key and store it 
function setApiKey() {
    const inputApiKey = document.getElementById('apiKeyInput').ariaValueMax.trim()

    if (!inputApiKey){
        alert('Please enter an API key!');
        return;
    }

// Validate API key first
fetch(rootPath + "controller/api-key/?apiKey=" + inputApiKey)
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        if (data == "1") {
            apiKey = inputApiKey;
            localStorage.setItem("apiKey", apiKey);
            showContacts();
            getContacts();
        } else {
            alert("Invalid API key entered!");
        }
    })
    .catch(function (error) {
        alert('Error validation your API key. Please try again.');
    });
} 

// Show different pages
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'))

    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

function showContacts() {
    showPage('contactsPage');
}

function showAddContacts() {
    showPage('addContactPage');
    // Clear the form
    document.getElementById('addContactForm').reset();
}

function showEditContact(contactId) {
    showPage('editContactPage')
    // Load contact data for editing
    loadContactForEdit(contactId);
}

function getContacts() {
    const contactList = document.getElementById('contactsList');
    contactList.innerHTML = '<div class="loading contacts...</div>';

    fetch(rootPath + "controller/get-contacts/")
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            displayContacts(data);
        })
        .catch(function (error){
            contactsList.innerHTML = '<div class="error">Something went wrong, please try again later.</div>'
        });
}

function displayContacts(contacts) {
    const contactList = document.getElementById('contactsList');

    if (!contacts || contacts.length === 0) {
        contactsList.innerHTML = '<div class="loading">No contacts found. Add your first contact!</div>';
        return;
    }

    let html = '<div class="contacts-grid">';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        let avatarSrc = contact.avatar ?
            `${rootPath}controller/uploads/${contact.avatar}` :
            `https://ui-avatars.com/api/?name=${contact.firstname}+${contact.lastname}&background=ff6b6b&color=fff&size=120`;

        html += `
                <div class="contact-card>
                    <img src="${avatarSrc}" alt="Avatar" class="contact-avatar">
                    <div class="contact-name">${contact.firstname} ${contact.lastname}</div>
                    <div class="contact-details">
                        <P><strong>Mobile:</strong> ${contact.mobile}</p>
                        <p><strong>Email:</strong> ${contact.email}</P>
                    </div>
                    <div class="contact-actions">
                        <button class="btn btn-secondary" onclick="showEditContact('${contact.id}')"> Edit</button>
                        <button class="btn btn-danger" onclick="deleteContact('${contact.id}')"> Delete</button>
                    </div>
                </div>
        `;
    }

    html += '</div>';
    contactsList.innerHTML = html;
}

