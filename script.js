// script.js

document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners for "Try Now" buttons to open the chat interface
    const tryNowButtons = document.querySelectorAll(".try-now");
    tryNowButtons.forEach(button => {
        button.addEventListener("click", () => {
            openChat(button.getAttribute("data-element"));
        });
    });

    // Create an object to store specialized responses for specific elements
    const specializedResponses = {
        'Element 1': {
            response: 'Please provide the subject of your email.',
            prompt: 'Type the subject here...'
        },
        // Add more specialized responses for other elements as needed
    };

    // Function to open the chat interface for a specific element
    function openChat(element) {
        // Clear previous chat messages
        document.querySelector(".chat-container").innerHTML = '';

        // Update the selected element
        const chatContainer = document.querySelector(".chat-container");
        const elementSelected = document.createElement("div");
        elementSelected.classList.add("element-selected");
        elementSelected.textContent = element;
        chatContainer.appendChild(elementSelected);

        // Reset the input placeholder
        document.getElementById("user-input").placeholder = "Type your message";
    }

    // Add event listener for the send button to send a message to the OpenAI API
    const sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", () => {
        const userInput = document.getElementById("user-input").value;
        if (userInput) {
            displayUserMessage(userInput);

            // Check the selected element
            const selectedElement = document.querySelector(".element-selected").textContent;

            // Send the user input to the OpenAI API for a response
            sendUserInputToOpenAI(userInput, selectedElement);
        }
    });

    // Function to display user message in the chat
    function displayUserMessage(message) {
        const chatContainer = document.querySelector(".chat-container");
        const chatMessage = document.createElement("div");
        chatMessage.classList.add("message", "user");
        chatMessage.textContent = `You: ${message}`;
        chatContainer.appendChild(chatMessage);
        document.getElementById("user-input").value = '';
    }

    
    // Function to send user input to the OpenAI API
function sendUserInputToOpenAI(userInput, selectedElement) {
    // Define the OpenAI API endpoint and your API key
    const endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const apiKey = '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'; // Replace with your actual API key

    // Define the request data
    const requestData = {
        prompt: `Assist with ${selectedElement}: ${userInput}`,
        max_tokens: 100, // Adjust as needed
    };

    // Make a POST request to the OpenAI API
    fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.choices && data.choices.length > 0) {
            const assistantResponse = data.choices[0].text;
            displayAssistantMessage(assistantResponse);

            // Display the response in the response input field
            displayAssistantMessage(assistantResponse);
        } else {
            console.error('No valid response from OpenAI API.');
        }
    })
    .catch(error => {
        console.error('Error sending request to OpenAI API:', error);
    });
}


    // Function to display assistant message in the chat
    function displayAssistantMessage(message) {
        const chatContainer = document.querySelector(".chat-container");
        const chatMessage = document.createElement("div");
        chatMessage.classList.add("message", "assistant");
        chatMessage.textContent = `AI: ${message}`;
        chatContainer.appendChild(chatMessage);
    }
});
