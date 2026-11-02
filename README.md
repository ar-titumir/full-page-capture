# Full Page Capture

A dependency-free Chrome Manifest V3 extension for scrolling screenshots and local annotation.

## Install in Chrome — no coding needed

**[Download the extension ZIP](https://github.com/ar-titumir/full-page-capture/releases/latest/download/full-page-capture.zip)** · [View releases](https://github.com/ar-titumir/full-page-capture/releases)

No terminal, Git, Node.js, or build step is needed. This release installs locally through Chrome's **Load unpacked** option; the ZIP is not a one-click Chrome Web Store installer.

1. **Download** `full-page-capture.zip` using the link above. On the release page, choose this file under **Assets**.
2. **Extract the ZIP.** On Windows, right-click it and choose **Extract All**. On macOS, double-click it. Move the extracted `full-page-capture` folder somewhere permanent, such as your Documents folder.
3. **Open Chrome's extensions page.** Type `chrome://extensions` into Chrome's address bar and press Enter.
4. **Turn on Developer mode** using the switch in the top-right corner.
5. **Click Load unpacked.** Select the extracted folder that directly contains `manifest.json`, then click **Select Folder** (or **Open**). Do not select the ZIP or a parent folder.
6. **Pin the extension.** Click Chrome's puzzle-piece **Extensions** button, then the pin beside **Full Page Capture**.
7. **Try it.** Open a normal website, refresh the page if it was already open, and click the extension icon. Choose **Automatic capture** or **Manual scrolling**.

The folder you select should look like this:

```text
full-page-capture/
  manifest.json      ← select the folder containing this file
  background.js
  capture.js
  editor.html
  ...
```

Keep the extracted folder in place: Chrome loads the extension from it. The release ZIP includes the extension, this guide, and the MIT license. GitHub's separate **Source code** archives are for the complete development project.

### Updating an existing installation

1. Download and extract the latest extension ZIP.
2. Close any capture/editor tabs after saving your work.
3. Copy the new folder's contents into the same folder you originally loaded, replacing the old files.
4. Open `chrome://extensions` and click **Reload** (the circular arrow) on the Full Page Capture card.
5. Refresh the webpage you want to capture.

Updates to this local installation are manual. You do not need to remove and reinstall the extension.

### Installation help

| Problem | What to do |
| --- | --- |
| “Manifest file is missing or unreadable” | Extract the ZIP first, then select the inner folder that directly contains `manifest.json`. |
| Load unpacked is missing | Enable Developer mode at `chrome://extensions`. If your organization disables it, ask your browser administrator. |
| The extension icon is missing | Open Chrome's puzzle-piece Extensions menu and pin Full Page Capture. |
| Capture does not start | Refresh the website and try again. Chrome internal pages and the Chrome Web Store are not supported. |
| A local HTML file cannot be captured | Open the extension's **Details** and enable **Allow access to file URLs**. |

See [Chrome's official local-extension installation instructions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) for more help.

## Capture

Open a website, click the extension, and choose:

- **Automatic capture**: scrolls from top to bottom, captures overlapping sections, and opens the editor. Keep the tab and Chrome window active.
- **Manual scrolling**: starts at the top. Click **Capture section**, then scroll down with some overlap and capture again. **Scroll to next** positions the page for you. Click **Finish capture** to open the editor.

In either mode, **Finish capture** stops the process and opens everything captured so far in the editor, without a blank area for the rest of the page. A section already being captured is completed first. If no section has been captured yet, it captures the first viewport before opening the editor. The toolbar briefly disappears while each screenshot is taken; use Finish capture when it reappears between sections. **Cancel** discards the capture instead.

The floating controls are hidden during capture. Cancel restores the original scroll position. Small fixed/sticky elements appear in the first section and are hidden for subsequent sections to reduce duplicates; their original inline visibility is restored afterward.

## Annotate and export

Use Draw, Highlight, Rectangle, or Arrow. Pick a preset or custom color, opacity (5–100%), and thickness (1–80 px). Hold Shift for aligned drawing or square rectangles. Undo/redo works with the buttons or Ctrl+Z / Ctrl+Shift+Z (Cmd on macOS). Zoom changes the view, not export resolution.

**Copy image** copies a PNG to the clipboard. **Save PNG** downloads the annotated image using Chrome's download settings. Annotations stay in the current editor tab; export before closing it. Reloading the editor restores the original screenshot, not unsaved annotations.

Use **Resize** above the canvas to set the output width and height in pixels. **Keep aspect ratio** is checked by default: only width is editable and height is calculated automatically from the original image proportions, rounded to the nearest pixel. Uncheck it to edit both dimensions independently. The preview and both export options use the new size, including all annotations. **Original size** restores the initial dimensions. Resizing preserves the original image internally, so repeated adjustments do not degrade it. Sizes must be positive whole pixels within the image limits below.

Use **Crop image**, drag across the image, and click **Apply crop**. You can scroll the canvas to reach another section and drag again to replace the selection. **Cancel crop** (or Escape) leaves the image unchanged. **Restore full image** removes all cropping while preserving annotations. Cropping resets the output dimensions to the selected area's pixel size; resize afterward if needed. Copy and Save include only the cropped area. The aspect-ratio checkbox follows the current cropped image's proportions.

## Scope and limits

- Captures the main document's vertical scrolling area. Nested scrolling apps, horizontally scrolling pages, browser internal pages, and Chrome Web Store pages are not supported.
- Local `file://` pages require enabling **Allow access to file URLs** in Chrome's extension details.
- Page height is fixed at capture start so infinite feeds terminate. Load any desired lazy content before starting. Videos, animations, virtualized lists, dynamically shifting content, and sites that react to scrolling may not stitch perfectly.
- Do not resize, zoom, switch tabs/windows, or drag the scrollbar while a section is being captured.
- Maximum 80 sections and 100,000 CSS pixels of page height. Large exports are reduced to at most 30,000 pixels per dimension and 40 megapixels to stay within practical canvas/memory limits. The editor reports when scaling occurs.
- Original capture sections are stored locally in the extension's IndexedDB so the editor survives a background-worker restart. Uninstalling the extension removes this data. There is no server, analytics, or external dependency.

## Development

Developers can clone the full project:

```sh
git clone https://github.com/ar-titumir/full-page-capture.git
cd full-page-capture
```

No build step. Edit the files, reload the extension at `chrome://extensions`, then refresh the website before testing capture again.

Run automated checks with `node --test tests/*.test.mjs`. The tests exercise capture coordination, tab-change protection, and frame storage using mocked Chrome APIs. For browser validation, use `tests/fixture.html` and the checklist in `tests/MANUAL.md`.

API reference: https://developer.chrome.com/docs/extensions/reference/api/tabs#method-captureVisibleTab

## License

This project is open source under the [MIT License](LICENSE).
