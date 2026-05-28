# Installer Assets

`echothink-setup.ico` is the multi-resolution executable icon for the
`EchothinkBrowserSetup` installer (sizes 16, 20, 24, 32, 40, 48, 64, 128,
256 px). It shares the application artwork in `../icons/echothink.svg`.

## Deferred: installer banner / dialog images

Installer banner and dialog bitmaps (and their exact pixel dimensions) depend
on the installer technology selected in T30/T32 (for example, MSI/WiX dialog
bitmaps such as a 493x58 top banner and a 493x312 welcome/side image, or an
NSIS/Inno header and wizard image). Those exports are intentionally not created
here.

When T30/T32 selects the installer technology, add the required banner/dialog
PNGs/BMPs to this directory, derive them from `../icons/echothink.svg`, and
record their final dimensions in `../README.md` and the T30/T32 task notes.
