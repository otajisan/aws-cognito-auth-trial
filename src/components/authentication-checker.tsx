import {ReactNode} from "react";
import {useAuth} from "../hooks/use-auth";
import Router from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const AuthenticationChecker = ({children}: Props) => {
    const {isAuthenticated} = useAuth();

    const goToSignIn = async (e) => {
        e.preventDefault();
        await Router.push('/signin');
    }

    if (isAuthenticated) {
        return (<>{children}</>)
    } else {
        return (
            <div className={'flex m-4'}>
                <Box>
                    <div className={'mb-4'}><h1>Please Sign in.</h1></div>
                    <Button onClick={goToSignIn} variant={'outlined'}>
                        Go to Sign in page
                    </Button>
                </Box>
            </div>
        )
    }
}

type Props = {
    children?: ReactNode;
};

export default AuthenticationChecker;
