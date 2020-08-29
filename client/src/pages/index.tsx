import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link";
import { useState } from 'react';
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 33, cursor: null as null | string });
  const [{ data, fetching }] = usePostsQuery({
    variables
  });

  if (!fetching && !data) {
    return <div>We got nothin' for ya. Somethin' went wrong. Mistakes were made.</div>
  }

  return (
    <Layout>
      <Flex align='center'>
        <Heading>Discount Reddit</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>
            Create Post
        </Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? <div>loading...</div> : (
        <Stack spacing={8}>
          {data!.posts.posts.map(p => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px" >
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {/* Only show Load More button for pagination if data AND not at end*/}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button m='auto' my={8} onClick={() => {
            setVariables(
              {
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
              }
            )
          }}>Load more</Button>
        </Flex>) : null}
    </Layout>

  )
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
