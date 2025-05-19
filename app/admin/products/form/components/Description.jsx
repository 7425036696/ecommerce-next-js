'use client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
});

export default function Description({ data, handleData }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Long Description</label>
      <ReactQuill
        theme="snow"
        value={data?.longDescription
           || ''}
        onChange={(value) => handleData('longDescription', value)}
        placeholder="Write product description here..."
      />
    </div>
  );
}
