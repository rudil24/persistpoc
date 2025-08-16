import React, { useState, useEffect } from 'react';
import './App.css';

// The key we'll use to save and retrieve the form data from localStorage.
const LOCAL_STORAGE_KEY = 'proofOfConceptFormData';
const NUMBER_OF_LINES = 12;

// Helper function to initialize the form state.
const initializeState = () => Array.from({ length: NUMBER_OF_LINES }, () => '');

function App() {
  const [lines, setLines] = useState(initializeState);
  const [status, setStatus] = useState('Ready');

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length === NUMBER_OF_LINES) {
          setLines(parsedData);
          setStatus('Draft loaded from your last session.');
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setStatus('Could not load saved data.');
    }
  }, []);

  // Save data to localStorage whenever 'lines' changes
  useEffect(() => {
    try {
      if (lines.some(line => line !== '')) {
        const dataToSave = JSON.stringify(lines);
        localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
        setStatus('Progress saved automatically.');
      }
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      setStatus('Could not save progress.');
    }
  }, [lines]);

  const handleInputChange = (index, value) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Submitted:', lines);
    setStatus('Form submitted successfully!');
  };

  const handleClearForm = () => {
    setLines(initializeState());
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setStatus('Form cleared. Ready for a new entry.');
  };

  return (
    <>
      <div className="app-container">
        <div className="form-wrapper">
          <div className="header">
            <h1>Project Data Entry</h1>
            <p>Your progress is saved automatically. Feel free to refresh.</p>
          </div>

          <div className="status-display">
            <p>
              Status: <span className="status-text">{status}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="data-form">
            <div className="form-grid">
              {lines.map((line, index) => (
                <div key={index} className="input-row">
                  <label htmlFor={`line-${index}`} className="input-label">
                    {index + 1}.
                  </label>
                  <input
                    id={`line-${index}`}
                    type="text"
                    value={line}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Enter line ${index + 1}...`}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
            
            <div className="button-container">
              <button type="submit" className="button submit-button">
                Submit All {NUMBER_OF_LINES} Lines
              </button>
              <button type="button" onClick={handleClearForm} className="button clear-button">
                Clear Form & Saved Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
/* TIL: The empty angle brackets <> </> you are observing in App.jsx in a React application are a shorthand syntax for React Fragments. 
Purpose of React Fragments: 
React components are required to return a single parent element. This means if you want to render multiple elements (e.g., two paragraphs, a heading and a list), they must be wrapped within a single container. Traditionally, a div element was used for this purpose: 
function MyComponent() {
  return (
    <div>
      <h1>My Heading</h1>
      <p>Some text.</p>
    </div>
  );
}

While this works, it adds an extra div to the rendered HTML DOM, which can sometimes be undesirable for styling or semantic reasons. 
React Fragments (<> </>) solve this issue by: 

• Allowing multiple elements to be returned from a component: They act as a placeholder that fulfills the single-parent requirement without adding an actual DOM node to the final output. 
• Avoiding unnecessary DOM elements: This results in cleaner, more semantic HTML and can potentially improve performance by reducing the number of nodes in the DOM tree. 

In essence, <> </> is equivalent to <React.Fragment> </React.Fragment>, but offers a more concise syntax. You would use it when you need to group multiple elements within a component's return statement, but do not want to introduce an extra wrapper element in the rendered HTML. 

AI responses may include mistakes.
*/