import React from 'react';

import { FormControl, FormHelperText } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useFormContext, Controller } from 'react-hook-form';

export default function DropzoneField({
  name,
  multiple,
  children,
  fullWidth,
  dropzoneStyles = {},
  containerClassName,
  ...rest
}) {
  const { control, errors } = useFormContext();

  return (
    <FormControl fullWidth={fullWidth}>
      <Controller
        render={({ onChange }) => (
          <Dropzone
            multiple={multiple}
            containerClassName={containerClassName}
            dropzoneStyles={dropzoneStyles}
            onChange={e => onChange(multiple ? e.target.files : e.target.files[0])}
            {...rest}
          >
            {children}
          </Dropzone>
        )}
        name={name}
        control={control}
        defaultValue=''
      />
      <FormHelperText error={!!errors[name]} margin='dense' variant='outlined'>
        {errors && errors[name] && errors[name].message}
      </FormHelperText>
    </FormControl>
  );
}

function Dropzone({ multiple, onChange, dropzoneStyles, containerClassName, children, ...rest }) {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    multiple,
    ...rest,
  });

  const { baseStyle, activeStyle, acceptStyle, rejectStyle } = dropzoneStyles;

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept, baseStyle, activeStyle, acceptStyle, rejectStyle]
  );

  return (
    <div className='dropzone-outer'>
      <div {...getRootProps({ style })} className={containerClassName}>
        <input {...getInputProps({ onChange })} />
        {children}
      </div>
    </div>
  );
}
