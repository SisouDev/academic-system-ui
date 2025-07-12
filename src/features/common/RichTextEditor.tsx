import { Editor } from '@tinymce/tinymce-react';
import {uploadFile} from "../../services/common/fileUploadService.ts";

const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

interface RichTextEditorProps {
    value: string;
    onEditorChange: (content: string) => void;
}

interface TinyMceBlobInfo {
    blob: () => Blob;
    base64: () => string;
    filename: () => string;
    uri: () => string;
}

export const RichTextEditor = ({ value, onEditorChange }: RichTextEditorProps) => {
    const imageUploadHandler = async (blobInfo: TinyMceBlobInfo, success: (url: string) => void, failure: (err: string) => void) => {
        try {
            const url = await uploadFile(blobInfo.blob());
            success(url);
        } catch (error) {
            console.error('Image upload failed:', error);
            if (error instanceof Error) {
                failure('Falha no upload da imagem: ' + error.message);
            } else {
                failure('Ocorreu um erro desconhecido no upload da imagem.');
            }
        }
    };
    return (
        <Editor
            apiKey={apiKey}
            value={value}
            onEditorChange={onEditorChange}
            init={{
                height: 300,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                    'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                images_upload_handler: imageUploadHandler,
                automatic_uploads: true,
                file_picker_types: 'image',
                content_style: 'body { font-family:Manrope,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
};