import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const createPost: React.FC<{}> = ({ }) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          console.log(values);
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push('/');
          }

        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label='Title' name='title' placeholder='title' />
            <Box mt={4}>
              <InputField label='Body' name='text' placeholder='Your message here...' textarea />
            </Box>
            <Button mt={4} isLoading={isSubmitting} type='submit' variantColor='teal'>Create Post</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(createPost);