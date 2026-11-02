# Full Page Capture

A dependency-free Chrome Manifest V3 extension for scrolling screenshots and local annotation.

## Install

Download this repository using **Code → Download ZIP** and extract it, or clone it:

```sh
git clone https://github.com/ar-titumir/full-page-capture.git
```

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** at the top right.
3. Click **Load unpacked** and select this `full-page-capture` folder.
4. Pin **Full Page Capture** from Chrome's extensions menu.

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

No build step. Edit the files, reload the extension at `chrome://extensions`, then refresh the website before testing capture again.

Run automated checks with `node --test tests/*.test.mjs`. The tests exercise capture coordination, tab-change protection, and frame storage using mocked Chrome APIs. For browser validation, use `tests/fixture.html` and the checklist in `tests/MANUAL.md`.

API reference: https://developer.chrome.com/docs/extensions/reference/api/tabs#method-captureVisibleTab

## License

This project is open source under the [MIT License](LICENSE).
