// File: src/admin/widgets/access-denied-widget.tsx
import { useEffect } from "react"

const AccessDeniedWidget = () => {
  useEffect(() => {
    // Inject CSS styles for the popup
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .access-denied-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
      }

      .access-denied-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .access-denied-icon {
        font-size: 60px;
        color: #ef4444;
        margin-bottom: 20px;
      }

      .access-denied-title {
        font-size: 24px;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 15px;
      }

      .access-denied-message {
        font-size: 16px;
        color: #6b7280;
        margin-bottom: 25px;
        line-height: 1.5;
      }

      .access-denied-button {
        background: #ef4444;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }

      .access-denied-button:hover {
        background: #dc2626;
      }
    `;
    document.head.appendChild(styleSheet);

    // Function to create and show the popup
    const createPopup = (message: string, details?: string) => {
      // Remove existing popup if any
      const existingPopup = document.getElementById('access-denied-popup');
      if (existingPopup) {
        existingPopup.remove();
      }

      const popup = document.createElement('div');
      popup.id = 'access-denied-popup';
      popup.className = 'access-denied-popup';
      
      popup.innerHTML = `
        <div class="access-denied-content">
          <div class="access-denied-icon">🚫</div>
          <div class="access-denied-title">Access Denied</div>
          <div class="access-denied-message">
            ${message}
            ${details ? `<br><br><strong>Details:</strong> ${details}` : ''}
          </div>
          <button class="access-denied-button" onclick="this.closest('.access-denied-popup').remove()">
            Understood
          </button>
        </div>
      `;
      
      document.body.appendChild(popup);
      
      // Auto-remove after 8 seconds
      setTimeout(() => {
        if (popup && popup.parentNode) {
          popup.remove();
        }
      }, 8000);
    };

    // Monitor fetch requests for 403 errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (response.status === 403) {
          const clonedResponse = response.clone();
          try {
            const errorData = await clonedResponse.json();
            createPopup(
              errorData.message || "You don't have permission to perform this action.",
              errorData.details || "Contact your administrator for access."
            );
          } catch {
            createPopup("You don't have permission to perform this action.");
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    // Monitor XMLHttpRequest for 403 errors
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      // Save method and url for later use if needed
      (this as any)._url = url;
      (this as any)._method = method;
      // Default async to true if undefined
      return originalXHROpen.call(this, method, url, async === undefined ? true : async, username, password);
    };

    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('load', function() {
        if (this.status === 403) {
          let message = "You don't have permission to perform this action.";
          let details = "Contact your administrator for access.";
          
          try {
            const response = JSON.parse(this.responseText);
            message = response.message || message;
            details = response.details || details;
          } catch (e) {
            // Use default message
          }
          
          createPopup(message, details);
        }
      });
      
      return originalXHRSend.call(this, ...args);
    };

    console.log('🔒 Access denied popup widget initialized');

    // Cleanup function to restore original methods
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
    };
  }, []);

  return null; // This widget doesn't render anything visible
};

// Widget configuration
export const config = defineWidgetConfig({
  zone: "product.list.before", // You can change this zone as needed
});

export default AccessDeniedWidget;
function defineWidgetConfig(config: { zone: string }) {
    return config;
}
