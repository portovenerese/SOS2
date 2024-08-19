document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lostObjectForm');
    const formGroups = document.querySelectorAll('.form-group');
    const objectSelect = document.getElementById('object');
    const otherObjectContainer = document.getElementById('otherObjectContainer');
    const whereSelect = document.getElementById('where');
    const seaOptions = document.getElementById('seaOptions');
    const seaBottomOptions = document.getElementById('seaBottomOptions');
    const beachOptions = document.getElementById('beachOptions');
    const beachSurfaceOptions = document.getElementById('beachSurfaceOptions');
    const otherLocationContainer = document.getElementById('otherLocationContainer');
    const submitButton = document.getElementById('submitButton');

    let currentGroupIndex = 0;

    function showNextGroup() {
        if (currentGroupIndex < formGroups.length) {
            formGroups[currentGroupIndex].style.display = 'block';
            currentGroupIndex++;
        }
        if (currentGroupIndex === formGroups.length) {
            submitButton.style.display = 'block';
        }
    }

    formGroups.forEach((group, index) => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('change', function() {
                if (this.value) {
                    showNextGroup();
                }
            });
        }
    });

    objectSelect.addEventListener('change', function() {
        otherObjectContainer.style.display = this.value === 'altro' ? 'block' : 'none';
    });

    whereSelect.addEventListener('change', function() {
        seaOptions.style.display = 'none';
        seaBottomOptions.style.display = 'none';
        beachOptions.style.display = 'none';
        beachSurfaceOptions.style.display = 'none';
        otherLocationContainer.style.display = 'none';

        switch(this.value) {
            case 'mare':
                seaOptions.style.display = 'block';
                break;
            case 'spiaggia':
                beachOptions.style.display = 'block';
                break;
            case 'altro':
                otherLocationContainer.style.display = 'block';
                break;
        }
    });

    document.getElementById('seaDepth').addEventListener('change', function() {
        if (this.value) {
            seaBottomOptions.style.display = 'block';
        }
    });

    document.getElementById('beachType').addEventListener('change', function() {
        if (this.value) {
            beachSurfaceOptions.style.display = 'block';
        }
    });

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
