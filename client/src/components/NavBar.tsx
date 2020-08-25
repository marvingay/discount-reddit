import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ data, fetching }] = useMeQuery();
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
          <Link >Register</Link>
        </NextLink>
      </>
    )
    // User is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant='link'>Logout</Button>
      </Flex>
    )
  }

  return (
    <Flex bg='tomato' p={4} >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  );
}