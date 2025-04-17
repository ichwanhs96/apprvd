import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useAuth } from '../context/AuthContext';
import { useCurrentDocId } from '../store';
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
  const [content, setContent] = useState('');
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
  //     const response = await fetch(`http://localhost:5000/tinymce/documents`, {
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

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/tinymce/documents/${id}`);
        const data = await response.json();
        setContent(data.content);
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
        await fetch(`http://localhost:5000/tinymce/documents/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
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
  
  const resolvedConversationDb = {};
  
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
        
        await fetch(`http://localhost:5000/tinymce/documents/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

        const response = await fetch(`http://localhost:5000/tinymce/documents/${id}/comments/batch?conversation_uids=${validUids.join(',')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

    fetch(`http://localhost:5000/tinymce/documents/${id}/comments/${conversationUid}`, {
      method: 'POST',
      body: JSON.stringify({ content: content, createdAt: createdAt, author: currentAuthor }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
      await fetch(`http://localhost:5000/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        headers: {
          'Content-Type': 'application/json',
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
      await fetch(`http://localhost:5000/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
      await fetch(`http://localhost:5000/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
      await fetch(`http://localhost:5000/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`http://localhost:5000/tinymce/documents/${id}/comments/${req.conversationUid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

  return (
    <div>
      {!isLoading && (
        <Editor
          apiKey='0vco30s4ey7c3jdvmf8sl131uwqmic8ufbmattax46rmgw3k'
          init={{
            width: '100%',
            placeholder:"Write here...",
            height: 1000,
            menubar: 'file edit view insert format tools tc help',
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
                title: 'Comment',
                items: 'addcomment showcomments deleteallconversations'
              }
            },
            toolbar:
              'styles | bold italic underline strikethrough code | forecolor backcolor | align lineheight | bullist numlist outdent indent | removeformat | restoredraft help addcomment showcomments | annotate-alpha | ai-comment',
            toolbar_groups: {
              align: { icon: 'align-left', items: 'alignleft aligncenter alignright alignjustify' },
            },
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
                            
                            // Simulate clicking the "Add Comment" button
                            const addCommentButton = document.querySelector('[data-mce-name="addcomment"]');
                            if (addCommentButton instanceof HTMLElement) {
                              addCommentButton.click();
                              
                              // Wait for the comment dialog to appear
                              setTimeout(() => {
                                // Find the comment input field and submit button
                                const commentDialog = document.querySelector('.tox-comment--selected');
                                const commentInput = commentDialog?.querySelector('.tox-textarea');
                                const submitButton = commentDialog?.querySelector('.tox-comment__edit button:nth-child(2)');
                                
                                if (commentInput instanceof HTMLTextAreaElement && 
                                    submitButton instanceof HTMLElement) {
                                  // Set the comment text
                                  commentInput.value = comment;
                                  
                                  // Dispatch input event to ensure TinyMCE recognizes the change
                                  commentInput.dispatchEvent(new Event('input', { bubbles: true }));

                                  setTimeout(() => {
                                    submitButton.click();
                                  }, 100); 
                                }
                              }, 250); // Increased timeout to ensure DOM elements are ready
                            }
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
            },
          }}
          onEditorChange={handleEditorChange}
          initialValue={content}
        />
      )}
      {isLoading && <div>Loading document...</div>}
    </div>
  );
}
