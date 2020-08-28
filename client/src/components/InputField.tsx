import React, { InputHTMLAttributes } from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/core';
import { useField } from 'formik';
import { _GraphQLList } from 'graphql/type/definition';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string,
  name: string,
  textarea?: boolean,
};

export const InputField: React.FC<InputFieldProps> = ({ label, textarea, size, ...props }) => {
  let InputOrTextarea = Input
  if (textarea) {
    InputOrTextarea = Textarea
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}