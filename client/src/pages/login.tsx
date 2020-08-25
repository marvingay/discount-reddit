import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Login: React.FC<{}> = ({ }) => {
  const router = useRouter()
  const [{ }, login] = useLoginMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            // Successful registration
            router.push('/');

          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label='Username' name='username' placeholder='username' />
            <Box mt={4}>
              <InputField label='Password' name='password' placeholder='password' type='password' />
            </Box>
            <Button mt={4} isLoading={isSubmitting} type='submit' variantColor='teal'>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login);