import React from 'react';

import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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

const dropzoneStyles = {
  baseStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border .24s ease-in-out',
  },

  activeStyle: {
    borderColor: '#2196f3',
  },

  acceptStyle: {
    borderColor: '#00e676',
  },

  rejectStyle: {
    borderColor: '#ff1744',
  },
};

export function ProductThumbnailUploadField({ name }) {
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
        <img alt={`product-preview-${file.name}`} src={file.preview} style={thumbImgStyle} />
      </div>
    </div>
  ));

  React.useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div style={{ marginTop: '1rem' }}>
      <FormDropzone name={name} accept='image/*' onDrop={onDrop}>
        <Button variant='contained'>Upload Product Thumbnail</Button>
      </FormDropzone>
      <aside style={thumbsContainerStyle}>{thumbs}</aside>
    </div>
  );
}

export function ProductImagesDropzoneField({ name }) {
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
        <img alt={`product-preview-${file.name}`} src={file.preview} style={thumbImgStyle} />
      </div>
    </div>
  ));

  React.useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div>
      <FormDropzone name={name} multiple accept='image/*' onDrop={onDrop} dropzoneStyles={dropzoneStyles} fullWidth>
        <CloudUploadIcon />
        <p>Drag 'n' drop some files here</p>
        <p style={{ margin: 0, padding: 0 }}>or click to select files</p>
      </FormDropzone>
      <aside style={thumbsContainerStyle}>{thumbs}</aside>
    </div>
  );
}
