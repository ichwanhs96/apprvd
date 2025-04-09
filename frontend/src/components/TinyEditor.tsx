import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
// import tinymce from 'tinymce';

export default function TinyEditor (){
  const [content, setContent] = useState('');


  console.log(content);
  const handleEditorChange = (content: any) => {
    setContent(content);
    console.log('Edited content:', content);
  };

  return (
    <div>
      <Editor
        apiKey='0vco30s4ey7c3jdvmf8sl131uwqmic8ufbmattax46rmgw3k'
        init={{
          width: 2000,
          placeholder:"Write here...",
          max_width: 1000,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
            'image', 'table', 'link', 'lists'
          ],
          menu: {
            file: { title: 'File', items: 'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: 'View', items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: 'Insert', items: 'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
            format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
            tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            help: { title: 'Help', items: 'help' }
          },
          toolbar:
            'styles | bold italic underline strikethrough code | forecolor backcolor | align lineheight | bullist numlist outdent indent | removeformat | restoredraft help',
          toolbar_groups: {
            align: { icon: 'align-left', items: 'alignleft aligncenter alignright alignjustify' },
          },
          toolbar_sticky: true,
          images_file_types: 'jpg,jpeg,svg,webp',
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          /* and here's our custom image picker*/
          // file_picker_callback: (cb, value, meta) => {
          //   const input = document.createElement('input');
          //   input.setAttribute('type', 'file');
          //   input.setAttribute('accept', 'image/*');

          //   input.addEventListener('change', (e) => {
          //     const target = e.target as HTMLInputElement;
          //     if (target.files && target.files.length > 0) {
          //       const file = target.files[0];

          //       const reader = new FileReader();
          //       reader.addEventListener('load', () => {
          //         const id = 'blobid' + (new Date()).getTime();
          //         const blobCache = tinymce?.activeEditor.editorUpload.blobCache;
          //         const base64 = reader.result as string;
          //         const blobInfo = blobCache.create(id, file, base64.split(',')[1]);
          //         blobCache.add(blobInfo);

          //         cb(blobInfo.blobUri(), { title: file.name });
          //       });
          //       reader.readAsDataURL(file);
          //     }
          //   });

          //   input.click();
          // },
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};
