document.addEventListener('DOMContentLoaded', () => {
    console.log('Email signup script loaded');
    const form = document.getElementById('email-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('.submit-button');
            submitButton.disabled = true;
            
            // Add loading animation
            let dots = 1;
            const loadingInterval = setInterval(() => {
                submitButton.textContent = 'Submitting' + '.'.repeat(dots);
                dots = dots > 3 ? 1 : dots + 1;
            }, 300);
            
            const email = document.getElementById('email').value;
            
            const AIRTABLE_API_URL = "https://api.airtable.com/v0/appdEeKfiWqwxlKHT/Emails";
            const AIRTABLE_API_KEY = "patpQwaTP02AXo6A2.c627251802ff09d0114b8236936771e8439079010cafd22fca1251fabd600ee5";

            try {
                const response = await fetch(AIRTABLE_API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        records: [{
                            fields: {
                                "Email Address": email
                            }
                        }]
                    }),
                });

                // Clear loading state
                clearInterval(loadingInterval);

                if (response.ok) {
                    // Update modal content
                    const modalText = document.querySelector('.modal-text');
                    modalText.innerHTML = `
                        <p>Thank you for signing up to the waitlist!</p>
                        <p>&nbsp;</p>
                        <p>We'll reach out when it's your turn, get ready to build real wealth</p>
                    `;
                    modalText.classList.add('success-message');
                    form.style.display = 'none';
                } else {
                    const errorText = await response.text();
                    console.error('Response:', errorText);
                    submitButton.textContent = 'Get Early Access';
                    submitButton.disabled = false;
                    alert("Something went wrong. Please try again.");
                }
            } catch (error) {
                clearInterval(loadingInterval);
                console.error("Error:", error);
                submitButton.textContent = 'Get Early Access';
                submitButton.disabled = false;
                alert("An error occurred. Please try again later.");
            }
        });
    } else {
        console.error('Email form not found');
    }
});