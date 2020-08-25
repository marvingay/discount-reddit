import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });
  let body = null;

  console.log("data: ", data);
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
          <Link >Register</Link>
        </NextLink>
      </>
    )
    // User is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={() => {
            logout();
          }}
          variant='link'>Logout</Button>
      </Flex>
    )
  }

  return (
    <Flex bg='tan' p={4} >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  );
}