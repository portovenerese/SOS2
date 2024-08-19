document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lostObjectForm');
    const formGroups = document.querySelectorAll('.form-group');
    const objectSelect = document.getElementById('object');
    const otherObjectContainer = document.getElementById('otherObjectContainer');
    const whereSelect = document.getElementById('where');
    const additionalWhereInfo = document.getElementById('additionalWhereInfo');
    const regionSelect = document.getElementById('region');
    const provinceContainer = document.getElementById('provinceContainer');
    const provinceSelect = document.getElementById('province');
    const communeContainer = document.getElementById('communeContainer');
    const communeSelect = document.getElementById('commune');
    const submitButton = document.getElementById('submitButton');

    let currentGroupIndex = 0;

    // Popolare le regioni italiane
    const regions = ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'];
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    function showNextGroup() {
        if (currentGroupIndex < formGroups.length) {
            formGroups[currentGroupIndex].style.display = 'block';
            currentGroupIndex++;
        }
    }

    function checkAndProceed() {
        const currentGroup = formGroups[currentGroupIndex - 1];
        const input = currentGroup.querySelector('input, select, textarea');
        if (input && input.value) {
            showNextGroup();
        }
    }

    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('change', checkAndProceed);
        }
    });

    objectSelect.addEventListener('change', function() {
        otherObjectContainer.style.display = this.value === 'altro' ? 'block' : 'none';
        checkAndProceed();
    });

    whereSelect.addEventListener('change', function() {
        additionalWhereInfo.innerHTML = '';
        switch(this.value) {
            case 'mare':
                createSeaOptions();
                break;
            case 'spiaggia':
                createBeachOptions();
                break;
            case 'altro':
                createOtherLocationInput();
                break;
            default:
                additionalWhereInfo.style.display = 'none';
        }
        checkAndProceed();
    });

    regionSelect.addEventListener('change', function() {
        // Simula il caricamento delle province
        provinceContainer.style.display = 'block';
        provinceSelect.innerHTML = '<option value="">Seleziona</option><option value="provincia1">Provincia 1</option><option value="provincia2">Provincia 2</option>';
        communeContainer.style.display = 'none';
        checkAndProceed();
    });

    provinceSelect.addEventListener('change', function() {
        // Simula il caricamento dei comuni
        communeContainer.style.display = 'block';
        communeSelect.innerHTML = '<option value="">Seleziona</option><option value="comune1">Comune 1</option><option value="comune2">Comune 2</option>';
        checkAndProceed();
    });

    communeSelect.addEventListener('change', function() {
        submitButton.style.display = 'block';
    });

    function createSeaOptions() {
        additionalWhereInfo.innerHTML = `
            <div class="form-group">
                <label for="seaDepth">Profondità dell'acqua:</label>
                <select id="seaDepth" name="seaDepth" required>
                    <option value="">Seleziona</option>
                    <option value="bagnasciuga">Acqua bassa (bagnasciuga)</option>
                    <option value="unMetroMezzo">Acqua fino ad un metro e mezzo</option>
                    <option value="profonda">Acqua profonda</option>
                </select>
            </div>
            <div class="form-group">
                <label for="seaBottom">Tipologia di fondale:</label>
                <select id="seaBottom" name="seaBottom" required>
                    <option value="">Seleziona</option>
                    <option value="sabbia">Sabbia</option>
                    <option value="ghiaia">Ghiaia</option>
                    <option value="sabbiaGhiaia">Sabbia e ghiaia</option>
                    <option value="sassiGrandi">Sassi grandi</option>
                </select>
            </div>
        `;
        additionalWhereInfo.style.display = 'block';
    }

    function createBeachOptions() {
        additionalWhereInfo.innerHTML = `
            <div class="form-group">
                <label for="beachType">Tipologia di spiaggia:</label>
                <select id="beachType" name="beachType" required>
                    <option value="">Seleziona</option>
                    <option value="stabilimento">Stabilimento balneare</option>
                    <option value="pubblica">Spiaggia pubblica</option>
                </select>
            </div>
            <div class="form-group">
                <label for="beachSurface">Tipologia di spiaggia:</label>
                <select id="beachSurface" name="beachSurface" required>
                    <option value="">Seleziona</option>
                    <option value="sabbia">Sabbia</option>
                    <option value="ghiaia">Ghiaia</option>
                    <option value="sabbiaGhiaia">Sabbia e ghiaia</option>
                    <option value="sassiGrandi">Sassi grandi</option>
                </select>
            </div>
        `;
        additionalWhereInfo.style.display = 'block';
    }

    function createOtherLocationInput() {
        additionalWhereInfo.innerHTML = `
            <div class="form-group">
                <label for="otherLocation">Specificare altro luogo:</label>
                <input type="text" id="otherLocation" name="otherLocation" required>
            </div>
        `;
        additionalWhereInfo.style.display = 'block';
    }

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
                alert('I dati sono stati correttamente inviati.');
                form.reset();
                location.reload(); // Ricarica la pagina per ricominciare
            } else {
                alert('Si è verificato un errore durante l\'invio. Riprova più tardi.');
            }
        }).catch(error => {
            alert('Si è verificato un errore durante l\'invio. Riprova più tardi.');
            console.error('Errore:', error);
        });
    });

    showNextGroup(); // Mostra il primo gruppo all'avvio
});
