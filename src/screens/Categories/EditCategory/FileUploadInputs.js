import React from 'react';

import { Button } from '@material-ui/core';

import { FormDropzone } from '../../../components/Form';

const thumbsContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 4,
};

const thumbStyle = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInnerStyle = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const thumbImgStyle = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

export function CategoryLogoUploadField({ name }) {
  const [files, setFiles] = React.useState([]);

  const onDrop = acceptedFiles => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  const thumbs = files.map(file => (
    <div style={thumbStyle} key={file.name}>
      <div style={thumbInnerStyle}>
        <img alt={`category-preview-${file.name}`} src={file.preview} style={thumbImgStyle} />
      </div>
    </div>
  ));

  React.useEffect(
    () => () => {
      // Revoke the data URIs' to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div style={{ marginTop: '1rem' }}>
      <FormDropzone name={name} accept='image/*' onDrop={onDrop}>
        <Button variant='contained'>Upload Category Thumbnail</Button>
      </FormDropzone>
      <aside style={thumbsContainerStyle}>{thumbs}</aside>
    </div>
  );
}
