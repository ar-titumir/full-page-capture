# Full Page Capture

Take a picture of a long webpage, including the parts below your screen. Then highlight important text, draw notes, crop unwanted areas, resize the picture, and save or copy it.

**[Download the extension](https://github.com/ar-titumir/full-page-capture/releases/latest/download/full-page-capture.zip)** · [View all versions](https://github.com/ar-titumir/full-page-capture/releases)

You do not need coding experience or a GitHub account to download and use it. These instructions are for Google Chrome on a computer. The extension is not currently published in the Chrome Web Store; install it using the steps below. You do not need a developer account or to pay Google's publisher registration fee to use this download.

## Install in Chrome — no coding needed

Installation is needed only once. Allow about five minutes.

### 1. Download the file

Click **Download the extension** above. Your computer downloads a file named `full-page-capture.zip`, usually into your Downloads folder. A ZIP is a package containing several files.

If you visit the release page instead, look under **Assets** and select **full-page-capture.zip**. You do not need the separate “Source code” downloads.

### 2. Unpack the downloaded file

- **Windows:** Open Downloads, right-click `full-page-capture.zip`, choose **Extract All**, and click **Extract**.
- **Mac:** Open Downloads and double-click `full-page-capture.zip` to unpack it.
- **Linux:** Use your file manager's **Extract** option.

Find the extracted `full-page-capture` folder and move it somewhere you will keep it, such as Documents. Open the folder and check that a file named `manifest.json` is inside. If you see another `full-page-capture` folder instead, open that inner folder.

You do not need to open or edit any of the files. Remember which folder directly contains `manifest.json`—you will select that folder in step 4.

### 3. Open Chrome's extension settings

Open Google Chrome. Click the address bar at the top—the place that normally shows a website address. Type `chrome://extensions` and press Enter.

Turn on **Developer mode** at the top right. Despite its name, you do not need to be a developer; this switch shows the button for loading an extension from a folder.

### 4. Add the extension

Click **Load unpacked**. In the folder picker, select the folder that directly contains `manifest.json`, then click **Select Folder** or **Open**.

Select the folder, not the ZIP and not the `manifest.json` file itself. If successful, a **Full Page Capture** card appears on the extensions page.

**Keep the extracted folder where it is.** Chrome uses those files whenever the extension runs. Deleting or moving the folder can stop it working. You can delete the downloaded ZIP after installation if you wish.

### 5. Make its button easy to find

Click Chrome's puzzle-piece **Extensions** button near the top right. Click the pin beside **Full Page Capture**. Its button will now appear beside the address bar.

### 6. Try your first screenshot

Open an ordinary website, such as an article. If the website was already open during installation, refresh it. Click **Full Page Capture**, then **Automatic capture**. Keep that webpage visible while the extension works. When it finishes, an editing tab opens.

Click **Save PNG** in the editor to save your first screenshot. PNG is a common image-file format that you can open, send, or insert into a document.

[Chrome's official instructions for loading a local extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) provide additional installation help.

## Capture a webpage

Before starting, let the website's images load and close any unwanted pop-ups. For a page that loads more content as you scroll, scroll through the part you want first. The extension uses the page height available when capture starts.

During capture, keep the website and Chrome window active. Avoid switching tabs, changing the window size, or changing browser zoom.

### Automatic capture: let the extension scroll for you

1. Open the webpage you want to capture.
2. Click the extension's button beside Chrome's address bar.
3. Choose **Automatic capture**.
4. The extension starts at the top, scrolls down, and joins the sections into one long picture.
5. Wait for the editor to open, or click **Finish capture** to stop early and edit the part already captured.

The floating capture controls briefly disappear while each section is photographed. This keeps them out of your picture. Click **Finish capture** when the controls reappear between sections.

### Manual scrolling: choose when to capture each section

1. Open the webpage, click the extension, and choose **Manual scrolling**.
2. The page moves to the top. Click **Capture section** to capture the first screenful.
3. Click **Scroll to next**. This moves the webpage to a suitable position for the next section.
4. Wait for any images to load, then click **Capture section** again.
5. Repeat steps 3 and 4 until you have enough.
6. Click **Finish capture** to open the editor.

You can also scroll with your mouse instead of using **Scroll to next**. Leave a little of the previous section visible at the top so there is no gap. If a gap warning appears, use **Scroll to next** to return to a suitable position, then capture again. Scrolling alone does not take a screenshot in manual mode.

### Finish or cancel

| Button | What it does |
| --- | --- |
| **Finish capture** | Stops and opens the editor with the sections captured so far. A section already being captured finishes first. |
| **Cancel** | Stops and discards this capture without opening the editor. |

If you click **Finish capture** before taking any sections, the extension captures the first screenful before opening the editor. You do not have to reach the bottom of the page.

## Edit your screenshot

The new tab is called **Capture Studio**. Your screenshot is in the large area on the right. Scroll inside this area to see the lower parts of a long picture.

### Draw, highlight, or point something out

1. Choose a tool from the left side.
2. Choose a colored circle, or click **Custom color** to pick another color.
3. Adjust **Opacity** and **Thickness** if needed.
4. Hold your mouse button down on the picture, move the mouse, and release it to finish the mark.

| Tool or setting | Plain-language explanation |
| --- | --- |
| **Draw** | Draw a freehand line, circle, or handwritten mark. |
| **Highlight** | Draw a colored stroke over text or another area. It starts with a see-through color so the content stays visible. |
| **Rectangle** | Drag from one corner to the opposite corner to draw a box outline. |
| **Arrow** | Drag from the starting point toward the item you want to point at. |
| **Opacity** | How solid the color looks. Lower values are more see-through; 100% is solid. |
| **Thickness** | How wide the line is. A larger number makes a wider mark. |

For example, to highlight a sentence, choose **Highlight**, pick yellow, leave opacity around **35%**, and drag over the sentence. Adjust thickness to roughly match the text height. These settings affect new marks; they do not change marks you already drew.

**Undo** removes the most recent mark. **Redo** brings it back. **Clear annotations** removes all your drawn marks after confirmation. “Annotations” means the marks you added to the screenshot. Undo and redo apply to annotations; use the crop controls below to cancel or remove cropping.

### Crop: remove unwanted parts of the picture

Cropping keeps a selected area and removes the surrounding parts from your saved or copied image. Choose either method:

**Method A — draw a rectangle:**

1. Click **Crop image** above the picture.
2. Start inside the picture, away from an edge. Hold the mouse button down and drag across the area you want to keep.
3. Release the mouse button. The shaded area outside the rectangle will be removed.
4. Adjust the rectangle's edges if needed, then click **Apply crop**.

**Method B — drag an image edge or corner:**

1. Click **Crop image**. Small square handles appear around the image.
2. Point to an edge or corner. The mouse pointer changes to a resizing arrow.
3. Hold the mouse button down and drag inward. For example, drag the left edge to the right to trim the left side.
4. Release it. Adjust other edges if needed, then click **Apply crop**.

You can drag the edges of a rectangle you already selected too. Scroll the picture to reach its lower edge, or zoom out to see more of it.

- **Cancel crop**, or the Escape key, exits without applying your current selection.
- **Restore full image** brings back the complete original picture, keeping your drawn marks.
- After applying a crop, resize the result if you also need a specific output size. Applying or restoring a crop resets the width and height fields to that area's size.

### Resize: make the saved image smaller or larger

Use the **Width** and **Height** boxes above the picture. Their numbers are measured in pixels—the tiny dots that make up an image.

**Keep aspect ratio** means “keep the picture's proportions so it does not look stretched.” It is checked by default.

1. Leave **Keep aspect ratio** checked.
2. Enter the width you want. For example, change a 1,200-pixel-wide image to **600** to make it half as wide.
3. Height changes automatically. You cannot type into Height while the checkbox is checked.
4. Save or copy the image when you are happy with it. There is no separate Apply button for resizing.

To choose width and height separately, uncheck **Keep aspect ratio** and type both numbers. This may stretch or squash the picture. **Original size** resets the dimensions of the current picture; it does not undo cropping.

The picture preview, saved PNG, and copied image all use your selected dimensions. If a size is invalid, a message explains the limit and saving/copying is disabled until you enter a valid size.

### Zoom: make editing easier

Move the horizontal **Zoom** slider above the picture to choose between **1% and 200%**. For a specific value, type a percentage in the box on its right and press Enter (or click outside the box). The custom box also accepts values above 200%, such as **250** or **400**. If the custom value exceeds 200%, the slider stays at its right end while the box shows the actual zoom.

Click **Fit width** to make the picture fit the available width again. A smaller percentage shows more of a long image at once.

Zoom only changes how large the picture looks while editing. Use **Width** and **Height** to change the size of the saved or copied image.

## Save or copy the result

### Save an image file

1. Click **Save PNG** at the top right.
2. Chrome downloads the edited picture. Depending on your Chrome settings, it either saves automatically or asks where to put it.
3. Look in your **Downloads** folder or Chrome's Downloads menu.
4. Double-click the PNG file to open it. You can attach it to an email or share it like any other picture.

### Copy and paste into another app

1. Click **Copy image** and wait for the confirmation message at the bottom of the editor.
2. Open a chat, document, or image editor that accepts pasted images.
3. Click where the image should go and press **Ctrl+V** on Windows/Linux or **Command+V** on Mac.

Copying puts the picture on the clipboard, your computer's temporary holding area for copied items. It does not save a file. If the destination cannot accept images, use **Save PNG** and attach the saved file instead.

**Save or copy before closing or refreshing the editor.** Your edits are not automatically saved. Refreshing the editor loads the original screenshot and loses unsaved marks, crop choices, and resizing.

## Update to a newer version

1. Save any picture you are editing and close capture/editor tabs.
2. Download and extract the latest ZIP using the download link at the top of this page.
3. Open the new extracted folder. Copy its contents into the existing extension folder you kept during installation. Allow your computer to replace files with the same names.
4. In Chrome, type `chrome://extensions` into the address bar and press Enter.
5. Find **Full Page Capture** and click **Reload**, shown as a circular arrow. If needed, turn on Developer mode to see it.
6. Refresh the webpage you want to capture.

This installation does not update itself. Keep using the same installed folder so Chrome can find it.

## Turn off or remove the extension

Open `chrome://extensions` and find **Full Page Capture**.

- To stop it temporarily, turn off the switch on its card. Turn it on again when needed.
- To uninstall it, click **Remove** and confirm. You can then delete its extracted folder.

Removing the extension also removes its locally stored captures. PNG files you already downloaded remain on your computer.

## Troubleshooting

| What you see | What to try |
| --- | --- |
| “Manifest file is missing or unreadable” | Extract the ZIP first. Select the folder directly containing `manifest.json`, not the outer folder. |
| No **Load unpacked** button | Turn on Developer mode at `chrome://extensions`. On a managed work/school computer, an administrator may restrict this. |
| No extension button beside the address bar | Open Chrome's puzzle-piece Extensions menu and pin Full Page Capture. |
| The extension stopped working after deleting its folder | Download and extract it again, then load the folder using the installation steps. Keep that folder in place. |
| Capture does not start | Refresh the website and try again. Open an ordinary webpage; Chrome settings and Chrome Web Store pages cannot be captured this way. |
| A message says to keep the page active | Return to the website and keep its Chrome window in front. Retry the section or start again. |
| A gap warning in manual mode | Click **Scroll to next**, wait for the page to settle, then click **Capture section**. |
| The Finish button briefly disappears | The toolbar hides while a screenshot is taken. Use it when it reappears between sections. |
| Repeated, missing, or misaligned content | Let images load before starting. Animated or constantly changing sites may not join cleanly. Try manual capture and wait between sections. |
| Only part of a scrolling app is captured | Some apps scroll inside a small panel rather than the whole page. These layouts are not supported. |
| Height cannot be edited | Uncheck **Keep aspect ratio** if you want to set height separately. |
| Crop buttons seem inactive | First click **Crop image**, then draw a selection or drag an edge. Click **Apply crop** to finish. |
| Copy or Save is disabled | Finish or cancel the current crop selection and check that Width and Height contain valid whole numbers. |
| Pasting does not work | Some apps do not accept pasted images. Save PNG, then attach or insert the file. |
| You cannot find the saved picture | Check your Downloads folder or Chrome's Downloads menu. |
| A local HTML file cannot be captured | Open the extension's **Details** at `chrome://extensions` and enable **Allow access to file URLs**. |

For other problems, [open a GitHub issue](https://github.com/ar-titumir/full-page-capture/issues). Describe what you clicked, the message you saw, and your Chrome version. A GitHub account is required to post an issue. Avoid posting private screenshots or sensitive webpage content.

## Privacy and limits

Screenshots are processed on your computer. The extension does not upload your pictures, run analytics, or require an account. Original capture sections are stored locally in the extension's browser storage; uninstalling the extension removes them.

It captures the main webpage from top to bottom. Sideways scrolling and separate scrolling panels inside a page are not supported. Videos, animations, endlessly loading feeds, and content that moves while scrolling may not capture perfectly. Some fixed headers are shown once and hidden in later sections to avoid repetition.

Captures are limited to 80 sections and 100,000 CSS pixels of page height. Very large images are reduced to at most 30,000 pixels on either side and 40 million pixels in total. The editor tells you when it reduces a large capture. Resizing is subject to the same output limits.

## For developers

This is a dependency-free Chrome Manifest V3 extension. No build step is required.

```sh
git clone https://github.com/ar-titumir/full-page-capture.git
cd full-page-capture
node --test tests/*.test.mjs
```

After editing files, reload the extension at `chrome://extensions` and refresh the website. Automated tests use mocked Chrome APIs. See `tests/fixture.html` and `tests/MANUAL.md` for browser checks and `tests/RESULTS.md` for recorded validation and its limits.

[Chrome capture API reference](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-captureVisibleTab)

## License

Created by **ar-titumir** · [azizureee19@gmail.com](mailto:azizureee19@gmail.com). This credit also appears in the extension popup and at the bottom of Capture Studio, including after cropping.

Free and open source under the [MIT License](LICENSE).
