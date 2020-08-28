import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Link, Flex } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link'

const Login: React.FC<{}> = ({ }) => {
  const router = useRouter()
  const [{ }, login] = useLoginMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }

          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label='Username or Email' name='usernameOrEmail' placeholder='Username or Email' />
            <Box mt={4}>
              <InputField label='Password' name='password' placeholder='password' type='password' />
            </Box>
            <Flex >
              <NextLink href='/forgot-password'>
                <Link ml={'auto'}>Forgot Password?</Link>
              </NextLink>
            </Flex>
            <Button mt={4} isLoading={isSubmitting} type='submit' variantColor='teal'>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login);