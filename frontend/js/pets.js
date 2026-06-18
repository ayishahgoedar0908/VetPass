const apiBaseUrl = window.location.origin === 'null' ? 'http://localhost:3000' : window.location.origin;
const token = localStorage.getItem('vetpassToken');

if (!token) {
  window.location.href = 'login.html';
}

const petsTableBody = document.getElementById('petsTableBody');
const petCount = document.getElementById('petCount');
const petsSubtitle = document.getElementById('petsSubtitle');
const petMessage = document.getElementById('petMessage');
const petForm = document.getElementById('petForm');
const formTitle = document.getElementById('formTitle');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');
const refreshButton = document.getElementById('refreshButton');

const fields = {
  petId: document.getElementById('petId'),
  name: document.getElementById('name'),
  species: document.getElementById('species'),
  breed: document.getElementById('breed'),
  gender: document.getElementById('gender'),
  birth_date: document.getElementById('birth_date'),
  microchip_number: document.getElementById('microchip_number'),
  notes: document.getElementById('notes'),
};

function showMessage(text, kind) {
  petMessage.textContent = text;
  petMessage.hidden = false;
  petMessage.className = `alert ${kind === 'error' ? 'alert-error' : 'alert-success'}`;
}

function clearMessage() {
  petMessage.hidden = true;
  petMessage.textContent = '';
  petMessage.className = 'alert';
}

function resetForm() {
  petForm.reset();
  fields.petId.value = '';
  formTitle.textContent = 'Add pet';
  submitButton.textContent = 'Save pet';
  cancelEditButton.hidden = true;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderPets(pets) {
  petCount.textContent = `${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}`;
  petsSubtitle.textContent = pets.length
    ? 'Manage the pets linked to your account.'
    : 'No pets found yet. Add one using the form on the right.';

  if (!pets.length) {
    petsTableBody.innerHTML = '<tr><td colspan="5" class="muted">No pets found.</td></tr>';
    return;
  }

  petsTableBody.innerHTML = pets.map((pet) => `
    <tr>
      <td>${escapeHtml(pet.name)}</td>
      <td>${escapeHtml(pet.species)}</td>
      <td>${escapeHtml(pet.breed || '-')}</td>
      <td>${escapeHtml(pet.gender || 'unknown')}</td>
      <td>
        <div class="row">
          <button class="btn btn-secondary" type="button" data-edit='${encodeURIComponent(JSON.stringify(pet))}'>Edit</button>
          <button class="btn btn-accent" type="button" data-delete="${pet.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function loadPets() {
  clearMessage();
  petsTableBody.innerHTML = '<tr><td colspan="5" class="muted">Loading...</td></tr>';

  try {
    const response = await fetch(`${apiBaseUrl}/api/pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('vetpassToken');
      localStorage.removeItem('vetpassUser');
      window.location.href = 'login.html';
      return;
    }

    const data = await response.json().catch(() => []);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to load pets');
    }

    renderPets(Array.isArray(data) ? data : []);
  } catch (error) {
    petsTableBody.innerHTML = '<tr><td colspan="5" class="muted">Failed to load pets.</td></tr>';
    showMessage(error.message, 'error');
  }
}

petForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const payload = {
    name: fields.name.value.trim(),
    species: fields.species.value.trim(),
    breed: fields.breed.value.trim(),
    gender: fields.gender.value,
    birth_date: fields.birth_date.value || null,
    microchip_number: fields.microchip_number.value.trim(),
    notes: fields.notes.value.trim(),
  };

  const petId = fields.petId.value;
  const isEditMode = Boolean(petId);
  const url = isEditMode ? `${apiBaseUrl}/api/pets/${petId}` : `${apiBaseUrl}/api/pets`;
  const method = isEditMode ? 'PUT' : 'POST';

  submitButton.disabled = true;
  submitButton.textContent = isEditMode ? 'Updating...' : 'Saving...';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to save pet');
    }

    showMessage(isEditMode ? 'Pet updated.' : 'Pet added.', 'success');
    resetForm();
    await loadPets();
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = fields.petId.value ? 'Update pet' : 'Save pet';
  }
});

cancelEditButton.addEventListener('click', () => {
  resetForm();
  clearMessage();
});

refreshButton.addEventListener('click', loadPets);

petsTableBody.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-edit]');
  const deleteButton = event.target.closest('[data-delete]');

  if (editButton) {
    const pet = JSON.parse(decodeURIComponent(editButton.getAttribute('data-edit')));
    fields.petId.value = pet.id;
    fields.name.value = pet.name || '';
    fields.species.value = pet.species || '';
    fields.breed.value = pet.breed || '';
    fields.gender.value = pet.gender || 'unknown';
    fields.birth_date.value = pet.birth_date || '';
    fields.microchip_number.value = pet.microchip_number || '';
    fields.notes.value = pet.notes || '';
    formTitle.textContent = 'Edit pet';
    submitButton.textContent = 'Update pet';
    cancelEditButton.hidden = false;
    window.location.hash = '#petForm';
    return;
  }

  if (deleteButton) {
    const petId = deleteButton.getAttribute('data-delete');
    const confirmed = window.confirm('Delete this pet?');

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete pet');
      }

      showMessage('Pet deleted.', 'success');
      await loadPets();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }
});

loadPets();
