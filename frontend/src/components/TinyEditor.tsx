import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    tinymce: {
      activeEditor: TinyMCEEditor;
    };
  }
}

export default function TinyEditor() {
  const [content, setContent] = useState('');
  const { userInfo } = useAuth();

  console.log(content)

  const handleEditorChange = (content: string) => {
    setContent(content);
    console.log('Edited content:', content);
  };

  const currentAuthor = userInfo?.displayName;
  const userAllowedToResolve = userInfo?.displayName;

  return (
    <div>
      <Editor
        apiKey='0vco30s4ey7c3jdvmf8sl131uwqmic8ufbmattax46rmgw3k'
        init={{
          width: '100%',
          placeholder:"Write here...",
          height: 1000,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
            'image', 'table', 'link', 'lists', 'importword', 'exportword', 'exportpdf', 'tinycomments', 'quickbars'
          ],
          menu: {
            file: { title: 'File', items: 'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: 'View', items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: 'Insert', items: 'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
            format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
            tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            help: { title: 'Help', items: 'help' },
            tc: {
              title: 'Comments',
              items: 'addcomment showcomments deleteallconversations'
            }
          },
          toolbar:
            'styles | bold italic underline strikethrough code | forecolor backcolor | align lineheight | bullist numlist outdent indent | removeformat | restoredraft help addcomment showcomments | annotate-alpha | ai-comment',
          toolbar_groups: {
            align: { icon: 'align-left', items: 'alignleft aligncenter alignright alignjustify' },
          },
          quickbars_selection_toolbar: 'alignleft aligncenter alignright | addcomment showcomments',
          tinycomments_mode: 'embedded',
          sidebar_show: 'showcomments',
          tinycomments_author: currentAuthor,
          tinycomments_can_resolve: (req: { comments: { author: string }[] }, done: (result: { canResolve: boolean }) => void, fail: () => void) => {
            console.log(fail)
            const allowed = req.comments.length > 0 &&
               req.comments[0].author === currentAuthor;
            done({
              canResolve: allowed || currentAuthor === userAllowedToResolve
            });
          },
          toolbar_sticky: true,
          images_file_types: 'jpg,jpeg,svg,webp',
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'file image media',
          file_picker_callback: (cb: (value: string, meta?: Record<string, any>) => void, value: string, meta: Record<string, any>) => {
            console.log(value, meta)
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                const file = target.files[0];

                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  const id = 'blobid' + (new Date()).getTime();
                  const editor = window.tinymce.activeEditor;
                  const blobCache = editor.editorUpload.blobCache;
                  const base64 = reader.result as string;
                  const blobInfo = blobCache.create(id, file, base64.split(',')[1]);
                  blobCache.add(blobInfo);

                  cb(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              }
            });

            input.click();
          },
          setup: (editor) => {
            editor.ui.registry.addButton('ai-comment', {
              text: 'AI Comment',
              onAction: async () => {
                const content = editor.getContent();
                
                try {
                  // const response = await fetch('your-api-endpoint', {
                  //   method: 'POST',
                  //   headers: {
                  //     'Content-Type': 'application/json',
                  //   },
                  //   body: JSON.stringify({ content }),
                  // });
                  
                  // const data = await response.json();
                  // // Expect API to return an array of { text: string, comment: string }
                  // const annotations = data.annotations;

                  const annotations = [{ text: 'test', comment: 'test' }];

                  annotations.forEach(({ text, comment }) => {
                    // Get content without formatting
                    const contentWithoutTags = editor.getContent({ format: 'text' });
                    const textIndex = contentWithoutTags.indexOf(text);
                    
                    if (textIndex !== -1) {
                      const walker = document.createTreeWalker(
                        editor.getBody(),
                        NodeFilter.SHOW_TEXT,
                        null
                      );
                      let node;
                      let found = false;
                      
                      while ((node = walker.nextNode()) && !found) {
                        if (node.textContent && node.textContent.includes(text)) {
                          const startOffset = node.textContent.indexOf(text);
                          const endOffset = startOffset + text.length;

                          // Create a range for the specific text
                          const range = editor.dom.createRng();
                          range.setStart(node, startOffset);
                          range.setEnd(node, endOffset);

                          // Set the selection to our range
                          editor.selection.setRng(range);
                          found = true;
                          
                          // Add annotation to the selected text
                          const uniqueId = 'api-' + (new Date()).getTime();
                          editor.annotator.annotate('tinycomments', {
                            uid: uniqueId,
                            comments: [{
                              content: comment,
                              author: currentAuthor,
                              uid: uniqueId,
                              createdAt: new Date().toISOString(),
                              modifiedAt: new Date().toISOString()
                            }]
                          });
                        }
                      }
                    }
                  });

                  editor.focus();
                } catch (error) {
                  console.error('API comment error:', error);
                  alert('Failed to process API comments');
                }
              }
            });

            editor.on('init', () => {
              // editor.annotator.register('ai-comment', {
              //   persistent: true,
              //   decorate: (uid, data) => ({
              //     attributes: {
              //       'data-mce-comment': data.comment ? data.comment : '',
              //       'data-mce-author': data.author ? data.author : 'anonymous'
              //     }
              //   })
              // });

              // editor.annotator.annotationChanged('tinycomments', (selected, annotatorName, context) => {
              //   console.log(selected, annotatorName, context)
              // });
            });
          }
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
