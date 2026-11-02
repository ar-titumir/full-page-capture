# Validation results

## Finish capture and cropping update (1.2.0)

All 12 Node tests passed, including partial-height finalization and rejection of gaps. Isolated headless Chrome checks passed for Finish capture in both modes during a frame, finishing before the first frame, and normal automatic completion. The content-script checks use a mocked extension messaging bridge. Crop selection, application, annotation alignment, cancel, full-image restoration, and cropping followed by resizing were verified; the Copy handler produced a decoded 150 × 120 PNG using a mocked clipboard sink. The updated editor screenshot was visually reviewed. Actual installed-extension capture and OS clipboard checks remain manual.

- JavaScript syntax checks passed for all extension scripts.
- Six Node tests passed for storage, editor launch, active-tab/window checks, tab changes during capture, session ownership, cancellation, frame rollback, and the section limit.
- An isolated headless Chrome session rendered the editor with a synthetic four-section image at 1,100 × 2,573 pixels. Pointer drawing, undo/redo, and PNG canvas encoding passed. The editor screenshot was visually reviewed.
- The content script ran against a real scrolling HTML fixture in headless Chrome with a mocked extension messaging bridge. Automatic scrolling completed, the toolbar was hidden during each capture request, the header visibility was restored, the toolbar was removed, and the original 125 px scroll position was restored.

The installed extension's actual `captureVisibleTab` permission flow, OS clipboard paste, manual capture controls, and download completion still require the checks in MANUAL.md. The browser tests above do not substitute for those checks.

## Resize update (1.1.0)

All 10 Node tests passed. Headless Chrome verified locked height, automatic proportional height, independent dimensions, invalid-size export blocking, and original-size reset. The actual PNG produced by the Copy image handler decoded to 550 x 700 pixels using a mocked clipboard sink; OS clipboard paste was not tested. The updated editor screenshot was visually reviewed.
