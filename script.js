document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lostItemForm');
    const formGroups = form.querySelectorAll('.form-group');
    const submitBtn = document.getElementById('submitBtn');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopup');

    let italiaData;

    // Funzione per caricare i dati JSON
    async function loadItaliaData() {
        try {
            const response = await fetch('italia_data.json');
            italiaData = await response.json();
            populateRegioni();
        } catch (error) {
            console.error('Errore nel caricamento dei dati:', error);
        }
    }

    // Funzione per popolare le regioni
    function populateRegioni() {
        const regionSelect = document.getElementById('region');
        italiaData.regioni.forEach(regione => {
            const option = document.createElement('option');
            option.value = regione.nome;
            option.textContent = regione.nome;
            regionSelect.appendChild(option);
        });
    }

    // Funzione per popolare le province
    function populateProvince(regione) {
        const provinceSelect = document.getElementById('province');
        provinceSelect.innerHTML = '<option value="">Seleziona una provincia</option>';
        const regioneData = italiaData.regioni.find(r => r.nome === regione);
        if (regioneData) {
            regioneData.province.forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia.nome;
                option.textContent = provincia.nome;
                provinceSelect.appendChild(option);
            });
        }
    }

    // Funzione per popolare i comuni
    function populateComuni(provincia) {
        const comuneSelect = document.getElementById('commune');
        comuneSelect.innerHTML = '<option value="">Seleziona un comune</option>';
        const regioneData = italiaData.regioni.find(r => r.province.some(p => p.nome === provincia));
        if (regioneData) {
            const provinciaData = regioneData.province.find(p => p.nome === provincia);
            if (provinciaData) {
                provinciaData.comuni.forEach(comune => {
                    const option = document.createElement('option');
                    option.value = comune;
                    option.textContent = comune;
                    comuneSelect.appendChild(option);
                });
            }
        }
    }

    // Funzione per mostrare un gruppo specifico
    function showGroup(groupId) {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'block';
        }
    }

    // Funzione per nascondere un gruppo specifico
    function hideGroup(groupId) {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'none';
        }
    }

    // Funzione per nascondere tutti i gruppi dopo un certo punto
    function hideGroupsAfter(groupId) {
        let shouldHide = false;
        formGroups.forEach(group => {
            if (shouldHide) {
                group.style.display = 'none';
            }
            if (group.id === groupId) {
                shouldHide = true;
            }
        });
    }

    // Gestione del campo "Nome e cognome"
    document.getElementById('name').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('phoneGroup');
        }
    });

    // Gestione del campo "Numero di telefono"
    document.getElementById('phone').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('itemGroup');
        }
    });

    // Gestione del campo "Oggetto smarrito"
    document.getElementById('item').addEventListener('change', function() {
        hideGroupsAfter('itemGroup');
        if (this.value === 'Altro') {
            showGroup('otherItemGroup');
        } else {
            hideGroup('otherItemGroup');
            showGroup('locationGroup');
        }
    });

    // Gestione del campo "Altro oggetto"
    document.getElementById('otherItem').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('locationGroup');
        }
    });

    // Gestione del campo "Dove"
    document.getElementById('location').addEventListener('change', function() {
        hideGroupsAfter('locationGroup');
        switch(this.value) {
            case 'Mare':
            case 'Spiaggia':
                showGroup('beachTypeGroup');
                break;
            case 'Altro':
                showGroup('otherLocationGroup');
                break;
            default:
                showGroup('regionGroup');
        }
    });

    // Gestione del campo "Stabilimento balneare o spiaggia libera?"
    document.getElementById('beachType').addEventListener('change', function() {
        if (this.value) {
            const locationValue = document.getElementById('location').value;
            if (locationValue === 'Mare') {
                showGroup('seaDepthGroup');
            } else if (locationValue === 'Spiaggia') {
                showGroup('beachSandTypeGroup');
            }
        }
    });

    // Gestione del campo "Profondità del mare"
    document.getElementById('seaDepth').addEventListener('change', function() {
        if (this.value) {
            showGroup('seaBottomGroup');
        }
    });

    // Gestione del campo "Fondale marino"
    document.getElementById('seaBottom').addEventListener('change', function() {
        if (this.value) {
            showGroup('regionGroup');
        }
    });

    // Gestione del campo "Tipologia di spiaggia"
    document.getElementById('beachSandType').addEventListener('change', function() {
        if (this.value) {
            showGroup('regionGroup');
        }
    });

    // Gestione del campo "Altro luogo"
    document.getElementById('otherLocation').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('regionGroup');
        }
    });

    // Gestione del campo "Regione"
    document.getElementById('region').addEventListener('change', function() {
        if (this.value) {
            populateProvince(this.value);
            showGroup('provinceGroup');
        }
    });

    // Gestione del campo "Provincia"
    document.getElementById('province').addEventListener('change', function() {
        if (this.value) {
            populateComuni(this.value);
            showGroup('communeGroup');
        }
    });

    // Gestione del campo "Comune"
    document.getElementById('commune').addEventListener('change', function() {
        if (this.value) {
            showGroup('notesGroup');
            submitBtn.style.display = 'block';
        }
    });

    // Event listener per l'invio del form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                confirmationPopup.style.display = 'flex';
            } else {
                alert('Si è verificato un errore durante l\'invio del form. Per favore, riprova.');
            }
        }).catch(error => {
            console.error('Errore:', error);
            alert('Si è verificato un errore durante l\'invio del form. Per favore, riprova.');
        });
    });

    // Event listener per chiudere il popup
    closePopupBtn.addEventListener('click', function() {
        confirmationPopup.style.display = 'none';
        form.reset();
        formGroups.forEach(group => group.style.display = 'none');
        formGroups[0].style.display = 'block';
    });

    // Mostra il primo gruppo del form
    formGroups[0].style.display = 'block';

    // Carica i dati JSON
    loadItaliaData();
});document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lostItemForm');
    const formGroups = form.querySelectorAll('.form-group');
    const submitBtn = document.getElementById('submitBtn');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopup');

    let italiaData;

    // Funzione per caricare i dati JSON
    async function loadItaliaData() {
        try {
            const response = await fetch('italia_data.json');
            italiaData = await response.json();
            populateRegioni();
        } catch (error) {
            console.error('Errore nel caricamento dei dati:', error);
        }
    }

    // Funzione per popolare le regioni
    function populateRegioni() {
        const regionSelect = document.getElementById('region');
        italiaData.regioni.forEach(regione => {
            const option = document.createElement('option');
            option.value = regione.nome;
            option.textContent = regione.nome;
            regionSelect.appendChild(option);
        });
    }

    // Funzione per popolare le province
    function populateProvince(regione) {
        const provinceSelect = document.getElementById('province');
        provinceSelect.innerHTML = '<option value="">Seleziona una provincia</option>';
        const regioneData = italiaData.regioni.find(r => r.nome === regione);
        if (regioneData) {
            regioneData.province.forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia.nome;
                option.textContent = provincia.nome;
                provinceSelect.appendChild(option);
            });
        }
    }

    // Funzione per popolare i comuni
    function populateComuni(provincia) {
        const comuneSelect = document.getElementById('commune');
        comuneSelect.innerHTML = '<option value="">Seleziona un comune</option>';
        const regioneData = italiaData.regioni.find(r => r.province.some(p => p.nome === provincia));
        if (regioneData) {
            const provinciaData = regioneData.province.find(p => p.nome === provincia);
            if (provinciaData) {
                provinciaData.comuni.forEach(comune => {
                    const option = document.createElement('option');
                    option.value = comune;
                    option.textContent = comune;
                    comuneSelect.appendChild(option);
                });
            }
        }
    }

    // Funzione per mostrare un gruppo specifico
    function showGroup(groupId) {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'block';
        }
    }

    // Funzione per nascondere un gruppo specifico
    function hideGroup(groupId) {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'none';
        }
    }

    // Funzione per nascondere tutti i gruppi dopo un certo punto
    function hideGroupsAfter(groupId) {
        let shouldHide = false;
        formGroups.forEach(group => {
            if (shouldHide) {
                group.style.display = 'none';
            }
            if (group.id === groupId) {
                shouldHide = true;
            }
        });
    }

    // Gestione del campo "Nome e cognome"
    document.getElementById('name').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('phoneGroup');
        }
    });

    // Gestione del campo "Numero di telefono"
    document.getElementById('phone').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('itemGroup');
        }
    });

    // Gestione del campo "Oggetto smarrito"
    document.getElementById('item').addEventListener('change', function() {
        hideGroupsAfter('itemGroup');
        if (this.value === 'Altro') {
            showGroup('otherItemGroup');
        } else {
            hideGroup('otherItemGroup');
            showGroup('locationGroup');
        }
    });

    // Gestione del campo "Altro oggetto"
    document.getElementById('otherItem').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('locationGroup');
        }
    });

    // Gestione del campo "Dove"
    document.getElementById('location').addEventListener('change', function() {
        hideGroupsAfter('locationGroup');
        switch(this.value) {
            case 'Mare':
            case 'Spiaggia':
                showGroup('beachTypeGroup');
                break;
            case 'Altro':
                showGroup('otherLocationGroup');
                break;
            default:
                showGroup('regionGroup');
        }
    });

    // Gestione del campo "Stabilimento balneare o spiaggia libera?"
    document.getElementById('beachType').addEventListener('change', function() {
        if (this.value) {
            const locationValue = document.getElementById('location').value;
            if (locationValue === 'Mare') {
                showGroup('seaDepthGroup');
            } else if (locationValue === 'Spiaggia') {
                showGroup('beachSandTypeGroup');
            }
        }
    });

    // Gestione del campo "Profondità del mare"
    document.getElementById('seaDepth').addEventListener('change', function() {
        if (this.value) {
            showGroup('seaBottomGroup');
        }
    });

    // Gestione del campo "Fondale marino"
    document.getElementById('seaBottom').addEventListener('change', function() {
        if (this.value) {
            showGroup('regionGroup');
        }
    });

    // Gestione del campo "Tipologia di spiaggia"
    document.getElementById('beachSandType').addEventListener('change', function() {
        if (this.value) {
            showGroup('regionGroup');
        }
    });

    // Gestione del campo "Altro luogo"
    document.getElementById('otherLocation').addEventListener('input', function() {
        if (this.value.trim() !== '') {
            showGroup('regionGroup');
        }
    });

    // Gestione del campo "Regione"
    document.getElementById('region').addEventListener('change', function() {
        if (this.value) {
            populateProvince(this.value);
            showGroup('provinceGroup');
        }
    });

    // Gestione del campo "Provincia"
    document.getElementById('province').addEventListener('change', function() {
        if (this.value) {
            populateComuni(this.value);
            showGroup('communeGroup');
        }
    });

    // Gestione del campo "Comune"
    document.getElementById('commune').addEventListener('change', function() {
        if (this.value) {
            showGroup('notesGroup');
            submitBtn.style.display = 'block';
        }
    });

    // Event listener per l'invio del form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                confirmationPopup.style.display = 'flex';
            } else {
                alert('Si è verificato un errore durante l\'invio del form. Per favore, riprova.');
            }
        }).catch(error => {
            console.error('Errore:', error);
            alert('Si è verificato un errore durante l\'invio del form. Per favore, riprova.');
        });
    });

    // Event listener per chiudere il popup
    closePopupBtn.addEventListener('click', function() {
        confirmationPopup.style.display = 'none';
        form.reset();
        formGroups.forEach(group => group.style.display = 'none');
        formGroups[0].style.display = 'block';
    });

    // Mostra il primo gruppo del form
    formGroups[0].style.display = 'block';

    // Carica i dati JSON
    loadItaliaData();
});
