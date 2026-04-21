class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const delay = this.getAttribute('delay');

        this.shadowRoot.innerHTML = `
            <style>
                .lotto-ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--text-color, #ffffff);
                    background: linear-gradient(135deg, var(--primary-color, #ff3cac), var(--secondary-color, #784ba0));
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2);
                    transform: scale(0);
                    animation: bounceIn 0.5s forwards;
                    animation-delay: ${delay}s;
                    transition: background 0.5s ease, box-shadow 0.5s ease, color 0.5s ease;
                }

                @keyframes bounceIn {
                    0% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                @media (max-width: 600px) {
                    .lotto-ball {
                        width: 45px;
                        height: 45px;
                        font-size: 1.2rem;
                    }
                }
            </style>
            <div class="lotto-ball">${number}</div>
        `;
    }
}

customElements.define('lotto-ball', LottoBall);

const generateBtn = document.querySelector('.generate-btn');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeToggleBtn = document.getElementById('theme-toggle');
const messageOutput = document.getElementById('message-output');

function displayMessage(message, type = 'info') {
    messageOutput.textContent = message;
    messageOutput.className = `message-output ${type}`;
    // Clear message after some time
    setTimeout(() => {
        messageOutput.textContent = '';
        messageOutput.className = 'message-output';
    }, 3000);
}

// Set initial theme based on localStorage or system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === 'light-mode') {
        themeToggleBtn.textContent = '다크 모드';
    } else {
        themeToggleBtn.textContent = '라이트 모드';
    }
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    // System is in light mode
    document.body.classList.add('light-mode');
    themeToggleBtn.textContent = '다크 모드';
} else {
    // Default to dark mode
    themeToggleBtn.textContent = '라이트 모드';
}

themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark-mode');
        themeToggleBtn.textContent = '라이트 모드';
        displayMessage('다크 모드가 활성화되었습니다.');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
        themeToggleBtn.textContent = '다크 모드';
        displayMessage('라이트 모드가 활성화되었습니다.');
    }
});

generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const lottoNumbers = new Set();

    while(lottoNumbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        lottoNumbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(lottoNumbers).sort((a,b) => a - b);

    sortedNumbers.forEach((number, index) => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoBall.setAttribute('delay', index * 0.1);
        lottoNumbersContainer.appendChild(lottoBall);
    });
    displayMessage('새로운 로또 번호가 생성되었습니다!');
});

// Contact Form Submission Handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formButton = contactForm.querySelector('.submit-btn');
        formButton.disabled = true; // Disable button to prevent multiple submissions
        formButton.textContent = '전송 중...'; // Change button text

        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            displayMessage('제휴 문의가 성공적으로 전송되었습니다!', 'success');
            contactForm.reset(); // Clear form fields
        } else {
            const data = await response.json();
            if (Object.hasOwnProperty.call(data, 'errors')) {
                displayMessage(data["errors"].map(error => error["message"]).join(", "), 'error');
            } else {
                displayMessage('제휴 문의 전송에 실패했습니다. 다시 시도해주세요.', 'error');
            }
        }
        formButton.disabled = false; // Re-enable button
        formButton.textContent = '문의하기'; // Restore button text
    });
}

// Modal functionality for Partnership Inquiry Form
const partnershipInquiryBtn = document.getElementById('partnership-inquiry-btn');
const partnershipInquiryModal = document.getElementById('partnership-inquiry-modal');
const closeInquiryModalBtn = partnershipInquiryModal ? partnershipInquiryModal.querySelector('.close-modal-btn') : null;

if (partnershipInquiryBtn && partnershipInquiryModal && closeInquiryModalBtn) {
    partnershipInquiryBtn.addEventListener('click', () => {
        partnershipInquiryModal.classList.add('show');
        document.body.classList.add('modal-open');
    });

    closeInquiryModalBtn.addEventListener('click', () => {
        partnershipInquiryModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    });

    // Close modal when clicking outside of the content
    partnershipInquiryModal.addEventListener('click', (event) => {
        if (event.target === partnershipInquiryModal) {
            partnershipInquiryModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    });
}
