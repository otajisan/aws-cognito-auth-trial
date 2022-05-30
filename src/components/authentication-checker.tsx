import {ReactNode} from "react";
import {useAuth} from "../hooks/use-auth";
import Router, {useRouter} from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const AuthenticationChecker = ({children}: Props) => {
  const {isAuthenticated, isSignedIn} = useAuth();
  const router = useRouter()
  const currentPage = router.pathname

  const goToSignIn = async (e: any) => {
    e.preventDefault();
    await router.push('/signin');
  }

  if (isAuthenticated) {
    return (<>{children}</>);
  }

  if (currentPage === '/signin') {
    return (<>{children}</>);
  }

  if (isSignedIn && currentPage === '/password/new') {
    return (<>{children}</>);
  }

  if (currentPage === '/password/forgot') {
    return (<>{children}</>);
  }

  if (currentPage === '/password/forgot-submit') {
    return (<>{children}</>);
  }

  return (
    <div className={'flex m-4'}>
      <Box>
        <div className={'mb-4'}><h1>Please Sign in.</h1></div>
        <Button onClick={goToSignIn} variant={'outlined'}>
          Go to Sign in page
        </Button>
      </Box>
    </div>
  );
}

type Props = {
  children?: ReactNode;
};

export default AuthenticationChecker;
