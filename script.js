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

    // Funzione per mostrare il gruppo successivo
    function showNextGroup(currentGroup) {
        const nextGroup = currentGroup.nextElementSibling;
        if (nextGroup && nextGroup.classList.contains('form-group')) {
            nextGroup.style.display = 'block';
        }
    }

    // Event listeners per i campi del form
    formGroups.forEach((group, index) => {
        const input = group.querySelector('input, select');
        if (input) {
            input.addEventListener('input', function() {
                if (this.value) {
                    if (this.id !== 'item' && this.id !== 'location') {
                        showNextGroup(group);
                    }
                }
            });
// Gestione speciale per il campo "Oggetto smarrito"
            if (input.id === 'item') {
                input.addEventListener('change', function() {
                    const otherItemGroup = document.getElementById('otherItemGroup');
                    const locationGroup = document.querySelector('.form-group:has(#location)');
                    
                    if (this.value === 'Altro') {
                        otherItemGroup.style.display = 'block';
                        locationGroup.style.display = 'none';
                    } else {
                        otherItemGroup.style.display = 'none';
                        locationGroup.style.display = 'block';
                    }
                });
            }

           // Gestione speciale per il campo "Dove"
if (input.id === 'location') {
    input.addEventListener('change', function() {
        const seaDepthGroup = document.getElementById('seaDepthGroup');
        const beachTypeGroup = document.getElementById('beachTypeGroup');
        const beachSandTypeGroup = document.getElementById('beachSandTypeGroup');
        const otherLocationGroup = document.getElementById('otherLocationGroup');
        const regionGroup = document.querySelector('.form-group:has(#region)');

        seaDepthGroup.style.display = 'none';
        beachTypeGroup.style.display = 'none';
        beachSandTypeGroup.style.display = 'none';
        otherLocationGroup.style.display = 'none';
        regionGroup.style.display = 'none';

        if (this.value === 'Mare') {
            beachTypeGroup.style.display = 'block';
        } else if (this.value === 'Spiaggia') {
            beachTypeGroup.style.display = 'block';
        } else if (this.value === 'Altro') {
            otherLocationGroup.style.display = 'block';
            regionGroup.style.display = 'block';
        } else {
            regionGroup.style.display = 'block';
        }
    });
}

// Gestione speciale per il campo "Stabilimento balneare o spiaggia libera?"
if (input.id === 'beachType') {
    input.addEventListener('change', function() {
        const seaDepthGroup = document.getElementById('seaDepthGroup');
        const beachSandTypeGroup = document.getElementById('beachSandTypeGroup');
        const regionGroup = document.querySelector('.form-group:has(#region)');
        
        if (this.value) {
            const locationValue = document.getElementById('location').value;
            if (locationValue === 'Mare') {
                seaDepthGroup.style.display = 'block';
            } else if (locationValue === 'Spiaggia') {
                beachSandTypeGroup.style.display = 'block';
            }
            regionGroup.style.display = 'block';
        }
    });
}

            // Gestione speciale per il campo "Profondità del mare"
            if (input.id === 'seaDepth') {
                input.addEventListener('change', function() {
                    if (this.value) {
                        document.getElementById('seaBottomGroup').style.display = 'block';
                    }
                });
            }

            // Gestione speciale per il campo "Regione"
            if (input.id === 'region') {
                input.addEventListener('change', function() {
                    if (this.value) {
                        document.getElementById('provinceGroup').style.display = 'block';
                        populateProvince(this.value);
                    }
                });
            }

            // Gestione speciale per il campo "Provincia"
            if (input.id === 'province') {
                input.addEventListener('change', function() {
                    if (this.value) {
                        document.getElementById('communeGroup').style.display = 'block';
                        populateComuni(this.value);
                    }
                });
            }

            // Gestione speciale per il campo "Comune"
            if (input.id === 'commune') {
                input.addEventListener('change', function() {
                    if (this.value) {
                        document.getElementById('notesGroup').style.display = 'block';
                        submitBtn.style.display = 'block';
                    }
                });
            }
        }
    });

    // Event listener per l'invio del form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Implementazione dell'invio dei dati a Formspree
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
