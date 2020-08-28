import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Wrapper } from '../components/Wrapper';
import { Formik, Form } from 'formik';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({ }) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);


  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => complete ? (<Box>
          If an account with that email exists, an email will be sent to that email.
        </Box>)
          : (
            <Form>
              <InputField label='Email' name='email' placeholder='email' type='email' />

              <Button mt={4} isLoading={isSubmitting} type='submit' variantColor='teal'>Forgot Password</Button>
            </Form>
          )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);