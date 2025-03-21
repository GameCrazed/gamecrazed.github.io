document.addEventListener('DOMContentLoaded', function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container') as HTMLElement;
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
});