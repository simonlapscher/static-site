document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('signup-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeButton = modal.querySelector('.modal-close');
    const signUpButtons = document.querySelectorAll('.sign-up-btn, .cta-button');

    function openModal() {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        modal.classList.add('fade-in');
        overlay.classList.add('fade-in');
    }

    function closeModal() {
        modal.classList.add('fade-out');
        overlay.classList.add('fade-out');
        setTimeout(() => {
            modal.classList.add('hidden');
            overlay.classList.add('hidden');
            modal.classList.remove('fade-out');
            overlay.classList.remove('fade-out');
        }, 200);
    }

    signUpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}); 