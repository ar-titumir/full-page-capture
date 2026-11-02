# Chrome acceptance checks

Load the unpacked extension, enable file URL access, then open `tests/fixture.html` in Chrome.

1. Automatic capture: keep the tab focused; expect an editor image exactly 2,573 CSS pixels high (scaled by device pixel ratio). The fixed header appears once; no capture toolbar, missing boundary, or duplicated footer appears. Original page scroll position is restored.
2. Manual capture: capture top, scroll too far, and verify the gap error. Use Scroll to next and capture more sections, then Finish capture. Also finish after just the first section and verify there is no blank area at the bottom.
3. Cancel midway; verify fixed elements return and the original scroll position is restored.
4. Change active tabs/windows during auto capture; verify a recoverable error rather than another page being added.
5. Draw/highlight in multiple colors and opacity/thickness values. Test Rectangle, Arrow, Shift, zoom, pointer release outside the canvas, undo/redo, and clear.
6. Save PNG and reopen it; verify annotation positions match the editor at 25%, fit, and 100% zoom. Copy image and paste it into an image-capable application.
7. Close an editor with unsaved annotations; verify Chrome's leave-page warning after interacting with the page.
8. Try an internal Chrome page, a horizontally overflowing page, a lazy-loaded page, and a page that scrolls inside a nested container. Verify restrictions and documented limitations.
9. In automatic mode, click Finish capture between sections. Verify it opens the editor once and stops scrolling. Finish before any section is captured and verify the first viewport is included.
10. Crop by dragging in either direction; cancel, apply, and restore the full image. Verify existing annotations stay aligned and new annotations work after cropping. Resize the crop with the aspect lock on/off, then save and copy it. Confirm that exports contain only the selected area without the selection border or shading.

These are manual acceptance steps, not a claim that they have all been executed.
