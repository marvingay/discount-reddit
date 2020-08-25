import React from 'react'
import { Formik, Form } from 'formik'
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';

interface registerProps {

}

const REGISTER_MUT = `
mutation Register($username: String!, $password:String! ) {
  register(options: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    
    user {
      id
      username
    }
  }
}
`

const Register: React.FC<registerProps> = ({ }) => {
  const [{ }, register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          return register(values);
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField label='Username' name='username' placeholder='username' />
            <Box mt={4}>
              <InputField label='Password' name='password' placeholder='password' type='password' />
            </Box>
            <Button mt={4} isLoading={isSubmitting} type='submit' variantColor='teal'>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register;