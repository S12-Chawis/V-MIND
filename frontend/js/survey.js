// Survey system for user learning preferences

document.addEventListener('DOMContentLoaded', function() {
    // Initialize space background if available
    if (typeof initializeStarWarp === 'function') {
        initializeStarWarp();
    }

    const form = document.getElementById('characterizationForm');
    const options = document.querySelectorAll('.option');
    const submitButton = form.querySelector('.btn-submit');
    const loadingSpinner = form.querySelector('.loading-spinner');
    const successMessage = document.querySelector('.success-message');

    // Handle option clicks
    options.forEach(option => {
        option.addEventListener('click', function() {
            const input = this.querySelector('input[type="radio"], input[type="checkbox"]');
            
            if (input.type === 'checkbox') {
                this.classList.toggle('selected', input.checked);
            } else {
                input.checked = true;
                
                // Remove previous selection from same group
                const name = input.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
                    input.closest('.option').classList.remove('selected');
                });
                
                this.classList.add('selected');
            }
        });

        // Handle checkbox changes
        const checkbox = option.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                option.classList.toggle('selected', this.checked);
            });
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const technologiesCheckboxes = document.querySelectorAll('input[name="technologies"]:checked');
        
        if (technologiesCheckboxes.length === 0) {
            alert('Please select at least one technology');
            return;
        }

        submitButton.disabled = true;
        loadingSpinner.style.display = 'block';
        
        try {
            const surveyData = {
                experience: formData.get('experience'),
                learningStyle: formData.get('learningStyle'),
                timeCommitment: formData.get('timeCommitment'),
                developmentArea: formData.get('developmentArea'),
                technologies: Array.from(technologiesCheckboxes).map(cb => cb.value)
            };

            localStorage.setItem('userSurveyData', JSON.stringify(surveyData));
            localStorage.setItem('surveyCompleted', 'true');

            form.style.display = 'none';
            successMessage.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);

        } catch (error) {
            console.error('Error saving survey:', error);
            alert('There was an error saving your preferences. Please try again.');
        } finally {
            submitButton.disabled = false;
            loadingSpinner.style.display = 'none';
        }
    });
});

// Cancel survey and redirect
function cancelSurvey() {
    const existingSurveyData = localStorage.getItem('userSurveyData');
    
    if (existingSurveyData) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}
