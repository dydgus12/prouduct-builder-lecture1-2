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
});
