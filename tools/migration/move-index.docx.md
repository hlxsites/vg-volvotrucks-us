# Purpose

The move-index.docx.mjs scripts moves the index.docx file into the parent folder and uses the pages name instead. 
Instead of `/foo/index.docx` you will have `/foo.docx`.

# Steps
 - mount sharepoint folder with OneDrive locally
 - run script: `node move-index.docx.mjs`
 - run script again with code around line 61 and following uncommented to move the files
 - copy the output of redirects into redirectx.xlsx, and then use "Text To Columns" to split by | into two columns
 - for the following commands to clean up the folder:
 - ```
   find . -name '.DS_Store' -type f -delete
   find . -type d -empty -print
   find . -type d -empty -delete
   ```
 - preview and publish new the files
 - update redirect xlsx, preview, publish
 - test that all redirects work
 - un-preview and un-publish old files

# Notes

 - We used this on the Canadian site and it worked perfectly.
