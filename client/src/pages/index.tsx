import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import Layout from '../components/Layout';
import UpdootSection from '../components/UpdootSection';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        We got nothin' for ya. Somethin' went wrong. Mistakes were made.
      </div>
    );
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
                <Flex>
                  <Box>
                    <UpdootSection post={p} />
                  </Box>
                  <Box flex={1}>
                    <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize='xl'>{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>posted by {p.creator.username}</Text>
                    <Flex align='center'>
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      <Box ml='auto'>
                        <EditDeletePostButtons
                          creatorId={p.creator.id}
                          id={p.id}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            )
          )}
        </Stack>
      )}
      {/* Only show Load More button for pagination if data AND not at end*/}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m='auto'
            my={8}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
