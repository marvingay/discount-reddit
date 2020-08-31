import React from 'react';
import { Box, Link, Flex, Button, Heading } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;

  // data loading
  if (fetching) {
    // User not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>Register</Link>
        </NextLink>
      </>
    );
    // User is logged in
  } else {
    body = (
      <Flex align='center'>
        <NextLink href='/create-post'>
          <Button as={Link} mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            router.reload();
          }}
          variant='link'
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex align='center' bg='tan' p={4} position='sticky' top={0} zIndex={1}>
      <Flex align='center' flex={1} m='auto' maxW={800}>
        <NextLink href='/'>
          <Link>
            <Heading>Discount Reddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  );
};
