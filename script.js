const envelope = document.querySelector('.envelope-wrapper');
const noButton = document.querySelector('.no');
const yesButton = document.querySelector('.yes');
const popup = document.getElementById('popup');
const yesSound = document.getElementById('yesSound'); // Reference to Yes sound
const noSound = document.getElementById('noSound');   // Reference to No sound
const closeBtn = document.querySelector('.close-btn');
const heart = document.querySelector('.heart');

// Set volume for sounds
yesSound.volume = 0.4; // Adjust the volume (0.0 to 1.0) for Yes sound
noSound.volume = 0.2;  // Adjust the volume (0.0 to 1.0) for No sound

// Store original positions
const originalNoTop = noButton.offsetTop;
const maxMoveDistance = 192; // 2 inches (96 DPI)
const minMoveDistance = 38;  // Minimum 1 cm (≈38px)

// Track movement for No button
let currentX = 0, currentY = 0;

noButton.style.transition = 'transform 0.3s ease-in-out'; // Smooth movement
yesButton.style.transition = 'transform 0.3s ease-in-out'; // Smooth jump

noButton.addEventListener('click', () => {
    noSound.play(); // Play No sound when No button is clicked
    let moveX, moveY, newX, newY;

    do {
        // Random movement within limits
        moveX = Math.floor(Math.random() * 161) - 80; // Move between -80 to 80px
        moveY = Math.floor(Math.random() * 161) - 80;
        newX = currentX + moveX;
        newY = currentY + moveY;
    } while (
        originalNoTop + newY > originalNoTop || // Prevent moving lower
        Math.sqrt(newX ** 2 + newY ** 2) > maxMoveDistance || // Stay within 2 inches
        Math.sqrt(moveX ** 2 + moveY ** 2) < minMoveDistance // Ensure at least 1 cm movement
    );

    // Apply new No button position
    currentX = newX;
    currentY = newY;
    noButton.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Make Yes button smoothly jump and return
    yesButton.style.transform = 'translateY(-20px)'; // Jump up at least 1 cm
    setTimeout(() => {
        yesButton.style.transform = 'translateY(0px)'; // Return to position smoothly
    }, 300);
});

yesButton.addEventListener('click', () => {
    yesSound.play(); // Play Yes sound when Yes button is clicked
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        ticks: 500,
        gravity: 0.2
    });
    popup.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

heart.addEventListener('click', () => {
    toggleEnvelope();
});

function toggleEnvelope() {
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const letter = document.querySelector('.envelope .letter');
    if (envelopeWrapper.classList.contains('flap')) {
        letter.style.bottom = '0'; // Move the letter back down to hide it
        letter.style.transform = 'translateX(-50%) scale(1)'; // Restore the original size and centering
        setTimeout(() => {
            envelopeWrapper.classList.remove('flap');
        }, 2000); // Delay flap closing by 2 seconds
    } else {
        envelopeWrapper.classList.add('flap');
        letter.style.bottom = '100px'; // Move the letter up to show it
        letter.style.transform = 'translateX(-50%) scale(1.5)'; // Enlarge the letter and maintain centering
    }
}

function closePopup() {
    popup.style.display = 'none';
}

function createFloatingElement(className, minSize, maxSize) {
    const element = document.createElement('div');
    element.className = `floating ${className}`;
    const size = Math.random() * (maxSize - minSize) + minSize;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${Math.random() * 100}vw`;
    element.style.animationDuration = `${Math.random() * 5 + 10}s`;
    document.body.appendChild(element);

    // Remove element after animation ends
    element.addEventListener('animationend', () => {
        element.remove();
    });
}

function addFloatingElements() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingElement('floating-heart', 20, 60);
            createFloatingElement('floating-note', 20, 60);
        }, i * 500);
    }
}

// Call the function to start floating elements as soon as the page loads
window.addEventListener('load', addFloatingElements);
