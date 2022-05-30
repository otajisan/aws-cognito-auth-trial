import {NextPage} from "next";
import React, {PropsWithChildren, useState} from "react";
import {useAuth} from "../hooks/use-auth";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Router from "next/router";
import Grid from "@mui/material/Grid";
import {Alert, CircularProgress, Stack} from "@mui/material";
import {useGreetingMessage} from "../hooks/use-greeting-message";

const Welcome: NextPage = (props: PropsWithChildren<Props>) => {
  const auth = useAuth();
  const [isAuthFailed, setAuthFailed] = useState(false);

  const {isLoading, isError, errorMessage, greetingMessage} = useGreetingMessage(auth.username);

  const signOut = async (e: any) => {
    e.preventDefault();
    const result = await auth.signOut();
    if (result.success) {
      await Router.push('/signin');
    } else {
      setAuthFailed(true);
    }
  };

  if (isLoading) {
    return (
      <Stack sx={{color: 'grey.500'}} spacing={2} direction="row">
        <CircularProgress color="secondary"/>
      </Stack>
    );
  }

  return (
    <div className={'flex m-4'}>
      <Box>
        <div className={'mb-4'}><h1>{greetingMessage?.message}</h1></div>
        <div className={'mb-4'}><h3>Login: {auth.isAuthenticated ? 'signed in' : 'not signed in'}</h3></div>

        <Button onClick={signOut} variant={'outlined'} disabled={auth.isLoading}>
          Sign out
        </Button>
        <Grid container>
          {isAuthFailed ? (<Alert severity="error">Failed to sign out...</Alert>) : (<></>)}
          {isError ? (<Alert severity="error">{errorMessage}</Alert>) : (<></>)}
        </Grid>
      </Box>
    </div>
  );
};

type Props = {};

export default Welcome;
