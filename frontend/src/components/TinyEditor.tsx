import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useAuth } from '../context/AuthContext';
import { useContent, useTemplateStore } from '../store';

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
  // const [content, setContent] = useState('');
  const { userInfo } = useAuth();
  const { content } = useContent()
  const editorRef = useRef<any>(null);
  const rawTemplate = useTemplateStore((s) => s.rawTemplate);

  const handleEditorChange = (content: string) => {
    // setContent(content);
    console.log(content)
    // useContent.setState({content});
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
  const tinycomments_create = (
    req: TinyCommentsCallbackRequest, 
    done: (response: { conversationUid: string }) => void,
    fail: (error: Error) => void
  ) => {
    if (req.content === 'fail') {
      fail(new Error('Something has gone wrong...'));
    } else {
      const uid = 'annotation-' + randomString();
      conversationDb[uid] = {
        uid,
        comments: [{
          uid,
          author: currentAuthor,
          content: req.content || '',
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        }]
      };
      setTimeout(() => done({ conversationUid: uid }), fakeDelay);
    }
  };
  
  const tinycomments_reply = (req: any, done: any) => {
    const replyUid = 'annotation-' + randomString();
    conversationDb[req.conversationUid].comments.push({
      uid: replyUid,
      author: currentAuthor,
      content: req.content,
      createdAt: new Date().toISOString(),
      modifiedAt: req.createdAt
    });
    setTimeout(() => done({ commentUid: replyUid }), fakeDelay);
  };
  
  const tinycomments_delete = (req: any, done: any) => {
    delete conversationDb[req.conversationUid];
    setTimeout(() => done({ canDelete: true }), fakeDelay);
  };
  
  const tinycomments_resolve = (req: any, done: any) => {
    delete conversationDb[req.conversationUid];
    setTimeout(() => done({ canResolve: true }), fakeDelay);
  };
  
  const tinycomments_delete_comment = (req: any, done: any) => {
    const oldcomments = conversationDb[req.conversationUid].comments;
    let reason = 'Comment not found';
  
    const newcomments = oldcomments.filter((comment) => {
      if (comment.uid === req.commentUid) { // Found the comment to delete
        if (currentAuthor === comment.author) { // Replace with your own logic, e.g. check if user has admin privileges
          return false; // Remove the comment
        } else {
          reason = 'Not authorised to delete this comment'; // Update reason
        }
      }
      return true; // Keep the comment
    });
    if (newcomments.length === oldcomments.length) {
      setTimeout(() => done({ canDelete: false, reason }), fakeDelay);
    } else {
      conversationDb[req.conversationUid].comments = newcomments;
      setTimeout(() => done({ canDelete: true }), fakeDelay);
    }
  };
  
  const tinycomments_edit_comment = (req: any, done: any) => {
    const oldcomments = conversationDb[req.conversationUid].comments;
    let reason = 'Comment not found';
    let canEdit = false;
  
    const newcomments = oldcomments.map((comment) => {
      if (comment.uid === req.commentUid) { // Found the comment to delete
        if (currentAuthor === comment.author) { // Replace with your own logic, e.g. check if user has admin privileges
          canEdit = true; // User can edit the comment
          return { ...comment, content: req.content, modifiedAt: new Date().toISOString() }; // Update the comment
        } else {
          reason = 'Not authorised to edit this comment'; // Update reason
        }
      }
      return comment; // Keep the comment
    });
  
    if (canEdit) {
      conversationDb[req.conversationUid].comments = newcomments;
      setTimeout(() => done({ canEdit }), fakeDelay);
    } else {
      setTimeout(() => done({ canEdit, reason }), fakeDelay);
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
  const tinycomments_lookup = (
    req: TinyCommentsFetchRequest, 
    done: (response: { conversation: Conversation }) => void
  ) => {
    // Add error handling
    if (!conversationDb[req.conversationUid]) {
      done({ conversation: { uid: '', comments: [] } }); // or handle the error appropriately
      return;
    }
    setTimeout(() => {
      done({
        conversation: {
          uid: conversationDb[req.conversationUid].uid,
          comments: [...conversationDb[req.conversationUid].comments]
        }
      });
    }, fakeDelay);
  };
  
  const tinycomments_fetch = (conversationUids: any, done: any) => {
    const fetchedConversations: Record<string, Conversation> = {};
    conversationUids.forEach((uid: any) => {
      const conversation = conversationDb[uid];
      if (conversation) {
        fetchedConversations[uid] = {...conversation};
      }
    });
    setTimeout(() => done({ conversations: fetchedConversations }), fakeDelay);
  };
  
  // Read the above `getAuthorInfo` function to see how this could be implemented
  const tinycomments_fetch_author_info = (done: any) => done({
    author: currentAuthor,
    authorName: currentAuthor,
  });

  // Add state management for conversations
  const [conversations, setConversations] = useState<Record<string, Conversation>>(conversationDb);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setContent(content);
    }
  }, [content])

  return (
    <div>
      <Editor
        apiKey='0vco30s4ey7c3jdvmf8sl131uwqmic8ufbmattax46rmgw3k'
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={rawTemplate}
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
        // onEditorChange={handleEditorChange}
      />
    </div>
  );
}
