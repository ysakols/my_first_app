document.addEventListener('DOMContentLoaded', function() {
    // Initialize Paragon Connect
    window.paragon.init({
        clientId: 'YOUR_PARAGON_CLIENT_ID', // Replace with your actual client ID
        onConnection: handleConnection,
        onError: handleError,
        onClose: handleClose
    });

    // Add event listener for the connection button
    const connectButton = document.getElementById('paragonConnect');
    connectButton.addEventListener('click', function() {
        window.paragon.connect(); // This should trigger the Google Sign-In process
    });

    // Create Connect Button
    const connectButtonElement = window.paragon.createConnectButton({
        elementId: 'paragon-connect-button',
        integrations: ['*'], // Allow all integrations, or specify which ones you want
        onConnection: handleConnection,
        onError: handleError,
        onClose: handleClose
    });

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Generate Documentation Logic
    const generateBtn = document.getElementById('generate');
    generateBtn.addEventListener('click', generateDocumentation);

    // Export Logic
    const exportBtn = document.querySelector('.export-btn');
    exportBtn.addEventListener('click', exportDocumentation);

    // Format Selection Logic
    const formatSelect = document.querySelector('.format-select');
    formatSelect.addEventListener('change', (e) => {
        updateExportButton(e.target.value);
    });
});

// Paragon Event Handlers
function handleConnection(connection) {
    console.log('Successfully connected:', connection);
    
    // Extract the token from the connection object
    const token = connection.token; // Ensure this is the correct property name
    
    // Send the token to your backend
    fetch('http://localhost:3333/auth/google/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({ token }) // Send the token in the request body if needed
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend:', data);
        if (data.success) {
            showToast('Successfully authenticated!');
        } else {
            showToast('Authentication failed: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error sending token to backend:', error);
        showToast('Error sending token: ' + error.message, 'error');
    });
    
    updateConnectionStatus(true, connection.integration);
}

function handleError(error) {
    console.error('Connection error:', error);
    showToast('Failed to connect: ' + error.message, 'error');
    updateConnectionStatus(false);
}

function handleClose() {
    console.log('Connection window closed');
}

function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    }, 3000);
}

function setLoading(element, isLoading) {
    if (isLoading) {
        element.disabled = true;
        element.dataset.originalText = element.textContent;
        element.textContent = 'Loading...';
    } else {
        element.disabled = false;
        element.textContent = element.dataset.originalText;
    }
}

function updateConnectionStatus(isConnected, integration = '') {
    const statusElement = document.getElementById('connection-status');
    if (isConnected) {
        statusElement.textContent = `Connected to ${integration}`;
        statusElement.className = 'connection-status connected';
    } else {
        statusElement.textContent = 'Not connected';
        statusElement.className = 'connection-status';
    }
}

function makeLinksClickable(element) {
    // URL pattern that matches http(s)://, www., and common TLDs
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[a-zA-Z]{2,}[^\s]*)|([^\s]+\.(com|org|net|edu|gov|io|dev)[^\s]*)/g;
    
    // Get all text nodes in the element
    const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    
    while (node = walk.nextNode()) {
        textNodes.push(node);
    }

    // Process each text node
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const matches = text.match(urlPattern);
        
        if (matches) {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            
            matches.forEach(match => {
                const startIndex = text.indexOf(match, lastIndex);
                
                // Add text before the link
                if (startIndex > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, startIndex)));
                }
                
                // Create the link
                const link = document.createElement('a');
                link.href = match.startsWith('http') ? match : `https://${match}`;
                link.textContent = match;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'editor-link';
                fragment.appendChild(link);
                
                lastIndex = startIndex + match.length;
            });
            
            // Add remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
}

function processGeneratedContent() {
    const docPreview = document.getElementById('docPreview');
    const finalPreview = document.getElementById('finalPreview');
    
    makeLinksClickable(docPreview);
    makeLinksClickable(finalPreview);
}

async function generateDocumentation() {
    const generateBtn = document.getElementById('generate');
    const requiredFields = ['projectName', 'description', 'audience'];
    const values = {};

    // Validate required fields
    for (const field of requiredFields) {
        const element = document.getElementById(field);
        values[field] = element.value.trim();
        
        if (!values[field]) {
            element.classList.add('error');
            showToast(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
            return;
        } else {
            element.classList.remove('error');
        }
    }

    values.style = document.getElementById('style').value;

    try {
        setLoading(generateBtn, true);

        // Get connected integrations data
        const connections = await window.paragon.getConnections();
        values.integrationData = connections;

        const response = await fetch('/api/generate-docs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to generate documentation');
        }

        const docPreview = document.getElementById('docPreview');
        docPreview.innerHTML = marked(data.content);
        
        // Make links clickable after content is generated
        processGeneratedContent();
        
        document.querySelector('[data-tab="review"]').click();
        showToast('Documentation generated successfully');

    } catch (error) {
        console.error('Error generating documentation:', error);
        showToast(error.message || 'Failed to generate documentation', 'error');
    } finally {
        setLoading(generateBtn, false);
    }
}

async function exportDocumentation() {
    const exportBtn = document.querySelector('.export-btn');
    const format = document.querySelector('.format-select').value;
    const content = document.getElementById('finalPreview').innerHTML;

    try {
        setLoading(exportBtn, true);
        
        switch (format) {
            case 'markdown':
                await downloadFile('documentation.md', content, 'text/markdown');
                break;
            case 'pdf':
                await generatePDF(content);
                break;
            case 'html':
                await downloadFile('documentation.html', content, 'text/html');
                break;
            default:
                throw new Error('Unsupported format');
        }

        showToast(`Successfully exported as ${format.toUpperCase()}`);
    } catch (error) {
        console.error('Export error:', error);
        showToast(`Failed to export: ${error.message}`, 'error');
    } finally {
        setLoading(exportBtn, false);
    }
}

async function generatePDF(content) {
    // This is a placeholder for PDF generation
    // You would typically use a library like jsPDF or make a server request
    throw new Error('PDF export not implemented yet');
}

function updateExportButton(format) {
    const exportBtn = document.querySelector('.export-btn');
    exportBtn.textContent = `Export as ${format.toUpperCase()}`;
}

async function downloadFile(filename, content, contentType) {
    try {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
    }
}
