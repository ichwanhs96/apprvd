import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect, useRef } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useAuth } from '../context/AuthContext';
import { useContent, useCurrentDocId, useTemplateStore } from '../store';
import { useContractSelected } from '../store';

declare global {
  interface Window {
    tinymce: {
      activeEditor: TinyMCEEditor;
    };
  }
}

// Add this interface above the conversationDb declaration
interface Conversation {
  uid: string;
  comments: {
    uid: string;
    author: string | null | undefined;
    content: string;
    createdAt: string;
    modifiedAt: string;
  }[];
}

// Add proper typing for the callback parameters
interface TinyCommentsCallbackRequest {
  conversationUid?: string;
  commentUid?: string;
  content?: string;
  createdAt?: string;
}

interface TinyCommentsFetchRequest {
  conversationUid: string;
}

export default function TinyEditor() {
  const [localContent, setLocalContent] = useState('');
  const { content } = useContent()
  const editorRef = useRef<any>(null);
  // const rawTemplate = useTemplateStore((s) => s.rawTemplate);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useAuth();
  const { id } = useCurrentDocId();
  const { name } = useContractSelected();
  const [lastDocumentUpdateDate, setLastDocumentUpdateDate] = useState<Date | null>(new Date());

  const handleEditorChange = async (content: string) => {
    updateDocument(content);
  };

  // useEffect(() => {
  //   const createDocument = async () => {
  //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ content }),
  //     });

  //     const data = await response.json();
  //     setDocumentId(data.id);
  //   }

  //   createDocument();
  // }, []);

  const setTemplateVariables = useTemplateStore((s) => s.setVariables);

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'business-id': userInfo?.email || '',
            },
          }
        );
        const data = await response.json();
        const matches = [...data.content.matchAll(/\$\{(\w+)\}/g)];
        const vars: Record<string, string> = {};
        matches.forEach((match) => {
          vars[match[1]] = match[0]; // keep original like ${name}
        });

        // highlighting variables
        data.content = data.content.replace(/\$\{(.*?)\}/g, (match: string) => {
          return `<span data-mce-id="template-feature" style="background-color: #ffffe0;">${match}</span>`;
        });

        setTemplateVariables(vars);
        setLocalContent(data.content);
        useContent.setState({ content: data.content });
      } catch (error) {
        console.error('Failed to fetch document:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchDocument();
    }
  }, [id]);

  const updateDocument = async (content: string) => {
    // update every 5 seconds
    if (id && content && lastDocumentUpdateDate && lastDocumentUpdateDate.getTime() < new Date().getTime() - 5000) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'business-id': userInfo?.email || '',
          },
          body: JSON.stringify({ content, name }),
        });

        setLastDocumentUpdateDate(new Date());
      } catch (error) {
        console.error('Failed to save document:', error);
      }
    }
  };

  const currentAuthor = userInfo?.displayName;
  const userAllowedToResolve = userInfo?.displayName;

  // Update the conversationDb declaration
  const conversationDb: Record<string, Conversation> = {};
  
  const fakeDelay = 200;
  const randomString = () => crypto.getRandomValues(new Uint32Array(1))[0].toString(36).substring(2, 14);
  
  /********************************
   *   Tiny Comments functions    *
   * (must call "done" or "fail") *
   ********************************/
  
  // Update the callback functions with proper typing
  const tinycomments_create = async (
    req: TinyCommentsCallbackRequest, 
    done: (response: any) => void,
    fail: (error: Error) => void
  ) => {
    console.log('Creating comment with request:', req);
    if (!id) {
        return fail(new Error('Create Comment - Document ID is not set'));
    }

    try {
        const conversationUid = 'annotation-' + randomString();
        const commentUid = 'comment-' + randomString();
        
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'business-id': userInfo?.email || '',
            },
            body: JSON.stringify({
                content: req.content,
                author: currentAuthor,
                document_id: id,
                conversationUid,
                commentUid
            }),
        });
        
        // Important: TinyMCE expects just the conversationUid in a specific format
        console.log('Sending to TinyMCE - conversationUid:', conversationUid);
        done({ conversationUid: conversationUid });
    } catch (error) {
        console.error('Error creating comment:', error);
        fail(new Error('Failed to create comment'));
    }
  };

  const tinycomments_fetch = async(conversationUids: string[], done: any, fail: any) => {
    console.log('Fetching conversations for UIDs:', conversationUids);
    
    if (!id) {
        return fail(new Error('Fetch Comment - Document ID is not set'));
    }

    try {
        // Filter out empty strings and check if we have any valid UIDs
        const validUids = conversationUids.filter(uid => uid !== '' && uid.indexOf('tmp_') === -1);
        console.log('Valid UIDs after filtering:', validUids);
        
        if (validUids.length === 0) {
            console.log('No valid UIDs, returning empty conversations object');
            return done({ conversations: {} });
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/batch?conversation_uids=${validUids.join(',')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'business-id': userInfo?.email || '',
            },
        });
        const data = await response.json();
        const fetchedConversations = data.reduce((acc: Record<string, Conversation>, conv: { conversation: Conversation }) => {
            acc[conv.conversation.uid] = conv.conversation;
            return acc;
        }, {});

        console.log('fetchedConversations - ', fetchedConversations);
        // Now use the fetched conversations directly instead of relying on state
        done({ conversations: fetchedConversations });
    } catch (error) {
        console.error('Error fetching comments:', error);
        fail(error);
    }
  };
  
  const tinycomments_reply = (req: any, done: any, fail: any) => {
    console.log('tinycomments_reply - ', req);
    const { conversationUid, content, createdAt } = req;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/${conversationUid}`, {
      method: 'POST',
      body: JSON.stringify({ content: content, createdAt: createdAt, author: currentAuthor }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'business-id': userInfo?.email || '',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to reply to comment');
        }
        return response.json();
      })
      .then((ref2) => {
        let commentUid = ref2.commentUid;
        done({
          commentUid: commentUid,
          author: currentAuthor,
          authorName: currentAuthor,
        });
      })
      .catch((e) => {
        fail(e);
      });
  };
  
  const tinycomments_delete = async (req: any, done: any) => {
    console.log('tinycomments_delete - ', req);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email || '',
        },
        method: 'DELETE',
      });
      done({ canDelete: true });
    } catch (error) {
      done({ canDelete: false, reason: 'Failed to delete comment' });
    }
  };
  
  const tinycomments_resolve = async (req: any, done: any) => {
    console.log('tinycomments_resolve - ', req);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email || '',
        },
      });
      done({ canResolve: true });
    } catch (error) {
      done({ canResolve: false, reason: 'Failed to resolve comment' });
    }
  };
  
  const tinycomments_delete_comment = async (req: any, done: any) => {
    console.log('tinycomments_delete_comment - ', req);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email || '',
        },
      });
      done({ canDelete: true });
    } catch (error) {
      done({ canDelete: false, reason: 'Failed to delete comment' });
    }
  };
  
  const tinycomments_edit_comment = async (req: any, done: any) => {
    console.log('tinycomments_edit_comment - ', req);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email || '',
        },
        body: JSON.stringify({ content: req.content }),
      });
      done({ canEdit: true });
    } catch (error) {
      done({ canEdit: false, reason: 'Failed to edit comment' });
    }
  };
  
  const tinycomments_delete_all = (req: any, done: any) => {
    const conversation = conversationDb[req.conversationUid];
    if (currentAuthor === conversation.comments[0].author) { // Replace wth your own logic, e.g. check if user has admin priveleges
      delete conversationDb[req.conversationUid];
      setTimeout(() => done({ canDelete: true }), fakeDelay);
    } else {
      setTimeout(() => done({ canDelete: false, reason: 'Must be conversation author' }), fakeDelay);
    }
  };
  
  // Update the callback functions with proper typing
  const tinycomments_lookup = async (
    req: TinyCommentsFetchRequest, 
    done: (response: { conversation: Conversation }) => void
  ) => {
    console.log('lookup - ', req);
    // Add error handling
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email || '',
        },
      });

      const data = await response.json();
      const conversation: any = { conversation: {
        uid: data.conversation_uid,
        comments: data.comments
      }};
      console.log('lookupconversation - ', conversation);
      done(conversation);
    } catch (error) {
      console.error('Error fetching comment:', error);
      done({ conversation: { uid: '', comments: [] } });
    }
  };
  
  // Read the above `getAuthorInfo` function to see how this could be implemented
  const tinycomments_fetch_author_info = (done: any) => done({
    author: currentAuthor,
    authorName: currentAuthor,
  });

  // This is a placeholder function - replace with your actual API call
  async function fetchUsers(query: any) {
    // TODO: Implement your API call here
    // Example structure:
    // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/search?q=${query}`);
    // return await response.json();
    return [
      {
        id: 'testing@email.com',
        name: query.term
      }
    ];
  }
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setContent(content);
    }
  }, [content])

  return (
    <div style={{ 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      {!isLoading && (
        <Editor
          apiKey='k4y2ix28oqg99xygbhm1h5oq7wlmv8na1ot6aba5vz7mf5kh'
          onInit={(_, editor) => (editorRef.current = editor)}
          initialValue={localContent}
          init={{
            content_style: `
              body {
                background: #525659;
                padding: 30px;
                margin: 0;
              }
              .mce-content-body {
                max-width: 21cm;
                min-height: 29.7cm;
                padding: 2cm;
                margin: 0 auto 30px auto;
                border: 1px solid #d3d3d3;
                border-radius: 5px;
                background: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                box-sizing: border-box;
              }
              /* Style for both manual and automatic page breaks */
              .mce-pagebreak {
                border-top: 2px dashed #666;
                border-color: #666;
                height: 5px;
                page-break-before: always;
                margin: 30px 0;
                cursor: default;
                display: block;
              }
              /* Style specifically for automatic page breaks */
              .mce-auto-pagebreak {
                border-style: dotted;
                border-color: #999;
              }
              @page {
                size: A4;
                margin: 1cm;
              }
              @media print {
                body {
                  background: none;
                  padding: 0;
                }
                .mce-content-body {
                  margin: 0;
                  border: initial;
                  border-radius: initial;
                  width: initial;
                  min-height: initial;
                  box-shadow: initial;
                  background: initial;
                }
                .mce-pagebreak {
                  border: 0;
                  margin: 0;
                  page-break-after: always;
                }
              }
              .mention {
                background-color: #e8f4ff;
                padding: 2px 4px;
                border-radius: 3px;
                border: 1px solid #bce0ff;
                font-weight: 500;
                display: inline-block;
                cursor: pointer;
              }
              .mention:hover {
                background-color: #d8ecff;
              }
            `,
            width: '100%',
            height: '100vh',
            body_class: 'mce-content-body',
            content_css: 'document',
            menubar: 'file edit view insert format tools tc help',
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
              'image', 'table', 'link', 'lists', 'importword', 'exportword', 'exportpdf', 'tinycomments', 'quickbars',
              'pagebreak', 'mentions'
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
                title: 'Comment',
                items: 'addcomment showcomments deleteallconversations'
              }
            },
            toolbar:
              'styles | bold italic underline strikethrough code | forecolor backcolor | align lineheight | bullist numlist outdent indent | removeformat | restoredraft help addcomment showcomments addtemplate | annotate-alpha | ai-comment | pagebreak',
            toolbar_groups: {
              align: { icon: 'align-left', items: 'alignleft aligncenter alignright alignjustify' },
            },
            custom_elements: '~span[data-mce-id]',
            quickbars_selection_toolbar: 'alignleft aligncenter alignright | addcomment showcomments',
            tinycomments_mode: 'callback',
            tinycomments_create,
            tinycomments_reply,
            tinycomments_delete,
            tinycomments_resolve,
            tinycomments_delete_all,
            tinycomments_lookup,
            tinycomments_delete_comment,
            tinycomments_edit_comment,
            tinycomments_fetch,
            tinycomments_fetch_author_info,
            tinycomments_author: currentAuthor,
            tinycomments_can_resolve: () => userAllowedToResolve !== null,
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
            // Add mentions configuration
            mentions_selector: '.mention',
            mentions_min_chars: 1,
            mentions_fetch: async (query: string, success: Function) => {
              try {
                const users = await fetchUsers(query);

                success(users);
              } catch (error) {
                console.error('Error fetching users for mentions:', error);
                success([]);
              }
            },
            mentions_menu_hover: (userInfo: any, success: Function) => {
              const html = `
                <div style="padding: 10px;">
                  <div style="font-weight: bold;">${userInfo.name}</div>
                </div>
              `;
              success(html);
            },
            mentions_select: (mention: any, success: Function) => {
              const html = `<span class="mention" data-mention-id="${mention.id}">@${mention.name}</span>`;
              success(html);
            },
            setup: (editor) => {
              editor.on('mceAiComment', async (e: any) => {
                console.log('mceAiComment - ', e);

                const revealAdditionalToolbarButton = document.querySelector('[data-mce-name="overflow-button"]');
                  
                try {
                  const suggestions = e.suggestions || [];

                  // Process suggestions sequentially
                  for (const { target_text, suggestion } of suggestions) {
                    // Get content without formatting
                    const contentWithoutTags = editor.getContent({ format: 'text' });
                    const textIndex = contentWithoutTags.indexOf(target_text);
                    
                    if (textIndex !== -1) {
                      const walker = document.createTreeWalker(
                        editor.getBody(),
                        NodeFilter.SHOW_TEXT,
                        null
                      );
                      let node;
                      let found = false;

                      console.log("searching for " + target_text + " - " + suggestion);
                      
                      while ((node = walker.nextNode()) && !found) {
                        if (node.textContent && node.textContent.includes(target_text)) {
                          const startOffset = node.textContent.indexOf(target_text);
                          const endOffset = startOffset + target_text.length;

                          const range = editor.dom.createRng();
                          range.setStart(node, startOffset);
                          range.setEnd(node, endOffset);
                          editor.selection.setRng(range);
                          found = true;

                          console.log("found, adding comment");

                          // Wait for each comment to be fully processed
                          await new Promise((resolve) => {
                            console.log("adding comment...");
                            let addCommentButton = document.querySelector('[data-mce-name="addcomment"]');
                            console.log("addCommentButton - ", addCommentButton);
                            if (addCommentButton == null) {
                              if (revealAdditionalToolbarButton instanceof HTMLElement) {
                                revealAdditionalToolbarButton.click();
                                addCommentButton = document.querySelector('[data-mce-name="addcomment"]');
                              }
                            }

                            if (addCommentButton instanceof HTMLElement) {
                              console.log("adding comment " + target_text + " - " + suggestion);
                              addCommentButton.click();
                              
                              setTimeout(() => {
                                const commentDialog = document.querySelector('.tox-comment--selected');
                                const commentInput = commentDialog?.querySelector('.tox-textarea');
                                const submitButton = commentDialog?.querySelector('.tox-comment__edit button:nth-child(2)');
                                
                                if (commentInput instanceof HTMLTextAreaElement && 
                                    submitButton instanceof HTMLElement) {
                                  commentInput.value = suggestion;
                                  commentInput.dispatchEvent(new Event('input', { bubbles: true }));

                                  setTimeout(() => {
                                    submitButton.click();
                                    // Wait a bit after submission before processing next comment
                                    setTimeout(resolve, 1000);
                                  }, 500);
                                } else {
                                  resolve(undefined); // Resolve even if we couldn't find the elements
                                }
                              }, 500);
                            } else {
                              resolve(undefined); // Resolve if we couldn't find the add comment button
                            }
                          });
                        }
                      }
                    }
                  }

                  let addCommentButton = document.querySelector('[data-mce-name="addcomment"]');
                  if (addCommentButton instanceof HTMLElement) {
                    if (revealAdditionalToolbarButton instanceof HTMLElement) {
                      // closing the additional toolbar
                      revealAdditionalToolbarButton.click();
                    }
                  }

                  editor.focus();
                } catch (error) {
                  console.error('API comment error:', error);
                  alert('Failed to process API comments');
                }
              });

              editor.ui.registry.addButton('addtemplate', {
                icon: 'template', // You can use an existing icon or create your own
                tooltip: 'Add Template',
                onAction: function() {
                  // Open a dialog to get user input
                  openTemplateDialog(editor);
                }
              });
              
              // Function to open dialog and handle template insertion
              function openTemplateDialog(editor: any) {
                editor.windowManager.open({
                  title: 'Insert Template',
                  body: {
                    type: 'panel',
                    items: [
                      {
                        type: 'input',
                        name: 'template',
                      }
                    ]
                  },
                  buttons: [
                    {
                      type: 'cancel',
                      text: 'Cancel'
                    },
                    {
                      type: 'submit',
                      text: 'Insert',
                      primary: true
                    }
                  ],
                  onSubmit: function(api: any) {
                    // Get the template value from the dialog
                    const data = api.getData();
                    const templateValue = data.template;
                    // Insert the template at cursor position
                    editor.insertContent('<span style="background-color: #ffffe0;" data-mce-id="template-feature">${' + templateValue + '}</span>');
                    
                    // Update template variables
                    const content = editor.getContent();
                    const matches = [...content.matchAll(/\$\{(\w+)\}/g)];
                    const vars: Record<string, string> = {};
                    matches.forEach((match) => {
                      vars[match[1]] = match[0]; // keep original like ${name}
                    });
                    setTemplateVariables(vars);
                    
                    // Close the dialog
                    api.close();
                  }
                });
              }
              
              // Add a menu item
              editor.ui.registry.addMenuItem('addtemplate', {
                text: 'Add Template',
                icon: 'comment',
                onAction: function() {
                  openTemplateDialog(editor);
                }
              });

              // editor.ui.registry.addButton('ai-comment', {
              //   text: 'AI Comment',
              //   onAction: async () => {
              //     try {
              //       const annotations = [{ text: 'test', comment: 'test' }];

              //       annotations.forEach(({ text, comment }) => {
              //         // Get content without formatting
              //         const contentWithoutTags = editor.getContent({ format: 'text' });
              //         const textIndex = contentWithoutTags.indexOf(text);
                      
              //         if (textIndex !== -1) {
              //           const walker = document.createTreeWalker(
              //             editor.getBody(),
              //             NodeFilter.SHOW_TEXT,
              //             null
              //           );
              //           let node;
              //           let found = false;
                        
              //           while ((node = walker.nextNode()) && !found) {
              //             if (node.textContent && node.textContent.includes(text)) {
              //               const startOffset = node.textContent.indexOf(text);
              //               const endOffset = startOffset + text.length;

              //               // Create a range for the specific text
              //               const range = editor.dom.createRng();
              //               range.setStart(node, startOffset);
              //               range.setEnd(node, endOffset);

              //               // Set the selection to our range
              //               editor.selection.setRng(range);
              //               found = true;
                            
              //               // Simulate clicking the "Add Comment" button
              //               const addCommentButton = document.querySelector('[data-mce-name="addcomment"]');
              //               if (addCommentButton instanceof HTMLElement) {
              //                 addCommentButton.click();
                              
              //                 // Wait for the comment dialog to appear
              //                 setTimeout(() => {
              //                   // Find the comment input field and submit button
              //                   const commentDialog = document.querySelector('.tox-comment--selected');
              //                   const commentInput = commentDialog?.querySelector('.tox-textarea');
              //                   const submitButton = commentDialog?.querySelector('.tox-comment__edit button:nth-child(2)');
                                
              //                   if (commentInput instanceof HTMLTextAreaElement && 
              //                       submitButton instanceof HTMLElement) {
              //                     // Set the comment text
              //                     commentInput.value = comment;
                                  
              //                     // Dispatch input event to ensure TinyMCE recognizes the change
              //                     commentInput.dispatchEvent(new Event('input', { bubbles: true }));

              //                     setTimeout(() => {
              //                       submitButton.click();
              //                     }, 100); 
              //                   }
              //                 }, 250); // Increased timeout to ensure DOM elements are ready
              //               }
              //             }
              //           }
              //         }
              //       });

              //       editor.focus();
              //     } catch (error) {
              //       console.error('API comment error:', error);
              //       alert('Failed to process API comments');
              //     }
              //   }
              // });

              // Add automatic page break handling
              editor.on('NodeChange', () => {
                const body = editor.getBody();
                const pageHeight = 29.7 * 37.8; // A4 height in pixels (29.7cm * 37.8 pixels per cm)
                const contentPadding = 2 * 37.8; // 2cm padding in pixels
                const maxContentHeight = pageHeight - (2 * contentPadding); // Available content height per page

                // Update template variables whenever content changes
                const content = editor.getContent();
                const matches = [...content.matchAll(/\$\{(\w+)\}/g)];
                const vars: Record<string, string> = {};
                matches.forEach((match) => {
                  vars[match[1]] = match[0]; // keep original like ${name}
                });
                setTemplateVariables(vars);

                // Remove existing auto page breaks
                const existingAutoBreaks = body.querySelectorAll('.mce-auto-pagebreak');
                existingAutoBreaks.forEach((pageBreak: any) => {
                  pageBreak.remove();
                });

                let currentHeight = 0;
                // let lastBreakElement = null;

                // Iterate through all elements
                Array.from(body.children).forEach((element) => {
                  const elementHeight = (element as HTMLElement).offsetHeight;
                  
                  // Skip if it's a manual page break
                  if (element.classList.contains('mce-pagebreak')) {
                    currentHeight = 0;
                    // lastBreakElement = element;
                    return;
                  }

                  currentHeight += elementHeight;

                  // If content exceeds page height, insert a page break before this element
                  if (currentHeight > maxContentHeight && !element.classList.contains('mce-auto-pagebreak')) {
                    const pageBreak = editor.dom.create('div', {
                      'class': 'mce-pagebreak mce-auto-pagebreak',
                      'style': 'page-break-before: always; page-break-after: always;'
                    }, '<span style="display: none;">&nbsp;</span>');
                    
                    element.parentNode?.insertBefore(pageBreak, element);
                    currentHeight = elementHeight;
                    // lastBreakElement = pageBreak;
                  }
                });
              });
            },
            pagebreak_separator: '<div style="page-break-before: always; page-break-after: always;"><span style="display: none;">&nbsp;</span></div>',
            pagebreak_split_block: true
          }}
          onEditorChange={handleEditorChange}
        />
      )}
      {isLoading && <div>Loading document...</div>}
    </div>
  );
}
