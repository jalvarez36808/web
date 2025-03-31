document.addEventListener('DOMContentLoaded', function() {
    // Handle form submissions
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitContent();
        });
    }

    // Initialize video placeholders with click events
    initVideoPlaceholders();
});

// Function to handle content submission
function submitContent() {
    const form = document.getElementById('submitForm');
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const videoFile = document.getElementById('video').files[0];
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value;

    // Validate form
    if (!title || !description || !videoFile || !category) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    formData.append('category', category);
    formData.append('tags', tags);

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...';

    // Submit form data to server
    fetch('/api/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reset form
            form.reset();
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
            modal.hide();
            
            // Show success message
            showAlert('Your content has been submitted successfully!', 'success');
        } else {
            showAlert('Error: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('There was an error submitting your content. Please try again.', 'danger');
    })
    .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit';
    });
}

// Function to show alert messages
function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Find container to append alert
    const container = document.querySelector('.container:first-of-type');
    container.prepend(alertDiv);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Function to initialize video placeholders with click events
function initVideoPlaceholders() {
    const placeholders = document.querySelectorAll('.video-placeholder');
    
    placeholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // In a real implementation, this would play the video
            // For now, just change the icon to simulate a click
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play-circle')) {
                icon.classList.remove('fa-play-circle');
                icon.classList.add('fa-pause-circle');
            } else {
                icon.classList.remove('fa-pause-circle');
                icon.classList.add('fa-play-circle');
            }
        });
    });
}

// Like button functionality
document.addEventListener('click', function(event) {
    if (event.target.closest('.btn-outline-primary')) {
        const btn = event.target.closest('.btn-outline-primary');
        
        // Toggle active state
        btn.classList.toggle('active');
        
        // Update count if there's a number in the button
        const text = btn.textContent.trim();
        const count = parseInt(text.match(/\d+/));
        
        if (!isNaN(count)) {
            const icon = btn.querySelector('i');
            const newCount = btn.classList.contains('active') ? count + 1 : count - 1;
            btn.innerHTML = `${icon.outerHTML} ${newCount}`;
        }
    }
});
