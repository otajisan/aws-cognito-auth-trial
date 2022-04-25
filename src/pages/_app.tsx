import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import Layout from '../components/layout';
import {ProvideAuth} from "../hooks/use-auth";
import Amplify from "aws-amplify";
import AwsConfigAuth from "../aws/auth";

//Amplify.configure({Auth: AwsConfigAuth, ssr: true});


function AwsCognitoAuthTrial({Component, pageProps}: AppProps) {
    return (
        <Layout>
            <ProvideAuth>
                <Component {...pageProps} />
            </ProvideAuth>
        </Layout>
    );
}

export default AwsCognitoAuthTrial;
