for (const mode of ['auto', 'manual']) document.getElementById(mode).onclick = async () => {
  document.querySelectorAll('button').forEach(b => b.disabled = true);
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !/^(https?:|file:)/.test(tab.url || '')) throw new Error('Open a regular website first. Chrome internal pages cannot be scrolled by extensions.');
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['capture.js'] });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'start', mode });
    if (!response?.ok) throw new Error(response?.error || 'Unable to start capture.');
    window.close();
  } catch (error) {
    document.getElementById('status').textContent = error.message;
    document.querySelectorAll('button').forEach(b => b.disabled = false);
  }
};
