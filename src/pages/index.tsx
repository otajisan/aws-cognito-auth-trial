import {NextPage} from "next";
import {PropsWithChildren, useState} from "react";
import {useAuth} from "../hooks/use-auth";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Router from "next/router";
import Grid from "@mui/material/Grid";
import {Alert} from "@mui/material";
import AuthenticationChecker from "../components/authentication-checker";

const Welcome: NextPage = (props: PropsWithChildren<Props>) => {
    const auth = useAuth();
    const [isAuthFailed, setAuthFailed] = useState(false);

    const signOut = async (e) => {
        e.preventDefault();
        const result = await auth.signOut();
        if (result.success) {
            await Router.push('/signin');
        } else {
            setAuthFailed(true);
        }
    };

    return (
        <AuthenticationChecker>
            <div className={'flex m-4'}>
                <Box>
                    <div className={'mb-4'}><h1>Welcome {auth.username} !!</h1></div>
                    <div className={'mb-4'}><h3>Login: {auth.isAuthenticated ? 'signed in' : 'not signed in'}</h3></div>
                    <Button onClick={signOut} variant={'outlined'} disabled={auth.isLoading}>
                        Sign out
                    </Button>
                    <Grid container>
                        {isAuthFailed ? (<Alert severity="error">Failed to sign out...</Alert>) : (<></>)}
                    </Grid>
                </Box>
            </div>
        </AuthenticationChecker>
    );
};

type Props = {};

export default Welcome;
