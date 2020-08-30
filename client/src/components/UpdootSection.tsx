import React, { useState } from 'react';
import { Flex, IconButton } from '@chakra-ui/core';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [{}, vote] = useVoteMutation();

  return (
    <Flex align='center' direction='column' justify='center' mr={4}>
      <IconButton
        aria-label='upvote post'
        icon='chevron-up'
        isLoading={loadingState === 'updoot-loading'}
        onClick={async () => {
          setLoadingState('updoot-loading');
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState('not-loading');
        }}
      />
      {post.points}
      <IconButton
        aria-label='downvote post'
        icon='chevron-down'
        isLoading={loadingState === 'downdoot-loading'}
        onClick={async () => {
          setLoadingState('downdoot-loading');
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState('not-loading');
        }}
      />
    </Flex>
  );
};

export default UpdootSection;
